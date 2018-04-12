$(document).ready(function() {
	var length;
    $.ajax({
        type: 'GET',
        url: 'http://tigertalkapi.herokuapp.com/posts/',
        data: { get_param: 'value' },
        dataType: 'json',
        success: function (data) {
			length = data.length;
            var out = "";
			var i;
			for (i = 0; i < data.length; i ++) {
			out += '<div class="chunk"> <div class="media offset-md-1"> <div class="media-body"> <div class="entry" id="e' + i;
			out += '">' + data[i].content + '</div> <div class="comments" id="c' + i + '">';
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
			var h;
			length = 3
			for (h = 0; h < length; h++) {
				console.log(h);
				let e = "#e" + h;
				let c = "#c" + h;
				$(e).click(function() {
					if ($(c).css("display") === "none") {
						$(c).css("display", "block");
					}
					else {
						$(c).css("display", "none");
					}
				});
			}

        },
        error: function () {
        	window.alert("rip");
        }
    });

});
