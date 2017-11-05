import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';

import './styles/index.css';
import 'noty/lib/noty.css';

// apollo imports
import ApolloClient from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloProvider } from 'react-apollo';

import { GC_AUTH_TOKEN } from './constants';

const httpLink = createHttpLink({ uri: 'https://api.graph.cool/simple/v1/cj9lb8x9751my01218plgt27n' })
const middlewareLink = new ApolloLink((operation, forward) => {
	if (!operation.options || !operation.options.headers) {
	  if (!operation.options) {
	  	operation.options = {}
	  }
	  operation.options.headers = {}
	}
	const token = localStorage.getItem(GC_AUTH_TOKEN)
	operation.setContext({
		headers: {
			authorization: token ? `Bearer ${token}` : null
		}
	})
	return forward(operation)
})

// construct `link` for use with ApolloClient's `link` 
const link = middlewareLink.concat(httpLink)

const client = new ApolloClient({
	link: link,
	cache: new InMemoryCache().restore(window.__APOLLO_STATE__),
});

// 1. wrap App component with `BrowserRouter` to provide
// its child components access to the routing functionality.
// 2. wrap the app with higher order component `ApolloProvider`
ReactDOM.render( 
	<BrowserRouter>
		<ApolloProvider client={client}>
			<App />
		</ApolloProvider>
	</BrowserRouter>, 
	document.getElementById('root')
);
registerServiceWorker();
