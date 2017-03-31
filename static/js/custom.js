//comment validation and ajax post
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
	$("#commentbutton").click(function(event){

		var isValidated = validateForm(event);
		if(isValidated){
		var eventId = $('.eventId').attr('id')
		userInput = $('#body').val()
		$.post('/comment', {magic:userInput, eventId: eventId}, function(data){
			$('#result-box').append('<p>' + data.magic + '</p>');
			$('#body').val('')			
		})
		event.preventDefault()
	}
	})
})

//ajax for join
$(document).ready(function(){
	console.log('loaded the dom again');
	$("#joinbutton").click(function(event){

		var eventId = $('.eventId').attr('id')
		userInputNumber = $('#joinInput').val()
		$.post('/spec', {magic2:userInputNumber, eventId: eventId}, function(data){
			$('#joinamount').html('<p>' + data.magic2 + '</p>');
			$('#joinInput').val('')
		})
		event.preventDefault()
	})
})

//contact form validation and success message
$(document).ready(function() {
    $('#contact_form').bootstrapValidator({
    feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
        full_name: {
            validators: {
                    stringLength: {
                    min: 2,
                },
                    notEmpty: {
                    message: 'Please supply your full name'
                }
            }
        },
        email: {
            validators: {
                notEmpty: {
                    message: 'Please supply your email address'
                },
                emailAddress: {
                    message: 'Please supply a valid email address'
                }
            }
        },
        phone: {
            validators: {
            	stringLength: {
            	max:15
            },
                notEmpty: {
                    message: 'Please supply your phone number'
                },
            }
        },
        comment: {
            validators: {
                  stringLength: {
                    min: 10,
                    max: 200,
                    message:'Please enter at least 10 characters and no more than 200'
                },
                notEmpty: {
                    message: 'Please supply a message'
                }
                }
            }
        }
    })
    .on('success.form.bv', function(e) {
        $('#success_message').slideDown({ opacity: "show" }, "slow") 
            $('#contact_form').data('bootstrapValidator').resetForm();
        e.preventDefault();
        var $form = $(e.target);
        var bv = $form.data('bootstrapValidator');
        $.post($form.attr('action'), $form.serialize(), function(result) {
            console.log(result);
        }, 'json');
        });
    });     
