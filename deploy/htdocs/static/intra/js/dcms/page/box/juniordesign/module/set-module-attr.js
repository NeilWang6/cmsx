/**
 * ������������������
 * @author springyu
 * 2013-9-23
 */
;(function($, D) {
	D.showSettingAttr = function(callBack) {
		var $moduleId = $('#module-moduleid'), $draftId = $('#draftId'), data = {
			moduleId : $moduleId.val(),
			draftId : $draftId.val()
		};
		$.post(D.domain + '/page/box/settingModule.htm', data, function(text) {
			$('footer', '.js-dialog').show();
			D.Msg['confirm']({
				'title' : '��������',
				'noclose' : true,
				'body' : text ,
				'success' : function(evt) {
					var $moduleName = $('#module_name'), moduleName = $.trim($moduleName.val());
					if (!moduleName) {
						alert('�����빫����������!');
						return;
					}
				saveAttr(evt);
				}
			});
		}, 'text');
		var saveAttr = function(evt) {
			var $jsModuleAttr = $('#js_module_attr'), data = $jsModuleAttr.serialize();
			$.post(D.domain + '/page/box/json.html?_input_charset=utf-8', data, function(text) {
				var json = $.parseJSON(text);
				console.log(json);
				if (json && json.status === 'success') {
					callBack && typeof callBack === 'function' && callBack();
					evt.data.dialog.dialog('close');
				} else {
					alert('����ʧ�ܣ�');
					return;
				}
			}, 'text');
		}
	};
})(dcms, FE.dcms);
