import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {
    TerraLoadingSpinnerService,
    TerraBaseService
} from '@plentymarkets/terra-components';
import { Observable } from 'rxjs';
import {isNullOrUndefined} from "util";

@Injectable()
export class CredentialsService extends TerraBaseService {
    public MARKET_NAME = "rewe";
    private bearer: string;

    constructor(loadingBarService: TerraLoadingSpinnerService, http: Http) {
        super(loadingBarService, http, '/rest/markets/credentials');

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
    
    public getCredentials():Observable<any>
    {
        this.setAuthorization();
        this.setHeader();

        let url:string = this.url + '?market=' + this.MARKET_NAME;

        return this.mapRequest(
            this.http.get(url, {
                headers: this.headers,
                body:    ''
            })
        );
    }
    
    public saveCredentials(credentials:any):Observable<any>
    {
        if(isNullOrUndefined(credentials.id))
        {
            return this.createCredentials(credentials);
        }
        else
        {
            return this.updateCredentials(credentials);
        }
    }

    public createCredentials(credentials:any):Observable<any>
    {
        this.setAuthorization();
        this.setHeader();

        let url:string = this.url;

        return this.mapRequest(
            this.http.post(url,
                {},
                {
                    headers: this.headers,
                    body:    credentials
                })
        );
    }

    public updateCredentials(credentials:any):Observable<any>
    {
        this.setAuthorization();
        this.setHeader();

        let url:string = this.url + '/' + credentials.id;

        return this.mapRequest(
            this.http.put(url,
                {},
                {
                    headers: this.headers,
                    body:    credentials
                })
        );
    }
}