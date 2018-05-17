import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TerraComponentsModule } from '@plentymarkets/terra-components/app/terra-components.module';
import {CredentialsDetailsComponent} from "./credentials-details.component";

@NgModule({
    imports:      [
        CommonModule,
        FormsModule,
        TerraComponentsModule.forChild(),
    ],
    declarations: [
        CredentialsDetailsComponent,
    ]
})
export class CredentialsDetailsModule
{
    static forRoot()
    {
        return {
            ngModule:  CredentialsDetailsModule,
            providers: [
            ]
        };
    }

    static getMainComponent():string
    {
        return 'CredentialsDetailsComponent';
    }
}