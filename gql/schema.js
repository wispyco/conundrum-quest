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
    $videoLink: String
    $wikipediaLink: String
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
        isClaimed: false
        videoLink: $videoLink
        wikipedia: $wikipediaLink
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
    $videoLink: String
    $wikipediaLink: String
  ) {
    updateQuest(
      id: $id
      data: {
        name: $name
        description: $description
        owner: { connect: $ownerConnect }
        isAccepted: $isAccepted
        image: $image
        category: $category
        videoLink: $videoLink
        wikipedia: $wikipediaLink
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
        follower1s {
          data {
            name
            isFollowing
          }
        }
        followers {
          name
        }
        image
        description
        _id
        isAccepted
        isBeingReviewed
        isClaimed
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
        moderator {
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
      videoLink
      wikipedia
      follower1s {
        data {
          owner {
            _id
            name
            twitter
            profileImage
          }
          _id
          name
          isFollowing
        }
      }
      followers {
        name
        id
      }
      description
      _id
      isAccepted
      isBeingReviewed
      category
      owner {
        _id
        name
      }
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
          youtube
          avatar
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
    $avatar: String
    $youtube: String
    $twitter: String
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
        isClaimed: false
        avatar: $avatar
        youtube: $youtube
        twitter: $twitter
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
    $youtube: String
    $avatar: String
    $twitter: String
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
        youtube: $youtube
        avatar: $avatar
        twitter: $twitter
      }
    ) {
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
        isClaimed
        description
        moderator {
          name
          _id
        }
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
      avatar
      twitter
      youtube
      quest {
        _id
      }
    }
  }
`;

export const DELETE_HERO_BY_ID = gql`
  mutation ($id: ID!) {
    deleteHero(id: $id) {
      name
    }
  }
`;

export const UPDATE_QUEST_CLAIMED = gql`
  mutation (
    $id: ID!
    $isClaimed: Boolean
    $moderatorConnect: ID!
    $isBeingReviewed: Boolean
  ) {
    updateQuest(
      id: $id
      data: {
        isClaimed: $isClaimed
        isBeingReviewed: $isBeingReviewed
        moderator: { connect: $moderatorConnect }
      }
    ) {
      name
    }
  }
`;

export const UPDATE_QUEST_UNCLAIMED = gql`
  mutation ($id: ID!, $isClaimed: Boolean, $moderatorDisconnect: Boolean) {
    updateQuest(
      id: $id
      data: {
        isClaimed: $isClaimed
        moderator: { disconnect: $moderatorDisconnect }
      }
    ) {
      name
    }
  }
`;

export const UPDATE_HERO_CLAIMED = gql`
  mutation ($id: ID!, $isClaimed: Boolean, $moderatorConnect: ID!) {
    updateHero(
      id: $id
      data: { isClaimed: $isClaimed, moderator: { connect: $moderatorConnect } }
    ) {
      name
    }
  }
`;

export const UPDATE_HERO_UNCLAIMED = gql`
  mutation ($id: ID!, $isClaimed: Boolean, $moderatorDisconnect: Boolean) {
    updateHero(
      id: $id
      data: {
        isClaimed: $isClaimed
        moderator: { disconnect: $moderatorDisconnect }
      }
    ) {
      name
    }
  }
`;

export const UPDATE_USER_NAME = gql`
  mutation ($id: ID!, $name: String, $twitter: String, $profileImage: String) {
    updateUser(
      id: $id
      data: { name: $name, twitter: $twitter, profileImage: $profileImage }
    ) {
      name
    }
  }
`;

export const GET_KNIGHTS = gql`
  query {
    getKnights {
      data {
        name
        quest {
          _id
        }
      }
    }
  }
`;

export const FOLLOW = gql`
  mutation ($isFollowing: Boolean, $name: String, $quests: [ID], $owner: ID!) {
    createFollower1(
      data: {
        isFollowing: $isFollowing
        name: $name
        quests: { connect: $quests }
        owner: { connect: $owner }
      }
    ) {
      name
      quests {
        data {
          name
          follower1s {
            data {
              name
              isFollowing
            }
          }
        }
      }
    }
  }
`;
export const UNFOLLOW = gql`
  mutation (
    $id: ID!
    $isFollowing: Boolean
    $name: String
    $quests: [ID]
    $owner: ID!
  ) {
    updateFollower1(
      id: $id
      data: {
        isFollowing: $isFollowing
        name: $name
        quests: { disconnect: $quests }
        owner: { connect: $owner }
      }
    ) {
      name
      quests {
        data {
          name
          follower1s {
            data {
              name
              isFollowing
            }
          }
        }
      }
    }
  }
`;

export const DELETE_FOLLOWER = gql`
  mutation Delete($id: ID!) {
    deleteFollower1(id: $id) {
      name
    }
  }
`;

export const GET_FOLLOWER_QUEST = gql`
  query {
    getFollowers {
      data {
        quests {
          data {
            name
            _id
            description
            follower1s {
              data {
                name
                owner {
                  name
                  _id
                }
              }
            }
          }
        }
      }
    }
  }
`;
