import { getVariableValue } from '../variable';
import { type ElementHandler } from '../types';

function sanitizeHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '');
}

const variableHandler: ElementHandler = (element, requestVariables) => {
    const defaultValue = element.getAttribute('default');
    const getAttr = element.getAttribute('get');
    const sanitizeAttr = element.getAttribute('sanitize');

    if (getAttr) {
        let finalValue = getVariableValue(getAttr, requestVariables);

        if (finalValue === undefined || finalValue === null) {
            if (defaultValue !== null) {
                finalValue = defaultValue;
            } else {
                finalValue = `[SVH ERROR: Variable '${getAttr}' NOT FOUND]`;
            }
        } else {
            if (typeof finalValue === 'object') {
                finalValue = JSON.stringify(finalValue);
            }
        }

        if (sanitizeAttr === 'html') {
            finalValue = sanitizeHtml(String(finalValue));
        }

        element.outerHTML = `<span svd-view="variable" svd-key="${getAttr}">${finalValue}</span>`;
    } else {
        element.outerHTML = '[SVH ERROR: variable tag missing "get" attribute]';
    }
};

export default variableHandler;