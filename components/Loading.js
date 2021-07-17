import Image from "next/image";
import styled, { keyframes } from "styled-components";

export default function Loading() {
  return (
    <ImageRotate>
      <Image width="149" height="149" src="/logo-1.png" />
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
  width: 149px;
  height: 149px;
  left: 50%;
  margin-left: -74.5px;
  top: 25%;
  position: fixed;

  animation: ${rotation} 2s infinite linear;
`;
