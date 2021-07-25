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
      <pre>{JSON.stringify(data, null, 2)}</pre>
      {data?.findUserByID?.quests?.data.map((quest) => {
        return <QuestCard quest={quest} />;
      })}
    </>
  );
}

const QuestCard = ({ quest }) => {
  return (
    <Card>
      <h1>{quest?.name}</h1>
      <Link href={`profile/quest/${quest._id}`}>View Quest</Link>
    </Card>
  );
};

const Card = styled.div`
  width: 500px;
  h1 {
    font-weight: 300;
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
