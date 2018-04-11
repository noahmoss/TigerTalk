$(document).ready(function() {
	    $.ajax({ 
        type: 'GET', 
        url: 'http://tigertalkapi.herokuapp.com/posts/?format=json', 
        data: { get_param: 'value' },
        dataType: 'json', 
        success: function (data) { 
            var out = "";
			var i;

			for (i = 0; i < data.length; i ++) {
			out += '<div class="chunk"> <div class="media offset-md-1"> <div class="media-body"> <div class="entry" id="e' + i;
			out += '">' + arr[i].content + '</div> <div class="comments" id="c' + i + '">';
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

            $('#chunks').html(out);
        }
    });
});
