import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NumericTextboxModule } from 'ngx-numeric-textbox';
import { WinLimitTextboxComponent } from './win-limit-textbox/win-limit-textbox.component';
import { AdvancedComponent } from './advanced.component';

@NgModule({
    declarations: [
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
