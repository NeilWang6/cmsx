/**
 * @author shanshan.hongss
 * @userfor ���ӱ༭��������༭���е����г�������������
 * @date  2013.08.05
 * @rely 
 * @modify  by ���� on ���� for �޸ĵ����ݵ�(ÿ���޸Ķ�Ҫ����һ��)
 */
 
;(function($, D, ED, undefined) {
    ED.config = {
        ELEMENT_CLASS_PREFIX: 'crazy-box-',
        
        CLASS_LAYOUT_HIGHT_LIGHT: 'hight-light-yellow',  //����layout��className
        CLASS_EDIT_HIGHT_LIGHT: 'hight-light-green',  //����layout��className
        CLASS_DEFINE_CELL: 'cell-cell-define',  //�Զ������
        CLASS_ERROR_MESSAGE:'dcms-crazy-container-overdue-offers',  //չʾ������Ϣ��Ԫ��class��
        CLASS_POSITION_RELATIVE: 'dcms-pos-relative',   //������positin:relative��class��
        
        SELECTOR_LAYOUT_COVER: '#crazy-box-cover-layout',  //layout����
        SELECTOR_MODULE_COVER: '#crazy-box-cover-module', //��ͨ�������
        SELECTOR_DATAEDIT_COVER: '#crazy-box-cover-dataedit', //�༭��������
        SELECTOR_LINE_COVER: '.cover-crazy-box-editlabel',  //�����߿�
        SELECTOR_EDIT_TEXTAREA: '#crazy-box-edit-textarea',
        CONTAINER_ERROR_MESSAGE: '#container-error-msg',  //module��չʾ�Ĵ�����Ϣ����;
        
        PUBLIC_BLOCK_NAME: 'public_block',  //���������ʶ
        MODULE_TYPE_OPTION: 'option', //�¹淶��������ڲ���ʶ���ڽڵ��ϲ��ɼ�
        MODULE_TYPE_LABELEDIT: 'labeledit',  //ԭ�淶��������ڲ���ʶ���ڽڵ��ϲ��ɼ�
        
        ATTR_DATA_DATA_SOURCE: 'dsmoduleparam', //����Դ���Զ�������
        ATTR_DATA_DYNAMIC: 'dsdynamic',  //�����Զ��������Զ�������
        ELEMENT_DATA_INFO: 'eleminfo',
        ELEMENT_DATA_BOX_CONFIG: 'boxconfig',
        TRANSPORT_DATA_ELEM: 'elem',   //�Զ������Դ��Ԫ�ض�������
        
        STYLE_URL_HOST: 'http://style.c.aliimg.com/',
        AJAX_JSONP_URL: '/page/box/json.html?_input_charset=UTF-8'
    };
})(dcms, FE.dcms, FE.dcms.box.editor);