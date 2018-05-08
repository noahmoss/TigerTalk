var React = require('react')
var ReactDOM = require('react-dom')
import { Navbar, Nav, NavItem } from 'react-bootstrap';

class NavBar extends React.Component {
	render() {
		return (
			<Navbar fixedTop collapseOnSelect fluid>
			  <Navbar.Header>
			    <Navbar.Toggle />
			  </Navbar.Header>
			  <Navbar.Collapse>
			  	<Nav pullLeft>
					<NavItem style={{ fontFamily: 'Quicksand' }}>
						TigerTalk
					</NavItem>
				</Nav>
			  </Navbar.Collapse>
			</Navbar>
		);
	}
}


ReactDOM.render(<NavBar />, document.getElementById('root'))