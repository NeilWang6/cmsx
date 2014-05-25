/**
 * @author zhuliqi
 * @usefor 优质电池供应商
 * @date   2013.04.28
 */
;(function($, T) {
    var readyFun = [
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
                    $('#js-select-topic-id').val('');
                    $('#js-select-topic').val('');
                    seriesId = $('#js-select-series-id').val();
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
                    var judgeSubmit = function(_this){
                        $(_this).attr('disabled','disabled');
                        if(_this.id == 'submitButton') {
                            $('#event_do').attr('name','event_submit_do_add_offer')
                            $('#type').val('');
                            submitForm[0].attributes['action'].value ="";
                        }else if( _this.id == 'submitButton1'){
                        //删除
                            $('#type').val('');
                            $('#event_do').attr('name','event_submit_do_clean');
                            submitForm[0].attributes['action'].value = "";
                        }else if( _this.id == 'submitButton2') {
                            //导出
                            submitForm[0].attributes['action'].value="/enroll/offer_export.do";
                            $('#event_do').attr('name','event_submit_do_add_offer')
                        }
                        
                        submitForm.submit();
                    }
                    //验证环节
                    //非空
                    if( $('#ids').val() == "" && _this.id == "submitButton") {
                        flowOpen($('div.small'),'错误信息',' <i class="tui-icon-36 icon-fail"></i><div class="msg">您还没有输入offerId  </div>',{
                            fadeIn: 500,
                            fadeOut: 500,
                            timeout: 1000,
                            center: true
                        },function(){})
                        return;
                    }
                    //非数字
                    var val = $('#ids').val();
                    var reg = /^[0-9]\d*$/;
                    val = val.split("\n");
                    if(_this.id == "submitButton" || _this.id == "submitButton1"){
                        for (var i = 0; i <= val.length - 1; i++) {
                                if( val[i].match(reg) === null && val[i] != "") {
                                    flowOpen($('div.small'),'错误信息',' <i class="tui-icon-36 icon-fail"></i><div class="msg">存在非数字</div>',{
                                        fadeIn: 500,
                                        fadeOut: 500,
                                        timeout: 1000,
                                        center: true
                                    },function(){})
                                    return;                        
                                }                     
                        }                     
                    }

                    //验证系列和专场
                    if($('#js-select-series-id').val() == 0 || $('#js-select-topic-id').val() == 0) {
                        flowOpen($('div.small'),'错误信息','<i class="tui-icon-36 icon-fail"></i><div class="msg">请填写系列和专场</div>',{
                                fadeIn: 500,
                                fadeOut: 500,
                                timeout: 1000,
                                center: true
                        },function(){})
                        return
                    }
                    //清空专场
                    if( this.id == "submitButton1" && $('#ids').val() == "") {
                        var state = $('#state').val();
                        var message = "不填写offerId将清空专场对应的";
                        if(state == 'w') {
                           message += '白名单'; 
                        }else{
                            message += '黑名单';
                        }
                        flowOpen(dialog_sure,'提示信息',message,{
                            modal: true,
                            shim: true,
                            draggable: true,
                            center: true
                        },function(){
                            sureButton.click(function(){
                                judgeSubmit(_this);
                            })
                        },_this) 
                        return;
                    }

                    judgeSubmit(_this);

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
        callback(_this);

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
