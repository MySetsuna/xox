import { useParams } from 'react-router';

export default function Mode() {
  const params = useParams();
  return <>{params.mode}</>;
}
