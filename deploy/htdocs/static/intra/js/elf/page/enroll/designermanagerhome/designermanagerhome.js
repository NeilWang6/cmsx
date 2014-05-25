/**
 * @author: lusheng.linls
 * @Date: 2012-11-15
 */

;
(function($, T) {
    var topicCell = new T.Topiccell($("#tab"));
    var cloneHtml = '';
    var readyFun = [

    function() {
        search($('.js-search'), false);
    },

    //渲染查询结果


    function() {
        $(".detail").live("reload", function(event, data) {
            var detail = $(event.currentTarget);
            var condition = detail.closest('.f-tab-b').find('.condition');
            var curpage = $('input[name=curpage]');
            var pagesize = $('input[name=pagesize]');
            if(data.list === null || data.list.length < pagesize.val()) {
                var hasmore = $('input[name=hasmore]');
                hasmore.val('n');
            }
            if(data.list === null || data.list.length <= 0) {
                $('.msg').css("display", "block");
                return;
            }
            $('.js-topic-count').text('（'+data.count+'）');

            detail.css('height', (detail.height() + (Math.ceil((data.list.length) / 3)) * 262) + 'px');

            if(cloneHtml == '') {
                var clone = detail.clone();
                cloneHtml = clone.html();
            }
            var sample = '';
            for(var i = 0; i < data.list.length; i++) {
                sample = $(cloneHtml);
                sample.appendTo(detail);
                var mainRec = data.list[i];
                topicCell.renderTopic(sample, mainRec);
                sample.css("display", "block");
            }
            curpage.val(parseInt(curpage.val()) + 1);
        });
    },
    //各种触发查询操作事件绑定


    function() {
        //滚到页面底部加载
        $(document).scroll(function() {
            var el = $(this);
            var detail = $('.detail');
            var winHeight = $(window).height();
            if((el.scrollTop() + winHeight) < detail.height() + 32) {
                return;
            }
            var hasmore = $('input[name=hasmore]');
            if(hasmore.val() !== 'y') {
                return;
            }
            search($('.js-search'), true);
        });
        $('.load-failed').bind('click', function() {
            search($('.js-search'), true);
        });
    }];

    //查找 e：立即查询按钮;page：是否保留当前页
    var searchEnable = true;

    function search(e, page) {
        if(!searchEnable) {
            return;
        }
        searchEnable = false;
        var tab = e.closest(".f-tab-b");
        var form = e.closest("form");
        var curpage = $('input[name=curpage]');
        var pagesize = $('input[name=pagesize]');
        var loading = tab.find('.loading');
        var loadingFailed = tab.find('.load-failed');
        loadingFailed.addClass('display-none');
        loading.removeClass('display-none');
        var detail = tab.find('.detail');

        var params = form.serialize();
        var url = form.data("url");
        $.ajax({
            url: url + "?_input_charset=UTF-8",
            type: "post",
            data: params,
            error: function(jqXHR, textStatus, errorThrown) {
                searchEnable = true;
                loadingFailed.removeClass('display-none');
                loading.addClass('display-none');
                return;
            },
            success: function(rs, textStatus, jqXHR) {
                searchEnable = true;
                loading.addClass('display-none');
                if(!rs.success) {
                    loadingFailed.removeClass('display-none');
                    return;
                }
                detail.trigger("reload", rs);
            }
        });

    }


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
})(jQuery, FE.tools);