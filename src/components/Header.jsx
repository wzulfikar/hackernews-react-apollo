import React, {Component} from 'react'
import { withRouter } from 'react-router'
import { NavLink } from 'react-router-dom'
import {GC_USER_ID, GC_AUTH_TOKEN} from '../constants'

class Header extends Component {
	render () {
		const userId = localStorage.getItem(GC_USER_ID)
		return (
		<div className="flex pa1 justify-between nowrap orange">
			<div className="flex flex-fixed black">
				<NavLink activeClassName='white' to='/new' className='ml1 no-underline black'>new</NavLink>
				<div className="ml1">|</div>
				<NavLink exact activeClassName='white' to='/top' className='ml1 no-underline black'>top</NavLink>
				<div className="ml1">|</div>
				<NavLink exact activeClassName='white' to='/search' className='ml1 no-underline black'>search</NavLink>
				{userId &&
				<div className="flex">
					<div className="ml1">|</div>
					<NavLink exact activeClassName='white' to='/submit' className='ml1 no-underline black'>submit</NavLink>
				</div>
				}
			</div>
			<div className="flex flex-fixed">
				{userId ? 
				<div className='ml1 pointer black' onClick={ () => {
					localStorage.removeItem(GC_USER_ID)
					localStorage.removeItem(GC_AUTH_TOKEN)
					this.props.history.push('/')
				}}>logout</div>
				:
				<NavLink exact activeClassName='white' to='/login' className='ml1 no-underline black'>login</NavLink>
				}
			</div>
		</div>
		)
	}
}

export default withRouter(Header)