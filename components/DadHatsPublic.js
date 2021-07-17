import Image from "next/image";
import randomColor from "randomcolor";
import React from "react";
import styled from "styled-components";

export default function DadHatsPublic({ data }) {
  return (
    <>
      <DadHatGrid>
        {data?.getHats?.data.map((dadHat) => {
          return (
            <React.Fragment key={dadHat._id}>
              <DadHatBox
                backgroundRandom={randomColor({
                  hue: "orange",
                  luminosity: "light",
                })}
                color={randomColor({
                  hue: "orange",
                  luminosity: "dark",
                })}
              >
                <h2>{dadHat.name}</h2>
                <Image width="400" height="400" src={dadHat.image} />
                <p>By:{dadHat?.owner?.name}</p>
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
  margin: 0 auto;
  width: 1575px;
`;

const DadHatBox = styled.div`
  width: 500px;
  height: 600px;
  background-color: ${(props) => props.backgroundRandom};
  border-radius: 15px;
  // padding: 15px;
  display: grid;
  align-items: center;
  justify-items: center;
  h2 {
    margin: 0;
    padding: 0 20px;
    color: ${(props) => props.color};
  }
  img {
    border-radius: 50px;
    height: 500px;
    width: 400px;
    object-fit: cover;
    padding: 25px;
  }
`;
