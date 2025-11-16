import { getSuccessMessage } from '@/constants/messages';
import { createActionSuccess, withErrorHandler } from '@/lib/api-response';

export const GET = withErrorHandler(async () => {

    return createActionSuccess([], getSuccessMessage('user'));
});