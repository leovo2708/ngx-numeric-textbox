import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NumericTextboxModule } from 'ngx-numeric-textbox';
import { LossLimitTextboxComponent } from './loss-limit-textbox/loss-limit-textbox.component';
import { WinLimitTextboxComponent } from './win-limit-textbox/win-limit-textbox.component';
import { AdvancedComponent } from './advanced.component';

@NgModule({
    declarations: [
        LossLimitTextboxComponent,
        WinLimitTextboxComponent,
        AdvancedComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        NumericTextboxModule
    ],
    exports: [
        AdvancedComponent
    ]
})
export class AdvancedModule { }
