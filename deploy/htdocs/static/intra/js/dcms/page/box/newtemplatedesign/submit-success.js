;(function($, D) {

	function submitSuccess() {
		var data = {
			'returnType' : 'json',
			'action' : 'BoxTemplateAction',
			'event_submit_do_submit_template' : 'true'
		}, flag = $('#flag').val(), config, toLibUrl = '', editUrl = D.domain + '/page/box/new_edit_template.html?';
		toLibUrl = D.domain + '/page/box/template_list_new.html?action=box_template_action&event_submit_do_query_template_list=true';
		if(!flag) {
			flag = 'F';
		}
		$('.hidden').each(function(index, obj) {
			var $obj = $(obj);
			data[$obj.attr('name')] = $obj.val();
			if($obj.attr('name') !== 'draftId') {//回去编辑url
				editUrl += '&' + $obj.attr('name') + '=' + $obj.val();
			}
			if(flag === 'T' || flag === 't') {
				if($obj.attr('name') === 'templateType') {//去素材库 url
					if($obj.val() === 'pl_layout') {
						toLibUrl += '&template_type=page_layout';
					}
					if($obj.val() === 'pl_template') {
						toLibUrl += '&template_type=box';
					}
				}
			}
			if(flag === 'F' || flag === 'f') {
				if($obj.attr('name') === 'templateType') {//去个人库
					toLibUrl = D.domain + '/page/box/personal_lib.html?resource_type=' + $obj.val();
				}
			}

		});
		config = {
			'data' : data,
			'url' : D.domain + '/page/box/json.html?_input_charset=utf-8',
			'toLibUrl' : toLibUrl,
			'editUrl' : editUrl,
			'callback' : function(json) {
				var key, flag, tasks = {}, type, id, autoGenPic = 0, url;
				if(json) {
					autoGenPic = json.autoGenPic;
					if(autoGenPic == '1') {
						flag = json.flag;
						type = json.templateType;
						id = json.id;
						if(flag && (flag === 'F' || flag === 'f')) {
							key = type + '-' + id;
							url = D.domain + '/open/box_view_personal_lib.html?id=' + id + '&type=' + type;
						} else {
							if(type === 'pl_template' || type === 'pl_layout') {
								type = 'template';
							}
							key = type + '-' + id;
							url = D.domain + '/open/box_view.html?id=' + id + '&type=' + type;
						}

						tasks[key] = {
							'size' : '170x-1',
							'url' : url
						};
						tasks[key]['id'] = 'box_doc';
						tasks[key]['class'] = 'cell-page-main';
						// console.log(tasks);
						FE.dcms.Capture.start(tasks, function(text) {
							console.log(text);
						});
					}

				}
			}
		};

		var submitComplete = new D.box.ui.SubmitComplete(config);
		submitComplete.init();
	}


	D.submitSuccess = submitSuccess;
})(dcms, FE.dcms);
