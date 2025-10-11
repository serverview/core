import type { ElementHandler } from './types';
import systemHandler from './handlers/system';
import conditionHandler from './handlers/condition';
import includeHandler from './handlers/include';
import fetchHandler from './handlers/fetch';
import variableHandler from './handlers/variable';
import iterateHandler from './handlers/iterate';

export const elementHandlers = new Map<string, ElementHandler>();

elementHandlers.set('fetch', fetchHandler);
elementHandlers.set('system', systemHandler);
elementHandlers.set('condition', conditionHandler);
elementHandlers.set('include', includeHandler);
elementHandlers.set('iterate', iterateHandler);
elementHandlers.set('variable', variableHandler);