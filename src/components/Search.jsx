import React, { Component } from 'react'

import gql from 'graphql-tag'
import {  withApollo } from 'react-apollo'

import Link from './Link'
import { noty } from '../utils'

class Search extends Component {
	searchInput

	state = {
		links: [],
		searchText: '',
		loading: false,
	}

	componentDidMount(){
	   this.searchInput.focus(); 
	}

	render() {
	  return (
		<div>
			<div>
				<input type="text" 
				onChange={(e) => this.setState({ searchText: e.target.value })} 
				placeholder='insert text to search'
				ref={(input) => { this.searchInput = input; }}
				/>
				<button onClick={() => this._executeSearch() }>{this.state.loading ? '...' : 'search'}</button>
			</div>
			{this.state.links.map((link, index) => <Link key={link.id} link={link} index={index} />)}
		</div>
	  )
	}

	_executeSearch = async () => {
		const { searchText } = this.state
		if (!searchText.length) {
			noty('Please insert text to search', 'error').show()
	   		this.searchInput.focus();
			return
		}
		this.setState({ loading: true })

		// send graphql query
		const result = await this.props.client.query({
			query: ALL_LINKS_SEARCH_QUERY,
			variables: { searchText }
		})
		const links = result.data.allLinks

		// update search results
		this.setState({ links, loading: false })
	}
}

const ALL_LINKS_SEARCH_QUERY = gql`
query AllLinksSearchQuery($searchText: String!) {
	allLinks(filter: {
		OR: [{
			url_contains: $searchText,
		}, {
			description_contains: $searchText,
		}]
	}) {
		id
		url
		description
		createdAt
		postedBy {
			id
			name
		}
		votes {
			id
			user {
				id
			}
		}
	}
}
`

// Inject instance of 'ApolloClient' as component's props (`props.client`)
// by wrapping our Search component with `withApollo` function
export default withApollo(Search)