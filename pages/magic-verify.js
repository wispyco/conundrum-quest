import { useRouter } from "next/router";
import { useEffect } from "react";
import axios from "axios";
import { magicClient } from "../lib/magic";

export default function MagicVerify() {
  // The redirect contains a `provider` query param if the user is logging in with a social provider
  const router = useRouter();

  useEffect(() => {
    finishEmailRedirectLogin();
  }, [router.query]);

  const finishEmailRedirectLogin = () => {
    if (router.query.magic_credential)
      magicClient.auth
        .loginWithCredential()
        .then((didToken) => authenticateWithServer(didToken));
  };

  // Send token to server to validate
  const authenticateWithServer = async (didToken) => {
    let res = await fetch("/api/login-verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + didToken,
      },
    });

    console.log("res.status >>>>>>>", res.status);

    if (res.status === 200) {
      // Set the UserContext to the now logged in user
      // let userMetadata = await magicClient.user.getMetadata();
      // await setUser(userMetadata);
      router.push("/profile");
    }
  };

  // useEffect(async () => {
  //   console.log("router query", router.query);

  //   console.log(router.query.magic_credential);
  //   const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY);
  //   await magic.auth
  //     .loginWithCredential(router.query.magic_credential)
  //     .then((didToken) => {
  //       console.log("didToken", didToken);
  //       authenticateWithServer(didToken);
  //     });

  //   // Send token to server to validate
  //   const authenticateWithServer = async (didToken) => {
  //     let res = await fetch("/api/login-verify", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: "Bearer " + didToken,
  //       },
  //     });

  //     if (res.status === 200) {
  //       // Set the UserContext to the now logged in user
  //       let userMetadata = await magic.user.getMetadata();
  //       await setUser(userMetadata);
  //       Router.push("/profile");
  //     }
  //   };
  // }, [router.query]);

  return <h1>Thanks for Joining you will be redirected to your profile</h1>;
}
