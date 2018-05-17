import {
    Component,
    OnInit,
    ViewChild
} from '@angular/core';
import {
    Language,
    TranslationService
} from 'angular-l10n';
import { TerraOverlayComponent } from '@plentymarkets/terra-components';
import { LoadingConfig } from '../../core/config/loading.config';
import { AlertConfig } from '../../core/config/alert.config';
import {SettingsSplitConfig} from "./config/settings-split.config";
import {CredentialsListModule} from "./credentials-list/credentials-list.module";

@Component({
    selector: 'settings',
    template: require('./settings.component.html'),
    styles:   [require('./settings.component.scss').toString()]
})

export class SettingsComponent implements OnInit
{
    @ViewChild('removeCredentialsConfirmationOverlay') public removeCredentialsConfirmationOverlay:TerraOverlayComponent;

    @Language()
    public lang:string;

    constructor(public translation:TranslationService,
                private _loadingConfig:LoadingConfig,
                private _alertConfig:AlertConfig,
                private _settingsSplitConfig:SettingsSplitConfig)
    {
    }

    ngOnInit()
    {
        this.initMultiSplitView();
    }

    /**
     *
     */
    private initMultiSplitView():void
    {
        this._settingsSplitConfig.addView({
            module:            CredentialsListModule.forRoot(),
            defaultWidth:      'col-xs-12 col-md-6 col-lg-3',
            name:              'test name',
            mainComponentName: CredentialsListModule.getMainComponent(),
            parameter:         '',
        });
    }
}