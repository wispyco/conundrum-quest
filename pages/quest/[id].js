import { useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import Loading from "../../components/Loading";
import {
  DELETE_FOLLOWER,
  FOLLOW,
  GET_KNIGHTS,
  GET_QUEST_BY_ID,
  UNFOLLOW,
  UPDATE_QUEST_FOLLOWERS,
} from "../../gql/schema";
import styled from "styled-components";
import Layout from "../../components/layout";
import Link from "next/link";
import useSWR from "swr";
import { query as q } from "faunadb";
import { authClient } from "../../utils/faunaAuth";
import { useState, useEffect } from "react";
import { FaTwitter } from "react-icons/fa";
import { GiMountedKnight, GiNinjaHeroicStance } from "react-icons/gi";

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

  const [followQuest, { data: followQuestData, loading: following }] =
    useMutation(FOLLOW);
  const [unfollowQuest, { data: unFollowQuestData, loading: unfollowing }] =
    useMutation(UNFOLLOW);
  const [deleteFollower, { data: deleteFollowerData, loading: deleting }] =
    useMutation(DELETE_FOLLOWER);

  const follow = async (userId, QuestId, userName) => {
    console.log("questId", QuestId);
    console.log("userId", userData.id);

    const followQuestResponse = await followQuest({
      variables: {
        isFollowing: true,
        name: userName,
        quests: QuestId,
        owner: userData.id,
      },
      refetchQueries: [{ query: GET_QUEST_BY_ID, variables: { id: QuestId } }],
    }).catch(console.error);
  };

  const unFollow = async (userId, QuestId, userName, unFollowId) => {
    console.log("questId", QuestId);
    console.log("userId", userData.id);

    const unFollowQuestResponse = await unfollowQuest({
      variables: {
        isFollowing: false,
        name: userName,
        quests: QuestId,
        owner: userData.id,
        id: unFollowId,
      },
    }).catch(console.error);
    const deleteFollowerResponse = await deleteFollower({
      variables: {
        id: unFollowId,
      },
      refetchQueries: [{ query: GET_QUEST_BY_ID, variables: { id: QuestId } }],
    }).catch(console.error);
  };

  const test = quest.follower1s?.data.filter(
    (follower) => follower?.owner?._id === userData.id
  );

  console.log(test, "test");

  if (following || unfollowing)
    return (
      <Layout>
        <Loading />
      </Layout>
    );

  return (
    <Card>
      <h1>{quest?.name}</h1>
      <p>{quest?.description}</p>
      <HeroTitle>
        <h2>Heros</h2>
        <GiNinjaHeroicStance size={35} />
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
      <h3 className="submitted">Submitted By: {quest?.owner?.name}</h3>
      <h2 className="knights">
        Knights <GiMountedKnight size={35} /> who are following this quest
      </h2>
      <FollowersGrid>
        {quest?.follower1s?.data.map((follower, i) => {
          return (
            <Follower key={i}>
              <p>{follower.owner.name}</p>
              <a target="_blank" rel="noreferrer" href={follower.owner.twitter}>
                <FaTwitter />
              </a>
              {/* <p>followerId{follower._id}</p>
            <p>ownerID{follower.owner._id}</p> */}
            </Follower>
          );
        })}
      </FollowersGrid>

      <FollowTitle>
        <h2>Follow this quest</h2>
        {!user?.token ? (
          <Link href={`/login-magic-public`}>Sign Up to Follow</Link>
        ) : (
          <>
            {JSON.stringify(test) === "[]" ? (
              <button
                onClick={() => follow(userData.id, quest._id, userData.name)}
              >
                Follow
              </button>
            ) : (
              <button
                onClick={() =>
                  unFollow(userData.id, quest._id, userData.name, test[0]._id)
                }
              >
                Un Follow
              </button>
            )}
          </>
        )}
      </FollowTitle>
    </Card>
  );
};

const FollowersGrid = styled.div`
  display: grid;
  grid-template-columns: 200px 200px 200px 200px;
  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
    justify-items: center;
  }
`;

const Follower = styled.div`
  display: grid;
  justify-items: center;
`;

const Hero = styled.div`
  width: 300px;
  @media (max-width: 1100px) {
    width: 100%;
  }
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
    width: 100%;
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
  .knights,
  .submitted {
    text-align: center;
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
