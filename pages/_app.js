import { Provider } from "../components/Context";

const App = ({ Component, pageProps }) => {
  console.log();
  return (
    <Provider>
      <Component {...pageProps} />
    </Provider>
  );
};

export default App;
