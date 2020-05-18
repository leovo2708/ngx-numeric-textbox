import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NumericTextboxComponent } from './numeric-textbox.component';
import * as i0 from "@angular/core";
var NumericTextboxModule = /** @class */ (function () {
    function NumericTextboxModule() {
    }
    NumericTextboxModule.ɵmod = i0.ɵɵdefineNgModule({ type: NumericTextboxModule });
    NumericTextboxModule.ɵinj = i0.ɵɵdefineInjector({ factory: function NumericTextboxModule_Factory(t) { return new (t || NumericTextboxModule)(); }, imports: [[
                CommonModule,
                FormsModule
            ]] });
    return NumericTextboxModule;
}());
export { NumericTextboxModule };
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(NumericTextboxModule, { declarations: [NumericTextboxComponent], imports: [CommonModule,
        FormsModule], exports: [NumericTextboxComponent] }); })();
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(NumericTextboxModule, [{
        type: NgModule,
        args: [{
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
            }]
    }], null, null); })();
//# sourceMappingURL=numeric-textbox.module.js.map