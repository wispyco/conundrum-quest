import { gql, useMutation, useReactiveVar } from "@apollo/client";
import { getOperationAST } from "graphql";
import Image from "next/image";
import randomColor from "randomcolor";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { GET_DAD_HATS_BY_USER_ID } from "../pages/profile";
import * as markerjs2 from "markerjs2";

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

  const [imgRef, setImgRef] = useState(null);

  const [imageState, setImageState] = useState(null);
  const [markerImageState, setMarkerImageState] = useState([
    { id: 0, state: null },
  ]);

  const [marker, setMarker] = useState(false);

  const [mergedData, setMergedData] = useState(data?.findUserByID?.hats?.data);

  const [extendState, setExtendState] = useState({});

  function showMarkerArea(e, i) {
    console.log("e", e.target);
    if (imgRef.current !== null) {
      console.log(imgRef);
      // create a marker.js MarkerArea
      const markerArea = new markerjs2.MarkerArea(e.target);
      // markerArea.renderAtNaturalSize = false;
      // markerArea.renderHeight = 200;
      // markerArea.renderWidth = 100;

      markerArea.targetRoot = document.getElementById(`image${i}`);
      console.log(markerArea);

      // markerArea.settings.displayMode = "popup";
      // // attach an event handler to assign annotated image back to our image element
      markerArea.addRenderEventListener((dataUrl, state) => {
        if (imgRef) {
          setImgRef(dataUrl);
        }
        setMarker(true);
        setImageState(state);

        // take the state
        let test = JSON.parse(JSON.stringify(mergedData));

        console.log(test, "test");

        console.log(test === mergedData);

        test[i].state = state;

        console.log(test);

        // let mergedDataCopy = test;

        // var sliced = mergedDataCopy.splice(i, 1);

        setMergedData(test);

        if (markerImageState.state) {
          setMarkerImageState((markerImageState) => [
            ...markerImageState,
            { id: i, state: state },
          ]);
        } else {
          setMarkerImageState([{ id: i, state: state }]);
        }
      });
      setMarker(false);

      // // launch marker.js
      markerArea.show();
      if (imageState) {
        markerArea.restoreState(imageState);
      }
    }
  }

  // finally, call the show() method and marker.js UI opens

  return (
    <>
      <DadHatGrid>
        {mergedData.map((dadHat, i) => {
          return (
            <React.Fragment key={dadHat._id}>
              <DadHatBox
                backgroundRandom={randomColor({
                  hue: "blue",
                  luminosity: "light",
                })}
              >
                <h2>{dadHat.name}</h2>
                {markerImageState.map((item) => {
                  <>
                    {item.id === i && (
                      <>
                        {marker && (
                          <Marker className="hover">
                            {item?.state?.markers.map((marker) => {
                              return (
                                <Ok top={marker.top} left={marker.left}>
                                  {marker.text}
                                </Ok>
                              );
                            })}
                          </Marker>
                        )}
                      </>
                    )}
                  </>;
                })}
                <div id={`image${i}`} className="wrap">
                  <Image
                    // onLoadingComplete={(e) => imgRef(e.target.src)}
                    onLoad={(e) => {
                      setImgRef(e.target);
                    }}
                    onClick={(e) => showMarkerArea(e, i)}
                    width="400"
                    height="500"
                    src={dadHat.image}
                  />
                </div>
                <button onClick={() => clickDeleteDadHat(dadHat._id)}>
                  Delete {data?.findUserByID?.name} Dad Hat ;(
                </button>
              </DadHatBox>
            </React.Fragment>
          );
        })}
      </DadHatGrid>
      <DadHatGrid>
        {markerImageState.map((item) => {
          return <>{item.id}</>;
        })}
      </DadHatGrid>
      <pre>{JSON.stringify(mergedData, null, 2)}</pre>
      <pre>{JSON.stringify(markerImageState, null, 2)}</pre>
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
  position: relative;
  width: 500px;
  height: 600px;
  background-color: ${(props) => props.backgroundRandom};
  border-radius: 15px;
  padding: 15px;
  display: grid;
  align-items: center;
  justify-items: center;
  // .wrap {
  //   position: relative;
  // }
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
  div.hover {
    display: none;
    width: 100%;
  }
  div.wrap {
    display: block;
    position: relative;
    img {
      position: relative;
    }
  }
  .__markerjs2_ {
    top: -35px !important;
  }
  .__markerjs2_ img {
    padding: 0;
    border-radius: 0;
  }
  &:hover {
    div.hover {
      background: red;
      display: block;
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
  background:red;
`;

// const Canvas = styled.canvas`
//   background: #f8f8f8;
//   padding: 0;
//   margin: 0 auto;
//   margin-bottom: 1rem;
//   display: block;
// `;
