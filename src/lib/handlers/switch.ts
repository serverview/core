import { getVariableValue } from '../variable';
import { type ElementHandler } from '../types';

const switchHandler: ElementHandler = (element, requestVariables) => {
    const onAttr = element.getAttribute('on');
    if (!onAttr) {
        element.outerHTML = '[SVH ERROR: switch tag missing "on" attribute]';
        return;
    }

    const switchValue = getVariableValue(onAttr, requestVariables);

    let finalValue = '';
    let caseFound = false;

    const caseElements = Array.from(element.children);
    for (const caseElement of caseElements) {
        if (caseElement.tagName.toLowerCase() === 'case') {
            const isAttr = caseElement.getAttribute('is');
            if (isAttr === null) continue;

            let caseValue;
            if (isAttr.startsWith("'") && isAttr.endsWith("'")) {
                caseValue = isAttr.slice(1, -1);
            } else {
                caseValue = getVariableValue(isAttr, requestVariables);
            }

            if (switchValue === caseValue) {
                finalValue = caseElement.innerHTML;
                caseFound = true;
                break;
            }
        }
    }

    if (!caseFound) {
        const defaultElement = element.querySelector('default');
        if (defaultElement) {
            finalValue = defaultElement.innerHTML;
        }
    }

    element.outerHTML = finalValue;
};

export default switchHandler;