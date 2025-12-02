import { ApiError, SuccessResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

export const getAllStudentsCount = async () => {
	return (await fetchApi('/api/students/count')) as ApiError | SuccessResponse<number>;
};
