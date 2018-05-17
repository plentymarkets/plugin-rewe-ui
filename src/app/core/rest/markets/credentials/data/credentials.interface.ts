import {TerraPagerInterface} from "@plentymarkets/terra-components";
import {CredentialInterface} from "./credential.interface";

export interface CredentialsInterface extends TerraPagerInterface
{
    entries:Array<CredentialInterface>;
}