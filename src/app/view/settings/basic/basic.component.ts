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
    @ViewChild('viewChildOfferExportCheckbox') viewChildOfferCheckbox:TerraCheckboxComponent;
    @ViewChild('viewChildOrderImportCheckbox') viewChildOrderImportCheckbox:TerraCheckboxComponent;

    private itemExport:boolean;
    private offerExport:boolean;
    private orderImport:boolean;

    private _syncTaxCategoriesButtonList:Array<TerraButtonInterface> = [];

    private taxCategories:any;
    private lastUpdate:string;

    constructor(private _settingsService:SettingsService,
                public translation:TranslationService,
                private _loadingConfig:LoadingConfig,
                private _alertConfig:AlertConfig)
    {
        this.itemExport = false;
        this.orderImport = false;

        this.taxCategories = null;
        this.lastUpdate = '';
    }

    protected setItemExportCheckboxValue():void
    {
        this.itemExport = this.viewChildItemExportCheckbox.value;
    }

    protected setOfferExportCheckboxValue():void
    {
        this.offerExport = this.viewChildOfferCheckbox.value;
    }

    protected setOrderImportCheckboxValue():void
    {
        this.orderImport = this.viewChildOrderImportCheckbox.value;
    }

    public ngOnInit():void
    {
        this.initTaxCategoriesButtonList();
        this.initTaxCategories();
        this.loadSettings();
    }

    private initTaxCategoriesButtonList() {
        this._syncTaxCategoriesButtonList.push({
            icon: "icon-process_loop",
            tooltipText: this.translation.translate('basic.taxCategories.sync'),
            clickFunction: ():void => this.syncTaxCategories()
        });
    }

    private initTaxCategories() {
        this._settingsService.getTaxCategories().subscribe(
            response =>
            {
                this.lastUpdate = new Date(response.updatedAt).toLocaleString();

                this._loadingConfig.callLoadingEvent(false);
            },

            error =>
            {
                this._alertConfig.callStatusEvent(this.translation.translate('settingsAlerts.taxCategoriesFailed') + ': ' + error.statusText, 'danger');
                this._loadingConfig.callLoadingEvent(false);
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

        if(!isNullOrUndefined(responseList.settings) && responseList.settings.offerExport === true)
        {
            this.viewChildOfferCheckbox.value = responseList.settings.offerExport;
            this.offerExport = responseList.settings.offerExport;
        }

        if(!isNullOrUndefined(responseList.settings) && responseList.settings.itemExport === true)
        {
            this.viewChildItemExportCheckbox.value = responseList.settings.itemExport;
            this.itemExport = responseList.settings.itemExport;
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
            offerExport:   this.offerExport,
            itemExport:    this.itemExport
        };

        this._settingsService.saveSettings(settings).subscribe(
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

    private syncTaxCategories() {
        this._settingsService.syncTaxCategories().subscribe(
            response =>
            {
                this.lastUpdate = new Date(response.updatedAt).toLocaleString();

                this._alertConfig.callStatusEvent(this.translation.translate('settingsAlert.syncSuccess'), 'success');
                this._loadingConfig.callLoadingEvent(false);
            },

            error =>
            {
                this._alertConfig.callStatusEvent(this.translation.translate('settingsAlerts.syncFailed') + ': ' + error.statusText, 'danger');
                this._loadingConfig.callLoadingEvent(false);
            }
        );
    }
}