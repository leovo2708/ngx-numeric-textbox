import { Component } from '@angular/core';

@Component({
    selector: 'ngx-advanced',
    templateUrl: './advanced.component.html'
})
export class AdvancedComponent {
    orangeWinLimit = 0;
    yellowWinLimit = 0;
    redWinLimit = 0;

    onSubmit() {
        alert('Submitted');
    }
}
