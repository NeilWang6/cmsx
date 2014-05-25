/**
 * @author springyu
 * @userfor  专场数据相关操作
 * @date  2013-1-17
 * @modify  by 姓名 on 日期 for 修改的内容点(每次修改都要新增一条)
 */
;(function($, D, DS) {

	DS.Topic = {
		/**
		 * 根据专场ID查询区块信息，并保存在本地存储中
		 * @param {Object} topicId
		 */
		queryBlocksByTopic : function(topicId) {
			var that = this, data = {
				"topicId" : topicId,
				"action" : 'DsModuleAction',
				"event_submit_do_QueryBlocksByTopic" : 'true'
			}, dataList, topicName;

			D.storage().load(D.domain + '/page/box/json.html', function(retJson) {
				if(retJson && retJson.status === 'success') {
					dataList = retJson.data && retJson.data.dataList;
					topicName = retJson.data && retJson.data.topicName;
					//dataList.topicId = topicId;
					D.storage().removeItem(that.CONSTANTS.TOPIC_KEY);
					dataList && D.storage().setItem(that.CONSTANTS.TOPIC_KEY, JSON.stringify({
						data : dataList,
						topicId : topicId,
						topicName : topicName
					}));
				}
			}, data);
			return {
				data : dataList,
				topicId : topicId
			};
		},
		/**
		 * 从传入的组件中查找topicId，根据topicId查找区块信息
		 * @param {Object} $module
		 */
		loadTopic : function($module) {
			var that = this, isTopicId = false;
			for(var i = 0; i < $module.length; i++) {
				var _$module = $($module[i]), dsModuleParam = _$module.data('dsmoduleparam'), paramList = '';
				paramList = dsModuleParam && dsModuleParam.paramList;
				if(paramList) {
					for(var p in paramList) {
						var isTopicId = paramList[p] && paramList[p].name === 'topicId';
						if(isTopicId) {
							that.queryBlocksByTopic(paramList[p].value);
							//D.box.datasource.Topic.queryBlocksByTopic(paramList[p].value);
							break;
						}
					}
					if(isTopicId) {
						break;
					}
				}
			};
		},
		/**
		 * 根据topic显示区块信息
		 * @param {Object} topicId 专场
		 * @param {Object} blockId 区块
		 * @param {Object} dsId 数据源
		 */
		loadBlocks : function(topicId, blockId, dsId) {
			var blocks, blockList, options = '', defaultBlockId = '', defaultTopicId = topicId,topicName='',pinBlockIds=[],spBlockIds=[];
			if(blockId) {
				defaultBlockId = blockId;
			}

			if(defaultTopicId) {
				var blocks = D.storage().getItem(D.box.datasource.Topic.CONSTANTS.TOPIC_KEY);
				try {
					//blockList = JSON.parse(blocks);
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
				if(blockList){
					topicName =  blockList.topicName;
				}
				
				if(blockList && blockList.data) {
					var dataList = blockList.data, _block;
					options = '<option value="">请选择区块</option>';
					//console.log(blockId);
					for(var i in dataList) {
						_block = dataList[i];

						if(_block && _block.blockId) {
							if(dsId == '5' && _block.blockType == 'pin') {
								pinBlockIds.push(_block.blockId);
								if(_block.blockId == defaultBlockId) {
									options += '<option selected value="' + _block.blockId + '">' + _block.blockName + '</option>';
								} else {
									options += '<option value="' + _block.blockId + '">' + _block.blockName + '</option>';
								}
							}
							if(dsId == '6' && _block.blockType == 'sp') {
								spBlockIds.push(_block.blockId);
								if(_block.blockId == defaultBlockId) {
									options += '<option selected value="' + _block.blockId + '">' + _block.blockName + '</option>';
								} else {
									options += '<option value="' + _block.blockId + '">' + _block.blockName + '</option>';
								}
							}

						}
					}
				} else {
					console.log('专场ID:' + defaultTopicId + '的区块信息为空!');
				}
			}
			return {topicName:topicName,options:options,pinIds:pinBlockIds,spIds:spBlockIds};
		}
	};
	DS.Topic.CONSTANTS = {
		TOPIC_KEY : 'topic_blocks'
	};

})(dcms, FE.dcms, FE.dcms.box.datasource);
