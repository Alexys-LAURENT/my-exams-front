'use client';
import Logo from '@/public/logo.png';
import { Popover, PopoverContent, PopoverTrigger } from '@heroui/popover';
import { Session } from 'next-auth';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import SignOutButton from './SignOutButton';
const TopBar = ({ loggedUser }: { loggedUser: Session }) => {
	const params = useParams();

	const studentLiknks = [
		...(params.idClass
			? [
					{ label: 'Mes examens', href: `/student/${params.idClass}/exams?status=pending` },
					{ label: 'Dashboard', href: `/student/${params.idClass}/dashboard` },
			  ]
			: []),
		{ label: 'Mes classes', href: '/student/classes' },
	];

	const teacherLinks = [
		{ label: 'Dashboard', href: `/teacher/dashboard` },
		{ label: 'Mes Examens', href: '/teacher/exams' },
		{ label: 'Mes Classes', href: '/teacher/classes' },
		{ label: 'Nouveau Examen', href: '/teacher/exam/create' },
	];

	const adminLinks = [
		{ label: 'Dashboard', href: `/admin/dashboard` },
		{ label: 'Élèces', href: '/admin/students' },
		{ label: 'Classes', href: '/admin/classes' },
		{ label: 'Professeurs', href: '/admin/teachers' },
		{ label: 'Promotions', href: '/admin/degrees' },
	];

	const selectedLinks = () => {
		if (!loggedUser) return [];
		switch (loggedUser.user.accountType) {
			case 'student':
				return studentLiknks;
			case 'teacher':
				return teacherLinks;
			case 'admin':
				return adminLinks;
			default:
				return [];
		}
	};

	return (
		<div className="flex justify-center w-full bg-white border-b border-b-black/10">
			<div className=" px-4 py-3 max-w-[1900px] flex items-center justify-between w-full">
				<span className="font-semibold">
					<Image src={Logo.src} alt="Logo" width={32} height={32} className="inline-block mr-2" />
					My exams
				</span>
				<div>
					{selectedLinks().map((link) => (
						<Link key={link.href} href={link.href} className="ml-4">
							{link.label}
						</Link>
					))}
				</div>
				<div>
					<Popover>
						<PopoverTrigger>
							<div className="w-8 h-8 bg-gray-400 rounded-full cursor-pointer"></div>
						</PopoverTrigger>
						<PopoverContent>
							<div className="flex flex-col">
								<span className="font-bold">{loggedUser!.user.name}</span>
								<span className="text-sm text-gray-500">{loggedUser!.user.email}</span>
								<SignOutButton />
							</div>
						</PopoverContent>
					</Popover>
				</div>
			</div>
		</div>
	);
};

export default TopBar;
