/**
 * @author xiaoquan
 */
;(function($, D) {
	var form = $('#js-search-page');
	var readyFun = [

	function() {
        
		$('#return_role_manage').bind('click', function(event) {
			event.preventDefault();
			window.location = 'manage_role_list.htm?action=acl_role_action&event_submit_do_get_all_roles=true';
		});
		
		$('.js-assign-permission').bind('click', function(event) {
			event.preventDefault();
			var roleId=$("#roleId").val()
			var $self = $(this), id = $self.data('id'), data = {
				action : 'AclPermissionAction',
				event_submit_do_operate_role_resource : true,
				permissionIds : id,
				operateType:'add',
				roleId:roleId
			};
			$.post('json.htm?_input_charset=UTF8', data, function(text) {
				var json = $.parseJSON(text);
				if(json && json.status === 'success') {
					alert('操作成功！');
					window.location.reload();
				} else {
					alert('删除失败！');
				}
			});
		 
		});

		$('.js-cancel-permission').bind('click', function(event) {
			event.preventDefault();	
			var roleId=$("#roleId").val()
			var $self = $(this), id = $self.data('id'), data = {
				action : 'AclPermissionAction',
				event_submit_do_operate_role_resource: true,
				permissionIds : id,
				operateType:'del',
				roleId:roleId
				
			};
			$.post('json.htm?_input_charset=UTF8', data, function(text) {
				var json = $.parseJSON(text);
				if(json && json.status === 'success') {
					alert('操作成功！');
					window.location.reload();
				} else {
					alert('删除失败！');
				}
			});

		});

	}];
	


    
 
	$(function() {
		$.each(readyFun, function(i, fn) {
			try {
				fn();
			} catch(e) {
				if($.log) {
					$.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
				}
			}
		})
	});

})(dcms, FE.dcms);
