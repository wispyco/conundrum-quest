// import { removeSession } from "../../lib/auth-cookies";
// import { createHandlers } from "../../lib/rest-utils";

// const handlers = {
//   GET: async (req, res) => {
//     console.log("test");
//     await removeSession(res);
//     // res.setHeader(
//     //   "Set-Cookie",
//     //   "key=fauna_client; Max-Age=-1; domain=conundrum-quest.vercel.app; path=/profile;expires=Thu, 01 Jan 1970 00:00:01 GMT;"
//     // );
//     res.status(200).send({ done: true });
//   },
// };

// export default function logout(req, res) {
//   console.log("what");

//   const handler = createHandlers(handlers);
//   return handler(req, res);
// }

// import { serialize, parse } from "cookie";

// export default async (req, res) => {
//   /* remove cookies from request header */

//   // res.setHeader("Set-Cookie", [
//   //   serialize("fauna_client", "", {
//   //     maxAge: Date.now(),
//   //     expires: "Thu, 01 Jan 1970 00:00:01 GMT",
//   //     domain: "conundrum.quest",
//   //     httpOnly: true,
//   //     secure: true,
//   //     sameSite: "lax",
//   //     path: "/",
//   //   }),
//   // ]);

//   let dt = new Date();
//   dt.setDate(dt.getDate() - 9999);

//   console.log("dt", dt);

//   res.setHeader(
//     "Set-Cookie",
//     serialize("fauna_client", "", [
//       {
//         maxAge: -1,
//         expires: dt,
//         domain: "conundrum-quest.vercel.app",
//         httpOnly: true,
//         secure: true,
//         sameSite: "lax",
//         path: "/",
//       },
//     ])
//   );

//   // res.setHeader("Set-Cookie", [
//   //   serialize("fauna_client", "", {
//   //     maxAge: Date.now(),
//   //     expires: "Thu, 01 Jan 1970 00:00:01 GMT",
//   //     httpOnly: true,
//   //     secure: true,
//   //     sameSite: "lax",
//   //     path: "/",
//   //   }),
//   // ]);

//   // res.writeHead(302, { Location: '/api/login' });
//   res.status(200).send({ done: true });
// };

import { serialize, parse } from "cookie";

import { removeCookies } from "cookies-next";

export default async (req, res) => {
  /* remove cookies from request header */

  // res.setHeader("Set-Cookie", [
  //   serialize("fauna_client", "", {
  //     maxAge: -1,
  //     domain: "conundrum-quest.vercel.app",
  //   }),
  // ]);

  // const test = removeCookies(req, "fauna_client", {
  //   path: "/",
  //   domain: "conundrum-quest.vercel.app",
  // });

  // console.log("test", test);

  // res.setHeader("Set-Cookie", [
  //   serialize("fauna_client", "", {
  //     maxAge: -1,
  //     expires: new Date(Date.now() - 100000),
  //     httpOnly: true,
  //     secure: true,
  //     path: "/",
  //     sameSite: "lax",
  //     domain: "conundrum-quest.vercel.app",
  //   }),
  //   // serialize('mytoken2', '', {
  //   //   maxAge: -1,
  //   //   path: '/',
  //   // }),
  // ]);

  const COOKIE_OPTIONS = {
    maxAge: -1,
    expires: new Date(Date.now() - 100000),
    httpOnly: true,
    secure: true,
    path: "/",
    sameSite: "lax",
    // domain: "conundrum-quest.vercel.app",
  };

  res.clearCookie("fauna_client", COOKIE_OPTIONS);

  // res.setHeader(
  //   "Set-Cookie",
  //   "fauna_client=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=conundrum-quest.vercel.app"
  // );

  /* remove cookies from request header */
  // res.setHeader("Set-Cookie", [
  //   serialize("fauna_token", "", {
  //     maxAge: -1,
  //     path: "/",
  //   }),
  // serialize('mytoken2', '', {
  //   maxAge: -1,
  //   path: '/',
  // }),
  // ]);

  //comment upload fdsfs

  // res.writeHead(302, { Location: '/api/login' });
  res.status(200).send({ done: true });
};
