import { serialize, parse } from "cookie";

const TOKEN_NAME = "fauna_client";

export function getAuthCookie(req) {
  // for API Routes, we don't need to parse the cookies
  if (req.cookies) return req.cookies[TOKEN_NAME];

  // for pages, we do need to parse the cookies
  const cookies = parse(req.headers.cookie || "");
  return cookies[TOKEN_NAME];
}
