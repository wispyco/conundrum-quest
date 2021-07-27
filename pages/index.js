import { useQuery } from "@apollo/client";
import useSWR from "swr";
import Layout from "../components/layout";
import Loading from "../components/Loading";
import { GET_QUESTS } from "../gql/schema";
import styled from "styled-components";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function Home() {
  const { data: user, error: userError } = useSWR("/api/user", fetcher);

  return <Layout>{user && <Data user={user} />}</Layout>;
}

const Data = ({ user }) => {
  const { loading, error, data } = useQuery(GET_QUESTS);

  if (loading) return <Loading />;

  if (error) return <h1>{error.message}</h1>;

  return <DataRendered data={data} />;
};

const DataRendered = ({ data }) => {
  const { register, handleSubmit, formState, watch } = useForm({
    defaultValues:{
      category:"ALL"
    }
  });
  const onSubmit = (data) => console.log(data);

  const watchAllFields = watch();

  const [quests, setQuests] = useState(data?.getQuests?.data);

  // useEffect(()=>{
  //   setQuests(quests.find((questF) => questF.category === watchAllFields.category))
  // },[watchAllFields])

  const findSustain = () => {
    setQuests(
      data?.getQuests?.data.filter(
        (questF) => questF.category === "SUSTAINABILITY_HUMAN_DEVELOPMENT"
      )
    );
  };
  const findTech = () => {
    setQuests(
      data?.getQuests?.data.filter(
        (questF) =>
          questF.category ===
          "TECHNOLOGY_INFRASTRUCTURE_ARTIFICIAL_INTELLIGENCE"
      )
    );
  };
  const findAll = () => {
    setQuests(data?.getQuests?.data);
  };

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div>
          All
          <input
            onClick={findAll}
            {...register("category", {})}
            type="radio"
            value="ALL"
          />
        </div>
        <div>
          Sustainability and Human Development
          <input
            onClick={findSustain}
            {...register("category", {})}
            type="radio"
            value="SUSTAINABILITY_HUMAN_DEVELOPMENT"
          />
        </div>
        <div>
          Technology Infrastructure and Artificial Intelligence
          <input
            onClick={findTech}
            {...register("category", {})}
            type="radio"
            value="TECHNOLOGY_INFRASTRUCTURE_ARTIFICIAL_INTELLIGENCE"
          />
        </div>
      </Form>

      {/* <pre>
      {JSON.stringify(watchAllFields, null,2)}
    </pre> */}

      <QuestCardGrid>
        {quests.map((quest) => {
          return <>{quest?.isAccepted && <QuestCard quest={quest} />}</>;
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

const Form = styled.form`
  width: 900px;
  margin: 0px auto 50px auto;
  display:grid;
  grid-template-columns:100px 400px 500px;
`;

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
