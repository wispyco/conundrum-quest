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
                <Marker className="hover">
                  {dadHat?.markers.map((marker) => {
                    return (
                      <a href={marker.link}>
                        <Ok
                          top={marker.top}
                          left={marker.left}
                          background={randomColor({
                            hue: "orange",
                            luminosity: "bright",
                          })}
                        >
                          {marker.text}
                        </Ok>
                      </a>
                    );
                  })}
                </Marker>
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
  div.hover {
    opacity: 0;
    width: 100%;
  }
  &:hover {
    div.hover {
      opacity: 1;
      span {
        border: 1px solid #fff;
        padding: 5px;
      }
    }
  }
`;

const Marker = styled.div`
  position: relative;
  z-index: 100;
  color: #fff;
  font-size: 16px;
`;

const Ok = styled.span`
  position: absolute;
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}px};
  z-index: 100;
  color: #fff;
  font-size: 16px;
  background:${(props) => props.background};
`;
