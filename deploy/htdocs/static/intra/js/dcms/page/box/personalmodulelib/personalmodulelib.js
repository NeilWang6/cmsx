/**
 * @package FD.app.cms.box.pagelib
 * @author: zhaoyang.maozy
 * @Date: 2012-11-10
 */
;
(function($, D){
    var form = $('#js-search-page'), url = D.domain + '/page/box/json.html';
   
    // 申请审核
    function apply(personalId, callback) {
        if(personalId) {
            // 申请审核
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
     * 类目加载
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
     * 申请
     */
    function() {
        $(".oper-bar .btn-apply").click(function(e) {
            e.preventDefault();
            var moduleId = $(this).data("id");

            FE.dcms.Msg.confirm({
                'title' : '提示',
                'body' : '<b>' + $(this).data("name") + '</b> 将申请成为素材库' + $(this).data("type") + '，请确认是否申请!',
                success : function(evt) {
                    apply(moduleId, function(o) {
                        if(o) {
                            if(o.success) {
                                location.reload();
                            } else if(o.errorcode) {
                                if('empty' == o.errorcode) {
                                    FE.dcms.Msg.alert({
                                        'title' : '申请入库失败',
                                        'body' : '入库内容为空!'
                                    });
                                } else if('status' == o.errorcode) {
                                    FE.dcms.Msg.alert({
                                        'title' : '申请入库失败',
                                        'body' : '已经申请入库!'
                                    });
                                }
                            }
                        }
                    });
                }
            });

        });

        //删除
        $('.oper-bar .btn-delete').click(function(e){
            e.preventDefault();
			  var _this = $(this), moduleId = _this.data('id');

		      FE.dcms.Msg.confirm({
			  	'title': '提示',
			  	'body': '确定要删除吗?',
			  	success: function(evt){	                
	                
	                $.ajax({
	                    url: D.domain + "/page/app_command.html?action=box_module_action&event_submit_do_delete_module=true&moduleId=" + moduleId,
	                    type: "POST",
	                    async: false
	                }).done(function(o){
	                }).fail(function(){
	                    alert('系统错误，请联系管理员');
	                });
            
           			form.submit();
			  	}
			  });
            
        });

        // 关闭拒绝理由
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
