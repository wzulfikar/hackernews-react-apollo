import React from 'react'

import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import Link from './Link'

class LinkList extends React.Component {
	componentWillMount () {
		if (!this.props.allLinksQuery.loading) {
			this.props.allLinksQuery.refetch()
		}
	}

	render () {
		if (this.props.allLinksQuery && this.props.allLinksQuery.loading) {
		  return <div>Loading</div>
		}

		if (this.props.allLinksQuery && this.props.allLinksQuery.error) {
		  return <div>Error</div>
		}

		const linksToRender = this.props.allLinksQuery.allLinks
		
		return (
		  <div>
		  	{linksToRender.map(link => (
		  		<Link key={link.id} link={link}/>	
		  	))}
		  </div>
		)
	}
}

const ALL_LINKS_QUERY = gql`
	query AllLinksQuery {
		allLinks {
			id
			createdAt
			url
			description
		}
	}
`
// use apollo's higher order component `graphql`
export default graphql(ALL_LINKS_QUERY, {name: 'allLinksQuery'})(LinkList)