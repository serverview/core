import { globalVariable, type VariableMap } from '../variable';
import { type ElementHandler } from '../types';

const getVariableValue = (varPath: string, requestVariables: VariableMap): any => {
    const parts = varPath.split('.');
    const varName = parts.shift()!;
    let current: any;

    if (requestVariables.has(varName)) {
        current = requestVariables.get(varName);
    } else if (globalVariable.has(varName)) {
        current = globalVariable.get(varName);
    } else {
        return undefined;
    }

    if (typeof current === 'string') {
        try {
            current = JSON.parse(current);
        } catch (e) {
            // Not a JSON string
        }
    }

    for (const part of parts) {
        if (current === null || typeof current !== 'object' || !(part in current)) {
            return undefined;
        }
        current = current[part];
    }

    return current;
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
        showThen = getVariableValue(varPath, requestVariables) !== undefined;
    } else if (lowerCaseCondition.endsWith(' undefined')) {
        const varPath = condition.slice(0, -10).trim();
        showThen = getVariableValue(varPath, requestVariables) === undefined;
    } else {
        const operators = ['==', '!=', '>=', '<=', '>', '<'];
        let operator = '';
        let parts: string[] = [];

        for (const op of operators) {
            if (condition.includes(op)) {
                operator = op;
                parts = condition.split(op).map(p => p.trim());
                break;
            }
        }

        if (operator && parts.length === 2) {
            const varPath = parts[0];
            const valueToCompare = parts[1];
            const varValue = getVariableValue(varPath, requestVariables);

            const numVarValue = varValue !== undefined ? parseFloat(varValue) : NaN;
            const numValueToCompare = parseFloat(valueToCompare);

            if (!isNaN(numVarValue) && !isNaN(numValueToCompare)) {
                switch (operator) {
                    case '==': showThen = numVarValue == numValueToCompare; break;
                    case '!=': showThen = numVarValue != numValueToCompare; break;
                    case '>': showThen = numVarValue > numValueToCompare; break;
                    case '<': showThen = numVarValue < numValueToCompare; break;
                    case '>=': showThen = numVarValue >= numValueToCompare; break;
                    case '<=': showThen = numVarValue <= numValueToCompare; break;
                }
            }
        } else {
            element.outerHTML = `[SVH ERROR: Invalid condition format: ${condition}]`;
            return;
        }
    }

    if (showThen) {
        const thenElem = element.querySelector('then');
        if (thenElem) {
            finalValue = thenElem.innerHTML;
            containerTag = thenElem.getAttribute('container') || defaultContainerTag;
        } else {
            const elseElem = element.querySelector('else');
            if(elseElem){
                elseElem.remove();
            }
            finalValue = element.innerHTML;
        }
    } else {
        const elseElem = element.querySelector('else');
        if (elseElem) {
            finalValue = elseElem.innerHTML;
            containerTag = elseElem.getAttribute('container') || defaultContainerTag;
        }
    }
    element.outerHTML = `<${containerTag} svd-condition="${condition}">${finalValue}</${containerTag}>`;
};

export default conditionHandler;