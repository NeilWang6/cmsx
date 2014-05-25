/**
 * @package
 * ��Դλ  ������������JS
 * @author: pingchun.yupc
 * @Date: 2014-01-4
 */

;(function($, D) {

	var readyFun = [/**
	 *��ʼ��ҳ������
	 */
	function() {

		$('.js-select', '.js-data-param').each(function(index, obj) {
			var that = this, $self = $(this), config = $self.data('config'),
			//
			dataList = $self.data('inputConfig');
			appendOption.call(that, dataList, config);
		});
		$('.js-ds-param', '.js-data-param').each(function(index, obj) {
			var that = this, $self = $(this), $parent = $self.parent(), inputConfig = $self.data('inputConfig');
			if (inputConfig&&inputConfig.endHtml) {
				$('.js-desc', $parent).html(inputConfig.endHtml);
				$('.js-desc', $parent).attr('title', $('.js-desc', $parent).text());
			}
			if (inputConfig&&inputConfig.label) {
				$('.title', $self.closest('.js-field-row')).html(inputConfig.label);
			}
		});

	}];
	/**
	 *���select
	 */
	var appendOption = function(dataList, config) {
		var $target = $(this), strOption = '', options = '', selected = decodeURIComponent(config.selected);
		//if (dataList.label) {
		//	strOption += '<option value="">��ѡ��</option>';
		//} else {
			strOption += '<option value="">' + config.defLabel + '</option>';
		//}
		if (dataList && dataList.options) {
			options = dataList.options;
			for (var i = 0; i < options.length; i++) {
				if (selected == options[i].value) {
					strOption += '<option selected="selected" value="' + options[i].value + '">' + options[i].label + '</option>';
				} else {
					strOption += '<option value="' + options[i].value + '">' + options[i].label + '</option>';
				}

			}
			$target.append(strOption);
		}
	};
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
