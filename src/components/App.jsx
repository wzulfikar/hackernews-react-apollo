import React, { Component } from 'react'
import {Switch, Route} from 'react-router-dom'

// import logo from '../logo.svg';
import '../styles/App.css';
import Header from './Header';
import CreateLink from './CreateLink'
import LinkList from './LinkList'
import Login from './Login'
import Search from './Search'

class App extends Component {
  render() {
    return (
      <div className="center w85">
		<Header />
		<div className="ph3 pv1 background-gray">
		<Switch>
			<Route exact path='/' component={LinkList} />
			<Route exact path='/login' component={Login} />
			<Route exact path='/search' component={Search} />
			<Route exact path='/submit' component={CreateLink} />
			<Route component={ () => <div>Page not found :(</div> } />
		</Switch>
		</div>
      </div>
    );
  }
}

export default App;
