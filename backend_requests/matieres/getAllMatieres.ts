import { Matiere } from '@/types/entitties';
import { ApiError, SuccessResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

export const getAllMatieres = async () => {
	return (await fetchApi('/api/matieres')) as ApiError | SuccessResponse<Matiere[]>;
};
