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

export default async (req, res) => {
  /* remove cookies from request header */

  var d = new Date(); //Create an date object
  d.setTime(d.getTime() - 1000 * 60 * 60 * 24);

  res.setHeader("Set-Cookie", [
    serialize("fauna_client", "", {
      maxAge: -1,
      expires: new Date().now() - 1000,
      domain: "conundrum-quest.vercel.app",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    }),
  ]);

  //comment upload

  // res.writeHead(302, { Location: '/api/login' });
  res.status(200).send({ done: true });
};
