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

//class VotingBlock extends React.Component {
// 	render() {
// 		return (
 //			<div className="voting-block">
 //				<div className="arrow-up" />
 //				<br/>
 //				<div className="arrow-down" />
 //			</div>
 //		);
 //	}
//}

class Chevron_up extends React.Component {
 	render() {
 		return (
			  	<span className="glyphicon glyphicon-chevron-up" aria-hidden="true"></span>
		);
	}
}

class Chevron_down extends React.Component {
 	render() {
 		return (
			<div><div className="arrow"><span className="glyphicon glyphicon-chevron-down" aria-hidden="true"></span></div></div>
		);
	}
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
						 "X-CSRFToken": getCookie("csrftoken"),
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
// THIS POST BUTTON WAS BIRTHED BY SATAN
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


function Post(props)  {
	return (
		<div className="post">
		  <Media className="mainBody">
		    <Media.Left>
		      <div className="arrowBox">
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
				   <MenuItem eventKey="2">Follow</MenuItem>
				   <MenuItem divider />
				   <MenuItem eventKey="3">Delete</MenuItem>
				</DropdownButton>
			   </Media.Right>
		  </Media>
		  <Media className="rip">
		    <Media.Left>
		      <div className="iconFirstColumn">
			  </div>
		    </Media.Left>
		    <Media.Body onClick={props.onClick}>
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

// A post and its associated comments
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
				{
					this.state.showing
					? <CommentBlock id={this.props.id} comments={this.props.comments} />
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

// The main list of posts and associated post entry form (above it)
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
		fetch("https://tigertalkapi.herokuapp.com/api/posts/")
		.then(res => res.json())
		.then(
			(result) => {
				this.setState({
					isLoaded: true,
					posts: result,
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
		if (text.trim() != ''){
			fetch("/api/posts/", {
					method: 'POST',
					credentials: "same-origin",
					headers : new Headers(),
					headers: {
						 "X-CSRFToken": getCookie("csrftoken"),
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
			<div>
			<PostEntryForm onClick={this.handlePost}/>
			{this.state.isLoaded
				? this.state.posts.map((post) =>
	          		<PostCommentBlock
			   			key={post.id}
						id={post.id}
	                	content={post.content}
						comments={post.comments} />)

				: <Spinner />
	        }
			</div>
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
