import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TerraComponentsModule } from '@plentymarkets/terra-components/app/terra-components.module';
import { TranslationModule } from "angular-l10n";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ReturnsService } from '../../core/rest/returns.service';

@NgModule({
    imports: [
        CommonModule,
        TranslationModule,
        FormsModule,
        TerraComponentsModule.forRoot(),
        ReactiveFormsModule,
    ],
    providers: [
    ],
    exports: [
    ],
    declarations: [
    ]
})
export class ReturnsModule
{
    static forRoot()
    {
        return {
            ngModule:  ReturnsModule,
            providers: [
                ReturnsService
            ]
        };
    }

    static getMainComponent():string
    {
        return 'ReturnsComponent';
    }
}