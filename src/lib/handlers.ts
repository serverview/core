import type { Handler } from './types';
import systemHandler from './handlers/system';
import conditionHandler from './handlers/condition';
import includeHandler from './handlers/include';
import fetchHandler from './handlers/fetch';
import variableHandler from './handlers/variable';
import iterateHandler from './handlers/iterate';
import setHandler from './handlers/set';
import defineHandler from './handlers/define';
import callHandler from './handlers/call';
import switchHandler from './handlers/switch';

export const elementHandlers = new Map<string, Handler>();

// Priority 1: Data fetching, setting, and macro definitions
elementHandlers.set('fetch', { priority: 1, execute: fetchHandler });
elementHandlers.set('set', { priority: 1, execute: setHandler });
elementHandlers.set('define', { priority: 1, execute: defineHandler });

// Priority 2: Structural changes and macro calls
elementHandlers.set('iterate', { priority: 2, execute: iterateHandler });
elementHandlers.set('include', { priority: 2, execute: includeHandler });
elementHandlers.set('call', { priority: 2, execute: callHandler });

// Priority 3: Conditional rendering
elementHandlers.set('condition', { priority: 3, execute: conditionHandler });
elementHandlers.set('switch', { priority: 3, execute: switchHandler });

// Priority 4: Content replacement
elementHandlers.set('variable', { priority: 4, execute: variableHandler });
elementHandlers.set('system', { priority: 4, execute: systemHandler });