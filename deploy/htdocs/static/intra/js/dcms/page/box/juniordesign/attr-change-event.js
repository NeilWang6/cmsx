/**
 *
 * @author springyu
 * @userfor 属性面板初始化事件
 * @date 2012-02-07
 */
;(function($, D) {
	var REPEATBYDS = 'dsrepeatbyrow';
	//重复控件的html代码(容器控件)
	var containterCellHtml = '<div><style data-for="cell-ul-containter">';
	containterCellHtml += ' .cell-ul-containter .crazy-ul-containter-li{';
	containterCellHtml += '}';
	containterCellHtml += ' .cell-ul-containter .crazy-ul-containter-li:empty{';
	containterCellHtml += '  width:125px;';
	containterCellHtml += '  height:125px;';
	containterCellHtml += '  background:url(http://img.china.alibaba.com/cms/upload/2012/973/913/319379_817303406.png) no-repeat;';
	containterCellHtml += ' }';
	containterCellHtml += '</style>';
	containterCellHtml += '<ul class="cell-ul-containter fd-clr crazy-box-cell" data-boxoptions={"css":[{"key":"margin","name":"外边距","type":"ginput"},{"key":"padding","name":"内边距","type":"ginput"},{"key":"border","name":"边框","type":"border"},{"key":"background","name":"背景","type":"background"}]}>';
	containterCellHtml += '   <li class="crazy-ul-containter-li fd-left" data-dsrepeat=""  data-boxoptions={"css":[{"key":"margin","name":"外边距","type":"ginput"},{"key":"padding","name":"内边距","type":"ginput"},{"key":"border","name":"边框","type":"border"},{"key":"background","name":"背景","type":"background"},{"key":"width","name":"宽度","type":"input"},{"key":"height","name":"高度","type":"input"}],"ability":{"copy":{"enable":"true"},"container":{"enableType":"cell","number":"n"}}}></li>';
	containterCellHtml += '</ul></div>';
	$(function() {
		D.YunYing.bind = {
			/**
			 * ＠desc 传入jQuery对象,需要选中的jQuery对象
			 */
			init : function(target) {
				this.target = $(target);
				this._public();
				this._color();
				this._border();
				this._ginput();
				this._input();
				this._select();
				this._background();
				this._font_text();
				this._link();
				this._image();
				this._ds_text();
				this._ds_link();
				this._ds_image();
			},
			//判断是否添加数据源标识
			_is_add_dsTag : function() {
				var attrType = _findDataExtra($('select', 'div.ds-link-attr'))
			},
			_ds_link : function() {
				this.target.delegate('div.ds-link-attr select', 'change', function(e) {
					var self = $(this), that = this, attrType = _findDataExtra(self);
					var extra = attrType.data(D.bottomAttr.CONSTANTS['extra']);
					var $html = extra.obj, val = that.options[that.selectedIndex].value;
					var dsoptions;

					//text的值 start
					var $dstxt = $('select',"div.ds-text-attr")[0];
					var txtVal = -1;
					if($dstxt) {
						txtVal = $dstxt.options[$dstxt.selectedIndex].value;
					}
					//end
					if(extra && $html) {
						if($html.data('dsoptions')) {
							dsoptions = $html.data('dsoptions');
							if(self.attr('name') === 'link-href') {
								dsoptions.href = {
									'field' : val
								};
								var $temp = $('select#link-title')[0];
								var otherVal = $temp.options[$temp.selectedIndex].value;
							}
							if(self.attr('name') === 'link-title') {
								dsoptions.title = {
									'field' : val
								};
								var $temp = $('select#link-href')[0];
								var otherVal = $temp.options[$temp.selectedIndex].value;
							}
						} else {
							if(self.attr('name') === 'link-href') {
								dsoptions = {
									'href' : {
										'field' : val
									}
								};
								var $temp = $('select#link-title')[0];
								var otherVal = $temp.options[$temp.selectedIndex].value;
							}
							if(self.attr('name') === 'link-title') {
								dsoptions = {
									'title' : {
										'field' : val
									}
								};
								var $temp = $('select#link-href')[0];
								var otherVal = $temp.options[$temp.selectedIndex].value;
							}
						}

						if(dsoptions) {
							$html.attr('data-dsoptions', JSON.stringify(dsoptions));
							addDsRepeat($html, true);
						}
						if(!$html.hasClass('ds-box-module')) {
							$html.addClass("ds-box-module");
						}
						if(val == -1 && otherVal == -1 && txtVal == -1) {
							$html.removeClass("ds-box-module");
							addDsRepeat($html, false);
						}

					}
				});
			},
			_ds_image : function() {
				this.target.delegate('div.ds-image-attr select', 'change', function(e) {
					var self = $(this), that = this, attrType = _findDataExtra(self);
					var extra = attrType.data(D.bottomAttr.CONSTANTS['extra']);
					var $html = extra.obj, val = that.options[that.selectedIndex].value;
					var dsoptions;

					if(extra && $html) {

						if($html.data('dsoptions')) {
							dsoptions = $html.data('dsoptions');
							if(self.attr('name') === 'img-url') {
								dsoptions.src = {
									'field' : val
								};

								var $temp = $('select', 'div.ds-image-attr')[1];
								var otherVal = $temp.options[$temp.selectedIndex].value;
							}
							if(self.attr('name') === 'img-alt') {
								dsoptions.alt = {
									'field' : val
								};
								var $temp = $('select', 'div.ds-image-attr')[0];
								var otherVal = $temp.options[$temp.selectedIndex].value;
							}
						} else {
							if(self.attr('name') === 'img-url') {
								dsoptions = {
									'src' : {
										'field' : val
									}
								};
								var $temp = $('select', 'div.ds-image-attr')[1];
								var otherVal = $temp.options[$temp.selectedIndex].value;
							}
							if(self.attr('name') === 'img-alt') {
								dsoptions = {
									'alt' : {
										'field' : val
									}
								};
								var $temp = $('select', 'div.ds-image-attr')[0];
								var otherVal = $temp.options[$temp.selectedIndex].value;
							}
						}
						if(dsoptions) {
							$html.attr('data-dsoptions', JSON.stringify(dsoptions));
							addDsRepeat($html, true);
						}
						if(!$html.hasClass('ds-box-module')) {
							$html.parent().addClass("ds-box-module");
						}

					}
					if(val == -1 && otherVal == -1) {
						$html.parent().removeClass("ds-box-module");
						addDsRepeat($html, false);
					}
				});
			},
			_ds_text : function() {
				this.target.delegate('div.ds-text-attr select', 'change', function(e) {
					var self = $(this), that = this, attrType = _findDataExtra(self);
					var extra = attrType.data(D.bottomAttr.CONSTANTS['extra']);
					var $html = extra.obj, val = that.options[that.selectedIndex].value;
					var dsoptions;
					if(extra && $html) {
						if($html.data('dsoptions')) {
							dsoptions = $html.data('dsoptions');
							if(self.attr('name') === 'link-href') {
								dsoptions.text = {
									'field' : val
								};
							}
						} else {
							if(self.attr('name') === 'link-href') {
								dsoptions = {
									'text' : {
										'field' : val
									}
								};
							}
						}
						if(dsoptions) {
							$html.attr('data-dsoptions', JSON.stringify(dsoptions));
							addDsRepeat($html, true);
						}
						if(!$html.hasClass('ds-box-module')) {
							$html.addClass("ds-box-module");
						}
						var $temp = $('select#link-title')[0];
						var otherVal = -1, otherValTwo = -1;
						if($temp) {
							otherVal = $temp.options[$temp.selectedIndex].value;
						}
						$temp = $('select#link-href')[0];
						if($temp) {
							otherValTwo = $temp.options[$temp.selectedIndex].value;
						}
						if(val == -1 && otherVal == -1 && otherVal && otherValTwo == -1) {
							$html.removeClass("ds-box-module");
							addDsRepeat($html, false);
						}

					}
				});

				this.target.delegate('div.ds-text-attr input', 'input', function() {
					var self = $(this), that = this, attrType = _findDataExtra(self);
					var extra = attrType.data(D.bottomAttr.CONSTANTS['extra']);
					var $html = extra.obj, length = that.value;
					if(extra && $html) {
						if($html.data('dsoptions')) {
							dsoptions = $html.data('dsoptions');
							if(length == "") {
								delete dsoptions.text.length;
							} else {
								dsoptions.text.length = length;
							}
						}
						$html.attr('data-dsoptions', JSON.stringify(dsoptions));
						if(!$html.hasClass('ds-box-module')) {
							$html.addClass("ds-box-module");
						}
						//addDsRepeat($html,true);
					}
				});

			},
			/**
			 * 属性模板 图片模板事件邦定
			 */
			_image : function() {

				this.target.delegate('div.image-attr input[name=alt]', 'input', function() {
					var self = $(this), attrType = _findDataExtra(self);
					var extra = attrType.data(D.bottomAttr.CONSTANTS['extra']);
					if(extra) {
						D.EditContent.editContent({
							'elem' : extra.obj,
							'key' : 'alt',
							'value' : $.trim(self.val())
						});

					}
				});

				this.target.delegate('div.image-attr div.uploads', 'change', function(e) {
					var self = $(this), attrType = _findDataExtra(self);
					var extra = attrType.data(D.bottomAttr.CONSTANTS.extra);
					var url = $.trim(self.data('url'));
					var adboardId = $.trim(self.data('adboardid'));
					//console.log(url);
					if(extra) {
						if(extra.pseudo) {
							D.EditContent.editContent({
								'elem' : extra.obj,
								'key' : 'src',
								'value' : url,
								'pseudo' : extra.pseudo
							});
						} else {

							D.EditContent.editContent({
								'elem' : extra.obj,
								'key' : 'src',
								'value' : url
							});
							if(!adboardId) {
								extra.obj.removeAttr('data-adboardid');
							} else {
								D.EditContent.editContent({
									'elem' : extra.obj,
									'key' : 'data-adboardid',
									'value' : adboardId
								});
							}
						}
						D.YunYing.isVisualChange();
					}
				});
			},
			/**
			 * 属性模板 a标签模板事件邦定
			 */
			_link : function() {
				this.target.delegate('div.link-attr input[name=attr-link]', 'mouseup', function() {
					var self = $(this), isVal = '1';
					var attrType = _findDataExtra(self), extra = attrType.data(D.bottomAttr.CONSTANTS['extra']);
					if(self.get(0).checked) {
						isVal = '0';
						//去掉
						$('textarea[name=link-href]', attrType).val('');
						$('input[name=link-title]', attrType).val('');
					} else {
						isVal = '1';
					}

					D.EditContent.editLink({
						"elem" : extra.obj,
						"value" : isVal
					});
				});
				/**
				 * a标签src
				 */

				this.target.delegate('div.link-attr textarea[name=link-href]', 'input', function(e) {
					var self = $(this), attrType = _findDataExtra(self);
					var extra = attrType.data(D.bottomAttr.CONSTANTS.extra), obj;
					if(extra) {
						obj = extra.obj;
						if(!obj.is('a')) {
							obj = obj.parent();
						}
						D.EditContent.editContent({
							'elem' : obj,
							'key' : 'href',
							'value' : self.val()
						});
					}

				});

				/**
				 * a标签title
				 */
				this.target.delegate('div.link-attr input[name=link-title]', 'input', function() {
					var self = $(this), attrType = _findDataExtra(self);
					var extra = attrType.data(D.bottomAttr.CONSTANTS.extra), obj;
					if(extra) {
						obj = extra.obj;
						if(!obj.is('a')) {
							obj = obj.parent();
						}
						D.EditContent.editContent({
							'elem' : obj,
							'key' : 'title',
							'value' : self.val()
						});
					}
				});

			},
			/**
			 * 文本编辑
			 */
			_font_text : function() {
				this.target.delegate('div.font-attr span.align-left', 'click', function() {
					var self = $(this), attrType = _findDataExtra(self);
					var extra = attrType.data(D.bottomAttr.CONSTANTS.extra);
					if(extra) {
						D.bottomAttr.editCss(extra.obj, 'text-align', 'left', extra.pseudo);
					}
				});
				this.target.delegate('div.font-attr span.align-right', 'click', function() {
					var self = $(this), attrType = _findDataExtra(self);
					var extra = attrType.data(D.bottomAttr.CONSTANTS.extra);
					if(extra) {
						D.bottomAttr.editCss(extra.obj, 'text-align', 'right', extra.pseudo);
					}
				});
				this.target.delegate('div.font-attr span.align-center', 'click', function() {
					var self = $(this), attrType = _findDataExtra(self);
					var extra = attrType.data(D.bottomAttr.CONSTANTS.extra);
					if(extra) {
						D.bottomAttr.editCss(extra.obj, 'text-align', 'center', extra.pseudo);
					}
				});
				this.target.delegate('div.font-attr span.font-bold', 'click', function() {
					var self = $(this), attrType = _findDataExtra(self);
					var extra = attrType.data(D.bottomAttr.CONSTANTS.extra);
					if(extra) {
						if(self.data(D.bottomAttr.CONSTANTS.selected) === D.bottomAttr.CONSTANTS.selected) {
							self.data(D.bottomAttr.CONSTANTS.selected, null);
							D.bottomAttr.editCss(extra.obj, 'font-weight', 'normal', extra.pseudo);

						} else {
							self.data(D.bottomAttr.CONSTANTS.selected, D.bottomAttr.CONSTANTS.selected);
							D.bottomAttr.editCss(extra.obj, 'font-weight', 'bold', extra.pseudo);
						}

					}
				});
				this.target.delegate('div.font-attr select.font-size', 'change', function() {
					var self = $(this), attrType = _findDataExtra(self);
					var extra = attrType.data(D.bottomAttr.CONSTANTS.extra);
					if(extra) {
						D.bottomAttr.editCss(extra.obj, 'font-size', self.val(), extra.pseudo);
					}
				});
				this.target.delegate('div.font-attr select.font-family', 'change', function() {
					var self = $(this), attrType = _findDataExtra(self);
					var extra = attrType.data(D.bottomAttr.CONSTANTS.extra);
					if(extra) {
						D.bottomAttr.editCss(extra.obj, 'font-family', self.val(), extra.pseudo);
					}
				});

				this.target.delegate('div.font-attr input[name=hover-color]', 'input', function() {
					var self = $(this), attrType = _findDataExtra(self);
					var extra = attrType.data(D.bottomAttr.CONSTANTS.extra);
					if(extra) {
						D.bottomAttr.colorBoxChange(self, self.val());
					}

				});

				/**
				 * 修改文本
				 */

				this.target.delegate('div.font-attr #box-bottom-text', 'input', function() {
					var self = $(this), attrType = _findDataExtra(self);
					var extra = attrType.data(D.bottomAttr.CONSTANTS.extra);
					if(extra) {
						D.EditContent.editContent({
							'elem' : extra.obj,
							'key' : '#text',
							'value' : self.val()
						});
					}

				});
				$('#panel_tab').delegate('div.font-attr #box-bottom-text', 'keypress', function(e) {
					var keyCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
					if(keyCode === 32) {
						D.bottomAttr.insertText($(this), '&nbsp;');
					}
				});

			},
			/**
			 * 背景色和图片
			 */
			_background : function() {
				this.target.delegate('div.background-attr .js-bg', 'click', function(event) {
					var $self = $(this), that = this, val = $self.val(), attrType = _findDataExtra($self),
					//
					extra = attrType.data(D.bottomAttr.CONSTANTS.extra), $target = extra.obj
					//
					$parent = '', classType = [D.bottomAttr.CLASSATTR.main, D.bottomAttr.CLASSATTR.gridsMain],
					//
					mainStyle = '', $mainStyle = '', gridsStyle = '', $gridsStyle = '', style = '';
					if(!$target.hasClass(val)) {
						$parent = $target.closest('#design-container');
						$mainStyle = $parent.find('style[data-for=' + classType[0] + ']');
						$gridsStyle = $parent.find('style[data-for=' + classType[1] + ']');

						if(val === classType[0]) {//全屏背景
							//更新节点
							extra.obj = $parent.find('.' + classType[0]);
							if($gridsStyle && $gridsStyle.length) {
								$mainStyle.remove();
								//更换样式
								$gridsStyle.attr('data-for', classType[0]);
								style = '';
								style = $gridsStyle.html();
								style = style.replace(new RegExp("." + classType[1], "gm"), ' .' + classType[0]);
								$gridsStyle.html(style)

								//移动样式
								extra.obj.before($gridsStyle);
							}
						}
						if(val === classType[1]) {//栅格背景
							//更新节点
							extra.obj = $parent.find('.' + classType[1]);
							if($mainStyle && $mainStyle.length) {
								$gridsStyle.remove();
								//更换样式
								$mainStyle.attr('data-for', classType[1]);
								style = '';
								style = $mainStyle.html();
								style = style.replace(new RegExp("." + classType[0], "gm"), ' .' + classType[1]);
								$mainStyle.html(style);

								//移动样式
								extra.obj.before($mainStyle);
							}
						}
						D.BoxTools.setEdited();
					}
				});
				this.target.delegate('div.background-attr input[type=checkbox]', 'click', function() {
					var self = $(this), repeat = 'no-repeat', repeatX = false, repeatY = false;
					var attrType = _findDataExtra(self);
					var extra = attrType.data(D.bottomAttr.CONSTANTS.extra), selfParent = self.parent();
					$('input[type=checkbox]:checked', selfParent).each(function(index, obj) {
						var _self = $(obj), _name = _self.attr('name');
						if(_name === 'repeat-x') {
							repeatX = true;
						}
						if(_name === 'repeat-y') {
							repeatY = true;
						}
					});
					if(extra) {
						if(repeatX && repeatY) {
							repeat = 'repeat';
						}
						if(repeatX && !repeatY) {
							repeat = 'repeat-x';
						}
						if(!repeatX && repeatY) {
							repeat = 'repeat-y';
						}
						//console.log(repeat);
						D.bottomAttr.editCss(extra.obj, 'background-repeat', repeat, extra.pseudo);

					}
				});

				this.target.delegate('div.background-attr input[name=color-box]', 'input', function() {
					var self = $(this), attrType = _findDataExtra(self);
					var extra = attrType.data(D.bottomAttr.CONSTANTS.extra);
					if(extra) {
						D.bottomAttr.colorBoxChange(self, self.val());
						D.YunYing.isVisualChange();
					}

				});

				this.target.delegate('div.background-attr a.box-img', 'click', function(e) {
					var self = $(this), attrType = _findDataExtra(self), selfParent = self.parent().parent();
					var extra = attrType.data(D.bottomAttr.CONSTANTS.extra);
					var bgPosition = self.data('position');

					if(extra && extra.obj && bgPosition) {
						selfParent.children('li').each(function(index, obj) {
							var _self = $(obj);
							if(_self.hasClass('current')) {
								_self.removeClass('current');
							}
						});
						self.parent().addClass('current');
						D.bottomAttr.editCss(extra.obj, 'background-position', bgPosition, extra.pseudo);
					}

				});
				
				this.target.delegate('div.background-attr div.uploads', 'change', function(e) {
					var self = $(this), attrType = _findDataExtra(self);
					var extra = attrType.data(D.bottomAttr.CONSTANTS.extra);
					var url = $.trim(self.data('url'));
					var adboardId = $.trim(self.data('adboardid'));
					console.log(url+"=aa");
					if(extra) {
						if(extra) {
							//console.log(extra.obj)
							if(extra.pseudo) {
								D.bottomAttr.editCss(extra.obj, 'background-image', 'url(' + url + ')', extra.pseudo);
							} else {
								D.bottomAttr.editCss(extra.obj, 'background-image', 'url(' + url + ')');
								if(!adboardId) {
									extra.obj.removeAttr('data-adboardid');
								} else {
									D.EditContent.editContent({
										'elem' : extra.obj,
										'key' : 'data-adboardid',
										'value' : adboardId
									});
								}
							}
							D.YunYing.isVisualChange();
						}
					}
				});
			},
			/**
			 * 文本和copy标签
			 */
			_input : function() {

				this.target.delegate('div.height-width-attr input[type=text]', 'change', function() {
					var self = $(this), attrType = _findDataExtra(self), extra = attrType.data(D.bottomAttr.CONSTANTS.extra);
					if(extra) {
						if(extra.key === D.bottomAttr.ATTRIBUTE.COPY) {
							_inputAttr(self, extra);
						}
					}
				});

				this.target.delegate('div.height-width-attr input[type=text]', 'input', function() {
					var self = $(this), attrType = _findDataExtra(self), extra = attrType.data(D.bottomAttr.CONSTANTS.extra);
					if(extra) {
						if(extra.key !== D.bottomAttr.ATTRIBUTE.COPY) {
							_inputAttr(self, extra);
						}
					}
				});

				this.target.delegate('.ds-box-repeat', 'click', function() {
					var self = $(this), attrType = _findDataExtra(self), extra = attrType.data(D.bottomAttr.CONSTANTS.extra);
					if(extra) {
						var _module = extra.obj.closest('.crazy-box-module');
						if($('.ds-box-repeat').attr('checked')) {
							var $lis = extra.obj.parent().children();
							$lis.attr('data-dsrepeat', '');
							$lis.addClass('ds-box-module');
							//移除此属性表示前端展示offer条数由页面的dsrepeat决定
							_module.attr('data-dsrepeatbyrow', true);
						} else {
							var $lis = extra.obj.parent().children();
							//$lis.removeAttr('data-dsrepeat');
							$lis.removeClass('ds-box-module');
							//增加此属性表示前端展示offer条数由 数据源决定
							_module.attr('data-dsrepeatbyrow', false);

						}
					}
				});
			},
			_select : function() {
				this.target.delegate('div.select-attr select[name=attr-select]', 'change', function() {
					var self = $(this), obj = this, attrType = _findDataExtra(self), extra = attrType.data(D.bottomAttr.CONSTANTS.extra);
					if(extra) {
						var kv = obj.options[obj.selectedIndex].value;
						if(kv && kv !== '-1') {
							if(extra.key == 'data-dsdynamic') {
								//%templatecode% %offerids%
								var tdp = "$" + extra.obj.attr('data-dstdp');
								var templatecode = kv;
								extra.obj.attr('data-dstdptemplate', templatecode);
								var offerIds = extra.obj.attr('data-dstdparg');
								var topicId = extra.obj.attr('data-dstopicid');
								var blockId = extra.obj.attr('data-dstopicblockid');
								tdp = tdp.replace("%templatecode%", templatecode);
								tdp = tdp.replace("%topicId%", topicId);
								tdp = tdp.replace("%blockId%", blockId);
								extra.obj.attr('data-dsdynamic', tdp);
							} else {
								if(extra.key === D.bottomAttr.ATTRIBUTE.EDITATTR) {
									var $target = extra.obj, realKey = self.data(D.bottomAttr.ATTRIBUTE.EDITATTR);
									if(realKey === 'class') {
										if(!$target.hasClass(kv)) {
											for(var i = 0; i < obj.options.length; i++) {
												$target.removeClass(obj.options[i].value);
											}
											kv = $target.attr('class') + ' ' + kv;

											D.EditContent.editContent({
												'elem' : extra.obj,
												'key' : realKey,
												'value' : kv
											});
										}
									} else if(!realKey.indexOf("data-")) {
										//自定义属性 支持命名空间如 data-eleminfo.tag (data-eleminfo={tag:'aaa})
										var retObj = _defineAttr(realKey, extra.obj, kv);
										realKey = retObj.key;
										textValue = retObj.val;
										D.EditContent.editContent({
											'elem' : extra.obj,
											'key' : realKey,
											'value' : textValue
										});

									} else {
										D.EditContent.editContent({
											'elem' : extra.obj,
											'key' : realKey,
											'value' : kv
										});
									}

								} else {
									D.bottomAttr.editCss(extra.obj, extra.key, kv, extra.pseudo);
								}

								//alert(2);

							}
						}
					}

				});

			},
			/**
			 * 文本组
			 */
			_ginput : function() {

				this.target.delegate('div.margin-attr input[type=text]', 'input', function() {
					var self = $(this), attrType = _findDataExtra(self), extra = attrType.data(D.bottomAttr.CONSTANTS.extra);
					var top = '0px', bottom = '0px', left = '0px', right = '0px', selfParentUl = self.parent().parent();
					// border-radius: 0em 0em 1em 1em
					$('input[type=text]', selfParentUl).each(function(index, obj) {
						var _self = $(obj), _name = _self.attr('name'), val = _self.val();
						if(_name === 'attr-margin-top' && val) {
							top = D.bottomAttr.addPx(val);
						}
						if(_name === 'attr-margin-right' && val) {
							right = D.bottomAttr.addPx(val);
						}
						if(_name === 'attr-margin-bottom' && val) {
							bottom = D.bottomAttr.addPx(val);
						}
						if(_name === 'attr-margin-left' && val) {
							left = D.bottomAttr.addPx(val);
						}
					});
					if(extra) {
						D.bottomAttr.editCss(extra.obj, extra.key, top + ' ' + right + ' ' + bottom + ' ' + left, extra.pseudo);
					}
				});
			},
			/**
			 * 选中
			 */
			_public : function() {

				this.target.delegate('input[type=text]', 'focus', function() {
					var self = $(this);
					_showHighLight(self);
				});
				this.target.delegate('input[type=checkbox]', 'mousedown', function() {
					var self = $(this);
					//console.log(self.attr('name'));
					_showHighLight(self);
				});
				this.target.delegate('textarea', 'focus', function() {
					var self = $(this);
					_showHighLight(self);
				});
				//alert(1);

			},
			_color : function() {
				this.target.delegate('div.hover-attr input[name=hover-color]', 'input', function() {
					var self = $(this), attrType = _findDataExtra(self);
					var extra = attrType.data(D.bottomAttr.CONSTANTS.extra);
					if(extra) {
						D.bottomAttr.colorBoxChange(self, self.val());
					}

				});
			},
			/**
			 * 边框
			 */
			_border : function() {
				this.target.delegate('div.border-attr input[type=checkbox]', 'change', function() {
					var self = $(this), top = '0px', bottom = '0px', left = '0px', right = '0px';
					var attrType = _findDataExtra(self);
					var extra = attrType.data(D.bottomAttr.CONSTANTS.extra), selfParentUl = self.parent().parent();
					$('input[type=checkbox]:checked', selfParentUl).each(function(index, obj) {
						var _self = $(obj), _name = _self.attr('name'), borderWidth = $('#panel_tab div.border-attr input[name=border-width]').val();
						if(_name === 'border-top') {
							top = borderWidth + 'px';
						}
						if(_name === 'border-right') {
							right = borderWidth + 'px';
						}
						if(_name === 'border-bottom') {
							bottom = borderWidth + 'px';
						}
						if(_name === 'border-left') {
							left = borderWidth + 'px';
						}
					});
					if(extra) {
						D.bottomAttr.editCss(extra.obj, 'border-width', top + ' ' + right + ' ' + bottom + ' ' + left, extra.pseudo);
						D.bottomAttr.editCss(extra.obj, 'border-style', 'solid', extra.pseudo);
					}
				});

				//add by hongss on 2012.11.23 for 新增边框宽度
				this.target.delegate('div.border-attr input[name=border-width]', 'input', function() {
					var elem = $(this), attrType = _findDataExtra(elem), extra = attrType.data(D.bottomAttr.CONSTANTS.extra);
					if(extra) {
						$('#panel_tab div.border-attr input[type=checkbox]').trigger('change');
						if($('#panel_tab div.border-attr input[name=border-radius]').val() > 0) {
							$('#panel_tab div.border-attr input[name=border-radius]').trigger('input');
						}
					}
				});
				//ends

				this.target.delegate('div.border-attr input[name=border-color]', 'input', function() {
					var self = $(this), attrType = _findDataExtra(self);
					var extra = attrType.data(D.bottomAttr.CONSTANTS.extra);
					if(extra) {
						D.bottomAttr.colorBoxChange(self, self.val());
					}

				});

				/**
				 *
				 */

				this.target.delegate('div.border-attr input[name=border-radius]', 'input', function() {
					var self = $(this), radius = self.val(), attrType = _findDataExtra(self), extra = attrType.data(D.bottomAttr.CONSTANTS.extra);

					// border-radius: 0em 0em 1em 1em
					//console.log(radius);
					if(extra) {
						if(radius > 0) {
							var borderWidth = $('#panel_tab div.border-attr input[name=border-width]').val();
							$('input[type=checkbox]', 'div.border-attr').each(function(index, val) {
								val.checked = true;
								val.disabled = true;

							});
							D.bottomAttr.editCss(extra.obj, 'border-width', borderWidth + 'px', extra.pseudo);
							D.bottomAttr.editCss(extra.obj, 'border-style', 'solid solid solid solid', extra.pseudo);
						} else {
							$('input[type=checkbox]', 'div.border-attr').each(function(index, val) {
								val.checked = false;
								val.disabled = false;
							});
							D.bottomAttr.editCss(extra.obj, 'border-width', '0px', extra.pseudo);
						}
						var radiusPx = radius + 'px ' + radius + 'px ' + radius + 'px ' + radius + 'px';
						D.bottomAttr.editCss(extra.obj, 'border-radius', radiusPx, extra.pseudo);
						D.bottomAttr.editCss(extra.obj, '-webkit-border-radius', radiusPx, extra.pseudo);
						D.bottomAttr.editCss(extra.obj, '-moz-border-radius', radiusPx, extra.pseudo);

					}
				});

			}
		};
		/**
		 * input触发事件
		 */
		var _inputAttr = function(self, extra) {
			var realKey = self.data(D.bottomAttr.ATTRIBUTE.EDITATTR),
			//
			textValue = self.val();
			if(extra) {
				switch(extra.key) {
					case D.bottomAttr.ATTRIBUTE.COPY:
						var repeatNum = parseInt(self.val());
						if(!isNaN(repeatNum)) {
							//$arg 为控件 特殊处理 逻辑如下：如$arg是控件但不是容器控件，则可重复此控件,
							// 重复是把当前控件放到容器控件中去，然后重复当前控件的父节点，
							//实现方法是和原来拖拉一样，只是这种方法是程序做，原来是人工做。

							if(extra.enableType && extra.enableType === 'cell') {
								var target = extra.obj, targetClone = target.clone();
								var cellParent = target.parent();
								_boxOptions = cellParent.data(D.bottomAttr.CONSTANTS['boxOptions']);
								var isCopy = function(obj) {
									if(obj && obj.ability && obj.ability.copy && obj.ability.copy.enable && obj.ability.copy.enable === 'true') {
										return true;
									} else {
										return false;
									}
								}, isConCell = function(obj) {
									if(obj && obj.ability && obj.ability.container && obj.ability.container.enableType && obj.ability.container.enableType === 'cell') {
										return true;
									} else {
										return false;
									}
								};

								//有容器控件
								if(isCopy(_boxOptions) && isConCell(_boxOptions)) {
									if(repeatNum > 1) {//如果重复数不等于一
										D.EditContent.editCopy({
											'elem' : cellParent,
											'value' : self.val(),
											'relative' : extra.relative
										});
									} else {//如果重复数小于或等于1，默认为1
										D.EditContent.editCopy({
											'elem' : cellParent,
											'value' : 1,
											'relative' : extra.relative
										});
										//处理容器控件样式 没有加组件样式命名空间bug
										var cellTemp = target.closest('.cell-ul-containter');
										if(cellTemp.length > 0) {
											var parentTemp = cellTemp.parent();
											var preClassName = D.BoxTools.getClassName(target.closest('.crazy-box-module'), /^(cell-module$)|(cell-module-\d+$)/);
											var $style = parentTemp.find('style[data-for=cell-ul-containter]');
											var _style = $style.html();
											if(_style.indexOf(preClassName) === -1) {
												var newStyle = _style.replace(new RegExp(".cell-ul-containter", "gm"), ' .' + preClassName + ' .cell-ul-containter');
												$style.html(newStyle);
											}

										}
									}
								} else {//没有容器控件，添加容器控件
									if(repeatNum > 1) {//如果重复数小于等于一，则不做处理
										var $containterCell = $(containterCellHtml);
										//给容器控件增加组件前缀命名空间
										var htmlcode = D.ManagePageDate._addFixpreClass($containterCell.html(), target, 'cell');
										$containterCell.html(htmlcode);
										var $containter = $containterCell.find('.cell-ul-containter');
										var $repeatContainter = $containter.find('.crazy-ul-containter-li');
										//重复单元
										//克隆重复单元 上面重复单元下面会删除
										var $repeatContainter1 = $repeatContainter.clone();
										//var ygypc = D.DropInPage.getElemHtml(target);
										$containter.empty();
										for(var i = 0; i < repeatNum; i++) {
											var tmp = $repeatContainter1.clone();
											$containter.append(tmp.append(target.clone()));
										}
										D.InsertHtml.init({
											'html' : $containterCell.html(),
											'container' : target,
											'insertType' : 'replaceWith',
											'doc' : D.editModule && D.editModule.iframeDoc,
											'isEdit' : true
										});
									}
								}
								D.editModule && D.editModule._hideAll();
								//
							} else {
								D.EditContent.editCopy({
									'elem' : extra.obj,
									'value' : self.val(),
									'relative' : extra.relative
								});
							}
						}

						break;
					case D.bottomAttr.ATTRIBUTE.EDITATTR:
						if(!realKey.indexOf("data-")) {//自定义属性 支持命名空间如 data-eleminfo.tag (data-eleminfo={tag:'aaa})
							var retObj = _defineAttr(realKey, extra.obj, textValue);
							realKey = retObj.key;
							textValue = retObj.val;
						}
						D.EditContent.editContent({
							'elem' : extra.obj,
							'key' : realKey,
							'value' : textValue
						});

						// D.bottomAttr.editCss(extra.obj, self.data(D.bottomAttr.ATTRIBUTE.EDITATTR), self.val());
						break;
					default:
						var _val = self.val();
						if(_val) {
							if(!isNaN(_val) && _checkAddPx(extra.key)) {
								_val = D.bottomAttr.addPx(_val);
							}
						}
						D.bottomAttr.editCss(extra.obj, extra.key, _val, extra.pseudo);

						break;
				}
			}
		};
		//处理自定义属性 支持命名空间如 data-eleminfo.tag (data-eleminfo={tag:'aaa})
		var _defineAttr = function(realKey, $obj, textValue) {
			var keys = realKey.split('.'), object = {};
			realKey = keys[0];
			object = $obj.attr(realKey) ? JSON.parse($obj.attr(realKey)) : {};
			for(var i = 1; i < keys.length; i++) {
				if(i === keys.length - 1) {
					object[keys[i]] = textValue;
				} else {
					object = object[keys[i]] = {};
				}

			};
			textValue = JSON.stringify(object);
			return {
				key : realKey,
				val : textValue
			};
		};
		/**
		 * 检查是否需要添加px单位
		 */
		var _checkAddPx = function(key) {
			if(key) {
				if(-1 != key.indexOf('margin')
				//
				|| -1 != key.indexOf('padding')
				//
				|| 'top' === key || 'left' === key || 'bottom' === key || 'right' === key
				//
				|| -1 != key.lastIndexOf('width')
				//
				|| -1 != key.lastIndexOf('height') || 'vertical-align' === key) {
					return true;
				}
			}
			return false;
		};
		/**
		 * 查找class有attr-type的jQuery对象
		 */
		var _findDataExtra = function($arg) {
			return D.bottomAttr.findDataExtra($arg);
		};
		/**
		 * 高亮显示
		 */
		var _showHighLight = function(self) {
			var attrType = _findDataExtra(self), extra;
			//console.log(attrType);
			if(attrType) {
				extra = attrType.data(D.bottomAttr.CONSTANTS.extra);
			}
			//console.log(extra);
			if(extra) {
				var $html = extra.obj;
				if($html.hasClass('crazy-box-layout')) {
					return;
				}
				if($html.attr('id') !== D.bottomAttr.CLASSATTR.content) {
					//D.BoxTools.showHighLight(extra.obj);
					//modify by hongss on 2012.01.08 for cell下可重复标签允许上移、下移、复制功能
					$(document).trigger('box.editor.label_move_copy', [extra.obj]);
				}

			}
		};
		/**
		 * 动态数据源邦定数据，给cell parent节点增加dsrepeat属性  微布局
		 * $html 当前对象
		 * bln true 增加属性  false删除属性
		 */
		var addDsRepeat = function($html, bln) {

			if($html && $html.length > 0) {
				var _module = $html.closest('.crazy-box-module');
				var _cell = $html.closest('.crazy-box-cell'), cellParent = _cell.parent();
				cellParent.attr('data-dsrepeat', '');
			}
		};
		/**
		 * 查询当前元素是否在微布局当中
		 */
		var queryMicrolayout = function($html) {
			if($html.hasClass('crazy-box-module')) {
				return false;
			}
			if($html.hasClass('cell-table-containter')) {//微布局
				return true;
			}
			return arguments.callee($html.parent());
		};
		/**
		 * 增加dsrepeat
		 * 删除dsrepeat
		 * @param {Object} $html
		 * @param {Object} bln true 增加dsrepeat false 删除dsrepeat
		 */
		var dsRepeat = function($html, bln) {
			if(bln) {
				$html.attr('data-dsrepeat', '');
			} else {
				$html.removeAttr('data-dsrepeat');
			}

		};
		
	});
})(dcms, FE.dcms);
