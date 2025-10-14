import { getVariableValue } from '../variable';
import { type ElementHandler } from '../types';

const variableHandler: ElementHandler = (element, requestVariables) => {
    const getAttr = element.getAttribute('get');
    if (getAttr) {
        let finalValue = getVariableValue(getAttr, requestVariables);

        if (typeof finalValue === 'object') {
            finalValue = JSON.stringify(finalValue);
        }

        if (finalValue === undefined) {
            finalValue = `[SVH KEY '${getAttr}' NOT FOUND]`;
        }

        element.outerHTML = `<span svd-view="variable" svd-key="${getAttr}">${finalValue}</span>`;
    } else {
        element.outerHTML = '[SVH ERROR: variable tag missing "get" attribute]';
    }
};

export default variableHandler;