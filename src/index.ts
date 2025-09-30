// index.ts

import { serve } from 'bun';
import { parseHTML } from 'linkedom';

// --- v0.0.1 HARDCODED CONFIGURATION ---
const PORT = 44080;
const FILE_PATH = `${import.meta.dir}/../tmp/index.svh`;
const SERVER_VERSION = '0.0.1';
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

// To add a new element handler, use:
// elementHandlers.set('new-tag', (element) => { /* ... custom logic ... */ });

// --------------------------

/**
 * The core translation logic: finds custom elements and replaces them.
 * @param document The linkedom Document object.
 */
function translateDocument(document: Document): void {
    elementHandlers.forEach((handler, tagName) => {
        const elements = document.querySelectorAll(tagName);
        elements.forEach(element => handler(element));
    });
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