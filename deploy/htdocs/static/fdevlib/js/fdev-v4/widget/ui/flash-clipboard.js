/*
 * jQuery UI Flash-clipboard 1.0
 * 源码与灵感参考自开源的zeroClipBoard组件,在源码的基础上将进行改造
 * @author jianping.shenjp 2012.04.23
 * Depends:
 *	jQuery.ui.flash
 * @update v1.1 2013.02.18 修复复制的字符串中含"\"字符，导致错误的bug
 */
('clipboard' in jQuery.ui.flash) ||
(function($, undefined){
    var $util = $.util, clipboard = function(){
        /**
         * flash组件构造
         */
        if ($util.flash.hasVersion(10)) {
            var self = this, swfid = self.element[0].id, o = self.options, swfurl = o.swf || 'http://view.1688.com/book/swfapp/clipboard/flashclipboard-v1.1.swf';
                
            o = self.options = $.extend(true, {
                width: 30,
                height: 18,
                swf: swfurl,
                //允许脚本
                allowScriptAccess: 'always',
                wmode: 'transparent',
                flashvars: {
                	startDelay: 500,
                    //事件钩子
                    eventHandler: 'jQuery.util.flash.triggerHandler'
                }
            }, o);
            //将设定的width、height赋值给flashvars
            o.flashvars.width = o.width;
            o.flashvars.height = o.height;
            $.extend(self, {
                /**
                 * 配置flash的配置参数
                 */
                _getFlashConfigs: function(){
                    var self = this, configs;
                    //调用原始方法
                    configs = $.ui.flash.prototype._getFlashConfigs.call(self);
                    //这里的swfid其实是容器id
                    configs.flashvars.swfid = swfid;
                    return configs;
                },
                /**
                 * 设置需要复制到剪贴板的文本
                 * @param {string} text 需要复制剪贴板的文本
                 */
                setText: function(text){
                    this.obj.setText(text);
                },
                /**
                 * 设置移动到flash上时，是否使鼠标变为手型
                 * @param {boolean} enabled 是否使得鼠标变为手型
                 */
                setHandCursor: function(enabled){
                    this.obj.setHandCursor(enabled);
                }
            });
            return true;
        }
        return false;
    };
    $util.flash.regist('clipboard', clipboard);
    $.add('ui-flash-clipboard');
})(jQuery);
