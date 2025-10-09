export type Key = string;
export type Value = any; 

export class VariableMap extends Map<Key, Value> {}

export const globalVariable: VariableMap = new VariableMap();

export function initializeRequestVariables(request: Request): VariableMap {
    const requestVariables: VariableMap = new VariableMap();
    const url = new URL(request.url);
    requestVariables.set('request', {
        url: request.url,
        baseUrl: `${url.protocol}//${url.host}`
    });
    // Add other request-specific variables here
    return requestVariables;
}