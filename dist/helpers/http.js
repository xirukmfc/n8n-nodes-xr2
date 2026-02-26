"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.xr2GetRequest = xr2GetRequest;
exports.xr2Request = xr2Request;
const n8n_workflow_1 = require("n8n-workflow");
/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any */
function handleXr2Error(error) {
    var _a, _b, _c;
    // n8n error objects carry arbitrary fields (httpCode, statusCode, response, etc.)
    const err = error;
    const res = ((_a = err.response) !== null && _a !== void 0 ? _a : {});
    const causeRes = ((_c = (_b = err.cause) === null || _b === void 0 ? void 0 : _b.response) !== null && _c !== void 0 ? _c : {});
    // Extract status code from various possible locations
    const rawStatusCode = err.httpCode || err.statusCode || err.status ||
        res.statusCode || res.status;
    const statusCode = rawStatusCode !== undefined && rawStatusCode !== null
        ? Number(rawStatusCode)
        : undefined;
    const statusForMessage = Number.isFinite(statusCode) ? statusCode : rawStatusCode;
    // Extract error details from response body - check multiple locations
    let apiResponse = null;
    // n8n puts the response in error.errorResponse
    const possibleBodies = [
        err.errorResponse,
        res.body,
        causeRes.body,
        err.body,
        err.data,
    ];
    for (const body of possibleBodies) {
        if (body) {
            try {
                apiResponse = typeof body === 'string' ? JSON.parse(body) : body;
                break;
            }
            catch {
                // continue to next
            }
        }
    }
    // Extract detailed error message from API response
    let apiErrorMessage = '';
    let apiSuggestion = '';
    if (apiResponse === null || apiResponse === void 0 ? void 0 : apiResponse.detail) {
        const detail = apiResponse.detail;
        if (typeof detail === 'object') {
            apiErrorMessage = (detail.message || detail.error || '');
            apiSuggestion = (detail.suggestion || '');
            if (Array.isArray(detail.available_statuses)) {
                apiSuggestion += `\nAvailable statuses: ${detail.available_statuses.join(', ')}`;
            }
            if (detail.slug) {
                apiErrorMessage = `[${detail.slug}] ${apiErrorMessage}`;
            }
        }
        else {
            apiErrorMessage = String(detail);
        }
    }
    // Build error message
    let errorMessage = '';
    let suggestions = '';
    if (statusCode === 401 || statusCode === 403) {
        errorMessage = '🔐 Authentication Failed';
        suggestions = apiErrorMessage || 'Please verify:\n' +
            '✓ Your API key is correct in n8n credentials\n' +
            '✓ The API key starts with "xr2_prod_"\n' +
            '✓ The API key is active in your xR2 account';
    }
    else if (statusCode === 404) {
        errorMessage = '❌ ' + (apiErrorMessage || 'Resource Not Found');
        suggestions = apiSuggestion || 'Please check:\n' +
            '✓ The prompt slug is correct (no typos)\n' +
            '✓ The prompt has a deployed (production) version\n' +
            '✓ You have access to this resource in your workspace';
    }
    else if (statusCode === 429) {
        errorMessage = '⏱️ Rate Limit Exceeded';
        suggestions = apiErrorMessage || 'Too many requests. Please wait a moment and try again.';
    }
    else if (statusCode && statusCode >= 500) {
        errorMessage = '🔧 Server Error';
        suggestions = apiErrorMessage || 'xR2 server is experiencing issues. Please try again in a few moments.';
    }
    else {
        errorMessage = '⚠️ ' + (apiErrorMessage || error.message || 'Request Failed');
        suggestions = apiSuggestion || '';
    }
    // Combine message with details
    let fullMessage = errorMessage;
    if (suggestions) {
        fullMessage += `\n\n💡 ${suggestions}`;
    }
    if (statusForMessage !== undefined) {
        fullMessage += `\n\n🔍 HTTP Status: ${statusForMessage}`;
    }
    // Create enhanced error object
    const enhancedError = {
        ...error,
        message: fullMessage,
        httpCode: statusForMessage || 'unknown',
        description: fullMessage,
        statusCode: statusForMessage,
    };
    throw new n8n_workflow_1.NodeApiError(this.getNode(), enhancedError);
}
async function xr2GetRequest(options) {
    const requestOptions = {
        method: 'GET',
        ...options,
    };
    try {
        return await this.helpers.httpRequestWithAuthentication.call(this, 'xr2Api', requestOptions);
    }
    catch (error) {
        throw handleXr2Error.call(this, error);
    }
}
async function xr2Request(options) {
    const requestOptions = {
        method: 'POST',
        ...options,
    };
    try {
        return await this.helpers.httpRequestWithAuthentication.call(this, 'xr2Api', requestOptions);
    }
    catch (error) {
        throw handleXr2Error.call(this, error);
    }
}
