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

function PostButton(props) {
	return (
		<button type="button" id="mainpost">Post</button>
	)
}

function CommentButton(props) {
	return (
		<button type="button" id="mainpost">Post</button>
	)
}



class PostEntryForm extends React.Component {
	render() {
		return (
			<form className="posting">
				<div>
					<textarea
						name="entry"
						id="maintext"
						cols="109"
						rows="2"
						autoComplete="off"
						placeholder="What do you want to talk about?"
					/>
					<PostButton />
				</div>
				<br />
			</form>
		);
	}
}

function handleclick() {
	console.log("in handleclick");
	return (
		<CommentBlock />
	);
}

class Post extends React.Component  {

	constructor(props) {
    	super(props);
    	this.state = {
    	  value: null,
    	};
  	}
  	render() {
		return (
			<div className="chunk" onClick={() => this.setState({value: 'X'})}>
				{this.state.value}
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
}

function Comment(props) {
	return (
		<div className="comments">
        <div className="media mt-1">
        <div className="media-body">
            <div className="reply">
				{props.text}
			</div>
        </div>
        </div>
        </div>
	);
}

class CommentEntryForm extends React.Component {
	render() {
		return (
			<form className="replying">
				<div>
					<textarea
						name="entry"
						id="maintext"
						cols="100"
						rows="2"
						autoComplete="off"
						placeholder="Reply"
					/>
					<CommentButton />
				</div>
				<br />
			</form>
		);
	}
}

class CommentBlock extends React.Component {
	render() {
		return (
				<div className='commentBlock'>
					<Comment text = "This is a comment" />
					<CommentEntryForm />
				</div>
		);
	}
}




class PostCommentBlock extends React.Component {
	render() {
		return (
			<div>
				<Post text="Hello world!" /> 
			</div>
		);
	}
}

class PostList extends React.Component {
	render() {
		return (
			<div>
				<PostCommentBlock />
			</div>
		);
	}
}

class App extends React.Component {
	render() {
		return (
			<div>
				<SortBar />
				<PostEntryForm />
				<PostList />
			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('root'))
