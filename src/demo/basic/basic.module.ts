import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NumericTextboxModule } from 'ngx-numeric-textbox';
import { BasicComponent } from './basic.component';

@NgModule({
    declarations: [
        BasicComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        NumericTextboxModule
    ],
    exports: [
        BasicComponent
    ]
})
export class BasicModule { }
