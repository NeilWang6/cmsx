/**
 * @author springyu
 * @userfor  运营场景专场数据源相关操作
 * @date  2013-1-17
 * @modify  by 姓名 on 日期 for 修改的内容点(每次修改都要新增一条)
 */
;(function($, D, DS) {

	DS.YunYing = {
		setDefineCodeEdit : function(el, iframeDoc) {
			var $cellDefine = el.find('.cell-cell-define');
			if($cellDefine && $cellDefine.length === 1) {
				iframeDoc._setDefineCodeEdit($cellDefine, iframeDoc.editTextarea);
				return;
			}
		},
		_getDsParam : function(dsmoduleparam) {
			var dataList, dsId, reqDsId = /"dataSource":"([0-9]+)"/,
			//
			topicId, reqTopicId = /"name":"topicId","value":"([0-9]+)"/,
			//
			blockId, reqBlockId = /"name":"blockId","value":"([0-9]+)"/;

			dataList = reqDsId.exec(dsmoduleparam);
			if(dataList) {
				dsId = dataList[1];
				dataList = '';
			}

			dataList = reqTopicId.exec(dsmoduleparam);
			if(dataList) {
				topicId = dataList[1];
				dataList = '';
			}
			dataList = reqBlockId.exec(dsmoduleparam);
			if(dataList) {
				blockId = dataList[1];
				dataList = '';
			}
			return {
				dsId : dsId,
				topicId : topicId,
				blockId : blockId
			};
		},
		showWaiting : function(dsmoduleparam, singerArea) {
            //var $pop = $('.js-dialog');
            var that = this, 
                dialogClass = 'js-dialog-waiting',
                $pop = $('.'+dialogClass);
			if (!$pop[0]){
                $pop = this._insertDialog('js-dialog-waiting');
            }
            
			var json = JSON.parse(D.storage() && D.storage().getItem(that.CONSTANTS.WAITING_KEY));
			var content = json.content, title = json.title, reqUrl = json.reqUrl, blockId = json.blockId;
            
			//var dsmoduleparam = $target.attr('data-dsmoduleparam');
            dsmoduleparam = JSON.stringify(dsmoduleparam);
			//console.log(dsmoduleparam);
			var dsParam = that._getDsParam(dsmoduleparam), htmlBlockId = dsParam && dsParam.blockId;

			if(blockId !== htmlBlockId) {
				var reqData = {};
				reqData['qtype'] = 1;
				reqData['dsmoduleparam'] = dsmoduleparam;
				$.get(reqUrl, reqData, function(jsonObj) {
					if(jsonObj) {
						if(jsonObj.success === true && jsonObj.count) {
							title = jsonObj.btntitle, content = jsonObj.content;
                            that._showWaitingDialog($pop, content, title);
                            
							D.storage && D.storage().setItem(that.CONSTANTS.WAITING_KEY, JSON.stringify({
								title : title,
								blockId : htmlBlockId,
								reqUrl : reqUrl,
								content : content
							}));
                            
						} else {
							//singerArea.find('js-yunying-waiting').remove();
							title = '';
							content = '';
						}
					}
				}, 'jsonp');
			} else {
                that._showWaitingDialog($pop, content, title);
            }
			
		},
        _showWaitingDialog: function($pop, content, title){
            if(!content) {
				return;
			}
            $footer = $('footer', $pop), btnCancel = $('.btn-cancel', $pop), btnClose = $('.close', $pop);
			$pop.addClass('js-rule-dialog');
			btnClose.unbind();
			btnCancel.unbind();
			$('.btn-submit', $pop).unbind();
			$('button.btn-submit', $footer).addClass('js-bt-save-rule');
            $('section', $pop).html(content);
			$('h5', $pop).html(title);
			/****/
			$.use(['ui-dialog', 'ui-draggable'], function() {
				$pop.dialog({
					modal : true,
					center : true,
					draggable : {
						handle : "header",
						containment : 'body'
					},
					fixed : true
				});
				//console.log('aaaa');
				btnCancel.bind('click', function() {
					$pop.dialog('close');
				});
				btnClose.bind('click', function() {
					$pop.dialog('close');
				});
			});
        },
        _insertDialog: function(className){
            var dialogHtml = '<div class="dialog-basic js-insert-dialog '+className+'">\
                                <div class="dialog-b">\
                                    <header>\
                                        <a class="close" href="#">关闭</a>\
                                        <h5>排期</h5>\
                                    </header>\
                                    <section></section>\
                                    <footer>\
                                        <button class="btn-basic btn-blue btn-submit" type="button">确 定</button>\
                                        <button class="btn-basic btn-gray btn-cancel" type="button">取 消</button>\
                                    </footer>\
                                </div>\
                            </div>';
            return $(dialogHtml).appendTo('body');
        },
		_reqWaiting : function(dsmoduleparam, data, singerArea) {
			var reqData = {}, that = this, reqUrl = data.configUrl, blockId = '', dsParam,
                strDsmoduleparam = JSON.stringify(dsmoduleparam);
			
            reqData['qtype'] = 1;
			reqData['dsmoduleparam'] = strDsmoduleparam;
			dsParam = that._getDsParam(strDsmoduleparam);
			blockId = dsParam && dsParam.blockId;
			
            if ( reqUrl ){
                $.get(reqUrl, reqData, function(json) {
                    D.storage().removeItem(that.CONSTANTS.WAITING_KEY);
                    if(json) {
                        //console.log(json);
                        if(json.success === true && json.count) {
                            var name = json.btntitle, reqContent = json.content, $ul = singerArea.find('.ds-param-div').eq(1);
                            
                            var $waiting = singerArea.find('.js-yunying-waiting');
                            //js-yunying-ds
                            if(!$waiting || !$waiting.length) {
                                //$ul.append('<li class="js-yunying-waiting">' + name + '</li>');
                                $waiting = $('<a href="#" class="btn-basic btn-blue js-yunying-waiting">'+name+'</a>').appendTo($ul);
                            }
                            
                            $waiting.data(D.box.editor.config.ATTR_DATA_DATA_SOURCE, dsmoduleparam);
                            
                            D.storage && D.storage().setItem(that.CONSTANTS.WAITING_KEY, JSON.stringify({
                                title : name,
                                blockId : blockId,
                                reqUrl : reqUrl,
                                content : reqContent
                            }));
                        } else {
                            that.removeWaiting(singerArea);
                        }
                    }
                }, 'jsonp');
            }
		},
        removeWaiting: function(singerArea){
            if (singerArea){
                singerArea.find('.js-yunying-waiting').remove();
            }
        },
		/**
		 * 运营场景 检查区块是否有排期
		 * @param {Object} $target
		 * @param {Object} singerArea   接入数据源的当前Tab
		 */
		checkIsWaiting : function(singerArea) {
			var dsId, btnText = '排期', data = {
				action : 'ds_datasource_action',
				event_submit_do_getDatasource : "true",
				retMethod : 'json'
			}, self = this, isShowWait = false;

			//if($target.hasClass('crazy-box-module')) {
				//dsmoduleparam = $target.data('dsmoduleparam');
                //数据源的数据不再从节点上取，而是从当前tab中取得  dsmodulesetparam.js
                var dsmoduleparam = D.box.datasource.getCurTabDatasource(singerArea);
                
                dsmoduleparam['paramList'] = D.box.datasource.resolveParamValue(dsmoduleparam['dsParamValue']);
                dsmoduleparam['dsParamValue'] = null;
                
				if(dsmoduleparam) {
					dsId = dsmoduleparam.dataSource;
                    
					if(dsId) {
						data['datasourceId'] = dsId;
                        
						$.post(D.domain + '/page/box/json.html', data, function(text) {
							//console.log(text);
							if(text) {
								var json = $.parseJSON(text);
								if(json && json.status === 'success') {
									var data = json.data;
									isShowWait = true;
									//console.log(data);
									//if(data && data.configUrl) {
                                    self._reqWaiting(dsmoduleparam, data, singerArea);
									//singerArea.find('.list-btns').append('<li class="js-yunying-waiting">' + btnText + '</li>');
									//}

								}
							}
						});

					}

				//}
			}
			//返回不成功，都删除排期按钮
			if(!isShowWait) {
				singerArea.find('.js-yunying-waiting').remove();
			}
		},
		/**
		 * 运营场景 展开数据源
		 * @param {Object} $target
		 */
		// showModuleDs : function(target, singerArea) {
		// 	// var that = this, dataList, dsId, topicId, dsParam,
		// 	// //
		// 	// blockId, dsmoduleparam, dsJson;

		// 	// if($target.hasClass('crazy-box-module')) {
		// 	// 	dsmoduleparam = $target.data('dsmoduleparam');
		// 	// 	if(dsmoduleparam) {
		// 	// 		dsId = dsmoduleparam.dataSource;
		// 	// 		dsJson = JSON.stringify(dsmoduleparam);
		// 	// 		dsParam = that._getDsParam(dsJson);
		// 	// 		topicId = dsParam && dsParam.topicId;
		// 	// 		blockId = dsParam && dsParam.blockId;

		// 	// 		if(dsId && topicId) {
		// 	// 			var topicInfo = D.box.datasource.Topic.loadBlocks(topicId, blockId, dsId), topicName, options;
		// 	// 			if(topicInfo && topicInfo.topicName) {
		// 	// 				topicName = topicInfo.topicName;
		// 	// 			}
		// 	// 			if(topicInfo && topicInfo.options) {
		// 	// 				options = topicInfo.options;
		// 	// 			}
		// 	// 			$('footer', '.js-dialog').show();
		// 	// 			D.Msg['confirm']({
		// 	// 				'title' : '数据源关联',
		// 	// 				'body' : '<div class="ds-body"><div class="yunying-row"><label >活动名称：</label><div class="name" id="topic_name">' + topicName + '</div></div><div class="yunying-row"><label>排期区块关联：</label><select class="" id="yunying_block_id">' + options + '</select></div></div>',
		// 	// 				'noclose' : true,
		// 	// 				'success' : function(evt) {
		// 	// 					var $yunyingBlockId = $('#yunying_block_id'), blockId = $yunyingBlockId.val(), isHas = false;
		// 	// 					if(dsmoduleparam) {
		// 	// 						paramList = dsmoduleparam.paramList;
		// 	// 						if(paramList) {
		// 	// 							for(var i = 0; i < paramList.length; i++) {
		// 	// 								var obj = paramList[i];
		// 	// 								if(obj && obj.name === 'blockId') {
		// 	// 									isHas = true;
		// 	// 									obj.value = blockId;
		// 	// 									break;
		// 	// 								}
		// 	// 							}
		// 	// 							if(!isHas) {
		// 	// 								paramList.push({
		// 	// 									name : 'blockId',
		// 	// 									value : blockId
		// 	// 								});
		// 	// 							}
		// 	// 						}
		// 	// 						$target.attr('data-dsmoduleparam', JSON.stringify(dsmoduleparam));
		// 	// 						that.checkIsWaiting($target, singerArea);
		// 	// 						D.BoxTools.setEdited();

		// 	// 					}
		// 	// 					evt.data.dialog.dialog('close');
		// 	// 					that._freshPage();
		// 	// 				}
		// 	// 			});
		// 	// 		}
		// 	// 	}
		// 	// }
		// 	var strHtml = '<div class="ds-body js-ds-body">';
		// 		strHtml += '<div class="ds-nav fd-clr">';
		// 		strHtml += '<ul class="list-tab-ds">';
		// 		strHtml += '</ul><a class="add-btn"></a></div>';
		// 		strHtml += '<div class="tab-b-con-ds"></div>';
		// 		strHtml += '</div>';
		// 		if(!target.hasClass('crazy-box-module')) {
		// 			return;
		// 		}
		// 		$('footer,button', '.js-dialog').show();
		// 		$('.js-dialog').addClass('ext-width');
		// 		D.Msg['confirm']({
		// 			'title' : '接入数据源',
		// 			'body' : strHtml,
		// 			'noclose' : true,
		// 			'success' : function(evt) {
		// 				var $tabDs = $('.tab-b-ds', '.js-dialog'), multiDs = [];
		// 				$tabDs.each(function(index, obj) {
		// 					var _$tabDs = $(obj), single = {};
		// 					single['dataSource'] = $('select[name=dataSource]', _$tabDs).val();
		// 					if(single['dataSource'] != '0') {
		// 						single['alias'] = $('input[name=alias]', _$tabDs).val();
		// 						single['note'] = $('input[name=note]', _$tabDs).val();
		// 						single['dsParamValue'] = D.box.datasource.getValue($('#checkForm', _$tabDs));
		// 						multiDs.push(single);
		// 					}
		// 				});
		// 				//console.log(multiDs);
		// 				var data = {
		// 					action : 'DsModuleAction',
		// 					event_submit_do_storeMultiDs : true,
		// 					multiDs : JSON.stringify(multiDs)
		// 				}
		// 				$.post(D.domain + '/page/box/json.html?_input_charset=UTF-8', data, function(text) {
		// 					var json = $.parseJSON(text), jsonArray = json.dsModuleList || [];
		// 					target.removeData('dsmoduleparam');
		// 					if(jsonArray && jsonArray.length) {
		// 						target.attr('data-dsmoduleparam', JSON.stringify(jsonArray));
		// 					} else {
		// 						target.removeAttr('data-dsmoduleparam');
		// 					}

		// 					evt.data.dialog.dialog('close');
		// 					$('.js-dialog').removeClass('ext-width');
		// 				});

		// 			},
		// 			'close' : function(evt) {
		// 				$('.js-dialog').removeClass('ext-width');
		// 			},
		// 			'complete' : function(evt) {
		// 				//$('.js-dialog').removeClass('ext-width');
		// 			}
		// 		});
		// 		//初始化数据源tab页面
		// 		$(document).trigger('box.datasource.MultiDs.init_datasource_event', [target]);

		// },
		/**
		 * 替换专场中不存在的区块Id
		 */
		handleBlockId : function($module, topicId) {
			var that = this, defaultValue = that.getDefaultValue(topicId);
			var blocks = D.storage().getItem(D.box.datasource.Topic.CONSTANTS.TOPIC_KEY);
			$module.each(function(index, _module) {
				var _$module = $(_module), dsmoduleparam = _$module.attr('data-dsmoduleparam'), dsJson, blockId, dsId;
				if(dsmoduleparam) {
					//console.log(dsmoduleparam);
					dsJson = that._getDsParam(dsmoduleparam);
					//console.log(dsJson);
					//console.log(defaultValue);
					dsId = dsJson && dsJson.dsId;
					blockId = dsJson && dsJson.blockId;
					//blockId = '123123124';

					reqBlock = new RegExp('"blockId"\:' + blockId + '\,', "gm");
					if(!reqBlock.test(blocks)) {
						var dsParamJson = JSON.parse(dsmoduleparam), paramList = dsParamJson && dsParamJson.paramList, obj;

						if(paramList) {
							for(var i = 0; i < paramList.length; i++) {
								obj = paramList[i];
								if(obj && obj.name === 'blockId') {
									if(dsId == '5' && defaultValue && defaultValue.pinId) {
										obj.value = defaultValue && defaultValue.pinId + "";
									}
									if(dsId == '6' && defaultValue && defaultValue.spId) {
										obj.value = defaultValue && defaultValue.spId + "";
									}

								}
							}
						}
						//console.log(JSON.stringify(dsParamJson));
						_$module.attr('data-dsmoduleparam', JSON.stringify(dsParamJson));
					}

				}

			});
		},
		/**
		 * 获得专场 第一个品区块和第一个商区块
		 * @param {Object} topicId
		 */
		getDefaultValue : function(topicId) {
			var blockList, blocks = D.storage().getItem(D.box.datasource.Topic.CONSTANTS.TOPIC_KEY), defaultPinId = '', defaultSpId = '';
			try {
				blockList = JSON.parse(blocks);
			} catch(e) {
				blockList = null;
			}
			if(!blockList) {
				blockList = D.box.datasource.Topic.queryBlocksByTopic(topicId);
			} else {
				if(topicId != blockList.topicId) {
					blockList = D.box.datasource.Topic.queryBlocksByTopic(topicId);
				}
			}
			if(blockList && blockList.data) {
				var dataList = blockList.data, _block;
				//console.log(dataList);
				//console.log(blockId);
				for(var i in dataList) {
					_block = dataList[i];
					if(_block && _block.blockId) {
						if(_block.blockType == 'pin' && !defaultPinId) {
							defaultPinId = _block.blockId;
						}
						if(_block.blockType == 'sp' && !defaultSpId) {
							defaultSpId = _block.blockId;
						}
					}
				}
			}
			return {
				pinId : defaultPinId,
				spId : defaultSpId
			};
		},
		previewArrangeBlock : function(arrangeBlock) {
			var that = this;
			if(arrangeBlock) {
				that._freshPage(arrangeBlock);
			}
		},
		/**
		 * fresh页面
		 * @param {Object} arrangeBlock
		 */
		_freshPage : function(arrangeBlock) {
			var docIframe = $('iframe#dcms_box_main');
			var doc = $(docIframe[0].contentDocument.document || docIframe[0].contentWindow.document);
			var options = {};
			if(arrangeBlock) {
				options['previewArrangeBlock'] = arrangeBlock;
			}
			options['previewUrl'] = '/page/box/fresh_draft.html';
			D.refreshContent.refresh(options, doc);
		}
	};
	DS.YunYing.CONSTANTS = {
		WAITING_KEY : 'waiting_topic_blocks'
	};

})(dcms, FE.dcms, FE.dcms.box.datasource);
