import { parseHTML } from 'linkedom';
import { translateDocument } from '../translator';
import type { ElementHandler } from '../types';
import { VariableMap } from '../variable';

const iterateHandler: ElementHandler = async (element, requestVariables) => {
    const over = element.getAttribute('over');
    const as = element.getAttribute('as');

    if (!over) {
        element.outerHTML = '[SVH ERROR: iterate tag missing "over" attribute]';
        return;
    }

    if (!as) {
        element.outerHTML = '[SVH ERROR: iterate tag missing "as" attribute]';
        return;
    }

    const parts = over.split('.');
    const varName = parts.shift()!;
    let data: any;

    if (requestVariables.has(varName)) {
        data = requestVariables.get(varName);
    }

    if (typeof data === 'string') {
        try {
            data = JSON.parse(data);
        } catch (e) {
            // Not a JSON string
        }
    }

    if (parts.length > 0) {
        let current = data;
        for (const part of parts) {
            if (current && typeof current === 'object' && part in current) {
                current = current[part];
            } else {
                current = undefined;
                break;
            }
        }
        data = current;
    }

    if (!Array.isArray(data)) {
        element.outerHTML = `[SVH ERROR: "over" attribute in iterate tag must be an array, but found ${typeof data}]`;
        return;
    }

    let resultHTML = '';
    for (const item of data) {
        const loopVariables = new VariableMap(requestVariables);
        loopVariables.set(as, item);
        const template = element.innerHTML;
        const doc = parseHTML(template).document;
        await translateDocument(doc, loopVariables);
        resultHTML += doc.toString();
    }

    element.outerHTML = resultHTML;
};

export default iterateHandler;
