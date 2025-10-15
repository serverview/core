import { defineMacro } from "../macro";
import type { ElementHandler } from "../types";

const defineHandler: ElementHandler = (element, requestVariables) => {
    const name = element.getAttribute("name");
    const params = element.getAttribute("params")?.split(',').map(p => p.trim()) || [];
    const content = element.innerHTML;

    if (!name) {
        element.outerHTML = "[SVH ERROR: 'define' element missing 'name' attribute]";
        return;
    }

    defineMacro(name, params, content);
    element.outerHTML = "";
}

export default defineHandler;