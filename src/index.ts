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
type ElementHandler = (element: Element) => void | Promise<void>;
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
        console.log(`Including file: ${resolvedPath}`);
        const fileContent = await file.text();
        const doc = parseHTML(fileContent).document;
        await translateDocument(doc);
        element.outerHTML = doc.toString();
    } catch (error) {
        element.outerHTML = `[SVH ERROR: error including file at '${src}': ${error instanceof Error ? error.message : "Unknown error"}]`;
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
async function translateDocument(document: Document): Promise<void> {
    let changed = true;
    while (changed) {
        changed = false;
        for (const [tagName, handler] of elementHandlers.entries()) {
            const elements = document.querySelectorAll(tagName);
            if (elements.length > 0) {
                changed = true;
                for (const element of Array.from(elements)) {
                    await handler(element);
                }
            }
        }
    }
}

// Start the Bun Server
serve({
    port: PORT,
    async fetch(request) {
        console.log(`--- New Request: ${request.url} ---`);
        const url = new URL(request.url);
        
        let requestedPath = path.join(BASE_PATH, url.pathname);
        // If the pathname is root, the join might add a trailing slash.
        // Let's remove it if it's not the only character.
        if (requestedPath.length > 1 && requestedPath.endsWith('/')) {
            requestedPath = requestedPath.slice(0, -1);
        }

        console.log(`BASE_PATH: ${BASE_PATH}`);
        console.log(`url.pathname: ${url.pathname}`);
        console.log(`Final requestedPath: ${requestedPath}`);

        // Security check to prevent directory traversal
        const resolvedPath = path.resolve(requestedPath);
        const resolvedBasePath = path.resolve(BASE_PATH);
        console.log(`Resolved Path: ${resolvedPath}`);
        console.log(`Resolved BASE_PATH: ${resolvedBasePath}`);
        if (!resolvedPath.startsWith(resolvedBasePath)) {
            console.log(`Forbidden: Path is outside of base path.`);
            return new Response("Forbidden", { status: 403 });
        }

        let file = Bun.file(requestedPath);
        let isDirectory = false;
        try {
            isDirectory = (await file.stat()).isDirectory();
            console.log(`Path exists. Is directory: ${isDirectory}`);
        } catch (e) {
            console.log(`File or directory not found at ${requestedPath}`);
            return new Response("Not Found", { status: 404 });
        }

        // If path is a directory, look for index files
        if (isDirectory) {
            console.log(`${requestedPath} is a directory. Searching for index files...`);
            let foundIndex = false;
            for (const indexName of INDEX_FILES) {
                const indexFilePath = path.join(requestedPath, indexName);
                console.log(`Checking for index file: ${indexFilePath}`);
                const indexFile = Bun.file(indexFilePath);
                if (await indexFile.exists()) {
                    console.log(`Found index file: ${indexFilePath}`);
                    file = indexFile;
                    foundIndex = true;
                    break;
                } else {
                    console.log(`Index file not found: ${indexFilePath}`);
                }
            }
            if (!foundIndex) {
                console.log(`No index file found in ${requestedPath}`);
                return new Response("Not Found", { status: 404 });
            }
        }

        console.log(`Serving file: ${file.name}`);
        // Process .svh files or serve others directly
        if (file.name && file.name.endsWith('.svh')) {
            console.log(`Processing as .svh file.`);
            try {
                const fileContent = await file.text();
                const document = parseHTML(fileContent).document;
                await translateDocument(document);
                return new Response(document.toString(), {
                    headers: { 'Content-Type': 'text/html' },
                });
            } catch (error) {
                console.error("Error processing request:", error);
                return new Response(`Error loading or processing file: ${error instanceof Error ? error.message : "Unknown error"}`, { status: 500 });
            }
        } else {
            console.log(`Serving as static file.`);
            return new Response(file);
        }
    },
});

console.log(`\n🎉 SVH Server v${SV_VERSION} is running on http://localhost:${PORT}`);
console.log(`Serving files from base path: ${BASE_PATH}`);
console.log(`Index files: ${INDEX_FILES.join(', ')}`);