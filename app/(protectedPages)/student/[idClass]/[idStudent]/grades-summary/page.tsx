import { getOneClass } from '@/backend_requests/classes/getOneClass';
import { getClassDegree } from '@/backend_requests/degrees/getClassDegree';
import { getUserGeneralAverageInClass } from '@/backend_requests/stats/getUserGeneralAverageInClass';
import { getUserInClassGradesSummary } from '@/backend_requests/stats/getUserInClassGradesSummary';
import { getOneStudent } from '@/backend_requests/students/getOneStudent';
import BannerImage from '@/public/banner.png';
import { Avatar } from '@heroui/avatar';
import GradesTable from './GradesTable';

const Page = async ({ params }: { params: Promise<{ idClass: string; idStudent: string }> }) => {
	const { idClass, idStudent } = await params;
	const idClassNumber = parseInt(idClass);
	const idStudentNumber = parseInt(idStudent);

	const [classResponse, degreeResponse, studentResponse, averageResponse, gradesResponse] = await Promise.all([
		getOneClass(idClassNumber),
		getClassDegree(idClassNumber),
		getOneStudent(idStudentNumber),
		getUserGeneralAverageInClass(idClassNumber, idStudentNumber),
		getUserInClassGradesSummary(idClassNumber, idStudentNumber),
	]);

	if (!('success' in classResponse) || !('success' in degreeResponse) || !('success' in studentResponse) || !('success' in averageResponse) || !('success' in gradesResponse)) {
		return <div>Erreur lors du chargement des données.</div>;
	}

	const degreeName = degreeResponse.data.name;
	const student = studentResponse.data;

	return (
		<div className="flex flex-col gap-8 p-6 pb-0">
			<div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
				{/* Profile Card */}
				<div
					className="rounded-xl overflow-hidden flex justify-between items-center p-6 shadow-lg"
					style={{
						backgroundImage: `url(${BannerImage.src})`,
						backgroundSize: 'cover',
						backgroundPosition: 'center',
					}}
				>
					<div className="flex items-center gap-4">
						<Avatar src={student.avatarPath || ''} name={student.name} size="lg" className="ring-2 ring-white" />
						<div className="flex flex-col">
							<h1 className="text-2xl font-bold text-white">
								{student.name} {student.lastName}
							</h1>
							<p className="text-white/90 text-sm">
								{classResponse.data.name} • {degreeName}
							</p>
						</div>
					</div>
				</div>

				{/* Average Card */}
				<div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-xl p-6 shadow-lg flex flex-col justify-center items-center text-white">
					<div className="text-center">
						<h2 className="text-lg font-semibold mb-2 opacity-90">Moyenne Générale</h2>
						<div className="my-6">
							<p className="text-7xl font-bold mb-2">{averageResponse.data.average !== null ? averageResponse.data.average.toFixed(2) : 'N/A'}</p>
							<p className="text-3xl font-light opacity-90">/20</p>
						</div>
					</div>
				</div>
			</div>

			{/* Grades Table */}
			<div className="bg-white rounded-xl p-6">
				<h2 className="text-xl font-bold mb-4">Détail des notes</h2>
				<GradesTable
					idClass={idClassNumber}
					idStudent={idStudentNumber}
					subjects={gradesResponse.data.subjects}
					examsWithGrades={gradesResponse.data.examsWithGrades}
					subjectAverages={gradesResponse.data.subjectAverages}
				/>
			</div>
		</div>
	);
};

export default Page;
