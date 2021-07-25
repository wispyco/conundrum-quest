import { useMutation, useQuery } from "@apollo/client";
import Router from "next/dist/server/router";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { GET_QUEST_BY_ID, UPDATE_QUEST } from "../gql/schema";
import Loading from "./Loading";

export default function EditQuestMod({ user, data, Router }) {
  const [updateQuest, { data: updateQuestData, loading: saving }] =
    useMutation(UPDATE_QUEST);

  let isAcceptedA;
  let isBeingReviewedA;

  console.log("data.findQuestByID.isAccepted", data.findQuestByID.isAccepted);
  console.log(
    "data.findQuestByID.isBeingReviewed",
    data.findQuestByID.isBeingReviewed
  );

  if (data.findQuestByID.isAccepted) {
    isAcceptedA = "0";
  } else {
    isAcceptedA = "1";
  }
  if (data.findQuestByID.isBeingReviewed) {
    isBeingReviewedA = "0";
  } else {
    isBeingReviewedA = "1";
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: data.findQuestByID.name,
      description: data.findQuestByID.description,
      category: data.findQuestByID.category,
      heroName: data.findQuestByID.heroName,
      heroDescription: data.findQuestByID.heroDescription,
      heroWebsite: data.findQuestByID.heroWebsite,
      heroTwitter: data.findQuestByID.heroTwitter,
      isAccepted: isAcceptedA,
      isBeingReviewed: isBeingReviewedA,
    },
  });
  const onSubmit = async (data) => {
    const {
      name,
      description,
      heroName,
      heroDescription,
      heroWebsite,
      heroTwitter,
      category,
      isAccepted,
      isBeingReviewed,
    } = data;

    let isAcceptedSet;
    let isBeingReviewedSet;

    if (isAccepted === "0") {
      isAcceptedSet = false;
    } else {
      isAcceptedSet = true;
    }
    if (isBeingReviewed === "0") {
      isBeingReviewedSet = false;
    } else {
      isBeingReviewedSet = true;
    }

    console.log("isAccepted", isAccepted);
    console.log("isAcceptedSet", isAcceptedSet);

    console.log("isBeingReviewed", isBeingReviewed);
    console.log("isBeingReviewedSet", isBeingReviewedSet);

    const updateQuestResponse = await updateQuest({
      variables: {
        id: Router.query.id,
        ownerConnect: user.id,
        name: name,
        description: description,
        image: "https://google.com",
        heroName: heroName,
        isAccepted: isAcceptedSet,
        isBeingReviewed: isBeingReviewedSet,
        heroDescription: heroDescription,
        heroWebsite: heroWebsite,
        heroTwitter: heroTwitter,
        heroAvatar: "https://google.com",
        knightName: user.name,
        knightConnect: user.id,
        category: category,
      },
    }).catch(console.error);

    // Router.push("/profile");
  };
  console.log(errors);

  return (
    <>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      <Form onSubmit={handleSubmit(onSubmit)}>
        <h2>Title</h2>
        <input
          type="text"
          placeholder="Is the food we eat scalable, sustainable, healthy, nutritious and tasty?"
          {...register("name", {})}
        />
        <h2>Description</h2>
        <textarea
          placeholder="Food and climate change are linked in complicated ways. The global food industry requires an enormous amount of energy to cultivate, transport, store, prepare, and serve foods. This leads to lots of greenhouse gases, and, in the process, soils, rivers, oceans, forests, and more, are often degraded and destroyed."
          {...register("description", {})}
        />
        <h2>Category</h2>
        <select {...register("category", {})}>
          <option value="SUSTAINABILITY_HUMAN_DEVELOPMENT">
            Sustainability + Human Development
          </option>
          <option value="TECHNOLOGY_INFRASTRUCTURE_ARTIFICIAL_INTELLIGENCE">
            Technology Infrastructure + Artificial Intelligence
          </option>
        </select>
        <h2>In Review</h2>
        <select {...register("isAccepted", {})}>
          <option value="0">No</option>
          <option value="1">Yes</option>
        </select>
        <h2>Is Accepted</h2>
        <select {...register("isBeingReviewed", {})}>
          <option value="0">No</option>
          <option value="1">Yes</option>
        </select>

        <input type="submit" />
      </Form>
    </>
  );
}

const Form = styled.form`
  width: 75%;
  margin: 0 auto;
  display: grid;
  grid-row-gap: 20px;
  input,
  select,
  textarea {
    padding: 10px;
    line-height: 20px;
  }
`;
