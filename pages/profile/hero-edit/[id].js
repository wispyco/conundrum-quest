import { useMutation, useQuery } from "@apollo/client";
import { Router, useRouter } from "next/router";
import Loading from "../../../components/Loading";
import {
  CREATE_HERO,
  GET_HERO_BY_ID,
  GET_QUEST_BY_ID,
  UPDATE_HERO,
} from "../../../gql/schema";
import styled from "styled-components";
import Layout from "../../../components/layout";
import useSWR from "swr";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

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
                <QuestCard user={user} hero={findHeroByID} />
              </>
            )}
            {user.role === "MODERATOR" && (
              <>
                <Link href={`/profile/hero-review/${Router.query.id}`}>
                  View Hero and Review
                </Link>
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
    defaultValues: {
      name: hero.name,
      description: hero.description,
      wikipedia: hero.wikipedia,
      youtube: hero.youtube,
    },
  });
  const onSubmit = async (data) => {
    const { name, description, wikipedia, youtube } = data;

    const updateHeroResponse = await updateHero({
      variables: {
        id: Router.query.id,
        name: name,
        description: description,
        wikipedia: wikipedia,
        // questConnect: hero.quest._id,
        isAccepted: false,
        isBeingReviewed: false,
        ownerConnect: user.id,
        youtube: youtube,
        avatar: cloudLinks,
      },
    }).catch(console.error);

    Router.push("/profile");
  };
  console.log(errors);

  const [cloudLinks, setCloudLinks] = useState(hero.avatar);

  const clickMe = () => {
    const isBrowser = typeof window !== "undefined";

    if (!isBrowser) {
      return;
    }
    console.log(window.cloudinary); //
    let widget = window.cloudinary.createUploadWidget(
      {
        cloudName: `kitson-co`,
        sources: ["local", "url"],
        uploadPreset: `conundrum`,
        maxFiles: 1,
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          console.log(result.info.url);
          // setCloudLinks([...cloudLinks, result.info.url])
          setCloudLinks(result.info.url);
        }
      }
    );
    widget.open(); //
  };

  return (
    <Card>
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
        <input type="text" placeholder="youtube" {...register("youtube", {})} />
        <button
          type="button"
          onClick={clickMe}
          id="upload_widget"
          className="upload"
        >
          Choose Profile Image
        </button>
        {cloudLinks && (
          <ImageWrap>
            <Image width="100" height="100" src={cloudLinks} />
          </ImageWrap>
        )}

        <input type="submit" />
      </form>
    </Card>
  );
};

const ImageWrap = styled.div`
  object-fit: cover;
  img {
    border-radius: 50%;
  }
`;

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
