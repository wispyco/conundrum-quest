import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { gql, useQuery } from "@apollo/client";
import useSWR from "swr";
import { useEffect, useState } from "react";
import Layout from "../components/layout";
import { useRouter } from "next/router";
import { magicClient } from "../lib/magic";
import axios from "axios";

export const GET_DAD_HAT = gql`
  query FindUserByID($id: ID!) {
    findUserByID(id: $id) {
      _id
      hats {
        data {
          name
        }
      }
    }
  }
`;

const fetcher = (url) => fetch(url).then((r) => r.json());

function useAuth() {
  const { data: user, error, mutate } = useSWR("/api/user", fetcher);

  // const loading = user?.token === false || user === undefined;

  return {
    user,
    error,
  };
}

export default function Profile() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [userState, setUserState] = useState(null);

  const [magicState, setMagicState] = useState(false);

  // if (router.query.magic_credential) {

  // } else {

  useEffect(async () => {
    console.log("router query", router.query);

    // if (JSON.stringify(router.query) === "{}") {
    // } else {
    axios
      .get("/api/user")
      .then(function (response) {
        // handle success
        console.log("response", response);
        setUserState(response.data);
        return response.data;
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
    // }
  }, []);

  return (
    <Layout>
      <main>
        {userState === null ||
        userState === undefined ||
        userState.token === false ? (
          "Loading..."
        ) : (
          <Data user={userState} />
        )}
      </main>
    </Layout>
  );
}

const Data = ({ user }) => {
  const { loading, error, data } = useQuery(GET_DAD_HAT, {
    variables: { id: user.id },
  });

  if (loading) return <h1>Loading...</h1>;

  if (error) return <h1>{error.message}</h1>;

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
};
