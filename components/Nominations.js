import { useQuery } from "@apollo/client";
import Link from "next/link";
import { GET_HEROS } from "../gql/schema";
import Loading from "./Loading";
import styled from "styled-components";

export default function Nominations({ user }) {
  const { loading, error, data } = useQuery(GET_HEROS, {
    variables: { id: user.id },
  });

  if (error) return <h1>{error.message}</h1>;

  if (loading) return <Loading />;
  const dataFiltered = data.getHeros.data.filter(
    (hero) => hero?.owner?._id === user.id
  );

  return (
    <Wrap>
      <h1>Nominations</h1>
      <HeroWrap>
        {/* <pre>{JSON.stringify(dataFiltered, null, 2)}</pre> */}
        {dataFiltered.map((hero, i) => {
          return (
            <Hero>
              <h2>{dataFiltered[i].quest.name}</h2>
              <h3>Name: {hero.name}</h3>
              <p>Description: {hero.description}</p>
              <h4>
                {hero.isBeingReviewed
                  ? <>{!hero.isAccepted && "Is in Review"}</>
                  : "Waiting to be Reviewed"}
              </h4>
              <h4>
                {hero.isAccepted ? "Is Accepted" : "Waiting to be Accepted"}
              </h4>
              {hero.isBeingReviewed || hero.isAccepted ? (
                <>
                  
                  <Link href={`/quest/${dataFiltered[i].quest._id}`}>View Hero's Quest</Link>
                  <p>
                    {hero.isBeingReviewed && (
                      <>
                        {" "}
                        {!hero.isAccepted &&
                          "Cannot edit when Quest is is being reviewed"}
                      </>
                    )}
                  </p>
                  <p>
                    {hero.isAccepted &&
                      "Cannot edit once Quest has been Accepted"}
                  </p>
                </>
              ) : (
                <Link href={`profile/hero-edit/${hero._id}`}>Edit Hero</Link>
              )}
            </Hero>
          );
        })}
      </HeroWrap>
    </Wrap>
  );
}

const Hero = styled.div`
  width: 300px;
  border: 1px solid #000;
  border-radius: 30px;
  padding:25px;
`;

const HeroWrap = styled.div`
  width: 950px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 300px 300px 300px;
  grid-column-gap: 25px;
`;

const Wrap = styled.div`
    text-align:center;
`
