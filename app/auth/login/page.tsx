import LoginForm from "@/components/auth/login-form";


export default function Login() {
  return <LoginForm />;
}


// -Prevent The Authanticated User From Hiting THIS Page!

// export async function getServerSideProps() {
//     return {
//         redirect:"/"
//     }
// }
