(function($, SK){

    var cookie = $.util.cookie,
        subCookie = $.util.subCookie;

    describe("environment", function(){
        it('should run in a server', function(){
            expect( location.href ).toMatch(/^http:\/\//);
        });
    });

    describe("sub cookie usage", function(){

        beforeEach( clearCookies );

        it('can write and read', function(){
            expect(subCookie('foo')).toBeNull();

            var value = 'bar' + Math.floor(Math.random()*1000);
            subCookie('foo', value);
            expect(subCookie('foo')).toBe( value );
        });

    });

    describe("session keeper module", function() {
        beforeEach( prepare );
        afterEach( clean );

        it('可以访问淘宝以保持淘宝session处于激活状态', function() {
            SK.touch();
            expect(SK._sendTouchRequest).toHaveBeenCalled();
        });

        it('可以记录touch的时间', function() {
            var t = new Date();
            SK.touch();

            var touch_at = subCookie('touch_tb_at');
            expect(touch_at).not.toBeNull();
            expect(Number(touch_at)).toBeLessThan( t.valueOf() + 5 );
        });

        it('多次调用只会touch一次', function() {
            SK.touch();
            SK.touch();

            expect(SK._sendTouchRequest.callCount).toBe(1);
        });

        it('短时间内频繁调用只会touch一次', function(){

            SK.touch();

            setTimeout( SK.touch, 100);
            setTimeout( SK.touch, 200);
            setTimeout( SK.touch, 300);

            waits(1200);

            runs(function(){
                expect(SK._sendTouchRequest.callCount).toBe(1);
            });

        });

        it('超过设定时间可以重新touch', function(){
            SK.touch();

            setTimeout( SK.touch, 1100);

            waits(1200);

            runs(function(){
                expect(SK._sendTouchRequest.callCount).toBe(2);
            });

        });

        it('会自动不断touch', function() {
            SK.config.interval = 2; //seconds
            SK.startTrigger();

            waits(7000);

            runs(function(){
                expect(SK._sendTouchRequest.callCount).toBe(4);
            });

        });

    });

    function clearCookies() {
        cookie('alicnweb', '', { domain: 'alibaba.com', path: '/', raw: true });
    }

    function prepare(){
        clearCookies();
        spyOn(SK, '_sendTouchRequest');
        SK.config.interval = 1; //seconds
        SK.stopTrigger();
    }

    function clean() {
        SK.stopTrigger();
        clearCookies();
    }

})(jQuery, FE.sys.SessionKeeper);
