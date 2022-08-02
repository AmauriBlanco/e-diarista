import type { GetStaticProps, NextPage } from 'next';
import Advantages from 'ui/partials/index/_advantages';
import FrequentQuestion from 'ui/partials/index/_frequent-question';
import Presentation from 'ui/partials/index/_presentation';

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      title: '',
    },
  };
};

const Index: NextPage<{ title: string }> = (props) => {
  return (
    <div>
      <Presentation />
      <Advantages />
      <FrequentQuestion />
    </div>
  );
};

export default Index;