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
    $category: Category
    $isAccepted: Boolean
    $isBeingReviewed: Boolean
  ) {
    updateQuest(
      id: $id
      data: {
        name: $name
        description: $description
        owner: { connect: $ownerConnect }
        isAccepted: $isAccepted
        isBeingReviewed: $isBeingReviewed
        image: $image
        category: $category
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
        isClaimed
        knights {
          data {
            website
            name
            avatar
            _id
            twitter
          }
        }
        moderator{
          name
          _id
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
          wikipedia
          _id
          isAccepted
          isBeingReviewed
          twitter
        }
      }
    }
  }
`;

export const DELETE_QUEST_BY_ID = gql`
  mutation ($id: ID!) {
    deleteQuest(id: $id) {
      name
    }
  }
`;

export const CREATE_HERO = gql`
  mutation (
    $name: String
    $isAccepted: Boolean
    $isBeingReviewed: Boolean
    $description: String
    $questConnect: ID!
    $wikipedia: String
    $ownerConnect: ID!
  ) {
    createHero(
      data: {
        name: $name
        isAccepted: $isAccepted
        isBeingReviewed: $isBeingReviewed
        description: $description
        wikipedia: $wikipedia
        quest: { connect: $questConnect }
        owner: { connect: $ownerConnect }
      }
    ) {
      name
    }
  }
`;

export const UPDATE_HERO = gql`
  mutation (
    $id: ID!
    $name: String
    $description: String
    $wikipedia: String
    $ownerConnect: ID!
    $questConnect: ID!
    $isAccepted: Boolean
    $isBeingReviewed: Boolean
  ) {
    updateHero(
      id: $id
      data: {
        name: $name
        description: $description
        wikipedia: $wikipedia
        owner: { connect: $ownerConnect }
        quest: { connect: $questConnect }
        isAccepted: $isAccepted
        isBeingReviewed: $isBeingReviewed
      }
    ){
      name
    }
  }
`;

export const GET_HEROS = gql`
  query {
    getHeros {
      data {
        name
        wikipedia
        isAccepted
        isBeingReviewed
        description
        _id
        quest {
          name
          _id
        }
        owner {
          email
          _id
        }
      }
    }
  }
`;

export const GET_HERO_BY_ID = gql`
  query ($id: ID!) {
    findHeroByID(id: $id) {
      name
      description
      wikipedia
      isAccepted
      isBeingReviewed
      quest{
        _id
      }
    }
  }
`;

export const DELETE_HERO_BY_ID = gql`
  mutation($id:ID!){
    deleteHero(id:$id){
      name
    }
  }
`

export const UPDATE_QUEST_CLAIMED = gql`
  mutation (
    $id: ID!
    $isClaimed: Boolean
    $moderatorConnect: ID!
  ) {
    updateQuest(
      id: $id
      data: {
      isClaimed: $isClaimed
      moderator: {connect:$moderatorConnect}
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