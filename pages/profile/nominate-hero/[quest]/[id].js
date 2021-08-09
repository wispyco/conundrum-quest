import { useMutation, useQuery } from "@apollo/client";
import { Router, useRouter } from "next/router";
import Loading from "../../../../components/Loading";
import {
  CREATE_HERO,
  GET_HEROS,
  GET_QUEST_BY_ID,
  UPDATE_HERO_CONNECT,
} from "../../../../gql/schema";
import styled from "styled-components";
import Layout from "../../../../components/layout";
import useSWR from "swr";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Image from "next/image";
import { createFilter } from "javascript-search-input";

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

  const {
    loading: getHeros,
    error: getErrorHeros,
    data: herosData,
  } = useQuery(GET_HEROS);

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
              <QuestCard
                user={user}
                herosData={herosData}
                quest={findQuestByID}
              />
              {/* <pre>{JSON.stringify(filtered, null, 2)}</pre> */}
              {/* <pre>{JSON.stringify(herosData, null, 2)}</pre> */}
            </>
          )}
        </>
      )}
    </Layout>
  );
}

const useFilter = ({ keys, data }) => {
  const [inputText, setInputText] = useState("");
  const myFilter = createFilter(keys);
  const filtered = data?.filter(myFilter(inputText));

  return { inputText, setInputText, filtered };
};

const QuestCard = ({ quest, user, herosData }) => {
  const Router = useRouter();

  const [createHero, { data: createHeroData, loading: saving }] =
    useMutation(CREATE_HERO);

  const [updateHero, { data: updateHeroData, loading: updating }] =
    useMutation(UPDATE_HERO_CONNECT);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    const { name, description, wikipedia, youtube, twitter } = data;

    const createHeroResponse = await createHero({
      variables: {
        name: name,
        description: description,
        wikipedia: wikipedia,
        questConnect: [Router.query.id],
        isAccepted: false,
        isBeingReviewed: false,
        knightConnect: user.id,
        ownerConnect: user.id,
        avatar: cloudLinks,
        youtube: youtube,
        twitter: twitter,
      },
    }).catch(console.error);

    Router.push("/profile");
  };
  console.log(errors);

  const [cloudLinks, setCloudLinks] = useState(null);

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

  // const { inputText, setInputText, filtered } = useFilter({
  //   keys: ["name"],
  //   // data: herosData?.getHeros?.data,
  //   data: quest?.heros1,
  // });

  // if (confirm("Are you sure you want to delete your streetwear?")) {
  //   const deleteQuestResponse = await deleteQuest({
  //     variables: {
  //       id: id,
  //     },
  //     update(cache) {
  //       const normalizedId = cache.identify({ id, __typename: "Quest" });
  //       cache.evict({ id: normalizedId });
  //       cache.gc();
  //     },
  //   }).catch(console.error);
  // } else {
  //   return;
  // }

  const chooseCurrent = async (heroId) => {
    if (confirm("Are you sure this hero relates to this quest?")) {
      const updateHeroResopnse = await updateHero({
        variables: {
          id: heroId,
          connect: [Router.query.id], // questId
        },
      }).catch(console.error);
      Router.push(`/quest-view/${Router.query.quest}/${Router.query.id}`);
    } else {
      return;
    }
  };

  const currentHeros = quest?.heros1;
  const allheros = herosData;

  let final;

  if (currentHeros.data.length < 1) {
    final = herosData?.getHeros?.data;
  } else {
    final = quest?.heros1.data.map((item, i) => {
      if (item.isAccepted && i < 1) {
        return herosData?.getHeros?.data.filter((f) => f?._id !== item?._id);
      } else return;
    });
    final = final.flat();
  }

  return (
    <Card>
      <h1>{quest?.name}</h1>
      <h2>Nominate Hero</h2>
      {/* <input
        type="text"
        value={inputText}
        onChange={(event) => {
          setInputText(event.target.value);
        }}
      /> */}
      <h2>Click to choose a existing Hero</h2>
      {final?.map((item) => {
        return (
          <>
            {item?.isAccepted && (
              <button onClick={() => chooseCurrent(item?._id)}>
                {item?.name}
              </button>
            )}
          </>
        );
      })}
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
        <input
          type="text"
          placeholder="Twitter Url"
          {...register("twitter", {})}
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
      {/* <pre>{JSON.stringify(filtered, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(quest?.heros1, null, 2)}</pre>
      <pre>{JSON.stringify(herosData, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(final, null, 2)}</pre> */}
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
  button {
    margin-bottom: 25px;
    background: none;
    padding: 15px;
    border-radius: 30px;
    &:hover {
      cursor: pointer;
      background: #000;
      color: #fff;
    }
  }
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
