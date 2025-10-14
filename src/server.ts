
import { serve } from 'bun';
import { parseHTML } from 'linkedom';
import path from 'path';
import { PORT, BASE_PATH, INDEX_FILES } from './config';
import { translateDocument } from './lib/translator';
import { initializeRequestVariables } from './lib/variable';

// Start the Bun Server
export function startServer() {
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
                    const requestVariables = initializeRequestVariables(request);
                    requestVariables.set('request.baseUrl', url.origin);
                    await translateDocument(document, requestVariables);
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
}
