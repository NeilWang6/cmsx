
;(function($, T) {

    var readyFun = [

    function(){

        $('.mjc-convert').click(function(){

            var keyid = $(this).parent().find(".transfer-key-id").val();
            
            $.use('ui-dialog', function(){
                        var dialog = jQuery(".dialog-tranfer-keyword").dialog({
                            modal: true,
                            shim: true,
                            center: true,
                        });

                        $(".dialog-tranfer-keyword .btn-ok").click(function(){

                                $(".keyword-id").val(keyid);
                                $("#tranferKeywordForm").submit();
                        });                 
                                         
                        $('.dialog-tranfer-keyword .btn-cancel, .dialog-tranfer-keyword .close').click(function(){
                            dialog.dialog('close');
                        });
             });
        });
    },

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
                    alertInfo({type:"info",content:"ҳ�벻��1��"+ sumPage +"֮��!"},function(){});
                }else{
                    $('#keywordQueryManagerForm .pageNum').val(page_num);
                    $('#keywordQueryManagerForm').submit();
                }
            });      
        },
        function(){
                //��ҳ
            var data = {
                curPage: $('input#curpage').val(),
                page: $('input#page').val(),//��ҳ
                titlelist: $('input#titlelist').val(),//������
                leftContent: $('#bmc-submitURL').parent().html(),
                rightContent: '',
                limit: 3,
                width: '990px',
                left: '215px',
                curPageInput: $('input#curpage'),
                form: $('#pagefrmbottom'),
                param: $('#pagefrmbottom input[name=page_num]')
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