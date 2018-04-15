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

class PostEntryForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: '',
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {
		this.setState({value: event.target.value});
	}

	handleSubmit(event) {
		this.setState({value:''});
    	event.preventDefault();
	}

	render() {
		return (
			<form className="posting" onSubmit={this.handleSubmit}>
				<div>
					<textarea
						name="entry"
						id="maintext"
						value={this.state.value}
						onChange={this.handleChange}
						cols="109"
						rows="2"
						autoComplete="off"
						placeholder="What do you want to talk about?"
					/>
					<button
						type="submit"
						id="mainpost"
						onClick={() => this.props.onClick(this.state.value)} >
							Post
					</button>
				</div>
				<br />
			</form>
		);
	}
}

class Post extends React.Component  {
  	render() {
		return (
			<div className="chunk" >
			<div className="media offset-md-0">
			<div className="media-body">
				<div className="entry" onClick={this.props.onClick}>
					{this.props.content}
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
					<button type="button" id="mainpost" >
						Post
					</button>
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
				{ this.props.comments.map((comment) => (
						<Comment
							content={comment.content}
							key={comment.id}
						/>)
					)
				}
			<CommentEntryForm />
			</div>
		);
	}
}

class PostCommentBlock extends React.Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
		this.state = {showing: false};
	}
	handleClick() {
		this.setState({showing : !this.state.showing});
	}
	render() {
		return (
			<div>
				<Post content={this.props.content} onClick={this.handleClick}/>
				{this.state.showing
					? <CommentBlock comments={this.props.comments} />
					: null
				}
			</div>
		);
	}
}

function Spinner() {
	return (
		<div style={{}}>
		<div className="lds-css ng-scope">
		<div style={{width:"100%",height:"100%"}} className="lds-dual-ring">
		<div>
		</div>
		</div>
		</div>
		</div>
	)
}

// TODO: add error handling ('ie could not reach server notification')
class PostList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null,
			isLoaded: false,
			posts: [],
		};
		this.handlePost = this.handlePost.bind(this);
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

	// add a new post
	handlePost(text) {
		fetch("https://tigertalkapi.herokuapp.com/posts/", {
				method: 'POST',
				headers : new Headers(),
				headers: {
					 'Accept': 'application/json',
					 'Content-Type': 'application/json',
				},
				body:JSON.stringify({
					"content":text,
				})
			})
		.then(res => res.json())
		.then((result) => this.setState({posts : [result].concat(this.state.posts)}))
	}

	render() {
		return (
			<div>
			<PostEntryForm onClick={this.handlePost}/>
			{this.state.isLoaded
				? this.state.posts.map((post) =>
	          		<PostCommentBlock
			   			key={post.id}
	                	content={post.content}
						comments={post.comments}
					/>)
				: <Spinner />
	        }
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
