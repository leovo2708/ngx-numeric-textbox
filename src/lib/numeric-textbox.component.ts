import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validator, ValidatorFn, Validators} from '@angular/forms';
import * as numeral from 'numeral';
import * as _ from 'lodash';

const keyCodes = {
  enter: 13,
  escape: 27,
  left: 37,
  up: 38,
  right: 39,
  down: 40
};

const Helper = {
  anyChanges(properties: string[], changes: SimpleChanges): boolean {
    for (const property of properties) {
      if (changes[property] !== undefined) {
        return true;
      }
    }

    return false;
  },
  createNumericRegex(hasDecimal: boolean, hasSign: boolean): RegExp {
    let regexString = '^';
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

export const createMinValidator = (min: number): ValidatorFn => {
  return (control: AbstractControl) => {
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
};

export const createMaxValidator = (max: number): ValidatorFn => {
  return (control: AbstractControl) => {
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
};

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
  @ViewChild('numericInput', {static: true}) numericInput: ElementRef;
  @Input() min = Number.MIN_SAFE_INTEGER;
  @Input() max = Number.MAX_SAFE_INTEGER;
  @Input() value: number;
  @Input() placeholder: string;
  @Input() decimals = 2;
  @Input() disabled = false;
  @Input() format = '0,0.00';
  @Input() autoCorrect = false;
  @Input() rangeValidation = true;
  @Output() valueChange = new EventEmitter<number>();
  @Output() focus = new EventEmitter();
  @Output() blur = new EventEmitter();
  @Output() enter = new EventEmitter();
  @Output() escape = new EventEmitter();
  private minValidateFn = Validators.nullValidator;
  private maxValidateFn = Validators.nullValidator;
  private focused = false;
  private inputValue: string;
  private previousValue = undefined;
  private numericRegex: RegExp;
  private ngChange = (value: number) => { };
  private ngTouched = () => { };

  constructor(
    private renderer2: Renderer2
  ) { }

  focusInput() {
    this.numericInput.nativeElement.focus();
  }

  blurInput() {
    this.numericInput.nativeElement.blur();
  }

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

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.verifySettings();

    if (Helper.anyChanges(['autoCorrect', 'decimals'], changes)) {
      delete this.numericRegex;
    }

    if (Helper.anyChanges(['min', 'max', 'rangeValidation'], changes)) {
      if (_.isNumber(this.min) && this.rangeValidation) {
        this.minValidateFn = createMinValidator(this.min);
      } else {
        this.minValidateFn = Validators.nullValidator;
      }

      if (_.isNumber(this.max) && this.rangeValidation) {
        this.maxValidateFn = createMaxValidator(this.max);
      } else {
        this.maxValidateFn = Validators.nullValidator;
      }

      this.ngChange(this.value);
    }

    if (Helper.anyChanges(['format'], changes)) {
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
    this.focus.emit();
  }

  handleBlur() {
    if (this.focused) {
      this.focused = false;
      this.ngTouched();
      this.setInputValue();
    }
    this.blur.emit();
  }

  handleKeyDown(event: KeyboardEvent) {
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
  }

  private verifySettings() {
    if (_.isNumber(this.min) && _.isNumber(this.max) && this.min > this.max) {
      throw new Error('The max value should be bigger than the min value');
    }

    if (_.isNumber(this.decimals) && this.decimals < 0) {
      throw new Error('The decimals value should be bigger than 0');
    }
  }

  private isValidInput(input: string) {
    let numericRegex = this.numericRegex;
    if (_.isNil(numericRegex)) {
      let hasDecimal = true;
      if (_.isNumber(this.decimals) && this.decimals === 0) {
        hasDecimal = false;
      }

      let hasSign = true;
      if (_.isNumber(this.min) && this.min >= 0 && this.autoCorrect) {
        hasSign = false;
      }

      numericRegex = Helper.createNumericRegex(hasDecimal, hasSign);
    }

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
    if (_.isNumber(this.max) && value > this.max) {
      return this.max;
    }

    if (_.isNumber(this.min) && value < this.min) {
      return this.min;
    }

    return value;
  }

  private isInRange(value: number): boolean {
    if (_.isNumber(value)) {
      if (_.isNumber(this.min) && value < this.min) {
        return false;
      }

      if (_.isNumber(this.max) && value > this.max) {
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
    if (_.isNumber(this.decimals)) {
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
    this.renderer2.setProperty(this.numericInput.nativeElement, 'value', inputValue);
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
    this.numericInput.nativeElement.setSelectionRange(start, end);
  }
}
