/**
 * User: garcia.wul (garcia.wul@alibaba-inc.com)
 * Date: 8/15/12
 * Time: 12:32 PM
 *
 */
/*!!cmd:compress=true*/
/*!!cmd:jsCompressOpt=["--disable-optimizations"]*/

(function ($) {
    jQuery.namespace("FE.sys.webww.luckydraw");
    FE.sys.webww.luckydraw.LuckyDrawConfig = {
        // ���ID
        promotionId: "cls0c8glvynmw7l0b91e",

        // �����齱��ķ����ַ
        luckyDrawServer: "http://luckydraw.china.alibaba.com",
        // �齱�ӿ�
        doLuckyDraw: Hogan.compile("{{{luckyDrawServer}}}/home/draw.json?p={{{promotionId}}}"),
        // ��ѯ�ҵ��н���¼�ӿ�
        queryDrawResult: Hogan.compile("{{{luckyDrawServer}}}/home/resultAjax.json?promotionId={{{promotionId}}}"),
        // ¼���Ա��ϵ��ʽ
        updateContacts: Hogan.compile("{{{luckyDrawServer}}}/home/update_contact_ajax.json?promotionId={{{promotionId}}}&resultId={{{resultId}}}&contactName={{{contactName}}}"),

        // �ܳ齱����
        totalChances: 2
    }
})(jQuery);