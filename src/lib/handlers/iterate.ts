import { parseHTML } from 'linkedom';
import { translateDocument } from '../translator';
import type { ElementHandler } from '../types';
import { VariableMap, getVariableValue } from '../variable';

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

    const data = getVariableValue(over, requestVariables);

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
