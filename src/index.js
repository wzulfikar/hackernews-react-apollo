import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import { ApolloProvider, createNetworkInterface, ApolloClient } from 'react-apollo'

// create network interface for our endpoint (from react-apollo)
const networkInterface = createNetworkInterface({
  uri: 'https://api.graph.cool/simple/v1/cj9lb8x9751my01218plgt27n'
})

// instantiate the ApolloClient
const client = new ApolloClient({
  networkInterface
})

ReactDOM.render(
    // wrap the app with higher order component `ApolloProvider`
	<ApolloProvider client={client}>
		<App />
	</ApolloProvider>, 
	document.getElementById('root')
);
registerServiceWorker();
