/**
 * User: garcia.wul (garcia.wul@alibaba-inc.com)
 * Date: 8/15/12
 * Time: 10:57 AM
 *
 */
/*!!cmd:compress=true*/
/*!!cmd:jsCompressOpt=["--disable-optimizations"]*/

(function ($) {
    jQuery.namespace("FE.sys.webww.luckydraw");
    FE.sys.webww.luckydraw.LuckyDrawText = {
        mismatchConditionTitle: "�ף���������ʱ���ܳ齱Ŷ��",
        mismatchConditionText: "���ܵ�ԭ����:<ul><li>1.����������վ�ʺŵ�¼��������</li><li>2.�����2�γ齱����������������Ļ������컹������</li></ul>",
        badLucks: [
            {
                title: "���ź�!",
                text: "���ź����´�һ��Ҫ���˰���"
            },
            {
                title: "���ź�!",
                text: "���û���н�,���������´�û���н�!����!"
            },
            {
                title: "���ź�!",
                text: "û���н�Ŷ~���ź�!"
            }
        ],
        badLucksKeywords: "û���н�",
        goodLuckTitle: "��ϲ��!",
        goodLuckText: Hogan.compile("���õĽ�Ʒ��:{{{name}}}!9��10��ǰ,����Ů����(taokafei)��������������ϵ��!")
    }
})(jQuery);