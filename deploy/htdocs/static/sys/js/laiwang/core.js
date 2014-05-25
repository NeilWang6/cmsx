/**
 * @author xianxia.jianxx
 * @date 20131213
 * @file 全站来往布点悬挂 
 * @example 
 * tag方式：
 *  <div class="sys-laiwang" data-sys-laiwang='$config'></div>
 * js方式 ： 
 *  define(['jquery','sys/laiwang/core'], function ( $, laiwang ){
 *
 *      laiwang.create( {
 *          
 *          pos : 'right-side',
 *
 *          loffset : '-40',
 *
 *          canClose : true,
 *
 *          appsource : 'purchselist'
 *          
 *      } );
 *      
 *  });
 */

define('sys/laiwang/core', ['jquery', 'require'], function ( $, require ){

    var defaultConfig = {
    
     pos : 'right-mid',//right-mid,right-side,left-mid,left-side

     loffset : 0,//横向偏移量

     toffset : 0,//纵向便宜

     canClose : false,//是否可以关闭

     midDoc : $('#content'),//pos为-mid时 参照doc

     src : 'http://img.china.alibaba.com/cms/upload/2013/139/568/1865931_2091977944.png',//二维码图片地址

     url : 'http://page.1688.com/promotion/laiwang/hongbao.html',//点击链接地址

     txt : '下载来往得红包',//文案展示

     resourceApp : ( function (){//app来源
     
       return window.location.host; 

     })()
        
    },
    //打点静态资源
    aliclickJsSource = 'sys/trace/aliclick-min',
    //数据统计前缀
    TRACELOGPREV = '_laiwang_scan_', WIN = $( window ),
    //文件依赖
    depences =  ['sys/laiwang/core.css'];

    var LaiWang = function ( config ){
        
        this.init( config ); 
        
    };

    LaiWang.prototype = {
    
        /**
         * 初始化
         * config {object} defaultConfig
         */
        init : function ( config ){
        
            var self = this;

            self.config = $.extend( {}, defaultConfig, config );       

            if( require && require.use ){

                require.use( depences, function( ){

                    init(); 

                });

            } else {

                init();

            }

            function init(){
            
                self.build( );

                self.reposition();

                self.evt();
            
            }
                       
        },

        /**
         * 生成容器
         */
        build : function (){

            var config = this.config,
            
                html = [
                    '<div class="sys-laiwang-scan">',
                        '<div class="box-wrap box-wrap-'+ config.pos +'">',
                            '<span class="desc-panel">',
                                config.txt,
                            '</span>',
                            (config.canClose ? 
                            '<a href="#" title="关闭" class="close-btn"><span></span></a>'
                             : ''),
                            '<a class="code-panel" href="',config.url,'" title="',config.txt,'" target="_blank">',
                                '<img src="',config.src,'" alt="', config.txt ,'"/>',
                            '</a>',
                        '</div>',
                    '</div>'
                    ].join('');

            this.tracelog( 'exp' );

            this.container = $( html ).appendTo( 'body' ).hide();
                
        }, 

        /**
         *  重新定位
         */
        reposition : function (){
                     
            var node = $('.box-wrap', this.container),

                config = this.config,
            
                pos = config.pos,
               
                top = 0, offsetVal = 0,
               
                offsetPos = ( config.pos.indexOf('left') != -1 ) ? 'right' : 'left';

            offsetVal = ( config.pos.indexOf('-mid') === -1 ) ? '8px' : (function ( ){

                var midDoc = config.midDoc ? config.midDoc : $('#content');

                midDoc = ( typeof midDoc == 'string' && $( midDoc )[0] ) ? $( midDoc ) : midDoc;

                return ( parseFloat( midDoc.width() / 2 ) + parseFloat( config.loffset ) );
            
            })();

            offsetVal = offsetVal + 17;

            top = $.browser.version != 6 ?  ( function ( $ ){
            
                return ( WIN.height() / 2 ) - ( node.height() / 2);
            
            })($) : (function( $ ){
           
               return WIN.scrollTop() + ( WIN.height() / 2 ) - ( node.height() / 2 ) 
                
            })($);

            top = top + parseFloat( config.toffset );

            node.css('top', top).css('margin-' + offsetPos, offsetVal);

            this.container.show();


        },

        /**
         * 初始化事件
         */
        evt : function (){

            var self = this,
            
            root = this.container, timer = null;

            WIN.scroll(function() {

				if(timer){clearTimeout(timer)}

				timer = setTimeout($.proxy(self.reposition, self), 100);

			}).resize(function() {

				// 阻止在resize内部操作发生resize而造成堆栈溢出
				setTimeout($.proxy(self.reposition, self), 100);

			});
            
            if( this.config.canClose ){
            
                root.on('click.close', 'a.close-btn', function ( e ){
                
                    e.preventDefault();
                    
                    root.animate({

                        opacity : 0 

                    },function (){
                    
                        root.remove();

                        self.tracelog( 'close' );

                    });
                    
                });
            }

            root.on('click.jump','a.code-panel', function ( e ){
            
                self.tracelog('jump'); 

            });
        },

        /**
         * 打点参数 
         * @param type {string}
         */
        tracelog : function ( type ){

            var config = this.config;

            if( typeof aliclick === 'undefined' ){

                 require.use( [ aliclickJsSource ], function (){

                    tracelog( type, config.resourceApp );

                 });

            } else {

                tracelog( type, config.resourceApp );

            } 
             function  tracelog( type, resourceApp ){

               aliclick( null, '?tracelog='
                   
                    + resourceApp
                   
                    + TRACELOGPREV
                   
                    + type );

           }
        
        }

    };
    
    return {

        create : function ( config ){

            return new LaiWang( config );
                 
        } 
        
    }; 

});

//默认启动
define(['jquery','sys/laiwang/core'], function ( $, laiwang ){

    $(function (){

        var nodes = $('div[data-sys-laiwang],input[data-sys-laiwang]');

        nodes.each( function ( index, obj ){

            laiwang.create( $(this).data('sysLaiwang') );

        });

    }); 

});
