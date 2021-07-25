import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { CREATE_INVITE } from "../gql/schema";

export default function CreateInvite() {
  const [createInvite, { data: createInviteData, loading: saving }] =
    useMutation(CREATE_INVITE, {
      refetchQueries: { query: "GET_INVITES" },
    });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    const { email, role } = data;

    const createInviteResponse = await createInvite({
      variables: {
        inviteCode: Math.floor(100000 + Math.random() * 900000),
        email: email,
        role: role,
      },
    }).catch(console.error);
  };
  console.log(errors);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="text" placeholder="email" {...register("email", {})} />
      <select {...register("role", {})}>
        <option value="ADMIN">ADMIN</option>
        <option value="MODERATOR">MODERATOR</option>
        <option value="HERO">HERO</option>
      </select>

      <input type="submit" />
    </form>
  );
}
