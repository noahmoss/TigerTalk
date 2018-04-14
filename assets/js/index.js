var React = require('react')
var ReactDOM = require('react-dom')


function hello(){console.log('Hello!')};

// TODO: Add proper onclick event
function SortButton(props) {
	return (
		<button type="button" onClick={hello}>
			{props.value}
		</button>
	);
}

class SortBar extends React.Component {
    render() {
        return (
			<ul id="navbar">
			  <li><SortButton value='Recent' /></li>
			  <li><SortButton value='Popular' /></li>
			</ul>
        );
    }
}

ReactDOM.render(<SortBar />, document.getElementById('container'))
