import { removeSession } from "../../lib/auth-cookies";
import { createHandlers } from "../../lib/rest-utils";

const handlers = {
  GET: async (req, res) => {
    console.log("test");
    await removeSession(res);

    res.status(200).send({ done: true });
  },
};

export default function logout(req, res) {
  console.log("what");

  const handler = createHandlers(handlers);
  return handler(req, res);
}
