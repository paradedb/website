/**
 * Routes that render a full landing page and therefore use the homepage
 * "chrome": the site banner, the transparent navbar overlaid on the hero, and
 * the indigo footer.
 *
 * This is the live homepage ("/") plus the /preview routes used to test landing
 * variants, so a preview matches exactly what the variant looks like when live.
 *
 * Keep this dependency-free: it is imported by client components and must not
 * pull in the landings registry (which references server components).
 */
export function isLandingRoute(pathname: string): boolean {
  return pathname === "/" || pathname.startsWith("/preview");
}
