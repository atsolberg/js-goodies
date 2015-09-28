var globals = {
    
    dev_mode: true,
    
    events: {
        animationend: 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
        pagingend: 'ui:paging:end'
    },
    
    formats: {
        date: {
            full: 'MM/DD/YYYY HH:mm:ss zz',
            full_hm: 'MM/DD/YYYY HH:mm zz',
            long_date_time: 'MMM DD hh:mm:ss A',
            long_date_time_hm: 'MMM DD hh:mm A',
        },
        phone: [{
                regex: /^(\d{1})(\d{3})(\d{3})(\d{4})[x]{1}(\d{0,3})$/,
                format: '$1 ($2) $3-$4x$5'
            }, {
                regex: /^(\d{1})(\d{3})(\d{3})(\d{4})$/,
                format: '$1 ($2) $3-$4'
            }, {
                regex: /^(\d{3})(\d{3})(\d{4})$/,
                format: '($1) $2-$3'
            }, {
                regex: /^(\d{3})(\d{4})$/,
                format: '$1-$2'
            }]
    },
    
    keys: { up: 38, down: 40, left: 37, right: 39, enter: 13, escape: 27 },
    
    // Common selectors
    selectors: {
        // Any of the paging controls (previous, next, page counts)
        paging : '.paging-area .previous-page .button, .paging-area .next-page .button, .paging-area .page-size a'
    },
    
    timezone: jstz.determine().name(),
    
    rp: {
        updater_delay: 4000
    }
    
};