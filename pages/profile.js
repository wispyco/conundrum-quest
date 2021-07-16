import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { gql, useQuery } from "@apollo/client";
import useSWR from "swr";
import { useEffect } from "react";
import Layout from "../components/layout";
import { useRouter } from "next/router";

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

  const loading = user?.token === false || user === undefined;

  return {
    user,
    loading,
    error,
  };
}

export default function Profile() {
  const { user, loading } = useAuth();

  const router = useRouter();

  // useEffect(() => {
  //   console.log("window", window);
  //   console.log(Object.keys(router.query)[0]);
  //   if (Object.keys(router.query)[0] === "magic_credentials") {
  //     router.push(profile);
  //     // window.history.pushState({}, document.title, "/" + "profile");
  //   }
  // }, []);

  return (
    <Layout>
      <main>{loading ? "Loading..." : <Data user={user} />}</main>
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
