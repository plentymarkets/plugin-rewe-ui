import {
    Component,
    OnInit,
} from '@angular/core';
import {
    Language,
    TranslationService,
} from 'angular-l10n';

import { LoadingConfig } from '../../core/config/loading.config';
import { AlertConfig } from '../../core/config/alert.config';
import { isNullOrUndefined } from 'util';
import { ShippingService } from '../../core/rest/shipping.service';
import { ShippingServiceProviderInterface } from '../../core/rest/ShippingServiceProvider.interface';
import { ShippingPresetsService } from '../../core/rest/orders/shipping/presets/shippingPresets.service';
import { TerraSelectBoxValueInterface } from '@plentymarkets/terra-components';


@Component({
    selector: 'shipping',
    template: require('./shipping.component.html'),
    styles:   [require('./shipping.component.scss')]
})

export class ShippingComponent implements OnInit
{
    @Language()
    public lang:string;

    private _shippingServiceProviderMappingList:Array<ShippingServiceProviderInterface>;
    private _reweShippingCarrierList:Array<TerraSelectBoxValueInterface>;

    constructor(public translation:TranslationService,
                private _loadingConfig:LoadingConfig,
                private _alertConfig:AlertConfig, 
                private _shippingService:ShippingService, 
                private _shippingPresetsService:ShippingPresetsService)
    {
        this._shippingServiceProviderMappingList = [];
        this._reweShippingCarrierList = [];
    }

    public ngOnInit():void
    {
        this.initReweShippingCarrier();
        this.loadSettings();
    }

    protected onSaveBtnClicked():void
    {
        this.saveSettings();
    }
    
    private initReweShippingCarrier() {
        this._reweShippingCarrierList.push(
            {
                value: "DHL",
                caption: "DHL"
            },
            {
                value: "Hermes",
                caption: "Hermes"
            },
            {
                value: "DPD",
                caption: "DPD"
            },
            {
                value: "UPS",
                caption: "UPS"
            },
            {
                value: "TNT",
                caption: "TNT"
            },
            {
                value: "GLS",
                caption: "GLS"
            },
            {
                value: "unknown",
                caption: "unknown"
            },
        );
    }

    private saveSettings():void
    {
        this._loadingConfig.callLoadingEvent(true);
        
        let settings:Array<any> = [];

        for(let mapping of this._shippingServiceProviderMappingList) {
            settings.push({
                id: mapping.parcelServiceId,
                name: mapping.value
            });
        }

        this._shippingService.saveSettings(settings).subscribe(
            response =>
            {
                this._alertConfig.callStatusEvent(this.translation.translate('settingsAlert.saved'), 'success');
                this._loadingConfig.callLoadingEvent(false);
            },

            error =>
            {
                this._alertConfig.callStatusEvent(this.translation.translate('settingsAlerts.notSaved') + ': ' + error.statusText, 'danger');
                this._loadingConfig.callLoadingEvent(false);
            }
        );
    }

    public loadSettings():void
    {
        this._loadingConfig.callLoadingEvent(true);

        this._shippingPresetsService.list().subscribe(
            (presetsResponse:any) =>
            {
                if(!isNullOrUndefined(presetsResponse)) {
                    this._shippingService.getSettings().subscribe(
                        (mappingResponse:any) =>
                        {
                            if(!isNullOrUndefined(mappingResponse))
                            {
                                for(let mapping of mappingResponse) {
                                    for(let preset of presetsResponse) {
                                        if(preset.parcelServiceId == mapping.id) {
                                            this._shippingServiceProviderMappingList.push({
                                                parcelServiceId: mapping.id,
                                                name: preset.backendName,
                                                value: mapping.name
                                            });
                                            
                                            break;
                                        }
                                    }
                                }
                            }

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
            },
            (error:any) =>
            {
                this._loadingConfig.callLoadingEvent(false);
    
                let message:any = error.json();
    
                this._alertConfig.callStatusEvent(message.error.code + ' ' + message.error.message, 'danger');
            }
        );
    }
}