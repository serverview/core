import type { VariableMap } from '../variable';
import { ElementHandler } from '../types';

const fetchHandler: ElementHandler = async (element, requestVariables) => {
    const from = element.getAttribute("from");
    const varName = element.getAttribute("as");

    if (!from) {
        element.outerHTML = '[SVH ERROR: fetch tag missing "from" attribute]';
        return;
    }

    if (!varName) {
        element.outerHTML = '[SVH ERROR: fetch tag missing "as" attribute]';
        return;
    }

    try {
        let fetchUrl = from;
        if (from.startsWith('/')) {
            const baseUrl = requestVariables.get('request.baseUrl');
            if (baseUrl) {
                fetchUrl = `${baseUrl}${from}`;
            }
        }
        const response = await fetch(fetchUrl);
        if (response.ok) {
            const content = await response.text();
            requestVariables.set(varName, content);
        } else {
            requestVariables.set(varName, `[SVH ERROR: fetch failed with status ${response.status}]`);
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        requestVariables.set(varName, `[SVH ERROR: fetch failed: ${message}]`);
    }

    element.outerHTML = '';
};

export default fetchHandler;