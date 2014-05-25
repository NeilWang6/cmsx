/**
 * masthead关键字补全组件
 * @version 2012.01.16 1.0
 * @author Denis
 * @requires ui-autocomplete
 * @update Denis 2012.02.28 提供默认的url目标
 * @update terence.wangt 2012.05.28 增加对打点的支持
 * @update jianping.shenjp 2012.10.15 修复公司搜索出现在"undefined里找"的信息
 * @TODO:只有页面有#search_category这个隐藏域才会显示在"XX分类下搜索"的信息，但目前全站除了首页和搜索list都没这个设定
 */
('Suggestion' in FE.ui) || (function($, UI) {
    /**
     * 自动推荐Class
     * @param {Object} el
     * @param {Object} configs
     */
    var festivalLogoUrlConfig = {
        'festivalclass': 'festival',
        'url': 'http://s.1688.com/promotion/offer_search.htm'
    },
    expoure = '',
    HistoryKeywords = function(keywords,callback) {
        var objKeyItems = {},
        keyItems, historyItems = [],
        currentNumber = 0,
        histroyKeys = {
            "objKeyItems": objKeyItems,
            "historyItems": historyItems
        },
        totalCacheNumbers = 150,
        removeNumbers =30,
        locSt,
		flashSupport = $.util.flash && $.util.flash.available,
		hasClearStorage=false,
		historyModify=0,
        isModifided = false,
        maxItemsCount = 10,
        itemsCount = 2,
        dataMaxLength = totalCacheNumbers * 2,
        pinyinUrl = "http://suggest.1688.com/bin/suggest";
        var intialHistory = function(keywords,callback) {
			locSt = $.util.swfstorage;	
			if(!locSt || !flashSupport){
				return false;	
			}
			locSt.ready(function(){
				var data = locSt.getJson("historyKeys"),
				modify=parseInt(locSt.getJson("historyModify")),
				length = parseInt(locSt.getJson("historyKeyCounts"));
				if (data) {
					read(data,modify,length);
				}					
				if (keywords) {
					keywords=keywords.replace(/[<|>|&|\"|\']/g,"");
					addKey(keywords);
				}
				callback();
			});	
			return true;
        },
		reInit=function(){
			locSt = $.util.swfstorage;
			if(!locSt || !flashSupport){
				return;	
			}
			var modify=parseInt(locSt.getJson("historyModify"));
			if(modify===historyModify){					
				return;
			}else{
				var data = locSt.getJson("historyKeys"),				
				length = parseInt(locSt.getJson("historyKeyCounts"));
				if (data) {
					read(data,modify,length);
				}				
			}			
		},
        addKey = function(key) {
            if (currentNumber < totalCacheNumbers) {
                if (historyItems.length >= dataMaxLength) {
                    removeOldData(false);
                }
                getPinYin(key);
            } else {
                removeOldData(true);
                getPinYin(key);
            }
        },
        read = function(data,modify,length) {
            histroyKeys = data;
            currentNumber = length;
			historyModify= modify;
            objKeyItems = data.objKeyItems;
            historyItems = data.historyItems;
        },
        save = function() {
            if (isModifided) {
				locSt.setJson("historyModify", new Date().getTime());
                locSt.setJson("historyKeys", histroyKeys);
                locSt.setJson("historyKeyCounts", currentNumber);
                isModifided = false;
            }
        },
        removeAll = function() {
            historyItems = [];
            objKeyItems = {};
            currentNumber = 0;
			historyModify=0;
            histroyKeys = {
                "objKeyItems": objKeyItems,
                "historyItems": historyItems
            };
            isModifided = true;
            setTimeout(save, 0);
        },
        getPinYin = function(key) {
            if (!objKeyItems[key]) {
                $.ajax({
                    url: pinyinUrl,
                    dataType: 'script',
                    data: $.paramSpecial({
                        "type": "pinyin",
                        "q": key
                    }),
                    success: function() {
                        var data = window['_suggest_result_'],
                        result = data.result,
                        value = result[0],
                        newItem = {
                            key: key,
                            value: value
                        };
                        addUniqueKey(newItem);
                    }
                });
            } else {
                positionExitedItem(key);
            }
        },
        clearHistory = function() {
			locSt.removeItem("historyModify");
            locSt.removeItem("historyKeys");
            locSt.removeItem("historyKeyCounts");
        },
        positionExitedItem = function(key) {
            var index = objKeyItems[key],
            obj;
            if (index === historyItems.length) {
                return;
            } else {
                index -= 1;
            }
            obj = historyItems[index];
            historyItems[index] = "";
            historyItems.push(obj);
            objKeyItems[key] = historyItems.length;
            isModifided = true;
            setTimeout(save, 0);
        },
        addUniqueKey = function(obj) {
            if (!objKeyItems[obj.key]) {
                historyItems.push(obj);
                objKeyItems[obj.key] = historyItems.length;
                isModifided = true;
                currentNumber++;
                save();	
				setTimeout(function(){
					if(hasClearStorage){
						reInit();
						hasClearStorage=false;
					}
				},0);				
            }
        },
        removeKey = function(key) {            
            var index = parseInt(objKeyItems[key]) - 1;
            historyItems[index] = "";
            delete objKeyItems[key];
            currentNumber--;
            isModifided = true;
            save();
        },
        removeOldData = function(isFull) {
            var length = historyItems.length,
            newHistoryItems = [],
			newObjKeyItems={},
            curKey,
			obj,
            currNumber = 0;
			if(isFull){
				for (var i = 0; i < length; i++) {
					obj=historyItems[i];
					curKey = obj.key;
					if (curKey) {
						if (currNumber < removeNumbers) {							
							currNumber++;
						} else {
							newHistoryItems.push(obj);						
							newObjKeyItems[curKey] = newHistoryItems.length;						
						}
					}
				}  
			}else{
				for (var i = 0; i < length; i++) {
					obj=historyItems[i];
					curKey = obj.key;
					if (curKey) {
						newHistoryItems.push(obj);						
						newObjKeyItems[curKey] = newHistoryItems.length;						
					}
				}
			}
			currentNumber=newHistoryItems.length;
			hasClearStorage=true;
            historyItems = newHistoryItems;
			objKeyItems = newObjKeyItems;
            isModifided = true;			
            histroyKeys = {
                "objKeyItems": newObjKeyItems,
                "historyItems": newHistoryItems
            };		
        };
		
		var hasStorage=intialHistory(keywords,callback);
		if(!hasStorage){
			return hasStorage; 
		}
		
        return {
            query: function(q) {
				reInit();
                var len = historyItems.length,
                queryKeys = [],
                i = len - 1,
                queryObj = {},
                key,
                currentCount;
                if (!q) {
                    if (len > maxItemsCount) {
                        currentCount = maxItemsCount;
                    } else {
                        currentCount = len;
                    }
                    for (i = len - 1; i >= 0; i--) {
                        key = historyItems[i];
                        if (key.key) {
                            queryObj[key.key] = true;
                            queryKeys.push(key);
                            if (queryKeys.length === currentCount) {
                                break;
                            }
                        }
                    }
                } else {
                    for (i = len - 1; i >= 0; i--) {
                        key = historyItems[i];
                        if (key && (key.key.indexOf(q) === 0 || key.value.indexOf(q) === 0)) {
                            queryObj[key.key] = true;
                            queryKeys.push(key);
                            if (queryKeys.length === itemsCount) {
                                break;
                            }
                        }
                    }
                }
                return {
                    "queryKeys": queryKeys,
                    "queryObj": queryObj
                };
            },
            removeItem: removeKey,
            getHistoryItems: function() {
                return historyItems;
            },
            clearHistory: clearHistory,
            saveToLocalStorage: function() {
                save();
            }
        }
    };

    function Suggestion(el, configs) {
        var self = this;
        self.element = $(el).eq(0);
        if (!self.element.length) {
            return;
        }
        self.options = $.extend(false, {},
        configs, {
            suggestTracelogShow: "sale_search_suggest_show",
            suggestTracelogSubmit: "sale_top_suggest_submit",
            suggestTracelogType: "sale_search"
        });
        self._init();
    }
    Suggestion.prototype = {
        _init: function() {
            var self = this,
            history, useHistory = false,
            o = self.options,
            keywords = self.element,
            dataAutocomplete, $categoryId = $('#search_category'),
            resultCount = 0,
            ajaxSearchItems = [],
            mergedSearchItems = [],
            getQueryResult = function(q) {
                var historyItems = [],
                queryItemsObj = history.query(q),
                queryArray = queryItemsObj.queryKeys,
                queryObj = queryItemsObj.queryObj,
                len = queryArray.length;
                for (var j = 0; j < len; j++) {
                    historyItems.push({
                        "label": queryArray[j].key,
						"clickValue": queryArray[j].key+"history",
                        "value": queryArray[j].key,
                        "history": true				
                    });
                }
                return {
                    "queryObj": queryObj,
                    "historyItems": historyItems
                }
            },
            mergeQueryResult = function(result, q, i) {
                if (!q) {
                    result = {};
                }
                if (useHistory) {
                    var queryResult = getQueryResult(q),
                    queryObj = queryResult.queryObj,
                    historyItems = queryResult.historyItems;
                }
                var items = $.map(result,
                function(item) {
                    var label = item[0].replace('_', '<em>').replace('%', '</em>'),
                    value = item[0].replace(/[_%]/g, '').trim(),
                    desc = !!item[2] ? (item[1] + item[2]) : item[1];
                    if (useHistory) {
                        if (!queryObj[value]) {
                            return {
                                label: label,
                                desc: desc,
                                value: value,
                                index: i++,
								clickValue:value
                            };
                        }
                    } else {
                        return {
                            label: label,
                            desc: desc,
                            value: value,
                            index: i++,
							clickValue:value
                        };
                    }
                });
                if (useHistory) {
                    items = historyItems.concat(items);
                }
                ajaxSearchItems = result;
                mergedSearchItems = items;
                return items;
            },
			showDefaultHistory = function(qKey) {				
				var queryResult = getQueryResult(false),
				queryObj = queryResult.queryObj,
				items = queryResult.historyItems;
				clearTimeout(dataAutocomplete.searching);                   
				dataAutocomplete.term = '';
				dataAutocomplete.selectedItem = null;
				mergedSearchItems = items;                    
				var showResultWords = "";
				for (var i = 0; i < items.length; i++) {
					showResultWords = showResultWords + "_" + items[i].clickValue;
				}
				self.showResultWords = showResultWords;
				dataAutocomplete.response(items);                
            };

            if (o.history) {
				var callbackhostryInit=function(){
				
					// history is aviable only after the ready function is called
					useHistory = true;	
					
					keywords.bind("focus.auto",
					function(event) {						
						if (self.stopKeyFocus) {
							self.stopKeyFocus = false;
							return false;
						}
						if (dataAutocomplete.term != undefined && dataAutocomplete.term != dataAutocomplete.element.val()) {
							dataAutocomplete.selectedItem = null;
							dataAutocomplete.search(null, event);
						} else {							
							var qKey = $.trim(keywords.val());
							if (!qKey) {
								showDefaultHistory(qKey);
							}else{
								dataAutocomplete.response(mergedSearchItems);
							}
						}
					});
                	keywords.bind("keyup.auto", function(event){
						var qKey = $.trim(keywords.val());
						if (!qKey) {
							showDefaultHistory(qKey);
						}
					});					
				}
                history = HistoryKeywords($.trim(keywords.val()),callbackhostryInit);
            }
			 
            keywords.autocomplete({
                source: function(request, response) {
                    self.ajax && self.ajax.abort();
                    self.ajax = $.ajax({
                        url: o.url || 'http://suggest.1688.com/bin/suggest',
                        dataType: 'script',
                        data: $.paramSpecial({
                            type: o.type,
                            q: request.term
                        }),
                        success: function() {
                            var data = window['_suggest_result_'],
                            result = data.result || {},
                            i = 0,
                            city,
                            category = data.category,
                            festival = data.festival;							
                            if (data.pCity) {
                                city = data.pCity[0][1] + data.pCity[0][2];
                                result.splice(0, 0, data.pCity[0]);
                            }

                            var items = mergeQueryResult(result, $.trim(request.term), i);

                            var showResultWords = request.term;
                            for (var i = 0; i < items.length; i++) {
                                showResultWords = showResultWords + "_" + items[i].clickValue;
                            }
                            self.showResultWords = showResultWords;

                            if ($categoryId.length && category) {
                                $.each(category,
                                function(i, ca) {
                                    ca.category = true;
                                    ca.label = ca.query,
                                    items.unshift(ca);
                                });
                            }
                            if (festival) {
                                $.each(festival,
                                function(i, ca) {
                                    ca.festival = true;
                                    ca.label = ca.query,
                                    items.unshift(ca);
                                });
                            }
                            resultCount = 0;
                            response(items);
                        }
                    });
                },
                select: function(e, ui) {
                    var curElem = $(e.target),
                    key,
                    items,
                    i = 0;
                    if (curElem.hasClass("suggest-delete")) {
                        e.stopPropagation();
                        key = curElem.data("key");
                        history.removeItem(key);
                        clearTimeout(dataAutocomplete.searching);
                        clearTimeout(dataAutocomplete.deleteClosing);
                        self.stopKeyFocus = true;				
                        items = mergeQueryResult(ajaxSearchItems, $.trim(keywords.val()), i);
                        dataAutocomplete.response(items);
                        return false;
                    }
					
                    if ($categoryId.length && ui.item.category) {
                        $categoryId.val(ui.item.id);
                    } else {
                        $categoryId.val('');
                    }
                    if (ui.item.festival) {
                        var item = ui.item,
                        url = festivalLogoUrlConfig.url,
                        festivalTab = 'outing';
                        switch (item.name) {
                        case "春游":
                            festivalTab = 'outing';
                            break;
                        case "礼品":
                            festivalTab = 'gift';
                            break;
						case "圣诞":
                            festivalTab = 'christmas';
                            break;
						case "年货":
                            festivalTab = 'spring';
                            break;
                        default:
                            festivalTab = item.name;
                            break;
                        }

                        var form = $("<form method='get'></form>").appendTo("body");
                        form.attr('action', url);
                        form.append("<input type='hidden' value='" + festivalTab + "' name='tab'/>");
                        form.append("<input type='hidden' value='" + item.label + "' name='keywords'/>");
                        self.aliclick(self, 'sale_top_' + festivalTab);
                        form.submit();
                        return true;
                    }
                    if (self.options.suggestTracelogSubmit) {
                        self._suggestClick("submit", ui, e);
                    }
					self.stopKeyFocus=true;
                    keywords.val(ui.item.value);
                    o.onSelected && o.onSelected.call(self, e, ui);
                },
                open: function(event, ui) {
                    // resize the width of menu
                    ui.menu.element.width(keywords.width() + o.widthfix);					
					if (self.options.suggestTracelogShow) {
                            self._suggestClick("show", ui, event);
                        }
                    self.exposureClick(self.options.suggestTracelogShow + "_" + self.showResultWords);
                },
                minLength: 1,
                appendTo: o.appendTo,
                position: o.position
            });
            dataAutocomplete = keywords.data("autocomplete");
           
            //渲染取回的数据
            dataAutocomplete._renderItem = function(ul, item) {
                return $('<li>').data("item.autocomplete", item).html(function() {
                    if (item.history) {
                        return '<span class="suggest-key suggest-history-key">' + item.label + '</span><span class="suggest-delete" data-key="' + item.label + '">删除</span>';
                    } else if ($categoryId.length && item.category) {
                        return '<span class="suggest-key" index="1" categoryid="' + item.id + '"><em>' + item.query + '</em></span><span class="suggest-category">在<em>' + item.name + '</em>分类下搜索</span>';
                    } else {
                        resultCount++;
                        if (item.festival) {
                            var className = festivalLogoUrlConfig['festivalclass'],
                            name = item.name,
                            festivalParm = 'outing';
                            switch (name) {
                            case "春游":
                                festivalParm = 'outing';
                                break;
                            case "礼品":
                                festivalParm = 'gift';
                                break;
							case "圣诞":
                                festivalParm = 'christmas';
                                break;
							case "年货":
								festivalParm = 'spring';
								break;
                            }
                            expoure = "_" + festivalParm;
                            return '<div class="' + className + '"><span class="suggest-key" index="1"><em>' + item.query + '</em></span><span class="suggest-category">在<em>' + name + '</em>市场下搜索&gt;&gt;</span></div>';
                        }
                        if (/^\d+$/.test(item.desc)) {
                            if (o.hideNumber) {
                                return '<span class="suggest-key" index="' + resultCount + '">' + item.label + '</span>';
                            } else {
                                return '<span class="suggest-key" index="' + resultCount + '">' + item.label + '</span><span class="suggest-result">约' + item.desc + "条结果</span>";
                            }
                        }
                        //desc未定义或空的情况
                        else if (!item.desc) {
                            return '<span class="suggest-key" index="' + resultCount + '">' + item.label + '</span>';
                        } else {
                            return '<span class="suggest-key" index="' + resultCount + '">' + item.label + '</span><span class="suggest-city">在<em>' + item.desc + '</em>里找</span>';
                        }
                    }
                }).appendTo(ul);
            };
            //给menu增加额外的样式
            dataAutocomplete.menu.element.addClass('web-suggestion');
        },
        /**
         * 更新配置
         * @param {Object} o
         */
        setOptions: function(o) {
            $.extend(this.options, o);
            return this;
        },
        /**
         * 激活组件
         */
        enable: function() {
            this.element.autocomplete('enable');
        },
        /**
         * 禁用组件
         */
        disable: function() {
            this.element.autocomplete('disable');
        },

        /**
		 * suggest统一打点封装
		 * @param {String} clickType 
		 */
        _suggestClick: function(clickType, ui, event) {
            try {
                switch (clickType) {
                case 'submit':
                    var tempTraceLog = this.options.suggestTracelogType + '_suggest_' + encodeURIComponent(this.element.val()) + '_' + encodeURIComponent(ui.item.clickValue) + '_';
                    if (ui.item.category) {
                        tempTraceLog = tempTraceLog + ui.item.id + '_';
                    }
                    tempTraceLog += this.options.suggestTracelogSubmit;
                    return this.aliclick(this, tempTraceLog);
                    break;

                case 'show':
                    //曝光打点
                    var categoryTracelog = '';
                    $("span[categoryid]", ui.menu.element).each(function() {
                        categoryTracelog += ('_' + $(this).attr("categoryid"));
                    });
                    var expoure1 = expoure;
                    expoure = '';
                    return this.exposureClick(this.options.suggestTracelogShow + '_' + encodeURIComponent(this.element.val()) + categoryTracelog + expoure1);

                    break;

                default:
                    break;
                }
            } catch(e) {
                //ignore the error caused by aliclick
            }
        },

        /**
		 * 统一都打点到搜索的打点服务器上
		 * @param {Object} o 不care
		 * @param {String} param
		 */
        aliclick: function(o, param) {
            if (typeof window.dmtrack != "undefined") {
                dmtrack.clickstat("http://stat.1688.com/search/queryreport.html", ('?searchtrace=' + param));
            } else {
                if (document.images)(new Image()).src = "http://stat.1688.com/search/queryreport.html?searchtrace=" + param + "&time=" + ( + new Date);
            }
            return true;
        },

        /*曝光打点*/
        exposureClick: function(sectionexp) {
            if (typeof window.dmtrack != "undefined") {
                dmtrack.clickstat("http://stat.1688.com/sectionexp.html", ('?sectionexp=' + sectionexp));
            } else { (new Image).src = "http://stat.1688.com/sectionexp.html?sectionexp=" + sectionexp + "&time=" + ( + new Date);
            }
        }
    };
    UI.Suggestion = Suggestion;
    $.add('web-suggestion');
})(jQuery, FE.ui);