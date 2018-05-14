var React = require('react')
var ReactDOM = require('react-dom')
import { Navbar, Nav, NavItem } from 'react-bootstrap';

class NavBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {value: ''};

		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event) {
      this.setState({value: event.target.value});
    }

	render() {
		return (
			<Navbar fixedTop collapseOnSelect fluid>
			  <Navbar.Header>
				<Navbar.Brand>
				  	<a style={{ fontFamily: 'Quicksand' }} href="/main">
						TigerTalk	
					</a>
				  <form id="demo-2" action={"/posts"} >
					  <input id="searchbox"
					  		 type="search"
							 name="q"
							 value={this.state.value}
							 onChange={this.handleChange}/>
				  </form>
				</Navbar.Brand>
			    <Navbar.Toggle />
			  </Navbar.Header>
			  <Navbar.Collapse>
			  <Nav pullRight>
					<NavItem style={{ fontFamily: 'Quicksand' }} href="/about">
						About
					</NavItem>
					<NavItem href="https://docs.google.com/forms/d/e/1FAIpQLSeO1FP1ghYFiDi2AKrBsEOxu2b_NXowGbxCfrlHXFmm6b1Fug/viewform?usp=pp_url&entry.1782114317"
					target="_blank" style={{ fontFamily: 'Quicksand' }} >
						Feedback
					</NavItem>
					<NavItem style={{ fontFamily: 'Quicksand' }} href="/accounts/logout">
					  Logout ({netid})
					</NavItem>
			    </Nav>
				</Navbar.Collapse>
			</Navbar>
		);
	}
}

ReactDOM.render(<NavBar />, document.getElementById('root'))
