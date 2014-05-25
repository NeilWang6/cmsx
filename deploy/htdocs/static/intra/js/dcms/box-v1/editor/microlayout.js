/**
 * @author pingchun.yupc
 * @userfor ΢������ز���
 * @date  2012.09.7
 */

;(function($, D, undefined) {
    var Microlayout = (function() {
        function Microlayout(target) {
        	if (!(this instanceof Microlayout)){
        		return new Microlayout(target);
        	}
            this.dropInPage = target;
            this.table = new D.Table(target.table);
            this.fixCellHighLightEl = target.fixCellHighLightEl;
            this.elements = {
                'microHightlight' : $('#crazy-box-micro-highlight', target.iframeBody),
                'microRow' : $('#micro_row', '#panel_tab'),
                'microCol' : $('#micro_col', '#panel_tab'),
                'mergeDown' : $('.merge-down-bin', '#panel_tab'),
                'mergeRight' : $('.merge-right-bin', '#panel_tab'),
                'mergeCancel' : $('.merge-cancel-bin', '#panel_tab'),
                'borderTransparent' : $('#border_transparent', '#panel_tab'),
                'tdWidth' : $('#microWidth', '#panel_tab'),
                'tableWidth' : $('#tableWidth', '#panel_tab'),
                'microFinish' : $('#micro_finish', '#panel_tab'),
                'microAddCell' : $('#micro_add_cell', '#panel_tab')
            };

        }

        /**
         * ΢����ʵ������
         */
        Microlayout.fn = Microlayout.prototype = ( {
            constructor : Microlayout,
            getMicroHightlight : function() {
                return this.elements.microHightlight;
            },

            /**
             * �ͷ���Դ
             */
            unbind : function() {
                if(this.elements.microRow && this.elements.microRow.length > 0) {
                    this.elements.microRow.unbind('input');
                }
                if(this.elements.microCol && this.elements.microCol.length > 0) {
                    this.elements.microCol.unbind('input');
                }
                this.elements.mergeDown.unbind('click');
                this.elements.mergeRight.unbind('click');
                this.elements.mergeCancel.unbind('click');
                this.elements.borderTransparent.unbind('click');
                this.table.tab = null;
                this.table = null;
            },
            /**
             * ΢���ֲ˵��¼��
             */
            bind : function() {
                var table = this.table, self = this, handleNewRow = function(oRow) {//�������ӵ��������ʽ������
                    for(var i = 0; i < oRow.cells.length; i++) {
                        var $oCell = $(oRow.cells[i]);
                        if(!$oCell.hasClass('crazy-table-containter-td')) {
                            $oCell.addClass('crazy-table-containter-td');
                        }
                        if(!$oCell.hasClass('crazy-box-enable-cell')) {
                            $oCell.addClass('crazy-box-enable-cell');
                        }
                        if(!$oCell.attr('data-boxoptions')) {
                            $oCell.attr('data-boxoptions', '{"ability":{"container":{"enableType":"cell","number":"n"}}}');
                        }

                    }
                }, handleNewCell = function(oCell) {//�������ӵ��������ʽ������
                    if(oCell) {
                        var $oCell = $(oCell);
                        if(!$oCell.hasClass('crazy-table-containter-td')) {
                            $oCell.addClass('crazy-table-containter-td');
                        }
                        if(!$oCell.hasClass('crazy-box-enable-cell')) {
                            $oCell.addClass('crazy-box-enable-cell');
                        }
                        if(!$oCell.attr('data-boxoptions')) {
                            $oCell.attr('data-boxoptions', '{"ability":{"container":{"enableType":"cell","number":"n"}}}');
                        }

                    }
                }, matrix = function(_$input) {//��ȡ������У��������������ɱ��
                    var _val = _$input.val();
                    if(isNaN(_val)) {
                        _$input.val(parseInt(_val));
                        alert('�ף�����Ƿ�,���������룡');
                        return;
                    } else {
                        var pos = table.getRowAndColNumber();
                        _val = parseInt(_val);
                        if(_val <= 0) {
                            _val = 1;
                        }

                        if(_$input.attr('id') === 'micro_row' && pos.row !== _val) {
                            table.matrix(_val, pos.col, handleNewRow);
                        }
                        if(_$input.attr('id') === 'micro_col' && pos.col !== _val) {
                            table.matrix(pos.row, _val, function(oRow) {
                            }, handleNewCell);
                        }
                        table.averageWidth();
                        self.disabledAll.call(self);
                    }
                    return;
                };
                /**
                 * �趨TD���
                 */
                if(this.elements.tdWidth && this.elements.tdWidth.length > 0) {
                    this.elements.tdWidth.bind('input', function(event) {
                        event.preventDefault();
                        var $tdWidth = $(this), that = this, $oTd, intWidth = parseInt($tdWidth.val());
                        $oTd = self.elements.microHightlight.data('elem'),$oTable = $oTd.closest('table');
                        var pos = D.Table.pos($oTd[0]);
                        //���ǵ�һ�е��в������ÿ��
                        if(pos.row === 0 && !isNaN(intWidth)) {
                            $oTd.css('width', intWidth + 'px');
                        }
                        if ($oTable.css('table-layout')!=='fixed'){
                            $oTable.css('table-layout','fixed');
                        }
                    });
                }
                /**
                 * ����
                 */
                if(this.elements.microRow && this.elements.microRow.length > 0) {
                    this.elements.microRow.bind('input', function(event) {
                        event.preventDefault();
                        //event.stopPropagation();
                        matrix($(this));
                        //return;
                    });
                    this.elements.microRow.bind('click', function() {
                        this.select();
                    });
                }
                /**
                 * ����
                 */
                if(this.elements.microCol && this.elements.microCol.length > 0) {
                    this.elements.microCol.bind('input', function(event) {
                        event.preventDefault();
                        //event.stopPropagation();
                        matrix($(this));
                        //return;
                    });
                    this.elements.microCol.bind('click', function() {
                        this.select();
                    });
                }
                /**
                 * ���ºϲ�
                 */
                self.elements.mergeDown.bind('click', function(event) {
                    event.preventDefault();
                    var _self = $(this), $oTd;
                    if(!_self.parent().hasClass('disabled')) {
                        $oTd = self.elements.microHightlight.data('elem');
                        table.mergeDown($oTd[0]);
                        table.averageWidth();
                        self.disabledAll.call(self);
                    }
                });
                /**
                 * ���Һϲ�
                 */
                self.elements.mergeRight.bind('click', function(event) {
                    event.preventDefault();
                    var _self = $(this), $oTd;

                    if(!_self.parent().hasClass('disabled')) {
                        $oTd = self.elements.microHightlight.data('elem');

                        table.mergeRight($oTd[0]);
                        table.averageWidth();
                        self.disabledAll.call(self);
                    }
                });
                //ȡ��cell�ϲ�
                self.elements.mergeCancel.bind('click', function(event) {
                    event.preventDefault();
                    var _self = $(this), oTd;
                    if(!_self.parent().hasClass('disabled')) {
                        oTd = self.elements.microHightlight.data('elem')[0];

                        table.cancelMerge(oTd, handleNewCell);
                        table.averageWidth();
                        self.disabledAll.call(self);
                    }
                });
                //�߿�͸��
                this.elements.borderTransparent.bind('click', function(event) {
                    event.stopPropagation();
                    var _self = $(this), that = this;
                    if(that.checked) {
                        $(table.tab).find('td').removeClass('tborder');
                    } else {
                        //$(table.tab).find('td').removeAttr('style');
                        $(table.tab).find('td').addClass('tborder');
                    }
                });
                /**
                 *�༭΢�������
                 */
                this.elements.microFinish.bind('click', function(event) {
                    self.dropInPage.chooseLevel = 'module';
                    self.dropInPage.mircolayout = null;
                    var $module = $(self.table.tab).closest('.crazy-box-module');
                       
                     self.dropInPage.currentElem = $module;
                   
                    self.dropInPage.singerArea.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM,$module);
                    self.dropInPage._finishEditArea.call(self.dropInPage,self.dropInPage.singerArea, $(this), D.DropInPage.CONSTANTS.SINGER_AREA_EDIT_FINISH_BTN, D.DropInPage.CONSTANTS.SINGER_AREA_EDIT_LABEL_BTN, D.DropInPage.CONSTANTS.ENABLE_EDIT_AREA_CLASS_NAME, '�༭');
                });

            },
            disabledAll : function() {
                var self = this;
                self.elements.mergeCancel.parent().addClass('disabled');
                self.elements.mergeRight.parent().addClass('disabled');
                self.elements.mergeDown.parent().addClass('disabled');
                D.HighLight.hideLight(self.fixCellHighLightEl, false);
            },
            /**
             * ��ʼ�� ΢���� �У�����
             */
            load : function() {
                var table, pos;
                pos = this.table.getRowAndColNumber();
                this.elements.tableWidth.val(parseInt($(this.table.tab).outerWidth(true)));
                this.elements.microRow.val(pos.row);
                this.elements.microCol.val(pos.col);
                this.bind();

            },
            /**
             * ���� �Ƿ���Ժϲ�
             * @param {Object} oTd
             */
            showIsMerge : function(oTd) {
                var mergeDown = D.Table.isMergeDown(oTd), mergeRight = D.Table.isMergeRight(oTd), oMergeDown, oMergeRight;
                var $oTd = $(oTd);
                /**
                 * ����
                 */
                oMergeDown = this.elements.mergeDown.parent();
                if(mergeDown) {
                    oMergeDown.removeClass('disabled');
                } else {
                    oMergeDown.addClass('disabled');
                }
                //����
                oMergeRight = this.elements.mergeRight.parent();
                if(mergeRight) {
                    oMergeRight.removeClass('disabled');
                } else {
                    oMergeRight.addClass('disabled');
                }
                var oMergeCancel = this.elements.mergeCancel.parent(), mergeCancel = D.Table.isMerge(oTd);
                if(mergeCancel) {
                    oMergeCancel.removeClass('disabled');
                } else {
                    oMergeCancel.addClass('disabled');
                }

                if(this.elements.tdWidth && this.elements.tdWidth.length > 0) {
                    var pos = D.Table.pos(oTd), width = oTd.style.width;

                    if(pos && pos.row === 0) {

                        if( typeof width === 'string' && width.lastIndexOf('px') !== -1) {
                            width = parseInt(width);
                        } else {
                            width = '';
                        }
                        this.elements.tdWidth.val(width);
                        this.elements.tdWidth.removeAttr('disabled');
                        this.elements.tdWidth.parent().removeClass('disabled');
                    } else {
                        this.elements.tdWidth.attr('disabled', 'disabled');
                        this.elements.tdWidth.parent().addClass('disabled');
                        this.elements.tdWidth.val('');
                    }
                }

                return;
            }
        });
        return Microlayout;
    })();
    $.extend(Microlayout, {
        hideMicroHightlight : function(microHightlightEl, microHightlightElFix) {
            if(microHightlightEl) {
                D.HighLight.hideMicroLight(microHightlightEl);
            }
            if(microHightlightElFix) {
                D.HighLight.hideMicroLight(microHightlightElFix);
            }
        },
        /**
         * ���΢���ֺ�չʾ΢��������
         * @param {Object} dropInPage
         */
        dropInDropMicro : function(dropInPage) {
            var doc = dropInPage.iframeDoc,target = $('.microlayout-demo', doc);
            if(target.length) {
                dropInPage._hideAll();
                dropInPage.currentElem= target;
                dropInPage._showSingerArea(target);
                Microlayout.showMicro(dropInPage, target);
                dropInPage.singerArea.data(D.DropInPage.CONSTANTS.TRANSPORT_DATA_ELEM,dropInPage.currentElem);
                D.box.editor.Module._startEditArea.call(dropInPage,dropInPage.singerArea, $(this), D.DropInPage.CONSTANTS.SINGER_AREA_EDIT_LABEL_BTN, D.DropInPage.CONSTANTS.SINGER_AREA_EDIT_FINISH_BTN, D.DropInPage.CONSTANTS.ENABLE_EDIT_AREA_CLASS_NAME);
                
                //ɾ�� demo ��ʽ ����ʽ��ʾ��������΢����
                target.removeClass('microlayout-demo');
            }
        },
        /**
         * չʾ΢��������
         * @param {Object} dropInPage
         * @param {Object} target
         */
        showMicro : function(dropInPage, target) {
            var boxMicrolayout = target.find('.' + D.DropInPage.CONSTANTS.ELEMENT_CLASS_PREFIX + 'microlayout');
            dropInPage.chooseLevel = 'microlayout';
            $('.crazy-box-microlayout', dropInPage.iframeBody).each(function(index, obj) {
                $(obj).removeClass('current');
            });
            boxMicrolayout.addClass('current');
            dropInPage.table = boxMicrolayout[0];
            D.ToolsPanel.addHtmlMicroLayout();
            //΢����
            dropInPage.mircolayout = new Microlayout(dropInPage);

            dropInPage.mircolayout.load();

            // console.log(self.microHighLightEl);
            dropInPage._hideTransport(dropInPage.moveTransport);
            D.HighLight.showMicrolayoutLight(boxMicrolayout, dropInPage.microHighLightEl);
        }
    });
    D.box.editor.Microlayout = Microlayout;
})(dcms, FE.dcms);
