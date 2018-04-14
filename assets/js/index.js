var React = require('react')
var ReactDOM = require('react-dom')

// TODO: Add proper onclick event
function SortButton(props) {
	function hello(){console.log('Hello!')};
	return (
		<button type="button" onClick={hello}>
			{props.value}
		</button>
	);
}

class SortBar extends React.Component {
    render() {
        return (
			<ul id="sortbar">
			  <li><SortButton value='Recent' /></li>
			  <li><SortButton value='Popular' /></li>
			</ul>
        );
    }
}

function Post(props) {
	return (
		<div className="chunk">
		<div className="media offset-md-0">
		<div className="media-body">
		<div className="entry" >
			{props.text}
		</div>
		</div>
		</div>
		</div>
	);
}


class PostList extends React.Component {
	// renderPost(text) {
	// 	return (
	// 		<Post text={text} />
	// 	);
	// }
	// constructor(props) {
	// 	super(props);
	// }

	render() {
		return (
			<div>
				<Post text="post1" />
				<Post text="post2" />
				<Post text="post3. Hello world!" />
			</div>
		);
	}
}

class App extends React.Component {
	render() {
		return (
			<div>
				<SortBar />
				<PostList />
			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('root'))
