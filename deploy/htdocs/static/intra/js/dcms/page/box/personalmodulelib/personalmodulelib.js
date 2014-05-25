/**
 * @package FD.app.cms.box.pagelib
 * @author: zhaoyang.maozy
 * @Date: 2012-11-10
 */
;
(function($, D){
    var form = $('#js-search-page'), url = D.domain + '/page/box/json.html';
   
    // �������
    function apply(personalId, callback) {
        if(personalId) {
            // �������
            var data = {
                "action" : "PersonalLibAction",
                'event_submit_do_apply' : true,
                "moduleId" : personalId,
                "applyText" : ""
            };
            $.post(url, data, callback, 'json');
        }
    };
    
    var readyFun = [    
            /**
     * ��Ŀ����
     */
    function() {
        var resourceType = $('#resource_type').val();
         
        if(resourceType) {
            switch(resourceType) {
                case 'pl_cell':
                    resourceType = 'cell';
                    break;
                case 'pl_template':
                    resourceType = 'template';
                    break;
                case 'pl_module':
                    resourceType = 'module';
                    break;
                default:
                    resourceType = 'playout';
                    break;
            }
            var cascade = new D.CascadeSelect(D.domain + '/page/box/query_module_catalog.html', {
                params : {
                    type : resourceType,
                    catalogId : '0'
                },
                id:'catogoryId',
                name:'catogoryId',
                parentId:'firstSelect',
                parentName:'topCat',
                container : 'catalog_content'
            });
            cascade.init();
        }
    },

    /**
     * ����
     */
    function() {
        $(".oper-bar .btn-apply").click(function(e) {
            e.preventDefault();
            var moduleId = $(this).data("id");

            FE.dcms.Msg.confirm({
                'title' : '��ʾ',
                'body' : '<b>' + $(this).data("name") + '</b> �������Ϊ�زĿ�' + $(this).data("type") + '����ȷ���Ƿ�����!',
                success : function(evt) {
                    apply(moduleId, function(o) {
                        if(o) {
                            if(o.success) {
                                location.reload();
                            } else if(o.errorcode) {
                                if('empty' == o.errorcode) {
                                    FE.dcms.Msg.alert({
                                        'title' : '�������ʧ��',
                                        'body' : '�������Ϊ��!'
                                    });
                                } else if('status' == o.errorcode) {
                                    FE.dcms.Msg.alert({
                                        'title' : '�������ʧ��',
                                        'body' : '�Ѿ��������!'
                                    });
                                }
                            }
                        }
                    });
                }
            });

        });

        //ɾ��
        $('.oper-bar .btn-delete').click(function(e){
            e.preventDefault();
			  var _this = $(this), moduleId = _this.data('id');

		      FE.dcms.Msg.confirm({
			  	'title': '��ʾ',
			  	'body': 'ȷ��Ҫɾ����?',
			  	success: function(evt){	                
	                
	                $.ajax({
	                    url: D.domain + "/page/app_command.html?action=box_module_action&event_submit_do_delete_module=true&moduleId=" + moduleId,
	                    type: "POST",
	                    async: false
	                }).done(function(o){
	                }).fail(function(){
	                    alert('ϵͳ��������ϵ����Ա');
	                });
            
           			form.submit();
			  	}
			  });
            
        });

        // �رվܾ�����
        $(".refuse .close").click(function(e) {
            e.preventDefault();
            $(this).parents('.status').remove();
        })
    }
];
    
    $(function(){
        $.each(readyFun, function(i, fn){
            try {
                fn();
            } 
            catch (e) {
                if ($.log) {
                    $.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
                }
            }
        })
    });
    
})(dcms, FE.dcms);
