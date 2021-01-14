import "../styles/tailwind.css";

import axios from "axios";
import React from "react";
import { AppProps } from "next/app";
import { useRouter } from "next/router";

import Navbar from "../components/Navbar";

axios.defaults.baseURL = "http://localhost:5000/api/";
axios.defaults.withCredentials = true;

function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  const authRoute = ["/register", "/login"];
  const isAuthRoute = authRoute.includes(pathname);
  return (
    <React.Fragment>
      {!isAuthRoute && <Navbar />}
      <Component {...pageProps} />;
    </React.Fragment>
  );
}

export default App;
