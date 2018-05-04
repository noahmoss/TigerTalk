var React = require('react')
var ReactDOM = require('react-dom')
import { Navbar, Nav, NavItem } from 'react-bootstrap';
// import { PostCommentBlock, Post } from './index.js'

// get csrf token from cookies
// from https://stackoverflow.com/questions/35112451/forbidden-csrf-token-missing-or-incorrect-django-error
function getCookie(name) {
	var cookieValue = null;
	if (document.cookie && document.cookie !== '') {
		var cookies = document.cookie.split(';');
		for (var i = 0; i < cookies.length; i++) {
			var cookie = jQuery.trim(cookies[i]);
			if (cookie.substring(0, name.length + 1) === (name + '=')) {
				cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
				break;
			}
		}
	}
	return cookieValue;
}
var csrftoken = getCookie("csrftoken");

// The post and its associated comments
class PostCommentBlock extends React.Component {
	constructor(props) {
		super(props);
		this.handleDelete = this.handleDelete.bind(this);
		this.handleComment = this.handleComment.bind(this);
		this.handleCommentDelete = this.handleCommentDelete.bind(this);
		this.refreshComments = this.refreshComments.bind(this);
		this.loadNewComments = this.loadNewComments.bind(this);
		this.toggleRefresh = this.toggleRefresh.bind(this);
		this.getUserData = this.getUserData.bind(this);
		this.state = {
			showing: true, // are the comments showing?
			isUserDataLoaded: true, // is the updated user data loaded?
			isLoaded: true, // are the comments loaded?
			comments: this.props.comments, // current list of comments
			comment_count: this.props.comment_count,
			my_comments: [],
			my_upvoted: [],
			my_downvoted: [],
			colorclick: true,
		};
	}

	componentDidMount() {
		this.toggleRefresh(true);
	}

	// toggle auto-refresh
	toggleRefresh(start) {
		if (!start) {
			clearInterval(this.commentTimer);
		}
		else {
			this.commentTimer = setInterval(
				() => this.loadNewComments(),
				5000 // 5 seconds
			);
		}
	}

	// get user comment data
	getUserData() {
		fetch("/api/users/"+userid+"/", {
			method: 'GET',
			credentials: "same-origin",
			headers : new Headers(),
			headers: {
				 "X-CSRFToken": csrftoken,
				 'Accept': 'application/json',
				 'Content-Type': 'application/json',
			},
		})
		.then(res => res.json())
		.then(
			(result) => {
				this.setState({
					my_posts: result.posts,
					my_comments: result.comments,
					my_upvoted: result.comments_upvoted,
					my_downvoted: result.comments_downvoted,
				});
			}
		)
	}

	loadNewComments() {
		this.getUserData();

		fetch("/api/posts/"+this.props.id+"/comments/", {
			method: 'GET',
			credentials: "same-origin",
			headers : new Headers(),
			headers: {
				 "X-CSRFToken": csrftoken,
				 'Accept': 'application/json',
				 'Content-Type': 'application/json',
			},
		})
		.then(res => res.json())
		.then(
			(result) => {
				let loadedComments = result;
				this.setState({
					comments : loadedComments,
					comment_count: loadedComments.length,
				});
			},
			(error) => {
				this.setState({
					error
				});
			}
		)

	}

	refreshComments() {
		this.setState({showing: true, isLoaded: false});
		fetch("/api/posts/"+this.props.id+"/comments/", {
			method: 'GET',
			credentials: "same-origin",
			headers : new Headers(),
			headers: {
				 "X-CSRFToken": csrftoken,
				 'Accept': 'application/json',
				 'Content-Type': 'application/json',
			},
		})
		.then(res => res.json())
		.then(
			(result) => {
				if (this.state.isUserDataLoaded) {
					this.setState({
						isLoaded: true,
						comments: result,
						comment_count: result.length,
					});
				} else {
					this.refreshComments();
				}
			},
			(error) => {
				this.setState({
					isLoaded: true,
					error
				});
			}
		)
	}

	handleDelete() {
		this.props.handleDelete(this.props.id);
	}

	handleComment(id) {
		var newMyComments = this.state.my_comments.concat(id);
		this.setState({
			comment_count: this.state.comment_count + 1,
			my_comments: newMyComments,
		})
	}

	handleCommentDelete(id) {
		var commentsWithoutDeleted = this.state.comments;
		for (let i = 0; i < this.state.comments.length; i++) {
			if (this.state.comments[i].id == id) {
				commentsWithoutDeleted.splice(i, 1);
				break;
			}
		}
		this.setState({
			comments: commentsWithoutDeleted,
			comment_count: this.state.comment_count - 1,
		})
	}

	// handleColorClick() {
	// 	this.setState({
	// 		colorclick: !this.state.colorclick,
	// 	})
	// }
	renderComments() {
			return (
				<CommentBlock id={this.props.id}
							comments={this.state.comments}
							my_comments={this.state.my_comments}
							my_upvoted={this.state.my_upvoted}
							my_downvoted={this.state.my_downvoted}
							handleComment={this.handleComment}
							handleCommentDelete={this.handleCommentDelete}/>
			);
	}
	render() {
		return (
			<div>
				<Post id={this.props.id}
					  content={this.props.content}
					  votes={this.props.votes}
					  upvoted={this.props.upvoted}
					  downvoted={this.props.downvoted}
					  comment_count={this.state.comment_count}
					  date={this.props.date}
					  isMine={this.props.isMine}
					  handleDelete={this.handleDelete}
					  onClick={this.handleClick}
					  color={this.state.colorclick}
					  />

					<div>
						{this.renderComments()}
					</div>
			</div>
		);
	}
}


// Spinner for loading post
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
	);
}

class MainTitle extends React.Component {
	render() {
		return (
				<h3 className="header">TigerTalk</h3>
		);
	}
}

class NavBar extends React.Component {
	render() {
		return (
			<Navbar fixedTop collapseOnSelect fluid>
			  <Navbar.Header>
			    <Navbar.Toggle />
			  </Navbar.Header>
			  <Navbar.Collapse>
			  	<Nav pullLeft>
					<NavItem style={{ fontFamily: 'Quicksand' }} eventKey={1} href="/">
						Home
					</NavItem>
				</Nav>
				<Navbar.Text>
					<Navbar.Link href="https://docs.google.com/forms/d/e/1FAIpQLSeO1FP1ghYFiDi2AKrBsEOxu2b_NXowGbxCfrlHXFmm6b1Fug/viewform?usp=pp_url&entry.1782114317"
					target="_blank" style={{ color: 'black', textDecoration: 'none', fontFamily: 'Quicksand' }}>Feedback</Navbar.Link>
				</Navbar.Text>
			    <Nav pullRight>
					<NavItem eventKey={3} style={{ fontFamily: 'Quicksand' }} href="/accounts/logout">
					  Logout ({netid})
					</NavItem>
			    </Nav>
			  </Navbar.Collapse>
			</Navbar>
		);
	}
}

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoaded: false,
			exists: false,
			deleted: false,
			post: null,
			my_posts: [],
			my_comments: [],
			my_upvoted: [],
			my_downvoted: [],
			my_upvoted_comments: [],
			my_downvoted_comments: [],
		};
		this.getUserData = this.getUserData.bind(this);
		this.getPostData = this.getPostData.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
	}

	componentDidMount() {
		this.getUserData();
		this.getPostData();
	}

	getUserData() {
		fetch("/api/users/"+userid+"/", {
			method: 'GET',
			credentials: "same-origin",
			headers : new Headers(),
			headers: {
				 "X-CSRFToken": csrftoken,
				 'Accept': 'application/json',
				 'Content-Type': 'application/json',
			},
		})
		.then(res => res.json())
		.then(
			(result) => {
				this.setState({
					my_posts: result.posts,
					my_comments: result.comments,
					my_upvoted: result.posts_upvoted,
					my_downvoted: result.posts_downvoted,
					my_upvoted_comments: result.comments_upvoted,
					my_downvoted_comments: result.comments_downvoted,
				});
			}
		)
	}

	getPostData() {
		fetch("/api/posts/"+postid+"/", {
			method: 'GET',
			credentials: "same-origin",
			headers : new Headers(),
			headers: {
				 "X-CSRFToken": csrftoken,
				 'Accept': 'application/json',
				 'Content-Type': 'application/json',
			},
		})
		.then(res => res.json())
		.then(
			(result) => {
				this.setState({
					exists: true,
					isLoaded: true,
					post: result,
				});
			},
			(error) => {
				this.setState({
					exists: false,
					isLoaded: true,
				})
			}
		)
	}

	handleDelete() {
		console.log("Deleting");
	}

	renderPostCommentBlock() {
		if (!this.state.isLoaded) {
			return (
				<Spinner />
			)
		};
		if (this.state.exists) {
			return (
				<PostCommentBlock
					id={this.state.post.id}
					content={this.state.post.content}
					votes={this.state.post.net_votes}
					comment_count={this.state.post.comments.length}
					comments={this.state.post.comments}
					date={this.state.post.date_created}
					isMine={this.state.my_posts.includes(this.state.post.id)}
					upvoted={this.state.my_upvoted.includes(this.state.post.id)}
					downvoted={this.state.my_downvoted.includes(this.state.post.id)}
					handleDelete={this.handleDelete}
				/>
			)
		};
		if (this.state.deleted) {
			return (<div>Post deleted.</div>)
		} else {
			return (<div> Post could not be found! </div>)
		}
	}

	render() {
		return (
			<div>
				<NavBar />
				<MainTitle />
				{this.renderPostCommentBlock()}
			</div>
		)
	}
}

ReactDOM.render(<App />, document.getElementById('root'))
