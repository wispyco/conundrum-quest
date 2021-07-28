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
import UpdateUserName from "../../components/UpdateUserName";

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
          <Header2>login email: {user.email}</Header2>
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
              <Header3>Welcome Knight {user.name}</Header3>
              <UpdateUserName user={user}/>
              <AddQuest onClick={clickedAddQuest}>
                {!addQuest ? "Add a Quest" : "X"}
              </AddQuest>

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
              <Header3>Welcome Moderator {user.name}</Header3>
              <AddQuest onClick={clickedAddQuest}>
                {!addQuest ? "Add a Quest" : "X"}
              </AddQuest>
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
  position:fixed;
  left:0;
  top:0;
  @media(max-width:1100px){
    position:relative;
    width:80%;
    margin: 150px auto 0 auto;
  }
  b {
    color: red;
  }
`;

const Header2 = styled.h2`
  text-align:center;
  margin-top:100px;
`

const Header3 = styled.h3`
  text-align:center;
`

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
  @media(max-width:1100px){
    width:100%;
  }
  margin: 0 auto;
`;

const QuestsWrap = styled.div`
  // width: 900px;
  // margin: 0 auto;
  text-align:center;
`;

const AddQuest = styled.button`
  width: 200px;
  padding: 10px;
  border-radius:30px;
  margin: 0 auto;
  display:block;
  &:hover{
    cursor:pointer;
  }
`

// const AddStreetWear = styled.button`
//   position: fixed;
//   bottom: 25px;
//   right: 25px;
// `;
