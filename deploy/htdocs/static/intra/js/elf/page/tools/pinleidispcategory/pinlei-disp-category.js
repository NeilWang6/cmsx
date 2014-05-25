;(function($,T){
    var readyFun = [

                        function(){
                            if ($(".action-success").val() == "Y" 
                                 && ( $(".operate-name").val()  == "ADD" || $(".operate-name").val()  == "DELETE" ) ){
                                      $.use('ui-dialog', function(){
                                        var msg = "���� �ɹ�!"
                                        if ( $(".operate-name").val() == "ADD"){
                                             msg = "��� �ɹ�!"
                                        }else if ( $(".operate-name").val() == "DELETE"){
                                             msg = "ɾ�� �ɹ�!"
                                        }
                                       $(".operate-success .msg").html(msg );
                                        $(".operate-success").dialog({
                                            fadeIn: 200,
                                            fadeOut: 200,
                                            timeout: 500,
                                            center: true
                                        });
                                    });
                            }

                            if ($(".error-code").val() != ""){
                                $.use('ui-dialog', function(){
                                    var msg = "���� ʧ�� !";
                                    if ( $(".error-code").val() == "NAME_IS_EXISTED"){
                                         msg = "����ʧ�� : ���ִ���!"
                                    }else if ( $(".error-code").val() == "NAME_IS_REQUIRED"){
                                         msg = "����ʧ�� : ����Ϊ��!"
                                    }
                                    $(".operate-fail .msg").html(msg);
                                    $(".operate-fail").dialog({
                                                fadeIn: 200,
                                                fadeOut: 200,
                                                timeout: 500,
                                                center: true
                                            });
                                    });
                                }
                        },

                        function(){
                               _getPinleiBybuId();
                        },

                        function(){
                           $('#buId').change(function() {
                               _getPinleiBybuId();
                            });
                        },

                        function(){
                            $('.category-query').click(function(){
                                if ($('#pinLeiId').val() == "" || $('#pinLeiId').val() == null || $('#pinLeiId').val() == "��ѡ��"){
                                    _showInfo("��ѡ��Ʒ�࣡");
                                    return;
                                }
                                $('#event_submit_do_').attr('name','event_submit_do_queryCategory');
                                $('.pinleiform').submit();
                            });
                        },

                        function(){
                            $('.category-delete').click(function(){

                                var selectedId = $('#currpinLeiId').val();
                                if (selectedId=="" || selectedId== null ){
                                    _showInfo("��ǰ��Ʒ�಻���ڣ�");
                                    return;
                                }
                                var delCatId = $('#delCatId').val();
                                if (delCatId == "" || delCatId == null){
                                    _showInfo("��ѡ����Ҫ�ӱ�Ʒ���Ƴ���ѡ��ɶ�ѡ��");
                                    return;
                                }

                                $('#event_submit_do_').attr('name','event_submit_do_delCategory');
                                $('.pinleiform').submit();
                            });
                        },

                        function(){
                             $('.category-add').click(function(){

                                var selectedId = $('#currpinLeiId').val();
                                if (selectedId=="" || selectedId == null){
                                    _showInfo("��ǰ��Ʒ�಻���ڣ�");
                                    return;
                                }
                                var addCatId = $('#addCatId').val();
                                if (addCatId == "" || addCatId== null ){
                                    _showInfo("��ѡ����Ҫ��ӵ���Ʒ���ѡ��ɶ�ѡ��");
                                    return;
                                }

                                $('#event_submit_do_').attr('name','event_submit_do_addCategory');
                                $('.pinleiform').submit();
                            });
                        }
 
    ];

        function _showInfo(msg){
            $('.dialog-info-pinlei .msg').html(msg);
            $.use('ui-dialog,ui-draggable', function(){
                var dialog = $('.dialog-info-pinlei').dialog({
                center: true,
                fixed:true,
                modal: true,
                shim: true,
                draggable: true,
                });

                $(".dialog-basic .btn-ok").click(function(){
                     dialog.dialog('close');
               });                 
            });
        }

        function _getPinleiBybuId(){

            var $buId = $('#buId').val();
            if ($buId == ""){
                return;
            }

           $.ajax({ 
                    type: "post",
                    url: "get_pinlei_bybuId.htm",
                    data: { buId: $buId },
                    dataType: "html",
                    complete: function(){
                    },
                    success: function(data){
                        $('#pinLeiId option').remove();   
                        var currpinLeiId=$('#currpinLeiId').val();
                        var jsonArray=toJsonObj(data);
                        $('#pinLeiId').append("<option value=''>��ѡ��</option>"); 
                        for(var e in jsonArray){
                            if (currpinLeiId == e){
                                $('#pinLeiId').append('<option value="' + e + '"selected>' + jsonArray[e] + '</option>'); 
                            }else{
                                $('#pinLeiId').append('<option value=' +e  + '>' + jsonArray[e]  + '</option>'); 
                            }
                        }
                    },
                    error:function(textStatus){
                    }
                });
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

})(jQuery,FE.tools);