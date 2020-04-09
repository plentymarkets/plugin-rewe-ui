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
    TerraButtonInterface,
    TerraCheckboxComponent, TerraSelectBoxValueInterface
} from '@plentymarkets/terra-components';
import { SettingsService } from '../../../core/rest/credentials/settings.service';
import { isNullOrUndefined } from 'util';


@Component({
    selector: 'basic',
    template: require('./basic.component.html'),
    styles:   [require('./basic.component.scss')]
})

export class BasicComponent implements OnInit
{
    @Language()
    public lang:string;

    @ViewChild('viewChildItemExportCheckbox') public viewChildItemExportCheckbox:TerraCheckboxComponent;
    @ViewChild('viewChildStockExportCheckbox') public viewChildStockExportCheckbox:TerraCheckboxComponent;
    @ViewChild('viewChildPriceExportCheckbox') public viewChildPriceExportCheckbox:TerraCheckboxComponent;
    @ViewChild('viewChildOrderImportCheckbox') public viewChildOrderImportCheckbox:TerraCheckboxComponent;

    private itemExport:boolean;
    private stockExport:boolean;
    private priceExport:boolean;
    private orderImport:boolean;
    private commission:number;

    private _syncTaxCategoriesButtonList:Array<TerraButtonInterface> = [];
    private _syncBrandsButtonList:Array<TerraButtonInterface> = [];
    private _stockCalculationList:Array<TerraSelectBoxValueInterface> = [];

    private taxCategories:any;
    private taxCategoriesLastUpdate:string;

    private brandsLastUpdate:string;
    private considerVariationSettings:boolean;

    constructor(private _settingsService:SettingsService,
                public translation:TranslationService,
                private _loadingConfig:LoadingConfig,
                private _alertConfig:AlertConfig)
    {
        this.itemExport = false;
        this.stockExport = false;
        this.priceExport = false;
        this.orderImport = false;

        this.taxCategories = null;
        this.taxCategoriesLastUpdate = '';
        this.brandsLastUpdate = '';

        this.commission = 0;
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
        this.initTaxCategoriesButtonList();
        this.initBrandsButtonList();
        this.initTaxCategories();
        this.initBrandsUpdate();
        this.initStockCalculation();
        this.loadSettings();
    }

    private initTaxCategoriesButtonList():void
    {
        this._syncTaxCategoriesButtonList.push({
            icon: 'icon-process_loop',
            tooltipText: this.translation.translate('basic.taxCategories.sync'),
            clickFunction: ():void => this.syncTaxCategories()
        });
    }

    private initBrandsButtonList():void
    {
        this._syncBrandsButtonList.push({
            icon: 'icon-process_loop',
            tooltipText: this.translation.translate('basic.brands.sync'),
            clickFunction: ():void => this.syncBrands()
        });
    }

    private initTaxCategories():void
    {
        this._settingsService.getTaxCategories().subscribe(
            (response:any) =>
            {
                this.taxCategoriesLastUpdate = new Date(response.updatedAt).toLocaleString();

                this._loadingConfig.callLoadingEvent(false);
            },

            (error:any) =>
            {
                this._alertConfig.callStatusEvent(this.translation.translate('settingsAlerts.taxCategoriesFailed') +
                    ': ' + error.statusText, 'danger');
                this._loadingConfig.callLoadingEvent(false);
            }
        );
    }

    private initBrandsUpdate():void
    {
        this._settingsService.getBrandsUpdatedAt().subscribe(
            (response:any) =>
            {
                this.brandsLastUpdate = new Date(response.updatedAt).toLocaleString();

                this._loadingConfig.callLoadingEvent(false);
            },

            (error:any) =>
            {
                this._alertConfig.callStatusEvent(this.translation.translate('settingsAlerts.brandsFailed') + ': ' + error.statusText, 'danger');
                this._loadingConfig.callLoadingEvent(false);
            }
        );
    }

    private initStockCalculation():void
    {
        this._stockCalculationList.push(
            {
                value: true,
                caption: this.translation.translate('basic.exportStock.variationLimitation')
            },
            {
                value: false,
                caption: this.translation.translate('basic.exportStock.netStock')
            }
        );
    }

    public loadSettings():void
    {
        this._loadingConfig.callLoadingEvent(true);
        this._settingsService.getSettings().subscribe(
            (response:any) =>
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

        if(!isNullOrUndefined(responseList.settings) && !isNullOrUndefined(responseList.settings.commissionDefault))
        {
            this.commission = responseList.settings.commissionDefault;
        }

        if(!isNullOrUndefined(responseList.settings) && responseList.settings.priceExport === true)
        {
            this.viewChildPriceExportCheckbox.value = responseList.settings.priceExport;
            this.priceExport = responseList.settings.priceExport;
        }

        if(!isNullOrUndefined(responseList.settings) && !isNullOrUndefined(responseList.settings.considerVariationSettings))
        {
            this.considerVariationSettings = responseList.settings.considerVariationSettings;
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
            commissionDefault: this.commission,
            stockExport:   this.stockExport,
            itemExport:    this.itemExport,
            priceExport:   this.priceExport,
            considerVariationSettings:   this.considerVariationSettings
        };

        this._settingsService.saveSettings(settings).subscribe(
            () =>
            {
                this._alertConfig.callStatusEvent(this.translation.translate('settingsAlert.saved'), 'success');
                this._loadingConfig.callLoadingEvent(false);
            },

            (error:any) =>
            {
                this._alertConfig.callStatusEvent(this.translation.translate('settingsAlerts.notSaved') + ': ' + error.statusText, 'danger');
                this._loadingConfig.callLoadingEvent(false);
            }
        );
    }

    private syncTaxCategories():void
    {
        this._settingsService.syncTaxCategories().subscribe(
            (response:any) =>
            {
                this.taxCategoriesLastUpdate = new Date(response.updatedAt).toLocaleString();

                this._alertConfig.callStatusEvent(this.translation.translate('settingsAlert.taxSyncSuccess'), 'success');
                this._loadingConfig.callLoadingEvent(false);
            },

            (error:any) =>
            {
                this._alertConfig.callStatusEvent(this.translation.translate('settingsAlerts.taxSyncFailed') + ': ' + error.statusText, 'danger');
                this._loadingConfig.callLoadingEvent(false);
            }
        );
    }

    private syncBrands():void
    {
        this._settingsService.syncBrands().subscribe(
            (response:any) =>
            {
                this.brandsLastUpdate = new Date(response.updatedAt).toLocaleString();

                this._alertConfig.callStatusEvent(this.translation.translate('settingsAlert.brandsSyncSuccess'), 'success');
                this._loadingConfig.callLoadingEvent(false);
            },

            (error:any) =>
            {
                this._alertConfig.callStatusEvent(this.translation.translate('settingsAlerts.brandsSyncFailed') + ': ' + error.statusText, 'danger');
                this._loadingConfig.callLoadingEvent(false);
            }
        );
    }
}
