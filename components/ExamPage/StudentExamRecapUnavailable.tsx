import { getOneTeacher } from '@/backend_requests/teachers/getOneTeacher';
import { ExamRecap } from '@/types/entitties';
import { formatExamTime } from '@/utils/formatExamTime';
import TimerIcon from '../svg/TimerIcon';

interface StudentExamRecapUnavailableProps {
	examData: ExamRecap & { isExamTimeFinished: false };
	idStudent: number;
}

const StudentExamRecapUnavailable = async ({ examData }: StudentExamRecapUnavailableProps) => {
	const teacher = await getOneTeacher(examData.idTeacher);

	if ('error' in teacher) {
		throw new Error('Error fetching teacher data');
	}

	return (
		<div className="flex flex-col w-full gap-6 p-4 mx-auto md:p-6">
			{/* Bloc d'informations de l'examen */}
			<div className="p-6 bg-white border rounded-lg border-black/10">
				<div className="flex flex-col items-start justify-between gap-2 mb-4 :gap-0 md:flex-row ">
					<div className="flex flex-row gap-4 ">
						{/* TODO: Implement exam image */}
						{/* {examData.imagePath && <Image src={examData.imagePath} alt={examData.title} className="object-cover w-24 h-24 rounded-lg" />} */}
						<div className="hidden w-24 h-24 bg-gray-300 rounded-lg md:block"></div>
						<div className="">
							<h1 className="text-3xl font-bold text-gray-800">{examData.title}</h1>
							{examData.desc && <p className="text-gray-600 ">{examData.desc}</p>}
						</div>
					</div>
					<div className="flex items-center w-full px-3 py-1 rounded-lg md:w-fit bg-gray-200/50">
						<TimerIcon className="inline w-4 mr-2 md:w-6 aspect-square fill-blue-500" />
						<p className="text-sm font-semibold text-blue-500 md:text-md">{formatExamTime(examData.time * 60)}</p>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-4 mt-4 md:grid-cols-3">
					<div className="p-3 rounded-md bg-blue-50">
						<p className="text-sm text-gray-600">Professeur</p>
						<p className="text-lg font-semibold text-blue-700">{teacher.data.name + ' ' + teacher.data.lastName}</p>
					</div>
					<div className="p-3 rounded-md bg-orange-50">
						<p className="text-sm text-gray-600">Note</p>
						<p className="text-lg font-semibold text-orange-700">{examData.examGrade.note !== null ? `${examData.examGrade.note}/20` : 'Non noté'}</p>
					</div>
					<div className="p-3 rounded-md bg-violet-50">
						<p className="text-sm text-gray-600">Statut</p>
						<p className="text-lg font-semibold text-violet-700">{examData.examGrade.status.charAt(0).toUpperCase() + examData.examGrade.status.slice(1)}</p>
					</div>
				</div>
			</div>

			{/* Message d'indisponibilité */}
			<div className="p-8 bg-white border rounded-lg border-black/10">
				<div className="flex flex-col items-center justify-center text-center">
					<div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-blue-100">
						<svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
							/>
						</svg>
					</div>
					<h2 className="mb-2 text-2xl font-bold text-gray-800">Récapitulatif non disponible</h2>
					<p className="mb-4 text-gray-600">Le récapitulatif détaillé de cet examen sera disponible une fois que la période de l&apos;examen sera terminée.</p>
					<div className="p-4 rounded-lg bg-blue-50">
						<p className="text-sm text-blue-800">
							<span className="font-semibold">Note :</span> Vous pourrez consulter vos réponses et les corrections après la fin de la période d&apos;examen.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default StudentExamRecapUnavailable;
