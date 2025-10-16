import { User } from '@/types/entitties';
import { ApiError, SuccessResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

export const getStudentsOfClass = async (idClass: number) => {
	return (await fetchApi(`/api/classes/${idClass}/students`)) as ApiError | SuccessResponse<User[]>;
};
