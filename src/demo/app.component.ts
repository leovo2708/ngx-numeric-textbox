import { Component } from '@angular/core';

@Component({
  selector: 'ngx-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  min = -1000;
  max = 1000;
  disabled = false;
  autoCorrect = false;
  decimals = 3;
  value = 10;
  placeholder = 'Input your number';
  format = '$ 0,0.000';

  onModelChange(value: number) {
    console.log(value);
  }
}
