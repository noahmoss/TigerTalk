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
				out += '<div class="chunk"> <div class="media offset-md-0"> <div class="media-body"> <div class="entry" id="e' + id;
				out += '">' + data[i].content + '</div>'
				out += '<div class="commentblock" id ='
				let commentBlockID = 'commentblock'+id;
				out += commentBlockID + '>';
				out +='<div class="comments" id="c' + id + '">';
				let comments = data[i].comments;
				var j;
				for (j = 0; j < comments.length; j++) {
					out += '<div class="media mt-1"> <div class="media-body"> <div class="reply">';
					out += comments[j].content;
					out += '</div> </div> </div>';
				}
				out += '</div>';
				out += '<form class="replying"> <div> <textarea name="entry" '
				let commentEntryID = 'commententry' + id;
				out += 'id=' + commentEntryID;
				out += ' cols="100" rows="2" placeholder="Reply"></textarea>';
				out += '</div><div><button type="button" id='
				let commentButtonID = "commentpost" + id;
				out += commentButtonID;
				out += '>Post</button></div></form></div>';
				out += '</div></div></div>';
				// Assign click events on comment post buttons
				$(document).on('click','#'+commentButtonID,function() {
					submitComment(id);
				});

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
				url: 'https://tigertalkapi.herokuapp.com/posts/',
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

	function submitComment(id) {
		let text = $("#commententry"+id).val();
		$("#commententry"+id).val("");
		if (text.length != 0) {
			$.ajax({
				type: 'POST',
				url: 'https://tigertalkapi.herokuapp.com/comments/',
				dataType: 'json',
				data: {
					"content": text,
					"post": id,
				},
				success: function(response){
					displayComment(text,id);
				}
			});
		}
	}

	function addShowCommentsEvent(id) {
		let e = "#e" + id;
		let c = "#commentblock" + id;
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
		let toAppend = '<div class="chunk"> <div class="media offset-md-0"> <div class="media-body"> <div class="entry" id="e' + id;
		toAppend += '">' + newPost + '</div>';

		toAppend += '<div class="commentblock" id ='
		let commentBlockID = 'commentblock'+id;
		toAppend += commentBlockID + '>';

		toAppend += '<div class="comments" id="c' + id + '"></div>';
		toAppend += '<form class="replying"> <div> <textarea name="entry" '
		let commentEntryID = 'commententry' + id;
		toAppend += 'id=' + commentEntryID;
		toAppend += ' cols="100" rows="2" placeholder="Reply"></textarea>';
		toAppend += '</div><div><button type="button" id='
		let commentButtonID = "commentpost" + id;
		toAppend += commentButtonID;
		toAppend += '>Post</button></div></form></div>';
		toAppend += '</div></div></div>';

		// Assign click events on comment post buttons
		$(document).on('click','#'+commentButtonID,function() {
			submitComment(id);
		});

		$('#chunks').prepend(toAppend);

		addShowCommentsEvent(id);
	}

	function displayComment(newComment, postID) {
		let id = "#c"+postID;
		let out = '<div class="media mt-1"> <div class="media-body"> <div class="reply">';
		out += newComment;
		out += '</div> </div> </div>';
		$(id).append(out);
	}



});
