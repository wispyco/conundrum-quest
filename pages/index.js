import { useQuery } from "@apollo/client";
import useSWR from "swr";
import Layout from "../components/layout";
import Loading from "../components/Loading";
import { GET_QUESTS } from "../gql/schema";
import styled from "styled-components";
import Link from "next/link";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function Home() {
  const { data: user, error: userError } = useSWR("/api/user", fetcher);

  return <Layout>{user && <Data user={user} />}</Layout>;
}

const Data = ({ user }) => {
  const { loading, error, data } = useQuery(GET_QUESTS);

  if (loading) return <Loading />;

  if (error) return <h1>{error.message}</h1>;

  return (
    <>
      <QuestCardGrid>
        {data?.getQuests?.data.map((quest) => {
          return <>{quest.isAccepted && <QuestCard quest={quest} />}</>;
        })}
      </QuestCardGrid>

      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
    </>
  );
};

const QuestCard = ({ quest }) => {
  return (
    <Card>
      <h1>{quest?.name}</h1>
      <Link href={`quest/${quest._id}`}>View Quest</Link>
    </Card>
  );
};

const Card = styled.div`
  width: 500px;
  padding: 0 25px 25px 25px;
  border-radius: 30px;
  box-shadow: 5px 5px 10px #dadada;
  @media (max-width: 1100px) {
    width: 75%;
  }
  h1 {
    font-weight: 300;
    height: 150px;
    text-align: center;
  }
  a {
    border: 1px solid #000000;
    border-radius: 30px;
    padding: 10px;
    width: 200px;
    text-align: center;
    display: block;
    margin: 0 auto;
    &:hover {
      background: #25cec8;
      color: #fff;
    }
  }
`;

const QuestCardGrid = styled.div`
  display: grid;
  grid-template-columns: 500px 500px;
  grid-column-gap: 50px;
  width: 1050px;
  margin: 0 auto;
  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
    justify-items: center;
    width: 100%;
  }
`;
