import { NextResponse } from "next/server";
import { auth } from "./utils/auth";
export default auth((req) => {
  // req.auth
		const regexUnprotectedRoutes = /^\/(?:api|login|register(?:\/.*)??)$/;
	const loggedUser = req.auth
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

	return response;
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
