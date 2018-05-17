import {
    Component,
    OnInit
} from '@angular/core';
import {TerraMultiSplitViewInterface, TerraSplitViewComponentInterface} from "@plentymarkets/terra-components";
import {SettingsSplitConfig} from "../config/settings-split.config";
import {CredentialsDetailsModule} from "./credentials-details/credentials-details.module";

@Component({
    selector: 'credentials-list',
    template: require('./credentials-list.component.html'),
    styles: [require('./credentials-list.component.scss')],
})

export class CredentialsListComponent implements OnInit, TerraSplitViewComponentInterface 
{
    splitViewInstance: TerraMultiSplitViewInterface;
    parameter: any;
    
    constructor(private _settingsSplitConfig:SettingsSplitConfig)
    {
        
    }

    public ngOnInit():void
    {
    }
    
    public createCredentials()
    {
        this._settingsSplitConfig.addView({
            module:            CredentialsDetailsModule.forRoot(),
            defaultWidth:      'col-xs-12 col-md-6 col-lg-9',
            name:              'details',
            mainComponentName: CredentialsDetailsModule.getMainComponent(),
            parameter:         {},
        }, this.splitViewInstance);
    }
}
