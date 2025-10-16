import { User } from '@/types/entitties';
import { ApiError, SuccessResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

export const getAllStudents = async () => {
	return (await fetchApi('/api/students')) as ApiError | SuccessResponse<User[]>;
};
