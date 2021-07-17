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

  // let elemLeft;
  // let elemTop;

  // useEffect(() => {
  //   const canvas = document.getElementById("canvas");
  //   const ctx = canvas.getContext("2d");

  //   make_base(ctx);

  //   elemLeft = canvas.offsetLeft;
  //   elemTop = canvas.offsetTop;

  //   // outlined square X: 50, Y: 35, width/height 50
  //   ctx.beginPath();
  //   ctx.strokeRect(50, 35, 50, 50);

  //   // filled square X: 125, Y: 35, width/height 50
  //   ctx.beginPath();
  //   ctx.fillRect(125, 35, 50, 50);
  // }, []);

  // const clickedCanvas = (event) => {
  //   var x = event.pageX - elemLeft,
  //     y = event.pageY - elemTop;
  //   console.log(x, y);
  // };

  // function make_base(ctx) {
  //   const myImage = React.createElement(
  //     "img",
  //     {
  //       src: "https://preview.redd.it/ay3so7lynqb71.jpg?width=640&crop=smart&auto=webp&s=292f9c36c3f3e09535f8046ba37da55556ccb66d",
  //       // any other image attributes you need go here
  //     },
  //     null
  //   );

  //   ctx.drawImage(myImage, 0, 0);
  // }

  // useEffect(() => {
  //   // create an instance of MarkerArea and pass the target image reference as a parameter
  //   let markerArea = new markerjs2.MarkerArea(document.getElementById("myimg"));

  //   // register an event listener for when user clicks OK/save in the marker.js UI
  //   markerArea.addRenderEventListener((dataUrl) => {
  //     // we are setting the markup result to replace our original image on the page
  //     // but you can set a different image or upload it to your server
  //     document.getElementById("myimg").src = dataUrl;
  //   });
  //   markerArea.show();
  // }, []);

  // const imgRef = useRef(null);

  const [imgRef, setImgRef] = useState(null);

  function showMarkerArea(e) {
    console.log("e", e.target);
    if (imgRef.current !== null) {
      console.log(imgRef);
      // create a marker.js MarkerArea
      const markerArea = new markerjs2.MarkerArea(e.target);
      console.log(markerArea);
      // // attach an event handler to assign annotated image back to our image element
      markerArea.addRenderEventListener((dataUrl) => {
        if (imgRef) {
          setImgRef(dataUrl);
        }
      });
      // // launch marker.js
      markerArea.show();
    }
  }
  // finally, call the show() method and marker.js UI opens

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
                <Image
                  // onLoadingComplete={(e) => imgRef(e.target.src)}
                  onLoad={(e) => {
                    setImgRef(e.target);
                  }}
                  onClick={(e) => showMarkerArea(e)}
                  width="400"
                  height="500"
                  src={dadHat.image}
                />
                <button onClick={() => clickDeleteDadHat(dadHat._id)}>
                  Delete {data?.findUserByID?.name} Dad Hat ;(
                </button>
              </DadHatBox>
            </React.Fragment>
          );
        })}
        {/* <Canvas
          onClick={clickedCanvas}
          id="canvas"
          width="800"
          height="1200"
        ></Canvas> */}
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

// const Canvas = styled.canvas`
//   background: #f8f8f8;
//   padding: 0;
//   margin: 0 auto;
//   margin-bottom: 1rem;
//   display: block;
// `;
