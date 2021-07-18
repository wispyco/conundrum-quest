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
import Loading from "../components/Loading";

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

  const [showCreateDadHat, setShowCreateDadHat] = useState(true);

  const show = () => {
    setShowCreateDadHat(true);
  };

  return (
    <Layout>
      <main>
        {loading ? (
          <>
            <Loading />
            <Header1>SignUp to Add you Fit</Header1>
          </>
        ) : (
          <>
            <Data user={user} />
            {showCreateDadHat ? (
              <CreateDadHat
                user={user}
                setShowCreateDadHat={setShowCreateDadHat}
              />
            ) : (
              <AddStreetWear onClick={show}>Add Your Fit</AddStreetWear>
            )}

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

const Header1 = styled.h1`
  text-align: center;
`;

const AddStreetWear = styled.button`
  position: fixed;
  bottom: 25px;
  right: 25px;
`;
