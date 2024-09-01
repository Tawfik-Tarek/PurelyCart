import { NextResponse, NextRequest } from "next/server";
import { auth } from "./server/auth";

// Middleware for admin routes
async function adminMiddleware(request: NextRequest, session: any) {
  console.log("Admin Middleware Triggered");
  if (!session || session.user.role !== "admin") {
    console.log("Not an Admin");
    return NextResponse.redirect(new URL("/dashboard/settings", request.url));
  }
  return NextResponse.next();
}

// // Middleware for user routes
// async function userMiddleware(request: NextRequest, session: any) {
//   console.log("User Middleware Triggered");
//   if (!session || !session.user.role) {
//     console.log("Not a User");
//     return NextResponse.redirect(new URL("/", request.url));
//   }
//   return NextResponse.next();
// }

// Lookup map for route-specific middleware
const routeMiddlewareMap: { [key: string]: (req: NextRequest, session: any) => Promise<NextResponse> } = {
  "/dashboard/products": adminMiddleware,
  "/dashboard/add-product": adminMiddleware,
  "/dashboard/analytics": adminMiddleware,
};

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.pathname;

  // Fetch and cache the session once
  const session = await auth();

  // Check if the route matches any middleware in the map
  const selectedMiddleware = routeMiddlewareMap[url];
  if (selectedMiddleware) {
    return await selectedMiddleware(request, session);
  }

  // Default behavior if no specific middleware applies
  return NextResponse.next();
}

// Configuration with matcher patterns
export const config = {
  matcher: Object.keys(routeMiddlewareMap), // Automatically matches all routes in the map
};
