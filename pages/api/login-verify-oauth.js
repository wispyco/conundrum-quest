import { magic } from "../../lib/magic";
import { createSession } from "../../lib/auth-cookies";
import { createHandlers } from "../../lib/rest-utils";
import { UserModel } from "../../lib/models/user-model";

const handlers = {
  POST: async (req, res) => {
    // const didToken = magic.utils.parseAuthorizationHeader(
    //   req.headers.authorization
    // );

    // console.log('didToken',didToken)

    // magic.token.validate(didToken);
    // const { email, issuer } = await magic.users.getMetadataByToken(didToken);

    // console.log("email", email);

    return

    const userModel = new UserModel();
    // We auto-detect signups if `getUserByEmail` resolves to `undefined`
    let user;

    if (await userModel.getUserByEmail(email)) {
      user = await userModel.getUserByEmail(email);
    } else {
      let invited;
      let inviteCodeSent;

      if (req.body.inviteCode !== undefined) {
        invited = await userModel.getInvite(email);
        console.log("invited", invited);
        inviteCodeSent = true;
      } else {
        inviteCodeSent = false;
      }

      if (inviteCodeSent) {
        if (invited.data.inviteCode === parseInt(req.body.inviteCode)) {
          user = await userModel.createUser(email, invited.data.role);
        }
      } else {
        user = await userModel.createUser(email, "KNIGHT");
      }
    }

    const token = await userModel.obtainFaunaDBToken(user);

    await createSession(res, { token, email, issuer });

    res.status(200).send({ done: true });
  },
};

export default function login(req, res) {
  const handler = createHandlers(handlers);
  return handler(req, res);
}
