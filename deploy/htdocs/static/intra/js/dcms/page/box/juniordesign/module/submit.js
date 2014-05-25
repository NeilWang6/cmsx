/**
 * ���������鱣������ʾ
 * @author springyu
 * 2012-12-04
 */

;(function($, D) {
	D.submit = function(data,callback) {
		var config = {}, toLibUrl,editUrl,toLibName,tip;
		
		if(data.source && data.source=='module'){
			toLibUrl = D.domain + '/page/box/module_list_new.html?action=box_module_action&event_submit_do_query_module_list=true';
			editUrl=D.domain + '/page/box/create_code_module.html?overwrite=true';
			toLibName='�زĿ�';
			tip='���';
		}else{
			editUrl=D.domain + '/page/box/edit_module.html?type=public_block';
			toLibUrl = D.domain + '/page/box/public_block_list.html?action=public_block_action&event_submit_do_query_public_block=true';
			toLibName='���������';
			tip='��������';
		}
		config = {
			'toLibName' : toLibName,
			'tip' : tip,
			'url' : D.domain + '/page/box/json.html?_input_charset=utf-8',
			'toLibUrl' : toLibUrl,
			'editUrl' : editUrl,

		};
		$.post(D.domain + '/page/box/json.html?_input_charset=utf-8', data, function(text) {
			if(text) {
				var json = $.parseJSON(text), htmlCode = '';
				//console.log(json);
				if(json && json.status === 'success') {
					var pbName= data.name||json.data.name;
					callback&&typeof callback === 'function'&&callback();
					if(json.data.publicBlockId){
						config.editUrl = config.editUrl + '&moduleId=' + json.data.publicBlockId;
					}else{
						config.editUrl = config.editUrl + '&moduleId=' + json.data.moduleId;
					}
					
					htmlCode += '<div class="submit-ok"><div class="ok"></div>' + config.tip + '<span>"' + pbName + '"</span>���ύ�ɹ���</div>';
					htmlCode += '<div class="submit-next"><a href="' + config.toLibUrl + '" class="btn-basic  btn-gray">' + config.toLibName + '</a><a class="btn-basic  btn-gray" href="' + config.editUrl + '">���ر༭</a></div>';

					$('footer', '.js-dialog').hide();
					D.Msg['confirm']({
						'title' : '��ʾ��Ϣ',
						'body' : '<div class="header-dialog-content">' + htmlCode + '</div>',
						'complete' : function() {
							window.location = config.editUrl;
						}
					});
				} else {
					alert('����ʧ�ܣ�');
					return;
				}
			}

		});

	};
})(dcms, FE.dcms);
