/**
 * Component and ui functionality.
 *
 * @requires jQuery
 * @requires jQUery.ui
 * @requires jQuery.addMessage
 * @requires globals
 */
util.namespace('util.ui');
util.ui = (function () {

    var initialized = false,

    mod = {

        init: function () {
            if (!initialized) {


                initialized = true;

            }
        },

        busy: function (item) {
            var btn = $(item),
                spinner = btn.children('.icon.busy'),
                label,
                busyText,
                originalText;

            btn.prop('disabled', true);
            btn.addClass('busy');
            // If this button has an icon hide it.
            btn.children('.icon').hide();
            if (!spinner.length) {
                btn.prepend('<i class="icon busy"></i>');
                spinner = btn.children('.icon.busy');
            }
            spinner.show();

            label = btn.children('.b-label');
            busyText = btn.attr('data-busy');
            if (busyText && label.length > 0) {
                originalText = label.html();
                label.html(busyText);
                btn.data('originalText', originalText);
            }

            return btn;
        },

        unbusy: function (item) {
            var btn = $(item),
                label,
                originalText;

            btn.prop('disabled', false);
            btn.removeClass('busy');
            // If this button has an icon show it
            btn.children('.icon').show();
            btn.children('.icon.busy').hide();

            label = btn.children('.b-label');
            originalText = btn.data('originalText');
            if (originalText && label.length > 0) {
                label.html(originalText);
            }

            return btn;
        },

        /**
         * Returns button array for jquery ui dialogs that contain
         * a 'Cancel' and 'OK' buttons and an optional 'Delete' button.
         * The 'OK' action can have a custom target and/or event.
         *
         * @param {object} [options]                   - An object literal with the following properties:
         *        {string} [event=ui.dialog.ok]        - The name of the event to fire when 'ok' button is clicked.
         *                                               Defaults to 'ui.dialog.ok'.
         *        {string} [mode=VIEW]                 - When set to 'CREATE', the delete button will not be shown.
         *                                               Defaults to 'VIEW'.
         *        {string, element} [form]             - If present, submits the form supplied or the first form element
         *                                               found inside the popup. 'event' is not fired when 'form' is
         *                                               present.
         *        {string|element} [target]            - The target of the event (element or selector).
         *                                               Defaults to the popup.
         *        {string} [okClass='']                - CSS class names applied to the primary (ok) button.
         *        {string} [okText='OK']               - The text of the ok button. Defaults to 'OK'.
         *        {boolean} [okDisabled=false]         - If true, the primary (ok) button will be initially disabled.
         *        {boolean} [confirm=false]            - If true, after clicking the primary (ok) button,
         *                                               the dialog will ask for confirmation.
         *        {string} [cancelClass='']            - CSS class names applied to the secondary (cancel) button.
         *        {string} [cancelText='Cancel']       - The text of the cancel button. Defaults to 'Cancel'.
         *        {boolean} [delete=false]             - If true, a 'Delete' button will also be included.
         *                                               Only used when mode is not 'CREATE'.
         */
        buttons: function (options) {

            options = $.extend({
                cancelClass : '',
                cancelText : 'Cancel',
                confirm : false,
                'delete' : false,
                event : 'ui.dialog.ok',
                mode : 'VIEW',
                okClass : '',
                okDisabled : false,
                okText : 'OK'
            }, options || {});

            var buttons = [],

            // Callback fired on 'OK' click, submits a form if one exists in the
            // dialog or submits the ok event.
            okClicked = function (dialog, target) {

                if (options.hasOwnProperty('form')) {
                    var form = $(options.form);
                    if (!form.is('form')) form = dialog.find('form');
                    form.submit();
                } else {
                    $(target).trigger(options.event);
                }
            };

            // Cancel Button
            buttons.push({
                text : options.cancelText,
                click : function (ev) { $(this).dialog('close'); },
                'class': 'js-secondary-action ' + (options.cancelClass || '')
            });

            if (options['delete'] && options.mode !== 'CREATE') {
                // Delete Button
                buttons.push({
                    text : 'Delete',
                    click: function (ev) {

                        var dialog = $(this).closest('.ui-dialog-content'),
                            target = options.target || dialog;
                        mod.confirm({ dialog : dialog });
                        dialog.off('ui:dialog:confirm').on('ui:dialog:confirm', function (ev) {
                            $(target).trigger('ui:dialog:delete');
                        });
                    },
                    'class' : 'delete'
                });
            }

            // OK Button
            buttons.push({
                text : options.okText,
                click : function (ev) {

                    var dialog = $(this).closest('.ui-dialog-content'),
                    target = options.target ? options.target : dialog;
                    if (options.confirm) {
                        mod.confirm({ dialog : dialog });
                        dialog.off('ui:dialog:confirm').on('ui:dialog:confirm', function (ev) {
                            okClicked(dialog, target);
                        });
                    } else {
                        okClicked(dialog, target);
                    }
                },
                'class' : 'primary action js-primary-action ' + options.okClass,
                disabled : options.okDisabled
            });

            return buttons;
        },

        /**
         * Show a popup. Popup style/behavior should be stored in data attributes described below.
         *
         * @param {sting|object} popup - DOM Object, jQuery DOM object, or css selector string of the popup
         *                               element, usually a div, to use as a popup.
         * @param {string} [url]       - If provided, the popup element will be loaded with the response from an
         *                               ajax request to that url. It will override the [data-url] attribute value
         *                               if it exists.
         *
         * The popup element's attributes are as follows:
         *
         * data-dialog        - If present the popup will have 'ok', 'cancel' buttons. @see util.ui.buttons
         *                      function for button behaviors.
         * data-dialog-tabbed - If present, the title bar will be tabs. Correct JQuery tabs markup is expected.
         * data-width         - Width of the popup. Default is 'auto'.
         * data-height        - Height of the popup. Default is 'auto'.
         * data-title         - The title of the popup.
         * data-event         - If present and [data-dialog] is present, the value of [data-event] will be the name
         *                      of the event to fire when clicking the 'ok' button.
         * data-target        - If present and [data-dialog] is present' the value of [data-target] will be the
         *                      target of the event fired when clicking the ok button.
         * data-url           - If present, the contents of the popup element will be replaced with the
         *                      response of an ajax request to the url before the popup is shown.
         * data-load-event    - If present, this event will be fired right before the popup is shown.
         *                      If 'data-url' is used, the event will be fired after the dialog is loaded with
         *                      the response body.
         * data-popup-toggle  - If present, the trigger element can be clicked to close the popup as well.
         * data-confirm       - If present, after clicking the 'OK' button, the dialog will ask for confirmation.
         * data-mode          - If present, sets a page mode for the popup, passed to buttons.
         *                      Values: 'CREATE', 'EDIT', 'VIEW'.
         *
         * Positioning options: see http://api.jqueryui.com/position/
         * data-position-my   - 'left|center|right top|center|bottom', Order matters. Default is 'center'
         * data-position-at   - 'left|center|right top|center|bottom', Order matters. Default is 'center'
         * data-position-of   - selector|element.  Default is 'window'.
         */
        dialog: function (popup, url) {

            popup = $(popup);

            var dialog = popup.is('[data-dialog]'),
                tabbed = popup.is('[data-dialog-tabbed]'),
                loadEvent = popup.data('loadEvent'),
                options = {
                    minWidth: popup.is('[data-min-width]') ? popup.data('minWidth') : '150',
                    width: popup.is('[data-width]') ? popup.data('width') : 'auto',
                    height: popup.is('[data-height]') ? popup.data('height') : 'auto',
                    minHeight: popup.is('[data-min-height]') ? popup.data('minHeight') : '150',
                    dialogClass: popup.is('[data-class]') ? 'utils-dialog ' + popup.data('class') : 'utils-dialog'
                },
                buttonOptions = {},
                positionOptions = {};

            if (popup.is('[data-title]')) options.title = popup.data('title');
            if (popup.is('[title]')) options.title = popup.attr('title');

            if (dialog) {
                if (popup.is('[data-ok-text]')) buttonOptions.okText = popup.data('okText');
                if (popup.is('[data-ok-class]')) buttonOptions.okClass = popup.data('okClass');
                if (popup.is('[data-ok-disabled]')) buttonOptions.okDisabled = true;
                if (popup.is('[data-cancel-text]')) buttonOptions.cancelText = popup.data('cancelText');
                if (popup.is('[data-cancel-class]')) buttonOptions.cancelClass = popup.data('cancelClass');
                if (popup.is('[data-event]')) buttonOptions.event = popup.data('event');
                if (popup.is('[data-target]')) buttonOptions.target = $(popup.data('target'));
                if (popup.is('[data-form]')) buttonOptions.form = popup.data('form');
                if (popup.is('[data-confirm]')) buttonOptions.confirm = true;
                if (popup.is('[data-mode]')) buttonOptions.mode = popup.data('mode');
                if (popup.is('[data-delete]')) buttonOptions['delete'] = true;
                options.buttons = mod.buttons(buttonOptions);
            }

            if (popup.is('[data-position-my]')) positionOptions.my = popup.data('positionMy');
            if (popup.is('[data-position-at]')) positionOptions.at = popup.data('positionAt');
            if (popup.is('[data-position-of]')) positionOptions.of = popup.data('positionOf');
            options.position = positionOptions;

            if (popup.is('[data-url]') || url) {
                url = url || popup.data('url');
                popup.load(url, function () {
                    // If no title provided, try to find one hidden in the popup contents.
                    if (!options.title) {
                        var title = popup.find('.js-popup-title');
                        if (title[0]) options.title = title[0].value;
                    }
                    if (loadEvent) popup.trigger(loadEvent);

                    if (tabbed) {
                        popup.tabbedDialog(options);
                    } else {
                        popup.dialog(options);
                    }
                });
            } else {

                if (loadEvent) popup.trigger(loadEvent);
                if (tabbed) {
                    popup.tabbedDialog(options);
                } else {
                    popup.dialog(options);
                }
            }
        },

        autowire: function () {

            /** Fix file path on all our file inputs usage in windows. */
            $(document).on('change', '.file-upload input[type="file"]', function (ev) {

                var input = $(this),
                    container = input.closest('.file-upload'),
                    nameInput = container.find('.file-name'),
                    value = input.val();

                // Windwows adds C:\fakepath\ for security reasons.
                value = value.replace('C:\\fakepath\\', '');
                nameInput.text(value);
            });

            /** Sorting Handler: Sort a table by column. */
            $(document).on('click', '.sortable', function (ev) {

                var anchor = $(this),
                    dir = anchor.is('.desc') ? 'asc' : 'desc',
                    sort = anchor.data('sort'),
                    container = anchor.closest('[data-url]'),
                    url = container.data('url'),
                    pagingArea = container.find('.paging-area'),
                    params = {sort: sort, dir: dir};

                // Add page size if paging is available
                if (pagingArea.length) {
                    params.itemsPerPage = pagingArea.data('pageSize');
                    params.page = 1;
                }
                if (container.is('[data-static]')) {
                    var joiner = url.indexOf('?') === -1 ? '?' : '&';
                    window.location.href = url + joiner + $.param(params);
                } else {
                    $.get(url, params).done(function (data) {
                        container.html(data);
                    });
                }
            });

            /** Paging Handler: Get the next or previous page, or change page size. */
            $(document).on('click', globals.selectors.paging, function (ev) {

                var
                target = $(this),
                container = target.closest('[data-url]'),
                sortables = container.find('.sortable'),
                url = container.data('url'),
                pagingArea = container.find('.paging-area'),
                page = pagingArea.data('currentPage'),
                pageSize = pagingArea.data('pageSize'),
                changePage = target.parent().is('.previous-page') || target.parent().is('.next-page'),
                params = {},
                sort;

                if (changePage) {
                    // They clicked the next or previous page buttons.
                    params.page = target.parent().is('.previous-page') ? page - 1 : page + 1;
                    params.itemsPerPage = pageSize;
                } else {
                    // They clicked one of the page size links.
                    params.page = 1;
                    params.itemsPerPage = target.data('pageSize');
                }

                // Add sorting parameters if necessary.
                if (sortables.length) {
                    sort = sortables.filter('.desc');
                    if (sort.length) {
                        params.dir = 'desc';
                        params.sort = sort.data('sort');
                    } else {
                        sort = sortables.filter('.asc');
                        if (sort.length) {
                            params.dir = 'asc';
                            params.sort = sort.data('sort');
                        }
                    }
                }

                if (container.is('[data-static]')) {
                    var joiner = url.indexOf('?') === -1 ? '?' : '&';
                    window.location.href = url + joiner + $.param(params);
                } else {
                    $.get(url, params).done(function (data) {
                        container.html(data);
                        container.trigger(globals.events.pagingend);
                    });
                }
                return false; // Return false to stop form submissions
            });

            /** Show or hide an element when something is clicked. */
            $(document).on('click', '[data-show-hide]', function (ev) {
                var trigger = $(this);
                var target = $(trigger.data('showHide'));
                if (target.is('[data-url]')) {
                    if (target.is(':visible')) {

                        target.slideUp(150);

                        if (trigger.is('.revealer')) {
                            trigger.removeClass('revealer-expanded');
                        }
                    } else {
                        target.load(target.data('url'), function () {

                            target.slideDown(150);

                            if (target.is('[data-event]')) {
                                target.trigger(target.data('event'));
                            }
                            if (trigger.is('.revealer')) {
                                trigger.addClass('revealer-expanded');
                            }
                        });
                    }
                } else {
                    if (target.is(':visible')) {

                        target.slideUp(150);

                        if (trigger.is('.revealer')) {
                            trigger.removeClass('revealer-expanded');
                        }
                    } else {

                        target.slideDown(150);
                        if (target.is('[data-event]')) {
                            target.trigger(target.data('event'));
                        }
                        if (trigger.is('.revealer')) {
                            trigger.addClass('revealer-expanded');
                        }
                    }
                }
            });

            /** Toggle buttons in a button group */
            $(document).on('click', '.button-group-toggle .button', function (ev) {

                var btn = $(this), input, value;

                btn.addClass('on').siblings('.button').removeClass('on');
                // Toggle visibility of show/hide elements
                if (btn.is('[data-show]')) {
                    btn.siblings('[data-show]').each(function () {
                        $($(this).data('show')).hide();
                    });
                    $(btn.data('show')).show();
                }
                // Set an input if we need to
                if (btn.is('[data-value]')) {
                    value = btn.data('value');
                    input = btn.is('[data-input]') ? $(btn.data('input')) : btn.siblings('[data-input]');
                    if (input.length) input.val(value).change();
                }
            });

            /** Elements that navigate on click */
            $(document).on('click', '[data-href]', function (ev) { window.location = $(this).attr('data-href'); });

            /** Scroll To - Handle clicks on [data-scroll-to] elements. */
            $(document).on('click', '[data-scroll-to]', function () {

              var trigger = $(this),
                  target = $(trigger.data('scrollTo')),
                  to = target.offset().top;

              $('html, body').animate({ scrollTop: to });
            });

            /** Disable a form element after clicked */
            $(document).on('click', '.js-disable-after-click', function (ev) {

                var button = $(this), group, form;

                if (button.is(':input')) {
                    this.disabled = true;
                    group = button.attr('data-disable-group');
                    if (group !== '') {
                        $("[data-disable-group='" + group + "']").each(function (idx) {
                            this.disabled = true;
                        });
                    }

                    // if this is a busy button, add the spinner icon and use the busy text
                    if (button.is('[data-busy]')) {
                        mod.busy(button);
                    }

                    // if this is a submit button, trigger the submit event on the form
                    if (button.is(':submit')) {
                        form = $(this.form);

                        // insert the name and or value of the button into the form action
                        if (typeof button.attr('name') != 'undefined' && button.attr('name').length !== 0) {
                            form.prepend('<input name="'+ button.attr('name') +
                                '" value="' + button.attr('value') + '" type="hidden"/>');
                        }
                        form.trigger('submit');
                    }
                }
                return false;
            });

            /** Prevent forms from submitting via enter key */
            $(document).on('keydown', 'form.js-no-submit-on-enter', function (e) {
                // allow override submission elements
                if ($(e.target).hasClass('js-submit-on-enter')) {
                    return true;
                }
                if (e.keyCode == globals.keys.enter) {
                    return false;
                }
            });

            /** Close dialogs when clicking .js-close elements or the ui.dialog.ok event fires. */
            $(document).on('click', '.js-close', function (ev) {
                var dialog = $(ev.target).closest('.ui-dialog');
                if (dialog.length) dialog.find('.ui-dialog-content').dialog('close');
            });
            $(document).on('ui.dialog.ok', function (ev) {
                $(ev.target).closest('.ui-dialog-content').dialog('close');
            });

            /** Format phone numbers initially and on input blur */
            $('input.js-format-phone').each(function (idx, elem) {
                mod.formatPhone(elem);
            });
            $(document).on('blur', 'input.js-format-phone', function (event) {
                mod.formatPhone(event.target);
            });

            /** Enable or disable elements based on the state of a checkbox. */
            $(document).on('change click', '[data-toggle]', function (ev) {
                mod.toggleInputs($(this));
            });
            $('[data-toggle]').each(function (idx, item) { mod.toggleInputs(item); });

            /** Select all checkbox was clicked, select or unselect all items in a .js-select-all-container. */
            $(document).on('click', '.js-select-all', function (ev) {
                $(this).closest('.js-select-all-container')
                .find('.js-select-all-item')
                .prop('checked', $(this).prop('checked'));
            });

            /** A checkbox in a 'select all' container was clicked. */
            $(document).on('click', '.js-select-all-item', function (ev) {

                var selectAll = true,
                    selected = $(this).prop('checked'),
                    container = $(this).closest('.js-select-all-container'),
                    allItems = container.find('.js-select-all-item');

                if (selected) {
                    allItems.each(function (idx, item) { if (!$(item).prop('checked')) selectAll = false; });
                    container.find('.js-select-all').prop('checked', selectAll);
                } else {
                    container.find('.js-select-all').prop('checked', false);
                }
            });

            /** STEPPER SELECT BEHAVIOR. */
            /** Move selection backward when previous button clicked. */
            $(document).on('click', '.stepper .stepper-prev', function (ev) {

                var btn = $(this);
                var wrapper = btn.closest('.stepper');
                var select = wrapper.find('.stepper-select');
                var prev = select.find('option:selected').prev('option');

                if (!prev.length) {
                    prev = select.find('option:last-child');
                }
                prev.prop('selected', true);
                select.trigger('change');

                return true;
            });

            /** Move selection backward when previous button clicked. */
            $(document).on('click', '.stepper .stepper-next', function (ev) {

                var btn = $(this);
                var wrapper = btn.closest('.stepper');
                var select = wrapper.find('.stepper-select');
                var next = select.find('option:selected').next('option');

                if (!next.length) {
                    next = select.find('option:first-child');
                }
                next.prop('selected', true);
                select.trigger('change');

                return true;
            });

            /** Prevent select default behavior. */
            $(document).on('mousedown', '.stepper .stepper-select', function (ev) {
                ev.preventDefault();
            });
            /** END STEPPER SELECT BEHAVIOR. */

            /**
             * Show a popup when a popup trigger (element with a [data-popup] attribute) is clicked.
             * If the trigger element has a [data-popup-toggle] attribute and the popup is currently open,
             * the popup will be closed instead and the event propigated normally...otherwise util.ui.dialog is
             * called passing the popup element.
             */
            $(document).on('click', '[data-popup]', function (ev) {

                var trigger = $(this),
                    popup = $(trigger.data('popup'));

                try { /* Close popup if the trigger is a toggle and the popup is open */
                    if (trigger.is('[data-popup-toggle]') && popup.dialog('isOpen')) {
                        popup.dialog('close');
                        // Return so we don't re-open it, return true to propigate event incase others are listening.
                        return true;
                    }
                } catch (error) {/* Ignore error, occurs when dialog not initialized yet. */ }

                // Set a create/edit/view mode if possible
                if (trigger.is('[data-mode]')) {
                    var mode = trigger.data('mode');
                    popup.attr('data-mode', mode).data('mode', mode);
                }

                // show the popup
                mod.dialog(popup);

                // check for focus
                var focus = popup.find('.js-focus');
                if (focus.length) focus.focus();
            });
        },

        /**
         * Do a confirm challenge for dialogs with [data-confirm].
         * @param {jQuery} options.dialog        - jQuery element that has had .dialog() called on it
         * @param {string} [options.event]       - Event to be fired if the confirm button is pressed
                                                   default is 'ui:dialog:confirm'
         * @param {jQuery} [options.target]      - element to trigger the event. Default is the dialog.
         * @param {string} [options.confirmText] - Confirm text next to buttons
         * @param {string} [options.yesText]
         * @param {string} [options.noText]
         */
        confirm: function (options) {

            var dialog = options.dialog,
                target = options.target || dialog,
                event = options.event || 'ui:dialog:confirm',
                confirmText = options.confirmText || 'Are you sure?',
                yesText = options.yesText || 'Yes',
                noText = options.noText || 'No',
                oldButtons = dialog.dialog('option', 'buttons'),
                confirmButton = {
                    text: yesText,
                    click: function (ev) {
                        confirmSpan.remove();
                        dialog.dialog('option', 'buttons', oldButtons);
                        $(target).trigger(event);
                    },
                    'class': 'primary action js-primary-action'
                },
                cancelButton = {
                   text: noText,
                   click: function (ev) {
                       confirmSpan.remove();
                       dialog.dialog('option', 'buttons', oldButtons);
                   },
                   'class': 'js-secondary-action '
                },
                confirmSpan = $('<span>')
                .attr('class', 'fr')
                .css({'line-height': '36px'})
                .text(confirmText);

            dialog.dialog('option', 'buttons', [cancelButton, confirmButton]);
            dialog.closest('.ui-dialog').find('.ui-dialog-buttonpane').append(confirmSpan);
            dialog.on('dialogclose', function () {
                confirmSpan.remove();
            });
        },

        /** Add a success alert box. */
        alertSuccess: function (markup) {
            $('.main-container').addMessage({ message: markup, messageClass: 'success' });
        },

        /** Add an info alert box. */
        alertInfo: function (markup) {
            $('.main-container').addMessage({ message: markup, messageClass: 'info' });
        },

        /** Add a warning alert box. */
        alertWarning: function (markup) {
            $('.main-container').addMessage({ message: markup, messageClass: 'warning' });
        },

        /** Add an error alert box. */
        alertError: function (markup) {
            $('.main-container').addMessage({ message: markup, messageClass: 'error' });
        },

        /** Add a pending alert box. */
        alertPending: function (markup) {
            $('.main-container').addMessage({ message: markup, messageClass: 'pending' });
        },

        /** Remove all alert boxes from the page. */
        removeAlerts : function () { $('.main-container').removeMessages(); },

        /** Format a phone number input */
        formatPhone: function (input) {
            // Strip the input down to just numbers, then format.
            var stripped = input.value.replace(/[^\d]/g, ''),
                i, regex, format;

            if (stripped.length > 0) {
                for (i=0; i < globals.formats.phone.length; i++) {
                    regex = globals.formats.phone[i].regex;
                    format = globals.formats.phone[i].format;
                    if (regex.test(stripped)) {
                        input.value = stripped.replace(regex, format);
                        break;
                    }
                }
            } else {
                input.value = '';
            }
        },

        /** Enable or disable elements based on the state of a checkbox. */
        toggleInputs: function (checkbox) {

            checkbox = $(checkbox);
            var enable = checkbox.is('[data-toggle-inverse]') ? checkbox.not(':checked') : checkbox.is(':checked'),
                inputs = $('[data-toggle-group="' + checkbox.data('toggle') + '"]');

            inputs.each(function (idx, input) { $(input).prop('disabled', !enable); });
        },

        /**
         * Reindex the name of every input in a table to support spring binding.
         * Will also enable/disable any move up/move down buttons properly.
         *
         * @param {element, string} table - Element or css selector for the table/table ancestor.
         * @param {function} [rowCallback] - Optional function to fire after processing each row.
         *                                   Takes the row element as an arg.
         */
        reindexInputs: function (table, rowCallback) {

            table = $(table);
            var rows = table.find('tbody tr');

            rows.each(function (idx, row) {
                row = $(row);
                var inputs = row.find('input, select, textarea, button');

                inputs.each(function (inputIdx, input) {

                    input = $(input);
                    var name;

                    if (input.is('[name]')) {
                        name = $(input).attr('name');
                        input.attr('name', name.replace(/\[(\d+|\?)\]/, '[' + idx + ']'));
                    }
                });

                // fix up the move up/down buttons if there are any
                if (row.has('.js-up, .js-down').length) {
                    if (rows.length === 1) { // only one row
                        row.find('.js-up, .js-down').prop('disabled', true);
                    } else if (idx === 0) { // first row
                        row.find('.js-up').prop('disabled', true);
                        row.find('.js-down').prop('disabled', false);
                    } else if (idx === rows.length -1) { // last row
                        row.find('.js-up').prop('disabled', false);
                        row.find('.js-down').prop('disabled', true);
                    } else { // middle row
                        row.find('.js-up').prop('disabled', false);
                        row.find('.js-down').prop('disabled', false);
                    }
                }

                if (typeof(rowCallback) === 'function') rowCallback(row);
            });
        },

        /**
         * Adjusts row move up/down buttons so that the first row's move up
         * and the last row's move down buttons are disabled.
         *
         * @param {element, string} table - Element or css selector for the table/table ancestor.
         * @param {function} [rowCallback] - Optional function to fire after processing each row.
         *                                   Takes the row element as an arg.
         */
        adjustRowMovers: function (table, rowCallback) {

            table = $(table);
            var rows = table.find('tbody tr');

            rows.each(function (idx, row) {

                row = $(row);

                // fix up the move up/down buttons
                if (row.has('.js-up, .js-down').length) {
                    if (rows.length === 1) { // only one row
                        row.find('.js-up, .js-down').prop('disabled', true);
                    } else if (idx === 0) { // first row
                        row.find('.js-up').prop('disabled', true);
                        row.find('.js-down').prop('disabled', false);
                    } else if (idx === rows.length -1) { // last row
                        row.find('.js-up').prop('disabled', false);
                        row.find('.js-down').prop('disabled', true);
                    } else { // middle row
                        row.find('.js-up').prop('disabled', false);
                        row.find('.js-down').prop('disabled', false);
                    }
                }

                if (typeof(rowCallback) === 'function') rowCallback(row);
            });
        }
    };

    return mod;
})();

$(function() { util.ui.autowire(); });
