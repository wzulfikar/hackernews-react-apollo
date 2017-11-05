import React, {Component} from 'react'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'

class Header extends Component {
	render () {
		return (
		<div className="flex pa1 justify-between nowrap orange">
			<div className="flex flex-fixed black">
				<Link to='/' className='ml1 no-underline black'>New</Link>
				<div className="ml1">|</div>
				<Link to='/create' className='ml1 no-underline black'>Submit</Link>
			</div>
		</div>
		)
	}
}

export default withRouter(Header)