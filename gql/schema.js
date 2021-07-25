import { gql } from "@apollo/client";

export const CREATE_INVITE = gql`
  mutation CreateInvite($inviteCode: Int!, $email: String!, $role: UserRole!) {
    createInvite(
      data: { inviteCode: $inviteCode, email: $email, role: $role }
    ) {
      email
      role
      _id
      inviteCode
    }
  }
`;

export const GET_INVITES = gql`
  query GetInvites {
    getInvites {
      data {
        email
        role
        _id
        inviteCode
      }
    }
  }
`;

export const CREATE_QUEST = gql`
  mutation (
    $name: String
    $description: String
    $ownerConnect: ID!
    $image: String
    $heroName: String
    $heroDescription: String
    $heroWebsite: String
    $heroTwitter: String
    $heroAvatar: String
    $knightName: String
    $knightConnect: ID!
  ) {
    createQuest(
      data: {
        name: $name
        description: $description
        owner: { connect: $ownerConnect }
        isAccepted: false
        isBeingReviewed: false
        image: $image
        heros: {
          create: [
            {
              isAccepted: false
              isBeingReviewed: false
              name: $heroName
              description: $heroDescription
              website: $heroWebsite
              twitter: $heroTwitter
              avatar: $heroAvatar
            }
          ]
        }
        knights: {
          create: [{ name: $knightName, owner: { connect: $knightConnect } }]
        }
      }
    ) {
      name
      isAccepted
      image
      description
      _id
      isBeingReviewed
      knights {
        data {
          website
          name
          avatar
          _id
        }
      }
      heros {
        data {
          website
          name
          avatar
          description
          _id
          twitter
        }
      }
    }
  }
`;
