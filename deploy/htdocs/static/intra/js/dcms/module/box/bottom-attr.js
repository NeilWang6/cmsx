/**
 *
 * @author springyu
 * @userfor 属性面板初始化操作
 * @date 2012-02-07
 */
;(function($, D) {
    var REPEATBYDS = 'dsrepeatbyrow';
    $(function() {
        D.bottomAttr.bind = {
            /**
             * ＠desc 传入jQuery对象,需要选中的jQuery对象
             */
            init : function() {
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
                $('select', 'div.ds-link-attr').bind('change', function(e) {
                    var self = $(this), that = this, attrType = _findDataExtra(self);
                    var extra = attrType.data(D.bottomAttr.CONSTANTS['extra']);
                    var $html = extra.obj, val = that.options[that.selectedIndex].value;
                    var dsmoduleid = self.data('dsmoduleId'), dsoptions;

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
                                    'md' : dsmoduleid,
                                    'field' : val
                                };
                                var $temp = $('select#link-title')[0];
                                var otherVal = $temp.options[$temp.selectedIndex].value;
                            }
                            if(self.attr('name') === 'link-title') {
                                dsoptions.title = {
                                    'md' : dsmoduleid,
                                    'field' : val
                                };
                                var $temp = $('select#link-href')[0];
                                var otherVal = $temp.options[$temp.selectedIndex].value;
                            }
                        } else {
                            if(self.attr('name') === 'link-href') {
                                dsoptions = {
                                    'href' : {
                                        'md' : dsmoduleid,
                                        'field' : val
                                    }
                                };
                                var $temp = $('select#link-title')[0];
                                var otherVal = $temp.options[$temp.selectedIndex].value;
                            }
                            if(self.attr('name') === 'link-title') {
                                dsoptions = {
                                    'title' : {
                                        'md' : dsmoduleid,
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
                $('select', 'div.ds-image-attr').bind('change', function(e) {
                    var self = $(this), that = this, attrType = _findDataExtra(self);
                    var extra = attrType.data(D.bottomAttr.CONSTANTS['extra']);
                    var $html = extra.obj, val = that.options[that.selectedIndex].value;
                    var dsmoduleid = self.data('dsmoduleId'), dsoptions;

                    if(extra && $html) {

                        if($html.data('dsoptions')) {
                            dsoptions = $html.data('dsoptions');
                            if(self.attr('name') === 'img-url') {
                                dsoptions.src = {
                                    'md' : dsmoduleid,
                                    'field' : val
                                };

                                var $temp = $('select', 'div.ds-image-attr')[1];
                                var otherVal = $temp.options[$temp.selectedIndex].value;
                            }
                            if(self.attr('name') === 'img-alt') {
                                dsoptions.alt = {
                                    'md' : dsmoduleid,
                                    'field' : val
                                };
                                var $temp = $('select', 'div.ds-image-attr')[0];
                                var otherVal = $temp.options[$temp.selectedIndex].value;
                            }
                        } else {
                            if(self.attr('name') === 'img-url') {
                                dsoptions = {
                                    'src' : {
                                        'md' : dsmoduleid,
                                        'field' : val
                                    }
                                };
                                var $temp = $('select', 'div.ds-image-attr')[1];
                                var otherVal = $temp.options[$temp.selectedIndex].value;
                            }
                            if(self.attr('name') === 'img-alt') {
                                dsoptions = {
                                    'alt' : {
                                        'md' : dsmoduleid,
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
                $('select', "div.ds-text-attr").bind('change', function(e) {
                    var self = $(this), that = this, attrType = _findDataExtra(self);
                    var extra = attrType.data(D.bottomAttr.CONSTANTS['extra']);
                    var $html = extra.obj, val = that.options[that.selectedIndex].value;
                    var dsmoduleid = self.data('dsmoduleId'), dsoptions;
                    if(extra && $html) {
                        if($html.data('dsoptions')) {
                            dsoptions = $html.data('dsoptions');
                            if(self.attr('name') === 'link-href') {
                                dsoptions.text = {
                                    'md' : dsmoduleid,
                                    'field' : val
                                };
                            }
                        } else {
                            if(self.attr('name') === 'link-href') {
                                dsoptions = {
                                    'text' : {
                                        'md' : dsmoduleid,
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
                $('input', "div.ds-text-attr").each(function(index, obj) {
                    obj.addEventListener('input', function() {
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
                    }, false);
                });
            },
            /**
             * 属性模板 图片模板事件邦定
             */
            _image : function() {
                $('input[name=alt]', 'div.image-attr').each(function(index, obj) {
                    obj.addEventListener('input', function() {
                        var self = $(this), attrType = _findDataExtra(self);
                        var extra = attrType.data(D.bottomAttr.CONSTANTS['extra']);
                        if(extra) {
                            D.EditContent.editContent({
                                'elem' : extra.obj,
                                'key' : 'alt',
                                'value' : $.trim(self.val())
                            });

                        }
                    }, false);
                });
                $('div.uploads', 'div.image-attr').bind('change', function(e) {
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

                    }
                });
            },
            /**
             * 属性模板 a标签模板事件邦定
             */
            _link : function() {
                $('input[name=attr-link]', 'div.link-attr').bind('mouseup', function() {
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
                $('textarea[name=link-href]', 'div.link-attr').each(function(index, obj) {
                    obj.addEventListener('input', function(e) {
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

                    }, false);
                });
                /**
                 * a标签title
                 */
                $('input[name=link-title]', 'div.link-attr').each(function(index, obj) {
                    obj.addEventListener('input', function() {
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
                    }, false);
                });
            },
            /**
             * 文本编辑
             */
            _font_text : function() {
                $('span.align-left', 'div.font-attr').bind('click', function() {
                    var self = $(this), attrType = _findDataExtra(self);
                    var extra = attrType.data(D.bottomAttr.CONSTANTS.extra);
                    if(extra) {
                        /** D.EditContent.editCss({
                         'elem' : extra.obj,
                         'key' : 'text-align',
                         'value' : 'left'
                         });**/
                        D.bottomAttr.editCss(extra.obj, 'text-align', 'left', extra.pseudo);
                    }
                });
                $('span.align-right', 'div.font-attr').bind('click', function() {
                    var self = $(this), attrType = _findDataExtra(self);
                    var extra = attrType.data(D.bottomAttr.CONSTANTS.extra);
                    if(extra) {
                        /**  D.EditContent.editCss({
                         'elem' : extra.obj,
                         'key' : 'text-align',
                         'value' : 'right'
                         }); **/
                        D.bottomAttr.editCss(extra.obj, 'text-align', 'right', extra.pseudo);
                    }
                });
                $('span.align-center', 'div.font-attr').bind('click', function() {
                    var self = $(this), attrType = _findDataExtra(self);
                    var extra = attrType.data(D.bottomAttr.CONSTANTS.extra);
                    if(extra) {
                        //  D.EditContent.editCss({
                        //'elem' : extra.obj,
                        //'key' : 'text-align',
                        // 'value' : 'center'
                        //});
                        D.bottomAttr.editCss(extra.obj, 'text-align', 'center', extra.pseudo);
                    }
                });
                $('span.font-bold', 'div.font-attr').bind('click', function() {
                    var self = $(this), attrType = _findDataExtra(self);
                    var extra = attrType.data(D.bottomAttr.CONSTANTS.extra);
                    if(extra) {
                        if(self.data(D.bottomAttr.CONSTANTS.selected) === D.bottomAttr.CONSTANTS.selected) {
                            self.data(D.bottomAttr.CONSTANTS.selected, null);
                            // D.EditContent.editCss({
                            // 'elem' : extra.obj,
                            // 'key' : 'font-weight',
                            //'value' : 'normal'
                            //});
                            D.bottomAttr.editCss(extra.obj, 'font-weight', 'normal', extra.pseudo);

                        } else {
                            self.data(D.bottomAttr.CONSTANTS.selected, D.bottomAttr.CONSTANTS.selected);
                            /**D.EditContent.editCss({
                             'elem' : extra.obj,
                             'key' : 'font-weight',
                             'value' : 'bold'
                             });**/
                            D.bottomAttr.editCss(extra.obj, 'font-weight', 'bold', extra.pseudo);
                        }

                    }
                });
                $('select.font-size', 'div.font-attr').bind('change', function() {
                    var self = $(this), attrType = _findDataExtra(self);
                    var extra = attrType.data(D.bottomAttr.CONSTANTS.extra);
                    if(extra) {
                        /**D.EditContent.editCss({
                         'elem' : extra.obj,
                         'key' : 'font-size',
                         'value' : self.val()
                         });**/
                        D.bottomAttr.editCss(extra.obj, 'font-size', self.val(), extra.pseudo);
                    }
                });
                $('select.font-family', 'div.font-attr').bind('change', function() {
                    var self = $(this), attrType = _findDataExtra(self);
                    var extra = attrType.data(D.bottomAttr.CONSTANTS.extra);
                    if(extra) {
                        D.bottomAttr.editCss(extra.obj, 'font-family', self.val(), extra.pseudo);
                        /**D.EditContent.editCss({
                         'elem' : extra.obj,
                         'key' : 'font-family',
                         'value' : self.val()
                         }); **/
                    }
                });
                $('input[name=hover-color]', 'div.font-attr').each(function(index, obj) {
                    obj.addEventListener('input', function() {
                        var self = $(this), attrType = _findDataExtra(self);
                        var extra = attrType.data(D.bottomAttr.CONSTANTS.extra);
                        if(extra) {
                            D.bottomAttr.colorBoxChange(self, self.val());
                        }

                    }, false);
                });
                /**
                 * 修改文本
                 */
                $('#box-bottom-text', 'div.font-attr').each(function(index, obj) {
                    obj.addEventListener('input', function() {
                        var self = $(this), attrType = _findDataExtra(self);
                        var extra = attrType.data(D.bottomAttr.CONSTANTS.extra);
                        if(extra) {
                            D.EditContent.editContent({
                                'elem' : extra.obj,
                                'key' : '#text',
                                'value' : self.val()
                            });
                        }

                    }, false);
                    obj.addEventListener('keypress', function(e) {
                        var keyCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
                        if(keyCode === 32) {
                            D.bottomAttr.insertText($(obj), '&nbsp;');
                        }
                    });
                });
            },
            /**
             * 背景色和图片
             */
            _background : function() {
                $('input[type=checkbox]', 'div.background-attr').bind('click', function() {
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
                        // D.EditContent.editCss({
                        //'elem' : extra.obj,
                        //'key' : 'background-repeat',
                        //'value' : repeat
                        //});

                    }
                });
                $('input[name=color-box]', 'div.background-attr').each(function(index, obj) {
                    obj.addEventListener('input', function() {
                        var self = $(this), attrType = _findDataExtra(self);
                        var extra = attrType.data(D.bottomAttr.CONSTANTS.extra);
                        if(extra) {
                            D.bottomAttr.colorBoxChange(self, self.val());
                        }

                    }, false);
                });
                $('a.box-img', 'div.background-attr').bind('click', function(e) {
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

                $('div.uploads', 'div.background-attr').bind('change', function(e) {
                    var self = $(this), attrType = _findDataExtra(self);
                    var extra = attrType.data(D.bottomAttr.CONSTANTS.extra);
                    var url = $.trim(self.data('url'));
                    var adboardId = $.trim(self.data('adboardid'));
                    //console.log(url+"=aa");
                    if(extra) {
                        if(extra) {
                            //console.log(extra.obj)
                            if(extra.pseudo) {
                                D.bottomAttr.editCss(extra.obj, 'background-image', 'url(' + url + ')', extra.pseudo);
                                //D.EditContent.editCss({
                                //'elem' : extra.obj,
                                // 'key' : 'background-image',
                                // 'value' : 'url(' + url + ')',
                                //'pseudo' : extra.pseudo
                                //});
                            } else {
                                D.bottomAttr.editCss(extra.obj, 'background-image', 'url(' + url + ')');
                                //D.EditContent.editCss({
                                // 'elem' : extra.obj,
                                //'key' : 'background-image',
                                //'value' : 'url(' + url + ')'
                                // });
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

                            //D.EditContent.editCss({
                            // 'elem' : extra.obj,
                            // 'key' : 'background-repeat',
                            //'value' : 'no-repeat'
                            //});
                        }
                    }
                });
            },
            /**
             * 文本和copy标签
             */
            _input : function() {
                $('input[type=text]', 'div.height-width-attr').each(function(index, obj) {
                    var self = $(obj), attrType = _findDataExtra(self), extra = attrType.data(D.bottomAttr.CONSTANTS.extra);
                    if(extra) {
                        if(extra.key === D.bottomAttr.ATTRIBUTE.COPY) {
                            obj.addEventListener('change', function() {
                                var dsmoduleId = attrType.data('dsmoduleid');
                                if(extra.obj && dsmoduleId) {
                                    repeatByDs(extra.obj, true, {
                                        'dsModuleId' : dsmoduleId
                                    });
                                } else {
                                     repeatByDs(extra.obj, false);
                                }

                                _inputAttr(self, extra);
                            }, false);
                        } else {
                            obj.addEventListener('input', function() {
                                _inputAttr(self, extra);
                            }, false);
                        }
                    }

                });
                $('.ds-box-repeat').click(function() {
                    var self = $(this), attrType = _findDataExtra(self), extra = attrType.data(D.bottomAttr.CONSTANTS.extra);
                    var dsmoduleId = attrType.data('dsmoduleid');
                    if(extra) {
                        if($('.ds-box-repeat').attr('checked')) {
                            var $lis = extra.obj.parent().children();
                            $lis.attr('data-dsrepeat', '{ dsModuleId:' + dsmoduleId + '}');
                            $lis.addClass('ds-box-module');
                            //移除此属性表示前端展示offer条数由页面的dsrepeat决定
                            //$lis.removeClass(REPEATBYDS);
                            repeatByDs($lis, false);
                        } else {
                            var $lis = extra.obj.parent().children();
                            $lis.removeAttr('data-dsrepeat');
                            $lis.removeClass('ds-box-module');
                            //增加此属性表示前端展示offer条数由 数据源决定
                            repeatByDs($lis, true, {
                                'dsModuleId' : dsmoduleId
                            });

                        }
                    }
                });
            },
            _select : function() {
                $('select[name=attr-select]', 'div.select-attr').each(function(index, obj) {
                    var self = $(obj), attrType = _findDataExtra(self), extra = attrType.data(D.bottomAttr.CONSTANTS.extra);
                    if(extra) {
                        obj.addEventListener('change', function() {
                            //alert(obj.options[obj.selectedIndex].value);
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
                                    //console.log(extra.obj);
                                    //console.log(extra.obj.attr('data-dsdynamic'));
                                } else {
                                    D.bottomAttr.editCss(extra.obj, extra.key, kv, extra.pseudo);
                                    //alert(2);

                                }
                            }

                        }, false);
                    }

                });
            },
            /**
             * 文本组
             */
            _ginput : function() {
                $('input[type=text]', 'div.margin-attr').each(function(index, obj) {
                    obj.addEventListener('input', function() {
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
                        //console.log(top + ' ' + right + ' ' + bottom + ' ' + left);
                        if(extra) {
                            D.bottomAttr.editCss(extra.obj, extra.key, top + ' ' + right + ' ' + bottom + ' ' + left, extra.pseudo);
                            // if(extra.key === 'padding') {
                            // D.EditContent.editCss({
                            //  'elem' : extra.obj,
                            //  'key' : extra.key,
                            //  'value' : top + ' ' + right + ' ' + bottom + ' ' + left
                            // });
                            // }
                            //if(extra.key === 'margin') {
                            // D.bottomAttr.editCss(extra.obj, extra.key, top + ' ' + right + ' ' + bottom + ' ' + left);
                            //D.EditContent.editCss({
                            //'elem' : extra.obj,
                            // 'key' : extra.key,
                            // 'value' : top + ' ' + right + ' ' + bottom + ' ' + left
                            //});
                            //}

                        }
                    }, false);
                });
            },
            /**
             * 选中
             */
            _public : function() {

                $('input[type=text]').bind('focus', function() {
                    var self = $(this);
                    _showHighLight(self);
                });
                $('input[type=checkbox]').bind('mousedown', function() {
                    var self = $(this);
                    //console.log(self.attr('name'));
                    _showHighLight(self);
                });
                $('textarea').bind('focus', function() {
                    var self = $(this);
                    _showHighLight(self);
                });
                //alert(1);

            },
            _color : function() {
                $('input[name=hover-color]', 'div.hover-attr').each(function(index, obj) {
                    obj.addEventListener('input', function() {
                        var self = $(this), attrType = _findDataExtra(self);
                        var extra = attrType.data(D.bottomAttr.CONSTANTS.extra);
                        if(extra) {
                            D.bottomAttr.colorBoxChange(self, self.val());
                        }

                    }, false);
                });
            },
            /**
             * 边框
             */
            _border : function() {
                $('input[type=checkbox]', 'div.border-attr').bind('click', function() {
                    var self = $(this), top = '0px', bottom = '0px', left = '0px', right = '0px';
                    var attrType = _findDataExtra(self);
                    var extra = attrType.data(D.bottomAttr.CONSTANTS.extra), selfParentUl = self.parent().parent();
                    $('input[type=checkbox]:checked', selfParentUl).each(function(index, obj) {
                        var _self = $(obj), _name = _self.attr('name');
                        if(_name === 'border-top') {
                            top = '1px';
                        }
                        if(_name === 'border-right') {
                            right = '1px';
                        }
                        if(_name === 'border-bottom') {
                            bottom = '1px';
                        }
                        if(_name === 'border-left') {
                            left = '1px';
                        }
                    });
                    if(extra) {
                        D.bottomAttr.editCss(extra.obj, 'border-width', top + ' ' + right + ' ' + bottom + ' ' + left, extra.pseudo);
                        D.bottomAttr.editCss(extra.obj, 'border-style', 'solid solid solid solid', extra.pseudo);
                        /**D.EditContent.editCss({
                         'elem' : extra.obj,
                         'key' : 'border-width',
                         'value' : top + ' ' + right + ' ' + bottom + ' ' + left
                         });
                         D.EditContent.editCss({
                         'elem' : extra.obj,
                         'key' : 'border-style',
                         'value' : 'solid solid solid solid'
                         });**/
                    }
                });
                $('input[name=border-color]', 'div.border-attr').each(function(index, obj) {
                    obj.addEventListener('input', function() {
                        var self = $(this), attrType = _findDataExtra(self);
                        var extra = attrType.data(D.bottomAttr.CONSTANTS.extra);
                        if(extra) {
                            D.bottomAttr.colorBoxChange(self, self.val());
                        }

                    }, false);
                });
                /**
                 *
                 */
                $('input[name=border-radius]', 'div.border-attr').each(function(index, obj) {
                    obj.addEventListener('input', function() {
                        var self = $(this), radius = self.val(), attrType = _findDataExtra(self), extra = attrType.data(D.bottomAttr.CONSTANTS.extra);

                        // border-radius: 0em 0em 1em 1em
                        //console.log(radius);
                        if(extra) {
                            if(radius > 0) {
                                $('input[type=checkbox]', 'div.border-attr').each(function(index, val) {
                                    val.checked = true;
                                    val.disabled = true;

                                });
                                D.bottomAttr.editCss(extra.obj, 'border-width', '1px 1px 1px 1px', extra.pseudo);
                                D.bottomAttr.editCss(extra.obj, 'border-style', 'solid solid solid solid', extra.pseudo);
                                /** D.EditContent.editCss({
                                 'elem' : extra.obj,
                                 'key' : 'border-width',
                                 'value' : '1px 1px 1px 1px'
                                 });
                                 D.EditContent.editCss({
                                 'elem' : extra.obj,
                                 'key' : 'border-style',
                                 'value' : 'solid solid solid solid'
                                 });**/
                            } else {
                                $('input[type=checkbox]', 'div.border-attr').each(function(index, val) {
                                    val.checked = false;
                                    val.disabled = false;
                                });
                                D.bottomAttr.editCss(extra.obj, 'border-width', '0px', extra.pseudo);
                                D.bottomAttr.editCss(extra.obj, 'border-width', 'none', extra.pseudo);
                                /**D.EditContent.editCss({
                                 'elem' : extra.obj,
                                 'key' : 'border-width',
                                 'value' : '0px'
                                 });
                                 D.EditContent.editCss({
                                 'elem' : extra.obj,
                                 'key' : 'border-style',
                                 'value' : 'none'
                                 });**/
                            }
                            var radiusPx = radius + 'px ' + radius + 'px ' + radius + 'px ' + radius + 'px';
                            D.bottomAttr.editCss(extra.obj, 'border-radius', radiusPx, extra.pseudo);
                            D.bottomAttr.editCss(extra.obj, '-webkit-border-radius', radiusPx, extra.pseudo);
                            D.bottomAttr.editCss(extra.obj, '-moz-border-radius', radiusPx, extra.pseudo);
                            /** D.EditContent.editCss({
                             'elem' : extra.obj,
                             'key' : 'border-radius',
                             'value' : radius + 'px ' + radius + 'px ' + radius + 'px ' + radius + 'px'
                             });
                             D.EditContent.editCss({
                             'elem' : extra.obj,
                             'key' : '-webkit-border-radius',
                             'value' : radius + 'px ' + radius + 'px ' + radius + 'px ' + radius + 'px'
                             });
                             D.EditContent.editCss({
                             'elem' : extra.obj,
                             'key' : '-moz-border-radius',
                             'value' : radius + 'px ' + radius + 'px ' + radius + 'px ' + radius + 'px'
                             });**/

                        }
                    }, false);
                });
            }
        };
        /**
         * input触发事件
         */
        var _inputAttr = function(self, extra) {
            if(extra) {
                switch(extra.key) {
                    case D.bottomAttr.ATTRIBUTE.COPY:

                        D.EditContent.editCopy({
                            'elem' : extra.obj,
                            'value' : self.val(),
                            'relative' : extra.relative
                        });
                        break;
                    case D.bottomAttr.ATTRIBUTE.EDITATTR:
                        D.EditContent.editContent({
                            'elem' : extra.obj,
                            'key' : self.data(D.bottomAttr.ATTRIBUTE.EDITATTR),
                            'value' : self.val()
                        });
                        // D.bottomAttr.editCss(extra.obj, self.data(D.bottomAttr.ATTRIBUTE.EDITATTR), self.val());
                        break;
                    default:
                        var _val = self.val();
                        if(_val) {
                            if(!isNaN(_val)) {
                                _val = D.bottomAttr.addPx(_val);
                            }
                            D.bottomAttr.editCss(extra.obj, extra.key, _val, extra.pseudo);
                            // D.EditContent.editCss({
                            // 'elem' : extra.obj,
                            // 'key' : extra.key,
                            // 'value' : _val
                            // })/;
                        }
                        break;
                }
            }
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

                if($html.attr('id') !== D.bottomAttr.CLASSATTR.content) {
                    D.BoxTools.showHighLight(extra.obj);
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
                var dsModuleId, _module = $html.closest('.crazy-box-module'), dsModuleId = _module.data('dsmoduleid');
                var _cell = $html.closest('.crazy-box-cell'), cellParent = _cell.parent();
                var isMicrolayout = queryMicrolayout($html);
                if(isMicrolayout) {
                    if(bln) {
                        cellParent.attr('data-dsrepeat', '{"dsModuleId":' + dsModuleId + '}');
                    } else {
                        cellParent.removeAttr('data-dsrepeat');
                    }
                }

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
         * 增加此属性表示前端展示offer条数由 数据源决定
         * 移除此属性表示前端展示offer条数由 dsrepeat决定
         * @param {Object} $html
         * @param {Object} bln true false
         */
        var repeatByDs = function($html, bln, obj) {
            _module = $html.closest('.crazy-box-module');
            if(bln) {
                //$html.addClass(REPEATBYDS);
                $html.attr('data-dsrepeat', '{ dsModuleId:' + obj.dsModuleId + '}');
                if($('.ds-box-repeat').attr('checked')) {
                    _module.removeAttr('data-' + REPEATBYDS);
                } else {
                    _module.attr('data-' + REPEATBYDS, true);
                }

            } else {
                //$html.removeClass(REPEATBYDS);
                $html.removeAttr('data-dsrepeat');
                _module.removeAttr('data-' + REPEATBYDS);
            }

        };
    });
})(dcms, FE.dcms);
