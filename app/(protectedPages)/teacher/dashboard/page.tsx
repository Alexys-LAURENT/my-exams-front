import BlockActiveExams from '@/components/TeacherDashboard/BlockActiveExams';
import BlockClass from '@/components/TeacherDashboard/BlockClass';
import BlockExam from '@/components/TeacherDashboard/BlockExam';
import TeacherProfileCard from '@/components/TeacherDashboard/TeacherProfileCard';

const Page = async () => {
	return (
		<div className="flex flex-col gap-8 p-6 pb-0">
			{/* Profile Card */}
			<TeacherProfileCard />

			{/* Main Content Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<BlockClass />
				<BlockExam />
			</div>

			{/* Active Exams Section */}
			<BlockActiveExams />
		</div>
	);
};

export default Page;
