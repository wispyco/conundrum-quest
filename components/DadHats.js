import { gql, useMutation } from "@apollo/client";
import Image from "next/image";
import randomColor from "randomcolor";
import React from "react";
import styled from "styled-components";
import { GET_DAD_HATS_BY_USER_ID } from "../pages/profile";

export const DELETE_DAD_HAT = gql`
  mutation DeleteDadHat($id: ID!) {
    deleteDadHat(id: $id) {
      name
      image
      _id
    }
  }
`;

export default function DadHats({ data, user }) {
  const [deleteDadHat, { data: deleteDadHatData, loading: deleting }] =
    useMutation(DELETE_DAD_HAT);

  const clickDeleteDadHat = async (id) => {
    const deleteDadHatResponse = await deleteDadHat({
      variables: {
        id,
      },
      update(cache) {
        const normalizedId = cache.identify({ id, __typename: "DadHat" });
        cache.evict({ id: normalizedId });
        cache.gc();
      },
    }).catch(console.error);
  };

  return (
    <>
      <DadHatGrid>
        {data?.findUserByID?.hats?.data.map((dadHat) => {
          return (
            <React.Fragment key={dadHat._id}>
              <DadHatBox
                backgroundRandom={randomColor({
                  hue: "blue",
                  luminosity: "light",
                })}
              >
                <h2>{dadHat.name}</h2>
                <Image width="400" height="500" src={dadHat.image} />
                <button onClick={() => clickDeleteDadHat(dadHat._id)}>
                  Delete {data?.findUserByID?.name} Dad Hat ;(
                </button>
              </DadHatBox>
            </React.Fragment>
          );
        })}
      </DadHatGrid>
    </>
  );
}

const DadHatGrid = styled.section`
  display: grid;
  grid-template-columns: 525px 525px 525px;
  grid-row-gap: 25px;
  margin: 150px auto;
  width: 1575px;
`;

const DadHatBox = styled.div`
  width: 500px;
  height: 600px;
  background-color: ${(props) => props.backgroundRandom};
  border-radius: 15px;
  padding: 15px;
  display: grid;
  align-items: center;
  justify-items: center;
  h2 {
    margin: 0;
    padding: 0 20px;
    color: #fff;
  }
  img {
    border-radius: 30px;
    height: 500px;
    width: 400px;
    object-fit: cover;
    padding: 25px;
  }
`;
