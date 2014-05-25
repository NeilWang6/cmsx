/**
 * @package FD.app.cms.box.pagelib
 * @author: zhaoyang.maozy
 * @Date: 2012-11-10
 */
;
(function($, D){
    var form = $('#js-search-page'), url = D.domain + '/page/box/json.html';
    ;
    
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
                container : 'catalog_content',
                extraValue:'<option value="-1">δ���� </option>'
            });
            cascade.init();
        }
    },
    /**
     * ɾ��
     */
    function(){
        $('.oper-bar .btn-delete').click(function(e){
            e.preventDefault();
			  var _this = $(this), moduleId = _this.data('module-id');

		      FE.dcms.Msg.confirm({
			  	'title': '��ʾ',
			  	'body': 'ȷ��Ҫɾ����?',
			  	success: function(evt){
	                
	                //url: D.domain + "/page/app_command.html?action=box_module_action&event_submit_do_delete_module=true&moduleId=" + moduleId, box_recycle_action
	                $.ajax({
	                    url: D.domain + "/page/app_command.html?action=box_recycle_action&event_submit_do_delete=true&reourceId=" + moduleId+"&resourceType=module",
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
    },
    /**
     * �༭
     */
    function() {
        $('.oper-bar .btn-edit').click(function(event){
			event.preventDefault();
			var that = this, $self = $(that), data = $self.data('module');
			$.getJSON(D.domain+'/page/box/can_edit_module.html',data,D.EditModule.edit);
		});
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
