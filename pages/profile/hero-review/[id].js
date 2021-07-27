import { useMutation, useQuery } from "@apollo/client";
import { Router, useRouter } from "next/router";
import Loading from "../../../components/Loading";
import { CREATE_HERO, GET_HERO_BY_ID, GET_QUEST_BY_ID, UPDATE_HERO } from "../../../gql/schema";
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
  } = useQuery(GET_HERO_BY_ID, {
    variables: { id: Router.query.id },
  });

  if (error) return <h1>{error.message}</h1>;

  if (getError) return <h1>failed to get</h1>;

  if (getLoading) return <Loading />;

  const { findHeroByID } = data;

  return (
    <Layout>
      {/* <pre>
              {JSON.stringify(data,null,2)}
          </pre> */}
      <>
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
                <p>You Don't have Access to this path</p>
              </>
            )}
            {user.role === "MODERATOR" && (
              <>
                <QuestCard user={user} hero={findHeroByID} />
              </>
            )}
          </>
        )}
      </>
    </Layout>
  );
}

const QuestCard = ({ hero, user }) => {

  const Router = useRouter();

  const [updateHero, { data: updateHeroData, loading: saving }] =
    useMutation(UPDATE_HERO);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
      defaultValues:{
          name:hero.name,
          description:hero.description,
          wikipedia:hero.wikipedia,
          isBeingReviewed: JSON.stringify(hero.isBeingReviewed),
          isAccepted:JSON.stringify(hero.isAccepted)
      }
  });
  const onSubmit = async (data) => {
    const { name, description, wikipedia,isBeingReviewed, isAccepted } = data;

    const isBeingReviewedSet = isBeingReviewed === "true";
    const isAcceptedSet = isAccepted === "true";

    const updateHeroResponse = await updateHero({
      variables: {
        id: Router.query.id,
        name: name,
        description: description,
        wikipedia: wikipedia,
        questConnect: hero.quest._id,
        isAccepted: isAcceptedSet,
        isBeingReviewed: isBeingReviewedSet,
        ownerConnect: user.id
      },
    }).catch(console.error);

    Router.push("/profile")

  };
  console.log(errors);
  return (
    <Card>
      <pre>
        {/* {JSON.stringify(hero, null,2)} */}
      </pre>
      <h1>{hero?.name}</h1>
      <h2>Edit Hero</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="text" placeholder="name" {...register("name", {})} />
        <input
          type="text"
          placeholder="description"
          {...register("description", {})}
        />
        <input
          type="text"
          placeholder="wikipedia"
          {...register("wikipedia", {})}
        />
        <h2>In Review</h2>
        Not reviewing yet
        <input
          {...register("isBeingReviewed", {})}
          type="radio"
          value="false"
        />
        Reviewing
        <input {...register("isBeingReviewed", {})} type="radio" value="true" />
        <h2>Is Accepted</h2>
        Not Accepted
        <input {...register("isAccepted", {})} type="radio" value="false" />
        Accepted
        <input {...register("isAccepted", {})} type="radio" value="true" />

        <input type="submit" />
      </form>
    </Card>
  );
};

const Card = styled.div`
  width: 900px;
  padding: 0 25px 25px 25px;
  margin: 0px auto;
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
`;

const EditQuestWrap = styled.div``;
