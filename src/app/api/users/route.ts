import { getSuccessMessage } from '@/constants/messages';
import { getSuccessResponse, withErrorHandler } from '@/lib/api-response';

export const GET = withErrorHandler(async () => {

    return getSuccessResponse([], getSuccessMessage('user'));
});