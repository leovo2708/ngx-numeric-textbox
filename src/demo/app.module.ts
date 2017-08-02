import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BasicModule } from './basic';
import { AdvancedModule } from './advanced';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BasicModule,
    AdvancedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
