
import { elementHandlers } from "./handlers";
import { VariableMap } from "./variable";

/**
 * The core translation logic: finds custom elements and replaces them.
 * This function loops until no more custom elements are found, allowing for nested elements.
 * It now respects handler priorities to ensure correct execution order.
 * @param document The linkedom Document object.
 * @param requestVariables The map of request-specific variables.
 */
export async function translateDocument(document: Document, requestVariables: VariableMap): Promise<void> {
    let changedInLoop = true;
    while (changedInLoop) {
        changedInLoop = false;

        // Process handlers based on priority
        for (let priority = 1; priority <= 4; priority++) {
            let changedInPriority = true;
            while (changedInPriority) {
                changedInPriority = false;
                const elements = document.querySelectorAll('*');
                
                for (const element of Array.from(elements)) {
                    if (!document.contains(element)) {
                        continue;
                    }

                    const handler = elementHandlers.get(element.tagName.toLowerCase());
                    if (handler && handler.priority === priority) {
                        await handler.execute(element, requestVariables);
                        changedInPriority = true;
                        changedInLoop = true;
                        // Restart scanning for the current priority
                        break; 
                    }
                }
            }
        }
    }
}
