$(document).ready(function() {
	$("button").click(function(){
		$.ajax({
		  url: 'https://randomuser.me/api/',
		  dataType: 'json',
		  success: function(data) {
		    console.log(data);
		  }
		});
   });
});
