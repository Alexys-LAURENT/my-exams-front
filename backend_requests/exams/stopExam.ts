import { ApiError } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

type StopExamResponse = {
	success: true;
	message: string;
	data: {
		status: 'corrigé' | 'à corrigé';
		score?: number;
	};
};

export const stopExam = async (idExam: number) => {
	return (await fetchApi(`/api/exams/${idExam}/stop`, {
		method: 'POST',
	})) as ApiError | StopExamResponse;
};
