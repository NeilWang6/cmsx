/**
 * author honglun.menghl
 * date 2011-10-27
 * localconnect flash
 */
('localconnect' in jQuery.ui.flash) ||
(function($){

    var $util = $.util, 
        localconnect = function(){

            if ($util.flash.hasVersion(9)) {
                var self = this, 
                    swfid = self.element[0].id, 
                    o = self.options, 
                    swfurl = 'http://img.china.alibaba.com/swfapp/localgroup/localgroup.swf';
                o = self.options = $.extend(true, {
                    width: 1,
                    height: 1,
                    swf: swfurl,
                    //允许脚本
                    allowScriptAccess: 'always',
                    flashvars: {
                        swfid: swfid,
                        startDelay: 500,
                        debug:false,
                        //事件钩子
                        eventHandler: 'jQuery.util.flash.triggerHandler'
                    }
                }, o);

                $.extend(self, {                	
                    getConnect: function(){
                        var self = this;                        
                        return {
                            initHost: function( groupN ){
                                return self.obj.create(encodeURIComponent(groupN));
                            },
                            connect: function(groupN){
                                return self.obj.join(encodeURIComponent(groupN));
                            },
                            pubMsg: function(dataStr){
								return self.obj.pubMsg(encodeURIComponent(dataStr));
                            },
                            send2Host: function(dataStr){
								return self.obj.send2Host(encodeURIComponent(dataStr));
                            },
                            uninitHost:function(){
                                return self.callMethod('dispose');
                            }
                        }
                    }
                    
                });               
                return true;
            }
            return false;

        }

    $util.flash.regist('localconnect', localconnect);
    $.add('ui-flash-localconnect');

})(jQuery);
