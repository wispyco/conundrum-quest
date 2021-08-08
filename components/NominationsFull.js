import { useMutation, useQuery } from "@apollo/client";
import Link from "next/link";
import {
  DELETE_HERO_BY_ID,
  GET_HEROS,
  UPDATE_HERO_UNCLAIMED,
  UPDATE_HERO_CLAIMED,
  GET_QUESTS,
} from "../gql/schema";
import Loading from "./Loading";
import styled from "styled-components";

export default function NominationsFull({ user }) {
  const { loading, error, data, stopPolling, refetch } = useQuery(GET_HEROS, {
    variables: { id: user.id },
    // pollInterval: 500,
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

  const refetchOnHover = async (id) => {
    refetch();
  };

  const {
    loading: questsLoading,
    error: questsError,
    data: questsData,
  } = useQuery(GET_QUESTS, {
    variables: { id: user.id },
    // pollInterval: 500,
  });

  if (error) return <h1>{error.message}</h1>;

  if (loading) return <Loading />;

  if (claiming || unclaiming) return <Loading />;

  return (
    <>
      <pre>{JSON.stringify(questsData?.getQuests?.data, null, 2)}</pre>
      <Wrap>
        <h1>Nomination by Quest</h1>

        {questsData?.getQuests?.data.map((item) => {
          return (
            <>
              <p>{item.name}</p>

              {item.heros1.data.map((ok) => {
                return (
                  <>
                    {/* <Link href={`profile/hero-review/${item._id}/${ok._id}`}>
                      View Hero and Review
                    </Link> */}
                    <Hero
                      claimed={ok?.isClaimed}
                      claimedByYou={ok?.moderator?._id === user.id}
                      onMouseEnter={refetchOnHover}
                      key={ok._id}
                    >
                      {!ok?.isClaimed && <p>Not Claimed</p>}

                      {ok?.isClaimed && ok?.moderator?._id !== user.id && (
                        <p>Quest is being moderated by {ok?.moderator?.name}</p>
                      )}
                      {!ok?.isClaimed && (
                        <button onClick={() => clickClaim(ok._id)}>
                          Claim
                        </button>
                      )}
                      {/* // )} */}
                      <h3>Name: {ok.name}</h3>
                      <p>Description: {ok.description}</p>
                      <h4>
                        {ok.isBeingReviewed ? (
                          <>{!ok.isAccepted && "Is in Review"}</>
                        ) : (
                          "Waiting to be Reviewed"
                        )}
                      </h4>
                      <h4>
                        {ok.isAccepted
                          ? "Is Accepted"
                          : "Waiting to be Accepted"}
                      </h4>
                      {ok?.isClaimed && ok?.moderator?._id === user.id && (
                        <>
                          <Link
                            href={`profile/hero-review/${item._id}/${ok._id}`}
                          >
                            View Hero and Review
                          </Link>
                          <button onClick={() => clickUnClaim(ok._id)}>
                            Unclaim
                          </button>
                          <button onClick={() => clickDeleteHero(ok._id)}>
                            Delete Hero
                          </button>
                        </>
                      )}
                    </Hero>
                  </>
                );
              })}
            </>
          );
        })}

        <h1>Nominations</h1>
        <HeroWrap>
          {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
          {data.getHeros.data
            // .filter((heroF) => heroF?.isClaimed === false)
            .map((hero, i) => {
              return (
                <Hero
                  claimed={hero?.isClaimed}
                  claimedByYou={hero?.moderator?._id === user.id}
                  onMouseEnter={refetchOnHover}
                  key={i}
                >
                  <h2>{hero?.quest?.name}</h2>
                  {!hero?.isClaimed && <p>Not Claimed</p>}

                  {hero?.isClaimed && hero?.moderator?._id !== user.id && (
                    <p>Quest is being moderated by {hero?.moderator?.name}</p>
                  )}
                  {!hero?.isClaimed && (
                    <button onClick={() => clickClaim(hero._id)}>Claim</button>
                  )}
                  {/* // )} */}
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
                  {hero?.isClaimed && hero?.moderator?._id === user.id && (
                    <>
                      <Link href={`profile/hero-review/${hero._id}`}>
                        View Hero and Review
                      </Link>
                      <button onClick={() => clickUnClaim(hero._id)}>
                        Unclaim
                      </button>
                      <button onClick={() => clickDeleteHero(hero._id)}>
                        Delete Hero
                      </button>
                    </>
                  )}
                </Hero>
              );
            })}
        </HeroWrap>
      </Wrap>
    </>
  );
}

const Hero = styled.div`
  width: 300px;
  @media (max-width: 1100px) {
    width: 100%;
  }
  border: 1px solid #000;
  border-radius: 30px;
  padding: 25px;
  background-color: ${(props) => (props.claimed ? "#daf7f0" : "white")};
  border: ${(props) =>
    props.claimedByYou ? "4px solid #007eff !important" : "1px solid #000"};
`;

const HeroWrap = styled.div`
  width: 950px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 300px 300px 300px;
  grid-column-gap: 25px;
  @media (max-width: 1100px) {
    width: 90%;
    grid-template-columns: 1fr;
    grid-row-gap: 25px;
  }
`;

const Wrap = styled.div`
  text-align: center;
`;
