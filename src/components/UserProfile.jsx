import React, { Component } from 'react'

import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

import { Link } from 'react-router-dom'
import { timeDifferenceForDate } from '../utils'

class UserProfile extends Component {
  username = this.props.match.params.username
  render() {
  	if (this.props.userProfileQuery.loading) {
  		return <div>Loading..</div>
  	}

  	if (!this.props.userProfileQuery.User) {
  		return <div>user not found</div>
  	}

  	const user = this.props.userProfileQuery.User

    return (
      <div className="w85">
		<table className='gray'>
		<tbody>
			<tr>
				<td>user</td>
				<td>:</td>
				<td>{user.username}</td>
			</tr>
			<tr>
				<td>name</td>
				<td>:</td>
				<td>{user.name}</td>
			</tr>
			<tr>
				<td>created</td>
				<td>:</td>
				<td>{ timeDifferenceForDate(user.createdAt) }</td>
			</tr>
			<tr>
				<td>about</td>
				<td>:</td>
				<td>{user.bio || '(Not set)'}</td>
			</tr>
		</tbody>
		</table>
		<div className='mt2'>
			<Link className='db black' to={`/u/${user.username}/submissions`}>submissions</Link>
			<Link className='db black' to={`/u/${user.username}/comments`}>comments</Link>
			<Link className='db black' to={`/u/${user.username}/favorites`}>favorites</Link>
		</div>
      </div>
    );
  }
}

const USER_PROFILE_QUERY = gql`
query userProfileQuery($username:String!) {
	User(username:$username) {
	    name
	    username
	    bio
	    createdAt
	}
}
`

export default graphql(USER_PROFILE_QUERY, {
	name: 'userProfileQuery',
	options: (ownProps) => {
	  const username = ownProps.match.params.username
	  return {
	    variables: { username }
	  }
	}
})(UserProfile);
