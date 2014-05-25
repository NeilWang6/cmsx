/**
 * @author lusheng.linls
 * @usefor
 * 1.ר������ɾ��elf�����µ�csrftoken cookie ,��ֹ��alibaba-inc���µĳ�ͻ
 * 2.ɾ��alibaba-inc���·����ִ���csrftoken
 * @date   2012.09.27
 */

;(function($, T) {
    $.use('util-cookie', function() {
        //1.ר������ɾ��elf�����µ�csrftoken cookie ,��ֹ��alibaba-inc���µĳ�ͻ
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
        //2.ɾ��alibaba-inc���·����ִ���csrftoken
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
