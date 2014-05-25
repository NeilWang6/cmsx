(function($, D) {
    var readyFun = [
    function() {
        $('#gmtCreate').one('focus', function() {
            var self = $(this);
            $.use('ui-datepicker, util-date', function() {
                self.datepicker({
                    triggerType : 'focus',
                    select : function(e, ui) {
                        self.val(ui.date.format()).datepicker('hide');
                    }
                }).triggerHandler('focus');
            });
        });
        $('a.view-remarks').bind('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            var $self = $(this), $viewUnaudit = $('#view_apply_unaudit');
            $viewUnaudit.html($self.attr('title'));
            $viewUnaudit.show();
            $viewUnaudit.offset({
                'top' : $self.offset().top,
                'left' : $self.offset().left
            });
        });
        $('#js-dcmscontent').bind('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            $('#view_apply_unaudit').hide();
            $('#apply_unaudit').hide();
        });
    },
    function() {
        $('#js-apply-search-btn').bind('click', function(event) {
            $('#js-search-apply-form').submit();
        });
    }];
    $(function() {
        for(var i = 0, l = readyFun.length; i < l; i++) {
            try {
                readyFun[i]();
            } catch(e) {
                if($.log) {
                    $.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
                }
            } finally {
                continue;
            }
        }
    });
})(dcms, FE.dcms);
