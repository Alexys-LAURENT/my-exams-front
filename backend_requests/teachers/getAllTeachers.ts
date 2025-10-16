import { User } from '@/types/entitties';
import { ApiError, SuccessResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

export const getAllTeachers = async () => {
	return (await fetchApi('/api/teachers')) as ApiError | SuccessResponse<User[]>;
};
