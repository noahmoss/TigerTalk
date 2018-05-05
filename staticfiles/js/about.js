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



ReactDOM.render(<NavBar />, document.getElementById('root'))