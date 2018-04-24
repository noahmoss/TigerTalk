var React = require('react')
var ReactDOM = require('react-dom')
import { Grid, Row, Col } from 'react-bootstrap'
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { ButtonToolbar, DropdownButton, MenuItem, SplitButton } from 'react-bootstrap';
import { FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';
import { Media } from 'react-bootstrap';

// TODO: Add proper onclick event
function SortButton(props) {
	function hello(){console.log('Hello!')};
	return (
		<button type="button" onClick={hello}>
			{props.value}
		</button>
	);
}

// Buttons for sorting posts by recent or popular
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

function Chevron_up(props) {
	return (
		<span className="glyphicon glyphicon-chevron-up"
			aria-hidden="true"
			style={{"color":"black"}}
			onClick = {props.onClick}>
		</span>
	);
}

function Chevron_up_clicked(props) {
	return (
		<span className="glyphicon glyphicon-chevron-up"
			aria-hidden="true"
			style={{"color":"darkorange"}}
			onClick = {props.onClick}>
		</span>
	);
}

function Chevron_down(props) {
	return (
		<span className="glyphicon glyphicon-chevron-down"
			aria-hidden="true"
			style={{"color":"black"}}
			onClick = {props.onClick}>
		</span>
	)
}

function Chevron_down_clicked(props) {
	return (
		<span className="glyphicon glyphicon-chevron-down"
			aria-hidden="true"
			style={{"color":"darkorange"}}
			onClick = {props.onClick}>
		</span>
	)
}

class Speech_bubble extends React.Component {
 	render() {
 		return (
 				<span className="glyphicon glyphicon-comment" aria-hidden="true"></span>
		);
	}
}

class Share_icon extends React.Component {
 	render() {
 		return (
 				<span className="glyphicon glyphicon-send" aria-hidden="true"></span>
		);
	}
}

// A single comment
function Comment(props) {
	return (
			<div className="replyContainer">
			<div className="reply">
			<Media>
			    <Media.Left>
			      <div>
			      <Chevron_up />
			      10
				  <Chevron_down />
				  </div>
			    </Media.Left>
			    <Media.Body onClick={props.onClick}>
					{props.content}
			    </Media.Body>
				<Media.Right className="dropdown-container">
				<DropdownButton pullRight
				   bsSize="small"
				   title=""
				   id="dropdown-size-small"
				   >
				   <MenuItem eventKey="1">Report</MenuItem>
				   <MenuItem divider />
				   <MenuItem eventKey="3">Delete</MenuItem>
				</DropdownButton>
			    </Media.Right>
			</Media>
        	</div>
        	</div>
	);
}

// The textarea and reply button underneath every group of comments
class CommentEntryForm extends React.Component {
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
			<div className="container-fluid" id="commentContainer">
			<form className="replying" onSubmit={this.handleSubmit}>
				  <FormControl componentClass="textarea"
				  			  className="replyBox"
							  name="reply"
							  id="maintext"
							  value={this.state.value}
							  onChange={this.handleChange}
							  cols="109"
							  rows="2"
							  autoComplete="off"
							  maxLength="1000"
							  placeholder="Reply"/>
					<Button
						type="submit"
						id="post"
						onClick={() => this.props.onClick(this.state.value)}>
					Post
					</Button>
			</form>
			</div>
		);
	}
}

// A block of comments and associated entry form
class CommentBlock extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			comments: this.props.comments,
		}
		this.handleComment = this.handleComment.bind(this);
	}

	// add a new comment
	handleComment(text) {
		if (text.trim() != ''){
			fetch("/api/comments/", {
					method: 'POST',
					credentials: "same-origin",
					headers : new Headers(),
					headers: {
						 "X-CSRFToken": csrftoken,
						 'Accept': 'application/json',
						 'Content-Type': 'application/json',
					},
					body:JSON.stringify({
						"content":text,
						"post":this.props.id,
					})
				})
			.then(res => res.json())
			.then(
				(result) => {
					this.setState({
						comments: this.state.comments.concat([result]),
					});
				},
				(error) => {
					alert(error);
				}
			)
		}
	}

	render() {
		return (
			<div className='commentBlock'>
				{ this.state.comments.map((comment) => (
						<Comment
							content={comment.content}
							key={comment.id}
						/>)
					)
				}
			<CommentEntryForm onClick={this.handleComment}/>
			</div>
		);
	}
}

// The textarea and reply button for creating new posts
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
			<div className="container-fluid" id="postContainer">
			<form onSubmit={this.handleSubmit}>
			<div className="post-container">
				  <FormControl componentClass="textarea"
				  			className="posting"
							  name="entry"
							  id="maintext"
							  value={this.state.value}
							  onChange={this.handleChange}
							  cols="109"
							  rows="2"
							  autoComplete="off"
							  maxLength="1000"
							  placeholder="What do you want to talk about?"/>
					<Button
						type="submit"
						id="post"
						onClick={() => this.props.onClick(this.state.value)}>
					Post
					</Button>
			</div>
			</form>
			</div>
		);
	}
}


class Post extends React.Component{
	constructor(props) {
		super(props);
		this.handleUpvoteClick = this.handleUpvoteClick.bind(this);
		this.handleUpvoteUnclick = this.handleUpvoteUnclick.bind(this);
		this.handleDownvoteClick = this.handleDownvoteClick.bind(this);
		this.handleDownvoteUnclick = this.handleDownvoteUnclick.bind(this);
		this.state = {
			upvoted: this.props.upvoted,
			downvoted: this.props.downvoted,
			votes: this.props.votes,
		};
	}

	// TODO: think about error handling - i.e. behavior when no server connection
	sendVoteToServer(tag) {
		fetch("/api/posts/"+this.props.id+"/"+tag+"/", {
			method: 'GET',
			credentials: "same-origin",
			headers : new Headers(),
			headers: {
				 "X-CSRFToken": csrftoken,
				 'Accept': 'application/json',
				 'Content-Type': 'application/json',
			},
		})
	}

	// voting logic
	handleUpvoteClick() {
		if (this.state.upvoted) {
			return;
		}
		else if (this.state.downvoted) {
			this.setState({
				upvoted : true,
				downvoted : false,
				votes : this.state.votes + 2,
			})
		}
		else {
			this.setState({
				upvoted : true,
				votes : this.state.votes + 1
			})
		}
		this.sendVoteToServer("u");
	}
	handleUpvoteUnclick() {
		if (!this.state.upvoted) {
			return;
		}
		else {
			this.setState({
				upvoted : false,
				votes : this.state.votes - 1,
			})
		}
		this.sendVoteToServer("c");
	}
	handleDownvoteClick() {
		if (this.state.downvoted) {
			return;
		}
		else if (this.state.upvoted) {
			this.setState({
				downvoted : true,
				upvoted : false,
				votes : this.state.votes - 2,
			})
		}
		else {
			this.setState({
				downvoted : true,
				votes : this.state.votes - 1
			})
		}
		this.sendVoteToServer("d");
	}
	handleDownvoteUnclick() {
		if (!this.state.downvoted) {
			return;
		}
		else {
			this.setState({
				downvoted : false,
				votes : this.state.votes + 1,
			})
		}
		this.sendVoteToServer("c");
	}

	render () {
		return (
			<div className="post">
			  <Media className="mainBody">
			    <Media.Left>
			    	<div className="arrowBox">
						{
							this.state.upvoted
							? <Chevron_up_clicked onClick={this.handleUpvoteUnclick}/>
							: <Chevron_up onClick={this.handleUpvoteClick}/>
						}
			    			{this.state.votes}

						{
							this.state.downvoted
							? <Chevron_down_clicked onClick={this.handleDownvoteUnclick}/>
							: <Chevron_down onClick={this.handleDownvoteClick}/>
						}				 	 </div>
			    </Media.Left>
			    <Media.Body onClick={this.props.onClick}>
					{this.props.content}
			    </Media.Body>
				<Media.Right className="dropdown-container">
					<DropdownButton pullRight
					   bsSize="small"
					   title=""
					   id="dropdown-size-small"
					   >
					   <MenuItem>Follow</MenuItem>
					   { this.props.isMine
					   		? <MenuItem onClick={this.props.handleDelete}>Delete</MenuItem>
							: <MenuItem>Report</MenuItem>
				   		}
					</DropdownButton>
				   </Media.Right>
			  </Media>
			  <Media className="rip">
			    <Media.Left>
			      <div className="iconFirstColumn">
				  </div>
			    </Media.Left>
			    <Media.Body onClick={this.props.onClick}>
					<Media.Left>
				      <Speech_bubble />
				    </Media.Left>
				    <Media.Right>
				    	<Share_icon />
				    </Media.Right>
			    </Media.Body>
			  </Media>
		  </div>
		);
	}
}

// A post and its associated comments
class PostCommentBlock extends React.Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
		this.state = {
			showing: false, // are the comments showing?
			isLoaded: true, // are the comments loaded?
			comments: [], // current list of comments
		};
	}
	// load comments from API when post is clicked
	handleClick() {
		if(!this.state.showing) {
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
					this.setState({
						isLoaded: true,
						showing: true,
						comments: result.results,
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
		else {
			this.setState({
				showing: false,
			})
		}

	}
	handleDelete() {
		this.props.handleDelete(this.props.id);
	}
	renderComments() {
		if (this.state.isLoaded) {
			return (
				<CommentBlock id={this.props.id}
							comments={this.state.comments}
							my_comments={this.props.my_comments} />
			);
		}
		else {
			return (<LilSpinner />);
		}
	}
	render() {
		return (
			<div>
				<Post id={this.props.id}
					  content={this.props.content}
					  votes={this.props.votes}
					  upvoted={this.props.upvoted}
					  downvoted={this.props.downvoted}
					  isMine={this.props.isMine}
					  onClick={this.handleClick}
					  handleDelete={this.handleDelete}
					  />
				{
					this.state.showing
					? this.renderComments()
					: null
				}
			</div>
		);
	}
}

// Spinner for loading posts
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

function LilSpinner() {
	return (
		<div style={{}}>
		<div className="lds-css ng-scope">
		<div style={{width:"100%",height:"100%"}} className="lds-dual-ring2">
		<div>
		</div>
		</div>
		</div>
		</div>
	);
}

// get csrf token from cookies
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

// The main list of posts and associated post entry form (above it)
// TODO: add error handling ('could not reach server' notification)
class PostList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null,
			isLoaded: false, // are any posts loaded?
			nextPageLoaded: true, // is the next page loaded?
			morePosts: true, // are there more posts to load?
			posts: [], // all post objects
			my_posts: [], // post ids of user's posts
			my_upvoted: [], // post ids of user's upvoted posts
			my_downvoted: [], // post ids of user's downvoted posts
		};
		this.handlePost = this.handlePost.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
		this.getFirstPage = this.getFirstPage.bind(this);
		this.getNextPage = this.getNextPage.bind(this);
	}

	// fetch current posts and comments upon page load
	componentDidMount() {
		// Get user data on page load
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
						my_upvoted: result.posts_upvoted,
						my_downvoted: result.posts_downvoted,
					});
				}
			)

		// Get initial post data on page load
		fetch("/api/posts/", {
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
					isLoaded: true,
					morePosts: result.next !== null,
					posts: result.results,
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

	// get first page of post results and update current post list
	 getFirstPage() {
		fetch("/api/posts/", {
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
				// slice new posts and add to front of current post list
				let loadedPosts = result.results;
				for (let i = 0; i < loadedPosts.length; i++) {
					if (loadedPosts[i].id === this.state.posts[0].id) {
						var newPostsCount = i;
						break;
					}
				}
				let newPosts = loadedPosts.slice(0,newPostsCount);
				this.setState({
					posts : newPosts.concat(this.state.posts),
				});
			},
			(error) => {
				this.setState({
					error
				});
			}
		)
	}

	// load the next page of posts from server and add to current post list
	getNextPage() {
		// don't try to fetch posts if there are no more
		if (this.state.morePosts === false) {
			return;
		}

		// set state to trigger loading icon
		this.setState({
			nextPageLoaded : false,
		})

		let currentPostCount = this.state.posts.length;
		fetch("/api/posts/?offset="+currentPostCount, {
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
				var nextPage = result.results;
				for (let i = 0; i < nextPage.length; i++) {
					if (nextPage[i].id < this.state.posts[this.state.posts.length-1].id) {
						var firstNewPostIndex = i;
						break;
					}
				}
				this.setState({
					nextPageLoaded: true,
					morePosts: result.next !== null,
					posts: this.state.posts.concat(nextPage.slice(firstNewPostIndex)),
				});
			},
			(error) => {
				this.setState({
					nextPageLoaded: true,
					error
				});
			}
		)
	}

	// add a new post
	handlePost(text) {
		if (text.trim() != ''){
			fetch("/api/posts/", {
					method: 'POST',
					credentials: "same-origin",
					headers : new Headers(),
					headers: {
						 "X-CSRFToken": csrftoken,
						 'Accept': 'application/json',
						 'Content-Type': 'application/json',
					},
					body:JSON.stringify({
						"content":text,
					})
				})
			.then(res => res.json())
			.then(
				(result) => {
					this.setState({
						posts : [result].concat(this.state.posts),
						my_posts : [result.id].concat(this.state.my_posts),
					});
				},
				(error) => {
					alert(error);
				}
			)
		}
	}

	// delete a post by ID
	handleDelete(id) {
		fetch("/api/posts/"+id+"/", {
				method: 'DELETE',
				credentials: "same-origin",
				headers : new Headers(),
				headers: {
					 "X-CSRFToken": csrftoken,
					 'Accept': 'application/json',
					 'Content-Type': 'application/json',
				},
			}
		)
		.then(
			(result) => {
				var newposts = this.state.posts.filter(
					function(post) {
						return post.id !== id;
					});
				this.setState({
					posts : newposts
				});
			}
		)
	}

	render() {
		return (
			<div>
			<PostEntryForm onClick={this.handlePost}/>
			<div onClick={this.getFirstPage} style={{"text-align":"center"}}>Refresh</div>
			{
				this.state.isLoaded
				? this.state.posts.map((post) =>
	          		<PostCommentBlock
			   			key={post.id}
						id={post.id}
	                	content={post.content}
						votes={post.net_votes}
						comments={post.comments}
						isMine={this.state.my_posts.includes(post.id)}
						upvoted={this.state.my_upvoted.includes(post.id)}
						downvoted={this.state.my_downvoted.includes(post.id)}
						handleDelete={this.handleDelete}
						 />)
				: null
	        }
			{
				this.state.isLoaded && this.state.nextPageLoaded
				? <InfiniteScroll
					morePosts={this.state.morePosts}
					getNextPage={this.getNextPage} />
				: <Spinner />
			}
			</div>
		);
	}
}

class InfiniteScroll extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			morePosts : this.props.morePosts,
		}
		this.onChange = this.onChange.bind(this);
	}

	onChange(isVisible) {
		if (isVisible) {
			this.props.getNextPage();
		}
	}

	render () {
	  var VisibilitySensor = require('react-visibility-sensor');

	  if (!this.state.morePosts) {
		  return(
			  <div className="no-more-posts">
		  			No more posts!
				</div>
			);
	  }

	  return (
	    <VisibilitySensor onChange={this.onChange} />
	  );
	}
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
			<Navbar fixedTop collapseOnSelect>
			  <Navbar.Header>
			    <Navbar.Toggle />
			  </Navbar.Header>
			  <Navbar.Collapse>
			  	<Nav pullLeft>
					<NavItem eventKey={1} href="#">
					  About
					</NavItem>
					<NavItem eventKey={2} href="#">
					  Feedback
					</NavItem>
				</Nav>
			    <Nav pullRight>
					<NavItem eventKey={1} href="#">
					  Account ({netid})
					</NavItem>
					<NavItem eventKey={3} href="/accounts/logout">
					  Logout
					</NavItem>
			    </Nav>
			  </Navbar.Collapse>
			</Navbar>
		);
	}
}

// Parent class which is rendered in the Django template
class App extends React.Component {
	render() {
		return (
			<div>
				<NavBar />
				<MainTitle />
				<SortBar />
				<PostList />
			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('root'))
