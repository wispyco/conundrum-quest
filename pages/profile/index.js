import Head from "next/head";
import Image from "next/image";
// import styles from "../styles/Home.module.css";
import { gql, useMutation, useQuery } from "@apollo/client";
import useSWR from "swr";
import { useEffect, useState } from "react";
import Layout from "../../components/layout";
import { useRouter } from "next/router";
import { magicClient } from "../../lib/magic";
import axios from "axios";
import styled, { keyframes } from "styled-components";
import { useForm } from "react-hook-form";
import DadHats from "../../components/DadHats";
import UpdateProfile from "../../components/UpdateProfile";
import CreateDadHat from "../../components/CreateDatHat";
import { GET_DAD_HATS_BY_USER_ID } from "../../gql/schema";
import Loading from "../../components/Loading";
import CreateInvite from "../../components/CreateInvite";
import ViewInvites from "../../components/ViewInvites";
import CreateQuest from "../../components/CreateQuest";
import QuestsProfile from "../../components/QuestsProfile";
import QuestsStatusEdit from "../../components/QuestsStatusEdit";
import Nominations from "../../components/Nominations";
import NominationsFull from "../../components/NominationsFull";

const fetcher = (url) => fetch(url).then((r) => r.json());

function useAuth() {
  const {
    data: user,
    error,
    mutate,
  } = useSWR("/api/user", fetcher, { refreshInterval: 3 });
  // function useAuth() {
  //   const { data: user, error, mutate } = useSWR("/api/user", fetcher);

  const loading = user?.token === false || user === undefined;

  return {
    user,
    loading,
    error,
  };
}

export default function Profile() {
  const { user, loading, error } = useAuth();

  const [addQuest, setAddQuest] = useState(false);

  const clickedAddQuest = () => {
    setAddQuest((clicked) => !clicked);
  };

  if (error) return <h1>{error.message}</h1>;

  return (
    <Layout>
      {loading ? (
        <>
          <Loading />
          <Header1>SignUp</Header1>
        </>
      ) : (
        <>
          <h1>Account Email: {user.email}</h1>
          {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
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
              <h1>Welcome Knight {user.name}</h1>
              <button onClick={clickedAddQuest}>
                {!addQuest ? "Add a Quest" : "X"}
              </button>

              {addQuest && (
                <CreateQuestWrap>
                  <CreateQuest clickedAddQuest={clickedAddQuest} user={user} />
                </CreateQuestWrap>
              )}
              <QuestsWrap>
                <QuestsProfile user={user} />
              </QuestsWrap>
              <Nominations user={user} />
            </>
          )}
          {user.role === "MODERATOR" && (
            <>
              <h1>Welcome Mod {user.name}</h1>
              <button onClick={clickedAddQuest}>
                {!addQuest ? "Add a Quest" : "X"}
              </button>
              {addQuest && (
                <CreateQuestWrap>
                  <CreateQuest clickedAddQuest={clickedAddQuest} user={user} />
                </CreateQuestWrap>
              )}
              <QuestsWrap>
                <QuestsStatusEdit user={user} />
              </QuestsWrap>
              <NominationsFull user={user} />
            </>
          )}
        </>
      )}
    </Layout>
  );
}

export const Header1 = styled.h1`
  text-align: center;
  font-weight: 900;
  letter-spacing: 2px;
  font-size: 42px;
  width: 50%;
  margin: 25px auto;
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

const CreateQuestWrap = styled.div`
  width: 900px;
  margin: 0 auto;
`;

const QuestsWrap = styled.div`
  // width: 900px;
  // margin: 0 auto;
  text-align:center;
`;

// const AddStreetWear = styled.button`
//   position: fixed;
//   bottom: 25px;
//   right: 25px;
// `;
