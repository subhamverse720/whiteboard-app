import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server";

export default withAuth(
     function middleware() {
        return NextResponse.next();
     },
     {
        callbacks: {
            async authorized({ req, token }) {
                // This is a work-around for handling redirect on auth pages.
                // We return true here so that the middleware function above
                // is always called.
                const {pathname} = req.nextUrl
                if(
                    pathname.startsWith('/api/auth') ||
                    pathname === "/login" ||
                    pathname === "register"
                )
                return true;

                if(pathname === "/")
                    return true

                //if(token) return true;
                return !!token; 
                
            },
        },
     }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};