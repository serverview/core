
import { parseHTML } from 'linkedom';
import path from 'path';
import { BASE_PATH, SV_VERSION } from './config';
import { translateDocument } from './translator';
import { type VariableMap, globalVariable } from './variable';

// -- System Variables --
const systemVariables = new Map<string, () => string>();
systemVariables.set('version', () => SV_VERSION);
// To add a new variable, use:
// systemVariables.set('new_key', () => 'some_value');

// -- Element Handlers --
export type ElementHandler = (element: Element, requestVariables: VariableMap) => void | Promise<void>;
export const elementHandlers = new Map<string, ElementHandler>();

// Handler for <system> elements
elementHandlers.set('system', (element, requestVariables) => {
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
});

// Handler for <condition> elements
elementHandlers.set('condition', (element) => {
    const isAttr = element.getAttribute('is');
    if (!isAttr) {
        element.outerHTML = '[SVH ERROR: condition tag missing "is" attribute]';
        return;
    }
    const condition = isAttr.trim().toLowerCase();

    // Get container tag, default to 'div'
    const defaultContainerTag = element.getAttribute('container') || 'div';

    if (condition === 'true' || condition === 'false') {
        let finalValue: string;
        let containerTag = defaultContainerTag;

        if (condition === 'true') {
            const thenElem = element.querySelector('then');
            if (thenElem) {
                finalValue = thenElem.innerHTML;
                containerTag = thenElem.getAttribute('container') || defaultContainerTag;
            } else {
                finalValue = element.innerHTML;
            }
        } else { // condition === 'false'
            const elseElem = element.querySelector('else');
            if (elseElem) {
                finalValue = elseElem.innerHTML;
                containerTag = elseElem.getAttribute('container') || defaultContainerTag;
            } else {
                finalValue = '';
            }
        }
        element.outerHTML = `<${containerTag} svd-condition="${condition}">${finalValue}</${containerTag}>`;
    } else {
        element.outerHTML = `[SVH ERROR: condition tag "is" attribute must be 'true' or 'false']`;
    }
});

// Handler for <include> elements
elementHandlers.set("include", async (element, requestVariables) => {
    const src = element.getAttribute('src');

    if(!src){
        element.outerHTML = '[SVH ERROR: include tag missing "src" attribute]';
        return;
    }

    const resolvedPath = path.resolve(BASE_PATH, src);

    // Security check to prevent directory traversal
    const resolvedBasePath = path.resolve(BASE_PATH);
    if (!resolvedPath.startsWith(resolvedBasePath)) {
        element.outerHTML = '[SVH ERROR: include "src" attribute points outside of base path]';
        return;
    }

    const file = Bun.file(resolvedPath);
    if (!await file.exists()) {
        element.outerHTML = `[SVH ERROR: include file not found at '${src}']`;
        return;
    }

    try {
        const fileContent = await file.text();
        if (src.endsWith('.svh')) {
            const doc = parseHTML(fileContent).document;
            await translateDocument(doc, requestVariables);
            element.outerHTML = doc.toString();
        } else {
            element.outerHTML = fileContent;
        }
    } catch (error) {
        element.outerHTML = `[SVH ERROR: error including file at '${src}': ${error instanceof Error ? error.message : "Unknown error"}]`;
    }
});

// Handler for <fetch> elements
elementHandlers.set("fetch", async (element, requestVariables) => {
    const href = element.getAttribute("href");
    const varName = element.getAttribute("as");

    if (!href) {
        element.outerHTML = '[SVH ERROR: fetch tag missing "href" attribute]';
        return;
    }

    if (!varName) {
        element.outerHTML = '[SVH ERROR: fetch tag missing "as" attribute]';
        return;
    }

    try {
        let fetchUrl = href;
        if (href.startsWith('/')) {
            const baseUrl = requestVariables.get('request.baseUrl');
            if (baseUrl) {
                fetchUrl = `${baseUrl}${href}`;
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
});

// Handler for <variable> elements
elementHandlers.set('variable', (element, requestVariables) => {
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
});