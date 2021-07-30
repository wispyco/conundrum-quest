import { query as q } from "faunadb";
import { authClient } from "../../utils/faunaAuth";
import { getAuthCookie } from "../../utils/authCookie";
import { getSession } from "../../lib/auth-cookies";

export default async function user(req, res) {
  // const token = getAuthCookie(req);
  const token = await getSession(req);

  console.log("token user", token);

  try {
    if (!token || token === undefined) {
      return res.status(200).send({ token: false });
    }
    
      
      // res.status(200).json({ ...data, id: ref.id, token: true });
      res.status(200).json({ tokenId:token, token: true });
      
    } catch (error) {
    console.error(error);
    res.status(error.requestResult.statusCode).send(error.message);
  }
}
