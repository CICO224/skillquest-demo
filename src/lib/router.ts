import { useEffect, useState } from 'react';

export type Route = 'home' | 'parent' | 'teen';

function read(): Route {
  const h = window.location.hash.replace(/^#\/?/, '');
  return h === 'parent' || h === 'teen' ? h : 'home';
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(read);
  useEffect(() => {
    const onHash = () => {
      setRoute(read());
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  return route;
}

export const hrefFor = (r: Route) => (r === 'home' ? '#/' : `#/${r}`);
