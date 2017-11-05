import React, {Component} from 'react'

import {GC_USER_ID, GC_AUTH_TOKEN} from '../constants'

class Login extends Component {
	state = {
		login: true,
		email: '',
		password: '',
		name: '',
	}
	render() {
	  return (
		<div>
			<h4 className="mv3">{this.state.login ? 'Login' : 'Sign Up'}</h4>
			<div className="flex flex-column">
			{!this.state.login && 
			<input type="text"
				value={this.state.name}
				onChange={(e) => this.setState({name: e.target.value})}
				placeholder='Your name'
			/>}
			<input type="text"
				value={this.state.email}
				onChange={(e) => this.setState({email: e.target.value})}
				placeholder='Your email address'
			/>
			<input type="password"
				value={this.state.password}
				onChange={(e) => this.setState({password: e.target.value})}
				placeholder='Choose a safe password'
			/>
			</div>
			<div className="flex mt3">
				<div 
					className="pointer mr2 button"
					onClick={() => this._confirm()}
				>
				{this.state.login ? 'Login' : 'Create account'}
				</div>
				<div className="pointer button"
					onClick={() => this.setState({ login: !this.state.login})}>
				{this.state.login ? 'Need to create account?' : 'Already have an account?'}
				</div>
			</div>
		</div>
	  )
	}

	_confirm = async () => {
		// 
	}

	_saveUserData = (id, token) => {
		localStorage.setItem(GC_USER_ID, id)
		localStorage.setItem(GC_AUTH_TOKEN, token)
	}
}

export default Login