import { globalVariable } from '../variable';
import { type ElementHandler } from '../types';

const variableHandler: ElementHandler = (element, requestVariables) => {
    const getAttr = element.getAttribute('get');
    if (getAttr) {
        let path = getAttr;
        let operation: string | null = null;

        if (path.includes(':')) {
            const parts = path.split(':');
            path = parts[0]!;
            operation = parts[1]!;
        }

        const parts = path.split('.');
        const varName = parts.shift()!;
        let finalValue: any;

        let baseValue: any;
        if (globalVariable.has(varName)) {
            baseValue = globalVariable.get(varName);
        } else if (requestVariables.has(varName)) {
            baseValue = requestVariables.get(varName);
        }

        if (typeof baseValue === 'string') {
            try {
                baseValue = JSON.parse(baseValue);
            } catch (e) {
                // Not a JSON string
            }
        }

        if (parts.length > 0) {
            let current = baseValue;
            for (const part of parts) {
                if (current && typeof current === 'object' && part in current) {
                    current = current[part];
                } else {
                    current = undefined;
                    break;
                }
            }
            finalValue = current;
        } else {
            finalValue = baseValue;
        }

        if (operation) {
            if (operation === 'length') {
                if (Array.isArray(finalValue) || typeof finalValue === 'string') {
                    finalValue = finalValue.length;
                } else {
                    finalValue = `[SVH ERROR: 'length' operation can only be used on arrays and strings]`;
                }
            } else {
                finalValue = `[SVH ERROR: Unknown operation '${operation}']`;
            }
        }

        if (typeof finalValue === 'object') {
            finalValue = JSON.stringify(finalValue);
        }

        if (finalValue === undefined) {
            finalValue = `[SVH KEY '${path}' NOT FOUND]`;
        }

        element.outerHTML = `<span svd-view="variable" svd-key="${getAttr}">${finalValue}</span>`;
    } else {
        element.outerHTML = '[SVH ERROR: variable tag missing "get" attribute]';
    }
};

export default variableHandler;