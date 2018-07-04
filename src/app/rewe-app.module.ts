import {
    APP_INITIALIZER,
    NgModule
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {L10nLoader, TranslationModule} from 'angular-l10n';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { TerraComponentsModule } from '@plentymarkets/terra-components/app/';
import { LoadingConfig } from './core/config/loading.config';
import { AlertConfig } from './core/config/alert.config';
import {ReweAppComponent} from "./rewe-app.component";
import {AccountComponent} from "./view/account/account.component";
import {AccountModule} from "./view/account/account.module";
import {HttpClientModule} from "@angular/common/http";
import {l10nConfig} from "./core/config/l10n.config";
import {BasicComponent} from "./view/settings/basic/basic.component";
import {BasicModule} from "./view/settings/basic/basic.module";

@NgModule({
    imports:      [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        TranslationModule.forRoot(l10nConfig),
        TerraComponentsModule.forRoot(),
        AccountModule.forRoot(),
        BasicModule.forRoot(),
    ],
    declarations: [
        ReweAppComponent,
        AccountComponent,
        BasicComponent
    ],

    providers: [
        LoadingConfig,
        AlertConfig,
        {
            provide:    APP_INITIALIZER,
            useFactory: initL10n,
            deps:       [L10nLoader],
            multi:      true
        }
    ],

    bootstrap: [
        ReweAppComponent
    ]
})

export class ReweAppModule
{
    constructor(public l10nLoader:L10nLoader)
    {
        this.l10nLoader.load();
    }
}

function initL10n(l10nLoader:L10nLoader):Function
{
    return ():Promise<void> => l10nLoader.load();
}
