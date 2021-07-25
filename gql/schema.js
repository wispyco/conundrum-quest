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
    $knightName: String
    $knightConnect: ID!
    $category: Category
  ) {
    createQuest(
      data: {
        name: $name
        description: $description
        owner: { connect: $ownerConnect }
        isAccepted: false
        isBeingReviewed: false
        image: $image
        category: $category
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
export const UPDATE_QUEST = gql`
  mutation (
    $id: ID!
    $name: String
    $description: String
    $ownerConnect: ID!
    $image: String
    $knightName: String
    $knightConnect: ID!
    $category: Category
  ) {
    updateQuest(
      id: $id
      data: {
        name: $name
        description: $description
        owner: { connect: $ownerConnect }
        isAccepted: false
        isBeingReviewed: false
        image: $image
        category: $category
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

export const GET_QUESTS_BY_USER_ID = gql`
  query ($id: ID!) {
    findUserByID(id: $id) {
      quests {
        data {
          name
          image
          description
          _id
          isAccepted
          isBeingReviewed
          category
          knights {
            data {
              website
              name
              avatar
              _id
              twitter
            }
          }
          heros {
            data {
              website
              name
              avatar
              description
              _id
              isAccepted
              isBeingReviewed
              twitter
            }
          }
        }
      }
    }
  }
`;

export const GET_QUESTS = gql`
  query {
    getQuests {
      data {
        name
        image
        description
        _id
        isAccepted
        isBeingReviewed
        knights {
          data {
            website
            name
            avatar
            _id
            twitter
          }
        }
        heros {
          data {
            website
            name
            avatar
            description
            _id
            isAccepted
            isBeingReviewed
            twitter
          }
        }
      }
    }
  }
`;

export const GET_QUEST_BY_ID = gql`
  query ($id: ID!) {
    findQuestByID(id: $id) {
      name
      image
      description
      _id
      isAccepted
      isBeingReviewed
      category
      knights {
        data {
          website
          name
          avatar
          _id
          twitter
        }
      }
      heros {
        data {
          website
          name
          avatar
          description
          _id
          isAccepted
          isBeingReviewed
          twitter
        }
      }
    }
  }
`;
