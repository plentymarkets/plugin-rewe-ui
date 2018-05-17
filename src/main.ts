import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {ReweAppModule} from "./app/rewe-app.module";

if(process.env.ENV === 'production')
{
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(ReweAppModule);
