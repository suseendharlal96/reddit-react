import "../styles/tailwind.css";
import "../styles/icons.css";

import axios from "axios";
import React from "react";
import { AppProps } from "next/app";
import { useRouter } from "next/router";

import Navbar from "../components/Navbar";
import { AuthProvider } from "../context/auth";

axios.defaults.baseURL = "http://localhost:5000/api/";
axios.defaults.withCredentials = true;

function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  const authRoute = ["/register", "/login"];
  const isAuthRoute = authRoute.includes(pathname);
  return (
    <AuthProvider>
      {!isAuthRoute && <Navbar />}
      <Component {...pageProps} />;
    </AuthProvider>
  );
}

export default App;
