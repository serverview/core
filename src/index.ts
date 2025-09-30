// index.ts

import { serve } from 'bun';
import { parseHTML } from 'linkedom';

// --- v0.0.1 HARDCODED CONFIGURATION ---
const PORT = 44080;
const FILE_PATH = `${import.meta.dir}/../tmp/index.svh`;
const SERVER_VERSION = '0.0.1';
// -------------------------------------

/**
 * The core translation logic: finds custom elements and replaces them.
 * @param document The linkedom Document object.
 */
function translateDocument(document: Document): void {
    const systemElements = document.querySelectorAll('system');

    systemElements.forEach(element => {
        const key = element.getAttribute('get');

        let finalValue: string;

        switch (key) {
            case 'version':
                finalValue = SERVER_VERSION;
                break;
            default:
                finalValue = `[SVH KEY '${key}' NOT FOUND]`;
        }

        if (key) {
            element.outerHTML = `<span svd-view="system" svd-key="${key}">${finalValue}</span>`;
        } else {
            element.outerHTML = '[SVH ERROR: system tag missing "get" attribute]';
        }
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