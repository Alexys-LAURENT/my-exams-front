import { User } from '@/types/entitties';
import { ApiError, SuccessResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

export const getOneStudent = async (idStudent: number) => {
	return (await fetchApi(`/api/students/${idStudent}`)) as ApiError | SuccessResponse<User>;
};
