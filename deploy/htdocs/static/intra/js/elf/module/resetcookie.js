/**
 * @author lusheng.linls
 * @usefor
 * 1.专门用来删除elf子域下的csrftoken cookie ,防止和alibaba-inc域下的冲突
 * 2.删除alibaba-inc域下非数字串的csrftoken
 * @date   2012.09.27
 */

;(function($, T) {
    $.use('util-cookie', function() {
        //1.专门用来删除elf子域下的csrftoken cookie ,防止和alibaba-inc域下的冲突
        $.util.cookie('_csrf_token', null, {
            path : '/',
            domain : '.elf.b2b.alibaba-inc.com'
        });
        $.util.cookie('_csrf_token', null, {
            path : '/',
            domain : '.elf-dev.alibaba-inc.com'
        });
        $.util.cookie('_csrf_token', null, {
            path : '/',
            domain : '.elf-test.china.alibaba-inc.com'
        });
        //2.删除alibaba-inc域下非数字串的csrftoken
        var csrf = $.util.cookie('_csrf_token', {
            path : '/',
            domain : '.alibaba-inc.com'
        });
        if(!$.isNumeric(csrf)) {
            $.util.cookie('_csrf_token', null, {
                path : '/',
                domain : '.alibaba-inc.com'
            });
        }
    });
})(jQuery, FE.tools);
