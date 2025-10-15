import { parseHTML } from 'linkedom';
import path from 'path';
import { BASE_PATH } from '../../config';
import { translateDocument } from '../translator';
import { type ElementHandler } from '../types';
import { fileCache } from '../cache';

const includeHandler: ElementHandler = async (element, requestVariables) => {
    const from = element.getAttribute('from');

    if(!from){
        element.outerHTML = '[SVH ERROR: include tag missing "from" attribute]';
        return;
    }

    const resolvedPath = path.resolve(BASE_PATH, from);

    // Security check to prevent directory traversal
    const resolvedBasePath = path.resolve(BASE_PATH);
    if (!resolvedPath.startsWith(resolvedBasePath)) {
        element.outerHTML = '[SVH ERROR: include "from" attribute points outside of base path]';
        return;
    }

    let fileContent: string | undefined = fileCache.get(resolvedPath);

    if (fileContent === undefined) {
        const file = Bun.file(resolvedPath);
        if (!await file.exists()) {
            element.outerHTML = `[SVH ERROR: include file not found at '${from}']`;
            return;
        }
        fileContent = await file.text();
        fileCache.set(resolvedPath, fileContent);
    }

    try {
        if (from.endsWith('.svh')) {
            const doc = parseHTML(fileContent).document;
            await translateDocument(doc, requestVariables);
            element.outerHTML = doc.toString();
        } else {
            element.outerHTML = fileContent;
        }
    } catch (error) {
        element.outerHTML = `[SVH ERROR: error including file at '${from}': ${error instanceof Error ? error.message : "Unknown error"}]`;
    }
};

export default includeHandler;