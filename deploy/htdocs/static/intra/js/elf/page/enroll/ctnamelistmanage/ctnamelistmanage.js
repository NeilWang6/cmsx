/**
 * @author zhuliqi
 * @usefor ��������ҳ��
 * @date   2013.04.28
 */
;(function($, T) {
    var readyFun = [
        //��ҳ
        function(){
             var data = {
                curPage: $('input#curpage').val(),
                page: $('input#page').val(),//��ҳ
                titlelist: $('input#titlelist').val(),//������
                leftContent: '<button type="button" id="cimingdan" class="btn-basic btn-blue">��������</button><button id="delmingdan" type="button" class="btn-basic btn-blue">ɾ������</button>',
                rightContent: '',
                limit: 3,
                width: '1000px',
                left: '210px',
                curPageInput: $('input#curpage'),
                form: $('#pagefrmbottom'),
                param: $('#pagefrmbottom input[name=page_num]'),
                noneShow:true
            }
            var pagelistall = new T.pagelistall(data);
            pagelistall.init(data);                      
        },
        //suggestbangding 
        function(){
            //�رյ�����
            closeffc();
            var topicSeriesJsonUrl=T.domain + '/enroll/v2012/topic_series.json';
            var seriesId = $('#js-select-series-id').val();
            //���һ
            new FE.tools.Suggestion('#js-select-series', {
                url : topicSeriesJsonUrl,
                data : {
                    'type' : '1'
                },
                paramName : 'seriesName',
                valInput : '#js-select-series-id',
                isDefaultItem : false
            });
            $('#js-select-series').live('change', function() {
                var e = $(this);
                if($.trim(e.val()) === '') {
                    $('#js-select-series-id').val('');
                };
                $('#js-select-topic-id').val('');
                $('#js-select-topic').val('');
            });
        },
		//��ҳ
		// function() {
		// 	var goToPageButton = $('a.js-jump-page-num,#jumpPageButton');
		// 	goToPageButton.click(function(e){
  //               if(this.id == "jumpPageButton"){
  //                   var int_page_number = $('#jumpPageInput').val()

  //               }else{

  //                   var int_page_number = $(this).attr('data-page');
  //               }
  //                var page_num,sumPage = parseInt($('#sumPage').text()),reg = /^[1-9]\d*$/;
  //                page_num = $.trim(int_page_number.toString());
                 
  //                if(page_num.match(reg) === null || parseInt(page_num) > sumPage) {
  //                   flowOpen($('#successBack'),'','<i class="tui-icon-36 icon-fail"></i><div class="msg">����������������1��'+ sumPage +')</div>',
  //                           {fadeIn: 500,
  //                           fadeOut: 500,
  //                           timeout: 1000,
  //                           center: true},
  //                           function(){})
  //                   return
  //                }
  //                $('#jumpPageInput').val(page_num);

  //                $('#pagefrmbottom').submit();
		// 	})
			
		// },
        //��ѯ
        function(){
            var button = $('#search'),
            buttonCan = $('#searchText'),
            flow = $('#enterButton');
            button.click(function(e){       
                $(this).attr('disabled')
                $('#searchForm').submit();
            })

        },
        //����������
        function(){
            var cimingdan = $('#cimingdan');
            var delmingdan  = $('#delmingdan');
            var dialog = $('#dialog-adddel');
            var showError = $('#showError').val(),
            errorInfo = $('#dialog-errorinfo'),
            successBack = $('#successBack'),
            changeForm = $('#changeForm');
            operate = $('#operate').val();
            //ִ��ˢ��ǰ������Ϣ
            var reflahInfo = function(){
                if(showError == 'true') {
                    flowOpen(successBack,
                            '�ɹ�',
                            '<i class="tui-icon-36 icon-success"></i><div class="msg">�����ɹ�</div>',
                            {
                                fadeIn: 500,
                                fadeOut: 500,
                                timeout: 1000,
                                center: true,
                                close: function(){
                                }
                            },
                            function(){})
                }
                //Ŀǰû�д�����Ϣ����ʾ
                // if(showError == 'false'){
                //     $.use('ui-dialog',function(){
                //         errorInfo.dialog({
                //             fadeIn: 500,
                //             fadeOut: 500,
                //             timeout: 1000,
                //             center: true
                //         })                       
                //     })
                // }                
            }
            //ȷ����������ҳ��
            if(showError !== '') {
                //ȷ���Ƿ�ͨ������ɾ����ť
                if($('#isSingleDelete').val() === ''){
                    $.use('ui-dialog',function(){
                        changeFormType(operate,changeForm);
                        dialog.dialog({
                            modal: true,
                            shim: true,
                            draggable: true,
                            center: true,
                            open: function(){                            
                                reflahInfo();
                            }
                        })    
                    })                    
                }else {
                    reflahInfo();
                }
            }

            cimingdan.live('click',function(event){
                dialog.attr('type','add');
                dialog.find('header').find('h5').text($(this).text());
                $.use('ui-dialog',function(){
                    dialog.dialog({
                        modal: true,
                        shim: true,
                        draggable: true,
                        center: true
                    })    
                })

            })

            delmingdan.live('click',function(){
                dialog.attr('type','del');
                dialog.find('header').find('h5').text($(this).text());
                $.use('ui-dialog',function(){
                    dialog.dialog({
                        modal: true,
                        shim: true,
                        draggable: true,
                        center: true
                    })    
                })

            })

        },
         //SELECT��������ύ
        function(){
            var selectLeiXing = $('#memberType'),
            selectSeries = $('#js-select-series'),
            description = $('#description'),
            infoDialog = $('#dialog-info'),
            dialog_adddel = $('#dialog_adddel');

            //�ж��Ƿ��Ǻ���������
            var findB = function() {
                var leixinValue = selectLeiXing.val();
                if(leixinValue == "b") {
                    selectSeries.find('option').eq(0).attr('selected',true);
                    selectSeries.attr('disabled','disabled');
                    description.parents(".item-form").removeClass("hide");
                } else{
                    selectSeries.removeAttr('disabled');
                    description.parents(".item-form").addClass("hide");
                }

            }
            findB();
            selectLeiXing.change(function(){
                findB();
            })

            //�ύ����
            $('#enter').click(function(e){
                var dialogType = $('#dialog-adddel').attr('type'),method="",
                series = $('#js-select-series-id'),
                ids = $('#ids');
                if( series.val() == 0 && $('#memberType option:selected').val() != 'b') {
                    flowOpen($('#successBack'),'','<i class="tui-icon-36 icon-fail"></i><div class="msg">��û��ѡ��ϵ��</div>',
                            {fadeIn: 500,
                            fadeOut: 500,
                            timeout: 1000,
                            center: true},
                            function(){})
                    return;
                }

                if( ids.val() == '' ) {
                    flowOpen($('#successBack'),'','<i class="tui-icon-36 icon-fail"></i><div class="msg">��û������memberId</div>',
                            {fadeIn: 500,
                            fadeOut: 500,
                            timeout: 1000,
                            center: true},
                            function(){})
                    return;
                }
                if( dialogType == 'del' ) {
                    method="event_submit_do_del";
                    $('#event_submit_do').attr('name',method);
                    sureDel($('#changeForm'),infoDialog)                    
                }else if(dialogType == 'add') {
                    method = "event_submit_do_add";
                    $('#event_submit_do').attr('name',method);
                    $('#changeForm').submit();
                }
            })

            //����ɾ��
            var form = $('#singleDel');
            $('div.libra-content').on('click','div.icon-del',function(){
                var parentsTd = $(this).parents('tr.font11').find('td');
                form[0].ids.value = $.trim(parentsTd.eq(1).find('a').text());
                var singleMember = $.trim(parentsTd.eq(3).text());
                if(singleMember == '������'){
                    form[0].memberType.value = 'w';
                }else if(singleMember == '������') {
                    form[0].memberType.value = 'b';
                }else{
                    form[0].memberType.value = 'r';
                }
                form[0].series.value = $(this).parents('.font11').find('td').eq(2).attr('value');
                $('#isSingleDelete').val('true');
                sureDel(form,infoDialog)
            })

        }
		
    ];
    //changeForm���ͱ��
    function changeFormType(type,changeForm){
        changeForm.parents('#dialog-adddel').attr('type',type).find('#event_submit_do').attr('name','event_submit_do_'+type);
        if(type == 'add') {
            $('#dialog-adddel').find('h5').text('��������');
        }else{

            $('#dialog-adddel').find('h5').text('ɾ������');
        }
    };
    //���ѿ򵯳��㷽��
    function flowOpen(flow,title,content,canshu,callback) {
        flow.find('section').html(content);
        flow.find('h5').html(title);
        $.use('ui-dialog',function(){
            flow.dialog(canshu)
        })
        callback();

   }
    //�����Ƿ�ɾ����Ա��ȷ����Ϣ
    function sureDel(form,infoDialog){

        $.use('ui-dialog',function(){
            infoDialog.dialog({
                modal: true,
                shim: true,
                draggable: true,
                center: true
            })
        })
        $('#delentenr').click(function(){
            //������֤����
            form.submit();
        })   

    }
    //������ɾ��������ķ���
    function closeffc() {
        $('.closefc,button.btn-cancel,a.close').click(function(){
            $(this).parents('div.dialog-basic').dialog('close');
        })
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
