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
import CreateInvite from "../components/CreateInvite";
import ViewInvites from "../components/ViewInvites";
import CreateQuest from "../components/CreateQuest";
import QuestsProfile from "../components/QuestsProfile";

const fetcher = (url) => fetch(url).then((r) => r.json());

function useAuth() {
  const {
    data: user,
    error,
    mutate,
  } = useSWR("/api/user", fetcher, { refreshInterval: 3 });

  const loading = user?.token === false || user === undefined;

  return {
    user,
    loading,
    error,
  };
}

export default function Profile() {
  const { user, loading, error } = useAuth();

  // const [showCreateDadHat, setShowCreateDadHat] = useState(true);

  // const show = () => {
  //   setShowCreateDadHat(true);
  // };

  console.log("user >>>>>>", user);

  const [addQuest, setAddQuest] = useState(false);

  const clickedAddQuest = () => {
    setAddQuest((clicked) => !clicked);
  };

  if (error) return <h1>{error.message}</h1>;

  return (
    <Layout>
      <main>
        {loading ? (
          <>
            <Loading />
            <Header1>SignUp</Header1>
          </>
        ) : (
          <>
            <h1>Current User</h1>
            <pre>{JSON.stringify(user, null, 2)}</pre>
            {user.role === "ADMIN" && (
              <>
                <CreateInviteWrap>
                  <CreateInvite />
                </CreateInviteWrap>
                <ViewInvitesWrap>
                  <ViewInvites />
                </ViewInvitesWrap>
              </>
            )}
            {user.role === "KNIGHT" && (
              <>
                <h1>Welcome young Knight</h1>
                <button onClick={clickedAddQuest}>
                  {!addQuest ? "Add a Quest" : "X"}
                </button>

                {addQuest && (
                  <CreateQuestWrap>
                    <CreateQuest
                      clickedAddQuest={clickedAddQuest}
                      user={user}
                    />
                  </CreateQuestWrap>
                )}
                <QuestsWrap>
                  <QuestsProfile user={user} />
                </QuestsWrap>
              </>
            )}

            {/* <Data user={user} />
            {showCreateDadHat ? (
              <CreateDadHat
                user={user}
                setShowCreateDadHat={setShowCreateDadHat}
              />
            ) : (
              <AddStreetWear onClick={show}>Add Your Fit</AddStreetWear>
            )}
            <UpdateProfile user={user} /> */}
          </>
        )}
      </main>
    </Layout>
  );
}

// const Data = ({ user }) => {
//   const { loading, error, data } = useQuery(GET_DAD_HATS_BY_USER_ID, {
//     variables: { id: user.id },
//   });

//   if (loading) return <h1>Loading Data...</h1>;

//   if (error) return <h1>{error.message}</h1>;

//   return (
//     <>
//       {data && <DadHats user={user} data={data} />}
//       {/* <pre>{JSON.stringify(data?.findUserByID?.hats, null, 2)}</pre> */}
//     </>
//   );
// };

export const Header1 = styled.h1`
  text-align: center;
  font-weight: 100;
  letter-spacing: 2px;
  font-size: 22px;
  width: 50%;
  margin: 0 auto;
  b {
    color: red;
  }
`;

const ViewInvitesWrap = styled.div``;

const CreateInviteWrap = styled.div`
  form {
    width: 50%;
    margin: 0 auto;
    display: grid;
    grid-row-gap: 20px;
    input,
    select {
      padding: 10px;
    }
  }
`;

const CreateQuestWrap = styled.div``;

const QuestsWrap = styled.div``;

// const AddStreetWear = styled.button`
//   position: fixed;
//   bottom: 25px;
//   right: 25px;
// `;
