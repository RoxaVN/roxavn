import { ApiFileInput } from '../components';

const IndexPage = () => {
  return (
    <ApiFileInput maxFiles={4} multiple onChange={(v) => console.log(v)} />
  );
};

export default IndexPage;
