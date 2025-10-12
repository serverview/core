import { type VariableMap } from '../variable';
import { type ElementHandler } from '../types';

const setHandler: ElementHandler = (element, requestVariables) => {
    const as = element.getAttribute('as');
    const value = element.getAttribute('value');

    if (!as || !value) {
        element.outerHTML = '[SVH ERROR: set tag missing "as" or "value" attribute]';
        return;
    }

    requestVariables.set(as, value);
    element.remove();
};

export default setHandler;
