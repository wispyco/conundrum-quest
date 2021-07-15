import {
  getAuthCookie,
  removeAuthCookie,
  setAuthCookie,
} from "../../utils/authCookie";

export default async function logout(req, res) {
  const token = getAuthCookie(req);

  console.log(token);

  // already logged out
  // if (!token) return res.status(200).end();

  try {
    if (!token) {
      return res.send({ token: false });
    } else {
      res.status(200).send(JSON.stringify(token));
    }
  } catch (error) {
    console.error(error);
    res.status(error.requestResult.statusCode).send(error.message);
  }
}
