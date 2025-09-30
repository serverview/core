// index.ts

import { serve } from 'bun';
import { parseHTML } from 'linkedom';
import * as pkg from "../package.json";
import path from 'path';

// --- CONFIGURATION ---
const PORT = Bun.env.PORT || 44080;
const BASE_PATH = Bun.env.BASE_PATH || '/var/www/svh';
const SV_VERSION = pkg.version;
const INDEX_FILES = (Bun.env.INDEX_FILES || 'index.svh,index.html').split(',');
// ---------------------

// --- DYNAMIC REGISTRATION ---

// -- System Variables --
const systemVariables = new Map<string, () => string>();
systemVariables.set('version', () => SV_VERSION);
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
        const url = new URL(request.url);
        const requestedPath = path.join(BASE_PATH, url.pathname);

        // Security check to prevent directory traversal
        if (!path.resolve(requestedPath).startsWith(path.resolve(BASE_PATH))) {
            return new Response("Forbidden", { status: 403 });
        }

        let file = Bun.file(requestedPath);
        let fileExists = await file.exists();

        // If path is a directory, look for index files
        if (fileExists && (await file.stat()).isDirectory()) {
            let foundIndex = false;
            for (const indexName of INDEX_FILES) {
                const indexFilePath = path.join(requestedPath, indexName);
                const indexFile = Bun.file(indexFilePath);
                if (await indexFile.exists()) {
                    file = indexFile;
                    foundIndex = true;
                    break;
                }
            }
            if (!foundIndex) {
                return new Response("Not Found", { status: 404 });
            }
        } else if (!fileExists) {
            return new Response("Not Found", { status: 404 });
        }

        // Process .svh files or serve others directly
        if (file.name && file.name.endsWith('.svh')) {
            try {
                const fileContent = await file.text();
                const document = parseHTML(fileContent).document;
                translateDocument(document);
                return new Response(document.toString(), {
                    headers: { 'Content-Type': 'text/html' },
                });
            } catch (error) {
                console.error("Error processing request:", error);
                return new Response(`Error loading or processing file: ${error instanceof Error ? error.message : "Unknown error"}`, { status: 500 });
            }
        } else {
            return new Response(file);
        }
    },
});

console.log(`\n🎉 SVH Server v${SV_VERSION} is running on http://localhost:${PORT}`);
console.log(`Serving files from base path: ${BASE_PATH}`);
console.log(`Index files: ${INDEX_FILES.join(', ')}`);