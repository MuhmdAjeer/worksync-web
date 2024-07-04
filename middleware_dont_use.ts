import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const session = await getToken({ req: request });

  const { access_token, username } = session || {};
  const { pathname } = request.nextUrl;
  console.log({ dd: session });

  // Redirect to login if no access token and not on an auth path
  if (!access_token && !pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Redirect to home if access token is present and on an auth path
  if (access_token && pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Redirect to onboarding if user does not have a username
  if (access_token && !username && !pathname.startsWith("/onboarding")) {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
