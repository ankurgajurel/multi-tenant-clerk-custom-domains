import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export default clerkMiddleware((auth, request: NextRequest) => {
  const hostname = request.headers.get("host");
  const url = request.nextUrl.clone();

  // Define your main app domain
  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || "localhost:3000";
  
  // If it's the main app domain, continue normally
  if (hostname === appDomain) {
    return NextResponse.next();
  }

  // If it's a custom domain, rewrite to the [domain] route
  if (hostname && hostname !== appDomain) {
    url.pathname = `/${hostname}${url.pathname === "/" ? "" : url.pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};