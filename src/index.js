import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';

import { ApolloProvider, createNetworkInterface, ApolloClient } from 'react-apollo'

const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: 'https://api.graph.cool/simple/v1/cj9lb8x9751my01218plgt27n',
  }),
});

ReactDOM.render(
    // wrap the app with higher order component `ApolloProvider`
	<ApolloProvider client={client}>
		<App />
	</ApolloProvider>, 
	document.getElementById('root')
);
registerServiceWorker();
