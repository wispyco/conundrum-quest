import faunadb from "faunadb";

console.log("FAUNA CLIENT KEY", process.env.FAUNA_CLIENT_KEY);

export const client = new faunadb.Client({
  secret: process.env.FAUNA_CLIENT_KEY,
});

// export const authClient = (secret) =>
//   new faunadb.Client({
//     secret,
//   });
