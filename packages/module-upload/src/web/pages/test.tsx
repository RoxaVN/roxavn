import { ApiFileInput, ApiImageUploader } from '../components';

const IndexPage = () => {
  return (
    <>
      <ApiFileInput maxFiles={4} multiple onChange={(v) => console.log(v)} />
      <ApiImageUploader multiple onChange={(v) => console.log(v)} />
    </>
  );
};

export default IndexPage;
