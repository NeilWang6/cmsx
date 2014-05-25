/**
 * @usefor catalog, department tree
 * @author hongss
 * @date 2011.11.14
 * 
 */

;(function($, D, undefined){
    D.Tree = function(el, config){
        this._init(el, config);
    }
    D.Tree.defConfig = {
        data: null,                   //用来组建树结构的数据
        template: '',                 //用来组建树结构的最小单位HTML模板代码
        parentKey: 'parentId',        //用来辨别父级元素的key
        eventEl: '.dcms-tree-name',   //用来承载“打开/收起”事件的元素选择器
        element: '.dcms-tree-name',   //用来承载当前一行数据的元素
        //wrapClass: '.dcms-tree-wrapper',
        subWrapClass: '.dcms-tree-list',
        initParentId: 0,              //第一级元素的父级元素ID
        showNode: null,               //在初始化时需要显示（或已选中）的nodeId，可以是数组
        append: null                  //插入一行数据后执行的回调函数
    }
    D.Tree.CONSTANTS = {
        SIGN_TREE_OPEN: 'dcms-tree-open',
        CATALOG_INFO: 'cataloginfo',
        NO_SUB_CATALOG: 'nosub',
        SEARCH_HIDE_CLASS: 'dcms-search-hide'
    }
    
    D.Tree.prototype = {
        _init: function(el, config){
            if (!el){
                return;
            }
            var defConfig = $.extend({}, D.Tree.defConfig);
            this.el = el;
            this.config = $.extend(defConfig, config);
            var self = this,
            config = self.config,
            showNode = config.showNode;
            
            self._insertSubTree(el, config.initParentId);
            self._initEvent(el);
            
            if (showNode){
                this.showChooseNodes(showNode);
            }
        },
        /**
         * @methed _showSubTree 展示下一级树结构
         * @param el {object} 必选，显示节点信息的元素，其下一个兄弟节点为承载下一级树结构的容器
         */
        _showSubTree: function(container, id){
            var el = container.prev(),
            siblingChildren = container.children(),
            SIGN_TREE_OPEN = D.Tree.CONSTANTS.SIGN_TREE_OPEN,
            CATALOG_INFO = D.Tree.CONSTANTS.CATALOG_INFO,
            NO_SUB_CATALOG = D.Tree.CONSTANTS.NO_SUB_CATALOG,
            SEARCH_HIDE_CLASS = D.Tree.CONSTANTS.SEARCH_HIDE_CLASS;
            
            id = id || el.data(CATALOG_INFO)['id'];
            //判断是否已经“存在子节点”或“没有子节点”
            if (siblingChildren.length || container.data(NO_SUB_CATALOG)){
                container.show();
                //去除搜索时所加的隐藏class
                container.find('.'+SEARCH_HIDE_CLASS).removeClass(SEARCH_HIDE_CLASS);
                el.addClass(SIGN_TREE_OPEN);
            } else {
                //插入子节点
                this._insertSubTree(container, id);
                el.addClass(SIGN_TREE_OPEN);
                container.show();
            }
        },
        /**
         * @methed _insertSubTree 插入下一级树结构
         * @param container {object} 必选，承载下一级树结构的容器
         * @param parentId {string} 必选，父级元素的ID
         */
        _insertSubTree: function(container, parentId){
            var self = this,
            config = self.config,
            data = config.data,
            parentKey = config.parentKey,
            template = config.template,
            strHtml = null, noSub = true,
            
            CATALOG_INFO = D.Tree.CONSTANTS.CATALOG_INFO,
            NO_SUB_CATALOG = D.Tree.CONSTANTS.NO_SUB_CATALOG;
            $.each(data, function(index, item){
                if (item[parentKey]==parentId){
                    noSub = false;
                    strHtml = $($.util.substitute(template, item));
                    container.append(strHtml);
                    strHtml.find(config.element).data(CATALOG_INFO, item);
                    //执行append回调函数
                    if (config.append){
                        config.append.call(strHtml, item);
                    }
                }
            });
            if (data.length){
                container.data(NO_SUB_CATALOG, noSub);
            }
            //container.html(strHtml);
        },
        /**
         * @methed _initEvent 注册相关事件
         * @param el {object} 必选，整个树结构的容器
         */
        _initEvent: function(el){
            var self = this,
            config = self.config,
            eventEl = config.eventEl,
            els = $(eventEl, el),
            SIGN_TREE_OPEN = D.Tree.CONSTANTS.SIGN_TREE_OPEN;
            
            els.live('click', function(e){
                var eEl = $(this),
                siblingEl = eEl.next();
                
                if (eEl.hasClass(SIGN_TREE_OPEN)){
                    siblingEl.hide();
                    eEl.removeClass(SIGN_TREE_OPEN);
                } else {
                    self._showSubTree(siblingEl);
                }
            });
        },
        /**
         * @methed getParents 获取父辈们的ID和Name
         * @param nodeId {number} 必选，节点ID
         * @return {array} 数据结构为， [{'id':id, 'name':name}, ...]
         */
        getParents: function(nodeId){
            var data = this.config.data,
            id = nodeId,
            parents = [];
            while (id && data[id]){
                var subData = data[id];
                parents.push({'id':id, 'name':subData['name']});
                id = subData['parentId'];
            }
            return parents.reverse();
        },
        
        /**
         * @methed _showChooseNode 根据提供的nodeId，显示全路径，并按顺序返回全路径的name
         * @param nodeId {number} 必选，节点ID
         * @return {array} 数据结构为， [parent1, parent2, ...]
         */
        _showChooseNode: function(nodeId, isChecked, isShowSub){
            var parents = this.getParents(nodeId),
            subWrapClass = this.config.subWrapClass,
            parentsName = [];
            isChecked = (typeof isChecked!=='undefined') ? isChecked : false;
            isShowSub = (typeof isShowSub!=='undefined') ? isShowSub : true;
            for (var i=0, l=parents.length; i<l; i++){
                var item = parents[i],
                container = $(subWrapClass+'-'+item['id'], this.el);
                if (isChecked && isChecked===true){
                    container.prev().find(':checkbox').attr('checked', true);
                } else if(isChecked && isChecked==='setFalse') {
                    container.prev().find(':checkbox').attr('checked', false);
                }
                if (isShowSub && isShowSub==true){
                    this._showSubTree(container, item['id']);
                }
                
                parentsName.push(item['name']);
            }
            return parentsName;
        },
        /**
         * @methed showChooseNodes 根据提供的nodeIds，显示全路径，并按顺序返回全路径的name组
         * @param nodeIds {number/array} 必选，节点ID，可以是数组
         * @param isChecked {boolean} 是否已经被选择，如果有被选择，则checkbox打钩
         * @return {array} 数据结构为， [[parent1,...], [parents1, ..], ...] 或 [parent1, parent2, ...]
         */
        showChooseNodes: function(nodeIds, isChecked, isShowSub){
            if (!$.isArray(nodeIds)){
                return this._showChooseNode(nodeIds, isChecked, isShowSub);
            }
            var pathes = [];
            for (var i=0, l=nodeIds.length; i<l; i++){
                pathes.push(this._showChooseNode(nodeIds[i], isChecked, isShowSub).join('->'));
            }
            return pathes;
        },
        /**
         * @methed searchName 根据提供的strName查找显示节点
         * @param strName {number} 可选，关键字，但没有时显示全部
         */
        searchName: function(strName){
            this.resetNodes(false);
            //当关键字不存在时
            if (!strName){
                return;
            }
            
            var SEARCH_HIDE_CLASS = D.Tree.CONSTANTS.SEARCH_HIDE_CLASS,
            self = this,
            config = self.config,
            subWrapClass = config.subWrapClass,
            data = config.data,
            resultIds = [];
            //找出与关键字匹配的节点
            $.each(data, function(index, item){
                if (item['name'].indexOf(strName)!==-1){
                    self._showChooseNode(item['id'], false, true);
                    resultIds.push(item['id']);
                }
            });
            //隐藏所有节点
            self.el.find('.dcms-tree-wrapper').addClass(SEARCH_HIDE_CLASS);
            for (var i=0, l=resultIds.length; i<l; i++){
                $(subWrapClass+'-'+resultIds[i], self.el).parentsUntil(self.el).removeClass(SEARCH_HIDE_CLASS);
            }
        },
        /**
         * @methed resetNodes 初始化节点
         * @param resetChecked {boolean} 可选，是否重置checkbox；默认为重置
         */
        resetNodes: function(resetChecked){
            resetChecked = (typeof resetChecked!=='undefined') ? resetChecked : true;
            var CONSTANTS = D.Tree.CONSTANTS,
            SIGN_TREE_OPEN = CONSTANTS.SIGN_TREE_OPEN
            SEARCH_HIDE_CLASS = CONSTANTS.SEARCH_HIDE_CLASS;
            $('.'+SEARCH_HIDE_CLASS, this.el).removeClass(SEARCH_HIDE_CLASS);
            $('.'+SIGN_TREE_OPEN, this.el).removeClass(SIGN_TREE_OPEN);
            $(this.config.subWrapClass, this.el).hide();
            if (resetChecked===true){
                $(':checkbox', this.el).attr('checked', false);
            }
        }

    }
})(jQuery, FE.dcms);