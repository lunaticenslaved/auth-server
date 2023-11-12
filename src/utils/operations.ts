import Schema from '@lunaticenslaved/schema';

import { context } from '#/context';

export const createOperation = Schema.Operation.createOperationWithContext(context);
