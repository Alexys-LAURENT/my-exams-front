import { ApiError, PaginatedResponse } from '@/types/requests';
import { fetchApi } from '@/utils/fetchApi';

export type Discussion = {
	idDiscussion: string;
	name: string | null;
	url: null;
	createdAt: string;
	updatedAt: string | null;
	type: 'group' | 'private';
	users: {
		idUser: string;
		username: string;
		alias: string;
		avatarUrl: string;
	}[];
	messages: {
		idMessage: string;
		content: string | null;
		idUser: string;
		createdAt: string;
		idDiscussion: string;
		medias: {
			idMedia: string;
			mimeType: string;
			idMessage: string;
		}[];
		isMessageAudio: boolean;
		isMessageMedia: boolean;
	}[];
};

export const getDiscussions = async (page: number, filter?: string) =>
	(await fetchApi(`api/discussions/selectDiscussions?page=${page}${filter ? `&filter=${encodeURIComponent(filter)}` : ''}`)) as ApiError | PaginatedResponse<Discussion[]>;
