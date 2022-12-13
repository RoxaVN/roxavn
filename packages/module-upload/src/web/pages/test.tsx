import { useState } from 'react';
import { ApiFileInput } from '../components';

const IndexPage = () => {
  const [value, setValue] = useState<any>(null);
  return <ApiFileInput value={value} onChange={setValue} />;
};

export default IndexPage;
