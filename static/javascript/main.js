//Search Submit
$(function(){
	$('#search').on('keyup', function(e){
		if(e.keyCode === 13) {
			var parameters = { search: $(this).val() };
			$.get( '/searching',parameters, function(data) {
				$('#results').html(data);
			});
		};
	});
});

//Auto Submit
$(document).ready(function(){
	var parameters = { search: $('#search').val() };
	$.get( '/searching',parameters, function(data) {
		$('#results').html(data);
	});
});

//Timed Submit
setInterval(function(){ 
	var parameters = { search: $('#search').val() };
	$.get( '/searching',parameters, function(data) {
		$('#results').html(data);
	});
}, 3000);