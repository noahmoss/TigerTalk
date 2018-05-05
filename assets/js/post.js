var React = require('react')
var ReactDOM = require('react-dom')
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { ToggleButton, ButtonToolbar, ToggleButtonGroup, DropdownButton, MenuItem, SplitButton } from 'react-bootstrap';
import { FormGroup, ControlLabel, FormControl, Button, Collapse } from 'react-bootstrap';
import { Media } from 'react-bootstrap';

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
			style={{"color":"#F19143", "cursor": "pointer"}}
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
			style={{"color":"#F19143", "cursor": "pointer"}}
			onClick = {props.onClick}>
		</span>
	)
}

class Speech_bubble extends React.Component {
 	render() {
 		return (
 				<span className="glyphicon glyphicon-comment" aria-hidden="true" style={{"cursor": "default"}}></span>
		);
	}
}

function timestamp(st) {
		var moment = require('moment');
		var postDatetime = moment(st, moment.ISO_8601);
		var now = moment();
		var timeAgo = now.diff(postDatetime,'seconds');

		if (timeAgo < 60) {
			var timeUnit = "just now";
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
		this.cutoffContent = this.cutoffContent.bind(this);
		this.state = {
			upvoted: this.props.upvoted,
			downvoted: this.props.downvoted,
			votes: this.props.votes,
			needsExpansion: (this.props.content.length > 280
							|| this.props.content.split(/\r\n|\r|\n/).length > 3),
			expanded: false, // if the comment needs expansion, is it expanded?
			reported: false,
		};
	}

	componentWillReceiveProps(nextProps) {
		if(this.props.upvoted != nextProps.upvoted) {
			this.setState({
				upvoted: nextProps.upvoted,
				downvoted: nextProps.downvoted,
			});
		}
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

	handleExpand(e) {
		this.setState({
			expanded : !this.state.expanded,
		})
	}

	// prevent dropdown close when clicking 'report'
	// code from https://github.com/react-bootstrap/react-bootstrap/issues/1490
	dropdownToggle(newValue){
	    if (this._forceOpen){
	        this.setState({ menuOpen: true });
	        this._forceOpen = false;
	    } else {
	        this.setState({ menuOpen: newValue });
	    }
	}
	menuItemClickedThatShouldntCloseDropdown(){
	    this._forceOpen = true;

		fetch("/api/comments/"+this.props.id+"/r/", {
			method: 'GET',
			credentials: "same-origin",
			headers : new Headers(),
			headers: {
				 "X-CSRFToken": csrftoken,
				 'Accept': 'application/json',
				 'Content-Type': 'application/json',
			},
		});

		this.setState({
			reported: true,
		});
	}

	// cut off content to 3 lines or 280 chars, whichever is fewer
	cutoffContent(content) {
		let newContent = content;
		if (newContent.split(/\r\n|\r|\n/).length > 3) {
			newContent = newContent.split(/\r\n|\r|\n/).slice(0,3).join('\n');
		}
		return newContent.slice(0,280)
	}
	renderContent() {
		let content = this.state.expanded
							? this.props.content + " "
							: this.cutoffContent(this.props.content) + " "


		return (
				this.state.needsExpansion
				? ( this.state.expanded
					? (<div>{content}<span className="seemore" onClick={this.handleExpand}>see less</span></div>)
					: (<div>{content}<span className="seemore" onClick={this.handleExpand}>...see more</span></div>)
				  )
			    : content
		);
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
								className="commentDropdown"
					   			bsSize="small"
					   			title=""
					   			id="dropdown-size-small"
								open={this.state.menuOpen}
								onToggle={val => this.dropdownToggle(val)}
					   		>
								{ this.props.isMine
									? <MenuItem onClick={this.handleDelete}>Delete</MenuItem>
									: (this.state.reported
										? <MenuItem>Reported ✔</MenuItem>
										: <MenuItem onClick={() => this.menuItemClickedThatShouldntCloseDropdown()}>Report</MenuItem>)
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
		this.onKeyDown = this.onKeyDown.bind(this);
		this.onKeyUp = this.onKeyUp.bind(this);
	}

	handleChange(event) {
		this.setState({value: event.target.value});
	}

	handleSubmit(event) {
		if(event) {
			event.preventDefault();
			event.stopPropagation();
		};
		this.props.onClick(this.state.value)
		this.setState({value:''});
	}

	onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
		if (event.key === 'Enter') {
			event.preventDefault();
			event.stopPropagation();
			if (this.state.shift) {
				this.setState({
					value:this.state.value+'\n',
				})
			}
			else {
				this.handleSubmit();
			}
		} else if (event.key === 'Shift') {
				this.setState({
					shift: true,
				});
			}
		}
	onKeyUp(event: React.KeyboardEvent<HTMLDivElement>) {
		if (event.key === 'Shift') {
			this.setState({
				shift: false,
			});
		}
	}

	render() {
		return (
			<div className="container-fluid" id="commentContainer">
			<form className="replying" onSubmit={this.handleSubmit} onKeyDown={this.onKeyDown} onKeyUp={this.onKeyUp}>
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
						>
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

	componentDidUpdate(prevProps, prevState) {
		if (this.props.comments != prevProps.comments) {
			this.setState({
				comments: this.props.comments,
				my_upvoted: this.props.my_upvoted,
				my_downvoted: this.props.my_downvoted,
				my_comments: this.props.my_comments,
			})
		}
	}

	silentRefreshComments() {
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
					my_upvoted: result.comments_upvoted,
					my_downvoted: result.comments_downvoted,
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
				this.props.handleCommentDelete(id);
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
			reported: false,
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
	handleUpvoteClick(e) {
		e.stopPropagation();
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
	handleUpvoteUnclick(e) {
		e.stopPropagation();
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
	handleDownvoteClick(e) {
		e.stopPropagation();
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
	handleDownvoteUnclick(e) {
		e.stopPropagation();
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

	// prevent dropdown close when clicking 'report'
	// code from https://github.com/react-bootstrap/react-bootstrap/issues/1490
	dropdownToggle(newValue){
	    if (this._forceOpen){
	        this.setState({ menuOpen: true });
	        this._forceOpen = false;
	    } else {
	        this.setState({ menuOpen: newValue });
	    }
	}
	menuItemClickedThatShouldntCloseDropdown(){
	    this._forceOpen = true;

		fetch("/api/posts/"+this.props.id+"/r/", {
			method: 'GET',
			credentials: "same-origin",
			headers : new Headers(),
			headers: {
				 "X-CSRFToken": csrftoken,
				 'Accept': 'application/json',
				 'Content-Type': 'application/json',
			},
		});

		this.setState({
			reported: true,
		});
	}

	render () {
		let date_string = timestamp(this.props.date);

		const postclass = "post3";

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
			    <Media.Body className="wrapText" style={{cursor:"auto"}}>
					{this.props.content}
			    </Media.Body>
				<Media.Right className="dropdown-container">
					<DropdownButton pullRight
					   className="postDropdown"
					   bsSize="small"
					   title=""
					   id="dropdown-size-small"
					   open={this.state.menuOpen}
					   onToggle={val => this.dropdownToggle(val)}
					   >
					   { this.props.isMine
					   		? <MenuItem onClick={this.props.handleDelete}>Delete</MenuItem>
							: (this.state.reported
								? <MenuItem>Reported ✔</MenuItem>
								: <MenuItem onClick={() => this.menuItemClickedThatShouldntCloseDropdown()}>Report</MenuItem>)
				   		}
					</DropdownButton>
				</Media.Right>
			  </Media>
			  <Media className="rip" style={{cursor:"default"}}>
			    <Media.Left>
			      <div className="iconFirstColumn">
				  </div>
			    </Media.Left>
			    <Media.Body className="bottom">
					<Media.Left>
				      <Speech_bubble />
				    </Media.Left>
				    <Media.Left className = "commentNum">
				      {this.props.comment_count}
				    </Media.Left>
				    <Media.Right>
				    </Media.Right>
			    </Media.Body>
			    <Media.Right className = "postDateString" style={{cursor:"auto"}}>
			    	{date_string}
			    </Media.Right>
			  </Media>
		  </div>
		);
	}
}

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
			my_comments:  this.props.my_comments,
			my_upvoted: this.props.my_upvoted_comments,
			my_downvoted: this.props.my_downvoted_comments,
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
			<div>
				<h3 className="header">TigerTalk</h3>
				<br />
				<br />
				<br />
			</div>
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
		.then(function(response) {
	        if (!response.ok) {
				this.setState({
					exists: false,
					isLoaded: true,
				})
	        }
	        return response;
	    })
		.then(res => res.json())
		.then(
			(result) => {
				this.setState({
					exists: true,
					isLoaded: true,
					post: result,
				})
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
		fetch("/api/posts/"+postid+"/", {
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
				this.setState({
					deleted: true,
					exists: false,
				})
			}
		)
	}

	renderPostCommentBlock() {
		if (!this.state.isLoaded) {
			return (
				<Spinner />
			)
		} else if (this.state.exists) {
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
					my_upvoted_comments={this.state.my_upvoted_comments}
					my_downvoted_comments={this.state.my_downvoted_comments}
					my_comments={this.state.my_comments}
					handleDelete={this.handleDelete}
				/>
			)
		} else if (this.state.deleted) {
			return (<div className="no-post">Post deleted.</div>)
		} else {
			return (<div className="no-post"> Post could not be found! </div>)
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
