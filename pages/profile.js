import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { gql, useMutation, useQuery } from "@apollo/client";
import useSWR from "swr";
import { useEffect, useState } from "react";
import Layout from "../components/layout";
import { useRouter } from "next/router";
import { magicClient } from "../lib/magic";
import axios from "axios";
import styled, { keyframes } from "styled-components";
import { useForm } from "react-hook-form";
import DadHats from "../components/DadHats";
import UpdateProfile from "../components/UpdateProfile";
import CreateDadHat from "../components/CreateDatHat";
import { GET_DAD_HATS_BY_USER_ID } from "../gql/schema";

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

  const [showCreateDadHat, setShowCreateDateHat] = useState(true);

  return (
    <Layout>
      <main>
        {loading ? (
          <ImageRotate>
            <img src="/logo-3.png" />
          </ImageRotate>
        ) : (
          <>
            <Data user={user} />
            {showCreateDadHat && <CreateDadHat user={user} />}
            <UpdateProfile user={user} />
          </>
        )}
      </main>
    </Layout>
  );
}

const Data = ({ user }) => {
  const { loading, error, data } = useQuery(GET_DAD_HATS_BY_USER_ID, {
    variables: { id: user.id },
  });

  if (loading) return <h1>Loading Data...</h1>;

  if (error) return <h1>{error.message}</h1>;

  return (
    <>
      {data && <DadHats user={user} data={data} />}
      {/* <pre>{JSON.stringify(data?.findUserByID?.hats, null, 2)}</pre> */}
    </>
  );
};

const rotation = keyframes`
  0% {
    transform: rotate(360deg);
  }
  100% {
    transform: rotate(0deg);
  }
`;

const ImageRotate = styled.div`
  width: 149px;
  height: 149px;
  left: 50%;
  margin-left: -74.5px;
  top: 25%;
  position: fixed;

  animation: ${rotation} 2s infinite linear;
`;
