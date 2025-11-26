'use client';
import Logo from '@/public/logo.png';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Avatar } from '@heroui/avatar';
import { Button } from '@heroui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@heroui/popover';
import { Session } from 'next-auth';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { useState } from 'react';
import SignOutButton from './SignOutButton';

const TopBar = ({ loggedUser }: { loggedUser: Session }) => {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const showAppropriateLinks = () => {
		if (!loggedUser) return [];
		switch (loggedUser.user.accountType) {
			case 'student':
				return <StudentLinks loggedUser={loggedUser} />;
			case 'teacher':
				return <TeacherLinks />;
			case 'admin':
				return <AdminLinks />;
			default:
				return null;
		}
	};

	return (
		<>
			<div className="flex justify-center w-full bg-white border-b border-b-black/10">
				<div className="px-4 py-3 max-w-[1900px] flex items-center justify-between w-full">
					<span className="font-semibold flex items-center">
						<Image src={Logo.src} alt="Logo" width={32} height={32} className="inline-block mr-2" />
						<span className="hidden sm:inline">My exams</span>
					</span>

					{/* Desktop Navigation */}
					<div className="hidden lg:block">{showAppropriateLinks()}</div>

					{/* Mobile Menu Button */}
					<Button variant="light" size="sm" isIconOnly className="lg:hidden " onPress={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle menu">
						{isMobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
					</Button>

					{/* User Profile */}
					<div className="hidden lg:block">
						<Popover>
							<PopoverTrigger>
								<Avatar
									src={loggedUser!.user.avatarPath || ''}
									name={loggedUser!.user.name + ' ' + loggedUser!.user.lastName}
									size="sm"
									className="cursor-pointer border-1 border-white"
								/>
							</PopoverTrigger>
							<PopoverContent>
								<div className="flex flex-col gap-3 p-2 min-w-[200px]">
									<div className="flex flex-col gap-1">
										<span className="font-bold text-base">
											{loggedUser!.user.name} {loggedUser!.user.lastName}
										</span>
										<span className="text-sm text-gray-500">{loggedUser!.user.email}</span>
									</div>
									<div className="pt-2 border-t border-gray-200">
										<SignOutButton />
									</div>
								</div>
							</PopoverContent>
						</Popover>
					</div>
				</div>
			</div>

			{/* Mobile Menu */}
			{isMobileMenuOpen && (
				<div className="lg:hidden w-full bg-white border-b border-b-black/10 shadow-lg">
					<div className="px-4 py-4 flex flex-col gap-4">
						{/* Mobile Navigation */}
						<div onClick={() => setIsMobileMenuOpen(false)}>{showAppropriateLinks()}</div>

						{/* Mobile User Profile */}
						<div className="pt-4 border-t border-gray-200">
							<div className="flex items-center gap-3 mb-3">
								<Avatar
									src={loggedUser!.user.avatarPath || ''}
									name={loggedUser!.user.name + ' ' + loggedUser!.user.lastName}
									size="sm"
									className="cursor-pointer border-1 border-white"
								/>
								<div className="flex flex-col">
									<span className="font-bold text-sm">{loggedUser!.user.name}</span>
									<span className="text-xs text-gray-500">{loggedUser!.user.email}</span>
								</div>
							</div>
							<SignOutButton />
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default TopBar;

const StudentLinks = ({ loggedUser }: { loggedUser: Session }) => {
	const params = useParams();
	const pathname = usePathname();

	const idClass = params.idClass;

	const otherStudentLinks = [
		{ label: 'Dashboard', href: `/student/${params.idClass}/dashboard`, matchPath: `/student/${params.idClass}/dashboard` },
		{ label: 'Mes examens', href: `/student/${params.idClass}/exams?status=pending`, matchPath: `/student/${params.idClass}/exams` },
		{ label: 'Mes notes', href: `/student/${params.idClass}/${loggedUser.user.idUser}/grades-summary`, matchPath: `/student/${params.idClass}/${loggedUser.user.idUser}/grades-summary` },
	];

	const isActive = (href: string) => pathname === href || pathname?.startsWith(href);

	return (
		<div className="flex flex-col lg:flex-row lg:items-center gap-2">
			<Link
				className={`font-semibold hover:text-blue-500 py-2 lg:py-0 ${
					isActive('/student/classes') ? 'text-blue-500 underline decoration-blue-500 underline-offset-6 lg:underline-offset-[22px]' : ''
				}`}
				href={'/student/classes'}
			>
				Mes classes
			</Link>
			{idClass &&
				otherStudentLinks.map((link) => (
					<Link
						key={link.href}
						href={link.href}
						className={`font-semibold hover:text-blue-500 py-2 lg:py-0 lg:ml-4 ${
							isActive(link.matchPath) ? 'text-blue-500 underline decoration-blue-500 underline-offset-6 lg:underline-offset-[22px]' : ''
						}`}
					>
						{link.label}
					</Link>
				))}
		</div>
	);
};

const TeacherLinks = () => {
	const pathname = usePathname();
	const teacherLinks = [
		{ label: 'Dashboard', href: `/teacher/dashboard` },
		{ label: 'Mes Examens', href: '/teacher/exams' },
		{ label: 'Mes Classes', href: '/teacher/classes' },
		{ label: 'Nouveau Examen', href: '/teacher/exam/create' },
	];

	const isActive = (href: string) => pathname === href || pathname?.startsWith(href);

	return (
		<div className="flex flex-col lg:flex-row lg:items-center gap-2">
			{teacherLinks.map((link, index) => (
				<Link
					key={link.href}
					href={link.href}
					className={`${index > 0 ? 'lg:ml-4' : ''} font-semibold hover:text-blue-500 py-2 lg:py-0 ${
						isActive(link.href) ? 'text-blue-500 underline decoration-blue-500 underline-offset-6 lg:underline-offset-[22px]' : ''
					}`}
				>
					{link.label}
				</Link>
			))}
		</div>
	);
};

const AdminLinks = () => {
	const pathname = usePathname();
	const adminLinks = [
		{ label: 'Dashboard', href: `/admin/dashboard` },
		{ label: 'Élèves', href: '/admin/students' },
		{ label: 'Classes', href: '/admin/classes' },
		{ label: 'Professeurs', href: '/admin/teachers' },
		{ label: 'Promotions', href: '/admin/degrees' },
		{ label: 'Matières', href: '/admin/matieres' },
	];

	const isActive = (href: string) => pathname === href || pathname?.startsWith(href);

	return (
		<div className="flex flex-col lg:flex-row lg:items-center gap-2">
			{adminLinks.map((link, index) => (
				<Link
					key={link.href}
					href={link.href}
					className={`${index > 0 ? 'lg:ml-4' : ''} font-semibold hover:text-blue-500 py-2 lg:py-0 ${
						isActive(link.href) ? 'text-blue-500 underline decoration-blue-500 underline-offset-6 lg:underline-offset-[22px]' : ''
					}`}
				>
					{link.label}
				</Link>
			))}
		</div>
	);
};
