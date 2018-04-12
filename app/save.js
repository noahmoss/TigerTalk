$(document).ready(function() {
	var length;
	var h;
    $.ajax({
        type: 'GET',
        url: 'https://tigertalkapi.herokuapp.com/posts/',
        data: { get_param: 'value' },
        dataType: 'json',
        success: function (data) {
			length = data.length;
            var out = "";
			for (let i = data.length-1; i >= 0; i--) {
				let id = data[i].id;
				out += '<div class="chunk"> <div class="media offset-md-1"> <div class="media-body"> <div class="entry" id="e' + id;
				out += '">' + data[i].content + '</div> <div class="comments" id="c' + id + '">';
				comments = data[i].comments;
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
            $('#chunks').append(out);

			// Assign click events to posts to show comments on click
			for (let i = 0; i < data.length; i++) {
				addShowCommentsEvent(data[i].id);
			}
        },
        error: function () {
        	window.alert("Could not get posts");
        }
    });

	$("#mainpost").click(function(){
		let text = $("#maintext").val();
		$("#maintext").val("");
		if (text.length != 0) {
			$.ajax({
				type: 'POST',
				url: 'http://tigertalkapi.herokuapp.com/posts/',
				dataType: 'json',
				data: {
					"content": text
				},
				success: function(response){
					displayPost(text, response['id']);
				}
			});
		}
	});

	function addShowCommentsEvent(id) {
		let e = "#e" + id;
		let c = "#c" + id;
		$(e).click(function() {
			if ($(c).css("display") === "none") {
				$(c).css("display", "block");
			}
			else {
				$(c).css("display", "none");
			}
		});
	}

	function displayPost(newPost, id) {
		var toAppend = '<div class="chunk"> <div class="media offset-md-1"> <div class="media-body"> <div class="entry" id="e' + id;
		toAppend += '">' + newPost + '</div> <div class="comments" id="c' + id + '">';
		toAppend += '<form class="replying"> <div> <textarea name="entry" cols="100" rows="2" placeholder="Reply"></textarea>';
		toAppend += '</div><div><button>Post</button></div></form></div>';
		toAppend += ' </div> </div> </div>';
		$('#chunks').prepend(toAppend);

		addShowCommentsEvent(id);
	}
});
