import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NumericTextboxComponent } from './numeric-textbox.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    NumericTextboxComponent
  ],
  exports: [
    NumericTextboxComponent
  ]
})
export class NumericTextboxModule { }
