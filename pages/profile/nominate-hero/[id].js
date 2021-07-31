import { useMutation, useQuery } from "@apollo/client";
import { Router, useRouter } from "next/router";
import Loading from "../../../components/Loading";
import { CREATE_HERO, GET_QUEST_BY_ID } from "../../../gql/schema";
import styled from "styled-components";
import Layout from "../../../components/layout";
import useSWR from "swr";
import { useForm } from "react-hook-form";

const fetcher = (url) => fetch(url).then((r) => r.json());

function useAuth() {
  const {
    data: user,
    error,
    mutate,
  } = useSWR("/api/user", fetcher, { refreshInterval: 3 });

  const loading = user?.token === false || user === undefined;

  return {
    user,
    loading,
    error,
  };
}

export default function NominateHero() {
  const { user, loading, error } = useAuth();

  console.log("user >>>>>>", user);

  const Router = useRouter();

  const {
    loading: getLoading,
    error: getError,
    data,
  } = useQuery(GET_QUEST_BY_ID, {
    variables: { id: Router.query.id },
  });

  if (error) return <h1>{error.message}</h1>;

  if (getError) return <h1>failed to get</h1>;

  if (getLoading) return <Loading />;

  const { findQuestByID } = data;

  return (
    <Layout>
      {/* <pre>
              {JSON.stringify(data,null,2)}
          </pre> */}
      {loading ? (
        <>
          <Loading />
          <h1>SignUp</h1>
        </>
      ) : (
        <>
          {/* <h1>Edit Quest</h1> */}
          {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
          {user.role === "ADMIN" && <></>}
          {user.role === "KNIGHT" && (
            <>
              <QuestCard user={user} quest={findQuestByID} />
            </>
          )}
        </>
      )}
    </Layout>
  );
}

const QuestCard = ({ quest, user }) => {
  const Router = useRouter();

  const [createHero, { data: createHeroData, loading: saving }] =
    useMutation(CREATE_HERO);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    const { name, description, wikipedia } = data;

    const createHeroResponse = await createHero({
      variables: {
        name: name,
        description: description,
        wikipedia: wikipedia,
        questConnect: Router.query.id,
        isAccepted: false,
        isBeingReviewed: false,
        // knightConnect: user.id,
        ownerConnect: user.id,
      },
    }).catch(console.error);

    Router.push("/profile");
  };
  console.log(errors);
  return (
    <Card>
      <h1>{quest?.name}</h1>
      <h2>Nominate Hero</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="text" placeholder="Full Name" {...register("name", {})} />
        <input
          type="text"
          placeholder="What does this Hero do related to this Quest"
          {...register("description", {})}
        />
        <input
          type="text"
          placeholder="Wikipedia url (https://wikipedia.com/hero)"
          {...register("wikipedia", {})}
        />

        <input type="submit" />
      </form>
    </Card>
  );
};

const Card = styled.div`
  width: 900px;
  padding: 0 25px 25px 25px;
  margin: 150px auto;
  h1 {
    font-weight: 300;
    height: 50px;
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
  form {
    display: grid;
    grid-row-gap: 25px;
    input {
      padding: 5px;
    }
  }
`;

const EditQuestWrap = styled.div``;
