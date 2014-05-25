/**
 * @package FD.app.cms.box.addcell
 * @author: qiheng.zhuqh
 * @Date: 2012-01-10
 */

;(function($, D) {
	var errorMessage = {
		'img_too_big' : '文件太大',
		'invalid_img_type' : '文件类型不合法',
		'img_optimization_reuired' : '大小超标',
		'unauthorized' : '安全校验不通过',
		'unknown' : '未知错误'
	}, readyFun = [
	/**
	 * 提交验证
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
			$('#page span').text('编辑控件');
		} else {
			$('#page span').text('新建控件');
		}

		//类目加载
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
	 * 点击自动适应
	 */
	function() {
		$("input[name='autoFit']").click(function(e) {
			$('.width').css('display', $(this)[0].checked ? 'none' : '');
		});
	},
	// 恢复页面内容
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
							//dialog显示
							msg = '请填写' + o.key;
							break;
						case 'sel-val':
							break;
						case 'float':
							msg = '宽度必须是数字（整数表示像素，小数表示百分表）';
							break;
						default:
							msg = '请填写正确的内容';
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
	// 1. 验证cell的父节点是否可用
	// 2. 验证"cell-"为前缀的class是否存在，并验证其唯一性
	// 3. 为cell的唯一父节点加上"crazy-box-cell"的class名
	// 4. 为<style>、<script>、<link>加上"data-for"自定义属性，属性值为上面取得的"cell-"开始的class名
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
				message : '请输入正确的html代码！'
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
				message : '父节点不唯一或不存在父节点'
			});
			return;
		}
		className = FE.dcms.BoxTools.getClassName(root, /^cell-/);
		if(className === "" || className === undefined) {
			//errorMessage.html('以"cell-"为前缀的class不存在');
			D.Msg.error({
				message : '以"cell-"为前缀的class不存在'
			});
			return;
		}
		$('#className').val(className);
		if(checkNode.length === 0) {
			if(autoWidth.val() === '') {
				//errorMessage.html('不支持自适应情况下，必须填写宽度');
				D.Msg.error({
					message : '不支持自适应情况下，必须填写宽度'
				});
				return;
			} else if(!($.isNumeric(autoWidth.val()))) {
				D.Msg.error({
					message : '不支持自适应情况下，填写的宽度必须是数字'
				});
				//errorMessage.html('不支持自适应情况下，填写的宽度必须是数字');
				return;
			}
		}
		root.addClass('crazy-box-cell');
		dom.filter('script,style,link').attr('data-for', className);
		dom.filter('script').attr('type', 'text/plain');
		// 防止js代码在append的时候被执行
		var div = $('<div></div>');
		div.append(dom);
		dom.filter('script').attr('type', 'text/javascript');
		// script标签的type属性还原
		text.val(div.html());
		data = $('#addCellForm').serialize();
		var $autoGenPic=$('#auto_gen_pic');
		//console.log($autoGenPic.attr('checked'));
		
		// 用ajax验证className的可用性,若是则提交
		$.ajax({
			type : "POST",
			url : "/page/box/json.html?_input_charset=UTF-8",
			data : data,
			cache : false,
			dateType : "json",
			success : function(text) {
				var json = $.parseJSON(text), htmlCode='';
				if(json && json.status === "success") {
					htmlCode += '<div class="submit-ok"><div class="ok"></div>控件<span>"' + $('#cell_name').val() + '"</span>已提交成功！</div>';
					htmlCode += '<div class="submit-next"><a href="/page/box/cell_list_new.html?action=box_cell_action&event_submit_do_query_cell_list=true" class="btn-basic  btn-gray">素材库</a><a class="btn-basic  btn-gray" href="/page/box/new_add_cell.html?cellId='+json.data.id+'">返回编辑</a></div>';
						$('footer', '.js-dialog').hide();
					D.Msg['confirm']({
						'title' : '提示信息',
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
						//message : '保存成功！'
					//});
				} else {
					if(json && json.data && json.data.hasCell) {
						//errorMessage.html('根节点的class:' + className + '已经存在！');
						D.Msg.error({
							message : '根节点的class:' + className + '已经存在！'
						});
						return;
					}
					D.Msg.error({
						message : '保存失败！'
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
