import Head from 'next/head';
import stylesheet from 'antd/dist/antd.min.css';
import nprogress from 'nprogress/nprogress.css';
import axios from 'axios';
import { SWRConfig } from 'swr';
import Router from 'next/router';
import NProgress from 'nprogress';

import { createGlobalStyle } from 'styled-components';
import { normalize } from 'styled-normalize';

import { createWrapper } from 'next-redux-wrapper';
import { Provider } from 'react-redux';
import Cookie from 'js-cookie';
import store from '@/store/store';

import Alert from '@/components/UI/Alert';

axios.defaults.baseURL = 'http://localhost:8000';

axios.defaults.headers = {
    'Content-Type': 'application/json',
    Authorization: `Token ${Cookie.get('token')}`,
};

NProgress.configure({
    showSpinner: false,
    trickleRate: 0.1,
    trickleSpeed: 300,
});

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const MyApp = ({ Component, pageProps }) => {
    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: stylesheet }} />
            <style dangerouslySetInnerHTML={{ __html: nprogress }} />
            <Head>
                <title>My page</title>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width"
                />
            </Head>
            <>
                <GlobalStyle />
                <SWRConfig
                    value={{ dedupingInterval: 1000, fetcher: url => axios(url).then(r => r.data) }}
                >
                    <Provider store={store}>
                        <Alert />
                        <Component {...pageProps} />
                    </Provider>
                </SWRConfig>
            </>
        </>
    );
};

const makestore = () => store;
const wrapper = createWrapper(makestore);

export default wrapper.withRedux(MyApp);

const GlobalStyle = createGlobalStyle`
  ${normalize}
  * {
    text-decoration: none;
  }
  .__next {
    height: 100%; 
    width: 100%;
  }
  p {
    margin: 0;
  }
  html {
    box-sizing: border-box;
  }
  body {
    overscroll-behavior: none;
    overflow-x: hidden;
    margin-top: -20px;
    &.no-scroll {
      overflow-y: hidden;
    }
  }

  #nprogress .bar {
    background: white !important;
  }
`;
