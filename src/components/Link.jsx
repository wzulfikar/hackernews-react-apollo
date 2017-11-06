import React from 'react'
import {graphql} from 'react-apollo'
import gql from 'graphql-tag'
import { Link as ReactLink } from 'react-router-dom'

import {GC_USER_ID} from '../constants'
import { noty, timeDifferenceForDate, strLimit } from '../utils'

class Link extends React.Component {
	state = {
		loading: false
	}
	render () {
	    const userId = localStorage.getItem(GC_USER_ID)
		return (
		  <div className='flex mt2 items-start'>
		  	<div className="flex items-center">
				<span className="gray">{this.props.index + 1 + (this.props.offset || 0)}. </span>
				{userId && <div className="pointer ml1 gray f11" onClick={() => this._voteForLink()}>{this.state.loading ? '...' : '▲'}</div> }
		  	</div>
			{this.props.link && 
		  	<div className="ml1">
				<div>
  					<span className='pointer' title={this.props.link.url} onClick={ () => window.location.href = this.props.link.url }>{this.props.link.description}</span>
  					&nbsp;<a className='gray no-underline f6' href={this.props.link.url}>({strLimit(this.props.link.url, 30)})</a>
				</div>
				<div className="lh-copy gray" style={{ fontSize: '0.7em' }}>
				{this.props.link.votes && `${this.props.link.votes.length} points ∙ `} 
				by {this.props.link.postedBy && this.props.link.postedBy.username  ? <ReactLink className='gray' to={`/u/${this.props.link.postedBy.username}`}>{this.props.link.postedBy.username}</ReactLink> : 'unknown'} {timeDifferenceForDate(this.props.link.createdAt)}
				</div>
		  	</div>
			}
		  </div>
		)
	}

	_voteForLink = async () => {
		const userId = localStorage.getItem(GC_USER_ID)
		const voterIds = this.props.link.votes.map(vote => vote.user.id)
		if (voterIds.includes(userId)) {
			console.log(`User (${userId}) already voted for this link`)
			noty('You already voted for this link', 'error').show()
			return
		}

		this.setState({loading: true})

		const linkId = this.props.link.id
		await this.props.createVoteMutation({
			variables: {
				userId,
				linkId,
			},
			// use Apollo’s imperative store API `update`.
			// 1. `update` is called on server response. 
			// 	  It receives payload of the mutation (data) and current cache (store)
			// 2. `createVote` is destructured from the server response
			update: (store, { data: {createVote}}) => {
				console.log("updating votes..");
				this.props.updateStoreAfterVote(store, createVote, linkId)
				this.setState({loading: false})
			}
		})
	}
}

const CREATE_VOTE_MUTATION = gql`
mutation CreateVoteMutation($userId: ID!, $linkId: ID!) {
	createVote(userId: $userId, linkId: $linkId) {
		id
		link {
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
`

// _voteForLink = async () => {
// 	// 
// }

export default graphql(CREATE_VOTE_MUTATION, {name: 'createVoteMutation'})(Link)