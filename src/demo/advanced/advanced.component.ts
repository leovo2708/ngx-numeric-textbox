import { Component } from '@angular/core';

@Component({
    selector: 'ngx-advanced',
    templateUrl: './advanced.component.html'
})
export class AdvancedComponent {
    orangeWinLimit = 1;
    yellowWinLimit = 2;
    redWinLimit = 3;

    onSubmit() {
        alert('Submitted');
    }
}
