import { AppProps } from "next/app";
import { useRouter } from "next/router";

import axios from "axios";
import { SWRConfig } from "swr";

import Navbar from "../components/Navbar";
import { AuthProvider } from "../context/auth";
import "../styles/tailwind.css";
import "../styles/icons.css";

// axios.defaults.baseURL = "https://reddit-clone-node.herokuapp.com/api";
axios.defaults.baseURL = "http://localhost:5000/api";
axios.defaults.withCredentials = true;

function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  const authRoute = ["/register", "/login"];
  const isAuthRoute = authRoute.includes(pathname);

  const fetcher = async (url: string) => {
    try {
      const res = await axios.get(url);
      return res.data;
    } catch (err) {
      throw err.response.data;
    }
  };

  return (
    <SWRConfig
      value={{
        fetcher,
      }}
    >
      <AuthProvider>
        {!isAuthRoute && <Navbar />}
        <div className={isAuthRoute ? "" : "pt-12 mt-1"}>
          <Component {...pageProps} />
        </div>
      </AuthProvider>
    </SWRConfig>
  );
}

export default App;
