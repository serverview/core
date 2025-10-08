
import { elementHandlers } from "./handlers";
import { VariableMap } from "./variable";

/**
 * The core translation logic: finds custom elements and replaces them.
 * This function loops until no more custom elements are found, allowing for nested elements.
 * @param document The linkedom Document object.
 * @param requestVariables The map of request-specific variables.
 */
export async function translateDocument(document: Document, requestVariables: VariableMap): Promise<void> {
    let changed = true;
    while (changed) {
        changed = false;
        for (const [tagName, handler] of elementHandlers.entries()) {
            const elements = document.querySelectorAll(tagName);
            if (elements.length > 0) {
                changed = true;
                for (const element of Array.from(elements)) {
                    await handler(element, requestVariables);
                }
            }
        }
    }
}
