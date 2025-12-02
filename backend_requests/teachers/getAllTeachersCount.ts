import { ApiError, SuccessResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

export const getAllTeachersCount = async () => {
	return (await fetchApi('/api/teachers/count')) as ApiError | SuccessResponse<number>;
};
