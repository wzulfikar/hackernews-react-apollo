import React from 'react'

class Link extends React.Component {
	render () {
		return (
		  <div>
		  	{ this.props.link && <div>{this.props.link.description} (<a href={this.props.link.url}>{this.props.link.url}</a>)</div> }
		  </div>
		)
	}
}

// _voteForLink = async () => {
// 	// 
// }

export default Link