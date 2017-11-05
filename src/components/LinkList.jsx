import React from 'react'

import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import Link from './Link'

class LinkList extends React.Component {
	componentWillMount () {
		this._subscribeToNewLinks()
	}

	render () {
		if (this.props.allLinksQuery && this.props.allLinksQuery.loading) {
		  return <div>Loading..</div>
		}

		if (this.props.allLinksQuery && this.props.allLinksQuery.error) {
		  return <div>Error</div>
		}

		const linksToRender = this.props.allLinksQuery.allLinks
		
		return (
		  <div>
		  	{linksToRender.map((link, idx) => (
		  		<Link key={link.id} updateStoreAfterVote={this._updateCacheAfterVote} link={link} index={idx}/>
		  	))}
		  </div>
		)
	}

	_updateCacheAfterVote = (store, createVote, linkId) => {
		// 1. read `ALL_LINKS_QUERY` from cache using ApolloClient's `readQuery`
		const data = store.readQuery({ query: ALL_LINKS_QUERY })

		// 2. retrieve link that the user just voted
		const votedLink = data.allLinks.find(link => link.id === linkId)

		// 3. assign `votes` from server to votedLink's `votes`
		votedLink.votes = createVote.link.votes

		// 4. take the modified data and write it back into the store (cache)
		store.writeQuery({ query: ALL_LINKS_QUERY, data })
	}

	_subscribeToNewLinks = () => {
		console.log('subscribing to new links')

		// `subscribeToMore` is a function 
		// available on every query result in react-apollo
		this.props.allLinksQuery.subscribeToMore({
			document: gql`
				subscription {
					Link(filter: {
						mutation_in: [CREATED]
					}) {
						node {
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
				}
			`,
			updateQuery: (prev, {subscriptionData}) => {
				console.log('updateQuery', subscriptionData)
				if (!subscriptionData.data) {
					return prev
				}

				// merge new link with previous links
				const newAllLinks = [
					subscriptionData.data.Link.node,
					...prev.allLinks
				]
				const result = {
					...prev,
					allLinks: newAllLinks
				}
				return result
			}
		})
	}
}

export const ALL_LINKS_QUERY = gql`
	query AllLinksQuery {
		allLinks {
			id
			createdAt
			url
			description
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
// use apollo's higher order component `graphql`
export default graphql(ALL_LINKS_QUERY, {name: 'allLinksQuery'})(LinkList)