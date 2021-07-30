import useSWR from "swr";
import { useEffect, useState } from "react";
import Layout from "../../components/layout";
import styled, { keyframes } from "styled-components";
import Loading from "../../components/Loading";
import CreateInvite from "../../components/CreateInvite";
import ViewInvites from "../../components/ViewInvites";
import CreateQuest from "../../components/CreateQuest";
import QuestsProfile from "../../components/QuestsProfile";
import QuestsStatusEdit from "../../components/QuestsStatusEdit";
import Nominations from "../../components/Nominations";
import NominationsFull from "../../components/NominationsFull";
import UpdateUserName from "../../components/UpdateUserName";
import { query as q } from "faunadb";
import { authClient } from "../../utils/faunaAuth";
import { useRouter } from "next/router";

const fetcher = (url) => fetch(url).then((r) => r.json());

// function useAuth() {
//   const {
//     data: user,
//     error,
//     mutate,
//   } = useSWR("/api/user-profile", fetcher, { refreshInterval: 3 });
  function useAuth() {
    const { data: user, error, mutate, isValidating } = useSWR("/api/user-profile", fetcher);

    console.log('user >>>> ',user)

  const loading = user?.token === false || user === undefined || isValidating;

  return {
    user,
    loading,
    error,
  };
}

export default function Profile() {

  const { data: user, error, mutate, isValidating } = useSWR("/api/user-profile", fetcher);


  const router = useRouter()

  // const { user, loading, error } = useAuth();

  const [userData, setUserData] = useState({});

  useEffect(() => {

    const identify = authClient(user?.tokenId)
    .query(q.Get(q.CurrentIdentity()))
    .then(function (res) {
      return res;
    });

    async function setData() {
      try {
        const ref = await identify;

        setUserData({ ...ref.data, id: ref.ref.value.id });
      } catch (e) {
        console.log("e", e);
      }
    }
    setData();


    // TODO: make this work better for thos who visit profile page but aren't logged in
    // if(!user){
    //   router.push("/login-magic-public")
    // }

  }, [user, error, mutate, isValidating]);

  console.log('user, error, mutate, isValidating', user, error, mutate, isValidating)

  async function report(e, id) {
    var data = "action" in e ? e["document"].data : e.data;
    setUserData({ ...data, id: id });
  }

  var stream;
  const startStream = async () => {
    const ref = await identify;

    stream = authClient(user?.tokenId)
      .stream.document(ref.ref)
      .on("snapshot", (snapshot) => {
        report(snapshot, ref.ref.value.id);
      })
      .on("version", (version) => {
        report(version, ref.ref.value.id);
      })
      .on("error", (error) => {
        console.log("Error:", error);
        stream.close();
        setTimeout(startStream, 1000);
      })
      .start();
  };

  //startStream();

  const [addQuest, setAddQuest] = useState(false);

  const clickedAddQuest = () => {
    setAddQuest((clicked) => !clicked);
  };

  console.log('userData',userData)

  if (error) return <h1>{error.message}</h1>;
  if (isValidating) return <Layout><Loading/></Layout>
  if(user === undefined || !userData) return <Layout><Loading/>undefined</Layout>

  return (
    <Layout>
      <pre>
    {/* {JSON.stringify(userData, null,2)} */}
    {/* {JSON.stringify(user, null,2)} */}
    </pre>
      {/* {!user.token ? (
        <>
          <Header1>SignUp</Header1>
        </>
      ) : ( */}
        <>
          <Header2>login email: {userData.email}</Header2>
          {userData.role === "ADMIN" && (
            <>
              <CreateInviteWrap>
                <CreateInvite />
              </CreateInviteWrap>
              <ViewInvitesWrap>
                <ViewInvites />
              </ViewInvitesWrap>
            </>
          )}
          {userData.role === "KNIGHT" && (
            <>
              <Header3>Welcome Knight {userData.name}</Header3>
              <UpdateUserName user={userData} />
              <AddQuest onClick={clickedAddQuest}>
                {!addQuest ? "Add a Quest" : "X"}
              </AddQuest>

              {addQuest && (
                <CreateQuestWrap>
                  <CreateQuest
                    clickedAddQuest={clickedAddQuest}
                    user={userData}
                  />
                </CreateQuestWrap>
              )}
              <QuestsWrap>
                <QuestsProfile user={userData} />
              </QuestsWrap>
              <Nominations user={userData} />
            </>
          )}
          {userData.role === "MODERATOR" && (
            <>
              <Header3>Welcome Moderator {userData.name}</Header3>
              <AddQuest onClick={clickedAddQuest}>
                {!addQuest ? "Add a Quest" : "X"}
              </AddQuest>
              {addQuest && (
                <CreateQuestWrap>
                  <CreateQuest
                    clickedAddQuest={clickedAddQuest}
                    user={userData}
                  />
                </CreateQuestWrap>
              )}
              <QuestsWrap>
                <QuestsStatusEdit user={userData} />
              </QuestsWrap>
              <NominationsFull user={userData} />
            </>
          )}
        </>
      {/* )} */}
    </Layout>
  );
}

export const Header1 = styled.h1`
  text-align: center;
  font-weight: 900;
  letter-spacing: 2px;
  font-size: 42px;
  width: 50%;
  position: fixed;
  left: 0;
  top: 0;
  @media (max-width: 1100px) {
    position: relative;
    width: 80%;
    margin: 150px auto 0 auto;
  }
  b {
    color: red;
  }
`;

const Header2 = styled.h2`
  text-align: center;
  margin-top: 100px;
`;

const Header3 = styled.h3`
  text-align: center;
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
  @media (max-width: 1100px) {
    width: 100%;
  }
  margin: 0 auto;
`;

const QuestsWrap = styled.div`
  // width: 900px;
  // margin: 0 auto;
  text-align: center;
`;

const AddQuest = styled.button`
  width: 200px;
  padding: 10px;
  border-radius: 30px;
  margin: 0 auto;
  display: block;
  &:hover {
    cursor: pointer;
  }
`;

// const AddStreetWear = styled.button`
//   position: fixed;
//   bottom: 25px;
//   right: 25px;
// `;
