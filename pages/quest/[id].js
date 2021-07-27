import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import Loading from "../../components/Loading";
import { GET_QUEST_BY_ID } from "../../gql/schema";
import styled from "styled-components"
import Layout from "../../components/layout"
import Link from "next/link";

export default function QuestSingle(){

    const Router = useRouter();

  const {
    loading: getLoading,
    error: getError,
    data,
  } = useQuery(GET_QUEST_BY_ID, {
    variables: { id: Router.query.id },
  });

  
  
  if (getError) return <h1>failed to get</h1>;
  
  if (getLoading) return <Loading />;
  const {findQuestByID} = data

    return(
        <Layout>
        {/* <pre>
            {JSON.stringify(data,null,2)}
        </pre> */}
            <QuestCard quest={findQuestByID}/>
        </Layout>
    )
}


const QuestCard = ({ quest }) => {
  return (
    <Card>
      <h1>{quest?.name}</h1>
      <p>{quest?.description}</p>
      <HeroTitle>
        
      <h2>Heros</h2>
      <Link href={`/profile/nominate-hero/${quest._id}`}>Nominate Hero</Link>
      </HeroTitle>
      <HerosGrid>

      {quest.heros.data.map((hero)=>{
        return( 
          <>
             {hero.isAccepted &&
             
             <Hero>
            <h3>{hero?.name}</h3>
            <p>{hero?.description}</p>
            <a rel="noreferrer" target="_blank" href={hero?.wikipedia}>Wikipedia Article</a>
          </Hero>
        }
          </>
        )
      })}
      </HerosGrid>
    </Card>
  );
};

const Hero = styled.div`
    width:300px;
    text-align:center;
`

const HerosGrid = styled.div`
  display:grid;
  grid-template-columns: 1fr 1fr 1fr;
`

const HeroTitle = styled.div`
  text-align:center;
  margin: 35px 0;
  a{
    border-radius: 30px;
    background: #25cec8;
    color: #fff !important;
  }
`

const Card = styled.div`
  width: 900px;
//   border: 1px solid #000;
  padding: 0 25px 25px 25px;
//   border-radius: 30px;
  margin: 150px auto;
  h1 {
    font-weight: 300;
    height: 50px;
  }
  a {
    // border: 1px solid aqua;
    // border-radius: 30px;
    color:blue;
    padding: 10px;
    width: 200px;
    text-align: center;
    display: block;
    margin: 0 auto;
  }
`;


