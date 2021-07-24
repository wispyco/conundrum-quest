import Image from "next/image";
import styled, { keyframes } from "styled-components";

export default function Loading() {
  return (
    <ImageRotate>
      <Image width="50" height="62.48" src="/logo-3.png" />
    </ImageRotate>
  );
}

const rotation = keyframes`
  0% {
    transform: rotate(360deg);
  }
  100% {
    transform: rotate(0deg);
  }
`;

const ImageRotate = styled.div`
  width: 50px;
  left: 50%;
  margin-left: -25px;
  top: 35%;
  position: fixed;

  animation: ${rotation} 2s infinite linear;
`;
