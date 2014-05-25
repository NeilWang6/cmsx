/**
 * table��ز���
 */
;(function($, D) {

    //����һ����
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
         * ��ʵ����ӷ���
         */
        Table.fn = Table.prototype = ( {
            constructor : Table,
            /**
             * ƽ����cell�Ŀ��
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
             * �������������
             */
            maxCol : function() {
                var selfTable = this.tab;
                return Table.maxCol(selfTable);
            },
            /**
             *��ñ���������
             */
            getRowAndColNumber : function() {
                var selfTable = this.tab, oRows = selfTable.rows, index = oRows.length, maxRow = -1, maxCol = -1;
                var row = index, col = -1;
                /**
                 * ���������
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
             * ���²���Ϊrow�У�col�еı��
             *  @param {Object} row ����
             *  @param {Object} col ����
             *  @param {Object} rowFn 
             *  @param {Object} colFn
             */
            matrix : function(row, col, rowFn, colFn) {
                var selfTable = this.tab, oRows = selfTable.rows, index = oRows.length, maxCol = -1;
                /**
                 * ָ�����к�С�������кţ���ɾ������������
                 */
                if(row < index) {
                    for(var i = index - 1; i >= row; i--) {
                        this.removeRow(i);
                    }
                } else {//������������
                    for(var i = index; i < row; i++) {
                        this.addRow(i, rowFn);
                    }
                }
                //���»���ж����б�
                oRows = selfTable.rows;
                /**
                 * ���������
                 */
                maxCol = this.maxCol();
                //console.log('maxCol=' + maxCol);
                var rowSpanArr = [];
                var addNum = col - maxCol;
                //����һ�кϲ�����
                for(var p = 0; p < oRows.length; p++) {
                    var oRow = oRows[p], perCol = Table.colNum(oRow);
                    if(col < maxCol) {//ɾ���������
                       //ɾ��������
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
                            if(tmpCol && tmpCol > 1) {//�˵�Ԫ��ռ����
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
                            //����������λ�ñ��
                            $(newCell).attr('data-position', JSON.stringify({
                                'row' : position.row,
                                'col' : position.col + 1
                            }));
                            /**
                             * ��Ӷ�����cell�Ĵ���
                             */
                            if(colFn && typeof colFn === 'function') {
                                colFn.call(this, newCell);
                            }
                        }

                    }
                }

            },
            /**
             * ���ºϲ�
             *@param {Object} oTd �ϲ���ʼTd
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
             * ���Һϲ�
             *@param {Object} oTd �ϲ���ʼTd
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
             * �ϲ�table���
             * @param {Object} pos �ϲ���ʼλ��
             * @param {Object} nextPos ����λ��
             * @param {Object} direction ���� (right down)
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
                     * �ϲ�������
                     */
                    for(var i = beginCol; i <= endCol; i++) {
                        xspan += self.tab.rows[beginRow].cells[i].colSpan;
                    }

                    //ͬһ���кϲ���
                    for(var i = beginRow; i <= endRow; i++) {
                        var j = beginCol;
                        while(j < endCol) {//ɾ����Ҫ�ϲ�����
                            self.tab.rows[i].deleteCell(nextPos.col);
                            j++;
                        }
                        //�ϲ���
                        self.tab.rows[i].cells[beginCol].colSpan = xspan;
                    }
                }
                //ͬһ���кϲ���
                /**
                 * ɾ���������
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
                     * �ϲ�������
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
                        //row��cellΪ0����ɾ������
                        if(self.tab.rows[i].cells.length === 0) {
                            self.tab.deleteRow(i);
                        }
                    }
                    //�ϲ���
                    tCell.rowSpan = yspan;
                }

            },
            /**
             * ��ָ����һ�в������У�����������������ֻ򳬹�table���������Ĭ�ϲ������һ��
             * @param {Object} pos �к�
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
                 * ���������
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
                 * ��Ӷ�����cell�Ĵ���
                 */
                if(callback && typeof callback === 'function') {
                    callback.call(this, newRow);
                }

            },
            /**
             * ��������ָ����һ�в������У�����������������ֻ򳬹�table���������Ĭ�ϲ������һ��
             * @param {Object} pos �к�
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
                    //��Ԫ���ڱ���е� ��ʾλ��
                    $(newCell).attr('data-position', JSON.stringify({
                        'row' : position.row,
                        'col' : position.col + 1
                    }));
                    /**
                     * ��Ӷ�����cell�Ĵ���
                     */
                    if(callback && typeof callback === 'function') {
                        callback.call(this, newCell);
                    }
                }
            },
            /**
             * ȡ��cell�ĺϲ���Ϣ
             * @param {Object} oCell ȡ���ϲ��ĵ�Ԫ��
             * @param {Object} callback ��������Ԫ��Ļص�function
             */
            cancelMerge : function(oCell, callback) {
                var colSpan = 1, rowSpan = 1, pos, oRow, oRows, tCell, colNum = 0;
                if(oCell) {
                    colSpan = oCell.colSpan, rowSpan = oCell.rowSpan;

                    pos = Table.pos(oCell);
                    //console.log(pos);
                    oRow = oCell.parentNode;
                    //����һ���еĶ���
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
                    //����һ�еĶ���
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
             * ɾ��ָ����һ�У�����������������ֻ򳬹�table���������Ĭ��ɾ�����һ��
             * @param {Object} pos �к�
             */
            removeRow : function(pos) {
                var selfTable = this.tab, oRows = selfTable.rows, index = oRows.length - 1;
                if(oRows.length === 1) {
                    alert('���һ�в���ɾ��!');
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
     * ������ӷ���
     */
    $.extend(Table, {
        /**
         * ����ж����λ�� ����λ��
         *@param {Object} oCell �ж���
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
         * ����Ƿ������һ��
         * @param {Object} oRow �ж���
         */
        lastRow : function(oRow) {
            if(!oRow) {
                return false;
            }
            var selfTable = oRow.parentNode, oRows = selfTable.rows, index = oRows.length - 1, lastRow = oRows[index];
            return lastRow === oRow;

        },
        /**
         * ����Ƿ������һ��
         * @param {Object} oCell �ж���
         */
        lastCell : function(oCell) {
            if(!oCell) {
                return false;
            }
            var oRow = oCell.parentNode, index = oRow.cells.length - 1, lastCell = oRow.cells[index];
            return lastCell === oCell;
        },
        /**
         * ����ǿ������Һϲ�
         * @param {Object} oCell �ж���
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
             * ��ǰcell ��rowspanֵ �����ڻ�Ϊ0 Ĭ��Ϊ1
             */
            if(!rowspan) {
                rowspan = 1;
            }
            if(!colspan) {
                colspan = 1;
            }

            /**
             * �õ���ǰcell�ұߵ�cell
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
             * �����ڣ�����false
             */
            if(!nextCell) {
                return false;
            }
            var nextRowSpan = nextCell.rowSpan;
            if(!nextRowSpan) {
                nextRowSpan = 1;
            }
            /**
             * �õ�����cell������
             */
            var position = $(nextCell).data('position');
            //����ȣ��򷵻� false
            if(realCol !== position.col) {
                return false;
            }
            if(rowspan !== nextRowSpan) {
                return false;
            }
            return true;

        },
        /**
         * ����ǿ������ºϲ�
         * @param {Object} oCell �ж���
         */
        isMergeDown : function(oCell) {
            if(!oCell) {
                return false;
            }

            var oRow = oCell.parentNode, last = Table.lastRow(oRow), oRows = oRow.parentNode.rows, colspan = 0, downRow = 0;
            if(last) {
                return !last;
            }
            //���ѡ�е�cell�Ƿ������һ��
            var rowSpan = oCell.rowSpan, rowNum = oRows.length, pos = Table.pos(oCell);
            var tRow = rowSpan + pos.row;
            if(tRow >= rowNum) {
                return false;
            }
            /**
             * ��ǰcell��colspanֵ �����ڻ�Ϊ0 Ĭ��Ϊ1
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
             * ȡ��ǰcell�����·�cell��colspanֵ //�����ڻ�Ϊ0 Ĭ��Ϊ1
             */
            downRow = pos.row + rowSpan;
            //���ѡ��cell�����·ŵ�cell��λ��
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
         * ��һ���е�����
         */
        colNum : function(oRow) {
            var colNum = -1;
            /**
             * ������
             */
            if(oRow) {
                var cellNum = oRow.cells.length, realNum = 0;
                for(var i = 0; i < cellNum; i++) {
                    var oCell = oRow.cells[i], colspan = oCell.colSpan;
                    if(colspan && colspan !== 1) {//��ǰ��Ԫ���кϲ���ռ�˶����Ԫ��
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
         * ����Ƿ��кϲ�
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
         * �������������
         */
        maxCol : function(selfTable) {
            if(!selfTable) {
                return -1;
            }
            var oRows = selfTable.rows, index = oRows.length, maxCol = -1;
            /**
             * ���������
             */
            for(var p = 0; p < index; p++) {
                var oRow = oRows[p], cellNum = oRow.cells.length, realNum = 0;
                for(var i = 0; i < cellNum; i++) {
                    var oCell = oRow.cells[i], colspan = oCell.colSpan;
                    if(colspan && colspan !== 1) {//��ǰ��Ԫ���кϲ���ռ�˶����Ԫ��
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
