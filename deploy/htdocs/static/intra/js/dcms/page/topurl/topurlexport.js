/**
 * ����topurl����
 */
(function($, D) {
    $(function() {
        $('#js-export').bind('click', function(e) {
            e.preventDefault();
             $('#topUrlHeader').submit();
        });
    });
})(dcms, FE.dcms);
