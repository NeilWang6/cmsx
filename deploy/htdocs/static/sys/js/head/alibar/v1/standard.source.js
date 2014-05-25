/**
 * @package FD.sys.head.alibar
 * @version 1.101016.01
 * @author  Edgar
 */
FDEV.namespace('FD.sys.head');
(function( S ){

    S.memberId = '';
    S.isLogin = false;
    
    S.getCookie = function( name ){
        var value = document.cookie.match('(?:^|;)\\s*' + name + '=([^;]*)');
        return value ? unescape(value[1]) : '';
    };
    
    S.alibar = {
        checkSignIn: function(){
            if ( FD.common.lastLoginId ){
                S.memberId = FD.common.lastLoginId;
                $('account-id').innerHTML = 'ÄúºÃ£¬'+S.memberId;
                
                if ( S.getCookie('__cn_logon__') === 'true' ){
                    S.isLogin = true;
                    $D.addClass( 'account-sign-in', 'fd-hide' );
                    $D.addClass( 'account-sign-up', 'fd-hide' );
                    $D.removeClass( 'account-sign-out', 'fd-hide' );
                }
            }
        },
        topOver: function( node ){
            var over = $$( '.alibar .topnav .'+node ),t1,t2;
            $E.addListener( over, 'mouseover', function(){
                var _this = this;
                clearTimeout(t2);
                t1 = setTimeout(function(){
                    $D.addClass( _this, 'top-over' );
                    if ( node === 'top-cxt-service' ){
                        S.alibar.alitalk();
                    }
                }, 200 );
            });
            $E.addListener( over, 'mouseout', function(){
                var _this = this;
                clearTimeout(t1);
                t2 = setTimeout(function(){
                    $D.removeClass( _this, 'top-over' );
                }, 200 );
            });
        },
        changeDone: function(){
            $$('#account-sign-in a')[0].href = 'http://exodus.1688.com/member/signin.htm?Done='+window.location.href;
        },
        isAlitalk: false,
        alitalk: function(){
            var url = 'http://style.c.aliimg.com/js/lib/fdev-v3/widget/alitalk/alitalk-min.js';
            if ( FD.widget.Alitalk ){
                new FD.widget.Alitalk( $$('.top-cxt-service a[alitalk]') );
            } else if ( !S.alibar.isAlitalk && FD.common.request ){
                var configs = {
                        onSuccess: function(o){
                            S.alibar.isAlitalk = true;
                            new FD.widget.Alitalk( $$('.top-cxt-service a[alitalk]') );
                        }
                    },
                    alitalk = FD.common.request('jsonp',[url],configs);
            } else if ( !S.alibar.isAlitalk && FDEV.util.Get.script ){
                FDEV.util.Get.script( url,{
                    onSuccess:function(){
                        S.alibar.isAlitalk = true;
                        new FD.widget.Alitalk( $$('.top-cxt-service a[alitalk]') );
                    },
                    charset:'gb2312'
                });
            }
        },
        init: function(){
            this.checkSignIn();
            this.topOver('top-cxt-service');
            this.topOver('top-ali-assistant');
            this.topOver('top-sitemap');
            this.changeDone();
        },
        end:0
    };
    
    $E.onDOMReady(function(){
        S.alibar.init();
    });
    
})( FD.sys.head );
