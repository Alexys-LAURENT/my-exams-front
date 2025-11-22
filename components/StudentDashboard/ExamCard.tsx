import { getExamClass } from '@/backend_requests/exams_classes/getExamClass';
import { getQuestionsCountForOneExam } from '@/backend_requests/questions/getQuestionsCountForOneExam';
import { getOneTeacher } from '@/backend_requests/teachers/getOneTeacher';
import { ExamWithDates } from '@/types/entitties';
import { CalendarIcon, UserIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

// Couleurs de gradient pour les cartes
const gradients = [
	'bg-radial-[at_50%_75%] from-cyan-300 to-cyan-500',
	'bg-radial-[at_30%_80%] from-purple-300 to-purple-500',
	'bg-radial-[at_70%_20%] from-orange-300 to-orange-500',
	'bg-radial-[at_50%_75%] from-pink-300 to-pink-500',
	'bg-radial-[at_10%_75%] from-indigo-300 to-indigo-500',
	'bg-radial-[at_50%_25%] from-emerald-300 to-emerald-500',
];

const formatDateTime = (dateString: string) => {
	return new Date(dateString).toLocaleString('fr-FR', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
};

interface ExamCardProps {
	exam: ExamWithDates;
	idClass: number;
	idStudent: number;
}

const ExamCard = async ({ exam, idClass, idStudent }: ExamCardProps) => {
	const teachInfosResponse = await getOneTeacher(exam.idTeacher);

	if (!('success' in teachInfosResponse)) {
		throw new Error("Erreur lors de la récupération des informations de l'enseignant");
	}

	const classAssignment = await getExamClass(exam.idExam, idClass);
	if (!('success' in classAssignment)) {
		throw new Error("Erreur lors de la récupération des informations de l'affectation de l'examen à la classe");
	}

	const totalQuestionsReponse = await getQuestionsCountForOneExam(exam.idExam);
	if (!('success' in totalQuestionsReponse)) {
		throw new Error("Erreur lors de la récupération du nombre de questions de l'examen");
	}

	const todoExamsWithDetails = {
		...exam,
		teacherInfo: teachInfosResponse.data,
		classAssignment: classAssignment.data,
		questionsCount: Number.parseInt(totalQuestionsReponse.data),
	};
	const gradient = gradients[exam.idExam % gradients.length];

	return (
		<Link key={exam.idExam} href={`/student/${idClass}/${idStudent}/${exam.idExam}`} className="block">
			<div className="bg-white hover:bg-slate-50 border border-slate-100 rounded-xl p-1.5 w-[310px] transition-all cursor-pointer">
				{/* Header avec gradient */}
				<div className={` ${gradient} rounded-xl p-4 mb-2`}>
					<h3 className="text-white font-bold text-lg leading-tight">{exam.title}</h3>
					<div className="flex items-center gap-2 mt-2">
						<span className="text-white/90 bg-white/30 py-1 px-2 rounded-full text-[10px]">{todoExamsWithDetails.questionsCount} Questions</span>
					</div>
				</div>
				<div className="flex flex-col p-1">
					{/* Description */}
					<div className="mb-3">
						<p className="text-sm font-medium text-gray-800 line-clamp-2">{exam.desc || 'Examen à compléter'}</p>
					</div>

					{/* Infos supplémentaires */}
					<div className="flex flex-col gap-2">
						<span className="flex w-fit items-center  bg-slate-100 text-slate-500 py-1 px-2 rounded-full text-[11px]">
							<UserIcon className="w-4 h-4 inline-block mr-1" />
							{todoExamsWithDetails.teacherInfo.name} {todoExamsWithDetails.teacherInfo.lastName}
						</span>

						<span className="w-fit flex items-center bg-slate-100 text-slate-500 py-1 px-2 rounded-full text-[11px]">
							<CalendarIcon className="w-4 h-4 inline-block mr-1" />
							<div className="inline-block">
								{formatDateTime(todoExamsWithDetails.classAssignment.start_date)} - {formatDateTime(todoExamsWithDetails.classAssignment.end_date)}
							</div>
						</span>

						<span className="w-fit bg-slate-100 text-slate-500 py-1 px-2 rounded-full text-[11px]">{exam.time} min</span>
					</div>
				</div>
			</div>
		</Link>
	);
};

export default ExamCard;
