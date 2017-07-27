import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NumericTextboxComponent } from './numeric-textbox.component';

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
