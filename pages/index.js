import { useQuery } from "@apollo/client";
import useSWR from "swr";
import Layout from "../components/layout";
import Loading from "../components/Loading";
import { GET_QUESTS } from "../gql/schema";
import styled from "styled-components";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { GiNinjaHeroicStance, GiMountedKnight } from "react-icons/gi";
import { useRouter } from "next/router";
import urlSlug from "url-slug";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function Home() {
  const { data: user, error: userError } = useSWR("/api/user", fetcher);

  return (
    <Layout>
      <>{user && <Data user={user} />}</>
    </Layout>
  );
}

const Data = ({ user }) => {
  const { loading, error, data } = useQuery(GET_QUESTS);

  if (loading) return <Loading />;

  if (error) return <h1>{error.message}</h1>;

  return <DataRendered data={data} />;
};

const DataRendered = ({ data }) => {
  const { register, handleSubmit, formState, watch } = useForm({
    defaultValues: {
      category: "ALL",
    },
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
  const findHealth = () => {
    setQuests(
      data?.getQuests?.data.filter(
        (questF) => questF.category === "HEALTHCARE_LIFE_SCIENCES"
      )
    );
  };
  const findTransport = () => {
    setQuests(
      data?.getQuests?.data.filter(
        (questF) => questF.category === "TRANSPORTATION_URBAN_INFRASTRUCTURE"
      )
    );
  };
  const findDigital = () => {
    setQuests(
      data?.getQuests?.data.filter(
        (questF) =>
          questF.category ===
          "DIGITAL_IMMERSIVE_LEARNING_THERAPIES_AMBIENT_COMPUTING"
      )
    );
  };
  const findPhilosophy = () => {
    setQuests(
      data?.getQuests?.data.filter((questF) => questF.category === "PHILOSOPHY")
    );
  };
  const findAll = () => {
    setQuests(data?.getQuests?.data);
  };

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <label className="radio">
          <div>
            <p>All</p>

            <input
              onClick={findAll}
              {...register("category", {})}
              type="radio"
              value="ALL"
            />
            <span className="radio__control"></span>
          </div>
        </label>
        <label className="radio">
          <div>
            <p>Sustainability and Human Development</p>

            <input
              onClick={findSustain}
              {...register("category", {})}
              type="radio"
              value="SUSTAINABILITY_HUMAN_DEVELOPMENT"
            />
            <span className="radio__control"></span>
          </div>
        </label>
        <label className="radio">
          <div>
            <p>Technology Infrastructure and Artificial Intelligence</p>

            <input
              onClick={findTech}
              {...register("category", {})}
              type="radio"
              value="TECHNOLOGY_INFRASTRUCTURE_ARTIFICIAL_INTELLIGENCE"
            />
            <span className="radio__control"></span>
          </div>
        </label>
        <label className="radio">
          <div>
            <p>Healthcare + Life Sciences</p>

            <input
              onClick={findHealth}
              {...register("category", {})}
              type="radio"
              value="HEALTHCARE_LIFE_SCIENCES"
            />
            <span className="radio__control"></span>
          </div>
        </label>
        <label className="radio">
          <div>
            <p>Transportation + Urban Infrastructure</p>

            <input
              onClick={findTransport}
              {...register("category", {})}
              type="radio"
              value="TRANSPORTATION_URBAN_INFRASTRUCTURE"
            />
            <span className="radio__control"></span>
          </div>
        </label>
        <label className="radio">
          <div>
            <p>Digital Immersive Learning / Therapies + Ambient Computing</p>

            <input
              onClick={findDigital}
              {...register("category", {})}
              type="radio"
              value="DIGITAL_IMMERSIVE_LEARNING_THERAPIES_AMBIENT_COMPUTING"
            />
            <span className="radio__control"></span>
          </div>
        </label>
        <label className="radio">
          <div>
            <p>Philosophy</p>

            <input
              onClick={findPhilosophy}
              {...register("category", {})}
              type="radio"
              value="PHILOSOPHY"
            />
            <span className="radio__control"></span>
          </div>
        </label>
      </Form>

      {/* <pre>
      {JSON.stringify(watchAllFields, null,2)}
    </pre> */}

      <QuestCardGrid>
        {quests
          .slice(0)
          .reverse()
          .map((quest) => {
            return <>{quest?.isAccepted && <QuestCard quest={quest} />}</>;
          })}
      </QuestCardGrid>

      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
    </>
  );
};

const QuestCard = ({ quest }) => {
  const router = useRouter();

  const cardVisit = (questName, questId) => {
    let finalVal = urlSlug(questName);

    router.push(`/quest-view/${finalVal}/${questId}`);
  };

  const slug = urlSlug(quest.name);

  return (
    <Card onClick={() => cardVisit(quest.name, quest._id)}>
      <h1>{quest?.name}</h1>
      <Link href={`quest-view/${slug}/${quest._id}`}>View Quest</Link>
      <h3>
        {quest.heros.data.length > 0 && (
          <>
            Heros <GiNinjaHeroicStance size={35} />: {quest.heros.data.length}
          </>
        )}
      </h3>
      <h3>
        {quest.follower1s.data.length > 0 && (
          <>
            {/* Knights <GiMountedKnight size={35} />:{" "} */}
            Followers:
            {quest.follower1s.data.length}
          </>
        )}
      </h3>
    </Card>
  );
};

const Form = styled.form`
  width: 1125px;
  padding-top: 75px;
  @media (max-width: 1150px) {
    width: 66%;
    display: block;
    margin-top: 50px;
  }
  position: relative;
  display: grid;
  grid-template-columns: 200px 200px 200px 200px 250px;
  @media (max-width: 1300px) {
    grid-template-columns: 200px 200px 200px 200px 250px;
  }
  @media (-webkit-min-device-pixel-ratio: 2) and (min-width: 2500px) {
    width: 2050px;
    margin-top: 200px;
    grid-template-columns: 400px 400px 400px 400px 450px;
  }
  grid-column-gap: 10px;
  margin: 0px auto 50px auto;
  // display: grid;
  // grid-template-columns: 25px 200px 200px;
  label {
    margin-top: 0px;
    &:first-child {
      margin-top: 0;
      position: absolute;
      left: 50%;
      width: 100px;
      margin-left: -50px;
      @media (max-width: 1150px) {
        position: relative;
        margin: 0 auto;
        left: initial;
      }
      @media (-webkit-min-device-pixel-ratio: 2) and (min-width: 2500px) {
        width: 300px;
        margin-left: -150px;
        top: -75px;
      }
    }
    div {
      // display: grid;
      // grid-template-columns: 1fr 25px 0;
      // align-items: center;
      position: relative;
      p {
        text-align: center;
        font-size: 12px;
        padding: 5px 25px;
        @media (-webkit-min-device-pixel-ratio: 2) and (min-width: 2500px) {
          font-size: 26px;
          padding: 0px 35px;
        }
      }
      @media (max-width: 1150px) {
        height: 66px;
      }
      @media (-webkit-min-device-pixel-ratio: 2) and (min-width: 2500px) {
        height: 75px;
      }
    }
    .radio__control {
      display: block;
      width: 100%;
      height: 50px;
      border-radius: 30px;
      /* border-radius: 50%; */
      border: 0.1em solid currentColor;
      position: absolute;
      top: -8px;
      padding: 15px;
      @media (max-width: 1150px) {
        height: 66px;
      }
      @media (-webkit-min-device-pixel-ratio: 2) and (min-width: 2500px) {
        height: 75px;
        border-radius: 100px;
      }
      &:hover {
        cursor: pointer;
        background: #25cec873;
      }
    }
    input {
      opacity: 0;
      width: 0;
      height: 0;
      &:checked + .radio__control {
        background: #25cec873;
        color: #fff;
      }
    }
  }
`;

const Card = styled.div`
  width: 500px;
  padding: 0 25px 25px 25px;
  border-radius: 30px;
  box-shadow: 5px 5px 10px #dadada;
  @media (min-width: 2500px) {
    margin-top: 100px;
  }
  &:hover {
    cursor: pointer;
  }
  @media (max-width: 1100px) {
    width: 75%;
  }
  h1 {
    font-weight: 300;
    height: 150px;
    text-align: center;
    @media (max-width: 1100px) {
      height: auto;
    }
  }
  h3 {
    text-align: center;
    font-weight: 300;
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
  grid-row-gap: 50px;
  width: 1050px;
  margin: 0 auto;
  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
    justify-items: center;
    width: 100%;
  }
  @media (min-width: 2500px) {
    width: 1800px;
    grid-template-columns: 1fr 1fr 1fr;
  }
`;
