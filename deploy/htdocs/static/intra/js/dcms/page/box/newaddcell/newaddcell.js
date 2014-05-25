/**
 * @package FD.app.cms.box.addcell
 * @author: qiheng.zhuqh
 * @Date: 2012-01-10
 */

;(function($, D) {
	var errorMessage = {
		'img_too_big' : '�ļ�̫��',
		'invalid_img_type' : '�ļ����Ͳ��Ϸ�',
		'img_optimization_reuired' : '��С����',
		'unauthorized' : '��ȫУ�鲻ͨ��',
		'unknown' : 'δ֪����'
	}, readyFun = [
	/**
	 * �ύ��֤
	 */
	function() {
		$('#btn-sub').click(function(e) {
			var isValid = checkValid();
			if(isValid) {
				_validator();
			}
		});
		var cellId = $('#cellId');
		if(cellId.val()) {
			$('#page span').text('�༭�ؼ�');
		} else {
			$('#page span').text('�½��ؼ�');
		}

		//��Ŀ����
		var cascade = new D.CascadeSelect(D.domain + '/page/box/query_module_catalog.html', {
			params : {
				type : 'cell',
				catalogId : '0'
			},
			htmlCode : '',
			container : 'catalog_content'
		});
		cascade.init();
	},
	/**
	 * ����Զ���Ӧ
	 */
	function() {
		$("input[name='autoFit']").click(function(e) {
			$('.width').css('display', $(this)[0].checked ? 'none' : '');
		});
	},
	// �ָ�ҳ������
	function() {
		if($('#cellId').val()) {
			var txtArea = $('#com-content');
			if(txtArea.val()) {
				var html = txtArea.val().replace(/data-boxoptions\s*=\s*([\"])([^"]*)\"/gi, function(s, g1, g2) {
					return "data-boxoptions='" + g2.replace(/&quot;/g, "\"") + "'";
				});
				txtArea.val(html);
			}
		}
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
		});
	});
	var checkValid = function() {
		var formEl = $('#addCellForm'), els = formEl.find('[data-valid]');
		var formValid = new FE.ui.Valid(els, {
			onValid : function(res, o) {
				var tip = $(this).nextAll('.dcms-validator-tip'), preTip = $(this).prevAll('.dcms-validator-tip'), msg;
				tip = $.merge(tip, preTip);
				if(tip.length > 1) {
					for(var i = 1, l = tip.length; i < l; i++) {
						tip.eq(i).remove();
					}
				}
				if(res === 'pass') {
					tip.hide();
					tip.removeClass('dcms-validator-error');
				} else {
					switch (res) {
						case 'required':
							//dialog��ʾ
							msg = '����д' + o.key;
							break;
						case 'sel-val':
							break;
						case 'float':
							msg = '��ȱ��������֣�������ʾ���أ�С����ʾ�ٷֱ�';
							break;
						default:
							msg = '����д��ȷ������';
							break;
					}
					tip.show();
					tip.text(msg);
					tip.addClass('dcms-validator-error');

				}
			}
		});
		return formValid.valid();
	};
	// Todo:
	// 1. ��֤cell�ĸ��ڵ��Ƿ����
	// 2. ��֤"cell-"Ϊǰ׺��class�Ƿ���ڣ�����֤��Ψһ��
	// 3. Ϊcell��Ψһ���ڵ����"crazy-box-cell"��class��
	// 4. Ϊ<style>��<script>��<link>����"data-for"�Զ������ԣ�����ֵΪ����ȡ�õ�"cell-"��ʼ��class��
	function _validator() {
		var text = $('div.textarea textarea'), dom, errorMessage = $('.submit-error-message'),
		//
		cellId = $('#cellId').val(), data, className, root, checkNode = $('div.auto-size input:checked'),
		//
		autoWidth = $('div.auto-size .width input');
		
		try {
			dom = $(text.val());
		} catch (e) {
			D.Msg.error({
				message : '��������ȷ��html���룡'
			});
			return;
		}

		root = dom.not(function() {
			if($.inArray(this.nodeName.toUpperCase(), ['LINK', 'SCRIPT', 'STYLE', '#TEXT']) === -1) {
				return false;
			}
			return true;
		});
		if(root.length !== 1) {
			D.Msg.error({
				message : '���ڵ㲻Ψһ�򲻴��ڸ��ڵ�'
			});
			return;
		}
		className = FE.dcms.BoxTools.getClassName(root, /^cell-/);
		if(className === "" || className === undefined) {
			//errorMessage.html('��"cell-"Ϊǰ׺��class������');
			D.Msg.error({
				message : '��"cell-"Ϊǰ׺��class������'
			});
			return;
		}
		$('#className').val(className);
		if(checkNode.length === 0) {
			if(autoWidth.val() === '') {
				//errorMessage.html('��֧������Ӧ����£�������д���');
				D.Msg.error({
					message : '��֧������Ӧ����£�������д���'
				});
				return;
			} else if(!($.isNumeric(autoWidth.val()))) {
				D.Msg.error({
					message : '��֧������Ӧ����£���д�Ŀ�ȱ���������'
				});
				//errorMessage.html('��֧������Ӧ����£���д�Ŀ�ȱ���������');
				return;
			}
		}
		root.addClass('crazy-box-cell');
		dom.filter('script,style,link').attr('data-for', className);
		dom.filter('script').attr('type', 'text/plain');
		// ��ֹjs������append��ʱ��ִ��
		var div = $('<div></div>');
		div.append(dom);
		dom.filter('script').attr('type', 'text/javascript');
		// script��ǩ��type���Ի�ԭ
		text.val(div.html());
		data = $('#addCellForm').serialize();
		var $autoGenPic=$('#auto_gen_pic');
		//console.log($autoGenPic.attr('checked'));
		
		// ��ajax��֤className�Ŀ�����,�������ύ
		$.ajax({
			type : "POST",
			url : "/page/box/json.html?_input_charset=UTF-8",
			data : data,
			cache : false,
			dateType : "json",
			success : function(text) {
				var json = $.parseJSON(text), htmlCode='';
				if(json && json.status === "success") {
					htmlCode += '<div class="submit-ok"><div class="ok"></div>�ؼ�<span>"' + $('#cell_name').val() + '"</span>���ύ�ɹ���</div>';
					htmlCode += '<div class="submit-next"><a href="/page/box/cell_list_new.html?action=box_cell_action&event_submit_do_query_cell_list=true" class="btn-basic  btn-gray">�زĿ�</a><a class="btn-basic  btn-gray" href="/page/box/new_add_cell.html?cellId='+json.data.id+'">���ر༭</a></div>';
						$('footer', '.js-dialog').hide();
					D.Msg['confirm']({
						'title' : '��ʾ��Ϣ',
						'body' : '<div class="header-dialog-content">' + htmlCode + '</div>',
						'complete' : function() {
							window.location = D.domain+'/page/box/new_add_cell.html';
						}
					});
					
					if($autoGenPic && $autoGenPic.attr('checked')) {
						var tasks={},key='cell-'+json.data.id;
						var url = D.domain + '/open/box_view.html?id=' +json.data.id + '&type=cell';
						tasks[key] = {
							'size' : '170x-1',
							'url' : url
						};
						tasks[key]['id'] = 'content';
						tasks[key]['class'] = 'crazy-box-cell';
						// console.log(tasks);
						FE.dcms.Capture.start(tasks, function(text) {
							console.log(text);
						});
					}

					//D.Msg.tip({
						//message : '����ɹ���'
					//});
				} else {
					if(json && json.data && json.data.hasCell) {
						//errorMessage.html('���ڵ��class:' + className + '�Ѿ����ڣ�');
						D.Msg.error({
							message : '���ڵ��class:' + className + '�Ѿ����ڣ�'
						});
						return;
					}
					D.Msg.error({
						message : '����ʧ�ܣ�'
					});
				}

			},
			error : function(o) {
				//errorMessage.html('(' + o.status + ') ' + o.statusText);
				D.Msg.error({
					message : '(' + o.status + ') ' + o.statusText
				});
			}
		});
	}

})(dcms, FE.dcms);
