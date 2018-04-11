	var xhttp = new XMLHttpRequest();
	var url = "https://tigertalkapi.herokuapp.com/posts/?format=json"
	xhttp.open("GET", url, true);
	xhttp.send();
	var myArr = JSON.parse(xhttp.responseText);
    myFunction(myArr);
    window.alert("rip");

	function myFunction(arr) {
		var out = "";

		var i;

		window.alert("lol");

		for (i = 0; i < arr.length; i ++) {
			out += '<div class="chunk"> <div class="media offset-md-1"> <div class="media-body"> <div class="entry" id="e' + i;
			out += '">' + arr[i].content + '</div> <div class="comments" id="c' + i + '">';
			comments = arr[i].comments;
			var j;
			for (j = 0; j < comments.length; j++) {
				out += '<div class="media mt-1"> <div class="media-body"> <div class="reply">';
				out += comments[j].content;
				out += '</div> </div> </div>';
			}
			out += '<form class="replying"> <div> <textarea name="entry" cols="100" rows="2" placeholder="Reply"></textarea>';
			out += '</div><div><button>Post</button></div></form></div>';
			out += ' </div> </div> </div>';
		}

		document.getElementById("chunks").innerHTML = out;
	}
});
