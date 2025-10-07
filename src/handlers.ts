
import { parseHTML } from 'linkedom';
import path from 'path';
import { BASE_PATH, SV_VERSION } from './config';
import { translateDocument } from './translator';

// -- System Variables --
const systemVariables = new Map<string, () => string>();
systemVariables.set('version', () => SV_VERSION);
// To add a new variable, use:
// systemVariables.set('new_key', () => 'some_value');

// -- Element Handlers --
export type ElementHandler = (element: Element) => void | Promise<void>;
export const elementHandlers = new Map<string, ElementHandler>();

// Handler for <system> elements
elementHandlers.set('system', (element) => {
    const key = element.getAttribute('get');
    if (key) {
        const handler = systemVariables.get(key);
        const finalValue = handler ? handler() : `[SVH KEY '${key}' NOT FOUND]`;
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
elementHandlers.set("include", async (element) => {
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
            await translateDocument(doc);
            element.outerHTML = doc.toString();
        } else {
            element.outerHTML = fileContent;
        }
    } catch (error) {
        element.outerHTML = `[SVH ERROR: error including file at '${src}': ${error instanceof Error ? error.message : "Unknown error"}]`;
    }
});
