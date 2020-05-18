import { Component, ElementRef, EventEmitter, forwardRef, Input, Output, Renderer2, ViewChild } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import * as numeral from 'numeral';
import * as _ from 'lodash';
import * as i0 from "@angular/core";
var _c0 = ["numericInput"];
var keyCodes = {
    enter: 13,
    escape: 27,
    left: 37,
    up: 38,
    right: 39,
    down: 40
};
var Helper = {
    anyChanges: function (properties, changes) {
        for (var _i = 0, properties_1 = properties; _i < properties_1.length; _i++) {
            var property = properties_1[_i];
            if (changes[property] !== undefined) {
                return true;
            }
        }
        return false;
    },
    createNumericRegex: function (hasDecimal, hasSign) {
        var regexString = '^';
        if (hasSign) {
            regexString += '-?';
        }
        regexString += '(?:(?:\\d+';
        if (hasDecimal) {
            regexString += '(\\.\\d*)?';
        }
        regexString += ')|(?:\\.\\d*))?$';
        return new RegExp(regexString);
    }
};
export function createMinValidator(min) {
    return function (control) {
        if (_.isNumber(control.value) && control.value < min) {
            return {
                minError: {
                    minValue: min,
                    value: control.value
                }
            };
        }
        return null;
    };
}
export function createMaxValidator(max) {
    return function (control) {
        if (_.isNumber(control.value) && control.value > max) {
            return {
                maxError: {
                    maxValue: max,
                    value: control.value
                }
            };
        }
        return null;
    };
}
var NumericTextboxComponent = /** @class */ (function () {
    function NumericTextboxComponent(renderer2) {
        this.renderer2 = renderer2;
        this.min = Number.MIN_SAFE_INTEGER;
        this.max = Number.MAX_SAFE_INTEGER;
        this.decimals = 2;
        this.disabled = false;
        this.format = '0,0.00';
        this.autoCorrect = false;
        this.rangeValidation = true;
        this.valueChange = new EventEmitter();
        this.focus = new EventEmitter();
        this.blur = new EventEmitter();
        this.enter = new EventEmitter();
        this.escape = new EventEmitter();
        this.minValidateFn = Validators.nullValidator;
        this.maxValidateFn = Validators.nullValidator;
        this.focused = false;
        this.previousValue = undefined;
        this.ngChange = function (value) { };
        this.ngTouched = function () { };
    }
    NumericTextboxComponent.prototype.focusInput = function () {
        this.numericInput.nativeElement.focus();
    };
    NumericTextboxComponent.prototype.blurInput = function () {
        this.numericInput.nativeElement.blur();
    };
    NumericTextboxComponent.prototype.validate = function (control) {
        return this.minValidateFn(control) || this.maxValidateFn(control);
    };
    NumericTextboxComponent.prototype.writeValue = function (value) {
        var newValue = this.restrictModelValue(value);
        this.value = newValue;
        this.setInputValue();
    };
    NumericTextboxComponent.prototype.registerOnChange = function (fn) {
        this.ngChange = fn;
    };
    NumericTextboxComponent.prototype.registerOnTouched = function (fn) {
        this.ngTouched = fn;
    };
    NumericTextboxComponent.prototype.setDisabledState = function (isDisabled) {
        this.disabled = isDisabled;
    };
    NumericTextboxComponent.prototype.ngOnChanges = function (changes) {
        this.verifySettings();
        if (Helper.anyChanges(['autoCorrect', 'decimals'], changes)) {
            delete this.numericRegex;
        }
        if (Helper.anyChanges(['min', 'max', 'rangeValidation'], changes)) {
            if (_.isNumber(this.min) && this.rangeValidation) {
                this.minValidateFn = createMinValidator(this.min);
            }
            else {
                this.minValidateFn = Validators.nullValidator;
            }
            if (_.isNumber(this.max) && this.rangeValidation) {
                this.maxValidateFn = createMaxValidator(this.max);
            }
            else {
                this.maxValidateFn = Validators.nullValidator;
            }
            this.ngChange(this.value);
        }
        if (Helper.anyChanges(['format'], changes)) {
            this.setInputValue();
        }
    };
    NumericTextboxComponent.prototype.handleInput = function () {
        var element = this.numericInput.nativeElement;
        var selectionStart = element.selectionStart;
        var selectionEnd = element.selectionEnd;
        var value = element.value;
        if (!this.isValidInput(value)) {
            element.value = this.inputValue;
            this.setSelection(selectionStart - 1, selectionEnd - 1);
        }
        else {
            var orginalInputValue = this.parseNumber(value);
            var limitInputValue = this.restrictDecimals(orginalInputValue);
            if (this.autoCorrect) {
                limitInputValue = this.limitValue(limitInputValue);
            }
            if (orginalInputValue !== limitInputValue) {
                this.setInputValue(limitInputValue);
                this.setSelection(selectionStart, selectionEnd);
            }
            else {
                this.inputValue = value;
            }
            this.updateValue(limitInputValue);
        }
    };
    NumericTextboxComponent.prototype.handleFocus = function () {
        var _this = this;
        if (!this.focused) {
            this.focused = true;
            this.setInputValue();
            setTimeout(function () { return _this.setSelection(0, _this.inputValue.length); });
        }
        this.focus.emit();
    };
    NumericTextboxComponent.prototype.handleBlur = function () {
        if (this.focused) {
            this.focused = false;
            this.ngTouched();
            this.setInputValue();
        }
        this.blur.emit();
    };
    NumericTextboxComponent.prototype.handleKeyDown = function (event) {
        if (!this.disabled) {
            switch (event.which) {
                case keyCodes.down:
                    this.addStep(-1);
                    break;
                case keyCodes.up:
                    this.addStep(1);
                    break;
                case keyCodes.enter:
                    this.enter.emit();
                    break;
                case keyCodes.escape:
                    this.escape.emit();
                    break;
            }
        }
    };
    NumericTextboxComponent.prototype.verifySettings = function () {
        if (_.isNumber(this.min) && _.isNumber(this.max) && this.min > this.max) {
            throw new Error('The max value should be bigger than the min value');
        }
        if (_.isNumber(this.decimals) && this.decimals < 0) {
            throw new Error('The decimals value should be bigger than 0');
        }
    };
    NumericTextboxComponent.prototype.isValidInput = function (input) {
        var numericRegex = this.numericRegex;
        if (_.isNil(numericRegex)) {
            var hasDecimal = true;
            if (_.isNumber(this.decimals) && this.decimals === 0) {
                hasDecimal = false;
            }
            var hasSign = true;
            if (_.isNumber(this.min) && this.min >= 0 && this.autoCorrect) {
                hasSign = false;
            }
            numericRegex = Helper.createNumericRegex(hasDecimal, hasSign);
        }
        return numericRegex.test(input);
    };
    NumericTextboxComponent.prototype.parseNumber = function (input) {
        return numeral(input).value();
    };
    NumericTextboxComponent.prototype.addStep = function (step) {
        var value = this.value ? step + this.value : step;
        value = this.limitValue(value);
        value = this.restrictDecimals(value);
        this.setInputValue(value);
        this.updateValue(value);
    };
    NumericTextboxComponent.prototype.limitValue = function (value) {
        if (_.isNumber(this.max) && value > this.max) {
            return this.max;
        }
        if (_.isNumber(this.min) && value < this.min) {
            return this.min;
        }
        return value;
    };
    NumericTextboxComponent.prototype.isInRange = function (value) {
        if (_.isNumber(value)) {
            if (_.isNumber(this.min) && value < this.min) {
                return false;
            }
            if (_.isNumber(this.max) && value > this.max) {
                return false;
            }
        }
        return true;
    };
    NumericTextboxComponent.prototype.restrictModelValue = function (value) {
        var newValue = this.restrictDecimals(value);
        if (this.autoCorrect && this.limitValue(newValue) !== newValue) {
            newValue = null;
        }
        return newValue;
    };
    NumericTextboxComponent.prototype.restrictDecimals = function (value) {
        if (_.isNumber(this.decimals)) {
            var words = String(value).split('.');
            if (words.length === 2) {
                var decimalPart = words[1];
                if (decimalPart.length > this.decimals) {
                    value = parseFloat(words[0] + '.' + decimalPart.substr(0, this.decimals));
                }
            }
        }
        return value;
    };
    NumericTextboxComponent.prototype.setInputValue = function (value) {
        if (value === void 0) { value = null; }
        if (_.isNil(value)) {
            value = this.value;
        }
        var inputValue = this.formatValue(value);
        this.renderer2.setProperty(this.numericInput.nativeElement, 'value', inputValue);
        this.inputValue = inputValue;
    };
    NumericTextboxComponent.prototype.updateValue = function (value) {
        if (this.value !== value) {
            this.previousValue = this.value;
            this.value = value;
            this.ngChange(value);
            this.valueChange.emit(value);
        }
    };
    NumericTextboxComponent.prototype.formatValue = function (value) {
        if (!_.isNil(value)) {
            if (this.focused) {
                return this.formatInputValue(value);
            }
            else {
                return this.formatNumber(value);
            }
        }
        return '';
    };
    NumericTextboxComponent.prototype.formatInputValue = function (value) {
        return String(value);
    };
    NumericTextboxComponent.prototype.formatNumber = function (value) {
        return numeral(value).format(this.format);
    };
    NumericTextboxComponent.prototype.setSelection = function (start, end) {
        this.numericInput.nativeElement.setSelectionRange(start, end);
    };
    NumericTextboxComponent.ɵfac = function NumericTextboxComponent_Factory(t) { return new (t || NumericTextboxComponent)(i0.ɵɵdirectiveInject(i0.Renderer2)); };
    NumericTextboxComponent.ɵcmp = i0.ɵɵdefineComponent({ type: NumericTextboxComponent, selectors: [["ngx-numeric-textbox"]], viewQuery: function NumericTextboxComponent_Query(rf, ctx) { if (rf & 1) {
            i0.ɵɵviewQuery(_c0, true);
        } if (rf & 2) {
            var _t;
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.numericInput = _t.first);
        } }, inputs: { min: "min", max: "max", value: "value", placeholder: "placeholder", decimals: "decimals", disabled: "disabled", format: "format", autoCorrect: "autoCorrect", rangeValidation: "rangeValidation" }, outputs: { valueChange: "valueChange", focus: "focus", blur: "blur", enter: "enter", escape: "escape" }, exportAs: ["ngxNumericTextbox"], features: [i0.ɵɵProvidersFeature([
                {
                    provide: NG_VALUE_ACCESSOR,
                    useExisting: forwardRef(function () { return NumericTextboxComponent; }),
                    multi: true
                },
                {
                    provide: NG_VALIDATORS,
                    useExisting: forwardRef(function () { return NumericTextboxComponent; }),
                    multi: true
                }
            ]), i0.ɵɵNgOnChangesFeature], decls: 2, vars: 2, consts: [["type", "text", 1, "form-control", 3, "disabled", "input", "focus", "blur", "keydown"], ["numericInput", ""]], template: function NumericTextboxComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "input", 0, 1);
            i0.ɵɵlistener("input", function NumericTextboxComponent_Template_input_input_0_listener() { return ctx.handleInput(); })("focus", function NumericTextboxComponent_Template_input_focus_0_listener() { return ctx.handleFocus(); })("blur", function NumericTextboxComponent_Template_input_blur_0_listener() { return ctx.handleBlur(); })("keydown", function NumericTextboxComponent_Template_input_keydown_0_listener($event) { return ctx.handleKeyDown($event); });
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵproperty("disabled", ctx.disabled);
            i0.ɵɵattribute("placeholder", ctx.placeholder);
        } }, encapsulation: 2 });
    return NumericTextboxComponent;
}());
export { NumericTextboxComponent };
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(NumericTextboxComponent, [{
        type: Component,
        args: [{
                selector: 'ngx-numeric-textbox',
                template: "\n    <input type=\"text\" class=\"form-control\" [attr.placeholder]=\"placeholder\" [disabled]=\"disabled\" (input)=\"handleInput()\" (focus)=\"handleFocus()\"\n        (blur)=\"handleBlur()\" (keydown)=\"handleKeyDown($event)\" #numericInput />\n  ",
                providers: [
                    {
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: forwardRef(function () { return NumericTextboxComponent; }),
                        multi: true
                    },
                    {
                        provide: NG_VALIDATORS,
                        useExisting: forwardRef(function () { return NumericTextboxComponent; }),
                        multi: true
                    }
                ],
                exportAs: 'ngxNumericTextbox'
            }]
    }], function () { return [{ type: i0.Renderer2 }]; }, { numericInput: [{
            type: ViewChild,
            args: ['numericInput']
        }], min: [{
            type: Input
        }], max: [{
            type: Input
        }], value: [{
            type: Input
        }], placeholder: [{
            type: Input
        }], decimals: [{
            type: Input
        }], disabled: [{
            type: Input
        }], format: [{
            type: Input
        }], autoCorrect: [{
            type: Input
        }], rangeValidation: [{
            type: Input
        }], valueChange: [{
            type: Output
        }], focus: [{
            type: Output
        }], blur: [{
            type: Output
        }], enter: [{
            type: Output
        }], escape: [{
            type: Output
        }] }); })();
//# sourceMappingURL=numeric-textbox.component.js.map