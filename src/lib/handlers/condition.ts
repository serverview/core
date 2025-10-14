import { globalVariable, type VariableMap, getVariableValue } from '../variable';
import { type ElementHandler } from '../types';

// --- Expression Evaluation ---

function evaluate(expression: string, requestVariables: VariableMap): boolean {
    expression = expression.trim();

    // Handle parentheses by finding matching pairs
    let depth = 0;
    for (let i = expression.length - 1; i >= 0; i--) {
        if (expression[i] === ')') depth++;
        if (expression[i] === '(') depth--;
        if (depth === 0 && i > 0 && expression[i - 1] === ' ') {
            if (expression.substring(i).startsWith('or ')) {
                const left = expression.substring(0, i - 1);
                const right = expression.substring(i + 2);
                return evaluate(left, requestVariables) || evaluate(right, requestVariables);
            }
            if (expression.substring(i).startsWith('and ')) {
                const left = expression.substring(0, i - 1);
                const right = expression.substring(i + 3);
                return evaluate(left, requestVariables) && evaluate(right, requestVariables);
            }
        }
    }

    // Base cases
    if (expression.startsWith('(') && expression.endsWith(')')) {
        return evaluate(expression.slice(1, -1), requestVariables);
    }
    if (expression.startsWith('not ')) {
        return !evaluate(expression.slice(4), requestVariables);
    }

    return evaluateSimpleCondition(expression, requestVariables);
}

function evaluateSimpleCondition(condition: string, requestVariables: VariableMap): boolean {
    if (condition === 'true') return true;
    if (condition === 'false') return false;

    if (condition.endsWith(' defined')) {
        return getVariableValue(condition.slice(0, -8).trim(), requestVariables) !== undefined;
    }
    if (condition.endsWith(' undefined')) {
        return getVariableValue(condition.slice(0, -10).trim(), requestVariables) === undefined;
    }

    const operators = ['==', '!=', '>=', '<=', '>', '<', 'contains'];
    for (const op of operators) {
        const parts = condition.split(new RegExp(`\\s+${op}\\s+`));
        if (parts.length === 2) {
            const varPath = parts[0]!.trim();
            const literal = parts[1]!.trim();
            const varValue = getVariableValue(varPath, requestVariables);

            if (op === 'contains') {
                const valueToFind = literal.startsWith('\'') ? literal.slice(1, -1) : literal;
                if (Array.isArray(varValue)) return varValue.includes(valueToFind);
                if (typeof varValue === 'string') return varValue.includes(valueToFind);
                return false;
            }

            if (literal.startsWith('\'')) { // String comparison
                const strLiteral = literal.slice(1, -1);
                const strVar = String(varValue ?? '');
                if (op === '==') return strVar === strLiteral;
                if (op === '!=') return strVar !== strLiteral;
            } else { // Numeric comparison
                const numVar = parseFloat(varValue);
                const numLiteral = parseFloat(literal);
                if (isNaN(numVar) || isNaN(numLiteral)) continue;
                if (op === '==') return numVar === numLiteral;
                if (op === '!=') return numVar !== numLiteral;
                if (op === '>') return numVar > numLiteral;
                if (op === '<') return numVar < numLiteral;
                if (op === '>=') return numVar >= numLiteral;
                if (op === '<=') return numVar <= numLiteral;
            }
        }
    }
    return false;
}

// --- Main Handler ---

const conditionHandler: ElementHandler = (element, requestVariables) => {
    const isAttr = element.getAttribute('is');
    if (!isAttr) {
        element.outerHTML = '[SVH ERROR: condition tag missing "is" attribute]';
        return;
    }

    let showThen = false;
    try {
        showThen = evaluate(isAttr, requestVariables);
    } catch (e) {
        element.outerHTML = `[SVH ERROR: Invalid condition: ${(e as Error).message}]`;
        return;
    }

    const defaultContainerTag = element.getAttribute('container') || 'div';
    let finalValue = '';
    let containerTag = defaultContainerTag;

    if (showThen) {
        const thenElem = element.querySelector('then');
        if (thenElem) {
            finalValue = thenElem.innerHTML;
            containerTag = thenElem.getAttribute('container') || defaultContainerTag;
        } else {
            const elseElem = element.querySelector('else');
            if (elseElem) elseElem.remove();
            finalValue = element.innerHTML;
        }
    } else {
        const elseElem = element.querySelector('else');
        if (elseElem) {
            finalValue = elseElem.innerHTML;
            containerTag = elseElem.getAttribute('container') || defaultContainerTag;
        }
    }

    element.outerHTML = `<${containerTag} svd-condition="${isAttr}">${finalValue}</${containerTag}>`;
};

export default conditionHandler;