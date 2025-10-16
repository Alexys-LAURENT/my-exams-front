import { Degree } from '@/types/entitties';
import { ApiError, SuccessResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

export const getAllDegrees = async () => {
	return (await fetchApi('/api/degrees')) as ApiError | SuccessResponse<Degree[]>;
};
