import BannerImage from '@/public/banner.png';
import { auth } from '@/utils/auth';
import { Avatar } from '@heroui/avatar';
import { Button } from '@heroui/button';
import Link from 'next/link';

const TeacherProfileCard = async () => {
	const session = await auth();

	if (!session) return null;

	return (
		<div
			className="rounded-xl overflow-hidden flex justify-between items-center p-6 shadow-lg"
			style={{
				backgroundImage: `url(${BannerImage.src})`,
				backgroundSize: 'cover',
				backgroundPosition: 'center',
			}}
		>
			<div className="flex items-center gap-4">
				<Avatar src={session.user.avatarPath || ''} name={session.user.name} size="lg" className="ring-2 ring-white" />
				<div className="flex flex-col">
					<h1 className="text-2xl font-bold text-white">
						{session.user.name} {session.user.lastName}
					</h1>
					<p className="text-white/90 text-sm">Professeur</p>
				</div>
			</div>
			<Link href={`/profile/${session.user.idUser}`}>
				<Button variant="bordered" className="rounded-lg border-white border-2 text-white hover:bg-white/20">
					Voir le profil
				</Button>
			</Link>
		</div>
	);
};

export default TeacherProfileCard;
