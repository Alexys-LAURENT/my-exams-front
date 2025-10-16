import { User } from '@/types/entitties';
import { ApiError, SuccessResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

export const getOneTeacher = async (idTeacher: number) => {
	return (await fetchApi(`/api/teachers/${idTeacher}`)) as ApiError | SuccessResponse<User>;
};
