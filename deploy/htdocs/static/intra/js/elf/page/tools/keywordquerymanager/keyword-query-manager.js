

/**
 * @author cheng.zhangch
 * @usefor 页面导航
 * @date   2013.04.29
 */
;(function($, T) {

    var readyFun = [
        //翻页
        function() {
            var goToPageButton = $('a.js-jump-page-num,#jumpPageButton');

            goToPageButton.click(function(e){
                if(this.id == "jumpPageButton"){
                    var int_page_number = $('#jumpPageInput').val()
                }else{
                    var int_page_number = $(this).attr('data-page');
                }
                var page_num,sumPage = parseInt($('#sumPage').text()),reg = /^[1-9]\d*$/;
                page_num = $.trim(int_page_number.toString());
                     
                if(page_num.match(reg) === null || parseInt(page_num) > sumPage ||  parseInt(page_num) < 1) {

                    alertInfo({type:"info",content:"页码不在1和"+ sumPage +"之间!"},function(){});
                }else{
                    $('#keywordQueryManagerForm .pageNum').val(page_num);
                    $('#keywordQueryManagerForm').submit();
                }
            }) ;
            
        },
        function(){
                //分页
            var data = {
                curPage: $('input#curpage').val(),
                page: $('input#page').val(),//几页
                titlelist: $('input#titlelist').val(),//多少条
                leftContent: $('#bmc-submitURL').parent().html(),
                rightContent: '',
                limit: 3,
                width: '990px',
                left: '215px',
                curPageInput: $('input#curpage'),
                form: $('#keywordQueryManagerForm'),
                param: $('#keywordQueryManagerForm input[name=pageNum]')
            }
            $('#bmc-submitURL').parent().remove()
            var pagelistall = new FE.tools.pagelistall(data);
            pagelistall.init(data);
        }
    ];

    function funcDeleteSpaces(str) {
        var count = 0;
        for (var i = 0; i < str.length; i++) {
            if (str.charAt(i) == " ") {
                count++;
            } else {
                break;
            }
        }

        str = str.substring(count, str.length);

        count = 0;

        for (var i = str.length; i >=0; i--) {
            if (str.charAt(i - 1) == " ") {
                count++;
            } else {
                break;
            }
        }

        str = str.substring(0, str.length - count);
        return str;
    }


    $(function() {
        $.each(readyFun, function(i, fn) {
            try {
                fn();
            } catch (e) {
                if($.log) {
                    $.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
                }
            }
        })
    });

})(jQuery, FE.tools);