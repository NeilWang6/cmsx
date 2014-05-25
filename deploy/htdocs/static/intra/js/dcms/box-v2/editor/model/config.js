/**
 * @author shanshan.hongss
 * @userfor 盒子编辑器配置项，编辑器中的所有常量都集中在这
 * @date  2013.08.05
 * @rely 
 * @modify  by 姓名 on 日期 for 修改的内容点(每次修改都要新增一条)
 */
 
;(function($, D, ED, undefined) {
    ED.config = {
        ELEMENT_CLASS_PREFIX: 'crazy-box-',
        
        CLASS_LAYOUT_HIGHT_LIGHT: 'hight-light-yellow',  //高亮layout的className
        CLASS_EDIT_HIGHT_LIGHT: 'hight-light-green',  //高亮layout的className
        CLASS_DEFINE_CELL: 'cell-cell-define',  //自定义组件
        CLASS_ERROR_MESSAGE:'dcms-crazy-container-overdue-offers',  //展示错误信息的元素class名
        CLASS_POSITION_RELATIVE: 'dcms-pos-relative',   //定义了positin:relative的class名
        
        SELECTOR_LAYOUT_COVER: '#crazy-box-cover-layout',  //layout遮罩
        SELECTOR_MODULE_COVER: '#crazy-box-cover-module', //普通组件遮罩
        SELECTOR_DATAEDIT_COVER: '#crazy-box-cover-dataedit', //编辑内容遮罩
        SELECTOR_LINE_COVER: '.cover-crazy-box-editlabel',  //用于线框
        SELECTOR_EDIT_TEXTAREA: '#crazy-box-edit-textarea',
        CONTAINER_ERROR_MESSAGE: '#container-error-msg',  //module上展示的错误信息容器;
        
        PUBLIC_BLOCK_NAME: 'public_block',  //公用区块标识
        MODULE_TYPE_OPTION: 'option', //新规范组件名；内部标识，在节点上不可见
        MODULE_TYPE_LABELEDIT: 'labeledit',  //原规范组件名；内部标识，在节点上不可见
        
        ATTR_DATA_DATA_SOURCE: 'dsmoduleparam', //数据源绑定自定义属性
        ATTR_DATA_DYNAMIC: 'dsdynamic',  //保存自定义代码的自定义属性
        ELEMENT_DATA_INFO: 'eleminfo',
        ELEMENT_DATA_BOX_CONFIG: 'boxconfig',
        TRANSPORT_DATA_ELEM: 'elem',   //自定义属性存放元素对象引用
        
        STYLE_URL_HOST: 'http://style.c.aliimg.com/',
        AJAX_JSONP_URL: '/page/box/json.html?_input_charset=UTF-8'
    };
})(dcms, FE.dcms, FE.dcms.box.editor);