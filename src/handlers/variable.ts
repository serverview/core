import { VariableMap, globalVariable } from '../variable';
import { ElementHandler } from '../types';

const variableHandler: ElementHandler = (element, requestVariables) => {
    const key = element.getAttribute('get');
    if (key) {
        let finalValue = `[SVH KEY '${key}' NOT FOUND]`;
        if (globalVariable.has(key)) {
            finalValue = globalVariable.get(key)!;
        } else if (requestVariables.has(key)) {
            finalValue = requestVariables.get(key)!;
        }
        element.outerHTML = `<span svd-view="variable" svd-key="${key}">${finalValue}</span>`;
    } else {
        element.outerHTML = '[SVH ERROR: variable tag missing "get" attribute]';
    }
};

export default variableHandler;