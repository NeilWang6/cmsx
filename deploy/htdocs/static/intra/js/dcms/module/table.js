/**
 * table相关操作
 */
;(function($, D) {

    //创建一个类
    var Table = (function() {
        function Table(table) {
        	if(!(this instanceof Table)){
        		return new Table(table);
        	}
            if( typeof table === 'string') {
                this.tab = document.getElementById(table);
            } else {
                this.tab = table;
            }
        }
        /**
         * 给实例添加方法
         */
        Table.fn = Table.prototype = ( {
            constructor : Table,
            /**
             * 平均各cell的宽度
             */
            averageWidth : function() {
                var selfTable = this.tab, maxCol = this.maxCol(), oRow = selfTable.rows[0], perCell = 0;
                if(oRow) {
                    perCell = parseInt(100 / maxCol);
                    for(var i = 0; i < oRow.cells.length; i++) {
                        var oCell = oRow.cells[i];
                        if(oCell.colSpan && oCell.colSpan > 0) {
                            $(oCell).css('width', (oCell.colSpan * perCell) + '%');
                           // $(oCell).css('  overflow', 'hidden');
                        }
                    }
                }
            },
            /**
             * 求表格中最大列数
             */
            maxCol : function() {
                var selfTable = this.tab;
                return Table.maxCol(selfTable);
            },
            /**
             *获得表格的行列数
             */
            getRowAndColNumber : function() {
                var selfTable = this.tab, oRows = selfTable.rows, index = oRows.length, maxRow = -1, maxCol = -1;
                var row = index, col = -1;
                /**
                 * 求最大列数
                 */
                maxCol = this.maxCol();

                if(maxCol !== -1) {
                    col = maxCol;
                }

                return {
                    'row' : row,
                    'col' : col
                };
            },
            /**
             * 重新布局为row行，col列的表格
             *  @param {Object} row 行数
             *  @param {Object} col 列数
             *  @param {Object} rowFn 
             *  @param {Object} colFn
             */
            matrix : function(row, col, rowFn, colFn) {
                var selfTable = this.tab, oRows = selfTable.rows, index = oRows.length, maxCol = -1;
                /**
                 * 指定的行号小于现有行号，则删除多余行数，
                 */
                if(row < index) {
                    for(var i = index - 1; i >= row; i--) {
                        this.removeRow(i);
                    }
                } else {//否则增加行数
                    for(var i = index; i < row; i++) {
                        this.addRow(i, rowFn);
                    }
                }
                //重新获得行对象列表
                oRows = selfTable.rows;
                /**
                 * 求最大列数
                 */
                maxCol = this.maxCol();
                //console.log('maxCol=' + maxCol);
                var rowSpanArr = [];
                var addNum = col - maxCol;
                //被上一行合并的行
                for(var p = 0; p < oRows.length; p++) {
                    var oRow = oRows[p], perCol = Table.colNum(oRow);
                    if(col < maxCol) {//删除多余的列
                       //删除的列数
                        var delNum = maxCol - col;
                        
                        for(var n = 0; n < delNum; n++) {
                            var realCol = oRow.cells.length, tmpCell, tmpCol = 1, tmpRow = 1;
                            tmpCell = oRow.cells[realCol - 1];
                            tmpCol = tmpCell.colSpan;
                            tmpRow = tmpCell.rowSpan;
                            if(tmpRow && tmpRow > 1) {
                                for(var k = 1; k < tmpRow; k++) {
                                    rowSpanArr.push(p + k);
                                }
                            }
                            if(tmpCol && tmpCol > 1) {//此单元格占多列
                                tmpCell.colSpan = tmpCol - 1;
                            } else {
                                var position = rowSpanArr.indexOf(p);
                                if(position === -1) {
                                    oRow.deleteCell(realCol - 1);
                                }

                            }

                        }
                    } else {
                        for(var n = 0; n < addNum; n++) {
                            var newCell, priorCell = oRow.cells[oRow.cells.length - 1], position = $(priorCell).data('position');
                            newCell = oRow.insertCell(oRow.cells.length);
                            //新增列增加位置标记
                            $(newCell).attr('data-position', JSON.stringify({
                                'row' : position.row,
                                'col' : position.col + 1
                            }));
                            /**
                             * 添加对新增cell的处理
                             */
                            if(colFn && typeof colFn === 'function') {
                                colFn.call(this, newCell);
                            }
                        }

                    }
                }

            },
            /**
             * 向下合并
             *@param {Object} oTd 合并开始Td
             */
            mergeDown : function(oTd) {
                if(!oTd) {
                    return;
                }
                var position = $(oTd).data('position'), pos = D.Table.pos(oTd), rowSpan = oTd.rowSpan;
                if(!rowSpan) {
                    rowSpan = 1;
                }
                var nextRowNum = pos.row + rowSpan, nextCell, oRows = this.tab.rows, oRow = oRows[nextRowNum];
                for(var i = 0; i < oRow.cells.length; i++) {
                    var tmpCell = oRow.cells[i], tmpPosition = $(tmpCell).data('position');
                    if(position.col === tmpPosition.col) {
                        nextCell = oRow.cells[i];
                    }
                }
                var nextPos = D.Table.pos(nextCell);

                this.merge(pos, nextPos, 'down');
            },
            /**
             * 向右合并
             *@param {Object} oTd 合并开始Td
             */
            mergeRight : function(oTd) {
                if(!oTd) {
                    return;
                }
                var position = D.Table.pos(oTd), pos = D.Table.pos(oTd), colSpan = oTd.colSpan;
                if(!colSpan) {
                    colSpan = 1;
                }
                var oRow = oTd.parentNode, nextCell = oRow.cells[pos.col + 1], nextPos = D.Table.pos(nextCell);

                this.merge(pos, nextPos, 'right');
            },
            /**
             * 合并table表格
             * @param {Object} pos 合并开始位置
             * @param {Object} nextPos 结束位置
             * @param {Object} direction 方向 (right down)
             */
            merge : function(pos, nextPos, direction) {
                var self = this, xspan = 0, yspan = 0, beginRow, endRow, beginCol, endCol;
                if(direction === 'down') {
                    beginRow = pos.row, endRow = pos.row + 1, beginCol = nextPos.col, endCol = nextPos.col;
                }
                if(direction === 'right') {
                    beginRow = pos.row, endRow = pos.row, beginCol = pos.col, endCol = nextPos.col;
                }

                if(beginRow === endRow && beginCol === endCol) {
                    return;
                }

                if(direction === 'right') {
                    /**
                     * 合并的列数
                     */
                    for(var i = beginCol; i <= endCol; i++) {
                        xspan += self.tab.rows[beginRow].cells[i].colSpan;
                    }

                    //同一行中合并列
                    for(var i = beginRow; i <= endRow; i++) {
                        var j = beginCol;
                        while(j < endCol) {//删除需要合并的列
                            self.tab.rows[i].deleteCell(nextPos.col);
                            j++;
                        }
                        //合并列
                        self.tab.rows[i].cells[beginCol].colSpan = xspan;
                    }
                }
                //同一列中合并行
                /**
                 * 删除多余的列
                 */
                if(direction === 'down') {
                    var tCell = self.tab.rows[beginRow].cells[pos.col];
                    var tRowSpan = tCell.rowSpan, tRowSpanArray = [];
                    if(tRowSpan && tRowSpan > 1) {
                        for(var p = 1; p < tRowSpan; p++) {
                            tRowSpanArray.push(p + beginRow);
                        }
                        endRow = endRow + tRowSpan - 1;
                    }
                    /**
                     * 合并的行数
                     */
                    // for(var i = beginRow; i <= nextPos.row; i++) {
                    yspan += tCell.rowSpan + self.tab.rows[nextPos.row].cells[beginCol].rowSpan;
                    // }

                    for(var i = endRow; i > beginRow; i--) {
                        var index = tRowSpanArray.indexOf(i);
                        //console.log('index=' + index);
                        if(index === -1) {
                            self.tab.rows[i].deleteCell(beginCol);
                        }
                        //row中cell为0，则删除此行
                        if(self.tab.rows[i].cells.length === 0) {
                            self.tab.deleteRow(i);
                        }
                    }
                    //合并行
                    tCell.rowSpan = yspan;
                }

            },
            /**
             * 向指定的一行插入新行，不输入参数，非数字或超过table的最大行数默认插入最后一行
             * @param {Object} pos 行号
             */
            addRow : function(pos) {
                var selfTable = this.tab, oRows = selfTable.rows, index = oRows.length - 1, maxCol = 0, callback;
                if( typeof pos === 'number' && pos >= 0) {
                    if(pos < index) {
                        index = pos;
                    }
                }
                if( typeof pos === 'function') {
                    callback = pos;
                } else {
                    callback = arguments[1];
                }
                /**
                 * 求最大列数
                 */
                maxCol = this.maxCol();
                var rowIndex = index + 1;
                var newRow = selfTable.insertRow(rowIndex), newCell;
                for(var i = 0; i < maxCol; i++) {
                    newCell = newRow.insertCell(i);
                    $(newCell).attr('data-position', JSON.stringify({
                        'row' : rowIndex,
                        'col' : i
                    }));

                }
                /**
                 * 添加对新增cell的处理
                 */
                if(callback && typeof callback === 'function') {
                    callback.call(this, newRow);
                }

            },
            /**
             * 向所有行指定的一列插入新列，不输入参数，非数字或超过table的最大列数默认插入最后一列
             * @param {Object} pos 列号
             */
            addCol : function(pos) {
                var selfTable = this.tab, oRows = selfTable.rows, callback;
                if( typeof pos === 'function') {
                    callback = pos;
                } else {
                    callback = arguments[1];
                }
                for(var i = 0; i < oRows.length; i++) {
                    var oRow = oRows[i], p = oRow.cells.length;
                    if( typeof pos === 'number' && pos >= 0) {
                        if(pos < p) {
                            p = pos;
                        }
                    }
                    var priorCell = oRow.cells[p - 1], newCell = oRow.insertCell(p);
                    var position = $(priorCell).data('position');
                    //单元格在表格中的 显示位置
                    $(newCell).attr('data-position', JSON.stringify({
                        'row' : position.row,
                        'col' : position.col + 1
                    }));
                    /**
                     * 添加对新增cell的处理
                     */
                    if(callback && typeof callback === 'function') {
                        callback.call(this, newCell);
                    }
                }
            },
            /**
             * 取消cell的合并信息
             * @param {Object} oCell 取消合并的单元格
             * @param {Object} callback 对新增单元格的回调function
             */
            cancelMerge : function(oCell, callback) {
                var colSpan = 1, rowSpan = 1, pos, oRow, oRows, tCell, colNum = 0;
                if(oCell) {
                    colSpan = oCell.colSpan, rowSpan = oCell.rowSpan;

                    pos = Table.pos(oCell);
                    //console.log(pos);
                    oRow = oCell.parentNode;
                    //处理一行中的多列
                    if(colSpan && colSpan > 1) {

                        for(var i = 1; i < colSpan; i++) {
                            tCell = oRow.insertCell(pos.col + i);

                            if(callback && typeof callback === 'function') {
                                callback.call(this, tCell);
                            }
                        }
                        var position = $(oCell).data('position');
                        for(var p = 1; p < colSpan; p++) {
                            tCell = oRow.cells[pos.col + p];
                            $(tCell).attr('data-position', JSON.stringify({
                                'row' : position.row,
                                'col' : position.col + p
                            }));
                        }

                        oCell.colSpan = 1;
                    }
                    // console.log('colSpan=='+colSpan+',rowSpan='+rowSpan);
                    //处理一列的多行
                    var rowSpanArray = [];

                    if(rowSpan && rowSpan > 1) {

                        oRows = this.tab.rows;
                        for(var k = 1; k < rowSpan; k++) {
                            rowSpanArray.push(pos.row + k);
                        }
                        //console.log(rowSpanArray);
                        for(var n = 0; n < rowSpanArray.length; n++) {
                            var tRow = oRows[rowSpanArray[n]];
                            if(colSpan && colSpan > 1) {
                                for(var i = 0; i < colSpan; i++) {
                                    tCell = tRow.insertCell(pos.col + i);
                                    if(callback && typeof callback === 'function') {
                                        callback.call(this, tCell);
                                    }
                                    $(tCell).attr('data-position', JSON.stringify({
                                        'row' : rowSpanArray[n],
                                        'col' : pos.col + i
                                    }));
                                }
                            } else {
                                tCell = tRow.insertCell(pos.col);
                                if(callback && typeof callback === 'function') {
                                    callback.call(this, tCell);
                                }
                                $(tCell).attr('data-position', JSON.stringify({
                                    'row' : rowSpanArray[n],
                                    'col' : pos.col
                                }));
                            }

                        }
                        oCell.rowSpan = 1;
                    }
                }
            },
            /**
             * 删除指定的一行，不输入参数，非数字或超过table的最大行数默认删除最后一行
             * @param {Object} pos 行号
             */
            removeRow : function(pos) {
                var selfTable = this.tab, oRows = selfTable.rows, index = oRows.length - 1;
                if(oRows.length === 1) {
                    alert('最后一行不能删除!');
                    return;
                }
                if( typeof pos === 'number' && pos >= 0) {
                    if(pos < index) {
                        index = pos;
                    }
                }
                this.tab.deleteRow(index);
            }
        });
        return Table;
    })();

    /**
     * 给类添加方法
     */
    $.extend(Table, {
        /**
         * 获得列对象的位置 物理位置
         *@param {Object} oCell 列对象
         */
        pos : function(oCell) {
            if(!oCell)
                return;
            var row = -1, col = -1, oRow = oCell.parentNode, oTable = oRow.parentNode;
            for(var i = 0; i < oTable.rows.length; i++) {
                var tRow = oTable.rows[i];
                if(oRow === tRow) {
                    row = i;
                    for(var p = 0; p < tRow.cells.length; p++) {
                        var tCell = tRow.cells[p];
                        if(oCell === tCell) {
                            col = p;
                            break;
                        }
                    }
                }
            }
            return {
                'row' : row,
                'col' : col
            };
        },

        /**
         * 检查是否是最后一行
         * @param {Object} oRow 行对象
         */
        lastRow : function(oRow) {
            if(!oRow) {
                return false;
            }
            var selfTable = oRow.parentNode, oRows = selfTable.rows, index = oRows.length - 1, lastRow = oRows[index];
            return lastRow === oRow;

        },
        /**
         * 检查是否是最后一列
         * @param {Object} oCell 列对象
         */
        lastCell : function(oCell) {
            if(!oCell) {
                return false;
            }
            var oRow = oCell.parentNode, index = oRow.cells.length - 1, lastCell = oRow.cells[index];
            return lastCell === oCell;
        },
        /**
         * 检查是可以向右合并
         * @param {Object} oCell 列对象
         */
        isMergeRight : function(oCell) {
            if(!oCell) {
                return false;
            }
            var last = Table.lastCell(oCell), oRow = oCell.parentNode, pos = Table.pos(oCell), colspan = oCell.colSpan;
            var rowspan = oCell.rowSpan, nextCell, currentPosition = $(oCell).data('position');
            if(last) {
                return !last;
            }
            /**
             * 当前cell 的rowspan值 不存在或为0 默认为1
             */
            if(!rowspan) {
                rowspan = 1;
            }
            if(!colspan) {
                colspan = 1;
            }

            /**
             * 得到当前cell右边的cell
             */
            var realCol = currentPosition.col + colspan;
            for(var k = 0; k < oRow.cells.length; k++) {
                var tmpCell = $(oRow.cells[k]), tmpPos = tmpCell.data('position');
                if(tmpPos.col === realCol) {
                    nextCell = oRow.cells[k];
                    break;
                }
            }
            /**
             * 不存在，返回false
             */
            if(!nextCell) {
                return false;
            }
            var nextRowSpan = nextCell.rowSpan;
            if(!nextRowSpan) {
                nextRowSpan = 1;
            }
            /**
             * 得到右则cell的坐标
             */
            var position = $(nextCell).data('position');
            //不相等，则返回 false
            if(realCol !== position.col) {
                return false;
            }
            if(rowspan !== nextRowSpan) {
                return false;
            }
            return true;

        },
        /**
         * 检查是可以向下合并
         * @param {Object} oCell 列对象
         */
        isMergeDown : function(oCell) {
            if(!oCell) {
                return false;
            }

            var oRow = oCell.parentNode, last = Table.lastRow(oRow), oRows = oRow.parentNode.rows, colspan = 0, downRow = 0;
            if(last) {
                return !last;
            }
            //检查选中的cell是否是最后一行
            var rowSpan = oCell.rowSpan, rowNum = oRows.length, pos = Table.pos(oCell);
            var tRow = rowSpan + pos.row;
            if(tRow >= rowNum) {
                return false;
            }
            /**
             * 当前cell的colspan值 不存在或为0 默认为1
             */
            colspan = oCell.colSpan;
            if(!colspan) {
                colspan = 1;
            }
            if(!rowSpan) {
                rowSpan = 1;
            }
            var position = $(oCell).data('position'), downCell, downCol = 1, downRow = 1;
            /**
             * 取当前cell的正下方cell的colspan值 //不存在或为0 默认为1
             */
            downRow = pos.row + rowSpan;
            //获得选中cell的正下放的cell的位置
            for(var k = 0; k < oRows[downRow].cells.length; k++) {
                var tmpCell = oRows[downRow].cells[k], tmpPosition = $(tmpCell).data('position');
                if(position.col === tmpPosition.col) {
                    downCell = tmpCell;
                    break;
                }
            }
            if(!downCell) {
                return false;
            }
            downCol = downCell.colSpan;
            if(!downCol) {
                downCol = 1;
            }

            if(colspan !== downCol) {
                return false;
            }
            return true;
        },
        /**
         * 求一行中的列数
         */
        colNum : function(oRow) {
            var colNum = -1;
            /**
             * 求列数
             */
            if(oRow) {
                var cellNum = oRow.cells.length, realNum = 0;
                for(var i = 0; i < cellNum; i++) {
                    var oCell = oRow.cells[i], colspan = oCell.colSpan;
                    if(colspan && colspan !== 1) {//当前单元格有合并，占了多个单元格
                        realNum += colspan;
                    } else {
                        realNum += 1;
                    }
                }
                if(realNum > colNum) {
                    colNum = realNum;
                }
            }
            return colNum;
        },

        /**
         * 检查是否有合并
         */
        isMerge : function(oCell) {
            if(oCell) {
                if(oCell.colSpan && oCell.colSpan > 1) {
                    return true;
                }
                if(oCell.rowSpan && oCell.rowSpan > 1) {
                    return true;
                }
                return false;
            }
        }, /**
         * 求表格中最大列数
         */
        maxCol : function(selfTable) {
            if(!selfTable) {
                return -1;
            }
            var oRows = selfTable.rows, index = oRows.length, maxCol = -1;
            /**
             * 求最大列数
             */
            for(var p = 0; p < index; p++) {
                var oRow = oRows[p], cellNum = oRow.cells.length, realNum = 0;
                for(var i = 0; i < cellNum; i++) {
                    var oCell = oRow.cells[i], colspan = oCell.colSpan;
                    if(colspan && colspan !== 1) {//当前单元格有合并，占了多个单元格
                        realNum += colspan;
                    } else {
                        realNum += 1;
                    }
                }
                if(realNum > maxCol) {
                    maxCol = realNum;
                }
            }
            return maxCol;
        }
    });

    D.Table = Table;
})(dcms, FE.dcms);
