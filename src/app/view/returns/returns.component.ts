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
import { TerraSelectBoxValueInterface } from '@plentymarkets/terra-components';
import { ReturnReasonInterface } from '../../core/rest/return-reason.interface';
import { ReturnsService } from '../../core/rest/returns.service';


@Component({
    selector: 'returns',
    template: require('./returns.component.html'),
    styles:   [require('./returns.component.scss')]
})

export class ReturnsComponent implements OnInit
{
    @Language()
    public lang:string;
    
    private _returnReasonMappingList:Array<ReturnReasonInterface>;
    private _reweReturnReasonList:Array<TerraSelectBoxValueInterface>

    constructor(public translation:TranslationService,
                private _loadingConfig:LoadingConfig,
                private _alertConfig:AlertConfig,
                private _returnsService:ReturnsService,
    )
    {
        this._returnReasonMappingList = [];
        this._reweReturnReasonList = [];
    }

    public ngOnInit():void
    {
        this.initReweReturnReasonList();
        this.loadSettings();
    }
    
    private initReweReturnReasonList() {
        this._reweReturnReasonList.push(
            {
                value: 1,
                caption: "Artikel anders als beschrieben"
            },
            {
                value: 2,
                caption: "Artikel anders als abgebildet"
            },
            {
                value: 3,
                caption: "Artikel/Qualität anders als erwartet"
            },
            {
                value: 4,
                caption: "Artikel passt nicht"
            },
            {
                value: 5,
                caption: "Artikel defekt"
            },
            {
                value: 6,
                caption: "Falscher Artikel geliefert"
            },
            {
                value: 7,
                caption: "Artikel/Material/Farbe gefällt mir nicht"
            },
            {
                value: 8,
                caption: "Mehrere Varianten zur Auswahl bestellt"
            },
            {
                value: 11,
                caption: "Lieferung zu spät"
            },
            {
                value: 12,
                caption: "Lieferung unvollständig/falsch"
            },
            {
                value: 99,
                caption: "Sonstiges"
            },
        );
    }

    protected onSaveBtnClicked():void
    {
        this.saveSettings();
    }

    private saveSettings():void
    {
        this._loadingConfig.callLoadingEvent(true);
        
        let settings:Array<any> = [];

        for(let mapping of this._returnReasonMappingList) {
            settings.push({
                id: mapping.id,
                reweReturnReasonId: mapping.reweReturnReasonId
            });
        }

        this._returnsService.saveSettings(settings).subscribe(
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

        this._returnsService.listReturnReasons().subscribe(
            (returnReasonsResponse:any) =>
            {
                if(!isNullOrUndefined(returnReasonsResponse)) {
                    this._returnsService.getSettings().subscribe(
                        (mappingResponse:any) =>
                        {
                            if(!isNullOrUndefined(mappingResponse))
                            {
                                for(let mapping of mappingResponse) {
                                    for(let key in returnReasonsResponse) {
                                        if(returnReasonsResponse[key]['id'] == mapping.id) {
                                            let i = 1;
                                            this._returnReasonMappingList.push({
                                                id: mapping.id,
                                                reweReturnReasonId: mapping.reweReturnReasonId,
                                                caption: returnReasonsResponse[key].reason,
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