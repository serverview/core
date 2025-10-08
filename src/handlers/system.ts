import { SV_VERSION } from '../config';
import { VariableMap } from '../variable';
import { ElementHandler } from '../types';

const systemVariables = new Map<string, () => string>();
systemVariables.set('version', () => SV_VERSION);

const systemHandler: ElementHandler = (element, requestVariables) => {
    const path = element.getAttribute('get');
    if (path) {
        const parts = path.split('.');
        const varName = parts.shift()!;
        let finalValue: any;

        let baseValue: any;
        if (requestVariables.has(varName)) {
            baseValue = requestVariables.get(varName);
        } else {
            const handler = systemVariables.get(varName);
            if (handler) {
                baseValue = handler();
            }
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

        element.outerHTML = `<span svd-view="system" svd-key="${path}">${finalValue}</span>`;
    } else {
        element.outerHTML = '[SVH ERROR: system tag missing "get" attribute]';
    }
};

export default systemHandler;