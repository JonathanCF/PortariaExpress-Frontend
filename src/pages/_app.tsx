import "../../src/styles/globals.scss";
import { AppProps } from "next/app";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify'

import { AuthContext, AuthProvider } from "../context/AuthContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>

      <Component {...pageProps} />
      <ToastContainer autoClose={3000} theme="dark" />

    </AuthProvider>
  );
}

export default MyApp;
