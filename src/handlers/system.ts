import { SV_VERSION } from '../config';
import { VariableMap } from '../variable';
import { ElementHandler } from '../types';

const systemVariables = new Map<string, () => string>();
systemVariables.set('version', () => SV_VERSION);

const systemHandler: ElementHandler = (element, requestVariables) => {
    const key = element.getAttribute('get');
    if (key) {
        let finalValue = `[SVH KEY '${key}' NOT FOUND]`;
        if (requestVariables.has(key)) {
            finalValue = requestVariables.get(key)!;
        } else {
            const handler = systemVariables.get(key);
            if (handler) {
                finalValue = handler();
            }
        }
        element.outerHTML = `<span svd-view="system" svd-key="${key}">${finalValue}</span>`;
    } else {
        element.outerHTML = '[SVH ERROR: system tag missing "get" attribute]';
    }
};

export default systemHandler;