//------------------------------------------------------------------------------------
//						CONTACT FORM VALIDATION'S SETTINGS
//------------------------------------------------------------------------------------
$('.contact_form').validate({
    onfocusout: false,
    onkeyup: false,
    rules: {
        name: "required",
        message: "required",
        email: {
            required: true,
            email: true
        },
        type: "required",
        check: "required",
        radio: "required"
    },
    errorPlacement: function (error, element) {

        if ((element.attr("type") == "radio") || (element.attr("type") == "checkbox")) {
            error.appendTo($(element).parents("div").eq(0));
        } else if (element.is("select")) {
            error.appendTo($(element).parents("div").eq(1));
        } else {
            error.insertAfter(element);
        }
    },
    messages: {
        name: "What's your name?",
        message: "Type your message",
        email: {
            required: "What's your email?",
            email: "Please, enter a valid email"
        },
        type: "Please enter car type",
        check: "Please check box",
        radio: "Please choose radio button"
    }
});

//------------------------------------------------------------------------------------
//								CONTACT FORM SCRIPT
//------------------------------------------------------------------------------------

$('.contact_form').submit(function () {
    // submit the form
    if ($(this).valid()) {
        $(this).find('[type=submit]').button('loading');
        var action = $(this).attr('action');
        $.ajax({
            url: action,
            type: 'POST',
            data: {
                contactname: $(this).find('.contact_name').val(),
                contactemail: $(this).find('.contact_email').val(),
                contactmessage: $(this).find('.contact_message').val(),
                id: this.id
            },
            success: function () {
                $('.contact_form').find('[type=submit]').button('complete');
            },
            error: function () {
                $('.contact_form').find('[type=submit]').button('reset');
            }
        });
    } else {
        //if data was invalidated
    }
    return false;
});