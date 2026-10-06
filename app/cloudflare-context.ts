import { createContext } from 'react-router';

// A fresh RouterContextProvider is created for each Worker request.
export const cloudflareContext = createContext<{ env: Env; ctx: ExecutionContext }>();
