import "@styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material";
import theme from "ui/themes/theme";
import React, { useEffect, useState } from "react";
import Header from "ui/components/surface/Header/Header";
import Footer from "ui/components/surface/Footer/Footer";
import { AppContainer } from "@styles/pages/AppContainer.styled";
import Head from "next/head";
import { MainProvider } from "data/contexts/MainContext";

function App({ Component, pageProps }: AppProps) {
  return (
    <>
    <Head>
      <title>E-Diarista - {pageProps.title && `${pageProps.title}`}</title>
    </Head>
      <ThemeProvider theme={theme}>
        <AppContainer>
          <Header/>
          <main>
            <Component {...pageProps} />
          </main>
          <Footer/>
        </AppContainer>
      </ThemeProvider>
    </>
  );
}

const AppProviderContainer: React.FC<AppProps> = (props) => {
  return(
    <MainProvider>
      <App {...props}/>
    </MainProvider>
  )
}

export default AppProviderContainer;
