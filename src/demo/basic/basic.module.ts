import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NumericTextboxModule } from 'ngx-numeric-textbox';
import { BasicComponent } from './basic.component';
import { CustomComponent } from './custom.component';

@NgModule({
    declarations: [
        BasicComponent,
        CustomComponent
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
