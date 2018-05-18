import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TerraComponentsModule } from '@plentymarkets/terra-components/app/terra-components.module';
import { TranslationModule } from "angular-l10n";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CredentialsService} from "../../core/rest/credentials/credentials.service";

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
export class AccountModule
{
    static forRoot()
    {
        return {
            ngModule:  AccountModule,
            providers: [
                CredentialsService
            ]
        };
    }

    static getMainComponent():string
    {
        return 'AccountComponent';
    }
}