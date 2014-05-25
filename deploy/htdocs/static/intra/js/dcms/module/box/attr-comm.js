/**
 * ����չʾ��������
 * @author springyu
 */
;(function($, D) {
    //ʮ��������ɫֵ��RGB��ʽ��ɫֵ֮����໥ת��

    /*RGB��ɫת��Ϊ16����*/
    String.prototype.colorHex = function(arg) {

        //-------------------------------------
        //ʮ��������ɫֵ��������ʽ
        var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
        var that = this;
        var type = /^(rgba\(|RGBA\()/.test(that) ? 'rgba' : 'default';
        type = /^(RGB\(|rgb\()/.test(that) ? 'rgb' : type;
        type = reg.test(that) ? 'hex' : type;
        switch(type) {
            case 'rgba':
                var aColor = that.replace(/(?:\(|\)|rgba|RGBA)*/g, "").split(",");
                var strHex = "";
                for(var i = 0; i < aColor.length - 1; i++) {
                    var hex = Number(aColor[i]).toString(16);
                    if(hex === "0") {
                        hex += hex;
                    }
                    strHex += hex;
                }
                if(arg && arg === true) {
                    strHex = '#' + strHex;
                    if(strHex.length !== 7) {
                        strHex = that;
                    }
                    return strHex;
                }

                return strHex;
                break;
            case 'rgb':
                var aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
                var strHex = "";
                for(var i = 0; i < aColor.length; i++) {
                    var hex = Number(aColor[i]).toString(16);
                    if(hex === "0") {
                        hex += hex;
                    }
                    strHex += hex;
                }
                if(arg && arg === true) {
                    strHex = '#' + strHex;
                    if(strHex.length !== 7) {
                        strHex = that;
                    }
                    return strHex;
                }
                return strHex;
                break;
            case 'hex':
                var aNum = that.replace(/#/, "").split("");
                if(aNum.length === 6) {
                    return that;
                } else if(aNum.length === 3) {
                    var numHex = "#";
                    for(var i = 0; i < aNum.length; i += 1) {
                        numHex += (aNum[i] + aNum[i]);
                    }
                    return numHex;
                }
                break;
            default:
                return that;
                break;
        }

    };
    /**
     * ��ʽ�����ڷ���
     */

    Date.prototype.format = function(format) {
        var o = {
            "M+" : this.getMonth() + 1, //month
            "d+" : this.getDate(), //day
            "h+" : this.getHours(), //hour
            "m+" : this.getMinutes(), //minute
            "s+" : this.getSeconds(), //second
            "q+" : Math.floor((this.getMonth() + 3) / 3), //quarter
            "S" : this.getMilliseconds() //millisecond
        };
        if(/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for(var k in o) {
            if(new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return format;
    };

    D.bottomAttr = {
        insertText : function($target, val) {
            var self = $target[0];
            if(document.selection) {
                self.focus();
                var sel = document.selection.createRange();
                sel.text = val;
                self.focus();
            } else if(self.selectionStart || self.selectionStart === '0') {
                var startPos = self.selectionStart;
                var endPos = self.selectionEnd;
                var scrollTop = self.scrollTop;
                self.value = self.value.substring(0, startPos) + val + self.value.substring(endPos, self.value.length);
                self.focus();
                self.selectionStart = startPos + val.length;
                self.selectionEnd = startPos + val.length;
                self.scrollTop = scrollTop;
            } else {
                self.value += val;
                self.focus();
            }
        },
        /**
         * ����cell�б�
         */
        searchCellList : function($cell) {
            //var arr = arguments[1];
            //arr = arr || [];
            if(!$cell || $cell.length <= 0) {
                return null;
            }
            //if($cell.hasClass(D.bottomAttr.CLASSATTR.cell)) {
            // arr.push($cell);
            //}
            /*if($cell.hasClass(D.bottomAttr.CLASSATTR.module) || $cell.hasClass(D.bottomAttr.CLASSATTR.mcontent)) {
             return arr;
             } else {
             if($cell.data(D.bottomAttr.CONSTANTS['boxOptions']) || $cell.is('a')) {
             $cell.data(D.bottomAttr.CLASSATTR.containerCell, D.bottomAttr.CLASSATTR.containerCell);
             D.bottomAttr.setConfig($cell, 'config');
             }
             //var className = $cell.attr('class');
             //if(className.indexOf(D.bottomAttr.CLASSATTR.cell) !== -1) {
             arr.push($cell);
             //}

             return arguments.callee($cell.parent(), arr);
             }*/
            var cellArr = [];
            if($cell.closest('.' + D.bottomAttr.CLASSATTR.mcontent).length > 0) {
                cellArr = this._getCellParents($cell, '.' + D.bottomAttr.CLASSATTR.mcontent);
                //return cellArr;
            } else if($cell.closest('.' + D.bottomAttr.CLASSATTR.module).length > 0) {
                cellArr = this._getCellParents($cell, '.' + D.bottomAttr.CLASSATTR.module);
            }

            this._addCellConfig($cell);
            cellArr.unshift($cell);
            return cellArr;

        },
        /**
         * @methed _getCellParents ���cellһ����Χ�ڵĸ���Ԫ�أ�add by hongss on 2012.06.08
         * @param $cell cellԪ�ض���jQuery����
         * @param selector ������Ԫ��ѡ����
         */
        _getCellParents : function($cell, selector) {
            var cells = $cell.parentsUntil(selector), len = cells.length, cellArr = [], self = this;

            cells.each(function(i, cell) {
                cell = $(cell);
                self._addCellConfig(cell);
                cellArr.push(cell);
            });
            return cellArr;
        },
        /**
         * @methed _addCellConfig ��cell��ǩ��Ӷ����config��hongss��ȡ 2012.06.08
         */
        _addCellConfig : function(cell) {
            if(cell.data(D.bottomAttr.CONSTANTS['boxOptions']) || cell.is('a')) {
                cell.data(D.bottomAttr.CLASSATTR.containerCell, D.bottomAttr.CLASSATTR.containerCell);
                D.bottomAttr.setConfig(cell, 'config');
            }
        },
        /**
         * ͨ����ǩ����cell
         */
        searchCell : function($arg) {
            if(!$arg || $arg.length <= 0) {
                return null;
            }
            if($arg.hasClass(D.bottomAttr.CLASSATTR.cell)) {
                return $arg;
            } else {
                return arguments.callee($arg.parent());
            }

        },
        /**
         * ���⴦������ҳ�汳��
         */
        handleBackground : function(attrList, $label) {
            var _arrBackground = attrList['background'];
            if(_arrBackground && _arrBackground.length === 1) {
                var _background = _arrBackground[0];
                var className = $label.attr('class');
                // className.indexOf(D.bottomAttr.CLASSATTR.main) !== -1
                if(className.indexOf(D.bottomAttr.CLASSATTR.main) !== -1) {
                    //D.bottomAttr.clearAttr();
                    //D.bottomAttr.hideAttr();
                    D.bottomAttr.resetAttr();
                    var attrTab = $('ul.attr-tab', 'div.dialog');
                    attrTab.hide();
                    $('#attr_content').empty();
                    $('#attr_content').append(_background);
                    $('#attr_content').show();
                    D.bottomAttr.bindAttr();
                    D.bottomAttr.showDialog({
                        name : 'ҳ�汳��',
                        'bgColor' : true
                    });

                    //return;
                }

            }
        },
        /**
         * չʾ�Ի���
         */
        showDialog : function(obj) {
            var oDialog = $('div.dialog');
            //, attr, attrTab;
            if(obj) {
                $('.tip', oDialog).html(obj.name);
                if(obj.bgColor) {
                    $('span.elem-name', oDialog).html('����' + obj.name);
                }
            }//else {
            // attr = self.data('boptions');
            // attrTab = $('ul.attr-tab', '#' + attr);
            //  $('.tip', oDialog).html(self.attr('title'));

            //}
            $.use('ui-dialog', function() {
                oDialog.dialog({
                    modal : true,
                    shim : true,
                    center : true,
                    fadeOut : true
                });
            });
        },
        /**
         * ����Ƿ񲼾�Ԫ��
         */
        checkFrame : function($arg) {
            var className = $arg.attr('class'), contentId = $arg.attr('id');
            if(contentId && contentId === D.bottomAttr.CLASSATTR.content) {
                return {
                    "isFrame" : true,
                    "className" : D.bottomAttr.CLASSATTR.content
                };
            }
            if(!className) {
                return {
                    "isFrame" : false,
                    "className" : null
                };
            }
            if(className.indexOf(D.bottomAttr.CLASSATTR.main) !== -1) {
                return {
                    "isFrame" : true,
                    "className" : D.bottomAttr.CLASSATTR.main
                };
            }

            if(className.indexOf(D.bottomAttr.CLASSATTR.layout) !== -1) {
                return {
                    "isFrame" : true,
                    "className" : D.bottomAttr.CLASSATTR.layout
                };
            }
            if(className.indexOf(D.bottomAttr.CLASSATTR.grid) !== -1) {
                return {
                    "isFrame" : true,
                    "className" : D.bottomAttr.CLASSATTR.grid
                };
            }
            if(className.indexOf(D.bottomAttr.CLASSATTR.row) !== -1) {
                return {
                    "isFrame" : true,
                    "className" : D.bottomAttr.CLASSATTR.row
                };
            }
            if(className.indexOf(D.bottomAttr.CLASSATTR.box) !== -1) {
                return {
                    "isFrame" : true,
                    "className" : D.bottomAttr.CLASSATTR.box
                };
            }
            if(className.indexOf(D.bottomAttr.CLASSATTR.module) !== -1) {
                return {
                    "isFrame" : true,
                    "className" : D.bottomAttr.CLASSATTR.module
                };
            }
            if(className.indexOf(D.bottomAttr.CLASSATTR.cell) !== -1) {
                return {
                    "isFrame" : true,
                    "className" : D.bottomAttr.CLASSATTR.cell
                };
            }
            if(className.indexOf(D.bottomAttr.CLASSATTR.mcontent) !== -1) {
                return {
                    "isFrame" : true,
                    "className" : D.bottomAttr.CLASSATTR.mcontent
                };
            }

            return {
                "isFrame" : false,
                "className" : null
            };
        },
        resizeWindow : function() {
            /**
             * window����
             */
            var winHeight = $(window).height(), winWidth = $(window).width();
            /**
             * Ԥ��һ�еĸ߶ȺͿ��
             */
            var _oNav = $('div.db-operation-nav'), _hNav = _oNav.parent().height(), _w = _oNav.width(), _left = (winWidth - _w) / 2;
            var _oOperationArea = $('#operation_area');
            /**
             * �ײ� top ���Ը߶�
             */
            var _oBottom = $('#page_attribute'), _hBottom = _oBottom.height(), _hTop = $('#pub_header').height();
            var _moduleBar = $('div#dcms_box_modulebar'), _wModuleBar = _moduleBar.width();

            _oOperationArea.css('width', winWidth - _wModuleBar);
            _oOperationArea.css('left', _wModuleBar + 3);

            //_oBottom.css('width', winWidth - _left - _wModuleBar - 8);

            _moduleBar.css('left', _left);
            _moduleBar.css('height', (winHeight - _hNav - _hTop - 4));
            var _hdl = $('dl#moduleCondition').height() || $('div.top-line').height();
            if(!_hdl) {
                _hdl = 0;
            }
            //console.log(_hboxPage);
            $('div.edit-content').css('height', (winHeight - _hNav - _hTop - _hdl - 38));
            //add by hongss on 2012.07.30 for layout
            $('div.edit-layout').css('height', (winHeight - _hNav - _hTop - _hdl - 218));

            $('div.dcms-box-center').css('width', winWidth - _left - _wModuleBar - 5);

            $('iframe.dcms-box-main').css('height', winHeight - _hNav - _hTop - _oOperationArea.height());
        },
        addPx : function(val) {
            if(val) {
                return val.indexOf('px') > -1 ? val : (val + 'px');
            }
            return '1px';
        },
        removeLevel : function() {
            var docIframe = $('iframe#dcms_box_main').contents();
            docIframe.find('.box-level-self').each(function(index, obj) {
                var _self = $(obj);
                _self.removeData('level');
                _self.removeClass('box-level-self');
            });
        },
        setLevel : function($label, level) {
            $label.data('level', level);
            $label.addClass('box-level-self');
        },
        setConfig : function($label, config) {
            $label.data('config', config);
            //$label.addClass('box-config');
        },
        tipCurrent : function() {
            var _width = parseInt($('div.attr-elem-layout li.current').css('width')) / 2;
            var currLi = $('div.attr-elem-layout li.current');
            var len = currLi.offset().left - $('div.attr-elem-layout').offset().left;
            var tipCurrent = $('div.tip-current', 'div.attr-elem-layout');
            tipCurrent.show();
            if(currLi.data('level') && currLi.data('level') === 'self') {
                tipCurrent.css('left', '26px');
            } else {
                tipCurrent.css('left', len + _width);
            }

        },
        /**
         * �Ի����Ƿ�չʾɾ����ť
         *
         */
        showIsDelete : function($target) {
            var cf = D.bottomAttr.checkFrame($target);
            if((cf && cf.isFrame && cf.className === D.bottomAttr.CLASSATTR.cell) || (cf && !cf.isFrame && D.bottomAttr.checkIsDelete($target))) {
                $('.delete-elem').show();
            } else {
                $('.delete-elem').hide();
            }
        },
        /**
         * ��̬��ǩǶ�ײ�tabҳ���¼���
         */
        bindTab : function() {
            $('a', 'div.attr-elem-layout').bind('click', function(e) {
                e.preventDefault();

                var self = $(this), selfParent = self.parent();
                if(!selfParent.hasClass('disabled')) {
                    //������ʾѡ��Ԫ��
                    if(self.data('target')) {
                        var $target = self.data('target');
                        //console.log($target);
                        D.BoxTools.showHighLight($target);
                        //D.bottomAttr.CONSTANTS['frame']
                        var cf = D.bottomAttr.checkFrame($target), attrList;
                        if(cf && cf.isFrame) {
                            attrList = D.attr._execOption(D.bottomAttr.CONSTANTS['frame'], $target);
                        } else {
                            attrList = D.attr._execOption('', $target);
                        }

                        self.data('attrlist', attrList);

                        D.bottomAttr.showIsDelete($target);

                    }

                    D.bottomAttr.clearToolBarCheck();
                    //D.bottomAttr.closeDialog();
                    $('li', 'div.attr-elem-layout').each(function(index, obj) {
                        var _self = $(obj);
                        if(_self.hasClass('current')) {
                            _self.removeClass('current');
                        }
                    });
                    selfParent.addClass('current');
                    D.bottomAttr.tipCurrent();
                    D.bottomAttr.showAttr(self);

                }

            });
            var bln = false;
            $('li', 'div.attr-elem-layout').each(function(index, obj) {
                var _self = $(obj);
                if(!_self.hasClass('disabled') && !bln) {
                    _self.addClass('current');
                    D.bottomAttr.tipCurrent();
                    bln = true;

                }
            });
        },
        /**
         * ����ǩ�Ƿ��ɾ��
         *  true ��ɾ�� false ����ɾ��
         */
        checkIsDelete : function($arg) {
            var _boxOptions = $arg.data(D.bottomAttr.CONSTANTS['boxOptions']);
            if(_boxOptions && _boxOptions.ability) {
                var del = _boxOptions.ability["delete"];
                if(del && del.enable && del.enable === 'true') {
                    return true;
                }
            }
            return false;
        },
        /**
         * ���ɱ�ǩǶ�ײ�tabҳ��
         */
        createElemLayoutTab : function($label, attrList, index) {
            var level = $label.data('level'), link;
            var attrTabLi = $('<li><a href="##"></a></li>');
            link = $('a', attrTabLi), selfParent = link.parent();
            link.data('target', $label);
            if(attrList) {
                link.data('attrlist', attrList);
            } else {
                selfParent.addClass('disabled');
            }

            if(level) {
                if('self' === level) {
                    attrTabLi.data('level', level);
                    link.attr('title', '��ǰ');
                    link.html('��ǰ');
                }
            } else {
                var _span = '<span><</span>';
                link.before(_span);
                link.attr('title', 'Ƕ�ײ�' + index);
                link.html('Ƕ�ײ�' + index);
            }
            return attrTabLi;
        },
        showAttr : function($label) {
            var arr, attrList = $label.data('attrlist');
            var attrText = $('div#attr_text'), attrImage = $('div#attr_image');
            var attrSize = $('div#attr_size'), attrConnect = $('div#attr_connect');
            var attrBackground = $('div#attr_background'), attrBorder = $('div#attr_border');
            var attrMargin = $('div#attr_margin'), attrRepeat = $('div#attr_repeat');
            var attrDsmodel = $('div#attr_dsmodel'), attrDs = $('div#attr_dsModule');
            var attrOther = $('div#attr_other'), bln = false;

            //�������
            D.bottomAttr.clearAttr();
            if(attrList) {
                for(var title in attrList) {
                    arr = attrList[title];
                    if(arr && arr.length > 0) {
                        $('#' + title).css('display', 'block');
                        switch(title) {
                            case D.bottomAttr.ATTR.text:
                                bln = true;
                                D.bottomAttr.createAttrTab(arr, attrText);
                                //attrText.data('boptions', arr);
                                break;
                            case D.bottomAttr.ATTR.image:
                                bln = true;
                                D.bottomAttr.createAttrTab(arr, attrImage);
                                //attrImage.data('boptions', arr);
                                break;
                            case D.bottomAttr.ATTR.size:
                                D.bottomAttr.createAttrTab(arr, attrSize);
                                //attrSize.data('boptions', arr);
                                break;
                            case D.bottomAttr.ATTR.connect:
                                D.bottomAttr.createAttrTab(arr, attrConnect);
                                //attrConnect.data('boptions', arr);
                                break;
                            case D.bottomAttr.ATTR.background:
                                D.bottomAttr.createAttrTab(arr, attrBackground);
                                //attrBackground.data('boptions', arr);
                                break;
                            case D.bottomAttr.ATTR.border:
                                D.bottomAttr.createAttrTab(arr, attrBorder);
                                //attrBorder.data('boptions', arr);
                                break;
                            case D.bottomAttr.ATTR.margin:
                                D.bottomAttr.createAttrTab(arr, attrMargin);
                                //attrMargin.data('boptions', arr);
                                break;
                            case D.bottomAttr.ATTR.repeat:
                                D.bottomAttr.createAttrTab(arr, attrRepeat);
                                //attrRepeat.data('boptions', arr);
                                break;
                            case D.bottomAttr.ATTR.dsmodel:

                                D.bottomAttr.createAttrTab(arr, attrDsmodel);
                                //attrRepeat.data('boptions', arr);
                                break;
                            case 'datasource':
                                D.bottomAttr.createAttrTab(arr, attrDs);
                                //attrOther.data('boptions', arr);
                                break;
                            case D.bottomAttr.ATTR.other:
                                D.bottomAttr.createAttrTab(arr, attrOther);
                                //attrOther.data('boptions', arr);
                                break;
                            default:
                                break;
                        }
                    }
                }

                D.bottomAttr.bindAttr();
                D.bottomAttr.resizeWindow();
                var isBlock = false;
                if(bln) {
                    $('.toolbar-comm').show();
                    $('a.description', '.toolbar-comm').each(function(index, obj) {
                        var _self = $(obj);
                        if(_self.css('display') === 'block' && !isBlock) {
                            isBlock = true;
                            _self.parent().addClass('current');
                            D.bottomAttr.onlyCurrentValid(_self.data('boptions'));
                            $('#' + _self.data('boptions')).show();
                             
                        }
                    });
                } else {

                    $('a.description', '.toolbar-more').each(function(index, obj) {
                        var _self = $(obj);
                        if(_self.css('display') === 'block' && !isBlock) {
                            isBlock = true;
                            _self.parent().addClass('current');
                             D.bottomAttr.onlyCurrentValid(_self.data('boptions'));
                            $('#' + _self.data('boptions')).show();
                           
                        }
                    });
                }

            }

        },
        /**
         * ���� ������ֻ�Ե�ǰ�ؼ���Ч
         */
        onlyCurrentValid : function(_target) {
            var attrType = $('div.attr-type', '#' + _target);
            //console.log(attrType);
            attrType.each(function(index, obj) {
                var _attrType = $(obj);
                var autocratic = _attrType.data('autocratic');
                //console.log(autocratic);
                if(autocratic) {
                    document.getElementById('autocratic').checked = true;
                }
                var attrTab = $('ul.attr-tab', 'div.dialog');

                if(_attrType.data('css')) {
                    attrTab.hide();
                } else {
                    attrTab.show();
                }
                // console.log(attrTab);
            });
        },
        createAttrTab : function(arr, selfParent) {
            if(arr && arr.length > 0) {
                if(!arr.dsmoduleid) {
                    for(var i = 0; i < arr.length; i++) {
                        var _arr = arr[i];
                        var oDiv = $('<div class="attr-content"></div>');
                        if(_arr) {
                            for(var n = 0; n < _arr.length; n++) {
                                oDiv.append(_arr[n]);
                            }
                        }
                        oDiv.prependTo(selfParent);
                    }
                }
            }
        },
        /**
         * ���������ѡ��״̬
         */
        clearToolBarCheck : function() {
            /**
             * ������ѡ�д���
             */
            $('li.toolbar', 'div.toolbar-comm').each(function(index, obj) {
                var _self = $(obj);
                if(_self.hasClass('current')) {
                    _self.removeClass('current');
                }
            });

            $('li.toolbar', 'ul.toolbar-more').each(function(index, obj) {
                var _self = $(obj);
                if(_self.hasClass('current')) {
                    _self.removeClass('current');
                }
            });
            $('#datasource').each(function(index, obj) {
                var _self = $(obj), _selfParent = _self.parent();
                if(_selfParent.hasClass('current')) {
                    _selfParent.removeClass('current');
                }
            });
        },
        /**
         * �رնԻ���
         */
        closeDialog : function() {
            $('a.close-btn', 'div.dialog').closest('div.dialog').dialog('close');
            D.bottomAttr.clearToolBarCheck();
            if (D.DropInPage&&D.DropInPage.hideHighLight){
                 D.DropInPage.hideHighLight();
            }
           
        },
        /**
         * չʾ�Ի���
         */
        //showDialog : function(self, obj) {
        //jQuery.ui.dialog.zIndex = 100;
        // var oDialog = $('div.dialog'), attr, attrTab;
        // if(obj) {
        // $('.tip', oDialog).html(obj.name);
        //} else {
        //     attr = self.data('boptions');
        /// attrTab = $('ul.attr-tab', '#' + attr);
        //$('.tip', oDialog).html(self.attr('title'));

        //}

        //$.use('ui-dialog', function() {
        //oDialog.dialog({
        //modal : false,
        //shim : true,
        //center : true,
        // fadeOut : true
        //});
        //});
        //D.bottomAttr.bindAttr();
        // },
        /**
         * ������Ե�ǰ�ؼ���ЧԪ��
         */
        handleAutocratic : function(configItem, $arg, $html) {
            if(configItem) {
                var self = $arg[0].style, val, _key = '', ss, strKey = configItem.key;
                if(strKey === 'text' || strKey === 'href' || strKey === 'image') {
                    // return;
                }
                ss = strKey.split('-');
                if(ss.length > 1) {
                    _key += ss[0];
                    for(var j = 1; j < ss.length; j++) {
                        _key += ss[j].substring(0, 1).toUpperCase() + ss[j].substring(1);
                    }
                } else {
                    _key += ss[0];
                }
                //console.log(_key);
                val = self[_key];

                if(val) {
                    // console.log($arg);
                    // console.log(val);
                    $html.data('autocratic', 'autocratic');
                    //console.log($html);
                }

            }

        },
        /**
         * ���Կ�������¼���
         */
        bindAttr : function() {
            D.Attribute.init();
            D.bottomAttr.bind.init();
        },
        resetAttr : function() {
            /**
             * �����ǰѡ����ʽ
             */
            D.bottomAttr.clearAttr();
            $('div.attr-elem-layout').empty();
            $('span.elem-name', 'div.favorit-attr').html('');
        },
        /**
         * ������Կ������
         */
        clearAttr : function() {
            $('div.attr', 'div.dialog').each(function(index, obj) {
                var _self = $(obj);
                _self.empty();
                _self.hide();
            });
            // D.bottomAttr.closeDialog();
            D.bottomAttr.hideToolBar();

        },
        /**
         * ������������
         */
        hideAttr : function() {
            document.getElementById('autocratic').checked = false;
            $('div.attr', 'div.dialog').each(function(index, obj) {
                var _self = $(obj);
                _self.hide();
            });
        },
        /**
         * �������й�����
         */
        hideToolBar : function() {
            $('a.description', 'div.attr-toolbar').each(function(index, obj) {
                var _self = $(obj);
                _self.hide();
            });
            $('div.toolbar-comm').hide();
        },
        /**
         * ����class��attr-type��jQuery����
         */
        findDataExtra : function($arg) {
            if($arg.length > 0) {
                if($arg.hasClass('attr-type')) {
                    return $arg;
                } else {
                    if($arg.parent()) {
                        return arguments.callee($arg.parent());
                    } else {
                        return;
                    }

                }
            } else {
                return;
            }
        },
        setDsModuleId : function(dsModuleId) {
            $('div.dsmodule-attr').each(function(index, obj) {
                var self = $(obj), $html;
                var extra = self.data(D.bottomAttr.CONSTANTS['extra']);
                if(extra && extra.obj) {
                    $html = $(extra.obj);
                    //�����һ�α��������
                    $html.removeAttr('data-dsrepeatbyrow');
                    //console.log(999);
                    $('[data-dsrepeat]',$html).each(function(index,_obj){
                        var _self = $(_obj);
                        _self.removeAttr('data-dsrepeat');
                    });
                    if(0 == dsModuleId) {
                        // ���data-dsmoduleid
                        $html.removeAttr('data-dsmoduleid');
                    } else {
                        $html.attr('data-dsmoduleid', dsModuleId);
                    }
                }

            });
        },
        saveDsModule : function(dsModuleId, obj) {
            var name = 'dsModuleId' + dsModuleId;
            D.storage().setItem(name, JSON.stringify(obj));
        },
        getDsModule : function(dsModuleId) {
            return D.storage().getItem('dsModuleId' + dsModuleId);
        },
        removeDsModuleClass : function(dsModuleId) {
            var docIframe = $('iframe#dcms_box_main').contents();
            docIframe.find('div.crazy-box-module').each(function(index, obj) {
                var self = $(obj), _dsModuleId = self.data('dsmoduleid');
                self.removeAttr('data-dsmoduleid');
                self.removeData('dsmoduleid');
                if(dsModuleId == _dsModuleId) {
                    $('.ds-box-module', self).each(function(n, _obj) {
                        var _self = $(_obj);
                        _self.removeClass('ds-box-module');
                        _self.removeData('dsoptions');
                        _self.removeAttr('data-dsoptions');
                        _self.removeAttr('data-dsrepeat');
                        _self.removeAttr('data-dsmoduleid');
                    });
                }

            });
        },
        /**
         * ��ȡ�������HTML���� ����JQUERY����
         */
        getHtml : function(arg) {
            var strHtml = D.storage().getItem(arg), data, retJson;
            var url = D.domain + '/page/box/box_page_attr.html', data = {
                cate : 'attribute'
            };
            if(!strHtml) {//�����ݿ��л�ȡ
                D.storage().load(url, function(retJson) {
                    if(retJson && retJson.status === 'success') {
                        retJson = retJson.data;
                        for(var name in retJson) {
                            D.storage().setItem(name, retJson[name]);
                        }
                    } else {
                        alert(retJson.msg);
                        return;
                    }
                }, data);
                strHtml = D.storage().getItem(arg);
            }
            return $(strHtml);
        },
        /**
         * ����Ԫ����ɫ
         */
        editColorCss : function(extra, val) {
            if(extra.pseudo) {
                // D.EditContent.editCss({
                // 'elem' : extra.obj,
                //'key' : extra.key,
                //'value' : '#' + val,
                // 'pseudo' : extra.pseudo
                // });
                D.bottomAttr.editCss(extra.obj, extra.key, val, extra.pseudo);
            } else {
                D.bottomAttr.editCss(extra.obj, extra.key, val);
                //D.EditContent.editCss({
                // 'elem' : extra.obj,
                //'key' : extra.key,
                // 'value' : '#' + val
                //});
            }
        },
        /**
         * �༭��ʽ ����ͨ�÷���
         */
        editCss : function(obj, key, value, pseudo) {
            var isEditClass = true;
            var autocratic = document.getElementById('autocratic');
            if(autocratic && autocratic.checked) {
                isEditClass = false;
            }
            //console.log('isEditClass==' + isEditClass);
            D.EditContent.editCss({
                'elem' : obj,
                'key' : key,
                'value' : value,
                'pseudo' : pseudo,
                'isEditClass' : isEditClass
            });
            //check show hight element
            D.BoxTools.showHighLight(obj);
        },
        /**
         * ȡɫ����ɫ�ı䴥���¼�
         */
        colorBoxChange : function($arg, val) {
            var selfParent = D.bottomAttr.findDataExtra($arg);
            var extra = selfParent.data(D.bottomAttr.CONSTANTS.extra);

            if(extra) {
                if(extra.type) {
                    if(val === 'ransparent' || val === 'transparent') {
                        val = 'transparent';
                    } else {
                        val = '#' + val;
                    }
                    if(extra.type === D.bottomAttr.ATTRIBUTE.COLOR) {
                        D.bottomAttr.editColorCss(extra, val);
                        return;
                    }
                    if(extra.type === D.bottomAttr.ATTRIBUTE.TEXT) {
                        D.bottomAttr.editCss(extra.obj, 'color', val, extra.pseudo);
                        // D.EditContent.editCss({
                        //  'elem' : extra.obj,
                        //'key' : 'color',
                        // 'value' : '#' + val
                        //});
                        return;
                    }
                    if(extra.type === D.bottomAttr.ATTRIBUTE.BORDER) {
                        D.bottomAttr.editCss(extra.obj, 'border-color', val, extra.pseudo);
                        return;
                    }
                    if(extra.type === D.bottomAttr.ATTRIBUTE.BACKGROUND) {
                        D.bottomAttr.editCss(extra.obj, 'background-color', val, extra.pseudo);
                        return;
                    }
                }

            }

        },
        /**
         * ���ӿ�������
         */
        addBoxOptions : function($arg, type, o) {
            if($arg && $arg.data(D.bottomAttr.CONSTANTS['boxOptions'])) {
                var _boxOptions = $arg.data(D.bottomAttr.CONSTANTS['boxOptions']), cssObj = _boxOptions.css;
                if(type === 'css') {
                    this._addCssBoxOptions($arg, o);
                }
            } else if($arg && !$arg.data(D.bottomAttr.CONSTANTS['boxOptions'])) {
                $arg.data(D.bottomAttr.CONSTANTS['boxOptions'], {
                    "css" : [o]
                });
            }
        },
        _addCssBoxOptions : function($arg, o) {
            var _boxOptions = $arg.data(D.bottomAttr.CONSTANTS['boxOptions']), cssObj = _boxOptions.css, isEx = false;
            if(cssObj) {
                for(var i = 0; i < cssObj.length; i++) {
                    var obj = cssObj[i];
                    if(obj.key === o.key) {
                        isEx = true;
                        break;
                    }
                }
                if(!isEx) {
                    _boxOptions.css.push(o);
                }

            } else {
                _boxOptions['css'] = [o];
            }
            //$arg.data(D.bottomAttr.CONSTANTS['boxOptions'], _boxOptions);
        },
        /**
         * ����ǩ���Ƿ�ֻ�����ı�
         */
        isHasText : function($label) {
            var label = $label[0], first;
            var len = label.childNodes.length;
            if(len === 1) {
                first = label.childNodes[0];
                if(first && first.nodeType === Node.TEXT_NODE) {
                    return true;
                }
            }
            return false;
        },
        /**
         * Ĭ�ϴ����ı���ǩ
         */
        handleText : function($arg) {
            if(D.bottomAttr.isHasText($arg) && !($arg.is('img') || $arg.is('IMG'))) {
                this.addBoxOptions($arg, 'css', {
                    "key" : "text",
                    "type" : D.bottomAttr.ATTRIBUTE.TEXT,
                    "name" : "�ı�"
                });
            }
        },
        /**
         * ����ͼƬ��ǩ
         */
        handleImage : function($arg) {
            if($arg.get(0).tagName === 'img' || $arg.get(0).tagName === 'IMG') {
                this.addBoxOptions($arg, 'css', {
                    "key" : "image",
                    "type" : D.bottomAttr.ATTRIBUTE.IMAGE,
                    "name" : "ͼƬ"
                });
            }
        },

        loadModuleCatalog : function(value, callback) {
            var url = D.domain + '/page/box/query_module_catalog.html', _value;
            if($.type(value) === 'object') {
                _value = $.param(value);
            } else {
                _value = value;
            }
            $.ajax({
                url : url,
                type : "POST",
                data : _value,
                async : false,
                success : function(_data) {
                    var self = this, json;
                    json = $.parseJSON(_data);
                    if(callback && $.isFunction(callback)) {
                        callback.call(self, json);
                    }
                },
                error : function(jqXHR, textStatus, errorThrown) {
                    alert("���ӳ�ʱ�����ԣ�");
                }
            });
        },
        // edit content load cell or module catalog
        loadCellModuleCatalog : function() {
            var url = D.domain + '/page/box/box_module_catalog.html', data = '';
            D.storage().load(url, function(retJson) {
                if(retJson && retJson.status === 'success') {
                    retJson = retJson.data;
                    D.storage().setItem('moduleCatalog', JSON.stringify(retJson));
                } else {
                    alert(retJson.msg);
                    return;
                }
            }, data);
        },
        requestAjax : function(url, value, callback) {
            var _url = D.domain + url, _value;
            if($.type(value) === 'object') {
                _value = $.param(value);
            } else {
                _value = value;
            }
            $.ajax({
                url : _url,
                type : "POST",
                data : _value,
                async : false,
                success : function(_data) {
                    var self = this, json;
                    json = $.parseJSON(_data);
                    if(callback && $.isFunction(callback)) {
                        callback.call(self, json);
                    }
                },
                error : function(jqXHR, textStatus, errorThrown) {
                    alert("���ӳ�ʱ�����ԣ�");
                }
            });
        },
        //��ѯ�ʹ���ID����ͬ��ǩ��module
        queryLikeTagModule : function(_targetModuleObj, currentPage) {
            var moduleId, type, _eleminfo, _moduleTagList = $('#module_tag_list'), _modulePage = $('.module-page', _moduleTagList), _moduleBody = $('.module-body', _moduleTagList);

            if(_targetModuleObj) {
                _eleminfo = _targetModuleObj.data('eleminfo');
                _moduleBody.empty();
                _modulePage.empty();
                if(_eleminfo) {
                    moduleId = _eleminfo.id;
                    type = _eleminfo.type;

                    D.bottomAttr.requestAjax('/page/box/query_box_module.html', {
                        'moduleId' : moduleId,
                        'currentPageSize' : currentPage
                    }, function(_data) {

                        if(_data && _data.data) {
                            var _value = _data.data;
                            if(_value.dataList) {
                                var _dataList = _value.dataList;
                                //console.log(_dataList);
                                for(var i = 0, len = _dataList.length; i < len; i++) {
                                    var _moduleList = $('<div class="module-list"></div>');
                                    _moduleList.attr('data-eleminfo', JSON.stringify(_dataList[i].eleminfo));
                                    _moduleList.append(_dataList[i].content);
                                    _moduleBody.append(_moduleList);
                                    //_moduleBody.append('<div class="module-list" data-eleminfo='+JSON.stringify(_dataList[i].eleminfo)+'>' + _dataList[i].content + '</div>');
                                }
                            }
                            var current = parseInt(_value.currentPage), sumPage = parseInt(_value.pageSize);
                            if(_value && sumPage && sumPage > 1) {
                                var pageHtml = '<div class="dcms-box_clear"><ul>';
                                if(current !== 1) {
                                    pageHtml += '<li><a class="elem" data-val="1">��ҳ</a></li>';
                                    pageHtml += '<li><a class="elem" data-val="' + (current - 1) + '">��һҳ</a></li>';
                                } else {
                                    pageHtml += '<li class="disabled"><a class="elem" data-val="' + current + '">��ҳ</a></li>';
                                    pageHtml += '<li class="disabled"><a class="elem" data-val="' + current + '">��һҳ</a></li>';
                                }
                                if(current !== sumPage) {
                                    pageHtml += '<li><a class="elem" data-val="' + (current + 1) + '">��һҳ</a></li>';
                                    pageHtml += '<li><a class="elem" data-val="' + sumPage + '">βҳ</a></li>';
                                } else {
                                    pageHtml += '<li class="disabled"><a class="elem" data-val="' + current + '">��һҳ</a></li>';
                                    pageHtml += '<li class="disabled"><a class="elem" data-val="' + current + '">βҳ</a></li>';
                                }

                                pageHtml += '<li><a class="desc">��' + _value.currentPage + 'ҳ/��' + _value.pageSize + 'ҳ</a></li>';
                                pageHtml += '</ul></div>';
                                _modulePage.append(pageHtml);
                            }

                        }

                    });
                } else {
                    return -1;
                }
            }
        },
        //�༭���ݲ��ҿؼ� ued�淶�ؼ�ѡ���¼�bind
        bindCellCatalogEvent : function() {
            $('#baseCell').bind('click', function(e) {
                var self = $(this), selfParent = self.parent(), cellTag = $('#cellTag');
                if(selfParent.hasClass('selected')) {
                    selfParent.removeClass('selected');
                    cellTag.val('');
                } else {
                    selfParent.addClass('selected');
                    cellTag.val(self.data('cell'));
                }
            });
            $('a.module-catalog', 'div.cell-catalog').bind('click', function(e) {
                var self = $(this), that = this, selfParent = self.parent(), catalogIds = '', $catalogId = $('#catalogIds');
                var selfOption = self.data('cellcatalog');

                if(selfOption === -1) {
                    $('li.selected', 'div.cell-catalog').each(function(index, obj) {
                        $(obj).removeClass('selected');
                    });
                    selfParent.addClass('selected');
                } else {
                    if(selfParent.hasClass('selected')) {
                        selfParent.removeClass('selected');
                    } else {
                        selfParent.addClass('selected');
                        $('li.selected a.module-catalog', 'div.cell-catalog').each(function(index, obj) {
                            var $self = $(obj), $selfParent = $self.parent();
                            if($self.data('cellcatalog') === -1) {
                                if($selfParent.hasClass('selected')) {
                                    $selfParent.removeClass('selected');
                                }
                            }
                        });
                    }
                }
                $('li.selected a', 'div.cell-catalog').each(function(index, obj) {
                    var _self = $(obj);
                    catalogIds += _self.data('cellcatalog') + ';';
                });
                $catalogId.val(catalogIds);

            });
        },
        //�༭���ݲ���ģ�� ��� ɫϵ ѡ���¼�bind
        bindModuleCatalogColor : function() {
            $('a.module-catalog', 'div.cmodule-catalog').bind('click', function(e) {
                var self = $(this), that = this, selfParent = self.parent(), _selfParent, catalog = $('#catalog'), cval = '';
                if(self.html() === 'ȫ��') {
                    $('li.selected', 'div.cmodule-catalog').each(function(index, obj) {
                        $(obj).removeClass('selected');
                    });
                    selfParent.addClass('selected');
                } else {
                    if(selfParent.hasClass('selected')) {
                        selfParent.removeClass('selected');
                    } else {
                        selfParent.addClass('selected');
                        $('li.selected a.module-catalog', 'div.cmodule-catalog').each(function(index, obj) {
                            var $self = $(obj), $selfParent = $self.parent();
                            if($self.html() === 'ȫ��') {
                                if($selfParent.hasClass('selected')) {
                                    $selfParent.removeClass('selected');
                                }
                            }
                        });
                    }
                }
                $('li.selected a', 'div.cmodule-catalog').each(function(index, obj) {
                    var _self = $(obj);
                    cval += _self.html() + ';';
                });
                catalog.val(cval);

            });
            // ɫϵ
            var pageColor = $('span.page-color', 'div.cmodule-color');
            pageColor.children('span').each(function(index, obj) {
                var _self = $(obj);
                if(_self.hasClass('selected')) {
                    _self.removeClass('selected');
                } else {
                    //self.addClass('selected');
                }

            });
            $('a.module-catalog', 'div.cmodule-color').bind('click', function(e) {
                $(this).addClass('selected');
                $('span.selected', 'span.page-color').each(function(index, obj) {
                    $(obj).removeClass('selected');
                });
            });
            $('span', pageColor).bind('click', function(e) {
                var _self = $(this), moduleColor = $('#moduleColor'), colorVal = '';
                $('a.module-catalog', 'div.cmodule-color').removeClass('selected');
                if(!_self.hasClass('selected')) {
                    _self.addClass('selected');

                }
                $('span.selected', 'span.page-color').each(function(index, obj) {
                    var selfColor = $(obj);
                    colorVal += selfColor.data('color') + ';';
                });
                moduleColor.val(colorVal);
            });
        }
    };
    D.bottomAttr.CSS = {
        fontBold : 'font-weight',
        fontSize : 'font-size',
        backgroundColor : 'background-color',
        color : 'color',
        fontFamily : 'font-family'
    };

    D.bottomAttr.CLASSATTR = {
        "layout" : "crazy-box-layout",
        "grid" : "crazy-box-grid",
        "row" : "crazy-box-row",
        "box" : "crazy-box-box",
        "module" : "crazy-box-module",
        "cell" : "crazy-box-cell",
        "mcontent" : "crazy-box-content",
        "content" : "content",
        "main" : "cell-page-main",
        'containerCell' : 'container-cell'
    };
    D.bottomAttr.ATTR = {
        'text' : 'text',
        'cn_text' : '�༭����',
        'image' : 'image',
        'cn_image' : '�༭ͼƬ',
        'size' : 'size',
        'cn_size' : '�޸ĳߴ�',
        'connect' : 'connect',
        'cn_connect' : '��������',
        'background' : 'background',
        'cn_background' : '���ñ���',
        'border' : 'border',
        'cn_border' : '���ñ߿�',
        'margin' : 'margin',
        'cn_margin' : '���ñ߿�',
        'repeat' : 'repeat',
        'cn_repeat' : '�����ظ�',
        'dsmodel' : 'dsmodel',
        'cn_dsmodel' : '',
        'other' : 'other',
        'cn_other' : '����'
    };
    D.bottomAttr.CONSTANTS = {
        'self' : 'self',
        'parent' : 'parent',
        'frame' : 'frame',
        'other' : 'other',
        'boxOptions' : 'boxoptions',
        'extra' : 'extra',
        'colon' : '��',
        'selected' : 'selected',
        'song' : '����',
        'microsoft' : '΢���ź�'

    };
    D.bottomAttr.ATTRIBUTE = {
        BORDER : 'border',
        INPUT : 'input',
        GINPUT : 'ginput',
        GINPUTS : 'ginputs',
        TEXT : 'text',
        COLOR : 'color',
        IMAGE : 'image',
        BACKGROUND : 'background',
        CHECK : 'check',
        DELETE : 'delete',
        COPY : 'copy',
        EDITATTR : 'editAttr'
    };
    D.bottomAttr.CATALOG = [{
        'name' : '����',
        'code' : ''
    }, {
        'name' : 'ר��ҳ��',
        'code' : 'ר��ҳ��'
    }, {
        'name' : 'ר��ҳ��',
        'code' : 'ר��ҳ��'
    }, {
        'name' : 'Ƶ��ҳ',
        'code' : 'Ƶ��ҳ'
    }];
    D.bottomAttr.INDUSTRY = [{
        'name' : 'ȫ��',
        'code' : ''
    }, {
        'name' : '�ܻ�',
        'code' : '�ܻ�'
    }, {
        'name' : '��֯',
        'code' : '��֯'
    }, {
        'name' : '����',
        'code' : '����'
    }, {
        'name' : 'MRO',
        'code' : 'MRO'
    }, {
        'name' : '��װ',
        'code' : ''
    }, {
        'name' : 'С��Ʒ',
        'code' : 'С��Ʒ'
    }, {
        'name' : '�ٻ�',
        'code' : '�ٻ�'
    }, {
        'name' : '����ҵ�',
        'code' : '����ҵ�'
    }, {
        'name' : '����ĸӤ',
        'code' : '����ĸӤ'
    }, {
        'name' : 'ʳƷũҵ',
        'code' : 'ʳƷũҵ'
    }, {
        'name' : '��װ',
        'code' : '��װ'
    }, {
        'name' : '����',
        'code' : '����'
    }, {
        'name' : '��ҵ��Ʒ',
        'code' : '��ҵ��Ʒ'
    }, {
        'name' : '����',
        'code' : '����'
    }];
    var readyFun = [
    function() {
        /**
         * ��ʼ��ҳ������
         */
        var url = D.domain + '/page/box/box_page_attr.html', data = {
            cate : 'attribute'
        }, currentDate = D.storage().getItem('currentDate'), d = new Date(), dFormat = d.format('yyyy-MM-dd');
        /**
         * ���ش洢�е����ں͵�ǰ���ڲ�ͬ����DB�л�ȡ
         */
        if(dFormat !== currentDate) {
            D.storage().setItem('currentDate', dFormat);

            D.storage().load(url, function(retJson) {
                if(retJson && retJson.status === 'success') {
                    retJson = retJson.data;
                    for(var name in retJson) {
                        D.storage().setItem(name, retJson[name]);
                    }
                } else {
                    alert(retJson.msg);
                    return;
                }
            }, data);
        }
    }];

    $(function() {
        for(var i = 0, l = readyFun.length; i < l; i++) {
            try {
                readyFun[i]();
            } catch(e) {
                if($.log) {
                    $.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
                }
            } finally {
                continue;
            }
        }

    });
})(dcms, FE.dcms);
