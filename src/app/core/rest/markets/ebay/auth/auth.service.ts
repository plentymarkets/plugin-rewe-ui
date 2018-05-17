import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { TerraLoadingSpinnerService, TerraBaseService } from '@plentymarkets/terra-components';
import { Observable } from 'rxjs';
import { LoginUrlInterface } from './data/login-url.interface';

@Injectable()
export class AuthService extends TerraBaseService
{
    private bearer:string;

    constructor(loadingSpinnerService:TerraLoadingSpinnerService, http:Http)
    {
        super(loadingSpinnerService, http, '/rest/markets/ebay/auth/');

        if(process.env.ENV !== 'production')
        {
            this.bearer = process.env.TOKEN;
            this.url = process.env.BASE_URL + this.url;
        }
    }

    public getLoginUrl(environment:string):Observable<LoginUrlInterface>
    {
        let url:string;

        this.setAuthorization();
        this.setHeader();
        
        let sandbox:number = environment == 'sandbox' ? 1 : 0;

        url = this.url + 'login?sandbox=' + sandbox;

        return this.mapRequest(
            this.http.get(url, {headers: this.headers})
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
