import { client } from "../../utils/faunaAuth";
import { query as q } from "faunadb";

export default async function handler(req, res) {
  console.log("req >>>>> ", req.body);

  const { Email, Password } = req.body.data;

  const auth = await client.query(
    q.Login(q.Match(q.Index("unique_User_email"), "anders@acornmade.com"), {
      password: "reading6188",
    })
  );

  console.log("auth secret >>>> ", auth);

  res.status(200).json({ name: "John Doe" });
}
