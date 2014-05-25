/**
 * @package
 * 资源位  条件自动推荐相关操作
 * @author: pingchun.yupc
 * @Date: 2014-01-4
 */
(function($, D) {

	var readyFun = [
	function() {
		/**
		 *标签筛选字段
		 */
		$('#auto_way').delegate('.js-filter-tag', 'click', function(event) {
			event.preventDefault();
			var that = this;
			D.Res.filterTag.call(that, $('#auto_way'));

		});
		/**
		 *增加排序选项
		 */
		$('#auto_way').delegate('.js-sort-operation', 'click', function(event) {
			event.preventDefault();
			var that = this;
			D.Res.addSortOperation.call(that);
		});

	},
	/**
	 * 初始化页面数据
	 */
	function() {
		//区间值
		$('.js-text-between[type=hidden]', '#auto_way').each(function(index, obj) {
			var $self = $(this), _value = decodeURIComponent($self.val()), name = $self.attr('name'), $parent = $self.parent(), vals = '';
			if (_value) {
				vals = _value.split('~');
				$('#start_' + name, $parent).val(vals[0]);
				$('#end_' + name, $parent).val(vals[1]);
			}
		});
		//排序选项
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
