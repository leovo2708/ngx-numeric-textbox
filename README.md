# ngx-numeric-textbox

Fork of [ngx-numeric-textbox](https://github.com/leovo2708/ngx-numeric-textbox) upgraded to be usable with Angular 9

## Installation

After install the above dependencies, install `ngx-numeric-textbox` via:
```shell
npm install ngx-numeric-textbox --save
```
Once installed you need to import our main module in your application module:
```js
import { NumericTextboxModule } from 'ngx-numeric-textbox';

@NgModule({
  declarations: [
    AppComponent,
    ...
  ],
  imports: [
    FormsModule,
    NumericTextboxModule,
    ...
  ],  
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
```

## Usage

```html
<ngx-numeric-textbox
    [min]="min"
    [max]="max"
    [disabled]="disabled"
    [decimals]="decimals"
    [format]="format"
    [placeholder]="placeholder"
    [rangeValidation]="rangeValidation"
    [(ngModel)]="value"
    (focus)="onFocus()"
    (blur)="onBlur()"
    (enter)="onEnter()"
    (escape)="onEscape()"
    (ngModelChange)="ngModelChange($event)">
</ngx-numeric-textbox>
```

* format string: http://numeraljs.com/#format
