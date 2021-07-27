import styled from "styled-components";

export default function ViewQuest({ user, data, Router }) {
 
  const {findQuestByID} = data

  return (
    <>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      <QuestCard quest={findQuestByID}/>
      
    </>
  );
}

const QuestCard = ({ quest }) => {
  return (
    <Card>
      <h1>{quest?.name}</h1>
      <p>{quest?.description}</p>
      {quest.heros.data.map((hero)=>{
         return( 
             <>
             
             <Hero>
            <h3>{hero?.name}</h3>
            <p>{hero?.description}</p>
            <a rel="noreferrer"  target="_blank" href={hero?.wikipedia}>Wikipedia Article</a>
          </Hero>
          </>
        )
      })}
    </Card>
  );
};

const Hero = styled.div`
    width:300px;
`

const Card = styled.div`
  width: 500px;
  border: 1px solid #000;
  padding: 0 25px 25px 25px;
  border-radius: 30px;
  h1 {
    font-weight: 300;
    height: 150px;
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


