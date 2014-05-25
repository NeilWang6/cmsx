/**
 * @author hongss
 * @userfor 保存设计页面和设计模板中的内容部分
 * @date  2012.02.13
 */

;(function($, D, undefined) {
	D.refreshContent = {

		/**
		 * @methed  refresh 刷新
		 * @param opts 配置项  {container:el(jQuery对象，存储内容的容器),
		 *                        pageIdInput:input(jQuery对象，存放pageId),
		 *                          draftIdInput:input(jQuery对象，存放draftId),
		 *                            content:input(jQuery对象，存放content),
		 *                              form: form(jQuery对象，form表单),
		 *                                previewUrl:url
		 *           doc   layout
		 */
		refresh : function(opts, doc) {
			if(!opts['container']){
				opts['container'] = $('#design-container', doc);
			}
			if (!(opts['container'])) {
				return;
			}
			//add by hongss on 2012.06.16 for 去除所有标识
			D.editPage && D.editPage.hideAllSingers();

			var url = D.domain + opts['previewUrl'] + '?_input_charset=UTF-8';
			//+'?draftId=' + opts['draftIdInput'].val()
			//console.log(opts['previewArrangeBlock']);
			//var req =/(data-dsdynamic=)"([^"]*)"/;
			//var str = opts['container'].html();
			/**
			 *对自定义代码中的<及>做转义处理
			 */
			doc.find('body').append(
				'<div id="load-mask" class="load-mask"><div class="mask-wrap"></div><table class="mask-body"><tr><td><div class="mask-content"><div class="load-icon"></div><p>页面正在加载中，请稍候…</p></div></td></tr></table></div>'
			);
			var html = D.BoxTools.handleDynamic(opts['container'].html());

			// return;
			$.ajax({
				url : url,
				timeout : 40000,
				type : "POST",
				data : {
					content : encodeURIComponent(html), //编码
					'previewArrangeBlock' : opts['previewArrangeBlock'],
					'renderType' : opts['renderType'] || '',
					'pageId' : opts['pageId'],
					noRemove : true
				},
				success : function(o) {
					var data = $.parseJSON(o), fn;
					var message = data.message;
					var tips = data.tips, clearTime, topic = data.topic,modulesMsg=data.modulesMsg;

					if (!message && data.content) {
						D.InsertHtml.init(data.content, opts['container'], 'html', doc);
						D.editPage.getGlobalAttr(doc);
						//图片懒加载 解决script先加载，html后加载不显示图片问题
						setDatalazyload(doc);
						//提示哪个专场有问题
						//console.log(data);
                        offerOverdue.init(topic, doc,modulesMsg);
			
					} else {
						//console.log('wwerwer');
						clearTime = D.Msg.error({
							timeout : 3000,
							message : '温馨提示:' + ( message ? message : "未知错误")
						});
					}
					doc.find('body #load-mask').remove();

                    $('.top-error-message', doc).remove();

					if(tips) {
						/*window.clearTimeout(clearTime);
						clearTime = D.Msg.error({
							timeout : 3000,
							message : '温馨提示:' + ( tips ? tips : "未知错误")
						});*/

                        var pageErrorHtml = '<div class="container-overdue-offers top-error-message"><div class="info-overdue-offers">\
                                                <span class="close"><i></i></span>\
                                                <span class="icon-caution"><i></i></span>\
                                                <p class="info-content">'+tips+'</p>\
                                                <span class="open"><i></i></span>\
                                            </div></div>';
                        $(pageErrorHtml).appendTo($('body', doc));
                    }
					fn = opts && opts.callback;
					typeof fn === 'function' && fn.call(opts['target']);

				},
				error : function() {
					doc.find('body #load-mask').remove();
					D.Msg.error({
						timeout : 3000,
						message : '温馨提示:连接超时请重新刷新!'
					});
				}
			});
		}
	}

    var offerOverdue = {
        init: function(errorData, doc, modulesMsg){
            $('.dcms-crazy-container-overdue-offers', doc).remove();

            if ( (!errorData || !errorData.length) && (!modulesMsg)){ return; }

            try {
                this._showErrorMsges(errorData, doc,modulesMsg);
            } catch(e) {
                console.log(e);
            }

        },

        _getExpireIdMsg: function(ids){
        	var idsHtml = [];
        	for (var i=0, l=ids.length; i<l; i++){
        		if(ids[i]==""){
        			continue;
        		}
        		idsHtml.push('<a target="_blank" href="http://detail.1688.com/offer/'+ids[i]+'.html">'+ids[i]+'</a>');
        	}
        	return '<p>有<em class="num">'+ids.length+'</em>个数据过期, ID是：<em class="offer-ids">'+idsHtml.join(', ')+'</em><i class="additional">(请核实。修改后，请点击刷新）</i></p>';
        },

        _showErrorMsges: function(errorData, doc,modulesMsg){
        	modulesMsg = modulesMsg || {};
            for (pre in modulesMsg){
            	var msgHtml = '';
            	var msgArr = modulesMsg[pre]||[];
            	for(var i=0; i<msgArr.length;i++){
            		if(/^[0-9,]*$/.test(msgArr[i])){
            		//如果是数字和逗号分隔的则认为是过期的数据
            			msgHtml += this._getExpireIdMsg(msgArr[i].split(","));
            		}else{
            			msgHtml += "<p>";
            			msgHtml += msgArr[i];
            			msgHtml += "</p>";
            		}
            	}
            	this._showErrorMsg($("."+pre, doc), msgHtml);
            }
            if ( !errorData || !errorData.length){
            	return;
            }
            var mapErrores = this._getMapErrores(errorData, doc);

            for (pre in mapErrores){
                if (pre !== 'content'){  //目前页面级的错误全部在tips中显示，这边不做处理
                    //防止重复提示，需要过滤掉topic中已经提示错误的区块
                	if(modulesMsg[pre]){
                		continue;
                	}
                    var msgExpired = mapErrores[pre]['expiredOffer'],
                        msgOther = mapErrores[pre]['other'],
                        msgHtml = '';

                    if (msgExpired){
                        for (item in msgExpired){
                            var offeridsHtml = [],
                                offerids = msgExpired[item];
                            for (var i=0, l=offerids.length; i<l; i++){
                                offeridsHtml.push('<a target="_blank" href="http://detail.1688.com/offer/'+offerids[i]+'.html">'+offerids[i]+'</a>');
                            }
                            if (item === 'offerIds'){
                                msgHtml += '<p>有<em class="num">'+msgExpired[item].length+'</em>个过期offer，请核实。对应的ID是：<em class="offer-ids">'+offeridsHtml.join(', ')+'</em><i class="additional">(修改后，请点击刷新）</i></p>';
                            } else {
                                var tbId = item.split('_');
                                msgHtml += '<p>有<em class="num">'+msgExpired[item].length+'</em>个过期offer，请核实。对应的ID是：<em class="offer-ids">'+offeridsHtml.join(', ')+'</em><i class="additional">(专场ID：'+tbId[0]+'，区块ID：'+tbId[1]+'；修改后，请点击刷新）</i></p>';
                            }
                        }
                    } else if(msgOther){
                        for (var i=0, l=msgOther.length; i<l; i++){
                            msgHtml += '<p>'+msgOther[i]+'</p>';
                        }
                    }
                    this._showErrorMsg(mapErrores[pre]['elem'], msgHtml);
                }
            }
        },

        _showErrorMsg: function(moduleEl, message){
            var messageHtml = '<div class="dcms-crazy-container-overdue-offers"><div class="info-overdue-offers">\
                                <span class="close"><i></i></span>\
                                <span class="icon-caution"><i></i></span>\
                                <div class="info-content">'+message+'</div>\
                                <span class="open"></span>\
                            </div></div>',
                errMsgEl = $(messageHtml).appendTo(moduleEl);
            if (moduleEl.css('position')!=='absolute' && !moduleEl.hasClass(D.box.editor.config.CLASS_POSITION_RELATIVE)){
                moduleEl.addClass(D.box.editor.config.CLASS_POSITION_RELATIVE);
            }
            var width = moduleEl.width();
            errMsgEl.width(width);
            //D.HighLight.showLight(errMsgEl, moduleEl, {'height':'auto'});
        },

        initErrorMsgEvent: function(doc){
            $(doc).delegate('.close, .open', 'click', function(){
                var el = $(this),
                    overdueEl = el.closest('.info-overdue-offers'),
                    containerEl = overdueEl.closest('.dcms-crazy-container-overdue-offers');
                overdueEl.toggleClass('closed');
                if (el.hasClass('close')){
                    containerEl.data('width', containerEl.css('width'));
                    containerEl.css('width', '50px');
                } else {
                    containerEl.css('width', containerEl.data('width'));
                }
            });
        },
        /**
         * return 数据格式：
            {
                'content'(页面级):{
                    'expiredOffer':'offer过期',
                    'other':[msg]
                },
                mod.class(变量):{  //className
                    'elem': moduleEl
                    'expiredOffer':{
                        topicid_blockid(变量):[offerid],
                        'offerIds':[offerid]
                    },
                    'other':[msg]
                }
            }
         */
        _getMapErrores: function(errorData, doc){
            var self = this,
                moduleEls = self._getModuleEls(doc),
                mapErrorToElem = self._getMapErrorToElem(moduleEls),
                mapElemToError = {};
            mapElemToError['content'] = {};

            for (var i=0, l=errorData.length; i<l; i++){
                var item = errorData[i];

                switch (item['type']){
                    case 'OfferExpired':  //offer过期
                        var arrClassToOffer = self._getExpiredOffer(item, mapErrorToElem);

                        if (!mapElemToError['content']['expiredOffer']){   //定义页面级错误信息
                            mapElemToError['content']['expiredOffer'] = '有offer过期，具体请查看区块中的错误信息！';
                        }
                        for (var n=0, len=arrClassToOffer.length; n<len; n++){
                            var className = arrClassToOffer[n]['className'],
                                topicId = arrClassToOffer[n]['topicId'],
                                blockId = arrClassToOffer[n]['blockId'],
                                offerIds = arrClassToOffer[n]['offerIds'];
                            if (!mapElemToError[className]){
                                mapElemToError[className] = {};
                            }

                            if (!mapElemToError[className]['expiredOffer']){
                                mapElemToError[className]['expiredOffer'] = {};
                            }
                            if (topicId && blockId){
                                mapElemToError[className]['expiredOffer'][topicId+'_'+blockId] = offerIds;
                            } else {
                                if (!mapElemToError[className]['expiredOffer']['offerIds']){
                                    mapElemToError[className]['expiredOffer']['offerIds'] = [];
                                    mapElemToError[className]['expiredOffer']['offerIds'] = offerIds;
                                } else {
                                    var tempArr = mapElemToError[className]['expiredOffer']['offerIds'];
                                    for (var y=0, ln=offerIds.length; y<ln; y++){
                                        var isNewErr = true;
                                        for (var yy=0, lnn=tempArr.length; yy<lnn; yy++){
                                            if (offerIds[y]===tempArr[yy]){
                                                isNewErr = false;
                                                break;
                                            }
                                        }
                                        if (isNewErr === true){
                                            mapElemToError[className]['expiredOffer']['offerIds'].push(offerIds[y]);
                                        }
                                    }
                                }


                            }
                            mapElemToError[className]['elem'] = arrClassToOffer[n]['elem'];
                        }
                        break;
                    case 'topic':
                        if (item['topicId']){
                            var arrClassToMsg = this._getOtherMsg(item, mapErrorToElem);

                            for (var n=0, len=arrClassToMsg.length; n<len; n++){
                                var className = arrClassToMsg[n]['className'],
                                    topicId = arrClassToMsg[n]['topicId'], //暂时无用，如果需要显示topic和block信息就有用了
                                    blockId = arrClassToMsg[n]['blockId'],
                                    message = arrClassToMsg[n]['message'],
                                    isNewErr = true;

                                if (!mapElemToError[className]){
                                    mapElemToError[className] = {};
                                }
                                if (!mapElemToError[className]['other']){
                                    mapElemToError[className]['other'] = [];
                                }
                                for (var y=0, ln=mapElemToError[className]['other'].length; y<ln; y++){
                                    if (mapElemToError[className]['other'][y]===message){
                                        isNewErr = false;
                                    }
                                }
                                if (isNewErr===true){
                                    mapElemToError[className]['other'].push(message);
                                }

                                mapElemToError[className]['elem'] = arrClassToMsg[n]['elem'];
                            }
                        }
                        break;
                    case 'other': //其他
                        if (!mapElemToError['content']['other']){
                            mapElemToError['content']['other'] = [];
                        }
                        mapElemToError['content']['other'].push(item['message']);
                        break;
                }
            }

            return mapElemToError;
        },
        _getModuleEls: function(doc){
            return $('.crazy-box-module[data-'+D.box.editor.config.ATTR_DATA_DATA_SOURCE+']', doc);
        },
        /**
         * return module的关键className（cell-module-nnn）
         */
        _getModuleClassName: function(moduleEl){
            var regClass = /cell-module-[0-9]+/;

            return D.BoxTools.getClassName(moduleEl, regClass);
        },
        /**
         * return 数据格式：[{'className':mod.class, 'elem':moduleEl[, 'topicId':id, 'blockId':id], 'offerIds':[offerid]}]
         */
        _getExpiredOffer: function(itemError, mapErrorToElem){
            var arrClassToOffer = [];
            //console.log(mapErrorToElem);
            if (itemError['topicId'] && itemError['blockId']){  //有排期管理的情况
                var moduleEls = mapErrorToElem[itemError['topicId']][itemError['blockId']];
                for (var i=0, l=moduleEls.length; i<l; i++){
                    var moduleEl = moduleEls[i],
                        mapClassToOffer = {},
                        className = this._getModuleClassName(moduleEl);
                    mapClassToOffer['className'] = className;
                    mapClassToOffer['elem'] = moduleEl;
                    mapClassToOffer['topicId'] = itemError['topicId'];
                    mapClassToOffer['blockId'] = itemError['blockId'];
                    mapClassToOffer['offerIds'] = itemError['expiredOfferId'];
                    arrClassToOffer.push(mapClassToOffer);
                }

            } else {   //手动填入offerid的情况
                for (var i=0, l=itemError['expiredOfferId'].length; i<l; i++){
                    var moduleEls = mapErrorToElem[itemError['expiredOfferId'][i]];
                    //className = this._getModuleClassName(moduleEl),
                        //mapClassToOffer = {};
                    if (moduleEls){
                        for (var n=0, len=moduleEls.length; n<len; n++){
                            var moduleEl = moduleEls[n],
                                mapClassToOffer = {},
                                className = this._getModuleClassName(moduleEl);

                            mapClassToOffer['className'] = className;
                            mapClassToOffer['elem'] = moduleEl;
                            mapClassToOffer['offerIds'] = [itemError['expiredOfferId'][i]];
                            arrClassToOffer.push(mapClassToOffer);
                        }
                    }

                }
            }
            return arrClassToOffer;
        },
        /**
         * return 数据格式：[{'className':mod.class, 'elem':moduleEl[, 'topicId':id, 'blockId':id], 'message':msg}]
         */
        _getOtherMsg: function(itemError, mapErrorToElem){
            var arrClassToMsg = [];
            if (itemError['blockId']){
                var moduleEls = mapErrorToElem[itemError['topicId']][itemError['blockId']];
                    //className = this._getModuleClassName(moduleEl),
                    //mapClassToMsg = {};
                if (moduleEls){
                    for (var i=0, l=moduleEls.length; i<l; i++){
                        var moduleEl = moduleEls[i],
                            mapClassToMsg = {},
                            className = this._getModuleClassName(moduleEl);
                        mapClassToMsg['className'] = className;
                        mapClassToMsg['elem'] = moduleEl;
                        mapClassToMsg['topicId'] = itemError['topicId'];
                        mapClassToMsg['blockId'] = itemError['blockId'];
                        mapClassToMsg['message'] = itemError['message'];
                        arrClassToMsg.push(mapClassToMsg);
                    }
                }
            } else {
                var objTopic = mapErrorToElem[itemError['topicId']];
                for (pre in objTopic){
                    var moduleEls = objTopic[pre];
                    for (var i=0, l=moduleEls.length; i<l; i++){
                        var moduleEl = moduleEls[i],
                            className = this._getModuleClassName(moduleEl),
                            mapClassToMsg = {};
                        mapClassToMsg['className'] = className;
                        mapClassToMsg['elem'] = moduleEl;
                        mapClassToMsg['message'] = itemError['message'];
                        arrClassToMsg.push(mapClassToMsg);
                    }
                }
            }
            return arrClassToMsg;
        },
        /**
         * method 获取页面上的blockId|offerids和elem对应信息
         * return 数据格式：{topicId(变量): { blockId(变量): [el(jQyert对象)]},
                             offerId(变量):[el1(jQyert对象)] }  //定义成数组，防止offer在页面中出现多次
         */
        _getMapErrorToElem: function(els){
            var self = this,
                mapErrorToElem = {};

            els.each(function(){
                var elem = $(this),
                    strDsmoduleparam = elem.attr('data-'+D.box.editor.config.ATTR_DATA_DATA_SOURCE),
                    arrTopicToBlock = self._getTopicToBlock(strDsmoduleparam),
                    arrOfferToElem = self._getOfferToElem(strDsmoduleparam);

                //使用排期工具，offer过期的情况
                for (var i=0, l=arrTopicToBlock.length; i<l; i++){
                    if (!mapErrorToElem[arrTopicToBlock[i][0]]){
                        mapErrorToElem[arrTopicToBlock[i][0]] = {};
                    }
                    if (!mapErrorToElem[arrTopicToBlock[i][0]][arrTopicToBlock[i][1]]){
                        mapErrorToElem[arrTopicToBlock[i][0]][arrTopicToBlock[i][1]] = [];
                    }
                    mapErrorToElem[arrTopicToBlock[i][0]][arrTopicToBlock[i][1]].push(elem);
                }

                //使用offer加强版，offer过期的情况
                for (var i=0, l=arrOfferToElem.length; i<l; i++){
                    var offerid = arrOfferToElem[i];

                    if (!mapErrorToElem[offerid]){
                        mapErrorToElem[offerid] = [];
                    }
                    mapErrorToElem[offerid].push(elem);

                }
            });
            return mapErrorToElem;
        },
        /**
         * return 数据格式：[[topicId(变量),blockId(变量)], ...]
         */
        _getTopicToBlock: function(strDsmoduleparam){
            if (strDsmoduleparam){
                var arrTopicToBlock = [],
                    regBlockid = /\{"name":"blockId","value":"([0-9]+)"\}/g,
                    regTopicid = /\{"name":"topicId","value":"([0-9]+)"\}/g,
                    blockId, topicId;

                while ((blockId=regBlockid.exec(strDsmoduleparam)) && (topicId = regTopicid.exec(strDsmoduleparam))){
                    var arrTopic = [topicId[1], blockId[1]];

                    arrTopicToBlock.push(arrTopic);
                }

                return arrTopicToBlock;
            }
        },
        /**
         * return 数据格式：[offerid(变量), ...]
         */
        _getOfferToElem: function(strDsmoduleparam){
            if (strDsmoduleparam){
                var arrOfferids = [],
                    regOfferid = /\{"name":"offerIds","value":"(([0-9]+\,{0,1})+)"\}/g,
                    result, offerIds;

                while ((result=regOfferid.exec(strDsmoduleparam))){
                    offerIds = result[1].split(',');
                    arrOfferids = arrOfferids.concat(offerIds);
                }
                return arrOfferids;
            }
        }


    };

    D.box.editor.loadHandler.add(offerOverdue.initErrorMsgEvent);

    D.offerOverdue = offerOverdue;

	//重新加载懒加载
	var setDatalazyload = function(doc) {
        var script = ($('script[data-elem=prototype]', doc));
        script.each(function() {
			var _$script = $(this);
			var url = _$script.attr('src');
			$('script[src="' + url + '"]', doc).each(function(index, obj) {
				var $self = $(obj), elem = $self.data('elem');
				if (!elem) {
					$self.remove();
				}
			});
			D.BoxTools.loadScripts(url, $('body', doc));
		});


	}
})(dcms, FE.dcms);
