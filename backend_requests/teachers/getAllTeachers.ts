import { User } from '@/types/entitties';
import { ApiError, PaginatedResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

export const getAllTeachers = async (page: number, filter?: string) => {
	const queryParams = new URLSearchParams();
	queryParams.append('page', page.toString());
	if (filter) queryParams.append('filter', filter);
	return (await fetchApi('/api/teachers' + `?${queryParams.toString()}`, { method: 'GET' })) as ApiError | PaginatedResponse<User[]>;
};
