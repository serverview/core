// index.ts

import { serve } from 'bun';
import { parseHTML } from 'linkedom';

// --- v0.0.1 HARDCODED CONFIGURATION ---
const PORT = 44080;
const FILE_PATH = `${import.meta.dir}/../tmp/index.svh`;
const SERVER_VERSION = '0.0.2';
// -------------------------------------

// --- DYNAMIC REGISTRATION ---

// -- System Variables --
const systemVariables = new Map<string, () => string>();
systemVariables.set('version', () => SERVER_VERSION);
// To add a new variable, use:
// systemVariables.set('new_key', () => 'some_value');

// -- Element Handlers --
type ElementHandler = (element: Element) => void;
const elementHandlers = new Map<string, ElementHandler>();

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

// To add a new element handler, use:
// elementHandlers.set('new-tag', (element) => { /* ... custom logic ... */ });

// --------------------------

/**
 * The core translation logic: finds custom elements and replaces them.
 * This function loops until no more custom elements are found, allowing for nested elements.
 * @param document The linkedom Document object.
 */
function translateDocument(document: Document): void {
    let changed = true;
    while (changed) {
        changed = false;
        for (const [tagName, handler] of elementHandlers.entries()) {
            const elements = document.querySelectorAll(tagName);
            if (elements.length > 0) {
                changed = true;
                elements.forEach(element => handler(element));
            }
        }
    }
}

// Start the Bun Server
serve({
    port: PORT,
    async fetch(request) {
        try {
            // 1. Read the source file content (Synchronous for simplicity here)
            const fileContent = await Bun.file(FILE_PATH).text();

            // 2. Parse the HTML content into a mutable DOM tree using linkedom
            const document = parseHTML(fileContent).document;

            // 3. TRANSLATION: Process custom elements
            translateDocument(document);

            // 4. Serialize and serve the modified HTML
            return new Response(document.toString(), {
                headers: { 'Content-Type': 'text/html' },
            });

        } catch (error) {
            console.error("Error processing request:", error);
            return new Response(`Error loading or processing file: ${error instanceof Error ? error.message : "Unknown error"}`, { status: 500 });
        }
    },
});

console.log(`\n🎉 SVH Server v${SERVER_VERSION} is running on http://localhost:${PORT}`);
console.log(`Serving hardcoded file: ${FILE_PATH}`);