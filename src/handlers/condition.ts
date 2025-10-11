import { globalVariable, type VariableMap } from '../variable';
import { type ElementHandler } from '../types';

const checkPropertyDefined = (varPath: string, requestVariables: VariableMap): boolean => {
    const parts = varPath.split('.');
    const varName = parts.shift()!;
    let current: any;

    if (requestVariables.has(varName)) {
        current = requestVariables.get(varName);
    } else if (globalVariable.has(varName)) {
        current = globalVariable.get(varName);
    } else {
        return false;
    }

    if (typeof current === 'string') {
        try {
            current = JSON.parse(current);
        } catch (e) {
            return parts.length === 0;
        }
    }

    for (const part of parts) {
        if (current === null || typeof current !== 'object' || !(part in current)) {
            return false;
        }
        current = current[part];
    }

    return true;
};

const conditionHandler: ElementHandler = (element, requestVariables) => {
    const isAttr = element.getAttribute('is');
    if (!isAttr) {
        element.outerHTML = '[SVH ERROR: condition tag missing "is" attribute]';
        return;
    }
    const condition = isAttr.trim();
    const lowerCaseCondition = condition.toLowerCase();

    // Get container tag, default to 'div'
    const defaultContainerTag = element.getAttribute('container') || 'div';

    let finalValue: string = '';
    let containerTag = defaultContainerTag;
    let showThen: boolean = false;

    if (lowerCaseCondition === 'true') {
        showThen = true;
    } else if (lowerCaseCondition === 'false') {
        showThen = false;
    } else if (lowerCaseCondition.endsWith(' defined')) {
        const varPath = condition.slice(0, -8).trim();
        showThen = checkPropertyDefined(varPath, requestVariables);
    } else if (lowerCaseCondition.endsWith(' undefined')) {
        const varPath = condition.slice(0, -10).trim();
        showThen = !checkPropertyDefined(varPath, requestVariables);
    } else {
        element.outerHTML = `[SVH ERROR: condition tag \'is\' attribute must be \'true\', \'false\', \'variablename defined\', or \'variablename undefined\']`;
        return;
    }

    if (showThen) {
        const thenElem = element.querySelector('then');
        if (thenElem) {
            finalValue = thenElem.innerHTML;
            containerTag = thenElem.getAttribute('container') || defaultContainerTag;
        } else {
            // if no <then> is present, the content of the condition is the "then" value
            const elseElem = element.querySelector('else');
            if(elseElem){
                elseElem.remove();
            }
            finalValue = element.innerHTML;
        }
    } else { // condition is false, or variable is not in the right state
        const elseElem = element.querySelector('else');
        if (elseElem) {
            finalValue = elseElem.innerHTML;
            containerTag = elseElem.getAttribute('container') || defaultContainerTag;
        }
    }
    element.outerHTML = `<${containerTag} svd-condition="${condition}">${finalValue}</${containerTag}>`;
};

export default conditionHandler;