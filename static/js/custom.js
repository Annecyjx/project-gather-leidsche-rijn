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
		console.log(eventId)
		userInput = $('#body').val()
		$.post('/spec', {newComment:userInput, eventId: eventId}, function(data){
			console.log('performed event request')
			console.log(data.newComment)
			$('#result-box').append('<p>' + data.newComment + '</p>');			
		})
		event.preventDefault()
	}
	})
})