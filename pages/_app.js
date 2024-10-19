import "../styles/global.css"
import "../styles/popup.css"

import { SessionProvider } from "next-auth/react"
import { Provider } from 'react-redux';
import store from '../components/store';
import { useEffect } from 'react';

function MyApp({ Component, pageProps: { session, ...pageProps }})
{

    return (

        <SessionProvider session={session}>
            <Provider store={store}>
          <Component {...pageProps} />
          </Provider>
        </SessionProvider>
      );
}

export default MyApp