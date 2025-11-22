import type { Matiere } from '@/types/entitties';
import { ApiError, SuccessResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

export const getOneMatiere = async (idMatiere: number) => {
	return (await fetchApi(`/api/matieres/${idMatiere}`)) as ApiError | SuccessResponse<Matiere>;
};
