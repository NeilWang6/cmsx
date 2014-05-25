/**
 * @author zhuliqi
 * @usefor 名单管理页面
 * @date   2013.04.28
 */
;(function($, T) {
    var readyFun = [
        //logind to memeberId
        function(){

                T.searchId('#searchId')
            
        },
        //suggestbangding
        function(){
            var topicSeriesJsonUrl=T.domain + '/enroll/v2012/topic_series.json';
            var seriesId = $('#js-select-series-id').val();
            //查找活动
            new FE.tools.Suggestion('#js-select-series', {
                url : topicSeriesJsonUrl,
                data : {
                    'type' : '1'
                },
                paramName : 'seriesName',
                valInput : '#js-select-series-id',
                isDefaultItem : false,
                complete: function(){
                    seriesId = $('#js-select-series-id').val();
                    $('#js-select-topic-id').val('');
                    $('#js-select-topic').val('');
                    jsSelectTopic.setConfig({
                        data : {
                            'type' : '2',
                            'seriesId' : seriesId
                        }
                    });
                }
            });
            $('#js-select-series').live('change', function() {
                var e = $(this);
                if($.trim(e.val()) === '') {
                    $('#js-select-series-id').val('');
                };
                $('#js-select-topic-id').val('');
                $('#js-select-topic').val('');
            });
            //查找专场
            var jsSelectTopic = new FE.tools.Suggestion('#js-select-topic', {
                url : topicSeriesJsonUrl,
                data : {
                    'type' : '2'
                },
                paramName : 'topicName',
                valInput : '#js-select-topic-id',
                isDefaultItem : false
            });
            $('#js-select-topic').live('change', function() {
                var e = $(this);
                if($.trim(e.val()) === '') {
                    $('#js-select-topic-id').val('');
                };
            });
        },
        //submit
        function(){
            var dialog_sure = $($('div.dialog-basic')[0]),
                sureButton = dialog_sure.find('button.mg-16'),
                delButton = dialog_sure.find('button.btn-cancel'),
                submitForm = $('#form1');
                $('#submitButton,#submitButton1,#submitButton2').click(function(){
                    var _this = this;
                    $('#type').val('in');
                    //验证环节
                    if( $('#ids').val() == "" ) {
                        flowOpen($($('div.dialog-basic')[1]),'错误信息',' <i class="tui-icon-36 icon-fail"></i><div class="msg">您还没有输入memberId  </div>',{
                            fadeIn: 500,
                            fadeOut: 500,
                            timeout: 1000,
                            center: true
                        },function(){})
                        return;
                    }

                    var judgeSubmit = function(_this){
                        if(_this.id == 'submitButton') {
                            $('#type').val('in');
                        }else if( _this.id == 'submitButton1'){
                            //删除
                            $('#type').val('out');
                        }
                        $(_this).attr('disabled');
                        submitForm.submit();
                    }

                    //提交表单
                    if($('#js-select-series-id').val() == 0 || $('#js-select-topic-id').val() == 0) {
                        flowOpen(dialog_sure,'提示信息','确认不选择系列和专场么？',{
                            modal: true,
                            shim: true,
                            draggable: true,
                            center: true
                        },function(){
                            sureButton.click(function(){
                                judgeSubmit(_this)
                            })
                        },_this) 

                    } else {
                        judgeSubmit(_this)
                    }
   
                })

        }

		
    ];
   //弹出弹出层
   function flowOpen(flow,title,content,canshu,callback,_this) {
        flow.find('section').html(content);
        flow.find('h5').html(title);
        $.use('ui-dialog',function(){
            flow.dialog(canshu)
        })
        $('button.btn-cancel,a.close').click(function(){
            $(this).closest('div.dialog-basic').dialog('close');
        }); 
        callback();

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
