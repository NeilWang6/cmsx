/**
 * @author springyu
 * @userfor  ר��ȡ����������ר��ID������ID�¼��
 * @date  2013-1-17
 * @modify  by ���� on ���� for �޸ĵ����ݵ�(ÿ���޸Ķ�Ҫ����һ��)
 */

;(function($, D) {
	var readyFun = [
	function() {
		var $select = $('.js-param-select', '.ds-param-block'), $topicId = $('.js-param-input', '.ds-param-block');
		loadBlocks($select, $topicId);
	},
	function() {
		var $select = $('.js-param-select', '.ds-param-block');
		$('.ds-param-block').delegate('.js-param-input', 'input', function(event) {
			loadBlocks($select, $(this));
		})
	}];
	var loadBlocks = function($select, $topicId) {
		var blocks, blockList, options = '', defaultBlockId = '', defaultTopicId = $topicId.val(), dsId = '';
		defaultBlockId = $select.data('value');
		dsId = $select.data('dsId');
		if(defaultTopicId) {
			var blocks = D.storage().getItem(D.box.datasource.Topic.CONSTANTS.TOPIC_KEY);
			try {
				blockList = JSON.parse(blocks);
			} catch(e) {
				blockList = null;
			}
			if(!blockList) {
				blockList = D.box.datasource.Topic.queryBlocksByTopic(defaultTopicId);
			} else {
				if(defaultTopicId != blockList.topicId) {
					blockList = D.box.datasource.Topic.queryBlocksByTopic(defaultTopicId);
				}
			}
			if(blockList&&blockList.data) {
				var dataList = blockList.data,_block;
				$select.empty();
				for(var i in dataList) {
					_block = dataList[i];
					if(_block && _block.blockId) {
						if(dsId == '5' && _block.blockType == 'pin') {
							if(_block.blockId == defaultBlockId) {
								options += '<option selected value="' + _block.blockId + '">' + _block.blockName + '</option>';
							} else {
								options += '<option value="' + _block.blockId + '">' + _block.blockName + '</option>';
							}
						}
						if(dsId == '6' && _block.blockType == 'sp') {
							if(_block.blockId == defaultBlockId) {
								options += '<option selected value="' + _block.blockId + '">' + _block.blockName + '</option>';
							} else {
								options += '<option value="' + _block.blockId + '">' + _block.blockName + '</option>';
							}
						}

					}
				}
				$select.append(options);
			} else {
				console.log('ר��ID:' + defaultTopicId + '��������ϢΪ��!')
			}
		}
	};

	$(function() {
		for(var i = 0, l = readyFun.length; i < l; i++) {
			try {
				readyFun[i]();
			} catch(e) {
				if($.log) {
					$.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
				}
			} finally {
				continue;
			}
		}
	});
})(dcms, FE.dcms);
