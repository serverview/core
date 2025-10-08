import { VariableMap } from '../variable';
import { ElementHandler } from '../types';

const conditionHandler: ElementHandler = (element, requestVariables) => {
    const isAttr = element.getAttribute('is');
    if (!isAttr) {
        element.outerHTML = '[SVH ERROR: condition tag missing "is" attribute]';
        return;
    }
    const condition = isAttr.trim().toLowerCase();

    // Get container tag, default to 'div'
    const defaultContainerTag = element.getAttribute('container') || 'div';

    if (condition === 'true' || condition === 'false') {
        let finalValue: string;
        let containerTag = defaultContainerTag;

        if (condition === 'true') {
            const thenElem = element.querySelector('then');
            if (thenElem) {
                finalValue = thenElem.innerHTML;
                containerTag = thenElem.getAttribute('container') || defaultContainerTag;
            } else {
                finalValue = element.innerHTML;
            }
        } else { // condition === 'false'
            const elseElem = element.querySelector('else');
            if (elseElem) {
                finalValue = elseElem.innerHTML;
                containerTag = elseElem.getAttribute('container') || defaultContainerTag;
            } else {
                finalValue = '';
            }
        }
        element.outerHTML = `<${containerTag} svd-condition="${condition}">${finalValue}</${containerTag}>`;
    } else {
        element.outerHTML = `[SVH ERROR: condition tag \'is\' attribute must be \'true\' or \'false\']`;
    }
};

export default conditionHandler;