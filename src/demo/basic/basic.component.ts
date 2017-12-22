import { Component, ViewChild } from '@angular/core';
import { NumericTextboxComponent } from '../../lib';

@Component({
    selector: 'ngx-basic',
    templateUrl: './basic.component.html',
    styleUrls: ['./basic.component.scss']
})
export class BasicComponent {
    @ViewChild(NumericTextboxComponent) component: NumericTextboxComponent;
    min = -1000;
    max = 1000;
    disabled = false;
    autoCorrect = false;
    decimals = 3;
    value = 10;
    placeholder = 'Input your number';
    format = '$ 0,0.000';
    rangeValidation = true;
    eventLog: string;
    customValue = 1;

    onFocus() {
        this.eventLog = 'focus';
    }

    onBlur() {
        this.eventLog = 'blur';
    }

    onEnter() {
        this.eventLog = 'enter';
    }

    onEscape() {
        this.eventLog = 'escape';
    }

    onModelChange() {
        this.eventLog = 'ngModelChange';
    }

    doubleValue() {
        this.value = this.value * 2;
    }

    onValueChange(value: number) {
        console.log(value);
    }

    focus() {
        this.component.focusInput();
    }

    blur() {
        this.component.blurInput();
    }
}
