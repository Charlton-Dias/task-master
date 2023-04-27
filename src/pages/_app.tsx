import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import AppLayout from "~/components/layout/AppLayout";
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { useRouter } from "next/router";
import { api } from "~/utils/api";

import "~/styles/globals.css"
import "~/styles/custom-scrollbar.css"

const theme = createTheme({
  palette: { mode: 'light' }
})

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const router = useRouter()

  return (
    <ThemeProvider theme={theme}>
      <SessionProvider session={session}>
        <ConditionalLayout condition={router.asPath != '/login'} Layout={AppLayout}>
          <Component {...pageProps} />
        </ConditionalLayout>
      </SessionProvider>
    </ThemeProvider>
  );
};

export default api.withTRPC(MyApp);

const ConditionalLayout: React.FC<{
  condition: boolean,
  Layout: React.FC<{children: React.ReactNode}>,
  children: React.ReactNode
}> = ({ condition, Layout, children }) => {
  return condition ? <Layout>{children}</Layout> : <>{children}</>;
}
