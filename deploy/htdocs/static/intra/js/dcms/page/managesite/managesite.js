/**
 * @author springyu
 */
;(function($, D) {
	var readyFun = [
	//保存站点和资源关系
	function() {
		$('.js-save-resource').bind('click', function(event) {
			event.preventDefault();
			var data = {
				'action' : 'SiteManagerAction',
				'event_submit_do_BatchUpdateResourceSite' : true
			}, $type = $('#type'), resourceIds = '', $rightSelect = $('#rigth_select'), _rightSelect = $rightSelect[0];
			data['type'] = $type.val();
			if(_rightSelect) {
				for(var i = 0; i < _rightSelect.options.length; i++) {
					resourceIds += _rightSelect.options[i].value + ',';

				}
			}
			if(!resourceIds){
				alert("请添加站点需要的资源！");
				return;
			}
			data['resourceIds'] = resourceIds;
			//console.log(data);
			$.post(D.domain + '/admin/json.html', data, function(text) {
				var json = $.parseJSON(text);
				if(json.success){
					alert('保存成功！');
					return;
				}
			});
		});
	},
	/**
	 * 操作权限事件bind
	 */
	function() {
		//把左边选中的元素移动到右边来。
		$('#left_select').bind('dblclick', function(e) {
			var that = this, $rightSelect = $('#rigth_select');
			moveItem(that, $rightSelect[0], false);
		});
		$('#add').bind('click', function(e) {
			var $self = $('#left_select'), $rightSelect = $('#rigth_select');
			moveItem($self[0], $rightSelect[0], false);
		});
		//把右边选中的元素移动到左边来。
		$('#rigth_select').bind('dblclick', function(e) {
			var that = this, $leftSelect = $('#left_select');
			moveItem(that, $leftSelect[0], false);
		});
		$('#remove').bind('click', function(e) {
			var $self = $('#left_select'), $rightSelect = $('#rigth_select');
			moveItem($rightSelect[0], $self[0], false);
		});
	}];
	/**
	 * //移动选中的项目 select使用
	 * @param {Object} sObj
	 * @param {Object} tObj
	 * @param {Object} allFlg
	 */
	var moveItem = function(sObj, tObj, allFlg) {
		if(sObj == null || tObj == null)
			return;
		var i = 0;
		//alert(sObj.length);
		while(sObj.length > i) {
			if(allFlg || sObj.options[i].selected) {
				addOption(tObj, sObj.options[i].text, sObj.options[i].value);
				sObj.remove(i);
			} else {
				i++;
			}
		}
		sObj.selectedIndex = -1;
		tObj.selectedIndex = -1;
		return;
	};
	var addOption = function(oListbox, sName, sValue) {
		var oOption = document.createElement("option");
		oOption.appendChild(document.createTextNode(sName));

		if(arguments.length == 3) {
			oOption.setAttribute("value", sValue);
		}
		oListbox.appendChild(oOption);
	};
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
