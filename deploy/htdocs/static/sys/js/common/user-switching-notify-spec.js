(function($, SN){

    var cookie = $.util.cookie,
        subCookie = $.util.subCookie,
        curTbUser, 
        curTbNick,

        listener = {

            onUserSwitched: function(evt, info) {
                listener.notify(info.nick);
            },

            notify: function(nick) {
                curTbNick = nick;
                console.log( 'you are using Taobao account [', nick, ']');
            }
        },

        users = {
            // B2B注册用户
            b2bUser: { b2bId: 'qhwa2010', tbId: 'qhwa2010', nick: 'qhwa2010' },
            // 绑定用户, 两边都有绑定
            b2bAndTbUser: { b2bId: 'qhwa2009', tbId: 'qhwa', nick: 'qhwa' },
            // 淘宝注册用户
            tbUser: { b2bId: 'b2b-zzz', tbId: 'zzz', nick: '淘宝昵称' },
            tbUser2: { b2bId: 'b2b-yyy', tbId: 'yyy', nick: '淘宝昵称 yyy' },

            subAccountUser: { b2bId: 'qhwa2010:001', tbId: null },
            subAccountUser2: { b2bId: 'qhwa2010:002', tbId: null }
        };

    $(window).on('userSwitchedToTB', listener.onUserSwitched);

    describe("environment", function(){
        it('should run in a server', function(){
            expect( location.href ).toMatch(/^http:\/\//);
        });
    });

    describe("User switched notify module", function() {

        beforeEach( prepare );
        afterEach( clean );

        it('当用户切换时，并且切换后为淘宝用户时，可以触发事件', function(){
            login( users.b2bUser );
            SN.check();

            login( users.tbUser )
            expect( curTbUser ).toBe( users.tbUser );

            SN.check();
            
            expect( listener.notify ).toHaveBeenCalled();
        });

        it('从淘宝用户A切换到淘宝用户B，可以触发事件', function() {
            login( users.tbUser );
            SN.check();

            login( users.tbUser2 )
            SN.check();
            
            expect( listener.notify ).toHaveBeenCalled();
        });

        it('可以获得切换后的nick数据，用来展示', function() {
            login( users.tbUser );
            SN.check();

            login( users.tbUser2 )
            SN.check();
            
            expect( listener.notify ).toHaveBeenCalled();
            expect( curTbNick ).toBe( users.tbUser2.nick );
        });

        it('用户没有发生切换，不触发事件', function(){
            login( users.b2bUser );
            SN.check();

            login( users.b2bUser );
            SN.check();

            expect( listener.notify ).not.toHaveBeenCalled();
        });

        it('未登录淘宝，使用子帐号在B2B局部登录，不触发事件', function() {
            login( users.subAccountUser );
            SN.check();

            login( users.subAccountUser2 );
            SN.check();

            expect( listener.notify ).not.toHaveBeenCalled();
        });

        it('已登录淘宝，使用子帐号在B2B局部登录，不触发事件', function() {
            login( users.tbUser );
            SN.check();

            login( users.subAccountUser );
            SN.check();

            expect( listener.notify ).not.toHaveBeenCalled();
        });

        it('B2B帐号发生切换，但淘宝帐号没有切换(模拟绿色通道情况)，此时不应提示', function() {
            login( users.b2bUser );
            SN.check();

            loginB2b( users.b2bUser );
            SN.check();

            expect( listener.notify ).not.toHaveBeenCalled();
        });

        it('淘宝已登录，再B2B局部登录，此时不应提示', function(){
            login( users.tbUser );
            SN.check();

            loginB2b( users.b2bUser );
            SN.check();

            expect( listener.notify ).not.toHaveBeenCalled();
        });

        it('当用户切换，但切换后的用户绑定了B2B帐号，此时不应提示', function(){
            login( users.tbUser );
            SN.check();

            loginB2b( users.b2bAndTbUser );
            SN.check();

            expect( listener.notify ).not.toHaveBeenCalled();
        });
    });

    function prepare(){
        clearCookies();
        spyOn(listener, 'notify').andCallThrough();
        mockTbService();
    }

    function mockTbService() {
        FE.util.getLoginInfoFromTaobao = function() {
            var dfd = new $.Deferred;
            var data = curTbUser ? {
                "__cn_logon_id__" :     curTbUser.b2bId,
                "nick" :                curTbUser.nick,
                "__cn_logon__":         "true",
                "__last_loginid__":     curTbUser.b2bId,
                version:"1.0"
            } : {
                "__cn_logon_id__" : "",
                "__cn_logon__" :    false,
                version :           "1.0"
            }
            dfd.resolve(data);
            return dfd;
        };
    }

    function clearCookies() {
        cookie('alicnweb', '', { domain: 'alibaba.com', path: '/', raw: true });
    }

    function clean() {
        logout();
    }

    function login( user ) {
        loginB2b( user )
        loginTb( user )
    }

    function loginB2b( user ) {
        var id = user.b2bId;
        cookie('__cn_logon_id__', id);
        cookie('__cn_logon__', true);
        cookie('__last_loginid__', id);
    }

    function loginTb( user ) {
        if(user.tbId) {
            curTbUser = user;
        }
    }

    function logout() {
        cookie('__cn_logon_id__', null);
        cookie('__cn_logon__', null);
        cookie('__last_loginid__', null);

        curTbUser = null;
        curTbNick = null;
    }


})(jQuery, FE.util.UserSwNotify);
