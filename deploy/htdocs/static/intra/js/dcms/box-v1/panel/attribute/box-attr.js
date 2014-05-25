/**
 * @author springyu
 * @userfor �ɱ༭���Դ���
 * @date 2012-10-13
 */
;(function($, D) {
    var attrStr = '<div class="attr-elem">';
    attrStr += '<span class="desc e-elem">��ǰ</span>';
    attrStr += '</div>';
    var attrStrDetail = '<div class="toolbar-more">';
    attrStrDetail += '<div class="delete-elem"><a href="#" title="ɾ��" class="elem-desc delete-label">ɾ��</a></div>';
    attrStrDetail += '<div class="toolbar"><a href="#" id="text" data-boptions="attr_text"  class="description" title="�༭����"><span class="nav-img"></span>�༭����</a></div><div id="attr_text" class="attr dcms-box-hide"></div>';
    attrStrDetail += '<div class="toolbar"><a href="#" id="image" data-boptions="attr_image" class="description" title="�༭ͼƬ"><span class="nav-img"></span>�༭ͼƬ</a></div><div id="attr_image" class="attr dcms-box-hide"></div>';
    attrStrDetail += '<div class="toolbar"><a id="size" href="#"  data-boptions="attr_size" class="description" title="�޸ĳߴ�"><span class="nav-img"></span>�޸ĳߴ�</a></div><div id="attr_size" class="attr dcms-box-hide"></div>';
    attrStrDetail += '<div class="toolbar"><a id="connect" href="#"  data-boptions="attr_connect" class="description" title="��������"><span class="nav-img"></span>��������</a></div><div id="attr_connect" class="attr dcms-box-hide"></div>';
    attrStrDetail += '<div class="toolbar"><a id="background" href="#"  data-boptions="attr_background" class="description" title="���ñ���"><span class="nav-img"></span>���ñ���</a></div><div id="attr_background" class="attr dcms-box-hide"></div>';
    attrStrDetail += '<div class="toolbar"><a id="border" href="#" data-boptions="attr_border" class="description" title="���ñ߿�"><span class="nav-img"></span>���ñ߿�</a></div><div id="attr_border" class="attr dcms-box-hide"></div>';
    attrStrDetail += '<div class="toolbar"><a id="margin" href="#" data-boptions="attr_margin" class="description" title="���ñ߾�"><span class="nav-img"></span>���ñ߾�</a></div><div id="attr_margin" class="attr dcms-box-hide"></div>';
    attrStrDetail += '<div class="toolbar"><a id="repeat" href="#" data-boptions="attr_repeat" class="description" title="�����ظ�"><span class="nav-img"></span>�����ظ�</a></div><div id="attr_repeat" class="attr dcms-box-hide"></div>';
    attrStrDetail += '<div class="toolbar"><a id="dsmodel" href="#" data-boptions="attr_dsmodel" class="description" title="��������"><span class="nav-img"></span>��������</a></div><div id="attr_dsmodel" class="attr dcms-box-hide"></div>';
    attrStrDetail += '<div class="toolbar"><a id="other" href="#"  data-boptions="attr_other" class="description" title="����"><span class="nav-img"></span>����</a></div><div id="attr_other" class="attr dcms-box-hide"></div>';

    //attrStrDetail += '<div class="toolbar"><span class="nav-img">^</span><a href="#" id="datasource" data-boptions="attr_dsModule"  class="description" title="��������Դ">��������Դ</a></div><div id="attr_dsModule" class="attr dcms-box-hide"></div>';
    //attrStr += '<div class="toolbar"><span class="nav-img">^</span><a href="#" id="set_page_background" data-boptions="attr_content"  class="description" title="����ҳ�汳��">����ҳ�汳��</a></div><div id="attr_content" class="attr dcms-box-hide"></div>';
    attrStrDetail += '</div>';

    var Attr = D.Class();
    Attr.fn.init = function() {

    };
    Attr.extend({
        /**
         * ��̬��ǩǶ�ײ�ҳ���¼���
         */
        bindEventLevelElem : function() {
            $('#panel_tab').delegate('span.e-elem', 'click', function(e) {
                e.preventDefault();
                var self = $(this), selfParent = self.parent();
                if(selfParent.hasClass('current')) {
                    return;
                }
                if(!selfParent.hasClass('disabled')) {
                
                    //������ʾѡ��Ԫ��
                    if(self.data('target')) {
                        var $target = self.data('target');
                        //console.log($target);
                        //console.log('asdfsaf')
                        try{
                        //D.BoxTools.showHighLight($target);
                        //modify by hongss on 2012.01.08 for cell�¿��ظ���ǩ�������ơ����ơ����ƹ���
                        $(document).trigger('box.editor.label_move_copy', [$target]);
                        } catch(e){
                            //console.log(e);
                        }
                        //D.bottomAttr.CONSTANTS['frame']
                        var cf = D.bottomAttr.checkFrame($target), attrList;
                        if(cf && cf.isFrame) {
                            attrList = D.box.panel.attribute.AttrHandle.execOption(D.bottomAttr.CONSTANTS['frame'], $target);
                        } else {
                            attrList = D.box.panel.attribute.AttrHandle.execOption('', $target);
                        }

                        self.data('attrlist', attrList);

                        //D.bottomAttr.showIsDelete($target);

                    }
                    $('.toolbar-more').remove();
                    D.bottomAttr.clearToolBarCheck();
                    //D.bottomAttr.closeDialog();
                    $('div.attr-elem', 'div.attr-elem-layout').each(function(index, obj) {
                        var _self = $(obj);
                        if(_self.hasClass('current')) {
                            _self.removeClass('current');
                        }
                    });
                    selfParent.addClass('current');
                    // D.bottomAttr.tipCurrent();
                    Attr.handleAttr(self);

                }

            });
            var bln = false;
            $('div.attr-elem', 'div.attr-elem-layout').each(function(index, obj) {
                var _self = $(obj);
                if(!_self.hasClass('disabled') && !bln) {
                    _self.addClass('current');
                    // D.bottomAttr.tipCurrent();
                    bln = true;

                }
            });
            $('#panel_tab').delegate('.description', 'click', function(e) {
                e.preventDefault();
                var self = $(this), _sVal = self.data('boptions'), selfParent = self.parent();
                if(selfParent.hasClass('selected')) {
                    return;
                }
              
                D.bottomAttr.clearToolBarCheck();
                selfParent.addClass('selected');
                // console.log(self);
                D.bottomAttr.hideAttr();
                // console.log(_sVal);
                //console.log($('#' + _sVal));
                $('#' + _sVal).show();

                //end;
                // console.log(_sVal);
                D.bottomAttr.onlyCurrentValid(_sVal);
                if(self.attr('id') === 'datasource') {
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

                }

            });
        },
        /**
         * ������ǩǶ�ײ�tabҳ��
         * @param {Object} $label ��ǰԪ��
         * @param {Object} attrList ��ǰԪ��������Ŀ
         * @param {Object} index ���
         */
        createLevelElem : function($label, attrList, index) {
            var level = $label.data('level'), link;
            var attrTabLi = $(attrStr);

            link = $('span.e-elem', attrTabLi), selfParent = link.parent();
             
            link.data('target', $label);
            if(attrList) {
                link.data('attrlist', attrList);
            } else {
                selfParent.addClass('disabled');
            }

            if(level) {
                if('self' === level) {
                    attrTabLi.data('level', level);
                    attrTabLi.addClass('current');
                    link.attr('title', '��ǰ');
                    link.html('��ǰ');
                }
            } else {
                // var _span = '<span><</span>';
                // link.before(_span);
                link.attr('title', '��' + index);
                link.html('��' + index);
            }
            return attrTabLi;
        },
        /**
         * ������ǩ����������
         * @param {object} $label ��ǰԪ��
         */
        handleAttr : function($label) {
            $label.parent().append(attrStrDetail);
            var arr, attrList = $label.data('attrlist');
            var attrText = $('div#attr_text'), attrImage = $('div#attr_image');
            var attrSize = $('div#attr_size'), attrConnect = $('div#attr_connect');
            var attrBackground = $('div#attr_background'), attrBorder = $('div#attr_border');
            var attrMargin = $('div#attr_margin'), attrRepeat = $('div#attr_repeat');
            var attrDsmodel = $('div#attr_dsmodel'), attrDs = $('div#attr_dsModule');
            var attrOther = $('div#attr_other'), bln = false;
            
            D.bottomAttr.showIsDelete($label.data('target'));
            //** �Ƽ�����ӿڣ�ѡ��Ԫ��ʱ��ѡ��Ԫ�ط��ڴ�����ѯ�¼���
            if ($label.data('target')&&$label.data('target').hasClass('crazy-box-module')){
                $('#nav_module').data('target',$label.data('target'));
            }
            //�Ƽ��ؼ�����
            //if ($label.data('target').hasClass('crazy-box-cell')){
                //$('#nav_module').data('target',$label.data('target'));
           // }
            
            /**
             * �ѿ��������Է���ҳ��ķ���
             * @param {object} arr ���������� ����
             * @param {object} selfParent �����Ԫ��
             */
            var createAttrTab = function(arr, selfParent) {
                //console.log(selfParent);
                if(arr && arr.length > 0) {
                    if(!arr.dsmoduleid) {

                        for(var i = 0; i < arr.length; i++) {
                            var _arr = arr[i];
                            //console.log(_arr);
                            // console.log(i);
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
            };

            //�������
            // D.bottomAttr.clearAttr();
            if(attrList) {
                for(var title in attrList) {
                    arr = attrList[title];
                    //console.log(title);
                    if(arr && arr.length > 0) {

                        var tempObj = $('#' + title);

                        tempObj.css('display', 'block');
                        tempObj.parent().css('display', 'block');
                        switch(title) {
                            case D.bottomAttr.ATTR.text:
                                // bln = true;
                                createAttrTab(arr, attrText);
                                //attrText.data('boptions', arr);
                                break;
                            case D.bottomAttr.ATTR.image:
                                //bln = true;
                                createAttrTab(arr, attrImage);
                                //attrImage.data('boptions', arr);
                                break;
                            case D.bottomAttr.ATTR.size:
                                createAttrTab(arr, attrSize);
                                //attrSize.data('boptions', arr);
                                break;
                            case D.bottomAttr.ATTR.connect:
                                createAttrTab(arr, attrConnect);
                                //attrConnect.data('boptions', arr);
                                break;
                            case D.bottomAttr.ATTR.background:
                                createAttrTab(arr, attrBackground);
                                //attrBackground.data('boptions', arr);
                                break;
                            case D.bottomAttr.ATTR.border:
                                createAttrTab(arr, attrBorder);
                                //attrBorder.data('boptions', arr);
                                break;
                            case D.bottomAttr.ATTR.margin:
                                createAttrTab(arr, attrMargin);
                                //attrMargin.data('boptions', arr);
                                break;
                            case D.bottomAttr.ATTR.repeat:
                                createAttrTab(arr, attrRepeat);
                                //attrRepeat.data('boptions', arr);
                                break;
                            case D.bottomAttr.ATTR.dsmodel:

                                createAttrTab(arr, attrDsmodel);
                                //attrRepeat.data('boptions', arr);
                                break;
                            case 'datasource':
                                // console.log('000asd');
                                // console.log(arr);
                                 //$('#attr_dsModule').empty();
                                createAttrTab(arr, attrDs);
                                //attrOther.data('boptions', arr);
                                break;
                            case D.bottomAttr.ATTR.other:
                                createAttrTab(arr, attrOther);
                                //attrOther.data('boptions', arr);
                                break;
                            default:
                                break;
                        }
                    }
                }

                D.bottomAttr.bindAttr();

                var isBlock = false;
                $('a.description', '.toolbar-more').each(function(index, obj) {
                    var _self = $(obj);
                    if(_self.css('display') === 'block' && !isBlock) {
                        isBlock = true;
                        // console.log(_self);
                        _self.parent().addClass('selected');
                        D.bottomAttr.onlyCurrentValid(_self.data('boptions'));
                        $('#' + _self.data('boptions')).show();

                    }
                });
                //}

            }
        },
        loadPageBackground : function(doc) {
            var classType = [D.bottomAttr.CLASSATTR.main, D.bottomAttr.CLASSATTR.gridsMain],$doc = $(doc);
            //
            $mainStyle = $doc.find('style[data-for=' + classType[0] + ']'),$gridsStyle = $doc.find('style[data-for=' + classType[1] + ']'),
            boxContent ='';
            boxContent = $gridsStyle&&$gridsStyle.length?$doc.find("."+classType[1]):$doc.find('.'+classType[0]);
            D.bottomAttr.addBoxOptions(boxContent, 'css', {
                "key" : "background",
                "type" : "background",
                "name" : "ͼƬ"
            });
			$(document).trigger('box.panel.attribute.attr_handle_event',[boxContent]);
            //D.showAttr(boxContent);
        },
        loadModuleGrids: function(doc){
            D.ToolsPanel.addHtmlModuleGrids();
        }
    });
    D.BoxAttr = Attr;

})(dcms, FE.dcms);
