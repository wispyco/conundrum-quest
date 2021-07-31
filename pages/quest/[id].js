import { useMutation, useQuery } from "@apollo/client";
import { Router, useRouter } from "next/router";
import Loading from "../../components/Loading";
import {
  GET_KNIGHTS,
  GET_QUEST_BY_ID,
  UPDATE_QUEST_FOLLOWERS,
} from "../../gql/schema";
import styled from "styled-components";
import Layout from "../../components/layout";
import Link from "next/link";
import useSWR from "swr";
import { query as q } from "faunadb";
import { authClient } from "../../utils/faunaAuth";
import { useState, useEffect } from "react";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function QuestSingle() {
  const { data: user, error, mutate } = useSWR("/api/user-profile", fetcher);

  const Router = useRouter();

  const {
    loading: getLoading,
    error: getError,
    data,
  } = useQuery(GET_QUEST_BY_ID, {
    variables: { id: Router.query.id },
  });

  const {
    loading: knightsLoading,
    error: knightsError,
    data: knightsData,
  } = useQuery(GET_KNIGHTS);

  if (getError || knightsError)
    return <h1>failed to get {JSON.stringify(knightsError, null, 2)} </h1>;

  if (getLoading || knightsLoading) return <Loading />;
  const { findQuestByID } = data;

  return (
    <Layout>
      {/* <pre>
            {JSON.stringify(knightsData,null,2)}
        </pre> */}
      <QuestCard user={user} knights={knightsData} quest={findQuestByID} />
    </Layout>
  );
}

const QuestCard = ({ quest, knights, user }) => {
  const router = useRouter();

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
  }, [user]);

  const [
    updateQuestFollowers,
    { data: updateQuestFollowersData, loading: saving },
  ] = useMutation(UPDATE_QUEST_FOLLOWERS);

  const follow = async (userId, QuestId, userName) => {
    console.log("questId", QuestId);
    console.log("userId", userData.id);

    const updateQuestFollowersResponse = await updateQuestFollowers({
      variables: {
        name: userName,
        // twitter: String,
        isFollowing: true,
        followerId: JSON.stringify(userId),
        id: QuestId,
      },
    }).catch(console.error);
  };

  return (
    <Card>
      <h1>{quest?.name}</h1>
      <p>{quest?.description}</p>
      <HeroTitle>
        <h2>Heros</h2>
        {!user?.token ? (
          <Link href={`/login-magic-public`}>Sign Up to Nominate Hero</Link>
        ) : (
          <Link href={`/profile/nominate-hero/${quest._id}`}>
            Nominate Hero
          </Link>
        )}
      </HeroTitle>

      <HerosGrid>
        {quest.heros.data.map((hero) => {
          return (
            <>
              {hero.isAccepted && (
                <Hero>
                  <h3>{hero?.name}</h3>
                  <p>{hero?.description}</p>
                  <a rel="noreferrer" target="_blank" href={hero?.wikipedia}>
                    Wikipedia Article
                  </a>
                </Hero>
              )}
            </>
          );
        })}
      </HerosGrid>
      <h2>Knights</h2>
      <h3>Submitted By: {quest?.owner?.name}</h3>
      <h2>Following:</h2>
      {quest?.followers.map((follower) => {
        return (
          <>
            <p>{follower.name}</p>
            <p>{follower.id}</p>
            <p>{userData.id}</p>
          </>
        );
      })}

      <FollowTitle>
        <h2>Follow this quest</h2>
        {!user?.token ? (
          <Link href={`/login-magic-public`}>Sign Up to Follow</Link>
        ) : (
          <>
            {quest.followers
              .filter((follower) => follower.id === JSON.stringify(userData.id))
              .map((item) => {
                return (
                  <>
                    {item.isFollowing ? (
                      <button
                        onClick={() =>
                          follow(userData.id, quest._id, userData.name)
                        }
                      >
                        Follow
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          follow(userData.id, quest._id, userData.name)
                        }
                      >
                        Un Follow
                      </button>
                    )}
                  </>
                );
              })}
          </>
        )}
      </FollowTitle>
    </Card>
  );
};

const Hero = styled.div`
  width: 300px;
  text-align: center;
`;

const HerosGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
    justify-items: center;
  }
`;

const HeroTitle = styled.div`
  text-align: center;
  margin: 35px 0;
  a {
    border-radius: 30px;
    background: #25cec8;
    color: #fff !important;
  }
`;
const FollowTitle = styled.div`
  text-align: center;
  margin: 35px 0;
  a,
  button {
    border-radius: 30px;
    background: #25cec8;
    color: #fff !important;
  }
`;

const Card = styled.div`
  width: 1000px;
  @media (max-width: 1100px) {
    width: 80%;
    margin: 0 auto;
    text-align: center;
    h1 {
      height: auto !important;
    }
    p {
      line-height: 26px;
    }
  }
  //   border: 1px solid #000;
  padding: 0 25px 25px 25px;
  //   border-radius: 30px;
  margin: 150px auto;
  h1 {
    font-weight: 300;
    height: 50px;
  }
  a {
    // border: 1px solid aqua;
    // border-radius: 30px;
    color: blue;
    padding: 10px;
    width: 200px;
    text-align: center;
    display: block;
    margin: 0 auto;
  }
`;
