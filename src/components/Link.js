import React from 'react'
import {graphql} from 'react-apollo'
import gql from 'graphql-tag'

import {GC_USER_ID} from '../constants'
import {timeDifferenceForDate} from '../utils'

class Link extends React.Component {
	render () {
	    const userId = localStorage.getItem(GC_USER_ID)
		return (
		  <div className='flex mt2 items-start'>
		  	<div className="flex items-center">
				<span className="gray">{this.props.index + 1}. </span>
				{userId && <div className="pointer ml1 gray f11" onClick={() => this._voteForLink()}>▲</div> }
		  	</div>
			{this.props.link && 
		  	<div className="ml1">
				<div>{this.props.link.description} (<a href={this.props.link.url}>{this.props.link.url}</a>)</div>
				<div className="f6 lh-copy gray">
				{this.props.link.votes && `${this.props.link.votes.length} votes | `} 
				by {this.props.link.postedBy ? this.props.link.postedBy.name : 'Unknown'} · {timeDifferenceForDate(this.props.link.createdAt)}
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
			return
		}

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