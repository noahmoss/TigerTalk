var React = require('react')
var ReactDOM = require('react-dom')
import { Grid, Row, Col } from 'react-bootstrap'
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { ToggleButton, ButtonToolbar, ToggleButtonGroup, DropdownButton, MenuItem, SplitButton } from 'react-bootstrap';
import { FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';
import { Media } from 'react-bootstrap';

// Buttons for sorting posts by recent or popular
class SortBar extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			value: "recent", // recent or popular
			isLoaded : true,
		};
		this.setRecent = this.setRecent.bind(this);
		this.setPopular = this.setPopular.bind(this);
	}
	setRecent() {
		if (this.state.value !== "recent") {
			this.setState({
				value: "recent",
			});
			this.props.toggleSort("recent");
		}
	}
	setPopular() {
		if (this.state.value !== "popular") {
			this.setState({
				value: "popular",
			});
			this.props.toggleSort("popular");
		}
	}
    render() {
		return (

				<div className="sortbar">
					<ButtonToolbar>
					  <ToggleButtonGroup defaultValue={"recent"} type="radio" name="sortbar" >
						<ToggleButton value={"recent"} onClick={this.setRecent} className="sort-button">Recent</ToggleButton>
						<ToggleButton value={"popular"} onClick={this.setPopular} className="sort-button">Popular</ToggleButton>
					  </ToggleButtonGroup>
					</ButtonToolbar>
				</div>


		);

		//	<Refresh_icon onClick={this.props.handleRefresh}/>

    }
}

function Chevron_up(props) {
	return (
		<span className="glyphicon glyphicon-menu-up"
			aria-hidden="true"
			style={{"color":"black", "cursor": "pointer"}}
			onClick = {props.onClick}>
		</span>
	);
}

function Chevron_up_clicked(props) {
	return (
		<span className="glyphicon glyphicon-menu-up"
			aria-hidden="true"
			style={{"color":"darkorange", "cursor": "pointer"}}
			onClick = {props.onClick}>
		</span>
	);
}

function Chevron_down(props) {
	return (
		<span className="glyphicon glyphicon-menu-down"
			aria-hidden="true"
			style={{"color":"black", "cursor": "pointer"}}
			onClick = {props.onClick}>
		</span>
	)
}

function Chevron_down_clicked(props) {
	return (
		<span className="glyphicon glyphicon-menu-down"
			aria-hidden="true"
			style={{"color":"darkorange", "cursor": "pointer"}}
			onClick = {props.onClick}>
		</span>
	)
}

class Speech_bubble extends React.Component {
 	render() {
 		return (
 				<span className="glyphicon glyphicon-comment" aria-hidden="true" style={{"cursor": "pointer"}}></span>
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


function Refresh_icon(props) {
	return (
			<span className="glyphicon glyphicon-refresh" onClick={props.onClick} aria-hidden="true"></span>
	);
}

function timestamp(st) {
		var moment = require('moment');
		var postDatetime = moment(st, moment.ISO_8601);
		var now = moment();
		var timeAgo = now.diff(postDatetime,'seconds');

		if (timeAgo <= 0) {
			var timeUnit = "just now";
		}

		else if (timeAgo == 1) {
			var timeUnit = "second ago";
		}
		else if (timeAgo < 60) {
			var timeUnit = "seconds ago"
		}

		else if (timeAgo < 120) {
			timeAgo = 1;
			var timeUnit = "minute ago"
		}

		else if (timeAgo < 3600) {
			timeAgo = now.diff(postDatetime,'minutes');
			var timeUnit = "minutes ago"
		}

		else if (timeAgo < 7200) {
			timeAgo = 1;
			var timeUnit = "hour ago"
		}

		else if (timeAgo < 86400) {
			timeAgo = now.diff(postDatetime,'hours');
			var timeUnit = "hours ago"
		}

		else if (timeAgo < 172800) {
			timeAgo = 1;
			var timeUnit = "day ago"
		}

		else {
			timeAgo = now.diff(postDatetime,'days');
			var timeUnit = "days ago"
		}

		let date_string = `${timeAgo} ${timeUnit}`;
		if (timeUnit == "just now") {
			date_string = `${timeUnit}`;
		}
	return(date_string);
}

// A single comment
class Comment extends React.Component{
	constructor(props) {
		super(props);
		this.handleUpvoteClick = this.handleUpvoteClick.bind(this);
		this.handleUpvoteUnclick = this.handleUpvoteUnclick.bind(this);
		this.handleDownvoteClick = this.handleDownvoteClick.bind(this);
		this.handleDownvoteUnclick = this.handleDownvoteUnclick.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
		this.handleExpand = this.handleExpand.bind(this);
		this.state = {
			upvoted: this.props.upvoted,
			downvoted: this.props.downvoted,
			votes: this.props.votes,
			expanded: this.props.content.length < 220
		};
	}

	// TODO: think about error handling - i.e. behavior when no server connection
	sendVoteToServer(tag) {
		fetch("/api/comments/"+this.props.id+"/"+tag+"/", {
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

	handleDelete() {
		this.props.handleDelete(this.props.id);
	}


	handleExpand() {
		this.setState({
			expanded : true,
		})
	}
	renderContent() {
		if (this.state.expanded) {
			return (
				this.props.content
			)
		}
		else {
			return (
				<div>
				{this.props.content.slice(0,220) + " "}
				<span className="seemore" onClick={this.handleExpand}>...see more</span>
				</div>
			)
		}
	}


	render() {
		let date_string = timestamp(this.props.date);
		return (
				<div className="replyContainer">
				<div className="replyBody">
				<Media>
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
								}
					</div>
				    </Media.Left>
				    <Media.Body className="wrapTextComment" onClick={this.props.onClick}>
								{this.renderContent()}
				   	</Media.Body>
				   	<Media.Right className="dropdown-container">
							<DropdownButton pullRight
					   			bsSize="small"
					   			title=""
					   			id="dropdown-size-small"
					   		>
								{ this.props.isMine
		 					   		? <MenuItem onClick={this.handleDelete}>Delete</MenuItem>
		 							: <MenuItem>Report</MenuItem>
		 				   		}
							</DropdownButton>
				   	</Media.Right>
				</Media>
				<Media className="replyIconLine">
					<Media.Left>
			      	<div className="iconFirstColumn">
				  	</div>
			    	</Media.Left>
			    	<Media.Body className="commentBody" onClick={this.props.onClick}>
			    	</Media.Body>
			    	<Media.Right className="dateString">
			    		{date_string}
			    	</Media.Right>
			  	</Media>
			  	</div>
			  	</div>
		);
	}
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
			my_upvoted: this.props.my_upvoted,
			my_downvoted: this.props.my_downvoted,
			my_comments: this.props.my_comments,
		}
		this.silentRefreshComments = this.silentRefreshComments.bind(this);
		this.handleComment = this.handleComment.bind(this);
		this.getUserData = this.getUserData.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
	}

	silentRefreshComments() {
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
				this.setState({
					comments: result,
					comment_count: result.length,
				});
			},
		);
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
					my_comments: result.comments,
					my_upvoted: result.posts_upvoted,
					my_downvoted: result.posts_downvoted,
				});
			}
		)
	}

	// add a new comment
	handleComment(text) {
		this.silentRefreshComments();
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
					this.props.handleComment();
					this.setState({
						comments: this.state.comments.concat([result]),
						my_comments: this.state.my_comments.concat(result.id),
					});
				},
				(error) => {
					alert(error);
				}
			)
		}
	}

	// delete a comment by ID
	handleDelete(id) {
		fetch("/api/comments/"+id+"/", {
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
				var newcomments = this.state.comments.filter(
					function(comment) {
						return comment.id !== id;
					});
				this.setState({
					comments : newcomments
				});
				this.props.handleCommentDelete();
			}
		)
	}

	render() {
		return (
			<div className='commentBlock'>
				{ this.state.comments.map((comment) => (
						<Comment
							content={comment.content}
							key={comment.id}
							id={comment.id}
							votes={comment.net_votes}
							date={comment.date_created}
							isMine={this.state.my_comments.includes(comment.id)}
							upvoted={this.state.my_upvoted.includes(comment.id)}
							downvoted={this.state.my_downvoted.includes(comment.id)}
							handleDelete={this.handleDelete}
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
					<Media.Body className = "mb">
						<Button
							type="submit"
							id="post"
							onClick={() => this.props.onClick(this.state.value)}>
						Post
						</Button>
					</Media.Body>
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
		this.handleExpand = this.handleExpand.bind(this);
		this.state = {
			upvoted: this.props.upvoted,
			downvoted: this.props.downvoted,
			votes: this.props.votes,
			expanded: this.props.content.length < 280,
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

	handleExpand() {
		this.setState({
			expanded : true,
		})
	}
	renderContent() {
		if (this.state.expanded) {
			return (
				this.props.content
			)
		}
		else {
			console.log('test');
			return (
				<div>
				{this.props.content.slice(0,280) + " "}
				<span className="seemore" onClick={this.handleExpand}>...see more</span>
				</div>
			)
		}
	}


	render () {
		let date_string = timestamp(this.props.date);

		const postclass = !this.props.color
					  		? ("post")
					    	: ("post2")

		return (
			<div className={postclass}>
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
						}
					 </div>
			    </Media.Left>
			    <Media.Body className="wrapText" onClick={this.props.onClick}>
					{this.renderContent()}
			    </Media.Body>
				<Media.Right className="dropdown-container">
					<DropdownButton pullRight
					   bsSize="small"
					   title=""
					   id="dropdown-size-small"
					   >
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
				    <Media.Left className = "commentNum">
				      {this.props.comment_count}
				    </Media.Left>
				    <Media.Right>
				    </Media.Right>
			    </Media.Body>
			    <Media.Right className = "dateString">
			    	{date_string}
			    </Media.Right>
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
		this.handleComment = this.handleComment.bind(this);
		this.handleCommentDelete = this.handleCommentDelete.bind(this);
		this.refreshComments = this.refreshComments.bind(this);
		this.handleColorClick = this.handleColorClick.bind(this);
		this.state = {
			showing: false, // are the comments showing?
			isUserDataLoaded: true, // is the updated user data loaded?
			isLoaded: true, // are the comments loaded?
			comments: [], // current list of comments
			comment_count: this.props.comment_count,
			my_comments: [],
			my_upvoted: [],
			my_downvoted: [],
			colorclick: false,
		};
	}

	// load comments and user data from API when post is clicked
	handleClick() {
		if(!this.state.showing) {
			// get user data about comments
			this.setState({
				isUserDataLoaded: false,
			})
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
						my_upvoted: result.comments_upvoted,
						my_downvoted: result.comments_downvoted,
						my_comments: result.comments,
						isUserDataLoaded: true,
					});
				}
			)
			this.handleColorClick();
			this.refreshComments();
		}
		else {
			this.handleColorClick();
			this.setState({
				showing: false,
			})
		}
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
	handleComment() {
		this.setState({
			comment_count: this.state.comment_count + 1,
		})
	}
	handleCommentDelete() {
		this.setState({
			comment_count: this.state.comment_count - 1,
		})
	}

	handleColorClick() {
		console.log("hi");
		this.setState({
			colorclick: !this.state.colorclick,
		})
	}
	renderComments() {
		if (this.state.isLoaded) {
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
					  comment_count={this.state.comment_count}
					  date={this.props.date}
					  isMine={this.props.isMine}
					  onClick={this.handleClick}
					  handleDelete={this.handleDelete}
					  color={this.state.colorclick}
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

// Spinner for loading comments
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
			sort : "recent",
			isLoaded: false, // are any posts loaded?
			nextPageLoaded: true, // is the next page loaded?
			morePosts: true, // are there more posts to load?
			posturl: "/api/posts/",
			posts: [], // all post objects
			my_posts: [], // post ids of user's posts
			my_upvoted: [], // post ids of user's upvoted posts
			my_downvoted: [], // post ids of user's downvoted posts
		};
		this.handlePost = this.handlePost.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
		this.getFirstPage = this.getFirstPage.bind(this);
		this.getNextPage = this.getNextPage.bind(this);
		this.reloadPosts = this.reloadPosts.bind(this);
		this.getUserData = this.getUserData.bind(this);
	}

	// fetch current posts and comments upon page load
	componentDidMount() {
		this.getUserData(); // get current data for user
		this.reloadPosts(this.state.posturl); // load posts
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.sort != this.props.sort) {
		 	this.getUserData();
		 	this.reloadPosts();
	 	}
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
					my_upvoted: result.posts_upvoted,
					my_downvoted: result.posts_downvoted,
				});
			}
		)
	}

	reloadPosts() {
		this.setState({
			isLoaded: false,
		})

		let url = "/api/posts" + (this.props.sort === "popular" ? "/popular/" : "/");
		let curr_sort = this.props.sort;

		fetch(url, {
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
				if ((curr_sort === this.props.sort) && !this.state.isLoaded) {
					this.setState({
						isLoaded: true,
						morePosts: result.next !== null,
						posts: result.results,
					});
				} else {
					if (!this.state.isLoaded) {
						this.reloadPosts();
					}
				};
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
		var url = "/api/posts" + (this.props.sort === "popular" ? "/popular/" : "/");
		fetch(url +"?offset="+currentPostCount, {
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
			{
				this.state.isLoaded
				? this.state.posts.map((post) =>
	          		<PostCommentBlock
			   			key={post.id}
						id={post.id}
	                	content={post.content}
						votes={post.net_votes}
						comment_count={post.comments.length}
						date={post.date_created}
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
	    <VisibilitySensor partialVisibility={true} onChange={this.onChange} />
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
				</Nav>
				<Navbar.Text>
					<Navbar.Link href="https://docs.google.com/forms/d/e/1FAIpQLSeO1FP1ghYFiDi2AKrBsEOxu2b_NXowGbxCfrlHXFmm6b1Fug/viewform?usp=pp_url&entry.1782114317"
					target="_blank" style={{ color: '#f3f3f3', textDecoration: 'none' }}>Feedback</Navbar.Link>
				</Navbar.Text>
			    <Nav pullRight>
					<NavItem eventKey={3} href="/accounts/logout">
					  Logout ({netid})
					</NavItem>
			    </Nav>
			  </Navbar.Collapse>
			</Navbar>
		);
	}
}

// Parent class which is rendered in the Django template
class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			recent : true,
		}
		this.toggleSort = this.toggleSort.bind(this);
		// this.handleRefresh = this.handleRefresh.bind(this);
	}

	toggleSort(sort) {
		this.setState({
			recent : sort == "recent" ? true : false,
		});
	}
	// handleRefresh() {
	// 	let curr = this.state.recent;
	// }

	render() {
		return (
			<div>
				<NavBar />
				<MainTitle />
				<SortBar toggleSort={this.toggleSort} handleRefresh={this.handleRefresh}/>
				{
					this.state.recent
					? <PostList sort="recent" />
					: <PostList sort="popular" />
				}
			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('root'))
// ReactDOM.render(<SinglePost />, document.getElementById('root'))
