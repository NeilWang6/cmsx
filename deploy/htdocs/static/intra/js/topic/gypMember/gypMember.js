/**
 * @author zhuliqi
 * @usefor 名单管理页面
 * @date   2013.04.28
 */
;(function($, T) {
    var readyFun = [
        //翻页
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
                    flowOpen(successBack,'失败','<i class="tui-icon-36 icon-fail"></i><div class="msg">请输入正整数：（1到'+ sumPage +')</div>',{
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
        //查询,导出
        function(){
            var button = $('#search'),
            buttonCan = $('#memberId'),
            flow = $('#enterButton');
            button.click(function(e){
                $(this).attr('disabled')
                $('#QueryMemberForm').submit();
            })
            //到处
            var popButton = $('#popButton');
            popButton.click(function(){
                var memberId = $(this).attr('data-id');
                window.open('MemberExcel.do?memberId = memberId','_self');
            })
        },
        //弹出层内容
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
            //上次操作的提示信息
            var reflahInfo = function(){
                if(operate !== '' && operate !== 'DELETE') {
                    var htmlContent = '<i class="tui-icon-36 icon-message"></i><div class="msg">'+ showSuccess.val()  +'条数据成功更新';
                    if(showError.val()) {
                        htmlContent += ',以下ID无法成功导入，请确认拼写无误&nbsp;' + showError.val();
                        htmlContent = htmlContent.substring(0,htmlContent.length - 1);
                    }
                    htmlContent += '</div>';
                    flowOpen(successBack,
                            '成功',
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

            //确定是新载入页面
            if(operate !== '' || showSuccess.val() !== "") {
                //确定通过单个删除按钮
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
         //SELECT联动与表单提交
        function(){
            var infoDialog = $('#dialog-info');


            //提交部分
            $('#enter').click(function(e){
                var dialogType = $('#dialog-adddel').attr('type'),method=""
                ids = $('#memberIds'); 

                if( ids.val() == '' ) {
                    flowOpen($('#successBack'),'','<i class="tui-icon-36 icon-fail"></i><div class="msg">您没有输入会员Id</div>',
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

            //单个删除
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
    //changeForm类型变更
    function changeFormType(type,changeForm){
        if (type == "ADD") {         
            changeForm.parents('#dialog-adddel').attr('type',type).find('#event_submit_do').attr('name','event_submit_doAddMember');
            $('#dialog-adddel').find('h5').text('导入名单');
        }else {
            changeForm.parents('#dialog-adddel').attr('type',type).find('#event_submit_do').attr('name','event_submit_doDeleteMember');
            $('#dialog-adddel').find('h5').text('删除名单');
        }
    };
    //提醒框弹出层方法
    function flowOpen(flow,title,content,canshu,callback) {
        flow.find('section').html(content);
        flow.find('h5').html(title);
        $.use('ui-dialog',function(){
            flow.dialog(canshu)
        })
        callback();

   }
    //弹出是否删除会员的确认信息
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
            //所有验证内容
            form.submit();
        })   

    }
    //绑定所有删除弹出层的方法
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
