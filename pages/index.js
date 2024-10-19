
import LayoutMini from "../components/LayoutMini";
import SchoolInfo from "./schoolinfo";

import { getSession } from "next-auth/react";


export default function Home() {


  return (
    <LayoutMini>
   
      <SchoolInfo />

  </LayoutMini>
  );
}


export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
