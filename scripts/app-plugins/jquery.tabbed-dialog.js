/**
 * jQueryUI Tabbed Dialog Based on
 * http://forum.jquery.com/topic/combining-ui-dialog-and-tabs 
 * Modified to work by Joseph T. Parsons For jQueryUI 1.10 and jQuery 2.0.
 * Then modified a little more so that a [data-url] attribute on the main
 * dialog div is respected as a queue to load conent.
 */
$.fn.tabbedDialog = function (dialogOptions, tabOptions) {
    
    var initialized = this.hasClass('ui-dialog-content');
    var dynamic = this.is('[data-url]');
    
    dialogOptions = dialogOptions || {};
    tabOptions = tabOptions || {};
    
    if (!dialogOptions.dialogClass) {
        dialogOptions.dialogClass = 'ui-dialog-tabbed';
    } else {
        dialogOptions.dialogClass = dialogOptions.dialogClass + ' ui-dialog-tabbed';
    }
    
    if (initialized && dynamic) {
        // Tab markup is included in the ajaxed content, nuke our old tabbed title bar.
        this.tabs('destroy');
        this.parent().find('.ui-dialog-titlebar-tabbed').remove();
    }
    
    this.tabs(tabOptions);
    this.dialog(dialogOptions);
    
    // Bail out here when calling on an existing dialog that does not have dynamic content
    if (initialized && !dynamic) return;
    
    // Create the Tabbed Dialogue
    var tabul = this.find('ul:first');
    this.parent().addClass('ui-tabs').prepend(tabul).draggable('option', 'handle', tabul);
    tabul.append(
        $('<button>').attr('type', 'button').attr('role', 'button').attr('title', 'Close')
        .addClass('ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only ui-dialog-titlebar-close js-close')
        .append($('<span>').addClass('ui-button-icon-primary ui-icon ui-icon-closethick'))
        .append($('<span>').addClass('ui-button-text').text('Close'))
    )
    .addClass('ui-dialog-titlebar-tabbed');
    
    // Remove the dialog titlebar when creating for the first time, it won't be there later.
    if (!initialized) this.prev().remove();
    
    this.attr('tabIndex', -1).attr('role', 'dialog');
    
    // Add a title if needed
    var title = this.dialog('option', 'title');
    if (title) {
        tabul.prepend($('<li>').addClass('ui-dialog-tabbed-title').text(title));
    }
    
    // Make Only The Content of the Tab Tabbable
    this.bind('keydown.ui-dialog', function (ev) {
        
        if (ev.keyCode !== $.ui.keyCode.TAB) {
            return;
        }
        
        var tabbables = $(':tabbable', this).add('ul.ui-tabs-nav.ui-dialog-titlebar-tabbed > li > a'),
            first = tabbables.filter(':first'),
            last = tabbables.filter(':last');
        
        if (ev.target === last[0] && !ev.shiftKey) {
            first.focus(1);
            return false;
        } else if (ev.target === first[0] && ev.shiftKey) {
            last.focus(1);
            return false;
        }
    });
    
    // Give the First Element in the Dialog Focus
    var hasFocus = this.find('.ui-tabs-panel:visible :tabbable');
    if (hasFocus.length) hasFocus.eq(0).focus();
};