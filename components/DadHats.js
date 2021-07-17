import { gql, useMutation } from "@apollo/client";
import randomColor from "randomcolor";
import styled from "styled-components";

export const DELETE_DAD_HAT = gql`
  mutation DeleteDadHat($id: ID!) {
    deleteDadHat(id: $id) {
      name
      image
    }
  }
`;

export default function DadHats({ data }) {
  const [deleteDadHat, { data: deleteDadHatData, loading: deleting }] =
    useMutation(DELETE_DAD_HAT);

  const clickDeleteDadHat = async (id) => {
    const deleteDadHatResponse = await deleteDadHat({
      variables: {
        id,
      },
    }).catch(console.error);
  };

  return (
    <>
      <DadHatGrid>
        {data?.findUserByID?.hats?.data.map((dadHat) => {
          return (
            <>
              <DadHatBox
                backgroundRandom={randomColor({
                  hue: "blue",
                  luminosity: "light",
                })}
              >
                <h2>{dadHat.name}</h2>
                <img src={dadHat.image} />
                <button onClick={() => clickDeleteDadHat(dadHat._id)}>
                  Delete Dad Hat ;(
                </button>
              </DadHatBox>
            </>
          );
        })}
      </DadHatGrid>
    </>
  );
}

const DadHatGrid = styled.section`
  display: grid;
  grid-template-columns: 325px 325px 325px 325px;
  margin: 0 auto;
  width: 1300px;
`;

const DadHatBox = styled.div`
  width: 300px;
  height: 250px;
  background-color: ${(props) => props.backgroundRandom};
  border-radius: 15px;
  padding: 15px;
  h2 {
    margin: 0;
    padding: 0 20px;
    color: #fff;
  }
  img {
    padding: 20px;
    border-radius: 30px;
    width: 100%;
  }
`;
