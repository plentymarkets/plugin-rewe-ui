import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {
    TerraLoadingSpinnerService,
    TerraBaseService
} from '@plentymarkets/terra-components';
import { Observable } from 'rxjs';
import { CredentialsInterface } from './data/credentials.interface';
import { CredentialInterface } from './data/credential.interface';

@Injectable()
export class CredentialsService extends TerraBaseService
{
    private bearer:string;

    constructor(loadingBarService:TerraLoadingSpinnerService, http:Http)
    {
        super(loadingBarService, http, '/rest/markets/credentials/');

        if(process.env.ENV !== 'production')
        {
            this.bearer = process.env.TOKEN;
            this.url = process.env.BASE_URL + this.url;
        }
    }

    public search():Observable<CredentialsInterface>
    {
        let url:string;

        this.setAuthorization();
        this.setHeader();

        url = this.url + '?market=ebay&data[authType]=oauth2';

        return this.mapRequest(
            this.http.get(url, {headers: this.headers})
        );
    }

    public save(credentials:CredentialInterface):Observable<CredentialInterface>
    {
        let url:string;

        this.setAuthorization();

        url = this.url + credentials.id;

        return this.mapRequest(
            this.http.put(url, credentials, {headers: this.headers})
        );
    }

    public remove(id:number):Observable<any>
    {
        let url:string;

        this.setAuthorization();

        url = this.url + id;

        return this.mapRequest(
            this.http.delete(url, {headers: this.headers})
        );
    }

    private setHeader()
    {
        if(this.bearer != null && this.bearer.length > 0)
        {
            this.headers.set('Authorization', 'Bearer ' + this.bearer);
        }
    }
}