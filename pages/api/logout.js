import { removeSession } from "../../lib/auth-cookies";
import { createHandlers } from "../../lib/rest-utils";

const handlers = {
  GET: async (req, res) => {
    console.log("test");
    await removeSession(res);
    // res.setHeader(
    //   "Set-Cookie",
    //   "key=fauna_client; Max-Age=-1; domain=conundrum-quest.vercel.app; path=/profile;expires=Thu, 01 Jan 1970 00:00:01 GMT;"
    // );
    res.status(200).send({ done: true });
  },
};

export default function logout(req, res) {
  console.log("what");

  const handler = createHandlers(handlers);
  return handler(req, res);
}
