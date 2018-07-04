import {
    Component,
    OnInit,
    ViewChild,
} from '@angular/core';
import {
    Language,
    TranslationService,
} from 'angular-l10n';

import { LoadingConfig } from '../../../core/config/loading.config';
import { AlertConfig } from '../../../core/config/alert.config';
import {
    TerraCheckboxComponent,
    TerraSelectBoxValueInterface
} from "@plentymarkets/terra-components";
import { SettingsService } from "../../../core/rest/credentials/settings.service";
import { isNullOrUndefined } from "util";


@Component({
    selector: 'basic',
    template: require('./basic.component.html'),
    styles:   [require('./basic.component.scss')]
})

export class BasicComponent implements OnInit
{
    @Language()
    public lang:string;

    @ViewChild('viewChildItemExportCheckbox') viewChildItemExportCheckbox:TerraCheckboxComponent;
    @ViewChild('viewChildStockExportCheckbox') viewChildStockExportCheckbox:TerraCheckboxComponent;
    @ViewChild('viewChildPriceExportCheckbox') viewChildPriceExportCheckbox:TerraCheckboxComponent;
    @ViewChild('viewChildOrderImportCheckbox') viewChildOrderImportCheckbox:TerraCheckboxComponent;

    private itemExport:boolean;
    private stockExport:boolean;
    private priceExport:boolean;
    private orderImport:boolean;

    private _selectableSkuGenerationList:Array<TerraSelectBoxValueInterface> = [];
    private _pickedSkuGenerationValue:number;

    constructor(private _settingsService:SettingsService,
                public translation:TranslationService,
                private _loadingConfig:LoadingConfig,
                private _alertConfig:AlertConfig)
    {
        this.itemExport = false;
        this.stockExport = false;
        this.priceExport = false;
        this.orderImport = false;
    }

    protected setItemExportCheckboxValue():void
    {
        this.itemExport = this.viewChildItemExportCheckbox.value;
    }

    protected setStockExportCheckboxValue():void
    {
        this.stockExport = this.viewChildStockExportCheckbox.value;
    }

    protected setPriceExportCheckboxValue():void
    {
        this.priceExport = this.viewChildPriceExportCheckbox.value;
    }

    protected setOrderImportCheckboxValue():void
    {
        this.orderImport = this.viewChildOrderImportCheckbox.value;
    }

    public ngOnInit():void
    {
        this.initSkuGeneration();
        this.loadSettings();
    }

    private initSkuGeneration():void
    {
        this._selectableSkuGenerationList.push(
            {
                value:   'variationId',
                caption: this.translation.translate('sku.variationId'),
            },
            {
                value:   'barcode',
                caption: this.translation.translate('sku.barcode'),
            },
            {
                value:   'variationNumber',
                caption: this.translation.translate('sku.variationNumber'),
            }
        );
    }

    public loadSettings():void
    {
        this._loadingConfig.callLoadingEvent(true);
        this._settingsService.getSettings().subscribe(
            response =>
            {
                if(!isNullOrUndefined(response.settings))
                {
                    this.mapSettings(response);
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

    private mapSettings(responseList:any):void
    {
        if(!isNullOrUndefined(responseList.settings) && responseList.settings.orderImport === true)
        {
            this.viewChildOrderImportCheckbox.value = responseList.settings.orderImport;
            this.orderImport = responseList.settings.orderImport;
        }

        if(!isNullOrUndefined(responseList.settings) && responseList.settings.stockExport === true)
        {
            this.viewChildStockExportCheckbox.value = responseList.settings.stockExport;
            this.stockExport = responseList.settings.stockExport;
        }

        if(!isNullOrUndefined(responseList.settings) && responseList.settings.itemExport === true)
        {
            this.viewChildItemExportCheckbox.value = responseList.settings.itemExport;
            this.itemExport = responseList.settings.itemExport;
        }

        if(!isNullOrUndefined(responseList.settings) && responseList.settings.priceExport === true)
        {
            this.viewChildPriceExportCheckbox.value = responseList.settings.priceExport;
            this.priceExport = responseList.settings.priceExport;
        }

        if(!isNullOrUndefined(responseList.settings))
        {
            this._pickedSkuGenerationValue = responseList.settings.skuGeneration;
        }
    }

    protected onSaveBtnClicked():void
    {
        this.saveSettings();
    }

    private saveSettings():void
    {
        this._loadingConfig.callLoadingEvent(true);

        let settings:any = {
            orderImport:   this.orderImport,
            stockExport:   this.stockExport,
            itemExport:    this.itemExport,
            priceExport:   this.priceExport,
            skuGeneration: this._pickedSkuGenerationValue
        };

        this._settingsService.saveSettings(settings).subscribe(
            response =>
            {
                this._alertConfig.callStatusEvent(this.translation.translate('settingsAlert.saved'), 'success');

                this._loadingConfig.callLoadingEvent(false);
            },

            error =>
            {
                this._alertConfig.callStatusEvent(this.translation.translate('settingsAlert.notSaved') + ': ' + error.statusText, 'danger');

                this._loadingConfig.callLoadingEvent(false);
            }
        );
    }
}