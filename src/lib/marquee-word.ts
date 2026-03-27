export function getMarqueeWord(pathname: string | null): string {
  if (!pathname || pathname === "/") return "creative";
  if (pathname.startsWith("/about")) return "about";
  if (pathname.startsWith("/work")) return "work";
  if (pathname.startsWith("/contact")) return "hello";
  if (pathname.startsWith("/experiments")) return "play";
  return "creative";
}
