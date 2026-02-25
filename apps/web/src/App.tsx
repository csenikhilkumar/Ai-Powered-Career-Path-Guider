import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'sonner';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Toaster position="top-right" theme="dark" richColors closeButton />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
