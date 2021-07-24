import { magic } from "../../lib/magic";
import { createSession } from "../../lib/auth-cookies";
import { createHandlers } from "../../lib/rest-utils";
import { UserModel } from "../../lib/models/user-model";

const handlers = {
  POST: async (req, res) => {
    const didToken = magic.utils.parseAuthorizationHeader(
      req.headers.authorization
    );

    magic.token.validate(didToken);
    const { email, issuer } = await magic.users.getMetadataByToken(didToken);

    console.log("email", email);

    const userModel = new UserModel();
    // We auto-detect signups if `getUserByEmail` resolves to `undefined`

      const invited = await userModel.getInvite(email);

      console.log('invited >>>>>>>> ',invited)

      let user

      console.log('invited.inviteCode',invited.data.inviteCode)

      if (invited.data.inviteCode ===  123456 && invited.data.role === "ADMIN"){

        user =
        (await userModel.getUserByEmail(email)) ??
        (await userModel.createUser(email, invited.data.role));
      }

      else {
        user = null
      }



    const token = await userModel.obtainFaunaDBToken(user);

    console.log("token, is it there", token);

    await createSession(res, { token, email, issuer });

    res.status(200).send({ done: true });
  },
};

export default function login(req, res) {
  const handler = createHandlers(handlers);
  return handler(req, res);
}
