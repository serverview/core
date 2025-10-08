export type Key = string;
export type Value = any; 

export type VariableMap = Map<Key, Value>;

export const globalVariable: VariableMap = new Map();

export function initializeRequestVariables(request: Request): VariableMap {
    const requestVariables: VariableMap = new Map();
    requestVariables.set('request.url', request.url);
    // Add other request-specific variables here
    return requestVariables;
}