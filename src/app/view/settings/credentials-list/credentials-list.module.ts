import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TerraComponentsModule } from '@plentymarkets/terra-components/app/terra-components.module';
import {CredentialsListComponent} from "./credentials-list.component";


@NgModule({
    imports:      [
        CommonModule,
        FormsModule,
        TerraComponentsModule.forChild(),
    ],
    declarations: [
        CredentialsListComponent
    ]
})
export class CredentialsListModule
{
    static forRoot()
    {
        return {
            ngModule:  CredentialsListModule,
            providers: [
            ]
        };
    }

    static getMainComponent():string
    {
        return 'CredentialsListComponent';
    }
}