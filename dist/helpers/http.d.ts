import { IDataObject, IExecuteFunctions, IHttpRequestMethods } from 'n8n-workflow';
export interface RequestOptions {
    url: string;
    body?: IDataObject;
    method?: IHttpRequestMethods;
}
export declare function xr2GetRequest(this: IExecuteFunctions, options: RequestOptions): Promise<any>;
export declare function xr2Request(this: IExecuteFunctions, options: RequestOptions): Promise<any>;
