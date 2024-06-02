import { getSession } from "next-auth/react";
import type { NextRequest } from "next/server";

// export async function middleware(request: NextRequest) {
//   const session = await getSession();
//   console.log({session});

//   if (!session?.access_token && !request.nextUrl.pathname.startsWith("/auth")) {
//     return Response.redirect(new URL("/auth/login", request.url));
//   }
//   if (!session?.access_token && request.nextUrl.pathname.startsWith("/auth")) {
//     return Response.redirect(new URL("/", request.url));
//   }
// }

// import { withAuth } from "next-auth/middleware";

// export default withAuth({
//   // Matches the pages config in `[...nextauth]`
//   pages: {
//     signIn: "/auth/login",
//     error: "/error",
//   },
// });

export default function middleware() {
  return true;
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
