/** Add an alert box to an element. */
$.fn.addMessage = function (args) {

    return this.each(function () {

        var i, list, alertbox, messages, type = typeof (args.message),
            create = !$(this).children('.user-message').length;

        messages = [];

        if (create) {
            $(this).prepend('<div class="user-message">');
        }
        alertbox = $(this).children('.user-message');

        if (type === 'string') {
            messages.push(args.message);
        } else if (type === 'object') {
            //array
            if (typeof (args.message.length) != 'undefined') {
                for (i = 0; i < args.message.length; i++) {
                        messages.push(args.message[i]);
                }
            } else {
                for (var key in args.message) {
                    if (typeof (args.message[key]) === 'number' ||
                        typeof (args.message[key]) === 'string') {
                        messages.push(args.message[key]);
                    }
                }
            }
        }

        alertbox.empty().removeClass('error success info warning pending').addClass(args.messageClass);

        if (messages.length > 1) {
            list = $('<ul class="simple-list">');
            for (i = 0; i < messages.length; i++) {
                list.append('<li>' + messages[i] + '</li>');
            }
            alertbox.prepend(list);
        } else {
            alertbox.html(messages[0]);
        }
    });
};