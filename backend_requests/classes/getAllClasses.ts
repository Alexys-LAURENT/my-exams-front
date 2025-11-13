import { Class } from '@/types/entitties';
import { ApiError, SuccessResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

export const getAllClasses = async () => {
    return (await fetchApi('/api/classes')) as ApiError | SuccessResponse<Class[]>;
};
