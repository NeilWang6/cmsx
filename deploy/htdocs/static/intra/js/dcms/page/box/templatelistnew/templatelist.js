/**
 * @package FD.app.cms.box.pagelib
 * @author: zhaoyang.maozy
 * @Date: 2012-11-10
 */
;
(function($, D) {
	var form = $('#js-search-page'), url = D.domain + '/page/box/json.html',recycleResourceType='template';
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
				id : 'catogoryId',
				name : 'catogoryId',
				parentId : 'firstSelect',
				parentName : 'topCat',
				container : 'catalog_content',
				extraValue:'<option value="-1">δ���� </option>'
			});
			cascade.init();
		}
	},
	//add by hongss on 2012.11.23 for ����ͷ����ǰ�˵�
	function() {
		var params = $.unparam(location.search.replace('?', ''));
		if(params['template_type'] === 'page_layout') {
			$('.page-header .menu-layout').addClass('active');
			recycleResourceType='layout';
		} else if(params['template_type'] === 'box') {
			$('.page-header .menu-template').addClass('active');
			recycleResourceType='template';
		}
	},
	/**
	 * ɾ��
	 */
	function() {
		$('.oper-bar .btn-delete').click(function(e) {
			e.preventDefault();
			var _this = $(this), templateId = _this.data('template-id');

			FE.dcms.Msg.confirm({
				'title' : '��ʾ',
				'body' : 'ȷ��Ҫɾ����?',
				success : function(evt) {

					$.ajax({
						url : D.domain + "/page/box/template_draft_exist_checker.html",
						data : {
							"resourceId" : templateId
						},
						dataType : 'jsonp',
						success : function(o) {

							var data = o, content = '';
							if(data.msg == "fail") {
								content = "ϵͳ��������ϵ����Ա" + data.msg;
							} else {
								if(data.count > 0) {
									alert("ɾ��ʧ�ܣ���Ϊ�������ģ��������Ĳݸ�");
									return;
								}
								$.ajax({
									//url : D.domain + "/page/app_command.html?action=box_template_action&event_submit_do_delete_template=true&delete-templateId=" + templateId,
									url: D.domain + "/page/app_command.html?action=box_recycle_action&event_submit_do_delete=true&reourceId=" + templateId+"&resourceType="+recycleResourceType,
									type : "POST",
									async : false
								}).done(function(o) {
								}).fail(function() {
									alert('ϵͳ��������ϵ����Ա');
								});

								form.submit();
							}
						},
						error : function() {
						}
					});
				}
			});

		});
	},
	function() {
		$("dl.js-template").hover(function(e) {
			var that = this, self = $(that);
			if(!self.hasClass('preview')) {
				self.addClass('preview');
			}

		}, function() {
			var self = $(this);
			self.removeClass('preview');
		});

	}];

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

})(dcms, FE.dcms);
