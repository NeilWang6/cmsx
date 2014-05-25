/**
 * @author zhuliqi
 * @usefor ��������ҳ��
 * @date   2013.04.28
 */
;(function($, T) {
    var readyFun = [
        //��ҳ
        function() {
            closeffc();
            var goToPageButton = $('a.js-jump-page-num,#jumpPageButton'),
            successBack = $('#successBack');
            goToPageButton.click(function(e){
                if(this.id == "jumpPageButton"){
                    var int_page_number = $('#jumpPageInput').val()

                }else{

                    var int_page_number = $(this).attr('data-page');
                }
                 var page_num,sumPage = parseInt($('#sumPage').text()),reg = /^[1-9]\d*$/;
                 page_num = $.trim(int_page_number.toString());
                 
                 if(page_num.match(reg) === null || parseInt(page_num) > sumPage) {
                    flowOpen(successBack,'ʧ��','<i class="tui-icon-36 icon-fail"></i><div class="msg">����������������1��'+ sumPage +')</div>',{
                        fadeIn: 500,
                        fadeOut: 500,
                        timeout: 1000,
                        center: true  
                    },function(){})
                    return
                 }
                 $('#jumpPageInput').val(page_num);

                 $('#pagefrmbottom').submit();
            })
            
        },
        //��ѯ,����
        function(){
            var button = $('#search'),
            buttonCan = $('#memberId'),
            flow = $('#enterButton');
            button.click(function(e){
                $(this).attr('disabled')
                $('#QueryMemberForm').submit();
            })
            //����
            var popButton = $('#popButton');
            popButton.click(function(){
                var memberId = $(this).attr('data-id');
                window.open('MemberExcel.do?memberId = memberId','_self');
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
            changeForm = $('#gypMemberForm'),
            operate = $('#operateName').val();


            var showSuccess = $('#showSuccess'),
            showError = $('#showError');
            //�ϴβ�������ʾ��Ϣ
            var reflahInfo = function(){
                if(operate !== '' && operate !== 'DELETE') {
                    var htmlContent = '<i class="tui-icon-36 icon-message"></i><div class="msg">'+ showSuccess.val()  +'�����ݳɹ�����';
                    if(showError.val()) {
                        htmlContent += ',����ID�޷��ɹ����룬��ȷ��ƴд����&nbsp;' + showError.val();
                        htmlContent = htmlContent.substring(0,htmlContent.length - 1);
                    }
                    htmlContent += '</div>';
                    flowOpen(successBack,
                            '�ɹ�',
                            htmlContent,
                            {
                                fadeIn: 500,
                                fadeOut: 500,
                                timeout: 1000,
                                center: true
                            },
                            function(){})                
                }                
            }

            //ȷ����������ҳ��
            if(operate !== '' || showSuccess.val() !== "") {
                //ȷ��ͨ������ɾ����ť
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
            cimingdan.click(function(event){
                dialog.attr('type','ADD');
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

            delmingdan.click(function(){
                dialog.attr('type','DELETE');
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
            var infoDialog = $('#dialog-info');


            //�ύ����
            $('#enter').click(function(e){
                var dialogType = $('#dialog-adddel').attr('type'),method=""
                ids = $('#memberIds'); 

                if( ids.val() == '' ) {
                    flowOpen($('#successBack'),'','<i class="tui-icon-36 icon-fail"></i><div class="msg">��û�������ԱId</div>',
                            {fadeIn: 500,
                            fadeOut: 500,
                            timeout: 1000,
                            center: true},
                            function(){})
                    return;
                }

                if( dialogType == 'DELETE' ) {
                    method="event_submit_doDeleteMember";
                    $('#event_submit_do').attr('name',method);
                    sureDel($('#gypMemberForm'),infoDialog)                    
                }else if(dialogType == 'ADD') {
                    method = "event_submit_doAddMember";
                    $('#event_submit_do').attr('name',method);
                    $('#gypMemberForm').submit();
                }
            })

            //����ɾ��
            var form = $('#singleDel');
            $('div.libra-content').on('click','div.icon-del',function(){
                var parentsTd = $(this).parents('tr.font11').find('td');
                form[0].memberIds.value = $.trim(parentsTd.eq(1).find('div').text());
                form[0].memberType.value = $.trim(parentsTd.eq(2).find('div').text());
                form[0].event_submit_do = 'event_submit_doDeleteMember';
                $('#isSingleDelete').val('true');
                sureDel(form,infoDialog)
            })

        }
        
    ];
    //changeForm���ͱ��
    function changeFormType(type,changeForm){
        if (type == "ADD") {         
            changeForm.parents('#dialog-adddel').attr('type',type).find('#event_submit_do').attr('name','event_submit_doAddMember');
            $('#dialog-adddel').find('h5').text('��������');
        }else {
            changeForm.parents('#dialog-adddel').attr('type',type).find('#event_submit_do').attr('name','event_submit_doDeleteMember');
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
