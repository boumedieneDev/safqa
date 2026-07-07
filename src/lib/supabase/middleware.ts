import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { getAccountKind, getHomePathForProfile, getPortalKind, getProfileAssignmentIssue } from "@/lib/auth/roles";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function updateSession(request: NextRequest) {
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith("/admin");
  const isInstitutionRoute = pathname.startsWith("/institution");
  const isOperatorRoute = pathname.startsWith("/operator");
  const isLoginRoute = pathname === "/login";
  const isProtectedRoute = isAdminRoute || isInstitutionRoute || isOperatorRoute;

  if (!user && isProtectedRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("next", pathname);
    return copyCookiesToRedirect(supabaseResponse, redirectUrl);
  }

  if (!user) {
    return supabaseResponse;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role,status,organization_id,operator_id")
    .eq("id", user.id)
    .single();

  const assignmentIssue = getProfileAssignmentIssue(profile);

  if (assignmentIssue && isProtectedRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("error", assignmentIssue);
    return copyCookiesToRedirect(supabaseResponse, redirectUrl);
  }

  if (assignmentIssue || !profile) {
    return supabaseResponse;
  }

  const portalKind = getPortalKind(profile.role);
  const accountKind = getAccountKind(profile.role);

  if (isLoginRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = getHomePathForProfile(profile);
    redirectUrl.search = "";
    return copyCookiesToRedirect(supabaseResponse, redirectUrl);
  }

  if (isAdminRoute && portalKind !== "admin") {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = getHomePathForProfile(profile);
    redirectUrl.search = "";
    return copyCookiesToRedirect(supabaseResponse, redirectUrl);
  }

  if (isOperatorRoute && portalKind !== "operator") {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = getHomePathForProfile(profile);
    redirectUrl.search = "";
    return copyCookiesToRedirect(supabaseResponse, redirectUrl);
  }

  if (isInstitutionRoute && portalKind !== "institution" && accountKind !== "platform") {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = getHomePathForProfile(profile);
    redirectUrl.search = "";
    return copyCookiesToRedirect(supabaseResponse, redirectUrl);
  }

  return supabaseResponse;
}

function copyCookiesToRedirect(sourceResponse: NextResponse, redirectUrl: URL) {
  const redirectResponse = NextResponse.redirect(redirectUrl);
  sourceResponse.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie);
  });
  return redirectResponse;
}
