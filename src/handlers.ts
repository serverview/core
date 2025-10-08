import type { ElementHandler } from './types';
import systemHandler from './handlers/system';
import conditionHandler from './handlers/condition';
import includeHandler from './handlers/include';
import fetchHandler from './handlers/fetch';
import variableHandler from './handlers/variable';

export const elementHandlers = new Map<string, ElementHandler>();

elementHandlers.set('system', systemHandler);
elementHandlers.set('condition', conditionHandler);
elementHandlers.set('include', includeHandler);
elementHandlers.set('fetch', fetchHandler);
elementHandlers.set('variable', variableHandler);