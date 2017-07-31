import {
    Component, Input, Output, EventEmitter, ViewChild, ElementRef,
    Renderer, forwardRef, OnChanges, SimpleChanges
} from '@angular/core';
import {
    NG_VALUE_ACCESSOR, NG_VALIDATORS, Validator, AbstractControl,
    ValidatorFn, ControlValueAccessor, Validators
} from '@angular/forms';
import * as numeral from 'numeral';
import * as _ from 'lodash';

const numericRegex = /^-?(?:(?:\d+(\.\d*)?)|(?:\.\d*))?$/;

const keyCodes = {
    left: 37,
    up: 38,
    right: 39,
    down: 40
};

const Helper = {
    isNumber(value: any): boolean {
        return !_.isNil(value) && !_.isNaN(value);
    },
    anyChanges(properties: string[], changes: SimpleChanges): boolean {
        for (const property of properties) {
            if (changes[property] !== undefined) {
                return true;
            }
        }

        return false;
    }
};

export function createMinValidator(min: number): ValidatorFn {
    return (control: AbstractControl) => {
        if (Helper.isNumber(control.value) && control.value < min) {
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

export function createMaxValidator(max: number): ValidatorFn {
    return (control: AbstractControl) => {
        if (Helper.isNumber(control.value) && control.value > max) {
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

@Component({
    selector: 'ngx-numeric-textbox',
    templateUrl: './numeric-textbox.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => NumericTextboxComponent),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => NumericTextboxComponent),
            multi: true
        }
    ],
    exportAs: 'ngxNumericTextbox'
})
export class NumericTextboxComponent implements ControlValueAccessor, Validator, OnChanges {
    @ViewChild('numericInput') numericInput: ElementRef;
    @Input() min = Number.MIN_SAFE_INTEGER;
    @Input() max = Number.MAX_SAFE_INTEGER;
    @Input() value: number;
    @Input() placeholder: string;
    @Input() decimals = 2;
    @Input() disabled = false;
    @Input() format = '0,0.00';
    @Input() autoCorrect = false;
    @Output() valueChange = new EventEmitter<number>();
    private minValidateFn = Validators.nullValidator;
    private maxValidateFn = Validators.nullValidator;
    private focused = false;
    private inputValue: string;
    private previousValue = undefined;
    private ngChange = (value: number) => { };
    private ngTouched = () => { };

    constructor(
        private renderer: Renderer
    ) { }

    validate(control: AbstractControl): { [key: string]: any } {
        return this.minValidateFn(control) || this.maxValidateFn(control);
    }

    writeValue(value: number) {
        const newValue = this.restrictModelValue(value);
        this.value = newValue;
        this.setInputValue();
    }

    registerOnChange(fn: any) {
        this.ngChange = fn;
    }

    registerOnTouched(fn: any) {
        this.ngTouched = fn;
    }

    ngOnChanges(changes: SimpleChanges) {
        this.verifySettings();

        if (Helper.anyChanges(['min'], changes)) {
            if (Helper.isNumber(this.min)) {
                this.minValidateFn = createMinValidator(this.min);
            } else {
                this.minValidateFn = Validators.nullValidator;
            }
        }

        if (Helper.anyChanges(['max'], changes)) {
            if (Helper.isNumber(this.max)) {
                this.maxValidateFn = createMaxValidator(this.max);
            } else {
                this.maxValidateFn = Validators.nullValidator;
            }
        }

        let invokeSetInputValue = false;
        if (this.previousValue === undefined) {
            if (Helper.anyChanges(['value'], changes)) {
                const valueChange = changes['value'];
                if (valueChange.isFirstChange || valueChange.previousValue !== this.previousValue) {
                    invokeSetInputValue = true;
                }
            }
        } else {
            this.previousValue = undefined;
        }

        if (!invokeSetInputValue && Helper.anyChanges(['format'], changes)) {
            invokeSetInputValue = true;
        }

        if (invokeSetInputValue) {
            this.setInputValue();
        }
    }

    handleInput() {
        const element: HTMLInputElement = this.numericInput.nativeElement;
        const selectionStart = element.selectionStart;
        const selectionEnd = element.selectionEnd;
        const value = element.value;
        if (!this.isValidInput(value)) {
            element.value = this.inputValue;
            this.setSelection(selectionStart - 1, selectionEnd - 1);
        } else {
            const orginalInputValue = this.parseNumber(value);
            let limitInputValue = this.restrictDecimals(orginalInputValue);
            if (this.autoCorrect) {
                limitInputValue = this.limitValue(limitInputValue);
            }

            if (orginalInputValue !== limitInputValue) {
                this.setInputValue(limitInputValue);
                this.setSelection(selectionStart, selectionEnd);
            } else {
                this.inputValue = value;
            }

            this.updateValue(limitInputValue);
        }
    }

    handleFocus() {
        if (!this.focused) {
            this.focused = true;
            this.setInputValue();
            setTimeout(() => this.setSelection(0, this.inputValue.length));
        }
    }

    handleBlur() {
        if (this.focused) {
            this.focused = false;
            this.ngTouched();
            this.setInputValue();
        }
    }

    handleKeyDown(event: KeyboardEvent) {
        if (!this.disabled) {
            let step = 0;
            if (event.keyCode === keyCodes.down) {
                step = -1;
            } else if (event.keyCode === keyCodes.up) {
                step = 1;
            }

            if (step !== 0) {
                this.addStep(step);
            }
        }
    }

    private verifySettings() {
        if (Helper.isNumber(this.min) && Helper.isNumber(this.max) && this.min > this.max) {
            throw new Error('The max value should be bigger than the min');
        }
    }

    private isValidInput(input: string) {
        return numericRegex.test(input);
    }

    private parseNumber(input: string): number {
        return numeral(input).value();
    }

    private addStep(step: number) {
        let value = this.value ? step + this.value : step;
        value = this.limitValue(value);
        value = this.restrictDecimals(value);
        this.setInputValue(value);
        this.updateValue(value);
    }

    private limitValue(value: number): number {
        if (Helper.isNumber(this.max) && value > this.max) {
            return this.max;
        }

        if (Helper.isNumber(this.min) && value < this.min) {
            return this.min;
        }

        return value;
    }

    private isInRange(value: number): boolean {
        if (Helper.isNumber(value)) {
            if (Helper.isNumber(this.min) && value < this.min) {
                return false;
            }

            if (Helper.isNumber(this.max) && value > this.max) {
                return false;
            }
        }

        return true;
    }

    private restrictModelValue(value: number): number {
        let newValue = this.restrictDecimals(value);
        if (this.autoCorrect && this.limitValue(newValue) !== newValue) {
            newValue = null;
        }

        return newValue;
    }

    private restrictDecimals(value: number): number {
        if (Helper.isNumber(this.decimals) && this.decimals > 0) {
            const words = String(value).split('.');
            if (words.length === 2) {
                const decimalPart = words[1];
                if (decimalPart.length > this.decimals) {
                    value = parseFloat(words[0] + '.' + decimalPart.substr(0, this.decimals));
                }
            }
        }

        return value;
    }

    private setInputValue(value: number = null) {
        if (_.isNil(value)) {
            value = this.value;
        }
        const inputValue = this.formatValue(value);
        this.renderer.setElementProperty(this.numericInput.nativeElement, 'value', inputValue);
        this.inputValue = inputValue;
    }

    private updateValue(value: number) {
        if (this.value !== value) {
            this.previousValue = this.value;
            this.value = value;
            this.ngChange(value);
            this.valueChange.emit(value);
        }
    }

    private formatValue(value: number): string {
        if (!_.isNil(value)) {
            if (this.focused) {
                return this.formatInputValue(value);
            } else {
                return this.formatNumber(value);
            }
        }

        return '';
    }

    private formatInputValue(value: number): string {
        return String(value);
    }

    private formatNumber(value: number): string {
        return numeral(value).format(this.format);
    }

    private setSelection(start: number, end: number) {
        this.renderer.invokeElementMethod(this.numericInput.nativeElement, 'setSelectionRange', [start, end]);
    }
}
