import { User } from '@/types/entitties';
import { ApiError, SuccessResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

export const getTeachersOfClass = async (idClass: number) => {
	return (await fetchApi(`/api/classes/${idClass}/teachers`)) as ApiError | SuccessResponse<User[]>;
};
