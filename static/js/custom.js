// document.commentForm.body.focus();
//     return false
//   }      
//   return true;    
// }

function validateForm(event) {
  var body = document.forms['commentForm']['body'].value;
  if (body == '') {
    $('#error-message').html("You cannot submit empty comment");
    document.commentForm.body.focus();
    return false
  }
  if (body.length > 1024) {
    $('#error-message').html("Your comment cannot be more than 1024 characters");
    document.commentForm.body.focus();
    return false
  }      
  return true;    
}

$(document).ready(function(){
	console.log('loaded the dom');
	$("button").click(function(event){

		var isValidated = validateForm(event);
		if(isValidated){
		var eventId = $('.eventId').attr('id')
		console.log(eventId)//works
		userInput = $('#body').val()
		$.post('/spec', {magic:userInput, eventId: eventId}, function(data){
			console.log('performed event request')
			console.log(data.magic)
			$('#result-box').append('<p>' + data.magic + '</p>');			
		})
		event.preventDefault()
	}
	})
})