import { IDataObject } from 'n8n-workflow';
export declare const BASE_URL = "https://xr2.uk";
export interface RequestOptions {
    url: string;
    body?: IDataObject;
    method?: string;
    json?: boolean;
}
export declare function xr2GetRequest(this: any, options: RequestOptions): Promise<any>;
export declare function xr2Request(this: any, options: RequestOptions): Promise<any>;
