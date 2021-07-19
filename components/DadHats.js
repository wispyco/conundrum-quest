import { gql, useMutation, useReactiveVar } from "@apollo/client";
import { getOperationAST } from "graphql";
import Image from "next/image";
import randomColor from "randomcolor";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import * as markerjs2 from "markerjs2";
import { Markers } from "../gql/Markers";
import { GET_DAD_HATS_BY_USER_ID } from "../gql/schema";

export const DELETE_DAD_HAT = gql`
  mutation DeleteDadHat($id: ID!) {
    deleteDadHat(id: $id) {
      name
      image
      _id
    }
  }
`;

export const UPDATE_DAD_HAT = gql`
  mutation UpdateDadHat($id: ID!, $connect: ID!, $markers: [MarkerInput]) {
    updateDadHat(
      id: $id
      data: { markers: $markers, owner: { connect: $connect } }
    ) {
      markers {
        state
        containerTransformMatrix {
          e
          f
          a
          c
          b
          d
        }
        left
        height
        text
        color
        link
        typeName
        fontFamily
        rotationAngle
        padding
        width
        top
        visualTransformMatrix {
          e
          f
          a
          c
          b
          d
        }
      }
      name
      image
      _id
    }
  }
`;

export default function DadHats({ data, user }) {
  const [deleteDadHat, { data: deleteDadHatData, loading: deleting }] =
    useMutation(DELETE_DAD_HAT);

  const [updateDadHat, { data: updateDadHatData, loading: updating }] =
    useMutation(
      UPDATE_DAD_HAT,
      {
        refetchQueries: [
          {
            query: GET_DAD_HATS_BY_USER_ID,
            variables: { id: user.id },
          },
        ],
      }
      //   , {
      //   update(cache, { data: mutatedData }) {
      //     const updateDadHatResponse = mutatedData?.updateDadHat;

      //     if (updateDadHatResponse) {
      //       cache.writeQuery({
      //         query: GET_DAD_HATS_BY_USER_ID,
      //         variables: { id: user.id },
      //         data: {
      //           findUserByID: {
      //             hats: {
      //               data: updateDadHatResponse,
      //             },
      //           },
      //         },
      //       });
      //     }
      //   },
      // }
    );

  const clickDeleteDadHat = async (id) => {
    if (confirm("Are you sure you want to delete your streetwear?")) {
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
    } else {
      return;
    }
  };

  const [imgRef, setImgRef] = useState(null);

  const [imageState, setImageState] = useState(null);
  const [markerImageState, setMarkerImageState] = useState([
    { id: 0, state: null },
  ]);

  const [marker, setMarker] = useState(true);

  const [mergedData, setMergedData] = useState(data?.findUserByID?.hats?.data);

  const [extendState, setExtendState] = useState({});

  function showMarkerArea(e, i, id) {
    console.log("e", e.target);
    if (imgRef.current !== null) {
      console.log(imgRef);
      // create a marker.js MarkerArea
      const markerArea = new markerjs2.MarkerArea(e.target);
      // markerArea.renderAtNaturalSize = false;
      // markerArea.renderHeight = 200;
      // markerArea.renderWidth = 100;

      markerArea.availableMarkerTypes = [markerjs2.TextMarker];

      markerArea.targetRoot = document.getElementById(`image${i}`);
      console.log(markerArea);

      // markerArea.settings.displayMode = "popup";
      // // attach an event handler to assign annotated image back to our image element
      markerArea.addRenderEventListener(async (dataUrl, state) => {
        if (imgRef) {
          setImgRef(dataUrl);
        }
        // setMarker(true);
        setImageState(state);

        // take the state
        let deepMergedDataCopy = JSON.parse(
          JSON.stringify(data?.findUserByID?.hats?.data)
        );

        console.log(deepMergedDataCopy, "deepMergedDataCopy");

        console.log(deepMergedDataCopy === mergedData);

        deepMergedDataCopy[i].markers = state.markers;

        console.log(data?.findUserByID?.hats?.data, "mergedData");

        // const final = deepMergedDataCopy[i].markers.map((item, j) => {
        //   return { ...item, link: mergedData[i].markers[j].link };
        // });

        // console.log(final, "final");

        var test = deepMergedDataCopy.map((item, i) => {
          const array = item.markers.map((marker, j) => {
            return {
              ...marker,
              link: data?.findUserByID?.hats?.data[i]?.markers[j]?.link,
            };
          });

          if (JSON.stringify(array) === "[]") {
            return { ...item };
          } else {
            return { ...item, markers: array };
          }
        });

        console.log(test, "test");

        // let mergedDataCopy = test;

        // var sliced = mergedDataCopy.splice(i, 1);

        setMergedData(test);

        const updateDadHatResponse = await updateDadHat({
          variables: {
            id: id,
            connect: user.id,
            markers: Markers(test[i].markers),
          },
        }).catch(console.error);

        console.log("jfksadkfas;lkjd", Markers(test[i].markers));

        console.log(updateDadHatResponse);

        if (markerImageState.state) {
          setMarkerImageState((markerImageState) => [
            ...markerImageState,
            { id: i, state: state },
          ]);
        } else {
          setMarkerImageState([{ id: i, state: state }]);
        }
      });
      // setMarker(false);

      // // launch marker.js
      markerArea.show();
      if (mergedData[i]) {
        markerArea.restoreState(mergedData[i]);
      }
    }
  }

  // finally, call the show() method and marker.js UI opens

  const toggleBreakDown = () => {};

  return (
    <>
      <DadHatGrid>
        {data?.findUserByID?.hats?.data.map((dadHat, i) => {
          return (
            <React.Fragment key={dadHat._id}>
              <DadHatBox
                backgroundRandom={randomColor({
                  hue: "blue",
                  luminosity: "light",
                })}
              >
                <h2>{dadHat.name}</h2>
                {marker && (
                  <Marker className="hover">
                    {dadHat?.markers.map((marker, i) => {
                      return (
                        <a key={i} href={marker.link}>
                          <Ok top={marker.top} left={marker.left}>
                            {marker.text}
                          </Ok>
                        </a>
                      );
                    })}
                  </Marker>
                )}
                <div id={`image${i}`} className="wrap">
                  <Image
                    // onLoadingComplete={(e) => imgRef(e.target.src)}
                    onLoad={(e) => {
                      setImgRef(e.target);
                    }}
                    onClick={(e) => showMarkerArea(e, i, dadHat._id)}
                    width="400"
                    height="500"
                    src={dadHat.image}
                  />
                </div>
                <DadHatBreakDown
                  dadHat={dadHat}
                  user={user}
                  mergedData={mergedData}
                  allData={data?.findUserByID?.hats?.data}
                  i={i}
                />
                <button onClick={() => clickDeleteDadHat(dadHat._id)}>
                  Delete {data?.findUserByID?.name} Fit ;(
                </button>
              </DadHatBox>
              {/* <pre>{JSON.stringify(mergedData[i]?.state, null, 2)}</pre> */}
            </React.Fragment>
          );
        })}
      </DadHatGrid>
      <Video autoPlay loop muted>
        <source src="/explain.mov" />
        <source src="/explain.ogg" />
        Your browser does not support the HTML5 Video element.
      </Video>
      {/* <DadHatGrid>
        {markerImageState.map((item) => {
          return <>{item.id}</>;
        })}
      </DadHatGrid> */}
      {/* <pre>{JSON.stringify(mergedData, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(markerImageState, null, 2)}</pre> */}
    </>
  );
}

const DadHatBreakDown = ({ dadHat, user, allData, i }) => {
  const [updateDadHat, { data: updateDadHatData, loading: updating }] =
    useMutation(UPDATE_DAD_HAT, {
      refetchQueries: [
        {
          query: GET_DAD_HATS_BY_USER_ID,
          variables: { id: user.id },
        },
      ],
    });

  let deepMergedDataCopy = JSON.parse(JSON.stringify(allData));

  const addLink = async (link, itemText) => {
    let deepMergedDataCopy = JSON.parse(JSON.stringify(allData));

    console.log("deepMergedDataCopy >>>>>>", deepMergedDataCopy[i]);

    const insertLink = deepMergedDataCopy[i].markers.map((item) => {
      console.log("item.text", item.text);
      console.log("itemText", itemText);

      if (item.text === itemText) {
        return { ...item, link: link };
      }
      return item;
    });

    console.log(insertLink, "insertLink");

    const final = Markers(insertLink);

    console.log(final, "final");

    const updateDadHatResponse = await updateDadHat({
      variables: {
        id: dadHat._id,
        connect: user.id,
        markers: final,
      },
    }).catch(console.error);

    setDadHatState(final);
  };

  const addLinkPopup = (itemText) => {
    let linkGotten = prompt("Please enter your Link");
    if (linkGotten == null || linkGotten == "") {
      return;
    } else {
      addLink(linkGotten, itemText);
    }
  };

  const [breakDownState, setBreakDownState] = useState(false);

  const toggleBreakDown = () => {
    setBreakDownState((breakDown) => !breakDown);
  };

  const [dadHatState, setDadHatState] = useState(dadHat?.markers);

  return (
    <BreakDownWrap>
      <button onClick={toggleBreakDown}>Add Links Toggle</button>
      {breakDownState && (
        <BreakDown>
          {dadHat?.markers.map((item, i) => {
            return (
              <React.Fragment key={i}>
                <a href={item.link}>{item.text}</a>
                <h2>
                  <button onClick={() => addLinkPopup(item.text)}>
                    Add Link
                  </button>
                </h2>
              </React.Fragment>
            );
          })}
        </BreakDown>
      )}
      {/* {i === 7 && <pre>{JSON.stringify(dadHat?.markers, null, 2)}</pre>} */}
    </BreakDownWrap>
  );
};

const BreakDownWrap = styled.div`
  button {
    z-index: 200;
    position: relative;
  }
`;

const Video = styled.video`
  width: 1200px;
  margin: 0 auto;
  display: block;
  border: 15px solid #062600;
  margin-top: 50px;
  border-radius: 10px;
`;

const BreakDown = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  border: 1px solid #000;
  padding: 25px;
  border-radius: 15px;
  background: #fff;
  a {
    color: blue;
  }
  h2,
  h1 {
    color: #000 !important;
  }
  height: 600px;
  z-index: 150;
`;

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
    opacity: 0;
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
    z-index: 200 !important;
  }
  .__markerjs2_ img {
    padding: 0;
    border-radius: 0;
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
  background:red;
`;

// const Canvas = styled.canvas`
//   background: #f8f8f8;
//   padding: 0;
//   margin: 0 auto;
//   margin-bottom: 1rem;
//   display: block;
// `;
