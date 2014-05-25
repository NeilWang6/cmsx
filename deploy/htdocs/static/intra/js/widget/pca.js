/**
 * @省市区级联下拉组件
 * @author changbin.wangcb
 * @version 1.0 2011.11.23
 * update by changbin.wangcb on 2012.01.04 for 
 * 1、初始化后设置组件值
 * 2、参数判断回调函数的执行
 * 3、容错处理函数实现改变（传参返回值）
 */
/**
 * 如果使用默认的省份data，则必须引入http://style.c.aliimg.com/app/member/js/widget/pca-data.js文件
 * 可选择动态引入（参照http://wd.alibaba-inc.com/fdevlib/#fdev4.FE.ui.PCA）或者merge引入
 *
 * 调用 方法
 * var demo = new FE.platform.widget.PCA($('div.combobox',container), {
 *	   texts : ['','',''],                   可选   初始text
 *	   vals :['','',''],                     可选   初始value（vals，texts二者必选其一）
 *	   store : FE.platform.widget.PCA.data,  必选   渲染省份的data
 *	   pcaDomain : getMultiCateUrl,          可选   不填则线上环境
 *     title : ['', '', ''],                 可选   默认‘--请选择--’
 *	   showTitle : true/false,               可选   默认true，显示placeholder 
 *	   autoComplete : true/false,            可选   默认 true，  是否自动补全
 *	   autoPopup : true/false,               可选   默认true， 是否自动弹出下一级
 *	   onPSelected : function(flag) {},      必选   省份change事件  / 参数可选，该参数可以判断是否执行该回调函数中的某段逻辑。 适用于初始化组件或setValue时使用
 *	   onCSelected : function(flag) {},      必选   城市change事件  / 参数可选，该参数可以判断是否执行该回调函数中的某段逻辑。 适用于初始化组件或setValue时使用
 *	   onASelected : function(flag) {},      必选   区域change事件  / 参数可选，该参数可以判断是否执行该回调函数中的某段逻辑。 适用于初始化组件或setValue时使用
 *	   comboboxPtpl ：function() {},         可选   省份模板
 *	   comboboxCtpl : function() {},         可选   城市模板
 *     comboboxAtpl : function() {},         可选   区域模板
 * 	   format : true/false                   可选   默认false，格式化脏数据 texts不符合该形式最好做格式化处理['浙江','杭州','杭州市西湖区']
 *	   callbackFlags : [true,true,true]      可选   默认true，用于回调函数执行判断
 *	}); 
 *
 *	设置组件值的方法,组件初始化后动态设置其选中值
 *	里面设置了callbackFlags为[false,false,false]   
 *	setValue : function(texts,vals){}
 */
(function($) {
	$.namespace('FE.platform.widget');
	var FPW = FE.platform.widget, defaults = {
		// 默认标题
		title : ['--请选择--', '--请选择--', '--请选择--'],
		// 默认显示标题
		showTitle : true,
		// 初始value
		vals : ['', '', ''],
		// 初始text
		texts : ['', '', ''],
		// 默认自动补全
		autoComplete : true,
		// 自动弹出下一级
		autoPopup : true,
		// pcaDomain
		pcaDomain : 'upload.1688.com',
		// 格式化处理
		format : false,
		// 回调函数执行判断
		callbackFlags : [true,true,true]
	};

	var PCA = FPW.PCA = function(els, opts) {
		// 如果有数据则初始化组件
		if(opts.store) {
			this.init(els, opts);
		}
	};

	PCA.prototype = {
		iP : null,
		iC : null,
		ie6 : $.util.ua.ie6,
		//flagC : false,
		//flagA : false,
		getPCAUrl : 'http://{0}/company/getMultiCategoryInfo.htm',
		// 初始化组件
		init : function(els, opts) {
			var self = this;
			opts = opts || {};
			self.defaults = $.extend({},defaults, opts);
			
			// 是否格式化
			if(self.defaults.format){
				self.defaults.texts=self.formatting(self.defaults.texts);
			}

			// 下拉框绑定事件
			for(var i = 0, j = els.length; i < j; i++) {
				switch(i) {
					case 0:
						// 记录省份下拉控件
						self.elP = $(els[0]);

						// 假如存在城市下拉 给省份下拉绑定change事件
						if(self.elC || self.defaults.onPSelected) {
							// 初始化省份combobox
							self.comboboxP = self.elP.addClass('pca-province').combobox({
								name : 'province',
								multiple : false,
								itemNode : 'dd',
								tpl : function(data) {
									// 自己创建模板
								    if(self.defaults.comboboxPtpl){
										return self.defaults.comboboxPtpl.call(this,self.comboboxP,data);
									}
									
									var div = $('<div>'), areas = data[0][0], provinces = data[1];

									for(var i = 0, j = areas.length; i < j; i++) {
										var dl = $('<dl>'), dt = $('<dt>').append(document.createTextNode(areas[i])).appendTo(dl);

										if(i === j - 1) {
											dl.addClass('last-row');
										}
										
										for(var k = 0, l = provinces[i][0].length; k < l; k++) {
											var item = {
												value : provinces[i][1][k],
												text : provinces[i][0][k]
											}, span = $('<span>'), dd = $('<dd>', {
												'catid' : item.value
											}).addClass('ui-combobox-item').bind('click.combobox', item, function(e) {
												var node = $(this);
												if(node.hasClass('ui-combobox-selected')) {
													// self.comboboxP.combobox('remove', e.data.value);
													// node.removeClass('ui-combobox-selected');
												} else {
													self.comboboxP.combobox('select', e.data.value);
													node.addClass('ui-combobox-selected');
												}
											}).data('item', item);
											dl.append(dd.append(span.append(document.createTextNode(provinces[i][0][k]))));
										}
										div.append(dl);
									}
									return div;
								},
								resultTpl : function(item) {
									return item.text;
								},
								listrender : function() {

								},
								change : function() {
									if(self.elC) {
										var resultA = self.elA.find('input.result'), 
											txtA = resultA.next('input[type=hidden]'), 
											list = self.elA.find('div.list ul');
										
										// 兼容ie的placeholder隐藏
										$('input.result', self.elP).trigger('blur');
										
										// able省份选择
										$('input.result', self.elC).attr('disabled', false);
										$('a.trigger', self.elC).attr('disabled', false);
										
										// 获取省份索引的value
										self.iP = $('input[type=hidden]', self.elP).val();
										
										// 清空区域的结果,disable区域选择
										resultA.val('').attr('disabled', true);
										$('a.trigger', self.elA).attr('disabled', true);
										txtA.val('');

										// 清空区域的选项
										list.remove();
										$('input.result', self.elA).trigger('blur');
										
										// 重置zindex
										self.elP.css('zIndex',1);

										if(self.defaults.onPSelected) {
											self.defaults.onPSelected.call(this,self.defaults.callbackFlags[0]);
											// self.comboboxC.combobox('reset', jsonData);
										}

										// 设定省份
										if(self.defaults.texts.length === 2||self.defaults.vals.length === 2) {
											self.cityBind(self.defaults.vals.shift(), self.defaults.texts.shift());
										} else {
											self.cityBind.call(self);
										}
									}
								},
								data : [['']]
							});
							
						}
						break;
					case 1:
						// 记录城市下拉控件
						self.elC = $(els[1]);
						// 假如存在区域下拉 给城市下拉绑定change事件
						if(self.elA || self.defaults.onCSelected) {
							// 初始化城市combobox
							self.comboboxC = self.elC.addClass('pca-city').combobox({
								name : 'city',
								multiple : false,
								itemNode : 'li',
								tpl : function(data) {
									if(data[0] === '') {
										return;
									}
									
									// 自己创建模板
									if(self.defaults.comboboxCtpl){
										return self.defaults.comboboxCtpl.call(this,self.comboboxC,data);
									}

									var ul = $('<ul>', {
										'class' : 'fd-clr',
										'parentid' : self.iP
									});

									for(var i = 0, j = data.length; i < j; i++) {
										var item = data[i], span = $('<span>'), li = $('<li>', {
											'catid' : item.value
										}).addClass('ui-combobox-item').bind('click.combobox', item, function(e) {
											var node = $(this);
											if(node.hasClass('ui-combobox-selected')) {
												// self.comboboxC.combobox('remove', e.data.value);
												// node.removeClass('ui-combobox-selected');
											} else {
												self.comboboxC.combobox('select', e.data.value);
												node.addClass('ui-combobox-selected');
											}
										}).data('item', item);
										ul.append(li.append(span.append(document.createTextNode(item.name))));
									}
									return ul;
								},
								resultTpl : function(item) {
									return item.name;
								},
								listrender : function() {

								},
								change : function() {
									if(self.elA) {
										// 兼容ie的placeholder隐藏
										$('input.result', self.elC).trigger('blur');
										
										// 获取城市索引的value
										self.iC = $('input[type=hidden]', self.elC).val();
										
										// able区域选择
										$('input.result', self.elA).attr('disabled', false);
										$('a.trigger', self.elA).attr('disabled', false);
										
										// 重置zindex
										self.elC.css('zIndex',1);
										
										if(self.defaults.onCSelected) {
											self.defaults.onCSelected.call(this,self.defaults.callbackFlags[1]);
										}
										
										// 设定区域
										if(self.defaults.texts.length === 1||self.defaults.vals.length === 1) {
											self.areaBind(self.defaults.vals.shift(), self.defaults.texts.shift());
										} else {
											self.areaBind.call(self);
										}
									}
								},
								data : ['']
							});

							// 初始设置省份不可选
							self.elC.find('input.result').attr('disabled', true);
							self.elC.find('a.trigger').attr('disabled', true);

							// 城市缓存区
							self.cacheC = $('<div>', {
								'class' : 'pca-cache',
								css : {
									display : 'none'
								}
							}).appendTo(self.elC);
						}
						break;
					case 2:
						// 记录区域下拉控件
						self.elA = $(els[2]);

						self.comboboxA = self.elA.addClass('pca-area').combobox({
							name : 'area',
							multiple : false,
							tpl : function(data) {
								if(data[0] === '') {
									return;
								}
								
								// 自己创建模板
								if(self.defaults.comboboxAtpl){
									return self.defaults.comboboxAtpl.call(this,self.comboboxA,data);
								}
								
								var ul = $('<ul>', {
									'class' : 'fd-clr',
									'parentid' : self.iC
								}), texts = data[0], vals = data[1];

								for(var i = 0, j = data.length; i < j; i++) {
									var item = data[i], span = $('<span>'), li = $('<li>', {
										'catid' : item.value
									}).addClass('ui-combobox-item').bind('click.combobox', item, function(e) {
										var node = $(this);
										if(node.hasClass('ui-combobox-selected')) {
											// self.comboboxA.combobox('remove', e.data.value);
											// node.removeClass('ui-combobox-selected');
										} else {
											self.comboboxA.combobox('select', e.data.value);
											node.addClass('ui-combobox-selected');
										}
									}).data('item', item);
									ul.append(li.append(span.append(document.createTextNode(item.name))));
								}
								return ul;
							},
							resultTpl : function(item) {
								return item.name;
							},
							listrender : function() {

							},
							change : function() {
								// 兼容ie的placeholder隐藏
								$('input.result', self.elA).trigger('blur');
								
								// 重置zindex
								self.elA.css('zIndex',1);
										
								if(self.defaults.onASelected) {
									self.defaults.onASelected.call(this,self.defaults.callbackFlags[2]);
								}
							},
							data : ['']
						});

						// 初始设置区域不可选
						self.elA.find('input.result').attr('disabled', true);
						self.elA.find('a.trigger').attr('disabled', true);

						// 区域的缓存区
						self.cacheA = $('<div>', {
							'class' : 'pca-cache',
							css : {
								display : 'none'
							}
						}).appendTo(self.elA);

						break;
				}
			}
			
			// 显示标题
			if(self.defaults.showTitle) {
				var result = $('input.result', $(els));
				result.attr('placeholder', '--请选择--');
				self.placeHolder(result);
			}
			
			// ie6遮罩
	         if(self.ie6){
	            self.elP.find('div.ui-combobox-panel').bgiframe();
	            self.elC.find('div.ui-combobox-panel').bgiframe();
	            self.elA.find('div.ui-combobox-panel').bgiframe();
	         }
			
			// 绑定zindex事件
			self.zindexHandle($('input.result',self.elP),self.elP);
			self.zindexHandle($('input.result',self.elC),self.elC);
			self.zindexHandle($('input.result',self.elA),self.elA);
			
			// 设定省份
			self.provinceBind(self.defaults.vals.shift(), self.defaults.texts.shift());
		},
		/*
		 * @method 设定省份
		 * @param {string} val   Item的值
		 * @param {string} text  Item的值
		 */
		provinceBind : function(val, text) {
			// v 判断data中是否有 value,data 渲染的数据
			var self = this, 
				v = self.defaults.store[1][0][1] ? 1 : 0, 
				data = self.defaults.store;
				
			// 初始化的时候给定了初始化text
			if(text && !val) {
				for(var i = 0, j = self.defaults.store[1].length; i < j; i++) {
					var index = self.defaults.store[1][i][0].indexOf(text);
					if(index > -1) {
						val = self.defaults.store[1][i][v][index];
						break;
					}
				}
			}
			if(!text && val) {
				for(var i = 0, j = self.defaults.store[1].length; i < j; i++) {
					var index = self.defaults.store[1][i][v].indexOf(val);
					if(index > -1) {
						text = self.defaults.store[1][i][0][index];
						break;
					}
				}
			}
			self.iP = val ? val : null;

			self.comboboxP.combobox('reset', data);

			// 如果有初始化的值，则初始化展示该值
			if(val) {
				$('.ui-combobox-item', self.elP).filter('[catid=' + val + ']').trigger('click.combobox');
				return;
			}else{
				// 兼容ie的placeholder隐藏
				$('input.result', self.elP).trigger('blur');
			}
			
			// 绑定城市的数据
			// if(self.elC) {
				// self.cityBind(self.defaults.vals.shift(), self.defaults.texts.shift());
			// }
		},
		
		/*
		 * @method 设定城市
		 * @param {string} val   Item的值
		 * @param {string} text  Item的值
		 */
		cityBind : function(val, text) {
			var self = this;

			// 如果已选择了省份，渲染城市
			if(self.iP !== null) {
				var cache = $('ul[parentid=' + self.iP + ']', self.cacheC);
				// 如果存在缓存则复制缓存的ul
				if(cache.length > 0) {
					// 清除之前的缓存
					$('input.result', self.elC).val('');
					$('input[type=hidden]', self.elC).val('');
					
					cache.clone(true, true).replaceAll($('div.ui-combobox-panel ul', self.elC));
					
					// 如果只有一个子元素并且指定自动补全
					if(cache.find('li').length === 1 && self.defaults.autoComplete) {
						val = $('div.ui-combobox-panel li', self.elC).attr('catid');
						self.iC = val ? val : null;
						if(self.iC !== null) {
							$('div.ui-combobox-panel li.ui-combobox-item', self.elC).filter('[catid=' + val + ']').trigger('click.combobox');
						}else{
							$('input.result', self.elC).trigger('blur');
						}
						return;
					}

					// 如果自动弹出
					if(self.defaults.autoPopup) {
						$('input.result', self.elC).trigger('click');
					}
					
					// 初始化的时候给定了初始化text
					if(text && !val) {
						val = $('.ui-combobox-item:contains(' + text + ')', self.elC).attr('catid');
					}

					self.iC = val ? val : null;
					if(self.iC !== null) {
						$('div.ui-combobox-panel li.ui-combobox-item', self.elC).filter('[catid=' + val + ']').trigger('click.combobox');
					}else{
						$('input.result', self.elC).trigger('blur');
					}
				} else {
					//self.flagC = true;
					// jsonp请求
					var param = {
						type : 'Area',
						id : self.iP
					};

					$.ajax($.util.substitute(self.getPCAUrl, [self.defaults.pcaDomain]), {
						dataType : 'jsonp',
						data : param,
						success : function(o) {
							if(o.success) {
								var resultData = o.data.result;
								self.comboboxC.combobox('reset', resultData);
								// 缓存城市data
								$('div.ui-combobox-panel ul', self.elC).clone(true, true).appendTo(self.cacheC);

								// 如果只有一个子元素并且指定自动补全
								if(resultData.length === 1 && self.defaults.autoComplete) {
									val = $('div.ui-combobox-panel li', self.elC).attr('catid');
								}
								// 如果自动弹出
								if(self.defaults.autoPopup) {
									$('input.result', self.elC).trigger('click');
								}

								// 初始化的时候给定了初始化text
								if(text && !val) {
									val = $('.ui-combobox-item:contains(' + text + ')', self.elC).attr('catid');
								}

								self.iC = val ? val : null;
								if(self.iC !== null) {
									$('div.ui-combobox-panel li.ui-combobox-item', self.elC).filter('[catid=' + val + ']').trigger('click.combobox');
								}else{
									$('input.result', self.elC).trigger('blur');
								}
								//self.flagC = false;
							}
						},
						error : function() {
							self.flagC = false;
						}
					});
				}
			}
			// if(self.iP === null) {
				// // 绑定城市的数据
				// if(self.elA) {
					// self.areaBind(self.defaults.vals.shift(), self.defaults.texts.shift());
				// }
			// }
		},
		/*
		 * @method 设定区域
		 * @param {string} val   Item的值
		 * @param {string} text  Item的值
		 */
		areaBind : function(val, text) {
			var self = this;

			// 如果已选择了省份，渲染城市
			if(self.iP !== null && self.iC != null) {
				//self.flagA = true;
				var cache = $('ul[parentid=' + self.iC + ']', self.cacheA);
				// 如果存在缓存则复制缓存的ul
				if(cache.length > 0) {
					// 清除之前的缓存
					var list = $('div.list', self.elA);
					list.find('ul').remove();
					$('input.result', self.elA).val('');
					$('input[type=hidden]', self.elA).val('');
					
					cache.clone(true, true).appendTo(list);
					
					// 如果只有一个子元素并且指定自动补全
					if(cache.find('li').length === 1 && self.defaults.autoComplete) {
						val = $('div.ui-combobox-panel li', self.elA).attr('catid');
						self.iA = val ? val : null;
						if(self.iA !== null) {
							$('div.ui-combobox-panel li.ui-combobox-item', self.elA).filter('[catid=' + val + ']').trigger('click.combobox');
						}else{
							$('input.result', self.elA).trigger('blur');
						}
						return;
					}

					// 如果自动弹出
					if(self.defaults.autoPopup) {
						$('input.result', self.elA).trigger('click');
					}
					
					// 初始化的时候给定了初始化text
					if(text && !val) {
						// 修复区可能包含相同text
						var lis=$('.ui-combobox-item:contains(' + text + ')', self.elA);
						for(var i=0;i<lis.length;i++){
							if($(lis[i]).text()===text){
								val=$(lis[i]).attr('catid');
								break;
							}
						}
					}
					self.iA = val?val:null;
					
					if(self.iA!==null){
						$('div.ui-combobox-panel li.ui-combobox-item', self.elA).filter('[catid=' + val + ']').trigger('click.combobox');
					}else{
						$('input.result', self.elA).trigger('blur');
					}
					self.defaults.callbackFlags=[true,true,true];
				} else {
					var param = {
						type : 'Area',
						id : self.iC
					};

					$.ajax($.util.substitute(self.getPCAUrl, [self.defaults.pcaDomain]), {
						dataType : 'jsonp',
						data : param,
						success : function(o) {
							if(o.success) {
								var resultData = o.data.result;
								self.comboboxA.combobox('reset', resultData);
								// 缓存城市data
								$('div.ui-combobox-panel ul', self.elA).clone(true, true).appendTo(self.cacheA);

								// 如果自动弹出
								if(self.defaults.autoPopup) {
									$('input.result', self.elA).trigger('click');
								}
								// 如果只有一个子元素并且指定自动补全
								if(resultData.length === 1 && self.defaults.autoComplete) {
									val = $('div.ui-combobox-panel li', self.elA).attr('catid');
								}

								// 初始化的时候给定了初始化text
								if(text && !val) {
									// 修复区可能包含相同text
									var lis=$('.ui-combobox-item:contains(' + text + ')', self.elA);
									for(var i=0;i<lis.length;i++){
										if($(lis[i]).text()===text){
											val=$(lis[i]).attr('catid');
											break;
										}
									}
								}
								self.iA = val?val:null;
								
								if(self.iA!==null){
									$('div.ui-combobox-panel li.ui-combobox-item', self.elA).filter('[catid=' + val + ']').trigger('click.combobox');
								}else{
									$('input.result', self.elA).trigger('blur');
								}
								//self.flagA = false;
								self.defaults.callbackFlags=[true,true,true];
							}
						},
						error : function() {
							//self.flagA = false;
						}
					});
				}
			}
		},
		/**
		 * 设置组件的值
		 */
		setValue : function(texts,vals){
			var self=this;
			
			if(texts.length>0){
				self.defaults.texts=self.formatting(texts);
			}
			self.defaults.vals=vals;
			
			// 设置回调执行判断
			self.defaults.callbackFlags=[false,false,false];

			self.provinceBind(self.defaults.vals.shift(), self.defaults.texts.shift());
		},
		/**
		 * 设置组建的zIndex
		 */
		zindexHandle : function(resultIpt,combobox){
			var self = this,
				comboboxs;
			
			// autoPopup自动弹出下拉框zIndex设置，解决下拉框自动弹出没有触发mousedown事件
			resultIpt.bind('click',function(){
				combobox.css('zIndex',2000);
				comboboxs=$('div.combobox');
				comboboxs.not(combobox).css('zIndex',1);
			});
			
			// zIndex替换，解决下拉框特定情况遮罩问题，jQuery已对e做特殊处理
			// 判断当前combobox的zindex,避免多次操作
			$(document).bind('mousedown.combobox',{com:combobox[0]},function(e){
				if($(e.target).closest('.ui-combobox')[0]!==e.data.com){
					if(combobox.css('zIndex')!='1'){
		                combobox.css('zIndex',1);
		            }
	            }else{
	            	if(combobox.css('zIndex')!='2000'){
		            	combobox.css('zIndex',2000);
						comboboxs=$('div.combobox');
						comboboxs.not(combobox).css('zIndex',1);
					}
	            }
			});
		},
		/*
		 * 兼容的placeholder
		 */
		placeHolder : function(els) {
			var ph = this;
			if(!('placeholder' in document.createElement('input'))) {
				//var els = $('div.combobox input[placeholder]');
				els.each(function(i, el) {
					var self = $(el), defValue = self.attr('placeholder'), parent = self.closest('div'), label = $('<label>'), ofs, des, gid = el.id;
					if(!gid) {
						gid = 'ph' + $.guid++;
						self.attr('id', gid);
					}
					ofs = self.position();
					des = {
						left : ofs.left + 3,
						top : ofs.top + 3
					};
					self.after(label);
					label.html(defValue).attr('for', gid).css({
						position : 'absolute',
						left : des.left + 'px',
						top : des.top + 'px',
						color : '#CCC',
						cursor : 'text'
					}); self.val() && label.hide();
					self.bind({
						focus : function() {
							label.hide();
						},
						blur : function() {
							if(this.value) {
								label.hide();
							} else {
								label.show();
							}
						}
					}).triggerHandler('blur');
				});
			}
		},
		/**
		 * 容错处理
		 */
		formatting:function(texts){
			var self=this;
			// 补全处理
			if(texts[0]!==''){  // 只有当初始化时有texts值才处理
				if(texts.length<3){  // 补全处理
					if(texts.length===1){   // 直辖市处理
						var str=texts[0].slice(0,3);
						if(str==='上海市'||str==='北京市'||str==='天津市'||str==='重庆市'){
							str=str.slice(0,2);
							texts.unshift(str);
							texts.unshift(str);
						}else{
							texts.push('');
							texts.push('');
						}
					}else{
						texts.push('');
					}
				}
			}
			
			// 容错处理(该方法是个很不好的容错方法，最好不要类似编写)
			if(texts[0]!==''){
				if(texts[0]==='上海市'||texts[0]==='北京市'||texts[0]==='天津市'||texts[0]==='重庆市'){
					texts[0]=texts[0].slice(0,2);
					texts[1]=texts[0];
					if(texts[2].lastIndexOf('区')>-1){
						texts[2]=texts[0]+'市'+texts[2];
					}
				}else{
					if(texts[0].lastIndexOf('省')>-1){
						texts[0]=texts[0].slice(0,texts[0].length-1);
					}else if(texts[0].lastIndexOf('自治区')>-1||texts[0].lastIndexOf('特别行政区')>-1){
						if(texts[0].lastIndexOf('内蒙古')>-1){
							texts[0]='内蒙古';
						}else{
							texts[0]=texts[0].slice(0,2);
						}
					}
					
					if((texts[2].lastIndexOf('区')>-1)&&!(texts[2].indexOf('市')>-1)){
						switch(texts[2]){
							default:
								texts[2]=texts[1]+texts[2];
								break;
							case '苏州工业园区':
								// 江苏苏州
								break;
							case '神农架林区':
								// 湖北神农架
								break;
							case '六枝特区':
								// 贵州六盘水
								break;
							case '铜仁地区万山特区':
								// 贵州铜仁
								break;
							case '万山特区':
								// 贵州铜仁
								break;
							case '大兴安岭地区加格达奇区':
								// 黑龙江大兴安岭
								break;
							case '大兴安岭地区呼中区':
								// 黑龙江大兴安岭
								break;
							case '大兴安岭地区松岭区':
								// 黑龙江大兴安岭
								break;
							case '大兴安岭地区新林区':
								// 黑龙江大兴安岭
								break;
							case '益阳高新区':
								// 湖南益阳
								break;
							case '高新开发区':
								// 湖北襄阳
								break;
							case '鱼梁洲开发区':
								// 湖北襄阳
								break;
							case '隆中风景区':
								// 湖北襄阳
								break;
						}

					}else if(texts[2]==='市区'){
						texts[2]=texts[1];
					}else if((texts[2].lastIndexOf('区')>-1)&&(texts[2].indexOf('市')>-1)){
						switch(texts[2]){
							case '市中区': 
								// 山东枣庄市市中区
								texts[2]=texts[1]+texts[2];
								break;
							case '市南区':
								//青岛市南区配置
								texts[2]=texts[1]+texts[2];
								break;
							case '市北区':
								//青岛市北区配置
								texts[2]=texts[1]+texts[2];
								break;
							default:
								break;
							// 河北保定 （暂时地图定位只有保定市）
							/*case '北市区':
								texts[2]=texts[1]+texts[2];
								break;
							case '南市区':
								texts[2]=texts[1]+texts[2];
								break;
							case '新市区':
								texts[2]=texts[1]+texts[2];
								break;*/
						}
					}
					
					if(texts[1].lastIndexOf('市')>-1){
						texts[1]=texts[1].slice(0,texts[1].length-1);
					}else if((texts[0].indexOf('西藏')>-1)&&(texts[1].indexOf('地区')>-1)){
						texts[1]=texts[1].slice(0,texts[1].length-2);
					}else if(texts[1].indexOf('地区')>-1){
						switch(texts[1]){
							default:
								break;
							case '铜仁地区':
								texts[1]='铜仁';
								break;
							case '大兴安岭地区':
								texts[1]='大兴安岭';
								break;
						}
					}
				}
			}
			
			return texts;
		}
	}
})(jQuery);
