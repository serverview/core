import { VariableMap, globalVariable } from '../variable';
import { ElementHandler } from '../types';

const variableHandler: ElementHandler = (element, requestVariables) => {
    const path = element.getAttribute('get');
    if (path) {
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

        if (typeof finalValue === 'object') {
            finalValue = JSON.stringify(finalValue);
        }

        if (finalValue === undefined) {
            finalValue = `[SVH KEY '${path}' NOT FOUND]`;
        }

        element.outerHTML = `<span svd-view="variable" svd-key="${path}">${finalValue}</span>`;
    } else {
        element.outerHTML = '[SVH ERROR: variable tag missing "get" attribute]';
    }
};

export default variableHandler;