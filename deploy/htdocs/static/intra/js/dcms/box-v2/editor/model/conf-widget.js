/**
 * @author shanshan.hongss
 * @userfor ��������ļ�
 * @date  2014.02.13
 * @rely
 * @modify  by ���� on ���� for �޸ĵ����ݵ�(ÿ���޸Ķ�Ҫ����һ��)
 */
 
;(function($, D, ED, undefined) {
    ED.widget = {
        '1': {
            name:'�û�ƫ��¥������',
            id:'1',
            code:'prefer-floor',
            parentId:'0',
            applyDevice:'pc'  //���ö����豸��ʹ�ö��ŷָ�
        },
        '2': {
            name:'����ƫ��¥������',
            id:'2',
            code:'jicai-prefer-floor',
            parentId:'1',
            applyDevice:'pc',
            editMod:'<script type="text/javascript" src="/static/intra/js/dcms/box-v2/editor/widget/floor-order.js"></script>',
            effectMod:'<script data-sc-pos="footer" type="text/javascript" src="http://style.c.aliimg.com/app/static/js/box/module/floor-prefer/floor-prefer.js"></script><script type="text/javascript" data-sc-pos="footer" src="http://style.c.aliimg.com/app/static/js/box/module/floor-prefer/jicai.js"></script>'
        },
        '3': {
            name:'���Ʒƫ��¥������',
            id:'3',
            code:'consumer-prefer-floor',
            parentId:'1',
            applyDevice:'pc',
            editMod:'<script type="text/javascript" src="/static/intra/js/dcms/box-v2/editor/widget/floor-order.js"></script>',
            effectMod:'<script data-sc-pos="footer" type="text/javascript" src="http://style.c.aliimg.com/app/static/js/box/module/floor-prefer/floor-prefer.js"></script><script data-sc-pos="footer" type="text/javascript" src="http://style.c.aliimg.com/app/static/js/box/module/floor-prefer/consumer.js"></script>'
        },
        '4': {
            name:'���̹�����',
            id:'4',
            code:'wangpu-toolbar',
            parentId:'0',
            applyDevice:'pc'
        },
        '5': {
            name:'321������̹�����',
            id:'5',
            code:'dacu321-wangpu-toolbar',
            parentId:'4',
            applyDevice:'pc',
            editMod:'',
            effectMod:'<script src="http://assets.1688.com/js/export/app-lib.js"></script><script src="http://assets.1688.com??app/vbar/1.0.0/js/dacu-config.js,app/vbar/1.0.0/view.js"></script>'
        },
        '6': {
            name:'���ʱ���',
            id:'6',
            code:'timeline',
            parentId:'0',
            applyDevice:'pc'
        },
        '7': {
            name:'321���ʱ���',
            id:'7',
            code:'dacu321-timeline',
            parentId:'6',
            applyDevice:'pc',
            editMod:'',
            effectMod:'<link data-sc-pos="head" rel="stylesheet" href="http://static.c.aliimg.com/css/app/operation/dacu/14-321/module/timeline.css" /><script data-sc-pos="footer" src="http://static.c.aliimg.com/js/app/operation/dacu/14-321/module/timeline.js"></script>'
        }
    };
})(dcms, FE.dcms, FE.dcms.box.editor);