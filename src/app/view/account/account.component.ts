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

    private credentialsId:number;
    private username:string;
    private password:string;
    private productKey:string;
    
    constructor(
        private _credentialsService:CredentialsService,
        public translation:TranslationService,
        private _loadingConfig:LoadingConfig,
        private _alertConfig:AlertConfig)
    {
        this.credentialsId = null;
        this.username = '';
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
            this.credentialsId = response.id;
            this.username = response.data.username;
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
            id: this.credentialsId,
            data: {
                username: this.username,
                password: this.password,
                productKey: this.productKey
            },
            status: "active",
            environment: "production",
            market: this._credentialsService.MARKET_NAME
        };

        // create new credentials
        this._credentialsService.saveCredentials(credentials).subscribe(
            response =>
            {
                this.credentialsId = response.id;

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