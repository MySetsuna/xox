import useRootStore, { type RootState } from 'app/stores/root';
import { useMemo } from 'react';
import { Navigate } from 'react-router';

interface HomeNavProps {
  redirectTo: string;
}

const HomeNav: React.FC<HomeNavProps> = () => {
  const homeType = useRootStore((state: RootState) => state.homeType);
  const mode = useRootStore((state: RootState) => state.mode);

  const path = useMemo(() => {
    if (homeType === 'note') {
      return `/note/${mode}`;
    } else if (homeType === 'overview') {
      return `/overview`;
    }
    return `/note`; // default to note mode
  }, [homeType, mode]);

  return <Navigate to={path} />;
};

export default HomeNav;
