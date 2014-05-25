/**
 * Created by IntelliJ IDEA.
 * User: zhangfan
 * Date: 11-8-15
 * To change this template use File | Settings | File Templates.
 */
(function( $, D, window ){

var
    LIST_PERFIX = 'dcms-tree-list-',
    WRP_CLS = 'dcms-tree-wrapper',
	NAME_CLS = 'dcms-tree-name',
	TREE_HIDE_CLS = 'dcms-tree-open',
    EMPTY = function(){},

    template = D.template,
    newClass = D.newClass,
    WidgetBase = D.WidgetBase;

/**
 * 数据操作类
 */
var DataOpearator = newClass({
    attrs : {
        url : {
            value : D.domain + '/position/catalogTree.html'
        },
        data : {
            value : null
        },
        checked : {
            value : false
        }
    },
    events : {
        loadData : EMPTY
    },
    initialize : function(){

/*        {
            '11': {id :11 ,parentId :0,name:'a1'},
            '12': {id :12 ,parentId :0,name:'a2'},
            '33': {id :33, parentId :11,name:'a3'},
            '43': {id :43, parentId :11,name:'a4'},
            '331': {id :331, parentId :33,name:'a5'},
            '332': {id :332, parentId :33,name:'a6'},
            '432': {id :432, parentId :43,name:'a7'}
        };*/

    },
	/**
	 * 获取数据
	 * @param {String} id 节点ID
	 * @param {Function} callback 回调函数
	 * @return void
	 */
    getData : function(id, callback){
        var  self = this;

        if( this.get('data') ){
            if(this.get('checked')){
                callback( this.formatData(this.get('data')) );

            }else{
                callback( this.get('data') );
            }
            this.fireEvent('loadData',this.get('data'));
            return
        }
        $.ajax({
            url: this.get('url'),
            dataType : 'jsonp',
            success: function(msg) {

                if(msg.status == 200){
                    self.set('data',self.formatData(msg.data));
                    self.fireEvent('loadData',self.get('data'));
                    callback(self.get('data'));
                }
            }
        });

    },
	/**
	 * 格式化数据
	 * @param {Json} data 需要格式化的数据
	 * @return void
	 */
    formatData : function(data) {
        var self = this;

        if( this.get('checked') && this.get('checked').length>0){

            $.each(data, function(k, v) {
                if( $.inArray(v.id+'',self.get('checked'))!== -1 ){

                    v.checked = true;
                }else{
                    v.checked = false;
                }
            });
        }else{
            $.each(data, function(k, v) {
                v.checked = false;
            });
        }
        return data;
    },
	/**
	 * 刷新数据
	 * @param {String} id 节点ID
	 * @param {Function} callback 回调函数
	 * @return void
	 */
    refreshData : function( id, callback ){
        this.set('data',null);
        this.getData( id , callback );
    },
    /**
     * 删除节点
     * @param {String} id 节点ID
     * @param {Function} callback 回调函数
     * @return void
     */
    remove : function(  id , callback ){

		//callback( this.get('data'));

    },
    /**
     * 添加节点
	 * @param {String} id 节点ID
	 * @param {Function} callback 回调函数
     * @return {Boolean} void
     */
    add : function( id , callback){
		//Scallback( this.get('data'));
    },
    /**
     * 获取节点信息
	 * @param {String} id 节点ID
     * @return {Object} 节点信息对象
     */
    getNodeInfo : function(id){
        return this.get('data') && this.get('data')[id];
    },
    /**
     * 获取节点路径
     * @param {String} id 节点ID
     * @param {String,可选} root 追溯到的根节点
     * @return {Array} 返回满足条件的节点信息集合
     */
    getPath : function(id,root){
        var arr = [],
            obj = this.getNodeInfo(id);
        if(root===undefined) root = 0;
        arr.push(obj);
        while(obj && obj.parentId != root){
            obj = this.getNodeInfo(obj.parentId);
            arr.push(obj);
        }
        return arr;
    },
    getCheckedExpandNodes:function(){
        var i = 0,
            checked = this.get('checked'),
            l = checked.length,
            ret = [];

        for(;i<l;i++){
            $.each(this.getPath(checked[i],0),function(i,v){
                if(v)ret.push(v);
            });
        }

        return ret;
    }

});

var treeTemplate = {

    'normal' : template.stringFn(
        '<dl class="dcms-tree-wrapper" class="dcms-tree-wrapper-{%= id %}">',
            '<dt class="dcms-tree-name"><span class="i-treebtn"></span>{%= name %}</dt>',
            '<dd class="dcms-tree-list dcms-tree-list-{%= id %}" ></dd>',
        '</dl>'),

    'hover' : template.stringFn(
        '<dl class="dcms-tree-wrapper" class="dcms-tree-wrapper-{%= id %}">',
        '{% if(disabled){ %}',
            '<dt class="dcms-tree-name"><span class="i-treebtn"></span>{%= name %}<span class="dcms-tree-fn"></dt>',
        '{% } else{ %}',
            '<dt class="dcms-tree-name"><span class="i-treebtn"></span>{%= name %}<span class="dcms-tree-fn"><button class="btn-template-choose modify">修改</button><button class="btn-template-choose remove">删除</button></span></dt>',
        '{%}%}',
            '<dd class="dcms-tree-list dcms-tree-list-{%= id %}" ></dd>',
        '</dl>'),

    'checkbox' : template.stringFn(
        '<dl class="dcms-tree-wrapper" class="dcms-tree-wrapper-{%= id %}">',
            '{% if(checked){ %}',
                '<dt class="dcms-tree-name"><input type="checkbox" autocomplete="off" checked="checked" /> {%= name %}</dt>',
            '{% }else{ %}',
                '<dt class="dcms-tree-name"><input autocomplete="off" type="checkbox" /> {%= name %}</dt>',
            '{% } %}',
            '<dd class="dcms-tree-list dcms-tree-list-{%= id %}" ></dd>',
        '</dl>'),
    'limited' : template.stringFn(
        '<dl class="dcms-tree-wrapper" class="dcms-tree-wrapper-{%= id %}">',
            '{% if(checked && disabled){ %}',
                '<dt class="dcms-tree-name">',
                    '<input type="checkbox" autocomplete="off" disabled="disabled" checked="checked" />',
                    '{%= name %}</dt>',
            '{% }else if(checked){ %}',
                '<dt class="dcms-tree-name">',
                    '<input type="checkbox" autocomplete="off"  checked="checked" />',
                    '{%= name %}</dt>',
            '{% }else if(disabled){ %}',
                '<dt class="dcms-tree-name"><input autocomplete="off" type="checkbox" disabled="disabled"  /> {%= name %}</dt>',
            '{% }else{ %}',
                '<dt class="dcms-tree-name"><input autocomplete="off" type="checkbox" /> {%= name %}</dt>',
            '{% } %}',
                '<dd class="dcms-tree-list dcms-tree-list-{%= id %}" ></dd>',
        '</dl>')



};

var Tree = newClass( WidgetBase,{
	attrs :{
		template : {
			value : treeTemplate.normal
		},
		render  : {
			valueFn : function(){
				return null;
			}
		},
		autoRender : {
			value : false
		}
	},
    events : {
        ui_selected : EMPTY,
        ui_modify : EMPTY,
        ui_remove : EMPTY,
        ui_checked : EMPTY
    },
	mixin : [
		DataOpearator
	],
	initialize : function(){

	},
    /**
     * 创建树
     * @param {Object} data  创建树的json
     * @param {String | Boolean} id 节点id
     * @param {Element ,可选} el 渲染到的元素，默认渲染到render
     * @param {Boolean|Array ,可选} open 是否展开全部节点( 递归渲染所有后代节点 ) 如果为数组则展开到数组中所有ID的
     * @return void
     */
	createTree : function( data, id, el, open){
        var self = this,
			tp = [],
            render = this.get('render'),
			setTree = function(id,el){
                el.html('');
			    $.each(data, function(index,item){
                    if(id !== false){
                        if( item.parentId == id )	{
                            el.append( $(self.get('template')(item)).data( 'info', item ) );
                            if( open ){
                                if(typeof open === "boolean"){
                                    setTree(index, $( '.' + LIST_PERFIX + index, render ));
                                }else{
                                   $.each(open,function(i,v){
                                        if(item.id===v.id){
                                            setTree(index, $( '.' + LIST_PERFIX + index, render ));
                                        }
                                    });
                                }
                            }
                        }
                    }else{
                        el.append( $(self.get('template')(item)).data( 'info', item ) );
                    }
                });
			};
		el = el? el : $('.'+LIST_PERFIX+id,render);

		setTree(id ,el);

	},
    /**
     * 渲染树
     * @param {String,可选} id 节点id
     * @param {Element,可选} el 渲染到的元素，默认渲染到render
     * @return void
     */
	renderTree : function(id ,el,open){
        if(id === undefined){
            id = 0;
            if(el === undefined)el = this.get('render');
        }
		var self = this;
		this.getData( id, function( data ){
			self.createTree( data, id, el, open );

		});
	},
    renderExpandChecked : function(id ,el){
        if(id === undefined){
            id = 0;
            if(el === undefined)el = this.get('render');
        }
		var self = this;
		this.getData( id, function( data ){
			self.createTree( data, id, el, self.getCheckedExpandNodes());
		});
    },
    /**
     * 刷新树
     * @return void
     */
    refreshTree : function(){

        var self = this;
        this.refreshData(0 ,function(data){
            self.createTree( data, 0, self.get('render') );
        });
    },
    /**
     * 添加子节点
     * @param {String} id 节点id
     * @return void
     */
	appendChild : function(id){
		this.add ( id, function( data ){
			$('.'+LIST_PERFIX +id ,this.get('render')).append(this.get('template'),data);
		});
	},
    /**
     * 删除子节点
     * @param {String} id 节点id
     * @return void
     */
	removeChildren : function( id ){
		this.remove ( id, function( data ){
			$('.'+LIST_PERFIX + id  ,this.get('render')).remove();
		});

	},
    /**
     * 添加节点
     * @param {String} id 节点id
     * @return void
     */
	addNode : function( id ){
		this.add( id ,function( data ){
			this.createTree( data, data.id );
		});
	},
    /**
     * 清除所有子节点
     * @param {String} id 节点id
     * @return void
     */
	clearChild : function(id){
		$('.'+LIST_PERFIX + id ,this.get('render')).html('');
	},
    /**
     * 查找匹配的节点
     * @param {String} value 需要查找的关键字
     * @return {Array} 匹配的节点集合
     */
    search : function(value){
        var data = this.get('data'),
            p = new RegExp(value),
            ret = {};

        $.each(data,function(k,v){
            if(p.test(v.name)){
                ret[k] = v;
            }
        });
        return ret;
    },
	renderUI :function(){
		this.renderTree( 0 ,this.get('render'))
	},
	bindUI : function(){
		var self = this,
			render = this.get('render');
        
		$('.'+NAME_CLS , render).live('click',function(e){
            if(e.target.tagName !== 'BUTTON' && e.target.tagName !== 'INPUT' ){
				var el = $(this),
					id = el.parent().data('info').id;
				if( el.hasClass( TREE_HIDE_CLS ) ){
					self.clearChild(id);
					el.removeClass( TREE_HIDE_CLS );
				}else{
					self.renderTree(id);
					el.addClass( TREE_HIDE_CLS );
				}
                self.fireEvent('ui_selected',[self.getNodeInfo(id),el]);
			}
		});
        $('input[type="checkbox"]' ,render).live('click',function(){
            var el = $(this),
                info = el.parents('.'+WRP_CLS).data('info');
            self.fireEvent('ui_checked',[info,el]);
        });
        
        $('.modify' , render).live('click',function(e){
            e.preventDefault();
            var el = $(this),
                info = el.parents('.'+WRP_CLS).data('info');
            
            self.fireEvent('ui_modify',[info,el]);
        });
        
        $('.remove' , render).live('click',function(e){
            e.preventDefault();
            var el = $(this),
                info = el.parents('.'+WRP_CLS).data('info');
            self.fireEvent('ui_remove',[info,el]);
        });
	}
});




D.Tree = Tree;
D.treeTemplate = treeTemplate;


})( jQuery, FE.dcms, window );


