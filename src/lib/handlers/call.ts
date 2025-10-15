import { getMacro } from "../macro";
import type { ElementHandler } from "../types";
import { VariableMap } from "../variable";
import { parseHTML } from "linkedom";
import { translateDocument } from "../translator";

// Simple parser for JavaScript object literal-like strings
function parseObjectLiteral(str: string): { [key: string]: any } {
    const obj: { [key: string]: any } = {};
    // Remove outer curly braces if present
    if (str.startsWith('{') && str.endsWith('}')) {
        str = str.slice(1, -1);
    }
    // Split by comma, but not inside quotes
    const pairs = str.match(/('[^']*'|"[^"]*"|[^,])+/g) || [];

    for (const pair of pairs) {
        const parts = pair.split(':');
        if (parts.length === 2) {
            let key = parts[0]!.trim();
            let value = parts[1]!.trim();

            // Remove quotes from key if present
            if ((key.startsWith('\'') && key.endsWith('\'')) || (key.startsWith('"') && key.endsWith('"'))) {
                key = key.slice(1, -1);
            }

            // Remove quotes from value if present
            if ((value.startsWith('\'') && value.endsWith('\'')) || (value.startsWith('"') && value.endsWith('"'))) {
                value = value.slice(1, -1);
            }
            obj[key] = value;
        }
    }
    return obj;
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
