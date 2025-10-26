import { NextResponse } from 'next/server';
import { auth } from './utils/auth';
export default auth((req) => {
	// req.auth
	const regexUnprotectedRoutes = /^\/(?:api|login|register(?:\/.*)??)$/;
	const loggedUser = req.auth;
	const currentPath = req.nextUrl.pathname;

	const response = NextResponse.next();

	// Protect all routes except unprotected ones
	if (!loggedUser && !regexUnprotectedRoutes.test(currentPath)) {
		return NextResponse.redirect(new URL('/login', req.url));
	}

	// Redirect logged in users from login/register pages (but allow root)
	if (loggedUser && /^\/(?:login|register)(?:\/.*)?$/.test(currentPath)) {
		return NextResponse.redirect(new URL('/', req.url));
	}

	// Redirect students to student dashboard if they try to access non-student routes but allow specific exam routes
	if (loggedUser && loggedUser.user.accountType === 'student' && !currentPath.startsWith('/student')) {
		if (!/^\/exams\/\d+\/students\/\d+$/.test(currentPath)) {
			return NextResponse.redirect(new URL('/student/classes', req.url));
		}
	}

	// Redirect admin to admin dashboard if they try to access non-admin routes
	if (loggedUser && loggedUser.user.accountType === 'admin' && !currentPath.startsWith('/admin')) {
		return NextResponse.redirect(new URL('/admin/dashboard', req.url));
	}

	// Allow teachers to access only teacher routes and specific student exam routes
	if (loggedUser && loggedUser.user.accountType === 'teacher' && !currentPath.startsWith('/teacher')) {
		if (!/^\/exams\/\d+\/students\/\d+$/.test(currentPath)) {
			return NextResponse.redirect(new URL('/teacher/dashboard', req.url));
		}
	}

	return response;
});

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
