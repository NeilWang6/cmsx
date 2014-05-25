/**
 * @ʡ���������������
 * @author changbin.wangcb
 * @version 1.0 2011.11.23
 * update by changbin.wangcb on 2012.01.04 for 
 * 1����ʼ�����������ֵ
 * 2�������жϻص�������ִ��
 * 3���ݴ�����ʵ�ָı䣨���η���ֵ��
 */
/**
 * ���ʹ��Ĭ�ϵ�ʡ��data�����������http://style.c.aliimg.com/app/member/js/widget/pca-data.js�ļ�
 * ��ѡ��̬���루����http://wd.alibaba-inc.com/fdevlib/#fdev4.FE.ui.PCA������merge����
 *
 * ���� ����
 * var demo = new FE.platform.widget.PCA($('div.combobox',container), {
 *	   texts : ['','',''],                   ��ѡ   ��ʼtext
 *	   vals :['','',''],                     ��ѡ   ��ʼvalue��vals��texts���߱�ѡ��һ��
 *	   store : FE.platform.widget.PCA.data,  ��ѡ   ��Ⱦʡ�ݵ�data
 *	   pcaDomain : getMultiCateUrl,          ��ѡ   ���������ϻ���
 *     title : ['', '', ''],                 ��ѡ   Ĭ�ϡ�--��ѡ��--��
 *	   showTitle : true/false,               ��ѡ   Ĭ��true����ʾplaceholder 
 *	   autoComplete : true/false,            ��ѡ   Ĭ�� true��  �Ƿ��Զ���ȫ
 *	   autoPopup : true/false,               ��ѡ   Ĭ��true�� �Ƿ��Զ�������һ��
 *	   onPSelected : function(flag) {},      ��ѡ   ʡ��change�¼�  / ������ѡ���ò��������ж��Ƿ�ִ�иûص������е�ĳ���߼��� �����ڳ�ʼ�������setValueʱʹ��
 *	   onCSelected : function(flag) {},      ��ѡ   ����change�¼�  / ������ѡ���ò��������ж��Ƿ�ִ�иûص������е�ĳ���߼��� �����ڳ�ʼ�������setValueʱʹ��
 *	   onASelected : function(flag) {},      ��ѡ   ����change�¼�  / ������ѡ���ò��������ж��Ƿ�ִ�иûص������е�ĳ���߼��� �����ڳ�ʼ�������setValueʱʹ��
 *	   comboboxPtpl ��function() {},         ��ѡ   ʡ��ģ��
 *	   comboboxCtpl : function() {},         ��ѡ   ����ģ��
 *     comboboxAtpl : function() {},         ��ѡ   ����ģ��
 * 	   format : true/false                   ��ѡ   Ĭ��false����ʽ�������� texts�����ϸ���ʽ�������ʽ������['�㽭','����','������������']
 *	   callbackFlags : [true,true,true]      ��ѡ   Ĭ��true�����ڻص�����ִ���ж�
 *	}); 
 *
 *	�������ֵ�ķ���,�����ʼ����̬������ѡ��ֵ
 *	����������callbackFlagsΪ[false,false,false]   
 *	setValue : function(texts,vals){}
 */
(function($) {
	$.namespace('FE.platform.widget');
	var FPW = FE.platform.widget, defaults = {
		// Ĭ�ϱ���
		title : ['--��ѡ��--', '--��ѡ��--', '--��ѡ��--'],
		// Ĭ����ʾ����
		showTitle : true,
		// ��ʼvalue
		vals : ['', '', ''],
		// ��ʼtext
		texts : ['', '', ''],
		// Ĭ���Զ���ȫ
		autoComplete : true,
		// �Զ�������һ��
		autoPopup : true,
		// pcaDomain
		pcaDomain : 'upload.1688.com',
		// ��ʽ������
		format : false,
		// �ص�����ִ���ж�
		callbackFlags : [true,true,true]
	};

	var PCA = FPW.PCA = function(els, opts) {
		// ������������ʼ�����
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
		// ��ʼ�����
		init : function(els, opts) {
			var self = this;
			opts = opts || {};
			self.defaults = $.extend({},defaults, opts);
			
			// �Ƿ��ʽ��
			if(self.defaults.format){
				self.defaults.texts=self.formatting(self.defaults.texts);
			}

			// ��������¼�
			for(var i = 0, j = els.length; i < j; i++) {
				switch(i) {
					case 0:
						// ��¼ʡ�������ؼ�
						self.elP = $(els[0]);

						// ������ڳ������� ��ʡ��������change�¼�
						if(self.elC || self.defaults.onPSelected) {
							// ��ʼ��ʡ��combobox
							self.comboboxP = self.elP.addClass('pca-province').combobox({
								name : 'province',
								multiple : false,
								itemNode : 'dd',
								tpl : function(data) {
									// �Լ�����ģ��
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
										
										// ����ie��placeholder����
										$('input.result', self.elP).trigger('blur');
										
										// ableʡ��ѡ��
										$('input.result', self.elC).attr('disabled', false);
										$('a.trigger', self.elC).attr('disabled', false);
										
										// ��ȡʡ��������value
										self.iP = $('input[type=hidden]', self.elP).val();
										
										// �������Ľ��,disable����ѡ��
										resultA.val('').attr('disabled', true);
										$('a.trigger', self.elA).attr('disabled', true);
										txtA.val('');

										// ��������ѡ��
										list.remove();
										$('input.result', self.elA).trigger('blur');
										
										// ����zindex
										self.elP.css('zIndex',1);

										if(self.defaults.onPSelected) {
											self.defaults.onPSelected.call(this,self.defaults.callbackFlags[0]);
											// self.comboboxC.combobox('reset', jsonData);
										}

										// �趨ʡ��
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
						// ��¼���������ؼ�
						self.elC = $(els[1]);
						// ��������������� ������������change�¼�
						if(self.elA || self.defaults.onCSelected) {
							// ��ʼ������combobox
							self.comboboxC = self.elC.addClass('pca-city').combobox({
								name : 'city',
								multiple : false,
								itemNode : 'li',
								tpl : function(data) {
									if(data[0] === '') {
										return;
									}
									
									// �Լ�����ģ��
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
										// ����ie��placeholder����
										$('input.result', self.elC).trigger('blur');
										
										// ��ȡ����������value
										self.iC = $('input[type=hidden]', self.elC).val();
										
										// able����ѡ��
										$('input.result', self.elA).attr('disabled', false);
										$('a.trigger', self.elA).attr('disabled', false);
										
										// ����zindex
										self.elC.css('zIndex',1);
										
										if(self.defaults.onCSelected) {
											self.defaults.onCSelected.call(this,self.defaults.callbackFlags[1]);
										}
										
										// �趨����
										if(self.defaults.texts.length === 1||self.defaults.vals.length === 1) {
											self.areaBind(self.defaults.vals.shift(), self.defaults.texts.shift());
										} else {
											self.areaBind.call(self);
										}
									}
								},
								data : ['']
							});

							// ��ʼ����ʡ�ݲ���ѡ
							self.elC.find('input.result').attr('disabled', true);
							self.elC.find('a.trigger').attr('disabled', true);

							// ���л�����
							self.cacheC = $('<div>', {
								'class' : 'pca-cache',
								css : {
									display : 'none'
								}
							}).appendTo(self.elC);
						}
						break;
					case 2:
						// ��¼���������ؼ�
						self.elA = $(els[2]);

						self.comboboxA = self.elA.addClass('pca-area').combobox({
							name : 'area',
							multiple : false,
							tpl : function(data) {
								if(data[0] === '') {
									return;
								}
								
								// �Լ�����ģ��
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
								// ����ie��placeholder����
								$('input.result', self.elA).trigger('blur');
								
								// ����zindex
								self.elA.css('zIndex',1);
										
								if(self.defaults.onASelected) {
									self.defaults.onASelected.call(this,self.defaults.callbackFlags[2]);
								}
							},
							data : ['']
						});

						// ��ʼ�������򲻿�ѡ
						self.elA.find('input.result').attr('disabled', true);
						self.elA.find('a.trigger').attr('disabled', true);

						// ����Ļ�����
						self.cacheA = $('<div>', {
							'class' : 'pca-cache',
							css : {
								display : 'none'
							}
						}).appendTo(self.elA);

						break;
				}
			}
			
			// ��ʾ����
			if(self.defaults.showTitle) {
				var result = $('input.result', $(els));
				result.attr('placeholder', '--��ѡ��--');
				self.placeHolder(result);
			}
			
			// ie6����
	         if(self.ie6){
	            self.elP.find('div.ui-combobox-panel').bgiframe();
	            self.elC.find('div.ui-combobox-panel').bgiframe();
	            self.elA.find('div.ui-combobox-panel').bgiframe();
	         }
			
			// ��zindex�¼�
			self.zindexHandle($('input.result',self.elP),self.elP);
			self.zindexHandle($('input.result',self.elC),self.elC);
			self.zindexHandle($('input.result',self.elA),self.elA);
			
			// �趨ʡ��
			self.provinceBind(self.defaults.vals.shift(), self.defaults.texts.shift());
		},
		/*
		 * @method �趨ʡ��
		 * @param {string} val   Item��ֵ
		 * @param {string} text  Item��ֵ
		 */
		provinceBind : function(val, text) {
			// v �ж�data���Ƿ��� value,data ��Ⱦ������
			var self = this, 
				v = self.defaults.store[1][0][1] ? 1 : 0, 
				data = self.defaults.store;
				
			// ��ʼ����ʱ������˳�ʼ��text
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

			// ����г�ʼ����ֵ�����ʼ��չʾ��ֵ
			if(val) {
				$('.ui-combobox-item', self.elP).filter('[catid=' + val + ']').trigger('click.combobox');
				return;
			}else{
				// ����ie��placeholder����
				$('input.result', self.elP).trigger('blur');
			}
			
			// �󶨳��е�����
			// if(self.elC) {
				// self.cityBind(self.defaults.vals.shift(), self.defaults.texts.shift());
			// }
		},
		
		/*
		 * @method �趨����
		 * @param {string} val   Item��ֵ
		 * @param {string} text  Item��ֵ
		 */
		cityBind : function(val, text) {
			var self = this;

			// �����ѡ����ʡ�ݣ���Ⱦ����
			if(self.iP !== null) {
				var cache = $('ul[parentid=' + self.iP + ']', self.cacheC);
				// ������ڻ������ƻ����ul
				if(cache.length > 0) {
					// ���֮ǰ�Ļ���
					$('input.result', self.elC).val('');
					$('input[type=hidden]', self.elC).val('');
					
					cache.clone(true, true).replaceAll($('div.ui-combobox-panel ul', self.elC));
					
					// ���ֻ��һ����Ԫ�ز���ָ���Զ���ȫ
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

					// ����Զ�����
					if(self.defaults.autoPopup) {
						$('input.result', self.elC).trigger('click');
					}
					
					// ��ʼ����ʱ������˳�ʼ��text
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
					// jsonp����
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
								// �������data
								$('div.ui-combobox-panel ul', self.elC).clone(true, true).appendTo(self.cacheC);

								// ���ֻ��һ����Ԫ�ز���ָ���Զ���ȫ
								if(resultData.length === 1 && self.defaults.autoComplete) {
									val = $('div.ui-combobox-panel li', self.elC).attr('catid');
								}
								// ����Զ�����
								if(self.defaults.autoPopup) {
									$('input.result', self.elC).trigger('click');
								}

								// ��ʼ����ʱ������˳�ʼ��text
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
				// // �󶨳��е�����
				// if(self.elA) {
					// self.areaBind(self.defaults.vals.shift(), self.defaults.texts.shift());
				// }
			// }
		},
		/*
		 * @method �趨����
		 * @param {string} val   Item��ֵ
		 * @param {string} text  Item��ֵ
		 */
		areaBind : function(val, text) {
			var self = this;

			// �����ѡ����ʡ�ݣ���Ⱦ����
			if(self.iP !== null && self.iC != null) {
				//self.flagA = true;
				var cache = $('ul[parentid=' + self.iC + ']', self.cacheA);
				// ������ڻ������ƻ����ul
				if(cache.length > 0) {
					// ���֮ǰ�Ļ���
					var list = $('div.list', self.elA);
					list.find('ul').remove();
					$('input.result', self.elA).val('');
					$('input[type=hidden]', self.elA).val('');
					
					cache.clone(true, true).appendTo(list);
					
					// ���ֻ��һ����Ԫ�ز���ָ���Զ���ȫ
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

					// ����Զ�����
					if(self.defaults.autoPopup) {
						$('input.result', self.elA).trigger('click');
					}
					
					// ��ʼ����ʱ������˳�ʼ��text
					if(text && !val) {
						// �޸������ܰ�����ͬtext
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
								// �������data
								$('div.ui-combobox-panel ul', self.elA).clone(true, true).appendTo(self.cacheA);

								// ����Զ�����
								if(self.defaults.autoPopup) {
									$('input.result', self.elA).trigger('click');
								}
								// ���ֻ��һ����Ԫ�ز���ָ���Զ���ȫ
								if(resultData.length === 1 && self.defaults.autoComplete) {
									val = $('div.ui-combobox-panel li', self.elA).attr('catid');
								}

								// ��ʼ����ʱ������˳�ʼ��text
								if(text && !val) {
									// �޸������ܰ�����ͬtext
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
		 * ���������ֵ
		 */
		setValue : function(texts,vals){
			var self=this;
			
			if(texts.length>0){
				self.defaults.texts=self.formatting(texts);
			}
			self.defaults.vals=vals;
			
			// ���ûص�ִ���ж�
			self.defaults.callbackFlags=[false,false,false];

			self.provinceBind(self.defaults.vals.shift(), self.defaults.texts.shift());
		},
		/**
		 * �����齨��zIndex
		 */
		zindexHandle : function(resultIpt,combobox){
			var self = this,
				comboboxs;
			
			// autoPopup�Զ�����������zIndex���ã�����������Զ�����û�д���mousedown�¼�
			resultIpt.bind('click',function(){
				combobox.css('zIndex',2000);
				comboboxs=$('div.combobox');
				comboboxs.not(combobox).css('zIndex',1);
			});
			
			// zIndex�滻������������ض�����������⣬jQuery�Ѷ�e�����⴦��
			// �жϵ�ǰcombobox��zindex,�����β���
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
		 * ���ݵ�placeholder
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
		 * �ݴ���
		 */
		formatting:function(texts){
			var self=this;
			// ��ȫ����
			if(texts[0]!==''){  // ֻ�е���ʼ��ʱ��textsֵ�Ŵ���
				if(texts.length<3){  // ��ȫ����
					if(texts.length===1){   // ֱϽ�д���
						var str=texts[0].slice(0,3);
						if(str==='�Ϻ���'||str==='������'||str==='�����'||str==='������'){
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
			
			// �ݴ���(�÷����Ǹ��ܲ��õ��ݴ�������ò�Ҫ���Ʊ�д)
			if(texts[0]!==''){
				if(texts[0]==='�Ϻ���'||texts[0]==='������'||texts[0]==='�����'||texts[0]==='������'){
					texts[0]=texts[0].slice(0,2);
					texts[1]=texts[0];
					if(texts[2].lastIndexOf('��')>-1){
						texts[2]=texts[0]+'��'+texts[2];
					}
				}else{
					if(texts[0].lastIndexOf('ʡ')>-1){
						texts[0]=texts[0].slice(0,texts[0].length-1);
					}else if(texts[0].lastIndexOf('������')>-1||texts[0].lastIndexOf('�ر�������')>-1){
						if(texts[0].lastIndexOf('���ɹ�')>-1){
							texts[0]='���ɹ�';
						}else{
							texts[0]=texts[0].slice(0,2);
						}
					}
					
					if((texts[2].lastIndexOf('��')>-1)&&!(texts[2].indexOf('��')>-1)){
						switch(texts[2]){
							default:
								texts[2]=texts[1]+texts[2];
								break;
							case '���ݹ�ҵ԰��':
								// ��������
								break;
							case '��ũ������':
								// ������ũ��
								break;
							case '��֦����':
								// ��������ˮ
								break;
							case 'ͭ�ʵ�����ɽ����':
								// ����ͭ��
								break;
							case '��ɽ����':
								// ����ͭ��
								break;
							case '���˰�������Ӹ������':
								// ���������˰���
								break;
							case '���˰������������':
								// ���������˰���
								break;
							case '���˰������������':
								// ���������˰���
								break;
							case '���˰������������':
								// ���������˰���
								break;
							case '����������':
								// ��������
								break;
							case '���¿�����':
								// ��������
								break;
							case '�����޿�����':
								// ��������
								break;
							case '¡�з羰��':
								// ��������
								break;
						}

					}else if(texts[2]==='����'){
						texts[2]=texts[1];
					}else if((texts[2].lastIndexOf('��')>-1)&&(texts[2].indexOf('��')>-1)){
						switch(texts[2]){
							case '������': 
								// ɽ����ׯ��������
								texts[2]=texts[1]+texts[2];
								break;
							case '������':
								//�ൺ����������
								texts[2]=texts[1]+texts[2];
								break;
							case '�б���':
								//�ൺ�б�������
								texts[2]=texts[1]+texts[2];
								break;
							default:
								break;
							// �ӱ����� ����ʱ��ͼ��λֻ�б����У�
							/*case '������':
								texts[2]=texts[1]+texts[2];
								break;
							case '������':
								texts[2]=texts[1]+texts[2];
								break;
							case '������':
								texts[2]=texts[1]+texts[2];
								break;*/
						}
					}
					
					if(texts[1].lastIndexOf('��')>-1){
						texts[1]=texts[1].slice(0,texts[1].length-1);
					}else if((texts[0].indexOf('����')>-1)&&(texts[1].indexOf('����')>-1)){
						texts[1]=texts[1].slice(0,texts[1].length-2);
					}else if(texts[1].indexOf('����')>-1){
						switch(texts[1]){
							default:
								break;
							case 'ͭ�ʵ���':
								texts[1]='ͭ��';
								break;
							case '���˰������':
								texts[1]='���˰���';
								break;
						}
					}
				}
			}
			
			return texts;
		}
	}
})(jQuery);
