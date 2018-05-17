import {
    NgModule
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {L10nLoader, TranslationModule} from 'angular-l10n';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TerraComponentsModule } from '@plentymarkets/terra-components/app/';
import { ReweAppComponent } from "./rewe-app.component";
import { LoadingConfig } from './core/config/loading.config';
import { AlertConfig } from './core/config/alert.config';
import {l10nConfig} from "./core/config/l10n.config";
import {SettingsModule} from "./view/settings/settings.module";

@NgModule({
    imports:      [
        BrowserModule,
        HttpModule,
        HttpClientModule,
        FormsModule,
        TranslationModule.forRoot(l10nConfig),
        TerraComponentsModule.forRoot(),
        SettingsModule.forRoot()
    ],
    declarations: [
        ReweAppComponent,
    ],

    providers: [
        LoadingConfig,
        AlertConfig,
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