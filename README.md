# ngx-numeric-textbox

An Angular numeric textbox component

## Dependencies

* [Angular](https://angular.io)
* [Lodash](https://lodash.com)
* [Numeral](http://numeraljs.com)
* [Bootstrap 4 alpha 6](https://v4-alpha.getbootstrap.com)

You can customize CSS yourself to break down dependencies to Bootstrap.

## Demo

[https://leovo2708.github.io/ngx-numeric-textbox/](https://leovo2708.github.io/ngx-numeric-textbox/)

## Installation

After install the above dependencies, install `ngx-numeric-textbox` via:
```shell
npm install ngx-numeric-textbox --save
```
Once installed you need to import our main module in your application module:
```js
import { NumericTextboxModule } from 'ngx-numeric-textbox';

@NgModule({
  declarations: [AppComponent, ...],
  imports: [NumericTextboxModule, ...],  
  bootstrap: [AppComponent]
})
export class AppModule {
}
```

## Usage

```html
<ngx-numeric-textbox
    [min]="min"
    [max]="max"
    [decimals]="decimals"
    [format]="format"
    [placeholder]="placeholder"
    [(value)]="value"
    (valueChange)="onValueChange($event)">
</ngx-numeric-textbox>
```

## Contributing

I am very appreciate for your ideas, proposals and found bugs which you can leave in github issues. Thanks in advance!