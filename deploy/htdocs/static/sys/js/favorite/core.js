/**
 * @file add to favorite (offer | company)
 * @author xianxia.jianxx
 * @date 2013-08-29
 * @example
 *  1、<a href="#" title="" data-widget-addfavorite='{"contentType":"COMPANY","contentId":"11111"....}'></a>
 *  2、new Favorite({
 *          purchaseServer : 'http://purchase-test.1688.com:2100'
 *          contentType : 'COMPANY',
 *          contentId : '11111'
 *      });
 *
 *@logic
 *  1、登录
 *      · 收藏成功
 *      · 收藏异常
 *      · 已经收藏过
 *      · 收藏夹已满 
 *
 *  2、未登录
 *      · 登录，后进行登录成功逻辑
 * 
 *@doc
 *  http://docs.alibaba-inc.com/pages/viewpage.action?pageId=80055973
 *
 */
define('sys/favorite/core',[ 'jquery', 'require' ], function ( $, require ){

   　"use strict"; 

        //执行action  uri
    var ACTIONURI = '/favorites/json/add_to_favorites.json',
        //管理收藏夹uri
        MANAGEURI = '/favorites/work_favorites.htm',
        //打点前缀
        TRACELOGPREV = '_addfavorite_action_',

        template = {}, util = getUtil(), Dialog, artTemplate,

        logistJsSource = 'sys/logist/logist-min',

        logistCssSource = 'sys/logist/logist-min.css',

        aliclickJsSource = 'sys/trace/aliclick-min',

        //dialog id
        fDialogId = 'mod-dialog-addfavorite',

        //依赖
        depences = ['sys/favorite/core.css',
        
                    'lofty/ui/dialog/1.0/back/dialog-min.css',

                    'lofty/ui/button/1.0/back/button-min.css',

                    'fui/dialog/1.0',
                   
                    'util/template/1.0'],

        //默认配置
        defaultConfig = {
        
            valve : true,//默认开关打开

            purchaseServer : getPurchaseServer(),//加入收藏夹的server

            rType : 'jsonp',//扩展 不建议使用

            resourceApp : '',//用于tracelog统计来自不同的应用 

            isDialogShow : true,//action之后是否展示浮出层

            onCallback : $.noop,//回调函数，只针对success

            batchData : null //为后面批量扩展用，暂不开放

        },
       
        //dialog组件默认config
        dialogConfig = {
                
            isModal : true,

            timers : 500,

            dragAble : true,

            dragSelector : '.d-header',

            buttons : [{
            
                event : 'click',

                selector : '.d-close',

                callback : function (){
                
                    this.hide();

                }
            }]
        };

    var Favorite = function ( config ){

        this.config = $.extend( {}, defaultConfig, config );

        this.init(this.config);
        
    };

    //Favorite.prototype.constructor = Favorite;
        
    Favorite.prototype = {
 
        /**
         * @file 初始化 先加载依赖
         *  1、未登陆的情况浮出层登陆刷新
         *  2、登陆情况执行 
         * @param config {object}
         */
        init : function ( config ){

            var self = this;

            this.config = config;

            //展示浮出层时，不加载依赖
            require.use( self.config.isDialogShow ? depences : [], function( favCss, dialogCss, btnCss, dialog, tmp ){

                if( !Dialog ){

                    Dialog = dialog;

                }

                if( !artTemplate ){ 
                    
                    artTemplate = tmp;

                }

                self._init( config );

            } );

        },

        /**
         * 初始化
         */
        _init : function ( config ){

            var self = this;

            if( util.isLogin() ){

                lofty.log('[addFavorite] user is logined');

                self.action( self.config.purchaseServer + ACTIONURI, self.config );

            } else {

                lofty.log('[addFavorite] user is unlogined');
            
                util.login( function (){
                
                    self.action( self.config.purchaseServer + ACTIONURI, self.config );
                
                } );

            }

            self.tracelog('action');
      
        },
         /**
         * @file 初始化事件
         *  1、继续浏览 关闭浮出层
         */
        initEvt : function (){

            var self = this,
       
                evtName = 'click.scanClose',
        
                delegator =  $('#' + fDialogId);
                  
            if( delegator.data('events') && delegator.data('events')[ evtName ] ){

                return;
            }

            delegator.on( evtName, 'a[data-action=close]', function ( e ){
            
                e.preventDefault();

                self.close();

            });

        },

         /**
         * @file 执行操作
         * @param url {string} 执行操作的serverurl
         * @param config {object} 执行操作的config
         */
        action : function ( url, config ){

            var self = this;

            var params = self.getRequestParams( config ),
        
                type = config.contentType;

            $.ajax({
            
                url : url,

                dataType : config.rType,

                data : params,

                cache : false,
                
                success : $.proxy( self.success, self ),

                error : $.proxy( self.error, self )

            });
        
        },

        /**
         * @file 请求成功
         *  打开浮出层
         *  成功打点
         * @param o {object} 成功返回的参数
         */
        success : function ( o ){

          //o = {"result":{"memberCnt":55940,"state":"0","msg":"恭喜您，收藏成功！","success":true,"totalCnt":1}} 
            var result = o.result;

            this.config.isDialogShow && this.open({ 
                
                status : result.state ,

                type : this.config.contentType,

                cls : '',
                
                memberCnt : result.memberCnt,
               
                totalCnt : result.totalCnt
           
            }); 

            if( $.isFunction( this.config.onCallback ) ){

                this.config.onCallback( o, this.config );

            }

            this.tracelog( 'success' );

        },

        /**
         * @file 请求出错
         * @param
         */
        error : function ( status ){

            if( $.isFunction( this.config.onCallback ) ){

                this.config.onCallback( { status : status || -1, type : this.config.contentType }, this.config );

            }

            //系统异常
            this.config.isDialogShow && this.open( { status : status || -1 , type : this.config.contentType, cls : '' }); 

            this.tracelog('error');
       
        },

        /**
         * 请求params
         * desc : 接口原因，为了以后做扩展成批量加入而定
         */
        getRequestParams : function ( config ){

            var batch = config.batchData,
           
                tmp = {};

            if( !batch ){

               tmp = param( config );

               return tmp;

            }

           tmp = [];
            
           $.each( batch, function ( index, obj ){
           
                tmp.push( param(batch[index] ) ); 

           }); 

           function param( config ){

                var item = {};

                if( !config ){

                    return item;

                }

                if( config.contentType ){ 
                    
                    item.content_type = config.contentType;

                }

                if( config.contentId ){ 
                    
                    item.content_id = config.contentId;

                }

                if( config.sellerMemberId ){ 
                    
                    item.seller_member_id = config.sellerMemberId;

                }

                return item;

           }

           return tmp; 

        },

        /**
         * @file 打开dialog
         *  展示浮出层的数据内容，渲染浮出层html
         * @param data {object} 打开浮出层的config
         */
        open : function ( data ){

            data.type = template.type[ data.type ];

            data.manageUrl = this.config.purchaseServer + MANAGEURI;

            var self = this, 
            
                tpl = template.status[ data.status ],
               
                render = artTemplate.compile( tpl ), 
                
                html = render( data ), 
                
                dialog = $('#' + fDialogId);

            dialog = dialog[0] ? dialog : self.build();

            $('.d-title', dialog ).html( data.status + '' != '1' ? '收藏成功' : '收藏失败' );

            $('.d-content', dialog).html( html );
            
            this.initEvt();

            this.dialog = new Dialog( dialogConfig ); 

            this.dialog.show( { selector : '#' + fDialogId} );

        },

        /**
         * 生成dialog容器
         */
        build : function (){
                
            var root = $( '<div id="' + fDialogId + '" class="mod-favorite-dialog">' + template.root + '</div>' )
                
                .appendTo( 'body' ).hide();

            return root;

        },

        /**
         * 关闭dialog
         */
        close : function (){

            this.dialog.hide();

            this.tracelog( 'close' );
                
        },
        /**
         * 打点
         * @param type {string}
         */
        tracelog : function ( type ){

            var resourceApp = this.config.resourceApp;

           if( typeof aliclick !== 'undefined' ){
            
                tracelog( type, resourceApp );     

           } else {
           
                require.use( [ aliclickJsSource ], function (){

                    tracelog( type ,resourceApp );

                });

           }

           function  tracelog( type, resourceApp ){

               aliclick( null, '?tracelog='
                   
                    + resourceApp
                   
                    + TRACELOGPREV
                   
                    + type );

           }
                   
        }

    };

    //工具方法~
    function getUtil(){

        return {

            /**
             * @file 判断用户是否登陆
             */
            isLogin : function (){

                var flag = ( typeof FE !== 'undefined' ) ? FE.util.LoginId() : true;

                return flag;
                      
            },
            /**
             *  登陆浮出层
             */
            login : function ( callback ){

                if( typeof FE == 'undefined' || !FE.sys || !FE.sys.logist ){

                    require.use( [logistCssSource, logistJsSource ], function (){

                        login();
                    
                    });

                } else {

                    login();

                }

                function login (){

                     FE.sys.logist({

                        source: 'sys_addfavorite',		//调用页面的来源

                        onLoginSuccess: function(){		//登陆成功后回调函数

                          FE.sys.logist('close');

                          $.isFunction( callback ) && callback();

                          //不影响布点页面的token
                          setTimeout( function (){

                              window.location.reload();
                            
                          }, 2000);

                        },

                        onRegistSuccess: function(){	//注册成功后回调函数

                          FE.sys.logist('close');

                          window.location.reload();

                        }
                    });

                
                }

            }
        }
    };

    /**
     * 取purchase server 为了做兼容fdev4 与 lofty
     */
    function getPurchaseServer(){

        if( typeof FE !== 'undefined' && FE.test && FE.test['style.purchase.url'] ){
            
            return FE.test['style.purchase.url'];
        }

        if( typeof lofty !== 'undefined' && lofty.test && lofty.test['style.purchase.url'] ){
        
            return lofty.test['style.purchase.url'];
        
        }

        return 'http://purchase.1688.com';
    }

    template.type = {

        'COMPANY' : '供应商',

        'OFFER_SALE' : '货品',

        'OFFER_BUY' : '货品'

    };

    template.root = [
    
            '<div class="fui-dialog-body">',				

                '<div class="d-header">',

                    '<strong class="d-title"></strong>',

                    '<a href="#" target="_self" class="d-close"></a>',

                '</div>',

                '<div class="d-detail">',

                    '<div class="d-content"></div>',

                '</div>',			

            '</div>'
                    
            ].join('');

     template.status = {};

    
    //网络异常
    template.status[ -1 ] = [
        
       '<div class="d-alert d-alert-error">',

            '<dl class="unit-info">',
            
                '<dt class="c-header"><i></i>网络繁忙，请重试!</dt>',

                '<dd class="c-desc">',
                
                    '<a href="<%= manageUrl %>" target="_blank" class="fui-btn-important">管理收藏夹</a>',

                    '<a href="#" class="close-btn link" data-action="close" title="继续浏览" target="_blank">继续浏览</a>',

                '</dd>',
                
            '</dl>',

        '</div>' 
        
        ].join('');


     // 收藏成功
     template.status[ 0 ] = [

           '<div class="d-alert d-alert-success">',

                '<dl class="unit-info">',
                
                    '<dt class="c-header"><i></i>收藏成功，此信息收藏人气：<strong class="org"><%= memberCnt %></strong>次</dt>',

                    '<dd class="c-subheader">收藏夹中已经收藏<em class="org"><%= totalCnt %></em>种<%= type %></dd>',

                    '<dd class="c-desc">',
                    
                        '<a href="<%= manageUrl %>" target="_blank" class="fui-btn-important">管理收藏夹</a>',

                        '<a href="#" class="close-btn link" data-action="close" title="继续浏览" target="_blank">继续浏览</a>',

                    '</dd>',
                    
                '</dl>',

            '</div>' 

        ].join('');

    //信息已不存在 | 系统异常 | 参数错误
    template.status[ 1 ] = [
        
       '<div class="d-alert d-alert-error">',

            '<dl class="unit-info">',
            
                '<dt class="c-header"><i></i>该<%= type %>不存在或系统异常!</dt>',

                '<dd class="c-desc">',
                
                    '<a href="<%= manageUrl %>" target="_blank" class="fui-btn-important">管理收藏夹</a>',

                    '<a href="#" class="close-btn link" data-action="close" title="继续浏览" target="_blank">继续浏览</a>',

                '</dd>',
                
            '</dl>',

        '</div>' 
        
        ].join('');

    //收藏过本信息
    template.status[ 2 ] = [
  
       '<div class="d-alert d-alert-info">',

            '<dl class="unit-info">',
            
                '<dt class="c-header"><i></i>您已经收藏过该<%= type %></dt>',

                '<dd class="c-subheader">收藏夹中已收藏<em class="org"><%= totalCnt %></em>种货品</dd>',

                '<dd class="c-desc">',
                
                    '<a href="<%= manageUrl %>" target="_blank" class="fui-btn-important">管理收藏夹</a>',

                    '<a href="#" class="close-btn link" data-action="close" title="继续浏览" target="_blank">继续浏览</a>',

                '</dd>',
                
            '</dl>',

        '</div>'
        
    ].join('');

     //收藏已满
     template.status[ 3 ] = [

          '<div class="d-alert d-alert-info">',

                '<dl class="unit-info">',
                
                    '<dt class="c-header"><i></i>您的收藏夹已满，请删除后再收藏<%= type %></dt>',

                    '<dd class="c-desc">收藏夹中已经收藏<em class="org"><%= totalCnt %></em></em>种<%= type %></dd>',

                    '<dd class="c-desc">',
                    
                        '<a href="<%= manageUrl %>" target="_blank" class="fui-btn-important">管理收藏夹</a>',

                        '<a href="#" class="close-btn link" data-action="close" title="继续浏览" target="_blank">继续浏览</a>',

                    '</dd>',
                    
                '</dl>',

            '</div>' 

     ].join('');

     return {
     
        create : function ( config ){

            new Favorite( config );         
        }     
     }

});

//init~
define([ 'jquery', 'sys/favorite/core' ], function ( $, Favorite){
    $(function (){

       $( document ).on( 'click.addfavorite','a[data-sys-favorite]', function ( e ){

           e.preventDefault();

           var config = $( this ).data( 'sysFavorite' );

            //默认是打开状态
            if( config && config.valve !== false ){

               Favorite.create( config ); 
                
            } 
       
       });
    
    });

});

