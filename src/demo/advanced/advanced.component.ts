import { Component } from '@angular/core';

@Component({
    selector: 'ngx-advanced',
    templateUrl: './advanced.component.html'
})
export class AdvancedComponent {
    blackLimit;
    greyLimit;
    orangeLimit = 1;
    yellowLimit = 2;
    redLimit = 3;

    onSubmit() {
        alert('Submitted');
    }
}
