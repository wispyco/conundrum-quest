import { useMutation, useQuery } from "@apollo/client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { DELETE_QUEST_BY_ID, GET_QUESTS, UPDATE_QUEST_CLAIMED } from "../gql/schema";
import Loading from "./Loading";

export default function QuestsStatusEdit({ user }) {
  const { loading, error, data } = useQuery(GET_QUESTS, {
    variables: { id: user.id },
  });

  if (error) return <h1>{error.message}</h1>;

  if (loading) return <Loading />;

  return <Edit data={data} user={user} />;
}

const Edit = ({ data, user }) => {
  return (
    <>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      <QuestCardGrid>
        {data?.getQuests?.data.filter((questF) => questF?.isClaimed === false).map((quest) => {
          return <QuestCard user={user} quest={quest} />;
        })}
      </QuestCardGrid>
    </>
  );
};

const QuestCard = ({ quest, user }) => {
  const [deleteQuest, { data: deleteQuestData, loading: deleting }] =
    useMutation(DELETE_QUEST_BY_ID);

    const [updateQuestClaimed, { data: updateQuestClaimedData, loading: saving }] =
    useMutation(UPDATE_QUEST_CLAIMED);

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

  const clickClaim = async (id) =>{
    const updateQuestClaimedResponse = await updateQuestClaimed({
      variables: {
        id: id,
        isClaimed:true,
        moderatorConnect:user.id
      },
      update(cache) {
        const normalizedId = cache.identify({ id, __typename: "Quest" });
        cache.evict({ id: normalizedId });
        cache.gc();
      },
    }).catch(console.error);
  }

  console.log("quest.isAccepted", quest.isAccepted);
  console.log("quest.isBeingReviewed ", quest.isBeingReviewed);

  return (
    <Card>
      <h1>{quest?.name}</h1>
      <h2>Moderator: {quest?.moderator?.name}</h2>
      {!quest?.isClaimed && <p>Not Claimed</p>}
      {!quest?.isClaimed ? <button onClick={()=>clickClaim(quest._id)}>Claim</button> : <button>Unclaim</button>}
      <Link href={`profile/quest-review/${quest._id}`}>
        Review and Approve Quest
      </Link>
      <p>{quest.isBeingReviewed ? "Reviewing" : "Not yet reviewing"}</p>
      <p>{quest.isAccepted ? "Accepted" : "Not Accepted"}</p>
      <button onClick={() => clickDeleteQuest(quest._id)}>Delete Quest</button>
    </Card>
  );
};

const Card = styled.div`
  width: 500px;
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
  grid-column-gap: 50px;
  grid-row-gap: 50px;
  width: 1100px;
  margin: 0 auto;
`;
