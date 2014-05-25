(function($,D,undefined){
	
	var win = window,
		doc = document,
		uid = 0;
		NODE_TAG = '^node^';

	/**
     *	������ʷ�������ݼ�¼
     */	 
	var PageOperateHistoryRecords = {
		undoData:[],
		redoData:[],
		/**
         * @methed saveData �����û�ҳ���������Ϊ����
         * @param param �����ڸ���������Ҫʹ�õ����ݽṹ��saveData���������ݽṹ��ֻҪ���ô洢����
         */
		saveData:function(param){
			var self = this;

			//��һ�ֱ༭ʱ���ָ�����ԭ�������ÿգ��������գ��ᵼ�»ָ���֮ǰ�Ĳ���
			self.redoData.length = 0;
			//�����򵥵Ĵ��������ڴ����Ĺ���
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
         * @methed getRedoData ��ȡ�ָ�������
         * @return {object|array} �ָ���������
         */
		getRedoData:function(){
			var self = this;
			//�Ƿ�ɻָ�
			var res;
			if(self._canRedo()){
				res = self.redoData.pop();
				self.undoData.push(res);
				
			}
			self._triggerMemoryChangeEvent();
			return res;
		},
		/**
         * @methed getUndoData ��ȡ���˵�����
         * @return {object|array} ���˶�������
         */
		getUndoData:function(){
			var self = this;
			//�Ƿ�ɳ���
			var res;
			if(self._canUndo()){

				res = self.undoData.pop();

				self.redoData.push(res);

				
			}
			self._triggerMemoryChangeEvent();
			return res;
		},
        
		/**
		 * @methed _canUndo �����Ƿ������ݿ��Գ���
		 * @return {boolean}
		 */
		_canUndo:function(){
			var result;
			result = (this.undoData.length>0) ? true : false;
			return result;
		},
		/**
		 * @methed _canRedo �����Ƿ������ݿ��Իָ�
		 * @return {boolean}
		 */
		_canRedo:function(){
			var result;
			result = (this.redoData.length>0) ? true : false;
			return result;
		},
		/**
		 * @methed _triggerMemoryChangeEvent ������ʷ�������ݵı���¼�
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
     *	���˲���
     */	 
	var PageOperateHistory = {
		init:function(iframeBody){
			var self = this;

			var appendNode = $('#operation_area .operation-redo ul');

			if(appendNode.length>=1){
				appendNode = appendNode[0];
			}	
				
			$('<li/>').html('<a href="#" class="dcms-box-hand  dcms-box-abtn disbaled" title="copy" id="operate-undo">����</a>').appendTo(appendNode);
			
			$('<li/>').html('<a href="#" class="dcms-box-hand  dcms-box-abtn disbaled" title="copy" id="operate-redo">�ָ�</a>').appendTo(appendNode);
			
			$('<div class="undo-tips" id="undo-tips">�����ɹ���!:)</div>').appendTo($('body'));
			
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
						$('#undo-tips').html('�ָ��ɹ���!:)').css('display','block').css('opacity',1).animate({opacity: 1},1000,function(){
							$('#undo-tips').css('display','none');
							
							isCompleted = true;
						});
						
					}
				});
			});

			$('#operate-undo').bind('click',function(e){
				e.preventDefault();
				
				//�رո������Լ������ı༭��
				
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
						$('#undo-tips').html('�����ɹ���!:)').css('display','block').css('opacity',1).animate({opacity: 1},1000,function(){
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
         *               execEl:��ѡ��ִ��Ԫ�ػ�HTML����
         *               editType:��ѡ���༭����  delete|insert|����
         *               relEl:��ѡ������Ԫ�ػ�������ԵĲ���Ԫ�أ�ͬinsertType���ʹ��
         *               doc:��ѡ��document����ʹ��D.InsertHtml.init����ʱ����
         *               insertType:��ѡ���������ͣ�ʹ��D.InsertHtml.init����ʱ�����defaultʱ���룬defaultʱΪ��������
         *               args:��ѡ��defaultʱ��ѡ
         *               context:��ѡ��insertTypeΪ��������ʱ�������Ĺ�ϵ��defaultʱ��ѡ
         * @param startEl ��ʼ·���ĸ�����ǩ�������͵�bodyλ�ã�jQuery����
         */
        getNodeInfo: function(opts){
            if (!opts['execEl'] && !opts['editType']){ return; }
            var nodeInfo = {};
            //nodeInfo['undo'] = nodeInfo['redo'] = {};
            switch (opts['editType']){
                //ɾ��
                case 'delete':
                    nodeInfo['node'] = D.BoxTools.getPath(opts['execEl']);
                    nodeInfo['fn'] = D.EditContent.editDel;
                    nodeInfo['param'] = {'elem':NODE_TAG, 'isEdit':false};
                    nodeInfo['context'] = D.EditContent;
                    break;
                //����
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
                //����
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
                insertType = 'after';  //node�����prevJQElΪnext
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