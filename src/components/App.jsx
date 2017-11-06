import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import { Link } from 'react-router-dom'

// import logo from '../logo.svg';
import '../styles/App.css';
import Header from './Header';
import CreateLink from './CreateLink'
import LinkList from './LinkList'
import Login from './Login'
import Search from './Search'
import UserProfile from './UserProfile'

class App extends Component {
  render() {
    return (
      <div className="center w85">
		<Header />
		<div className="ph3 pv1 background-gray">
		<Switch>
			<Route exact path='/' render={() => <Redirect to='/new/1' />} />
			<Route exact path='/new' render={() => <Redirect to='/new/1' />} />
			<Route exact path='/login' component={Login} />
			<Route exact path='/submit' component={CreateLink} />
			<Route exact path='/search' component={Search} />
			<Route exact path='/top' component={LinkList} />
			<Route exact path='/new/:page' component={LinkList} />
			<Route exact path='/u/:username' component={UserProfile} />
			<Route exact path='/u/:username/submissions' component={() => <div>WIP: submissions component</div>} />
			<Route exact path='/u/:username/comments' component={() => <div>WIP: comments component</div>} />
			<Route exact path='/u/:username/favorites' component={() => <div>WIP: favorites component</div>} />
			<Route component={ () => <div>Page not found. <Link to='/'>Back to home</Link></div> } />
		</Switch>
		</div>
      </div>
    );
  }
}

export default App;
