/**
 * 页面属性展示，需要选中一标签
 * @author springyu
 * @date 2012-10-09
 */

;(function($, D) {
    /**
     * 属性展示方法，传入对象为jQuery对象，可以是layout grid box row cell（module） 标签等
     */
    D.showAttr = function($arg, target) {
        D.attr.show($arg, target);
        return;
    };
    /**
     * module显示接口数据源
     */
    D.showDs = function() {
        var ds = $('#datasource');
        var _sVal = ds.data('boptions'), selfParent = ds.parentsUntil('.toolbar-comm');
        D.bottomAttr.clearToolBarCheck();
        ds.parent().addClass('current');

        D.bottomAttr.hideAttr();

        $('#' + _sVal).show();
        D.bottomAttr.onlyCurrentValid(_sVal);
        var _dsModuleId;

        $('div.dsmodule-attr').each(function(index, obj) {
            var self = $(obj), $html;
            var extra = self.data(D.bottomAttr.CONSTANTS['extra']);
            if(extra && extra.obj) {
                $html = $(extra.obj);
                _dsModuleId = $html.attr('data-dsmoduleid');
            }
        });
        D.bottomAttr.initDsModule(_dsModuleId);
    };
    /**
     * 属性展示工具
     */
    D.attr = {

        show : function($arg, target) {
            if($arg.length <= 0) {
                return;
            }
            var cf, labelList, attrList, index = 0, tabLi;
            var layoutTab = $('div.attr-elem-layout'), layoutUl = $('<ul></ul>');
            var line = $('<div class="line"><s></s></div>');
            //标签嵌套层layout
            layoutTab.empty();
            layoutTab.append(line);
            layoutTab.append(layoutUl);
            layoutTab.append('<div class="tip-current dcms-box-bg dcms-box-hide"></div>');

            /**
             * 设置元素级别
             */
            D.bottomAttr.removeLevel();
            D.bottomAttr.setLevel($arg, 'self');
            //console.log($arg);

            /**
             * 判断是否布局元素 layout grid box row cell(module)
             */
            cf = D.bottomAttr.checkFrame($arg);
            if(cf && cf.isFrame) {
                //console.log('asdasdf');
                // console.log($arg);
                D.bottomAttr.handleImage($arg);
                if($arg.hasClass(D.bottomAttr.CLASSATTR.cell)) {
                    labelList = D.bottomAttr.searchCellList($arg);
                } else {
                    labelList = labelList || [];
                    if($arg.data(D.bottomAttr.CONSTANTS['boxOptions'])) {
                        D.bottomAttr.setConfig($arg, 'config');
                    }
                    labelList.push($arg);
                }
                if(labelList) {
                    for(var i = 0; i < labelList.length; i++) {
                        var _self = $(labelList[i]);
                        //console.log(_self);
                        if(_self.data('level') !== 'self') {
                            index++;
                        }
                        attrList = null;
                        if(_self.data('config')) {
                            attrList = this._execOption(D.bottomAttr.CONSTANTS['frame'], _self);
                            var className = _self.attr('class');
                            if(className.indexOf(D.bottomAttr.CLASSATTR.main) !== -1) {
                                D.bottomAttr.handleBackground(attrList, _self);
                                return;
                            }
                            tabLi = D.bottomAttr.createElemLayoutTab(_self, attrList, index);
                        } else {
                            tabLi = D.bottomAttr.createElemLayoutTab(_self, attrList, index);
                        }

                        layoutUl.append(tabLi);
                        //this._attrOptions(attrList, attr, _self);
                    }
                }

            } else {
                /**
                 * 当前元素所有父节点
                 */
                labelList = this._searchBoxOption($arg);

                if(labelList) {
                    for(var i = 0; i < labelList.length; i++) {
                        var _self = $(labelList[i]);
                        if(_self.data('level') !== 'self') {
                            index++;
                        }
                        // console.log(_self);
                        attrList = null;
                        if(_self.data('config')) {
                            //每个标签的可配置项
                            attrList = this._execOption('', _self);
                            tabLi = D.bottomAttr.createElemLayoutTab(_self, attrList, index);
                        } else {
                            tabLi = D.bottomAttr.createElemLayoutTab(_self, attrList, index);
                        }

                        layoutUl.append(tabLi);
                        // this._attrOptions(attrList, attr, _self);
                    }

                }
            }
            //标签嵌套层tab页面事件绑定
            D.bottomAttr.bindTab();
            var curr = $('a', 'div.attr-elem-layout li.current');
            //D.bottomAttr.tipCurrent();
            //展示组件名称
            this._showCellAttr($arg);
            //如果元素没有可配置项，给出提示
            this._checkIsConfig(curr);
            //end
            D.bottomAttr.showAttr(curr);
            //对象框title
            var _obj = {};
            if($arg.hasClass(D.bottomAttr.CLASSATTR.layout) || $arg.hasClass(D.bottomAttr.CLASSATTR.grid) || $arg.hasClass(D.bottomAttr.CLASSATTR.row) || $arg.hasClass(D.bottomAttr.CLASSATTR.box)) {
                _obj.name = "布局属性";
            } else if($arg.hasClass(D.bottomAttr.CLASSATTR.module)) {
                _obj.name = "组属性";
            } else if($arg.hasClass(D.bottomAttr.CLASSATTR.cell)) {
                _obj.name = "控件属性";
            } else {
                _obj.name = "标签属性";
            }
            //end
            //cell，标签删除操作
            D.bottomAttr.showIsDelete($arg);
            //end
            D.bottomAttr.showDialog(_obj);

        },
        /**
         * 检查标签是否有可配置项
         */
        _checkIsConfig : function(curr) {
            var _oAttr = $('.attr-config', '#page_attribute');
            if(curr && curr.length == 0) {
                if($('#attr-config-tip').length === 0) {
                    _oAttr.append('<div id="attr-config-tip" style="margin:0 auto;height:100px;">亲，你选择的元素没有配置项，请重新选择！</div>');
                }
            } else {
                $('#attr-config-tip').remove();
            }
        },

        /**
         * 展示layout grid row box module cell属性
         */
        _showCellAttr : function($arg) {

            var $label, cf, elemInfo, name, isFavorit = true, isShow = false;
            cf = D.bottomAttr.checkFrame($arg);
            if(cf && cf.isFrame) {
                $label = $arg;
            } else {
                $label = D.bottomAttr.searchCell($arg);
            }
            if($label) {
                elemInfo = $label.data('eleminfo');
                if(elemInfo) {
                    name = elemInfo.name;
                }
            }

            if(name) {
                $('span.elem-name', 'div.favorit-attr').html(name);
                isShow = true;
            }
            if(isFavorit) {
                $('a.btn', 'div.favorit-attr').hide();
                $('a.btn-disable', 'div.favorit-attr').show();
            } else {
                $('a.btn', 'div.favorit-attr').show();
                $('a.btn-disable', 'div.favorit-attr').hide();
            }
            if(isShow) {
                $('div.favorit-attr').show();
            }
        },
        /**
         * 1.查找标签父节点，并返回所有父节点[]
         * return [];
         * 2.给可配置标签，打上标记
         *
         * 3.必须保存标签是module或cell标签内的子标签
         */
        _searchBoxOption : function($label) {
            var arr = arguments[1], selfParent;
            arr = arr || [];
            /**
             * 处理图片
             */
            D.bottomAttr.handleImage($label);
            /**
             * 默认文本自动可以配置
             */
            D.bottomAttr.handleText($label);

            //console.log($label.data(D.bottomAttr.CONSTANTS['boxOptions']));
            //&& !$label.is('a')
            if($label.data(D.bottomAttr.CONSTANTS['boxOptions']) || $label.is('a')) {
                //$label.data('config', 'config');
                //console.log($label);
                D.bottomAttr.setConfig($label, 'config');
            }
            arr.push($label);
            //父节标签class为cell 返回
            selfParent = $label.parent();

            //if((selfParent.hasClass(classAttr.module)) || ($label.hasClass(classAttr.cell) && !(selfParent.hasClass(classAttr.module)))) {
            if(selfParent.hasClass(D.bottomAttr.CLASSATTR.cell)) {
                return arr;
            } else {
                if(selfParent.length > 0 && !D.bottomAttr.checkFrame(selfParent).isFrame) {
                    return arguments.callee(selfParent, arr);
                }
            }
            //父节点不存在或父节点为布局元素 退出
            return null;
        },
        /**
         * 解释boxoption
         */
        _execOption : function(execType, $arg) {
            var boxOption = $arg.data(D.bottomAttr.CONSTANTS['boxOptions']), $html, dsModuleId;
            var ability, repeat, del, container, editAttr, cssObj, localStorage, attrAreaDs = [];
            var attrAreaText = [], attrAreaImage = [], attrAreaSize = [], attrAreaConnect = [], attrAreaBackground = [];
            var attrAreaBorder = [], attrAreaMargin = [], attrAreaRepeat = [], attrAreaDsmodel = [], attrAreaOther = [];
            var that = this;
            //console.log($arg);
            //console.log($arg.data('boxoptions'));
            if(boxOption) {
                /**
                 * css
                 */
                cssObj = boxOption.css;
                //console.log(cssObj);
                if(cssObj) {
                    for(var i = 0; i < cssObj.length; i++) {
                        var val, self = cssObj[i], isDisable;
                        if(self.type === D.bottomAttr.ATTRIBUTE.GINPUTS) {
                            self.type = D.bottomAttr.ATTRIBUTE.GINPUT;
                        }
                        $html = D.bottomAttr.getHtml(self.type);
                        $('.labelText', $html).html(self.name + D.bottomAttr.CONSTANTS.colon);
                        val = self.val;
                        $html.data(D.bottomAttr.CONSTANTS['extra'], {
                            "obj" : $arg,
                            "key" : self.key,
                            "type" : self.type,
                            "pseudo" : self.pseudo
                        });
                        D.bottomAttr.handleAutocratic(self, $arg, $html);
                        //handle boxoptions
                        switch(self.type) {
                            case D.bottomAttr.ATTRIBUTE.COLOR:
                                val = $arg.css(self.key).colorHex();
                                var bVal;
                                if(val === 'ransparent' || val === 'transparent') {
                                    bVal = 'transparent';
                                } else {
                                    bVal = '#' + val;
                                }
                                $('span.color-preview', $html).css('background-color', bVal);
                                $('input.color-box', $html).val(val);
                                //console.log(self.key);
                                if(self.key === 'background-color') {
                                    attrAreaBackground.push($html);
                                } else if(self.key === 'border-color') {
                                    attrAreaBorder.push($html);
                                } else {
                                    attrAreaConnect.push($html);
                                }

                                break;
                            case D.bottomAttr.ATTRIBUTE.BACKGROUND:
                                this._background($arg, $html);
                                attrAreaBackground.push($html);
                                break;
                            case D.bottomAttr.ATTRIBUTE.BORDER:
                                this._border($arg, $html);
                                attrAreaBorder.push($html);
                                break;
                            case D.bottomAttr.ATTRIBUTE.GINPUT:
                                this._ginput(self, $arg, $html);
                                attrAreaMargin.push($html);
                                break;
                            case D.bottomAttr.ATTRIBUTE.GINPUTS:
                                this._ginput(self, $arg, $html);
                                attrAreaMargin.push($html);
                                break;
                            case 'select':
                                this._select(self, $arg, $html);
                                attrAreaOther.push($html);
                                break;
                            case D.bottomAttr.ATTRIBUTE.INPUT:
                                this._input(self, $arg, $html);
                                var reg = /^(margin|padding|MARGIN|PADDING)/;

                                if(reg.test(self.key)) {
                                    attrAreaMargin.push($html);
                                } else {
                                    attrAreaSize.push($html);
                                }
                                break;
                            case D.bottomAttr.ATTRIBUTE.IMAGE:
                                dsModuleId = this._getDs($arg);
                                if(dsModuleId&&dsModuleId !== -1) {
                                    var $htmlDS = D.bottomAttr.getHtml('dsimage');
                                    $htmlDS.data(D.bottomAttr.CONSTANTS['extra'], {
                                        'obj' : $arg
                                    });
                                    var _select = $('select', $htmlDS);
                                    _select.each(function(index, obj) {
                                        var _self = $(obj);
                                        _self.data('dsmoduleid', dsModuleId);
                                        that._initSelector(_self, dsModuleId, that._getDsoptions($arg, _self.attr('name')));
                                    });

                                    $htmlDS.data('css', 'no');
                                    attrAreaDsmodel.push($htmlDS);
                                }
                                this._image($arg, $html);
                                attrAreaImage.push($html);

                                break;
                            case D.bottomAttr.ATTRIBUTE.TEXT:
                                dsModuleId = this._getDs($arg);
                                if(dsModuleId&&dsModuleId !== -1) {
                                    var $htmlDS = D.bottomAttr.getHtml('dstext');
                                    $htmlDS.data(D.bottomAttr.CONSTANTS['extra'], {
                                        'obj' : $arg
                                    });
                                    var _select = $('select', $htmlDS);
                                    _select.data('dsmoduleid', dsModuleId);
                                    var showValue = that._getDsoptions($arg, 'text');
                                    that._initSelector(_select, dsModuleId, showValue);
                                    //初始化select
                                    var _input = $('input', $htmlDS);
                                    var length = that._getDsoptions($arg, 'length')
                                    if(_input && length) {
                                        _input.attr('value', length);
                                        //初始化input  值
                                    }
                                    $htmlDS.data('css', 'no');
                                    attrAreaDsmodel.push($htmlDS);
                                }
                                this._text($arg, $html);
                                attrAreaText.push($html);
                                break;
                            default:

                                break;

                        }

                        //console.log($html.data(D.bottomAttr.CONSTANTS['extra']));
                        /**if(self.type === D.bottomAttr.ATTRIBUTE.TEXT) {
                         attrAreaContent['_text'] = $html;
                         } else if(self.type === D.bottomAttr.ATTRIBUTE.IMAGE) {
                         attrAreaContent['_image'] = $html;
                         } else {
                         attrAreaStyle.push($html);
                         }**/

                    }
                    //end each
                }
                /**
                 * 高级功能
                 */
                ability = boxOption.ability;

                if(ability) {
                    //console.log(ability);
                    var conCell = $arg.data(D.bottomAttr.CLASSATTR.containerCell);

                    if(conCell === D.bottomAttr.CLASSATTR.containerCell || D.bottomAttr.CONSTANTS['frame'] !== execType) {
                        repeat = ability.copy;

                        if(repeat && repeat.enable && repeat.enable === 'true') {
                            $html = D.bottomAttr.getHtml(D.bottomAttr.ATTRIBUTE.INPUT);
                            /**
                             * 不需要专用css选项
                             */
                            $html.data('css', 'no');
                            //for(var attr in repeat) {
                            $('.labelText', $html).html('设置重复' + D.bottomAttr.CONSTANTS.colon);
                            $('input', $html).val('');
                            $('span.repeat-tip', $html).append('<a>OK</a>');
                            dsModuleId = this._getDs($arg);
                            $html.attr('data-dsmoduleid', dsModuleId);
                            if(dsModuleId !== -1) {
                                $html.append('数据源重复<input type="checkbox" class="ds-box-repeat">');
                            }
                            //}
                            $html.data(D.bottomAttr.CONSTANTS['extra'], {
                                "obj" : $arg,
                                "key" : "copy",
                                "type" : D.bottomAttr.ATTRIBUTE.INPUT,
                                "relative" : repeat.relative
                            });
                            attrAreaRepeat.push($html);
                        }
                    }

                    //container = ablity.container;
                    editAttr = ability.editAttr;
                    if(editAttr) {
                        //$html = D.bottomAttr.getHtml(D.bottomAttr.ATTRIBUTE.INPUT);
                        //$html.data(D.bottomAttr.CONSTANTS['extra'], {
                        //	"obj" : $arg,
                        //	"key" : D.bottomAttr.ATTRIBUTE.EDITATTR,
                        //	"type" : D.bottomAttr.ATTRIBUTE.INPUT
                        //});
                        //$html.data('css', 'no');
                        for(var p = 0; p < editAttr.length; p++) {
                            var val, eAttr = editAttr[p], isDisable;
                            if(!eAttr.type) {
                                eAttr.type = D.bottomAttr.ATTRIBUTE.INPUT;
                            }
                            $html = D.bottomAttr.getHtml(eAttr.type);
                            $('.labelText', $html).html(eAttr.name + D.bottomAttr.CONSTANTS.colon);
                            val = eAttr.val;
                            $html.data(D.bottomAttr.CONSTANTS['extra'], {
                                "obj" : $arg,
                                "key" : D.bottomAttr.ATTRIBUTE.EDITATTR,
                                "type" : eAttr.type,
                                "pseudo" : eAttr.pseudo
                            });
                            //D.bottomAttr.handleAutocratic(eAttr, $arg, $html);
                            if(eAttr.type && eAttr.type == "select") {
                                this._select(eAttr, $arg, $html);
                                attrAreaOther.push($html);
                            } else {
                                $('.labelText', $html).html(eAttr.name + D.bottomAttr.CONSTANTS.colon);
                                $('input', $html).data(D.bottomAttr.ATTRIBUTE.EDITATTR, eAttr.key);
                                $('input', $html).addClass('edit-attr');
                                $('input', $html).val($arg.attr(eAttr.key));
                                attrAreaOther.push($html);
                            }
                        }
                    }
                    del = ability["delete"];
                    if(del && del.enable && del.enable === 'true') {
                        //if(attrAreaStyle && attrAreaStyle.length === 0) {
                        $html = D.bottomAttr.getHtml(D.bottomAttr.ATTRIBUTE.CHECK);
                        $html.data('css', 'no');
                        $html.data(D.bottomAttr.CONSTANTS['extra'], {
                            "obj" : $arg,
                            "key" : "delete",
                            "type" : D.bottomAttr.ATTRIBUTE.CHECK,
                            "relative" : del.relative
                        });
                        attrAreaOther.push($html);
                    }
                }
            }
            this._moduleHandle($arg, attrAreaDs);
            // /处理A标签或需要添加A
            this._linkHandle($arg, attrAreaConnect);
            this._dslink($arg, attrAreaDsmodel);

            return {
                'text' : attrAreaText,
                'image' : attrAreaImage,
                'size' : attrAreaSize,
                'connect' : attrAreaConnect,
                'background' : attrAreaBackground,
                'border' : attrAreaBorder,
                'margin' : attrAreaMargin,
                'repeat' : attrAreaRepeat,
                'dsmodel' : attrAreaDsmodel,
                'datasource' : attrAreaDs,
                'other' : attrAreaOther
            };
        },
        _moduleHandle : function($arg, attrAreaDs) {
            if($arg.hasClass(D.bottomAttr.CLASSATTR.module)) {
                //
                var $html = D.bottomAttr.getHtml('dsModule');
                $html.data('css', 'no');
                var dsmoduleid = $arg.data('dsmoduleid');
                //console.log(dsmoduleid);
                var _ds = $('#datasource');
                if(dsmoduleid) {
                    _ds.data('dsmoduleid', dsmoduleid);
                } else {
                    _ds.removeData('dsmoduleid');
                }
                $html.data(D.bottomAttr.CONSTANTS['extra'], {
                    'dsmoduleid' : dsmoduleid,
                    'obj' : $arg
                });
                attrAreaDs.push($html);

            }
        },
        /**
         * 动态绑定超链
         */
        _dslink : function($arg, attrAreaDsmodel) {
            var that = this;
            if($arg.is('a')) {
                dsModuleId = this._getDs($arg);
                if(dsModuleId&&dsModuleId !== -1) {
                    var $html = D.bottomAttr.getHtml('dslink');
                    $html.data('css', 'no');
                    $html.data(D.bottomAttr.CONSTANTS['extra'], {
                        'obj' : $arg
                    });
                    var _select = $('select', $html);
                    _select.each(function(index, obj) {
                        var _self = $(obj);
                        _self.data('dsmoduleid', dsModuleId);
                        that._initSelector(_self, dsModuleId, that._getDsoptions($arg, _self.attr('name')));
                    });

                    $html.data('css', 'no');
                    attrAreaDsmodel.push($html);
                }

            }
        },
        //get tagName data model
        _getDsoptions : function($arg, type) {
            var dsoptions = $arg.data('dsoptions'), json;
            if(dsoptions) {
                switch(type) {
                    case 'length':
                        if(dsoptions.text) {
                            json = dsoptions.text.length;
                        }
                        break;
                    case 'text':
                        if(dsoptions.text) {
                            json = dsoptions.text.field;
                        }
                        break;
                    case 'img-url':
                        if(dsoptions.src) {
                            json = dsoptions.src.field;
                        }
                        break;
                    case 'img-alt':
                        if(dsoptions.alt) {
                            json = dsoptions.alt.field
                        }
                        break;
                    case 'link-href':
                        if(dsoptions.href) {
                            json = dsoptions.href.field;
                        }
                        break;
                    case 'link-title':
                        if(dsoptions.title) {
                            json = dsoptions.title.field
                        }
                        break;
                    default:
                        break;
                }

            }
            //console.log(json);
            return json;
        },
        /**
         * 处理A标签或需要添加A
         */
        _linkHandle : function($arg, attrAreaConnect) {
            var $html = D.bottomAttr.getHtml('connect');
            /**
             * 标签属性
             */
            if($arg.is('a')) {
                var _linkHref = $('#link-href', $html);
                var _linkTitle = $('#link-title', $html);

                _linkHref.val($arg.attr('href'));
                _linkHref.removeClass('readonly');
                _linkHref.removeAttr('readonly');
                _linkTitle.val($arg.attr('title'));
                _linkTitle.removeClass('readonly');
                _linkTitle.removeAttr('readonly');
                $('input[name=attr-link]', $html).attr('checked', true);

                $html.data(D.bottomAttr.CONSTANTS['extra'], {
                    "obj" : $arg,
                    "key" : "href",
                    "type" : 'connect'
                });
                attrAreaConnect.push($html);
            }
            if(($arg.get(0).tagName === 'img' || $arg.get(0).tagName === 'IMG') && !$arg.parent().is('a')) {
                $html.data(D.bottomAttr.CONSTANTS['extra'], {
                    "obj" : $arg,
                    "key" : "href",
                    "type" : 'connect'
                });
                attrAreaConnect.push($html);
            }
            if(D.bottomAttr.isHasText($arg) && !$arg.parent().is('a') && !($arg.is('img') || $arg.is('IMG') || $arg.is('a'))) {
                $html.data(D.bottomAttr.CONSTANTS['extra'], {
                    "obj" : $arg,
                    "key" : "href",
                    "type" : 'connect'
                });
                attrAreaConnect.push($html);
            }
        },
        _image : function($arg, $html) {
            $('input[name=alt]', $html).val($arg.attr('alt'));
            $('div.uploads', $html).data('url', $arg.attr('src'));
        },
        _text : function($arg, $html) {
            var _color = $arg.css(D.bottomAttr.CSS.color).colorHex();
            var bVal;
            if(_color === 'ransparent' || _color === 'transparent') {
                bVal = 'transparent';
            } else {
                bVal = '#' + _color;
            }
            $('span.color-preview', $html).css(D.bottomAttr.CSS.backgroundColor, bVal);
            $('input.color-box', $html).val(_color);
            $('select.font-size', $html).val($arg.css(D.bottomAttr.CSS.fontSize));
            var ff = $arg.css(D.bottomAttr.CSS.fontFamily);
            if(ff.indexOf(D.bottomAttr.CONSTANTS.song) !== -1) {
                $('select.font-family', $html).val(D.bottomAttr.CONSTANTS.song);
            }
            if(ff.indexOf(D.bottomAttr.CONSTANTS.microsoft) !== -1) {
                $('select.font-family', $html).val(D.bottomAttr.CONSTANTS.microsoft);
            }
            var fontBold = $arg.css(D.bottomAttr.CSS.fontBold);
            if(fontBold === 'bold') {
                $('span.font-bold', $html).data(D.bottomAttr.CONSTANTS.selected, D.bottomAttr.CONSTANTS.selected);
            }
            $('#box-bottom-text', $html).val($.trim($arg.html()));
        },
        _select : function(self, $arg, $html) {
            var _val = self.val, title, _options = '<option value="-1" selected>请选择</option>';
            var _select = $('select[name=attr-select]', $html);
            _select.empty();
            if(_val) {
                for(title in _val) {
                    _options += '<option value=' + title + '>' + _val[title] + '</option>'
                }
            }
            _select.append(_options);
        },
        _input : function(self, $arg, $html) {
            var isDisable = self.disable;
            if(isDisable && isDisable === 'true') {
                $('input[type=text]', $html).attr('disabled', true);
            }
            var _val = parseInt($arg.css(self.key));
            if(!isNaN(_val)) {
                $('input[type=text]', $html).val(_val);
            }

        },
        _ginput : function(self, $arg, $html) {
            var _top = '0px', _right = '0px', _bottom = '0px', _left = '0px';
            if(self.key === 'padding') {
                _top = $arg.css('padding-top');
                _right = $arg.css('padding-right');
                _bottom = $arg.css('padding-bottom');
                _left = $arg.css('padding-left');
            }
            if(self.key === 'margin') {
                _top = $arg.css('margin-top');
                _right = $arg.css('margin-right');
                _bottom = $arg.css('margin-bottom');
                _left = $arg.css('margin-left');
            }
            $('input[name=attr-margin-top]', $html).val(parseInt(_top));
            $('input[name=attr-margin-right]', $html).val(parseInt(_right));
            $('input[name=attr-margin-bottom]', $html).val(parseInt(_bottom));
            $('input[name=attr-margin-left]', $html).val(parseInt(_left));
        },
        /**
         * 设置默认border
         */
        _border : function($arg, $html) {
            var val = D.rgbTo16($arg.css('border-top-color') || $arg.css('border-bottom-color') || $arg.css('border-left-color') || $arg.css('border-right-color'));
            var bVal;
            if(val === 'ransparent' || val === 'transparent') {
                bVal = 'transparent';
            } else {
                bVal = '#' + val;
            }
            $('span.color-preview', $html).css(D.bottomAttr.CSS.backgroundColor, bVal);
            $('input.color-box', $html).val(val);
            var topWidth = parseInt($arg.css('border-top-width'));
            var rightWidth = parseInt($arg.css('border-right-width'));
            var bottomWidth = parseInt($arg.css('border-bottom-width'));
            var leftWidth = parseInt($arg.css('border-left-width'));

            var borderRadius = parseFloat($arg.css('border-top-left-radius'));
            //有圆角，都选中并disabled
            if(borderRadius > 0) {
                $('input[name=border-radius]', $html).val(borderRadius);
                $('li input[type=checkbox]', $html).each(function(index, val) {
                    val.checked = true;
                    val.disabled = true;
                });
            } else {
                if(topWidth > 0) {
                    $('input[name=border-top]', $html).attr('checked', true);
                }
                if(rightWidth > 0) {
                    $('input[name=border-right]', $html).attr('checked', true);
                }
                if(bottomWidth > 0) {
                    $('input[name=border-bottom]', $html).attr('checked', true);
                }
                if(leftWidth > 0) {
                    $('input[name=border-left]', $html).attr('checked', true);
                }
            }

        },
        /**
         * 设置默认背景
         */
        _background : function($arg, $html) {
            var val = $arg.css(D.bottomAttr.CSS.backgroundColor), bgVal;
            val = val.colorHex();
            var _url = $arg.css('background-image');
            _url = _url.replace(/(?:\(|\)|url|URL)*/g, "");
            if(val === 'ransparent' || val === 'transparent') {
                bgVal = 'transparent';
            } else {
                bgVal = '#' + val;
            }
            $('span.color-preview', $html).css(D.bottomAttr.CSS.backgroundColor, bgVal);
            $('input.color-box', $html).val(val);
            $('div.uploads', $html).data('url', _url);
            $('div.uploads', $html).data('adboardid', $arg.attr('data-adboardid'));
            var repeat = $arg.css('background-repeat');
            if(repeat === 'no-repeat') {
                $('input[name=no-repeat]', $html).attr('checked', true);
                $('input[name=repeat-x]', $html).attr('checked', false);
                $('input[name=repeat-y]', $html).attr('checked', false);
            }
            if(repeat === 'repeat') {
                $('input[name=no-repeat]', $html).attr('checked', false);
                $('input[name=repeat-x]', $html).attr('checked', true);
                $('input[name=repeat-y]', $html).attr('checked', true);
            }
            if(repeat === 'repeat-x') {
                $('input[name=no-repeat]', $html).attr('checked', false);
                $('input[name=repeat-x]', $html).attr('checked', true);
                $('input[name=repeat-y]', $html).attr('checked', false);
            }
            if(repeat === 'repeat-y') {
                $('input[name=no-repeat]', $html).attr('checked', false);
                $('input[name=repeat-x]', $html).attr('checked', false);
                $('input[name=repeat-y]', $html).attr('checked', true);
            }
            //background position
            var position = $arg.css('background-position');
            if(position) {
                $('a.box-img', $html).each(function(index, obj) {
                    var _self = $(obj), _position = _self.data('position');
                    if(position === _position) {
                        _self.parent().addClass('current');
                        return;
                    }
                });
            }

        },

        /**
         *判断标签所在module是否绑定数据源,有绑定的话，返回数据源ID，无返回-1
         */
        _getDs : function($arg) {
            var dsModuleId = -1;
            if($arg.length <= 0) {
                return;
            }
            if($arg.hasClass(D.bottomAttr.CLASSATTR.module)) {
                if($arg.data('dsmoduleid')) {
                    return $arg.data('dsmoduleid');
                } else {
                    return dsModuleId;
                }

            } else {
                return arguments.callee($arg.parent());
            }
        },
        _initSelector : function(element, dsid, showValue) {
            var $jsonDs = this._getDsByDsid(dsid);
            var selected;
            if(showValue) {
                selected = showValue
            }
            if($jsonDs) {
                for(var i = 0; i < $jsonDs.length; i++) {
                    var item = new Option($jsonDs[i].cn_name, $jsonDs[i].name);
                    if($jsonDs[i].name === selected) {
                        item.selected = true;
                    }
                    element.append(item);
                }
            }
        },
        _getDsByDsid : function(dsid) {
            var dssJson = D.storage().getItem('dssJson');
            var $dj = JSON.parse(dssJson).moduleSchemaMapList;
            for(var i = 0; i < $dj.length; i++) {
                if($dj[i].key === dsid) {
                    return $dj[i].value;
                }
            }
        }
    };

})(dcms, FE.dcms);
