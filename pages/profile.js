import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { gql, useQuery } from "@apollo/client";
import useSWR from "swr";
import { useEffect } from "react";
import Layout from "../components/layout";

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

export default function Profile() {
  const { data: user, error: userError } = useSWR("/api/user", fetcher);

  return (
    <Layout>
      <main>{user && <Data user={user} />}</main>
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
