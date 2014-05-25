/**
 * @author pingchun.yupc
 * @userfor 微布局相关操作
 * @date  2012.09.7
 */

;(function($, D, undefined) {
    var Microlayout = (function() {
        function Microlayout(target) {
            this.table = new D.Table(target.table);
            this.fixCellHighLightEl = target.fixCellHighLightEl;
            this.elements = {
                'microHightlight' : $('#crazy-box-micro-highlight', target.iframeBody),
                'microRow' : $('#micro_row', target.iframeBody),
                'microCol' : $('#micro_col', target.iframeBody),
                'mergeDown' : $('.merge-down-bin', target.iframeBody),
                'mergeRight' : $('.merge-right-bin', target.iframeBody),
                'mergeCancel' : $('.merge-cancel-bin', target.iframeBody),
                'borderTransparent' : $('#border_transparent', target.iframeBody)
            };
        }

        /**
         * 微布局实例方法
         */
        Microlayout.fn = Microlayout.prototype = ( {
            constructor : Microlayout,
            getMicroHightlight : function() {
                return this.elements.microHightlight;
            },
            /**
             * 释放资源
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
             * 微布局菜单事件邦定
             */
            bind : function() {
                var table = this.table, self = this, handleNewRow = function(oRow) {//对新增加的行添加新式和数据
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
                }, handleNewCell = function(oCell) {//对新增加的列添加新式和数据
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
                }, matrix = function(_$input) {//获取输入的行，列数，重新生成表格
                    var _val = _$input.val();
                    if(isNaN(_val)) {
                        _$input.val(parseInt(_val));
                        alert('亲，输入非法,请重新输入！');
                        return;
                    } else {
                        var pos = table.getRowAndColNumber();
                        _val = parseInt(_val);

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
                 * 行数
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
                 * 列数
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
                 * 向下合并
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
                 * 向右合并
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
                //取消cell合并
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
                //边框透明
                this.elements.borderTransparent.bind('click', function(event) {
                    event.stopPropagation();
                    var _self = $(this), that = this;
                    if(that.checked) {
                        $(table.tab).find('td').css('border', 'none');
                    } else {
                        //$(table.tab).find('td').removeAttr('style');
                        $(table.tab).find('td').css('border', '1px dotted black');
                    }
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
             * 初始化 微布局 行，列数
             */
            load : function() {
                var table, pos;
                pos = this.table.getRowAndColNumber();
                this.elements.microRow.val(pos.row);
                this.elements.microCol.val(pos.col);
                this.bind();
            },
            /**
             * 控制 是否可以合并
             * @param {Object} oTd
             */
            showIsMerge : function(oTd) {
                var mergeDown = D.Table.isMergeDown(oTd), mergeRight = D.Table.isMergeRight(oTd), oMergeDown, oMergeRight;
                /**
                 * 向下
                 */
                oMergeDown = this.elements.mergeDown.parent();
                if(mergeDown) {
                    oMergeDown.removeClass('disabled');
                } else {
                    oMergeDown.addClass('disabled');
                }
                //向右
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
        }
    });
    D.Microlayout = Microlayout;
})(dcms, FE.dcms);
