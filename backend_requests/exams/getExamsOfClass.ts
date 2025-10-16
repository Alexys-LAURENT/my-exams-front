import { ExamWithDates } from '@/types/entitties';
import { ApiError, SuccessResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

export const getExamsOfClass = async (
	idClass: number,
	queryParams?: {
		status?: 'completed' | 'pending' | 'comming';
		limit?: number;
	}
) => {
	let url = `/api/classes/${idClass}/exams`;
	if (queryParams) {
		const params = new URLSearchParams();
		if (queryParams.status) params.append('status', queryParams.status);
		if (queryParams.limit) params.append('limit', queryParams.limit.toString());
		if (params.toString()) {
			url += `?${params.toString()}`;
		}
	}
	return (await fetchApi(url)) as ApiError | SuccessResponse<ExamWithDates[]>;
};
