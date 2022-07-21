import type { GetStaticProps, NextPage } from "next";
import Presentation from "ui/partials/index/_presentation";

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      title: "",
    },
  };
};

const Index: NextPage<{ title: string }> = (props) => {
  return <div>
    <Presentation/>
  </div>;
};

export default Index;

