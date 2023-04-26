import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import AppLayout from "~/components/layout/AppLayout";
import { ThemeProvider, createTheme } from '@mui/material/styles'

import { api } from "~/utils/api";

import "~/styles/globals.css";
import "~/styles/custom-editor.css"
import "~/styles/custom-scrollbar.css"

const theme = createTheme({
  palette: { mode: 'light' }
})

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <ThemeProvider theme={theme}>
      <SessionProvider session={session}>
        <AppLayout>
          <Component {...pageProps} />
        </AppLayout>
      </SessionProvider>
    </ThemeProvider>
  );
};

export default api.withTRPC(MyApp);
