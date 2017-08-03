import { Component } from '@angular/core';

@Component({
    selector: 'ngx-basic',
    templateUrl: './basic.component.html',
    styleUrls: ['./basic.component.scss']
})
export class BasicComponent {
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

    onModelChange() {
        this.eventLog = 'ngModelChange';
    }

    doubleCustom() {
        this.customValue = this.customValue * 2;
    }

    onValueChange(value: number) {
        console.log(value);
    }
}
