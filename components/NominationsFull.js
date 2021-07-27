import { useMutation, useQuery } from "@apollo/client";
import Link from "next/link";
import { DELETE_HERO_BY_ID, GET_HEROS, UPDATE_HERO_UNCLAIMED, UPDATE_HERO_CLAIMED } from "../gql/schema";
import Loading from "./Loading";
import styled from "styled-components";

export default function NominationsFull({ user }) {
  const { loading, error, data } = useQuery(GET_HEROS, {
    variables: { id: user.id },
  });

  const [deleteHero, { data: deleteHeroData, loading: deleting }] =
    useMutation(DELETE_HERO_BY_ID);

    const [
      updateHeroClaimed,
      { data: updateHeroClaimedData, loading: claiming },
    ] = useMutation(UPDATE_HERO_CLAIMED);
  
    const [
      updateHeroUnClaimed,
      { data: updateHeroUnClaimedData, loading: unclaiming },
    ] = useMutation(UPDATE_HERO_UNCLAIMED);

  const clickDeleteHero = async (id) => {
    if (confirm("Are you sure you want to delete the Hero?")) {
      const deleteHerotResponse = await deleteHero({
        variables: {
          id: id,
        },
        update(cache) {
          const normalizedId = cache.identify({ id, __typename: "Hero" });
          cache.evict({ id: normalizedId });
          cache.gc();
        },
      }).catch(console.error);
    } else {
      return;
    }
  };

  const clickClaim = async (id) => {
    const updateHeroClaimedResponse = await updateHeroClaimed({
      variables: {
        id: id,
        isClaimed: true,
        moderatorConnect: user.id,
      },
      refetchQueries: [{ query: GET_HEROS }],
    }).catch(console.error);
  };
  const clickUnClaim = async (id) => {
    const updateHeroUnClaimedResponse = await updateHeroUnClaimed({
      variables: {
        id: id,
        isClaimed: false,
        moderatorDisconnect: true,
      },
      refetchQueries: [{ query: GET_HEROS }],
    }).catch(console.error);
  };

  if (error) return <h1>{error.message}</h1>;

  if (loading) return <Loading />;
 

  if (claiming || unclaiming) return <Loading />;


  return (
    <Wrap>
      <h1>Unclaimed Nominations</h1>
      <HeroWrap>
        {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
        {data.getHeros.data
          .filter((heroF) => heroF?.isClaimed === false)
          .map((hero, i) => {
            return (
              <Hero>
                <h2>{hero.quest.name}</h2>
                {!hero?.isClaimed && <p>Not Claimed</p>}
                {!hero?.isClaimed ? (
                  <button onClick={() => clickClaim(hero._id)}>Claim</button>
                ) : (
                  <button onClick={() => clickUnClaim(hero._id)}>
                    Unclaim
                  </button>
                )}
                <h3>Name: {hero.name}</h3>
                <p>Description: {hero.description}</p>
                <h4>
                  {hero.isBeingReviewed ? (
                    <>{!hero.isAccepted && "Is in Review"}</>
                  ) : (
                    "Waiting to be Reviewed"
                  )}
                </h4>
                <h4>
                  {hero.isAccepted ? "Is Accepted" : "Waiting to be Accepted"}
                </h4>
                {hero?.isClaimed &&
                  <>
                    <Link href={`profile/hero-review/${hero._id}`}>
                      View Hero and Review
                    </Link>
                    <button onClick={() => clickDeleteHero(hero._id)}>
                      Delete Hero
                    </button>
                  </>
               }
              </Hero>
            );
          })}
      </HeroWrap>
      <h1>Claimed Nominations</h1>
      <HeroWrap>
        {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
        {data.getHeros.data
          .filter((heroF) => heroF?.isClaimed === true && heroF?.moderator._id === user.id)
          .map((hero, i) => {
            return (
              <Hero>
                <h2>{hero.quest.name}</h2>
                {!hero?.isClaimed && <p>Not Claimed</p>}
                {!hero?.isClaimed ? (
                  <button onClick={() => clickClaim(hero._id)}>Claim</button>
                ) : (
                  <button onClick={() => clickUnClaim(hero._id)}>
                    Unclaim
                  </button>
                )}
                <h3>Name: {hero.name}</h3>
                <p>Description: {hero.description}</p>
                <h4>
                  {hero.isBeingReviewed ? (
                    <>{!hero.isAccepted && "Is in Review"}</>
                  ) : (
                    "Waiting to be Reviewed"
                  )}
                </h4>
                <h4>
                  {hero.isAccepted ? "Is Accepted" : "Waiting to be Accepted"}
                </h4>
                {hero?.isClaimed &&
                  <>
                    <Link href={`profile/hero-review/${hero._id}`}>
                      View Hero and Review
                    </Link>
                    <button onClick={() => clickDeleteHero(hero._id)}>
                      Delete Hero
                    </button>
                  </>
               }
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
  padding: 25px;
`;

const HeroWrap = styled.div`
  width: 950px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 300px 300px 300px;
  grid-column-gap: 25px;
`;

const Wrap = styled.div`
  text-align: center;
`;
