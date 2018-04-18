var React = require('react')
var ReactDOM = require('react-dom')
import { Grid, Row, Col } from 'react-bootstrap'
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { ButtonToolbar, DropdownButton, MenuItem } from 'react-bootstrap';
import { FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';


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

class VotingBlock extends React.Component {
 	render() {
 		return (
 			<div className="voting-block">
 				<div className="arrow-up" />
 				<br/>
 				<div className="arrow-down" />
 			</div>
 		);
 	}
}

// A single comment
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
			<div>
			<form className="replying" onSubmit={this.handleSubmit}>
				<div>
					<textarea
						name="entry"
						id="maintext"
						value={this.state.value}
						onChange={this.handleChange}
						cols="100"
						rows="2"
						autoComplete="off"
						placeholder="Reply"
					/>
				</div>
				<div>
					<button
						type="submit"
						id="mainpost"
						onClick={() => this.props.onClick(this.state.value)}
					>
						Post
					</button>
				</div>
				<br />
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
			fetch("https://tigertalkapi.herokuapp.com/comments/", {
					method: 'POST',
					headers : new Headers(),
					headers: {
						 'Accept': 'application/json',
						 'Content-Type': 'application/json',
					},
					body:JSON.stringify({
						"post":this.props.id,
						"content":text,
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
		console.log('test');
    	event.preventDefault();
	}

	render() {
		return (
			<div class="container-fluid">
			<form onSubmit={this.handleSubmit}>
			<div class="col-md-20">
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
			</div>
			<div class="col-md-20">
					<Button
						className="pull-right"
						type="submit"
						id="mainpost"
						onClick={() => this.props.onClick(this.state.value)}>
					Post
					</Button>
			</div>
			</form>
			</div>
		);
	}
}

// A single post
function Post(props)  {
	return (
	<div class="wrap" onClick={props.onClick}>
	<div class="contain">
	<Grid>
		<Row className="show-grid" style={{ height: 60 }}>

			<div class="col-xs-1 col-xs-1-5">
				<VotingBlock/>
			</div>

			<Col sm={12} md={6}>
  		   		{props.content}
			</Col>

		   <div class="col-xs-1 col-xs-1-5">
		   		<ButtonToolbar>
   			 	<DropdownButton
      				bsSize="small"
      				title="Options"
      				id="dropdown-size-small">
   		   			<MenuItem eventKey="1">Track</MenuItem>
     	  	    	<MenuItem eventKey="2">Report</MenuItem>
      	   			<MenuItem divider />
      	        	<MenuItem eventKey="3">Delete</MenuItem>
   		     	</DropdownButton>
  		   		</ButtonToolbar>
		   </div>
		</Row>
	</Grid>
	</div>
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
		if (text.trim() != ''){
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
			<div className="container-fluid">
				<br />
				<br />
				<h3 className="header">TigerTalk</h3>
			</div>
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
			    <Nav pullRight>
					<NavItem eventKey={1} href="#">
					  About
					</NavItem>
					<NavItem eventKey={2} href="#">
					  Feedback
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
