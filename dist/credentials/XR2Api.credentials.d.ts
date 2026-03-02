import { IAuthenticateGeneric, ICredentialTestRequest, ICredentialType, INodeProperties } from 'n8n-workflow';
export declare class XR2Api implements ICredentialType {
    name: string;
    displayName: string;
    icon: {
        readonly light: "file:../nodes/XR2/xr2-logo.svg";
        readonly dark: "file:../nodes/XR2/xr2-logo.svg";
    };
    documentationUrl: string;
    properties: INodeProperties[];
    authenticate: IAuthenticateGeneric;
    test: ICredentialTestRequest;
}
