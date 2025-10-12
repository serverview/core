
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
        const elements = document.querySelectorAll('*');
        for (const element of Array.from(elements)) {
            // The element might have been removed by a previous handler
            if (!document.contains(element)) {
                continue;
            }
            const handler = elementHandlers.get(element.tagName.toLowerCase());
            if (handler) {
                await handler(element, requestVariables);
                changed = true;
                // Since the DOM has changed, we need to restart the loop
                break; 
            }
        }
    }
}
