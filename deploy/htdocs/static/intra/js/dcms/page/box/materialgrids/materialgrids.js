(function($, D) {
	var form = $('#js-search-page'), readyFun = [/**
	 * ɾ��
	 */
	function() {
		$('#layoutType').change(function(e) {
			e.preventDefault();
			form.submit();
		});
	},
		//����վ�����Դ��ϵ
	function() {
		$('.js-save-resource').bind('click', function(event) {
			event.preventDefault();
			var data = {
				'action' : 'MaterialLibAction',
				'event_submit_do_saveLibMaterial' : true
			}, resourceIds = '', $materialId = $('#material_id'),$rightSelect = $('#rigth_select'), _rightSelect = $rightSelect[0];
			data['materialId'] = $materialId.val();
			if(_rightSelect) {
				for(var i = 0; i < _rightSelect.options.length; i++) {
					resourceIds += _rightSelect.options[i].value + ',';

				}
			}
			if(!resourceIds){
				alert("������زĿ���Ҫ����Դ��");
				return;
			}
			data['resourceIds'] = resourceIds;
			//console.log(data);
			$.post(D.domain + '/page/json.html', data, function(text) {
				var json = $.parseJSON(text);
				if(json.status==='success'){
					alert('����ɹ���');
					return;
				} else {
					alert('ʧ��');
					return;
				}
			});
		});
	},
	function() {
		//�����ѡ�е�Ԫ���ƶ����ұ�����
		$('#left_select').bind('dblclick', function(e) {
			var that = this, $rightSelect = $('#rigth_select');
			moveItem(that, $rightSelect[0], false);
		});
		$('#add').bind('click', function(e) {
			var $self = $('#left_select'), $rightSelect = $('#rigth_select');
			moveItem($self[0], $rightSelect[0], false);
		});
		//���ұ�ѡ�е�Ԫ���ƶ����������
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
	 * //�ƶ�ѡ�е���Ŀ selectʹ��
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
			} catch (e) {
				if($.log) {
					$.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
				}
			}
		})
	});

})(dcms, FE.dcms);
