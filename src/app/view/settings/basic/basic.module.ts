import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TerraComponentsModule } from '@plentymarkets/terra-components/app/terra-components.module';
import { TranslationModule } from "angular-l10n";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SettingsService} from "../../../core/rest/credentials/settings.service";

@NgModule({
    imports:      [
        CommonModule,
        TranslationModule,
        FormsModule,
        TerraComponentsModule.forRoot(),
        ReactiveFormsModule,
    ],
    providers:    [
    ],
    exports: [
    ],
    declarations: [
    ]
})
export class BasicModule
{
    static forRoot()
    {
        return {
            ngModule:  BasicModule,
            providers: [
                SettingsService
            ]
        };
    }

    static getMainComponent():string
    {
        return 'BasicComponent';
    }
}