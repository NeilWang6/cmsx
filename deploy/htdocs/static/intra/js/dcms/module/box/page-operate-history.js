(function($,D,undefined){
	
	var win = window,
		doc = document,
		uid = 0;
		NODE_TAG = '^node^';

	/**
     *	回退历史保存数据记录
     */	 
	var PageOperateHistoryRecords = {
		undoData:[],
		redoData:[],
		/**
         * @methed saveData 保存用户页面操作的行为数据
         * @param param 依赖于各个函数需要使用的数据结构，saveData不关心数据结构，只要做好存储即可
         */
		saveData:function(param){
			var self = this;

			//新一轮编辑时，恢复操作原有数据置空，如果不清空，会导致恢复是之前的操作
			self.redoData.length = 0;
			//做个简单的处理，避免内存消耗过多
			if(self.undoData.length>=200) self.undoData.shift();
			
			var temp;
			if($.type(param)=='object'){
				temp = [param];
			}
			else{
				temp = param;
			}
			for(var i=0;i<temp.length;i++){
				temp[i].uid = ++uid;
			}
			self.undoData.push(param);

			self._triggerMemoryChangeEvent();

			return true;
		},
		/**
         * @methed getRedoData 获取恢复的数据
         * @return {object|array} 恢复动作数据
         */
		getRedoData:function(){
			var self = this;
			//是否可恢复
			var res;
			if(self._canRedo()){
				res = self.redoData.pop();
				self.undoData.push(res);
				
			}
			self._triggerMemoryChangeEvent();
			return res;
		},
		/**
         * @methed getUndoData 获取回退的数据
         * @return {object|array} 回退动作数据
         */
		getUndoData:function(){
			var self = this;
			//是否可撤销
			var res;
			if(self._canUndo()){

				res = self.undoData.pop();

				self.redoData.push(res);

				
			}
			self._triggerMemoryChangeEvent();
			return res;
		},
        
		/**
		 * @methed _canUndo 返回是否有数据可以撤销
		 * @return {boolean}
		 */
		_canUndo:function(){
			var result;
			result = (this.undoData.length>0) ? true : false;
			return result;
		},
		/**
		 * @methed _canRedo 返回是否有数据可以恢复
		 * @return {boolean}
		 */
		_canRedo:function(){
			var result;
			result = (this.redoData.length>0) ? true : false;
			return result;
		},
		/**
		 * @methed _triggerMemoryChangeEvent 触发历史操作数据的变更事件
		 */
		_triggerMemoryChangeEvent:function(){
		
			var self = this;
			
			$(win).trigger('PageOperateHistory.change',{
				undoDataLength:self.undoData.length,
				redoDataLength:self.redoData.length
			});
		}
	};
	
	/**
     *	回退操作
     */	 
	var PageOperateHistory = {
		init:function(iframeBody){
			var self = this;

			var appendNode = $('#operation_area .operation-redo ul');

			if(appendNode.length>=1){
				appendNode = appendNode[0];
			}	
				
			$('<li/>').html('<a href="#" class="dcms-box-hand  dcms-box-abtn disbaled" title="copy" id="operate-undo">撤销</a>').appendTo(appendNode);
			
			$('<li/>').html('<a href="#" class="dcms-box-hand  dcms-box-abtn disbaled" title="copy" id="operate-redo">恢复</a>').appendTo(appendNode);
			
			$('<div class="undo-tips" id="undo-tips">撤销成功了!:)</div>').appendTo($('body'));
			
			var isCompleted = true;
			
			
			$(win).bind('PageOperateHistory.change',function(event,param){
				
				if(param.undoDataLength==0){
					$('#operate-undo').addClass('disbaled');
				}else{
					$('#operate-undo').removeClass('disbaled');
				}

				if(param.redoDataLength==0){
					$('#operate-redo').addClass('disbaled');
				}else{
					$('#operate-redo').removeClass('disbaled');
				}


			});

			$('#operate-redo').bind('click',function(e){
				e.preventDefault();
				
                D.DropInPage&&D.DropInPage.hideAllSingers();
				var self = this;
				if($(self).hasClass('disbaled')) return;
				
				if(!isCompleted) return;
				isCompleted = false;
				$(win).trigger('PageOperateHistory.redo',{
					callback:function(isSuccessed,isEmpty){
						if(isEmpty){
							$(self).addClass('disbaled');
						}
						$('#undo-tips').html('恢复成功了!:)').css('display','block').css('opacity',1).animate({opacity: 1},1000,function(){
							$('#undo-tips').css('display','none');
							
							isCompleted = true;
						});
						
					}
				});
			});

			$('#operate-undo').bind('click',function(e){
				e.preventDefault();
				
				//关闭高亮框以及浮出的编辑框
				
				D.DropInPage&&D.DropInPage.hideAllSingers();
				var self = this;
				if($(self).hasClass('disbaled')) return;
				
				if(!isCompleted) return;
				isCompleted = false;
				$(win).trigger('PageOperateHistory.undo',{
					callback:function(isSuccessed,isEmpty){
						if(isEmpty){
							$(self).addClass('disbaled');
						}
						$('#undo-tips').html('撤销成功了!:)').css('display','block').css('opacity',1).animate({opacity: 1},1000,function(){
							$('#undo-tips').css('display','none');
							isCompleted = true;
						});
						
					}
				});
			});
			
			$(win).bind('PageOperateHistory.save',function(evnet,obj){
				
				PageOperateHistoryRecords.saveData(obj.param);
				
			});

			$(win).bind('PageOperateHistory.undo',function(evnet,param){
				
				var data = PageOperateHistoryRecords.getUndoData();
                
				if(!data){
					param&&param.callback&&param.callback(true);
					return;
				}

				if($.type(data)=='object'){
					data = [data];
				}
				var el,undoItem,strLen,tempKey;;

				for(var i=data.length-1;i>=0;i--){
					undoItem = data[i].undo;
					
					el = D.BoxTools.getElem(undoItem.node, iframeBody || D.DropInPage.iframeBody);
					
					
					for(var key in undoItem.param){
						strLen = key.length;
						tempKey = key.substring(strLen-7,strLen);
						
						
						if(undoItem.param[key]===NODE_TAG){
						
							if(tempKey!='-backup'){
								undoItem.param[key] = el;
								undoItem.param[key+'-backup'] = NODE_TAG;
							}else{
								
								undoItem.param[key.substring(0,strLen-7)] = el;
							}
							
						}
					}
                    
					undoItem.fn&&undoItem.fn.call(undoItem.context||window,undoItem.param);
				}
				param&&param.callback&&param.callback(true);
			});

			$(win).bind('PageOperateHistory.redo',function(event,param){
				
				var data = PageOperateHistoryRecords.getRedoData();
                
				if(!data){
					param&&param.callback&&param.callback(true);
					return;
				}

				if($.type(data)=='object'){
					data = [data];
				}
				var el,redoItem,strLen;
				for(var i=0,len = data.length;i<len;i++){
					redoItem = data[i].redo;
					el = D.BoxTools.getElem(redoItem.node, iframeBody || D.DropInPage.iframeBody);
					for(var key in redoItem.param){
						strLen = key.length;
						tempKey = key.substring(strLen-7,strLen);
						if(redoItem.param[key]===NODE_TAG){
						
							if(tempKey!='-backup'){
								redoItem.param[key] = el;
								redoItem.param[key+'-backup'] = NODE_TAG;
							}else{
								redoItem.param[key.substring(0,strLen-7)] = el;
							}
							
						}
					}
                    
					redoItem.fn&&redoItem.fn.call(redoItem.context||window,redoItem.param);
				}
				param&&param.callback&&param.callback(true);
			});
		},
        /**
         * add by hongss on 2012.05.24
         * @methed getNodeInfo 
         * @param opts {'execEl':elem|html, 'relEl':elem, 'editType':editType, 'doc':doc, 'insertType':insertType, 'args':{}, 'context':context}
         *               execEl:必选，执行元素或HTML代码
         *               editType:必选，编辑类型  delete|insert|其他
         *               relEl:可选，关联元素或者是相对的操作元素，同insertType配合使用
         *               doc:可选，document对象，使用D.InsertHtml.init方法时必须
         *               insertType:可选，插入类型，使用D.InsertHtml.init方法时必须和default时必须，default时为方法引用
         *               args:可选，default时必选
         *               context:可选，insertType为方法引用时的上下文关系，default时必选
         * @param startEl 开始路径的父级标签，不传就到body位置，jQuery对象
         */
        getNodeInfo: function(opts){
            if (!opts['execEl'] && !opts['editType']){ return; }
            var nodeInfo = {};
            //nodeInfo['undo'] = nodeInfo['redo'] = {};
            switch (opts['editType']){
                //删除
                case 'delete':
                    nodeInfo['node'] = D.BoxTools.getPath(opts['execEl']);
                    nodeInfo['fn'] = D.EditContent.editDel;
                    nodeInfo['param'] = {'elem':NODE_TAG, 'isEdit':false};
                    nodeInfo['context'] = D.EditContent;
                    break;
                //插入
                case 'insert':
                    var position = {}, html;
                    if (!opts['relEl'] && !opts['insertType']){
                        position = this._getNodePosition(opts['execEl']);
                        html = D.BoxTools.getEl2Html(opts['execEl']);
                    } else {
                        position['path'] = D.BoxTools.getPath(opts['relEl']);
                        position['insertType'] = opts['insertType'];
                        html = ($.type(opts['execEl'])==='string') ? opts['execEl'] : D.BoxTools.getEl2Html(opts['execEl']);
                    }
                    nodeInfo['node'] = position['path'];
                    nodeInfo['fn'] = D.InsertHtml.init;
                    nodeInfo['context'] = D.InsertHtml;
                    nodeInfo['param'] = {'html':html, 'container':NODE_TAG, 'insertType':position['insertType'], 'doc':opts['doc'], 'isEdit':false};
                    break;
                //其他
                default:
                    opts['args'] = opts['args'] || {};
                    opts['args']['isEdit'] = false;
                    if ($.type(opts['args']['elem'])==='object'){
                        opts['args']['elem'] = NODE_TAG;
                    }
                    nodeInfo['node'] = D.BoxTools.getPath(opts['execEl']);
                    nodeInfo['fn'] = opts['editType'];
                    nodeInfo['param'] = opts['args'];
                    nodeInfo['context'] = opts['context'] || D.EditContent;
            }
            return nodeInfo;
        },
        /**
         * @methed _getNodePosition
         */
        _getNodePosition: function(el){
            var prevJQEl = el.prev(),
                nextJQEl = el.next(),
                parentJQEl   = el.parent(),
                insertType;
            
            if(prevJQEl[0]){
                path = D.BoxTools.getPath(prevJQEl);
                insertType = 'after';  //node相对与prevJQEl为next
            }else if(nextJQEl[0]){
                path = D.BoxTools.getPath(nextJQEl);
                insertType = 'before';
            }else if(parentJQEl[0]){
                path = D.BoxTools.getPath(parentJQEl);
                insertType = 'html';
            }

            return {
                'path':path,
                'insertType':insertType
            }
        }
	};

	D.PageOperateHistory = PageOperateHistory;
	//D.PageOperateHistoryRecords = PageOperateHistoryRecords;
	
})(dcms,FE.dcms);