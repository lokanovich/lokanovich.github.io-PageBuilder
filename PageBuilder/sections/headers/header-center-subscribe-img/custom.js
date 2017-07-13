//------------------------------------------------------------------------
//					SUBSCRIBE FORM VALIDATION'S SETTINGS
//------------------------------------------------------------------------
$('.subscribe_form').validate({
    onfocusout: false,
    onkeyup: false,
    rules: {
        email: {
            required: true,
            email: true
        }
    },
    errorPlacement: function (error, element) {
        error.appendTo(element.closest("form"));
    },
    highlight: function (element, errorClass) {
        $(element).parent().addClass('error');
    },
    unhighlight: function (element, errorClass) {
        $(element).parent().removeClass('error');
    },
    messages: {
        email: {
            required: "We need your email address to contact you",
            email: "Please, enter a valid email"
        }
    }
});

//------------------------------------------------------------------------------------
//						SUBSCRIBE FORM MAILCHIMP INTEGRATIONS SCRIPT
//------------------------------------------------------------------------------------
$('.subscribe_form').submit(function () {
    // submit the form
    if ($(this).valid()) {
        $(this).find('[type=submit]').button('loading');
        var action = $(this).attr('action');
        $.ajax({
            url: action,
            type: 'POST',
            data: {
                newsletter_email: $(this).find('.subscribe_email').val(),
                id: this.id
            },
            success: function (data) {
                $('.subscribe_form').find('.subscribe_submit').button('reset');

                //Use modal popups to display messages
                $('#modalSubscribeSuccess .mailchimp-data-message').html(data);
                $('#modalSubscribeSuccess').modal('show');

            },
            error: function () {
                $('.subscribe_form').find('.subscribe_submit').button('reset');

                //Use modal popups to display messages
                $('#modalSubscribeError').modal('show');

            }
        });
    }
    return false;
});