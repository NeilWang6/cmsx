/*--------------------------------------------------|

 | dTree 2.05 | www.destroydrop.com/javascript/tree/ |

 |---------------------------------------------------|

 | Copyright (c) 2002-2003 Geir Landr枚               |

 |                                                   |

 | This script can be used freely as long as all     |

 | copyright messages are intact.                    |

 |                                                   |

 | Updated: 17.04.2003                               |

 |--------------------------------------------------*/
 //updata zhuliqi
 //增三个参数
//  'para': {} 发送数据的参数
// 'onleychecked': 'false',//只能选中一个选项
// 'allCanChecked': 'false'//所有的选项都可以选择
;(function($, D) {
    // Node object
    function Node(id, pid, name, disabled, url, title, target, icon, iconOpen, open) {
        var json = null;
        if( typeof id === 'object') {
            json = id;
            this.id = json.id;
            this.pid = json.pid;
            this.name = json.name;
            this.disabled = json.disabled;
            this.url = json.url;
            this.title = json.title;
            this.target = json.target;
            this.icon = json.icon;
            this.iconOpen = json.iconOpen;
            this._io = json.open || false;
        } else {
            this.id = id;
            this.pid = pid;
            this.name = name;
            this.disabled = disabled;
            this.url = url;
            this.title = title;
            this.target = target;
            this.icon = icon;
            this.iconOpen = iconOpen;
            this._io = open || false;
        }
        this._is = false;
        this._ls = false;
        this._hc = false;
        this._ai = 0;
        this._p

    };

    // Tree object

    D.dTree = function(objName, checkbox, isImg, _json) {
        this.config = {
            target : null,
            folderLinks : true,
            useSelection : true,
            useCookies : true,
            useLines : true,
            useIcons : true,
            useStatusText : false,
            closeSameLevel : false,
            inOrder : false
        }
        if(_json) this._json = _json;
        this.icon = {
            root : 'http://img.china.alibaba.com/cms/upload/other/box/base.png',
            folder : 'http://img.china.alibaba.com/cms/upload/other/box/folder.png',
            folderOpen : 'http://img.china.alibaba.com/cms/upload/other/box/folderopen.png',
            node : 'http://img.china.alibaba.com/cms/upload/other/box/page.png',
            empty : 'http://img.china.alibaba.com/cms/upload/other/box/empty.png',
            line : 'http://img.china.alibaba.com/cms/upload/other/box/line.png',
            join : 'http://img.china.alibaba.com/cms/upload/other/box/join.png',
            joinBottom : 'http://img.china.alibaba.com/cms/upload/other/box/joinbottom.png',
            plus : 'http://img.china.alibaba.com/cms/upload/other/box/plus.png',
            plusBottom : 'http://img.china.alibaba.com/cms/upload/other/box/plusbottom.png',
            minus : 'http://img.china.alibaba.com/cms/upload/other/box/minus.png',
            minusBottom : 'http://img.china.alibaba.com/cms/upload/other/box/minusbottom.png',
            nlPlus : 'http://img.china.alibaba.com/cms/upload/other/box/nolines_plus.png',
            nlMinus : 'http://img.china.alibaba.com/cms/upload/other/box/nolines_minus.png'
        };
        if( typeof objName === 'object') {
            this.obj = objName.name;
            this.checkbox = objName.checkbox;
            //true 显示打开，关闭图片
            this.isImg = objName.isImg;
            if(objName.icon) {
                $.extend();
                this.icon = $.extend({}, this.icon, objName.icon);
            }
        } else {
            this.obj = objName;
            this.checkbox = checkbox;
            this.isImg = isImg;
        }

        this.aNodes = [];
        this.aIndent = [];
        this.root = new Node(-1);
        this.selectedNode = null;
        this.selectedFound = false;
        this.completed = false;
    };

    // Adds a new node to the node array

    D.dTree.prototype.add = function(id, pid, name, disabled, url, title, target, icon, iconOpen, open) {
        if( typeof id === 'object') {
            this.aNodes[this.aNodes.length] = new Node(id);
        } else {
            this.aNodes[this.aNodes.length] = new Node(id, pid, name, disabled, url, title, target, icon, iconOpen, open);
        }
    };

    // Open/close all nodes

    D.dTree.prototype.openAll = function() {
        this.oAll(true);
    };

    D.dTree.prototype.closeAll = function() {
        this.oAll(false);
    };

    // Outputs the tree to the page

    D.dTree.prototype.toString = function() {
        var str = '<div class="dtree">\n';
        if(document.getElementById) {
            if(this.config.useCookies)
                this.selectedNode = this.getSelected();
            str += this.addNode(this.root);
        } else
            str += 'Browser not supported.';
        str += '</div>';
        if(!this.selectedFound)
            this.selectedNode = null;
        this.completed = true;
        return str;
    };

    // Creates the tree structure

    D.dTree.prototype.addNode = function(pNode) {
        var str = '';
        var n = 0;
        if(this.config.inOrder)
            n = pNode._ai;
        for(n; n < this.aNodes.length; n++) {
            if(this.aNodes[n].pid == pNode.id) {
                var cn = this.aNodes[n];
                cn._p = pNode;
                cn._ai = n;
                this.setCS(cn);
                if(!cn.target && this.config.target)
                    cn.target = this.config.target;
                if(cn._hc && !cn._io && this.config.useCookies)
                    cn._io = this.isOpen(cn.id);
                if(!this.config.folderLinks && cn._hc)
                    cn.url = null;
                if(this.config.useSelection && cn.id == this.selectedNode && !this.selectedFound) {
                    cn._is = true;
                    this.selectedNode = n;
                    this.selectedFound = true;
                }
                str += this.node(cn, n);
                if(cn._ls)
                    break;
            }
        }
        return str;

    };

    // Creates the node icon, url and text

    D.dTree.prototype.node = function(node, nodeId) {
        // console.log(node);
        // console.log(nodeId);
        //console.log(333);
        var str = '<div class="dTreeNode">' + this.indent(node, nodeId);

        if(this.config.useIcons) {

            if(!node.icon)
                node.icon = (this.root.id == node.pid) ? this.icon.root : ((node._hc) ? this.icon.folder : this.icon.node);

            if(!node.iconOpen)
                node.iconOpen = (node._hc) ? this.icon.folderOpen : this.icon.node;

            if(this.root.id == node.pid) {

                node.icon = this.icon.root;

                node.iconOpen = this.icon.root;

            }
            if(this.checkbox && this.checkbox === 'all') {
                str += '<input data-seq="' + nodeId + '" data-name="' + node.name + '" data-code="' + node.id + '" data-parent="' + node.pid + '" type="checkbox" id="checkbox' + node.id + '" name="checkbox' + this.obj + '" class="checkbox"/>';
            }
            if(this.checkbox && this.checkbox === 'allcheck') {
                if(node.id !== 0) {
                    str += '<input data-seq="' + nodeId + '" data-name="' + node.name + '" data-code="' + node.id + '" data-parent="' + node.pid + '" type="checkbox" id="checkbox' + node.id + '" name="checkbox' + this.obj + '" class="checkbox"/>';
                }
            }
            if(this.checkbox && this.checkbox === 'child') {

                if(node.id !== 0) {
                    if(node.pid === 0 ) {
                        str += '<input data-seq="' + nodeId + '" disabled data-name="' + node.name + '" data-code="' + node.id + '" data-parent="' + node.pid + '" type="checkbox" id="checkbox' + node.id + '" name="checkbox' + this.obj + '" class="checkbox"/>';
                    } else {
                        var disabled = '';
                        if(node.disabled && (node.disabled === true || node.disabled === 'true')) {
                            disabled = 'disabled';
                        }
                        str += '<input data-seq="' + nodeId + '" ' + disabled + ' data-name="' + node.name + '" data-code="' + node.id + '" data-parent="' + node.pid + '" type="checkbox" id="checkbox' + node.id + '" name="checkbox' + this.obj + '" class="checkbox"/>';
                    }
                }
            }
            if(this.checkbox && this.checkbox === 'leaf') {
                if(!node._hc) {
                    str += '<input data-seq="' + nodeId + '" data-name="' + node.name + '" data-code="' + node.id + '" data-parent="' + node.pid + '" type="checkbox" id="checkbox' + node.id + '" name="checkbox' + this.obj + '" class="checkbox"/>';
                }
            }
            if(this.isImg) {
                str += '<img id="i' + this.obj + nodeId + '" src="' + ((node._io) ? node.iconOpen : node.icon) + '" alt="" />';
            } else {
                    str += '<span id="i' + this.obj + nodeId + '" src="' + ((node._io) ? node.iconOpen : node.icon) + '" ></span>';
          
            }

        }

        if(node.url) {
            str += '<a data-name="' + node.name + '" data-code="' + node.id + '" data-parent="' + node.pid + '" id="s' + this.obj + nodeId + '" class="elem ' + ((this.config.useSelection) ? ((node._is ? 'node' : 'node')) : 'node') + '" href="' + node.url + '"';
            if(node.title)
                str += ' title="' + node.title + '"';
            if(node.target)
                str += ' target="' + node.target + '"';
            if(this.config.useStatusText)
                str += ' onmouseover="window.status=\'' + node.name + '\';return true;" onmouseout="window.status=\'\';return true;" ';
            if(this.config.useSelection && ((node._hc && this.config.folderLinks) || !node._hc))
                str += ' onclick="javascript: ' + this.obj + '.s(' + nodeId + ');"';
            str += '>';

        } else if((!this.config.folderLinks || !node.url) && node._hc && node.pid != this.root.id) {
            str += '<a data-name="' + node.name + '" data-code="' + node.id + '" data-parent="' + node.pid + '" href="javascript: ' + this.obj + '.o(' + nodeId + ');" class="node elem">';
        }
        if(!node.url && !node._hc) {
            // if(node.url) {
            // str += '<a data-name="' + node.name + '" href="' + node.url + '" title="' + node.name + '" class="leaf elem" data-code="' + node.id + '" data-parent="' + node.pid + '">' + node.name + '</a>';
            //} else {
            str += '<a data-name="' + node.name + '" id="' + this.obj + node.id + '" title="' + node.name + '" class="leaf elem" data-code="' + node.id + '" data-parent="' + node.pid + '">' + node.name + '</a>';
            //}

        } else {
            str += node.name;
        }

        if(node.url || ((!this.config.folderLinks || !node.url) && node._hc))
            str += '</a>';
        str += '</div>';
        if(node._hc) {
            if ( this._json ) {
                str += '<div id="d' + this.obj + nodeId + this._json.hiddenId +'" class="clip" style="display:' + ((this.root.id == node.pid || node._io) ? 'block' : 'none') + ';">';            
            }else{
                 str += '<div id="d' + this.obj + nodeId +'" class="clip" style="display:' + ((this.root.id == node.pid || node._io) ? 'block' : 'none') + ';">';
            }
           
            str += this.addNode(node);
            str += '</div>';
        }
        this.aIndent.pop();
        return str;

    };

    // Adds the empty and line icons

    D.dTree.prototype.indent = function(node, nodeId) {
        var str = '';
        if(this.root.id != node.pid) {
                for(var n = 0; n < this.aIndent.length; n++) {

                    str += '<img src="' + ((this.aIndent[n] == 1 && this.config.useLines) ? this.icon.line : this.icon.empty ) + '" alt="" />';
                }
                (node._ls) ? this.aIndent.push(0) : this.aIndent.push(1);
                if(node._hc) {

                    str += '<a href="javascript: ' + this.obj + '.o(' + nodeId + ');"><img id="j' + this.obj + nodeId + '" src="';
                    if(!this.config.useLines) {
                        str += (node._io) ? this.icon.nlMinus : this.icon.nlPlus;
                    } else {
                        str += ((node._io) ? ((node._ls && this.config.useLines) ? this.icon.minusBottom : this.icon.minus) : ((node._ls && this.config.useLines) ? this.icon.plusBottom : this.icon.plus ) );
                    }
                    str += '" alt="" /></a>';

                } else {

                    str += '<img src="' + ((this.config.useLines) ? ((node._ls) ? this.icon.joinBottom : this.icon.join ) : this.icon.empty) + '" alt="" />';
                }
            
        }

        return str;

    };

    // Checks if a node has any children and if it is the last sibling

    D.dTree.prototype.setCS = function(node) {

        var lastId;

        for(var n = 0; n < this.aNodes.length; n++) {

            if(this.aNodes[n].pid == node.id) {
                node._hc = true;
            }

            if(this.aNodes[n].pid == node.pid) {
                lastId = this.aNodes[n].id;
            }

        }

        if(lastId == node.id) {
            node._ls = true;
        }

    };

    // Returns the selected node

    D.dTree.prototype.getSelected = function() {

        var sn = this.getCookie('cs' + this.obj);

        return (sn) ? sn : null;

    };

    // Highlights the selected node

    D.dTree.prototype.s = function(id) {

        if(!this.config.useSelection) {
            return;
        }

        var cn = this.aNodes[id];

        if(cn._hc && !this.config.folderLinks) {
            return;
        }

        if(this.selectedNode != id) {

            if(this.selectedNode || this.selectedNode == 0) {

                eOld = document.getElementById("s" + this.obj + this.selectedNode);

                eOld.className = "node";

            }

            eNew = document.getElementById("s" + this.obj + id);

            eNew.className = "nodeSel";

            this.selectedNode = id;

            if(this.config.useCookies) {
                this.setCookie('cs' + this.obj, cn.id);
            }

        }

    };

    // Toggle Open or close

    D.dTree.prototype.o = function(id) {
        var cn = this.aNodes[id];

        this.nodeStatus(!cn._io, id, cn._ls);

        cn._io = !cn._io;

        if(this.config.closeSameLevel) {
            this.closeLevel(cn);
        }

        if(this.config.useCookies) {
            this.updateCookie();
        }

    };

    // Open or close all nodes

    D.dTree.prototype.oAll = function(status) {

        for(var n = 0; n < this.aNodes.length; n++) {

            if(this.aNodes[n]._hc && this.aNodes[n].pid != this.root.id) {

                this.nodeStatus(status, n, this.aNodes[n]._ls)

                this.aNodes[n]._io = status;

            }

        }

        if(this.config.useCookies) {
            this.updateCookie();
        }

    };

    // Opens the tree to a specific node

    D.dTree.prototype.openTo = function(nId, bSelect, bFirst) {

        if(!bFirst) {

            for(var n = 0; n < this.aNodes.length; n++) {

                if(this.aNodes[n].id == nId) {

                    nId = n;

                    break;

                }

            }

        }

        var cn = this.aNodes[nId];

        if(cn.pid == this.root.id || !cn._p) {
            return;
        }

        cn._io = true;

        cn._is = bSelect;

        if(this.completed && cn._hc) {
            this.nodeStatus(true, cn._ai, cn._ls);
        }

        if(this.completed && bSelect) {
            this.s(cn._ai);
        } else if(bSelect) {
            this._sn = cn._ai;
        }

        this.openTo(cn._p._ai, false, true);

    };

    // Closes all nodes on the same level as certain node

    D.dTree.prototype.closeLevel = function(node) {

        for(var n = 0; n < this.aNodes.length; n++) {

            if(this.aNodes[n].pid == node.pid && this.aNodes[n].id != node.id && this.aNodes[n]._hc) {

                this.nodeStatus(false, n, this.aNodes[n]._ls);

                this.aNodes[n]._io = false;

                this.closeAllChildren(this.aNodes[n]);

            }

        }

    }
    // Closes all children of a node

    D.dTree.prototype.closeAllChildren = function(node) {

        for(var n = 0; n < this.aNodes.length; n++) {

            if(this.aNodes[n].pid == node.id && this.aNodes[n]._hc) {

                if(this.aNodes[n]._io) {
                    this.nodeStatus(false, n, this.aNodes[n]._ls);
                }

                this.aNodes[n]._io = false;

                this.closeAllChildren(this.aNodes[n]);

            }

        }

    }
    // Change the status of a node(open or closed)

    D.dTree.prototype.nodeStatus = function(status, id, bottom) {
        eDiv = this._json?document.getElementById('d' + this.obj + id + this._json['hiddenId']):document.getElementById('d' + this.obj + id)

        eJoin = document.getElementById('j' + this.obj + id);

        if(this.config.useIcons) {

            eIcon = document.getElementById('i' + this.obj + id);

            eIcon.src = (status) ? this.aNodes[id].iconOpen : this.aNodes[id].icon;

        }

        eJoin.src = (this.config.useLines) ? ((status) ? ((bottom) ? this.icon.minusBottom : this.icon.minus) : ((bottom) ? this.icon.plusBottom : this.icon.plus)) : ((status) ? this.icon.nlMinus : this.icon.nlPlus);

        eDiv.style.display = (status) ? 'block' : 'none';

    };

    // [Cookie] Clears a cookie

    D.dTree.prototype.clearCookie = function() {

        var now = new Date();

        var yesterday = new Date(now.getTime() - 1000 * 60 * 60 * 24);

        this.setCookie('co' + this.obj, 'cookieValue', yesterday);

        this.setCookie('cs' + this.obj, 'cookieValue', yesterday);

    };

    // [Cookie] Sets value in a cookie

    D.dTree.prototype.setCookie = function(cookieName, cookieValue, expires, path, domain, secure) {

        document.cookie = escape(cookieName) + '=' + escape(cookieValue) + ( expires ? '; expires=' + expires.toGMTString() : '') + ( path ? '; path=' + path : '') + ( domain ? '; domain=' + domain : '') + ( secure ? '; secure' : '');

    };

    // [Cookie] Gets a value from a cookie

    D.dTree.prototype.getCookie = function(cookieName) {

        var cookieValue = '';

        var posName = document.cookie.indexOf(escape(cookieName) + '=');

        if(posName != -1) {

            var posValue = posName + (escape(cookieName) + '=').length;

            var endPos = document.cookie.indexOf(';', posValue);

            if(endPos != -1) {
                cookieValue = unescape(document.cookie.substring(posValue, endPos));
            } else {
                cookieValue = unescape(document.cookie.substring(posValue));
            }

        }

        return (cookieValue);

    };

    // [Cookie] Returns ids of open nodes as a string

    D.dTree.prototype.updateCookie = function() {

        var str = '';

        for(var n = 0; n < this.aNodes.length; n++) {

            if(this.aNodes[n]._io && this.aNodes[n].pid != this.root.id) {

                if(str) {
                    str += '.';
                }

                str += this.aNodes[n].id;

            }

        }

        this.setCookie('co' + this.obj, str);

    };

    // [Cookie] Checks if a node id is in a cookie

    D.dTree.prototype.isOpen = function(id) {

        var aOpen = this.getCookie('co' + this.obj).split('.');

        for(var n = 0; n < aOpen.length; n++) {
            if(aOpen[n] == id) {
                return true;
            }
        }

        return false;

    };

    // If Push and pop is not implemented by the browser

    if(!Array.prototype.push) {

        Array.prototype.push = function array_push() {

            for(var i = 0; i < arguments.length; i++) {
                this[this.length] = arguments[i];
            }

            return this.length;

        }
    };

    if(!Array.prototype.pop) {

        Array.prototype.pop = function array_pop() {

            lastElement = this[this.length - 1];

            this.length = Math.max(this.length - 1, 0);

            return lastElement;

        }
    };
    $.fn.extend({
        ajaxTree : function(ajaxUrl, json) {
            var elem = this, self = $(this);
            if(!self || self.length === 0) {
                return;
            }
            var selfParent = self.parent(), _json = {
                'rootName' : '根节点',
                'rootId' : '0',
                'hiddenId' : 'dtree_hidden_Id',
                'boxType' : 'checkbox',
                'cache' : true,
                'para': '',
                'onleychecked': 'false',
                'allCanChecked': 'false'
            }, _hiddenObj;
           if(json) {
                for(var name in json) {
                    if(name) {
                        _json[name] = json[name];
                    }
                }
            }
           var treeArea = $('<div id="mmTree" class="mmTree"><div class="head"><a class="close-btn">X</a><span class="label">请选择</span></div><div class="tree-body tree-body-'+_json['hiddenId']+'"></div><div class="foot"><button class="cancel-btn">确定</button></div></div>');
           
            //console.log('asdfasdfsa');

            //selfParent.css('position', 'relative');
            _hiddenObj = $('#' + _json.hiddenId);
            var cacheObj = {};
            // self.bind('click', function(e) {
            self.on('click', function(e) {
                if ( _json.para && !$('#siteId').val() ) {
                    return false
                };
                //除了自己以外其他的 弹出框都应该关闭
                $(document).find('.mmTree').hide()
                if(_json['width']) {
                    treeArea.css('width', _json['width']);
                } else {
                    treeArea.css('width', self.css('width'));
                }
                treeArea.offset({
                    'top' : self.offset().top + self.css('height'),
                    'left' : self.offset().left
                });
                //每次点击生成新的URL
                self.paramTag = "paramTag";
                if(_json.para){
                    var param ='';
                    for ( a in _json.para) {
                        param += ('&' + a + '=' + $('#'+_json.para[a]).val());
                        self.paramTag += $('#'+_json.para[a]).val();
                    }
                    var newAjaxUrl = ajaxUrl + param;
                    
                }else{
                    var newAjaxUrl = ajaxUrl;
                }
                //每组参数要给予他们一个特定的标识
                // if(!self.data('cache')) {
                if(!checkCache(cacheObj,self.paramTag)) {

                    $.post(newAjaxUrl, _json.data, function(value) {
                        //console.log(value);
                        var _data;
                        if(value && (value.status === 'success' || value.status === '200')) {
                            _data = value.data;
                            if(_data) {
                                reflashHtml(_data,_json);
                                // if(_json.cache) {
                                //     self.data('cache', 'true');
                                // }
                                //新数据存储
                                if(_json.cache) {
                                    cacheObj[self.paramTag] = _data;
                                }
                            }
                        }
                    }, 'jsonp');
                } else {
                    //将缓存数据刷新到页面上
                    reflashHtml(cacheObj[self.paramTag],_json);
                    treeArea.show();
                    initData.call(this);
                    return;
                }
                /*
                 *reflash html
                 *
                 */
                 function reflashHtml(_data,_json) {
                    if( _json.allCanChecked == true) {
                        mmTree = new D.dTree('mmTree', 'allcheck','',_json);
                    }else {
                        mmTree = new D.dTree('mmTree', 'child','',_json);
                    }
                    
                    mmTree.add(_json.rootId, -1, _json.rootName);
                    var isObj = true, obj;
                    if(_data.length) {
                        isObj = false;
                    }

                    if(isObj) {
                        
                        for(var _key in _data) {
                            obj = _data[_key];
                            mmTree.add({
                                'id' : obj.id,
                                'pid' : obj.parentId,
                                'name' : obj.name,
                                'disabled' : obj.disabled
                            });
                        };
                    } else {
                        for(var i = 0, len = _data.length; i < len; i++) {
                            obj = _data[i];
                            mmTree.add({
                                'id' : obj.id,
                                'pid' : obj.parentId,
                                'name' : obj.name,
                                'disabled' : obj.disabled
                            });
                        };
                    }

                    $('div.tree-body', treeArea).html(mmTree.toString());
                    treeArea.appendTo(selfParent);
                    //mmTree.openAll();
                    treeArea.show();                    
                 }
                /*
                *   cache
                */
                function checkCache(cacheObj,param) { 
                    return cacheObj.hasOwnProperty(param)
                }
                /**
                 * init data
                 */
                function initData() {
                    $('input[type=checkbox]', 'div.dtree').each(function(index, obj) {
                        obj.checked = false;
                    });
                    $('input[type=checkbox]', 'div.dtree').each(function(index, obj) {
                        var _self = $(obj), _hiddenId = _hiddenObj.val(), _hiddenIds = [];
                        // 多选
                        if(_json.boxType && _json.boxType === 'checkbox') {
                            _hiddenIds = _hiddenId.split(',');
                        } else {//单选
                            _hiddenIds.push(_hiddenId);
                        }
                        $.each(_hiddenIds, function(index, obj) {
                            if(_self.data('code') === parseInt(obj)) {
                                (function(target) {
                                    var checkbox;
                                    if(target && target.length > 0 && target.hasClass('dTreeNode')) {
                                        checkbox = $('input[type=checkbox]', target);
                                        if(checkbox[0]) {
                                            //console.log(checkbox);
                                            checkbox[0].checked = true;

                                        }
                                    }
                                    if(target.parent().hasClass('dtree')) {
                                        return;
                                    }
                                    return arguments.callee(target.parent().prev());
                                })(_self.parent());

                            }
                        });

                    });
                };

                /**
                 * init bind event
                 */
                (function() {
                    initData();

                    $('a.close-btn,button.cancel-btn', 'div.mmTree').live('click', function(e) {
                        e.preventDefault();
                        //treeArea.hide();
                        $(this).closest('.mmTree').hide();
                    });
                    // console.log($('div.tree-body-'+_json['hiddenId']));
                    //$('input[type=checkbox]', 'div.dtree').live('click', function(e) {
                    // $(document).on('click','div.tree-body-'+_json['hiddenId']+' input[type=checkbox]',function(e){
                    $('input[type=checkbox]', 'div.tree-body-'+_json['hiddenId']).die('click.myevent').live('click.myevent', function(e) {
                        var _self = $(this), chk = _self[0].checked, arr, selfParent = _self.parent(), chkCatalog;
                        var $cName = self, $cId = _hiddenObj;
                        if(chk) {
                            arr = findParentAndCheckedCatalog(selfParent);
                            if(arr) {
                                chkCatalog = formatCatalog(arr);
                                (function() {
                                    var valId = $cId.val();

                                    if(valId) {
                                        $cId.val(valId + ',' + chkCatalog.id);
                                    } else {
                                        $cId.val(chkCatalog.id);
                                    }
                                    valName = $cName.val();
                                    if(valName) {
                                        $cName.val(valName + ',' + chkCatalog.name);
                                    } else {
                                        $cName.val(chkCatalog.name);
                                    }

                                    if(_json.onleychecked == true) {
                                        $cId.val(chkCatalog.id);
                                        $cName.val(chkCatalog.name);
                                        $('a.close-btn,button.cancel-btn', 'div.mmTree').trigger('click')
                                    }
                                })();
                            }
                        } else {
                            arr = findParentAndUnCheckedCatalog(selfParent);
                            if(arr) {
                                chkCatalog = formatCatalog(arr);
                                unCheckedCatalog(chkCatalog);
                                var chkId = chkCatalog.id, valId = $cId.val();

                                var _oInputs = $('input[type=checkbox]', $('#checkbox' + chkId).parent().next('.clip'));
                                //console.log(_oInputs);
                                _oInputs.each(function(index, obj) {
                                    var cArray = findParentCatalog($(obj).parent());
                                    chkCatalog = formatCatalog(cArray);
                                    unCheckedCatalog(chkCatalog);
                                });
                            }
                        }
                    });

                    var unCheckedCatalog = function(chkCatalog) {
                        var $cName = self, $cId = _hiddenObj, valId = $cId.val(), id = chkCatalog.id;
                        if(valId) {
                            var n = valId.indexOf(id), idLen = valId.split(',').length;
                            if(n === 0) {
                                if(idLen === 1) {
                                    $cId.val(valId.replace(id, ''));
                                } else {
                                    $cId.val(valId.replace(id + ',', ''));
                                }
                            } else {
                                $cId.val(valId.replace(',' + id, ''));
                            }
                        }
                        valId = $cId.val();
                        var chkValIds = valId.split(',');
                        if(valId && chkValIds) {
                            for(var p = 0; p < chkValIds.length; p++) {
                                var catalogs = formatCatalog(findParentCatalog($('#checkbox' + chkValIds[p]).parent()));

                                var valName;
                                if(valName) {
                                    $cName.val(valName + ',' + catalogs.name);
                                } else {
                                    $cName.val(catalogs.name);
                                }
                                valName = $cName.val();
                            }

                        } else {
                            $cName.val('');
                        }

                    };
                    var formatCatalog = function(arr) {
                        var len = arr.length - 1, showName = '', hideId = '', id;
                        for(var i = len; i >= 0; i--) {
                            if(i == 0) {
                                //hideId += arr[i].id;
                                showName += arr[i].name;
                                id = arr[i].id;
                            } else {
                                // hideId += arr[i].id + ">";
                                showName += arr[i].name + ">";
                            }

                        }
                        return {
                            id : id,
                            name : showName
                        };
                    };

                    /**
                     * 获得选中元素的所有parent节点 并选中所有parent节点
                     * @param {Object} target
                     * @param {Object} arr
                     */
                    var findParentAndCheckedCatalog = function(target, arr) {
                        var arr = arr || [], name, id, checkbox;
                        if(target && target.length > 0 && target.hasClass('dTreeNode')) {
                            var oA = $('a.elem', target);
                            name = oA.data('name');
                            id = oA.data('code');
                            checkbox = $('.checkbox', target);
                            if(name) {
                                if(checkbox[0]) {
                                    checkbox[0].checked = true;
                                }
                                arr.push({
                                    'name' : name,
                                    'id' : id
                                });
                            }

                        }
                        if(target.parent().hasClass('dtree')) {
                            return arr;
                        }
                        return arguments.callee(target.parent().prev(), arr);
                    };
                    /**
                     * 获得选中元素的所有parent节点
                     * @param {Object} target
                     * @param {Object} arr
                     */
                    var findParentCatalog = function(target, arr) {
                        var arr = arr || [], name, id, checkbox;
                        if(target && target.length > 0 && target.hasClass('dTreeNode')) {
                            var oA = $('a.elem', target);
                            name = oA.data('name');
                            id = oA.data('code');
                            if(name) {
                                arr.push({
                                    'name' : name,
                                    'id' : id
                                });
                            }

                        }
                        if(target.parent().hasClass('dtree')) {
                            return arr;
                        }
                        return arguments.callee(target.parent().prev(), arr);
                    };
                    /**
                     * 获得选中元素的所有parent节点，并去除勾选
                     * @param {Object} target
                     * @param {Object} arr
                     */
                    var findParentAndUnCheckedCatalog = function(target, arr) {
                        var arr = arr || [], name, id, _target, _next;

                        if(target && target.length > 0 && target.hasClass('dTreeNode')) {
                            var oClip = target.parent(), oChecked, oA = $('a.elem', target);

                            name = oA.data('name');
                            id = oA.data('code');
                            if(name) {
                                arr.push({
                                    'name' : name,
                                    'id' : id
                                });
                            }
                            _next = target.next('.clip');

                            if(_next && _next.length > 0) {
                                $('input[type=checkbox]', _next).each(function(index, obj) {
                                    obj.checked = false;
                                });
                            }
                            oChecked = $('input:checked', oClip);
                            if(oChecked.length > 0) {
                                return arr;
                            } else {
                                _target = target.parent().prev();
                                if(_target && _target.length > 0) {
                                    var _checked = $('input[type=checkbox]', _target);
                                    var $valId = _hiddenObj, _valId = $valId.val(), _code = _checked.data('code'), bln = true;
                                    if(_valId) {
                                        var temp = _valId.split(',');
                                        //console.log(temp);
                                        var index = temp.indexOf(_code + '');
                                        //console.log(index);
                                        if(index !== -1) {
                                            bln = false;
                                        }
                                    }
                                    if(bln && _checked && _checked.length > 0) {
                                        _checked[0].checked = false;
                                    }

                                }

                            }
                            if(target.parent().hasClass('dtree')) {
                                return arr;
                            }
                            return arguments.callee(_target, arr);
                        }

                        return arr;
                    };

                })();
            });
        }
    });
})(dcms, FE.dcms);
