import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NumericTextboxModule } from 'ngx-numeric-textbox';
import { WinLimitSettingTextboxComponent } from './win-limit-setting-textbox/win-limit-setting-textbox.component';
import { AdvancedComponent } from './advanced.component';

@NgModule({
    declarations: [
        WinLimitSettingTextboxComponent,
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
