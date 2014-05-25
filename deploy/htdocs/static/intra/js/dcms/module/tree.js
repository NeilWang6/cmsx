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
 * ���ݲ�����
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
	 * ��ȡ����
	 * @param {String} id �ڵ�ID
	 * @param {Function} callback �ص�����
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
	 * ��ʽ������
	 * @param {Json} data ��Ҫ��ʽ��������
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
	 * ˢ������
	 * @param {String} id �ڵ�ID
	 * @param {Function} callback �ص�����
	 * @return void
	 */
    refreshData : function( id, callback ){
        this.set('data',null);
        this.getData( id , callback );
    },
    /**
     * ɾ���ڵ�
     * @param {String} id �ڵ�ID
     * @param {Function} callback �ص�����
     * @return void
     */
    remove : function(  id , callback ){

		//callback( this.get('data'));

    },
    /**
     * ��ӽڵ�
	 * @param {String} id �ڵ�ID
	 * @param {Function} callback �ص�����
     * @return {Boolean} void
     */
    add : function( id , callback){
		//Scallback( this.get('data'));
    },
    /**
     * ��ȡ�ڵ���Ϣ
	 * @param {String} id �ڵ�ID
     * @return {Object} �ڵ���Ϣ����
     */
    getNodeInfo : function(id){
        return this.get('data') && this.get('data')[id];
    },
    /**
     * ��ȡ�ڵ�·��
     * @param {String} id �ڵ�ID
     * @param {String,��ѡ} root ׷�ݵ��ĸ��ڵ�
     * @return {Array} �������������Ľڵ���Ϣ����
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
            '<dt class="dcms-tree-name"><span class="i-treebtn"></span>{%= name %}<span class="dcms-tree-fn"><button class="btn-template-choose modify">�޸�</button><button class="btn-template-choose remove">ɾ��</button></span></dt>',
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
     * ������
     * @param {Object} data  ��������json
     * @param {String | Boolean} id �ڵ�id
     * @param {Element ,��ѡ} el ��Ⱦ����Ԫ�أ�Ĭ����Ⱦ��render
     * @param {Boolean|Array ,��ѡ} open �Ƿ�չ��ȫ���ڵ�( �ݹ���Ⱦ���к���ڵ� ) ���Ϊ������չ��������������ID��
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
     * ��Ⱦ��
     * @param {String,��ѡ} id �ڵ�id
     * @param {Element,��ѡ} el ��Ⱦ����Ԫ�أ�Ĭ����Ⱦ��render
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
     * ˢ����
     * @return void
     */
    refreshTree : function(){

        var self = this;
        this.refreshData(0 ,function(data){
            self.createTree( data, 0, self.get('render') );
        });
    },
    /**
     * ����ӽڵ�
     * @param {String} id �ڵ�id
     * @return void
     */
	appendChild : function(id){
		this.add ( id, function( data ){
			$('.'+LIST_PERFIX +id ,this.get('render')).append(this.get('template'),data);
		});
	},
    /**
     * ɾ���ӽڵ�
     * @param {String} id �ڵ�id
     * @return void
     */
	removeChildren : function( id ){
		this.remove ( id, function( data ){
			$('.'+LIST_PERFIX + id  ,this.get('render')).remove();
		});

	},
    /**
     * ��ӽڵ�
     * @param {String} id �ڵ�id
     * @return void
     */
	addNode : function( id ){
		this.add( id ,function( data ){
			this.createTree( data, data.id );
		});
	},
    /**
     * ��������ӽڵ�
     * @param {String} id �ڵ�id
     * @return void
     */
	clearChild : function(id){
		$('.'+LIST_PERFIX + id ,this.get('render')).html('');
	},
    /**
     * ����ƥ��Ľڵ�
     * @param {String} value ��Ҫ���ҵĹؼ���
     * @return {Array} ƥ��Ľڵ㼯��
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


