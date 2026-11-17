import { StoreProvider } from './lib/store';
import { useRoute } from './lib/router';
import { ToastProvider } from './components/ui';
import { Landing } from './Landing';
import { ParentApp } from './parent/ParentApp';
import { TeenApp } from './teen/TeenApp';

export function App() {
  const route = useRoute();
  return (
    <StoreProvider>
      <ToastProvider>
        {route === 'parent' ? <ParentApp /> : route === 'teen' ? <TeenApp /> : <Landing />}
      </ToastProvider>
    </StoreProvider>
  );
}
