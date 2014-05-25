/**
 * @file add to favorite (offer | company)
 * @author xianxia.jianxx
 * @date 2013-08-29
 * @example
 *  1��<a href="#" title="" data-widget-addfavorite='{"contentType":"COMPANY","contentId":"11111"....}'></a>
 *  2��new Favorite({
 *          purchaseServer : 'http://purchase-test.1688.com:2100'
 *          contentType : 'COMPANY',
 *          contentId : '11111'
 *      });
 *
 *@logic
 *  1����¼
 *      �� �ղسɹ�
 *      �� �ղ��쳣
 *      �� �Ѿ��ղع�
 *      �� �ղؼ����� 
 *
 *  2��δ��¼
 *      �� ��¼������е�¼�ɹ��߼�
 * 
 *@doc
 *  http://docs.alibaba-inc.com/pages/viewpage.action?pageId=80055973
 *
 */
define('sys/favorite/core',[ 'jquery', 'require' ], function ( $, require ){

   ��"use strict"; 

        //ִ��action  uri
    var ACTIONURI = '/favorites/json/add_to_favorites.json',
        //�����ղؼ�uri
        MANAGEURI = '/favorites/work_favorites.htm',
        //���ǰ׺
        TRACELOGPREV = '_addfavorite_action_',

        template = {}, util = getUtil(), Dialog, artTemplate,

        logistJsSource = 'sys/logist/logist-min',

        logistCssSource = 'sys/logist/logist-min.css',

        aliclickJsSource = 'sys/trace/aliclick-min',

        //dialog id
        fDialogId = 'mod-dialog-addfavorite',

        //����
        depences = ['sys/favorite/core.css',
        
                    'lofty/ui/dialog/1.0/back/dialog-min.css',

                    'lofty/ui/button/1.0/back/button-min.css',

                    'fui/dialog/1.0',
                   
                    'util/template/1.0'],

        //Ĭ������
        defaultConfig = {
        
            valve : true,//Ĭ�Ͽ��ش�

            purchaseServer : getPurchaseServer(),//�����ղؼе�server

            rType : 'jsonp',//��չ ������ʹ��

            resourceApp : '',//����tracelogͳ�����Բ�ͬ��Ӧ�� 

            isDialogShow : true,//action֮���Ƿ�չʾ������

            onCallback : $.noop,//�ص�������ֻ���success

            batchData : null //Ϊ����������չ�ã��ݲ�����

        },
       
        //dialog���Ĭ��config
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
         * @file ��ʼ�� �ȼ�������
         *  1��δ��½������������½ˢ��
         *  2����½���ִ�� 
         * @param config {object}
         */
        init : function ( config ){

            var self = this;

            this.config = config;

            //չʾ������ʱ������������
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
         * ��ʼ��
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
         * @file ��ʼ���¼�
         *  1��������� �رո�����
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
         * @file ִ�в���
         * @param url {string} ִ�в�����serverurl
         * @param config {object} ִ�в�����config
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
         * @file ����ɹ�
         *  �򿪸�����
         *  �ɹ����
         * @param o {object} �ɹ����صĲ���
         */
        success : function ( o ){

          //o = {"result":{"memberCnt":55940,"state":"0","msg":"��ϲ�����ղسɹ���","success":true,"totalCnt":1}} 
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
         * @file �������
         * @param
         */
        error : function ( status ){

            if( $.isFunction( this.config.onCallback ) ){

                this.config.onCallback( { status : status || -1, type : this.config.contentType }, this.config );

            }

            //ϵͳ�쳣
            this.config.isDialogShow && this.open( { status : status || -1 , type : this.config.contentType, cls : '' }); 

            this.tracelog('error');
       
        },

        /**
         * ����params
         * desc : �ӿ�ԭ��Ϊ���Ժ�����չ�������������
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
         * @file ��dialog
         *  չʾ��������������ݣ���Ⱦ������html
         * @param data {object} �򿪸������config
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

            $('.d-title', dialog ).html( data.status + '' != '1' ? '�ղسɹ�' : '�ղ�ʧ��' );

            $('.d-content', dialog).html( html );
            
            this.initEvt();

            this.dialog = new Dialog( dialogConfig ); 

            this.dialog.show( { selector : '#' + fDialogId} );

        },

        /**
         * ����dialog����
         */
        build : function (){
                
            var root = $( '<div id="' + fDialogId + '" class="mod-favorite-dialog">' + template.root + '</div>' )
                
                .appendTo( 'body' ).hide();

            return root;

        },

        /**
         * �ر�dialog
         */
        close : function (){

            this.dialog.hide();

            this.tracelog( 'close' );
                
        },
        /**
         * ���
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

    //���߷���~
    function getUtil(){

        return {

            /**
             * @file �ж��û��Ƿ��½
             */
            isLogin : function (){

                var flag = ( typeof FE !== 'undefined' ) ? FE.util.LoginId() : true;

                return flag;
                      
            },
            /**
             *  ��½������
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

                        source: 'sys_addfavorite',		//����ҳ�����Դ

                        onLoginSuccess: function(){		//��½�ɹ���ص�����

                          FE.sys.logist('close');

                          $.isFunction( callback ) && callback();

                          //��Ӱ�첼��ҳ���token
                          setTimeout( function (){

                              window.location.reload();
                            
                          }, 2000);

                        },

                        onRegistSuccess: function(){	//ע��ɹ���ص�����

                          FE.sys.logist('close');

                          window.location.reload();

                        }
                    });

                
                }

            }
        }
    };

    /**
     * ȡpurchase server Ϊ��������fdev4 �� lofty
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

        'COMPANY' : '��Ӧ��',

        'OFFER_SALE' : '��Ʒ',

        'OFFER_BUY' : '��Ʒ'

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

    
    //�����쳣
    template.status[ -1 ] = [
        
       '<div class="d-alert d-alert-error">',

            '<dl class="unit-info">',
            
                '<dt class="c-header"><i></i>���緱æ��������!</dt>',

                '<dd class="c-desc">',
                
                    '<a href="<%= manageUrl %>" target="_blank" class="fui-btn-important">�����ղؼ�</a>',

                    '<a href="#" class="close-btn link" data-action="close" title="�������" target="_blank">�������</a>',

                '</dd>',
                
            '</dl>',

        '</div>' 
        
        ].join('');


     // �ղسɹ�
     template.status[ 0 ] = [

           '<div class="d-alert d-alert-success">',

                '<dl class="unit-info">',
                
                    '<dt class="c-header"><i></i>�ղسɹ�������Ϣ�ղ�������<strong class="org"><%= memberCnt %></strong>��</dt>',

                    '<dd class="c-subheader">�ղؼ����Ѿ��ղ�<em class="org"><%= totalCnt %></em>��<%= type %></dd>',

                    '<dd class="c-desc">',
                    
                        '<a href="<%= manageUrl %>" target="_blank" class="fui-btn-important">�����ղؼ�</a>',

                        '<a href="#" class="close-btn link" data-action="close" title="�������" target="_blank">�������</a>',

                    '</dd>',
                    
                '</dl>',

            '</div>' 

        ].join('');

    //��Ϣ�Ѳ����� | ϵͳ�쳣 | ��������
    template.status[ 1 ] = [
        
       '<div class="d-alert d-alert-error">',

            '<dl class="unit-info">',
            
                '<dt class="c-header"><i></i>��<%= type %>�����ڻ�ϵͳ�쳣!</dt>',

                '<dd class="c-desc">',
                
                    '<a href="<%= manageUrl %>" target="_blank" class="fui-btn-important">�����ղؼ�</a>',

                    '<a href="#" class="close-btn link" data-action="close" title="�������" target="_blank">�������</a>',

                '</dd>',
                
            '</dl>',

        '</div>' 
        
        ].join('');

    //�ղع�����Ϣ
    template.status[ 2 ] = [
  
       '<div class="d-alert d-alert-info">',

            '<dl class="unit-info">',
            
                '<dt class="c-header"><i></i>���Ѿ��ղع���<%= type %></dt>',

                '<dd class="c-subheader">�ղؼ������ղ�<em class="org"><%= totalCnt %></em>�ֻ�Ʒ</dd>',

                '<dd class="c-desc">',
                
                    '<a href="<%= manageUrl %>" target="_blank" class="fui-btn-important">�����ղؼ�</a>',

                    '<a href="#" class="close-btn link" data-action="close" title="�������" target="_blank">�������</a>',

                '</dd>',
                
            '</dl>',

        '</div>'
        
    ].join('');

     //�ղ�����
     template.status[ 3 ] = [

          '<div class="d-alert d-alert-info">',

                '<dl class="unit-info">',
                
                    '<dt class="c-header"><i></i>�����ղؼ���������ɾ�������ղ�<%= type %></dt>',

                    '<dd class="c-desc">�ղؼ����Ѿ��ղ�<em class="org"><%= totalCnt %></em></em>��<%= type %></dd>',

                    '<dd class="c-desc">',
                    
                        '<a href="<%= manageUrl %>" target="_blank" class="fui-btn-important">�����ղؼ�</a>',

                        '<a href="#" class="close-btn link" data-action="close" title="�������" target="_blank">�������</a>',

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

            //Ĭ���Ǵ�״̬
            if( config && config.valve !== false ){

               Favorite.create( config ); 
                
            } 
       
       });
    
    });

});

