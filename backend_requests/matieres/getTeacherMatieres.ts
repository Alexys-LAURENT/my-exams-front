import type { Matiere } from '@/types/entitties';
import { ApiError, SuccessResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

export const getTeacherMatieres = async (idTeacher: number) => {
	return (await fetchApi(`/api/teachers/${idTeacher}/matieres`)) as ApiError | SuccessResponse<Matiere[]>;
};
