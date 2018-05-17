import {
    Component,
    OnInit,
} from '@angular/core';
import {TerraMultiSplitViewInterface, TerraSplitViewComponentInterface} from "@plentymarkets/terra-components";

@Component({
    selector: 'credentials-details',
    template: require('./credentials-details.component.html'),
    styles: [require('./credentials-details.component.scss')],
})

export class CredentialsDetailsComponent implements OnInit, TerraSplitViewComponentInterface
{
    splitViewInstance: TerraMultiSplitViewInterface;
    parameter: any;

    public ngOnInit():void
    {
    }
}
