import { gql } from "@apollo/client";

export const GET_DAD_HATS_BY_USER_ID = gql`
  query FindUserByID($id: ID!) {
    findUserByID(id: $id) {
      _id
      name
      hats {
        data {
          name
          image
          _id
        }
      }
    }
  }
`;

export const CREATE_DAD_HAT = gql`
  mutation CreateDadHat($connect: ID!, $name: String!, $image: String!) {
    createDadHat(
      data: { name: $name, image: $image, owner: { connect: $connect } }
    ) {
      name
      image
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $name: String) {
    updateUser(id: $id, data: { name: $name }) {
      name
    }
  }
`;
