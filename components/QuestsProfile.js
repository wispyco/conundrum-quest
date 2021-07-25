import { useQuery } from "@apollo/client";
import styled from "styled-components";
import { GET_QUESTS_BY_USER_ID } from "../gql/schema";
import Loading from "./Loading";
import Link from "next/link";

export default function QuestsProfile({ user }) {
  const { loading, error, data } = useQuery(GET_QUESTS_BY_USER_ID, {
    variables: { id: user.id },
  });

  if (error) return <h1>{error.message}</h1>;

  if (loading) return <Loading />;

  return (
    <>
      <h1>Your Quests</h1>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      <QuestCardGrid>
        {data?.findUserByID?.quests?.data.map((quest) => {
          return <QuestCard quest={quest} />;
        })}
      </QuestCardGrid>
    </>
  );
}

const QuestCard = ({ quest }) => {
  return (
    <Card>
      <h1>{quest?.name}</h1>
      <p>{quest.isBeingReviewed ? "Is in Review" : "Waiting to be Reviewed"}</p>
      <p>{quest.isAccepted ? "Is Accepted" : "Waiting to be Accepted"}</p>
      <Link href={`profile/quest-edit/${quest._id}`}>View Quest</Link>
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
  width: 1100px;
  margin: 0 auto;
`;
