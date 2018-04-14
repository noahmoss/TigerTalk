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

function Comment(props) {
	return (
		<div className="comments">
        <div className="media mt-1">
        <div className="media-body">
            <div className="reply">
				{props.content}
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
					<PostButton />
				</div>
				<br />
			</form>
		);
	}
}

class CommentBlock extends React.Component {
	render() {
		console.log(this.props.comments);
		return (
			<div className='commentBlock'>
				{this.props.comments.map((comment) =>
					(
						<Comment
							content={comment.content}
							key={comment.id}
						/>
					)
				)
			}
			<CommentEntryForm />
			</div>
		);
	}
}

class PostCommentBlock extends React.Component {
	render() {
		return (
			<div>
				<Post text={this.props.content} />
				<CommentBlock comments={this.props.comments} />
			</div>
		);
	}
}

class PostList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null,
			isLoaded: false,
			posts: []
		};
	}

	// fetch current posts and comments upon page load
	componentDidMount() {
		fetch("https://tigertalkapi.herokuapp.com/posts/")
		.then(res => res.json())
		.then(
			(result) => {
				this.setState({
					isLoaded: true,
					posts: result.reverse(),
				});
			},
			(error) => {
				this.setState({
					isLoaded: true,
					error
				});
			}
		)
	}
	render() {
		return (
			<div>
			{this.state.posts.map((post) =>
          		<PostCommentBlock
		   			key={post.id}
                	content={post.content}
					comments={post.comments}
				/>
	        )}
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
