import { iHasParentPath } from '@quirk-a-bot/common';

import { iHasId } from '../../../../declarations/interfaces';

export interface AbstractDocumentWriterProps extends iHasId, iHasParentPath {}
