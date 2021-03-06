import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {
    TerraLoadingSpinnerService,
    TerraBaseService
} from '@plentymarkets/terra-components';
import { Observable } from 'rxjs';

@Injectable()
export class SettingsService extends TerraBaseService {
    private bearer: string;

    constructor(loadingBarService: TerraLoadingSpinnerService, http: Http) {
        super(loadingBarService, http, '/rest/markets/rewe/settings');

        if (process.env.ENV !== 'production') {
            this.bearer = process.env.TOKEN;
            this.url = process.env.BASE_URL + this.url;
        }
    }

    private setHeader()
    {
        if(this.bearer != null && this.bearer.length > 0)
        {
            this.headers.set('Authorization', 'Bearer ' + this.bearer);
        }
    }

    public getSettings():Observable<any>
    {
        this.setAuthorization();
        this.setHeader();

        let url:string = this.url;

        return this.mapRequest(
            this.http.get(url, {
                headers: this.headers,
                body:    ''
            })
        );
    }

    public saveSettings(settings:any):Observable<void>
    {
        this.setAuthorization();
        this.setHeader();

        let url:string = this.url;

        return this.mapRequest(
            this.http.post(url,
                {},
                {
                    headers: this.headers,
                    body:    settings
                })
        );
    }

    public getTaxCategories():Observable<any> {
        this.setAuthorization();
        this.setHeader();

        let url:string = this.url + '/tax_categories';

        return this.mapRequest(
            this.http.get(url, {headers: this.headers})
        );
    }

    public getBrandsUpdatedAt():Observable<any> {
        this.setAuthorization();
        this.setHeader();

        let url:string = this.url + '/brands';

        return this.mapRequest(
            this.http.get(url, {headers: this.headers})
        );
    }

    public syncTaxCategories():Observable<any> {
        this.setAuthorization();
        this.setHeader();

        let url:string = this.url + '/tax_categories';

        return this.mapRequest(
            this.http.post(url,
                {},
                {
                    headers: this.headers,
                    body:    null
                })
        );
    }

    public syncBrands():Observable<any> {
        this.setAuthorization();
        this.setHeader();

        let url:string = this.url + '/brands';

        return this.mapRequest(
            this.http.post(url,
                {},
                {
                    headers: this.headers,
                    body:    null
                })
        );
    }
}