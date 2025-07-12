import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from 'jose'; 

// the following function handle the verifying of current token in the cookie
const verifying_current_token = async(token:string):Promise<boolean> => {

  try{
    // secure the jwt secret
    const refresh_token_key = process.env.REFRESH_TOKEN_KEY; // Keep this secure

    if ( !refresh_token_key) {
        throw new Error ("missing the jwt secret variable")
    }

    await jwtVerify(token,new TextEncoder().encode(refresh_token_key));

    return true;

  }catch(err){
    console.error("Token verification failed:",(err as Error).message)
    return false;
  }
}

export async function middleware(req:NextRequest) {
  // get path name
  const {pathname} = req.nextUrl;
  
  
  // crm logic
  if (pathname.startsWith("/crm")) { 
    // get token
    const token = req.cookies.get("crm_token")?.value;
    // auth routes (login/register)
    const authRoutes = ["/crm/auth/login","/crm/auth/register"];
  
    // if token is missing and trying access to protected routes - redirect users to auth routes
    if (!token && !authRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL("/crm/auth/login",req.url));
    }
  
    // if token is present check if it is valid
    if (token && !(await verifying_current_token(token))) {
      // token is invalid or expired so remove the token from cookies and redirect user to auth routes
      const logoutUrl = new URL("/api/crm/auth/logout", req.url);
      logoutUrl.searchParams.set("redirect", "/crm/auth/login");
      return NextResponse.redirect(logoutUrl);
    }
  
    // token exists and valid prevent access to auth routes
    if (token && await verifying_current_token(token) && authRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL("/crm/dashboard", req.url));
    }
  
    if (pathname === "/crm") {
      return NextResponse.redirect(new URL("/crm/dashboard",req.url));
    }

  }

  // shop logic
  if (pathname.startsWith("/")) {
    const token = req.cookies.get("shop_token")?.value;

    const authRoutes = ["/auth/login", "/auth/register"];

    const protectedRoutesPrefixes = [
      "/settings/profile",
      "/shop/cart",
      "/shop/wishlist",
    ];

    // Check if the route is protected
    const isProtectedRoute = protectedRoutesPrefixes.some((prefix) =>
      pathname.startsWith(prefix)
    );

    if (!token && isProtectedRoute) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    if (token && !(await verifying_current_token(token))) {
      const logoutUrl = new URL("/api/shop/auth/customerLogout", req.url);
      logoutUrl.searchParams.set("redirect", "/auth/login");
      return NextResponse.redirect(logoutUrl);
    }

    if (
      token &&
      (await verifying_current_token(token)) &&
      authRoutes.includes(pathname)
    ) {
      return NextResponse.redirect(new URL("/home", req.url));
    }

    if (pathname === "/") {
      return NextResponse.redirect(new URL("/home", req.url));
    }
  }


  return NextResponse.next(); // Default behavior allow requests to continue if there is no redirect;
}

export const config = {
  matcher:[ "/", "/shop/:path*","/crm/:path*"]  //apply to all crm routes and shop
}