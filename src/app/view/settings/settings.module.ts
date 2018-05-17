import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TerraComponentsModule } from '@plentymarkets/terra-components/app/terra-components.module';
import { TranslationModule } from "angular-l10n";
import { FormsModule } from '@angular/forms';
import {SettingsComponent} from "./settings.component";
import {SettingsSplitConfig} from "./config/settings-split.config";
import {RouterModule} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";
import {HttpModule} from "@angular/http";

@NgModule({
    imports:      [
        CommonModule,
        TranslationModule,
        FormsModule,
        HttpModule,
        HttpClientModule,
        RouterModule,
        RouterModule.forRoot([
            {
                path: '*',
                component: SettingsComponent
            }
        ]),
        TerraComponentsModule.forRoot(),
    ],
    providers: [
        SettingsSplitConfig
    ],
    exports: [
        SettingsComponent
    ],
    declarations: [
        SettingsComponent
    ]
})
export class SettingsModule
{
    static forRoot()
    {
        return {
            ngModule:  SettingsModule,
            providers: [
            ]
        };
    }

    static getMainComponent():string
    {
        return 'SettingsComponent';
    }
}