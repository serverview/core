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

export function getVariableValue(path: string, requestVariables: VariableMap): any {
    if (!path) return undefined;

    let operation: string | null = null;
    if (path.includes(':')) {
        const parts = path.split(':');
        path = parts[0]!;
        operation = parts[1]!;
    }

    const parts = path.split('.');
    const varName = parts.shift()!;
    let current: any;

    if (requestVariables.has(varName)) {
        current = requestVariables.get(varName);
    } else if (globalVariable.has(varName)) {
        current = globalVariable.get(varName);
    } else {
        return undefined;
    }

    // Auto-parse JSON strings
    if (typeof current === 'string') {
        try { current = JSON.parse(current); } catch (e) { /* ignore */ }
    }

    // Traverse nested properties
    for (const part of parts) {
        if (current === null || current === undefined) return undefined;
        if (Array.isArray(current)) {
            current = current.map(item => item && item[part]);
        } else if (typeof current === 'object' && part in current) {
            current = current[part];
        } else {
            return undefined;
        }
    }

    if (operation) {
        if (operation === 'length') {
            if (Array.isArray(current) || typeof current === 'string') {
                return current.length;
            } else {
                return `[SVH ERROR: 'length' operation can only be used on arrays and strings]`;
            }
        } else {
            return `[SVH ERROR: Unknown operation '${operation}']`;
        }
    }

    return current;
}