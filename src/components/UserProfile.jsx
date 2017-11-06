import React, { Component } from 'react'

import { Link } from 'react-router-dom'
import { timeDifferenceForDate } from '../utils'

class UserProfile extends Component {
  username = this.props.match.params.username
  render() {
    return (
      <div className="w85">
		<table className='gray'>
			<tr>
				<td>user</td>
				<td>:</td>
				<td>{this.username}</td>
			</tr>
			<tr>
				<td>created</td>
				<td>:</td>
				<td>{ timeDifferenceForDate(new Date()) }</td>
			</tr>
			<tr>
				<td>karma</td>
				<td>:</td>
				<td>karma</td>
			</tr>
			<tr>
				<td>about</td>
				<td>:</td>
				<td>karma</td>
			</tr>
		</table>
		<div className='mt2'>
			<Link className='db black' to={`/u/${this.username}/submissions`}>submissions</Link>
			<Link className='db black' to={`/u/${this.username}/comments`}>comments</Link>
			<Link className='db black' to={`/u/${this.username}/favorites`}>favorites</Link>
		</div>
      </div>
    );
  }
}

export default UserProfile;
