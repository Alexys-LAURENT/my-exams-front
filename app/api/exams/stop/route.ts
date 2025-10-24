import { stopExam } from '@/backend_requests/exams/stopExam';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { idExam } = body;
		console.log('Received request to stop exam with idExam:', idExam);

		if (!idExam) {
			return NextResponse.json({ success: false, message: 'idExam est requis' }, { status: 400 });
		}

		// Appeler votre backend pour arrêter l'examen
		const response = await stopExam(idExam);

		return NextResponse.json(response, { status: 'success' in response ? 200 : 500 });
	} catch (error) {
		console.error('Error stopping exam:', error);
		return NextResponse.json({ success: false, message: "Erreur lors de l'arrêt de l'examen" }, { status: 500 });
	}
}
