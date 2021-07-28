import { useMutation, useQuery } from "@apollo/client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import {
  DELETE_QUEST_BY_ID,
  GET_QUESTS,
  GET_QUEST_BY_ID,
  UPDATE_QUEST_CLAIMED,
  UPDATE_QUEST_UNCLAIMED,
} from "../gql/schema";
import Loading from "./Loading";
import { useEffect, useState } from "react";
import { Router } from "next/router";

export default function QuestsStatusEdit({ user }) {
  const { loading, error, data, startPolling, stopPolling, refetch } = useQuery(
    GET_QUESTS,
    {
      variables: { id: user.id },
      // pollInterval: 500,
    }
  );

  if (error) return <h1>{error.message}</h1>;

  if (loading) return <Loading />;

  return (
    <Edit
      data={data}
      refetch={refetch}
      startPolling={startPolling}
      stopPolling={stopPolling}
      user={user}
    />
  );
}

const Edit = ({ data, user, startPolling, stopPolling, refetch }) => {
  return (
    <>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(claimedOwned, null, 2)}</pre> */}
      <>
        <h2>Quests</h2>
        <QuestCardGrid>
          {data?.getQuests?.data
            // .filter((questF) => questF?.isClaimed === false)
            .map((quest, i) => {
              return (
                <>
                  {/* {quest?.isClaimed ? ( */}

                  <QuestCard
                    refetch={refetch}
                    stopPolling={stopPolling}
                    startPolling={startPolling}
                    key={i}
                    user={user}
                    quest={quest}
                  />

                  {/* // ):(

                //   <QuestCard refetch={refetch} stopPolling={stopPolling} startPolling={startPolling} key={i} user={user} quest={quest} />

                // )} */}
                </>
              );
            })}
        </QuestCardGrid>
        {/* <h2>Claimed Quests</h2>
        <QuestCardGrid>
          {data?.getQuests?.data
            .filter(
              (questF) =>
                questF?.isClaimed === true && questF?.moderator._id === user.id
            )
            .map((quest, i) => {
              return (
                <QuestCard
                  refetch={refetch}
                  key={i}
                  user={user}
                  quest={quest}
                />
              );
            })}
        </QuestCardGrid> */}
      </>
    </>
  );
};

const QuestCard = ({ quest, user, startPolling, stopPolling, refetch }) => {
  const [deleteQuest, { data: deleteQuestData, loading: deleting }] =
    useMutation(DELETE_QUEST_BY_ID);

  const [
    updateQuestClaimed,
    { data: updateQuestClaimedData, loading: claiming },
  ] = useMutation(UPDATE_QUEST_CLAIMED);

  const [
    updateQuestUnClaimed,
    { data: updateQuestUnClaimedData, loading: unclaiming },
  ] = useMutation(UPDATE_QUEST_UNCLAIMED);

  const clickDeleteQuest = async (id) => {
    if (confirm("Are you sure you want to delete your streetwear?")) {
      const deleteQuestResponse = await deleteQuest({
        variables: {
          id: id,
        },
        update(cache) {
          const normalizedId = cache.identify({ id, __typename: "Quest" });
          cache.evict({ id: normalizedId });
          cache.gc();
        },
      }).catch(console.error);
    } else {
      return;
    }
  };

  const clickClaim = async (id) => {
    const updateQuestClaimedResponse = await updateQuestClaimed({
      variables: {
        id: id,
        isClaimed: true,
        moderatorConnect: user.id,
      },
      refetchQueries: [{ query: GET_QUESTS }],
    }).catch(console.error);
  };

  const refetchOnHover = async (id) => {
    refetch();
  };

  const clickUnClaim = async (id) => {
    const updateQuestUnClaimedResponse = await updateQuestUnClaimed({
      variables: {
        id: id,
        isClaimed: false,
        moderatorDisconnect: true,
      },
      refetchQueries: [{ query: GET_QUESTS }],
    }).catch(console.error);
  };

  console.log("quest.isAccepted", quest.isAccepted);
  console.log("quest.isBeingReviewed ", quest.isBeingReviewed);

  if (claiming || unclaiming) return <Loading />;

  return (
    <Card
      claimedByYou={quest?.moderator?._id === user.id}
      claimed={quest?.isClaimed}
      onMouseEnter={refetchOnHover}
    >
      <h1>{quest?.name}</h1>
      {!quest?.isClaimed && <p>Not Claimed</p>}

      {quest?.isClaimed && quest?.moderator?._id === user.id ? (
        <>
          <Link href={`profile/quest-review/${quest._id}`}>
            Review and Approve Quest
          </Link>
          <button onClick={() => clickUnClaim(quest._id, quest.isClaimed)}>
            Unclaim
          </button>
          <button onClick={() => clickDeleteQuest(quest._id)}>
            Delete Quest
          </button>
        </>
      ) : (
        <>
          {quest?.isClaimed && quest?.moderator?._id !== user.id && (
            <p>Quest is being moderated by {quest?.moderator?.name}</p>
          )}
          {!quest?.isClaimed && (
            <button onClick={() => clickClaim(quest._id, quest.isClaimed)}>
              Claim
            </button>
          )}
          <Link href={`profile/quest-view/${quest._id}`}>View Quest</Link>
        </>
      )}
      <p>{quest.isBeingReviewed ? "Reviewing" : "Not yet reviewing"}</p>
      <p>{quest.isAccepted ? "Accepted" : "Not Accepted"}</p>
    </Card>
  );
};

const Card = styled.div`
  width: 500px;
  background-color: ${(props) => (props.claimed ? "#daf7f0" : "white")};
  border: ${(props) =>
    props.claimedByYou ? "4px solid #007eff !important" : "1px solid #000"};
  @media (max-width: 1100px) {
    width: 100%;
  }
  border: 1px solid #000;
  padding: 0 25px 25px 25px;
  border-radius: 30px;
  h1 {
    font-weight: 300;
    height: 150px;
  }
  a {
    border: 1px solid aqua;
    border-radius: 30px;
    padding: 10px;
    width: 200px;
    text-align: center;
    display: block;
    margin: 0 auto;
  }
`;

const QuestCardGrid = styled.div`
  display: grid;
  grid-template-columns: 500px 500px;
  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
    width: 90%;
  }
  grid-column-gap: 50px;
  grid-row-gap: 50px;
  width: 1100px;
  margin: 0 auto;
`;
