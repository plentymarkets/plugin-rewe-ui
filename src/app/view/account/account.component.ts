import {
    Component,
    OnInit,
} from '@angular/core';
import {
    Language,
    TranslationService
} from 'angular-l10n';

import { CredentialsService} from "../../core/rest/credentials/credentials.service";
import { LoadingConfig } from '../../core/config/loading.config';
import { AlertConfig } from '../../core/config/alert.config';



@Component({
    selector: 'account',
    template: require('./account.component.html'),
    styles:   [require('./account.component.scss')]
})

export class AccountComponent implements OnInit
{
    @Language()
    public lang:string;

    private userName:string;
    private password:string;
    private productKey:string;
    
    constructor(
        private _credentialsService:CredentialsService,
        public translation:TranslationService,
        private _loadingConfig:LoadingConfig,
        private _alertConfig:AlertConfig)
    {
        this.userName = '';
        this.password = '';
        this.productKey = '';
    }
    
    ngOnInit():void
    {
        this.loadCredentials();
    }
    
    public loadCredentials()
    {
        this._loadingConfig.callLoadingEvent(true);
        this._credentialsService.getCredentials().subscribe(
            response =>
            {
                this.mapSettings(response);

                this._loadingConfig.callLoadingEvent(false);
            },
            (error:any) =>
            {
                this._loadingConfig.callLoadingEvent(false);

                let message:any = error.json();

                this._alertConfig.callStatusEvent(message.error.code + ' ' + message.error.message, 'danger');
            }
        );
    }
    
    private mapSettings(responseList:any):void
    {
        for(let response of responseList.entries)
        {
            this.userName = response.data.userName;
            this.password = response.data.password;
            this.productKey = response.data.productKey;
        }
    }

    private onSaveBtnClicked()
    {
        this.saveCredentials();
    }

    private saveCredentials()
    {
        this._loadingConfig.callLoadingEvent(true);

        let credentials:any = {
            data: {
                userName: this.userName,
                password: this.password,
                productKey: this.productKey
            },
            status: "active",
            environment: "production",
            market: "REWE"
        };

        this._credentialsService.saveCredentials(credentials).subscribe(
            response =>
            {
                this._alertConfig.callStatusEvent(this.translation.translate('settingsAlerts.saved'), 'success');

                this._loadingConfig.callLoadingEvent(false);
            },

            error =>
            {
                this._alertConfig.callStatusEvent(this.translation.translate('settingsAlerts.notSaved') + ': ' + error.statusText, 'danger');

                this._loadingConfig.callLoadingEvent(false);
            }
        );
    }
}