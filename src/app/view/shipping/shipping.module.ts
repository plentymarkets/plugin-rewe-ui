import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TerraComponentsModule } from '@plentymarkets/terra-components/app/terra-components.module';
import { TranslationModule } from "angular-l10n";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ShippingService } from '../../core/rest/shipping.service';
import { ShippingPresetsService } from '../../core/rest/orders/shipping/presets/shippingPresets.service';

@NgModule({
    imports: [
        CommonModule,
        TranslationModule,
        FormsModule,
        TerraComponentsModule.forRoot(),
        ReactiveFormsModule,
    ],
    providers: [
    ],
    exports: [
    ],
    declarations: [
    ]
})
export class ShippingModule
{
    static forRoot()
    {
        return {
            ngModule:  ShippingModule,
            providers: [
                ShippingService,
                ShippingPresetsService
            ]
        };
    }

    static getMainComponent():string
    {
        return 'ShippingComponent';
    }
}