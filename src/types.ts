import type { VariableMap } from './variable';

export type ElementHandler = (element: Element, requestVariables: VariableMap) => void | Promise<void>;