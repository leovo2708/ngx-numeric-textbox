import { Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'ngx-custom',
    templateUrl: './custom.component.html'
})
export class CustomComponent implements OnChanges {
    @Input() value: number;
    @Output() valueChange = new EventEmitter<number>();
    private emitted = false;

    ngOnChanges() {
        if (!this.emitted) {
            this.valueChange.emit(this.value);
        }

        this.emitted = false;
    }

    onValueChange(value: number) {
        this.emitted = true;
        this.valueChange.emit(value);
    }
}
