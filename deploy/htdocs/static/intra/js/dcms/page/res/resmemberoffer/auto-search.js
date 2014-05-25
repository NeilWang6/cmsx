/**
 * @package
 * ��Դλ  �����Զ��Ƽ���ز���
 * @author: pingchun.yupc
 * @Date: 2014-01-4
 */
(function($, D) {

	var readyFun = [
	function() {
		/**
		 *��ǩɸѡ�ֶ�
		 */
		$('#auto_way').delegate('.js-filter-tag', 'click', function(event) {
			event.preventDefault();
			var that = this;
			D.Res.filterTag.call(that, $('#auto_way'));

		});
		/**
		 *��������ѡ��
		 */
		$('#auto_way').delegate('.js-sort-operation', 'click', function(event) {
			event.preventDefault();
			var that = this;
			D.Res.addSortOperation.call(that);
		});

	},
	/**
	 * ��ʼ��ҳ������
	 */
	function() {
		//����ֵ
		$('.js-text-between[type=hidden]', '#auto_way').each(function(index, obj) {
			var $self = $(this), _value = decodeURIComponent($self.val()), name = $self.attr('name'), $parent = $self.parent(), vals = '';
			if (_value) {
				vals = _value.split('~');
				$('#start_' + name, $parent).val(vals[0]);
				$('#end_' + name, $parent).val(vals[1]);
			}
		});
		//����ѡ��
		$('#mlr_field_row[type=hidden]', '#auto_way').each(function(index, obj) {
			var $self = $(obj), $parent = $self.parent(), _value = decodeURIComponent($self.val()), 
			//
			config = $self.data('config'), vals = '';
			if (_value) {
				vals = _value.split('-');
				$(config[0]['elem'],$parent).val(vals[0]);
				$(config[1]['elem'],$parent).val(vals[1]);
				$(config[2]['elem'],$parent).val(vals[2]);
			}
		});
		$('.hidden-sort-field[type=hidden]', '#auto_way').each(function(index, obj) {
			var $self = $(obj), $parent = $self.parent(), _value = decodeURIComponent($self.val()),
			//
			config = $self.data('config'), vals = '', $row = '', _val = '', _$row = '';
			if (_value) {
				vals = _value.split(';');
				if (vals && vals.length) {
					$row = $(config['row'], $parent);
					_val = vals[0];
					$(config['elem'], $row).val(_val);
				}
				for (var i = 1; i < vals.length; i++) {
					if (vals[i]) {
						_$row = $row.clone();
						$(config['add'], _$row).removeClass('add');
						$(config['add'], _$row).addClass('delete');
						$(config['elem'], _$row).val(vals[i]);
						$row.after(_$row);
					}
				}
			}
		});
	}];

	$(function() {
		for (var i = 0, l = readyFun.length; i < l; i++) {
			try {
				readyFun[i]();
			} catch(e) {
				if ($.log) {
					$.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
				}
			} finally {
				continue;
			}
		}
	});
})(dcms, FE.dcms);
