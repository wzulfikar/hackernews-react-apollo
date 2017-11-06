import React from 'react'

import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import Link from './Link'

import { LINKS_PER_PAGE } from '../constants'

class LinkList extends React.Component {
	state = {
		hasPrevious: this.props.match.page > 1,
		hasNext: true,
	}
	componentWillMount () {
		// refetch links form endpoint
		// if (!this.props.allLinksQuery.loading) {
		// 	this.props.allLinksQuery.refetch()
		// }
	}

	componentDidMount () {
		this._subscribeToNewLinks()
		this._subscribeToNewVotes()
	}

	render () {
		if (this.props.allLinksQuery && this.props.allLinksQuery.loading) {
		  return <div>Loading..</div>
		}

		if (this.props.allLinksQuery && this.props.allLinksQuery.error) {
		  return <div>Error</div>
		}

		const isNewPage = this.props.location.pathname.includes('new') || this.props.location.pathname === '/'
		const linksToRender = this._getLinksToRender(isNewPage)

		return (
		  <div>
			<div>
				{linksToRender.map((link, idx) => (
					<Link key={link.id} updateStoreAfterVote={this._updateCacheAfterVote} link={link} index={idx} offset={(parseInt(this.props.match.params.page, 10) - 1) * LINKS_PER_PAGE}/>
				))}
			</div>
			{isNewPage &&
		    <div className='tc'>
		      <button onClick={() => this._previousPage()} disabled={!this.state.hasPrevious}>Previous</button>
		      <button onClick={() => this._nextPage()} disabled={!this.state.hasNext}>Next</button>
		    </div>
		    }
		  </div>
		)
	}

	_getLinksToRender = (isNewPage) => {
	    if (isNewPage) {
	      return this.props.allLinksQuery.allLinks
	    }
	    const rankedLinks = this.props.allLinksQuery.allLinks.slice()
	    rankedLinks.sort((l1, l2) => l2.votes.length - l1.votes.length)
	    return rankedLinks.slice(0, 10)
	}

	_nextPage = () => {
	  const page = parseInt(this.props.match.params.page, 10)
	  const maxPage = this.props.allLinksQuery._allLinksMeta.count / LINKS_PER_PAGE
	  const nextPage = page + 1
	  
	  if (nextPage > maxPage) {
	  	this.setState({ hasNext: false, hasPrevious: true })
	  } else {
	  	this.setState({ hasPrevious: true })
	  }

	  if (page < maxPage) {
	    this.props.history.push(`/new/${nextPage}`)
	  }
	}

	_previousPage = () => {
	  const page = parseInt(this.props.match.params.page, 10)
	  const previousPage = page - 1

	  if (previousPage <= 1) {
	  	this.setState({ hasPrevious: false })
	  }

	  if (page > 1) {
	    this.props.history.push(`/new/${previousPage}`)
	  	this.setState({ hasNext: true })
	  }
	}

	_updateCacheAfterVote = (store, createVote, linkId) => {
		const isNewPage = this.props.location.pathname.includes('new')
		const page = parseInt(this.props.match.params.page, 10)
		const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0
		const first = isNewPage ? LINKS_PER_PAGE : 100
		const orderBy = isNewPage ? "createdAt_DESC" : null

		// 1. read `ALL_LINKS_QUERY` from cache using ApolloClient's `readQuery`
		const data = store.readQuery({ query: ALL_LINKS_QUERY, variables: { first, skip, orderBy } })

		// 2. retrieve link that the user just voted
		const votedLink = data.allLinks.find(link => link.id === linkId)

		// 3. assign `votes` from server to votedLink's `votes`
		votedLink.votes = createVote.link.votes

		// 4. take the modified data and write it back into the store (cache)
		store.writeQuery({ query: ALL_LINKS_QUERY, data })
	}

	_subscribeToNewLinks = () => {
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
				// console.log('subscribing to new links', subscriptionData)
				if (!subscriptionData.data) {
					return
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

	_subscribeToNewVotes = () => {
		this.props.allLinksQuery.subscribeToMore({
		  document: gql`
		    subscription {
		      Vote(filter: {
		        mutation_in: [CREATED]
		      }) {
		        node {
		          id
		          link {
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
		          user {
		            id
		          }
		        }
		      }
		    }
		  `,
		  updateQuery: (prev, { subscriptionData }) => {
		  	// console.log('subscribing to new votes', subscriptionData)
			if (!subscriptionData.data) {
				return
			}

		    const votedLinkIndex = prev.allLinks.findIndex(link => link.id === subscriptionData.data.Vote.node.link.id)
		    const link = subscriptionData.data.Vote.node.link
		    const newAllLinks = prev.allLinks.slice()
		    newAllLinks[votedLinkIndex] = link
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
	query AllLinksQuery($first: Int, $skip: Int, $orderBy: LinkOrderBy) {
		allLinks(first: $first, skip: $skip, orderBy: $orderBy) {
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
		_allLinksMeta {
	      count
	    }
	}
`
// use apollo's higher order component `graphql`
export default graphql(ALL_LINKS_QUERY, {
	name: 'allLinksQuery',
	options: (ownProps) => {
	  // parse page from route params
	  const page = parseInt(ownProps.match.params.page, 10)

	  const isNewPage = ownProps.location.pathname.includes('new') || ownProps.location.pathname === '/'
	  const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0
	  const first = isNewPage ? LINKS_PER_PAGE : 100
	  const orderBy = isNewPage ? 'createdAt_DESC' : null
	  return {
	    variables: { first, skip, orderBy }
	  }
	}
})(LinkList)