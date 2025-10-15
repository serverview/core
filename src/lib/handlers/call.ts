import { getMacro } from "../macro";
import type { ElementHandler } from "../types";
import { VariableMap } from "../variable";
import { parseHTML } from "linkedom";
import { translateDocument } from "../translator";

// Parser for JavaScript object literal-like strings
function parseObjectLiteral(str: string): { [key: string]: any } {
    let processedStr = str.trim();
    if (!processedStr.startsWith('{')) {
        processedStr = '{' + processedStr;
    }
    if (!processedStr.endsWith('}')) {
        processedStr = processedStr + '}';
    }
    // Add quotes to keys
    let jsonString = processedStr.replace(/([{,])\s*([a-zA-Z0-9_]+)\s*:/g, '$1"$2":');
    // Replace single quotes with double quotes
    jsonString = jsonString.replace(/'/g, '"');
    return JSON.parse(jsonString);
}

const callHandler: ElementHandler = async (element, requestVariables) => {
    const name = element.getAttribute("name");
    const withAttr = element.getAttribute("with");

    if (!name) {
        element.outerHTML = "[SVH ERROR: 'call' element missing 'name' attribute]";
        return;
    }

    const macro = getMacro(name);
    if (!macro) {
        element.outerHTML = `[SVH ERROR: Macro '${name}' not defined]`;
        return;
    }

    const macroVariables = new VariableMap(requestVariables);
    if (withAttr) {
        try {
            const params = parseObjectLiteral(withAttr);
            for (const key in params) {
                if (macro.params.includes(key)) {
                    macroVariables.set(key, params[key]);
                }
            }
        } catch (e) {
            element.outerHTML = `[SVH ERROR: Invalid 'with' attribute: ${e}]`;
            return;
        }
    }

    const doc = parseHTML(macro.content).document;
    await translateDocument(doc, macroVariables);
    element.outerHTML = doc.toString();
}

export default callHandler;
