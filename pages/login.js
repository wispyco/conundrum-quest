import { gql, useMutation } from "@apollo/client";
import axios from "axios";
import { useForm } from "react-hook-form";

export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    loginUser(input: { email: $email, password: $password })
  }
`;
export default function Login() {
  const [LoginUser, { data: LoginUserData, loading }] = useMutation(LOGIN_USER);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    console.log(data);

    const LoginUserReturn = await LoginUser({
      variables: {
        email: data.Email,
        password: data.Password,
      },
    }).catch(console.error);

    console.log("LoginUserReturn >>>>> ", LoginUserReturn);

    document.cookie = `fauna_client=${LoginUserReturn.data.loginUser}`;

    // axios
    //   .post("../api/login", {
    //     data,
    //   })
    //   .then(function (response) {
    //     console.log(response);
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });
  };

  console.log(errors);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        type="text"
        placeholder="Email"
        {...register("Email", { required: true, pattern: /^\S+@\S+$/i })}
      />
      <input type="text" placeholder="Password" {...register("Password", {})} />

      <input type="submit" />
    </form>
  );
}
