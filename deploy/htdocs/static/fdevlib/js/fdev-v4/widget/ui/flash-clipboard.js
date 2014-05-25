/*
 * jQuery UI Flash-clipboard 1.0
 * Դ������вο��Կ�Դ��zeroClipBoard���,��Դ��Ļ����Ͻ����и���
 * @author jianping.shenjp 2012.04.23
 * Depends:
 *	jQuery.ui.flash
 * @update v1.1 2013.02.18 �޸����Ƶ��ַ����к�"\"�ַ������´����bug
 */
('clipboard' in jQuery.ui.flash) ||
(function($, undefined){
    var $util = $.util, clipboard = function(){
        /**
         * flash�������
         */
        if ($util.flash.hasVersion(10)) {
            var self = this, swfid = self.element[0].id, o = self.options, swfurl = o.swf || 'http://view.1688.com/book/swfapp/clipboard/flashclipboard-v1.1.swf';
                
            o = self.options = $.extend(true, {
                width: 30,
                height: 18,
                swf: swfurl,
                //����ű�
                allowScriptAccess: 'always',
                wmode: 'transparent',
                flashvars: {
                	startDelay: 500,
                    //�¼�����
                    eventHandler: 'jQuery.util.flash.triggerHandler'
                }
            }, o);
            //���趨��width��height��ֵ��flashvars
            o.flashvars.width = o.width;
            o.flashvars.height = o.height;
            $.extend(self, {
                /**
                 * ����flash�����ò���
                 */
                _getFlashConfigs: function(){
                    var self = this, configs;
                    //����ԭʼ����
                    configs = $.ui.flash.prototype._getFlashConfigs.call(self);
                    //�����swfid��ʵ������id
                    configs.flashvars.swfid = swfid;
                    return configs;
                },
                /**
                 * ������Ҫ���Ƶ���������ı�
                 * @param {string} text ��Ҫ���Ƽ�������ı�
                 */
                setText: function(text){
                    this.obj.setText(text);
                },
                /**
                 * �����ƶ���flash��ʱ���Ƿ�ʹ����Ϊ����
                 * @param {boolean} enabled �Ƿ�ʹ������Ϊ����
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
