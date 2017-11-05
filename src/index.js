import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import './styles/index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';

// apollo imports
import ApolloClient from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloProvider } from 'react-apollo';

const client = new ApolloClient({
	link: new HttpLink({ uri: 'https://api.graph.cool/simple/v1/cj9lb8x9751my01218plgt27n' }),
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
