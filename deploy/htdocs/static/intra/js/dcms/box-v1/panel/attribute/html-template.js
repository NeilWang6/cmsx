/**
 *  html代码模版
 * @author springyu
 */

;(function($, D) {
    //模版
    var template = ' <div class="tab-nav">';
    template += '  <ul class="fd-clr">';
    template += '   <li class="current panel-template"><a class="desc" id="sys_recommend">系统推荐</a></li>';
    template += '   </ul>';
    template += '  </div>';
    template += '    <div class="panel-template-content panel-template">';
    template += '     <div id="template_tag_list" class="template-content" data-pageid="">';
    // template += '       <div class="template-search">';
    //template += '        <ul class="fd-clr">';
    //template += '       <li><label for="keyword">筛选：</label><input class="search-keyword" type="text" name="keyword" id="keyword" placeholder="通过关键词或URL查找" value=""/></li>';
    //template += '      <li><div class="template-search-btn"><button class="search-submit-btn dcms-btn submit-btn" id="search-template">查找</button></div></li>';
    //template += '    </ul>';
    //template += '   </div>';
    template += '   <div class="template-body dcms-box-list"></div>';
    template += '    <div class="template-page fd-clr"></div>';
    template += '   </div>';
    template += '    </div>';
    //页面背景
    var background = ' <div class="tab-nav">';
    background += '<ul class="fd-clr">';
    background += '  <li class="current panel-background"><a class="desc" id="nav_background">更新页面背景</a></li>';
    background += ' </ul>';
    background += '</div>';
    background += ' <div class="page-background" id="page_background">';
    background += ' <div id="attr_content" class="attr ">';
    background += '  </div>';
    background += '  </div>';
    //组件属性
    var module = '<div class="tab-nav">';
    module += '<ul class="fd-clr">';
    module += '<li class="current panel-module"><a class="desc module-a" id="nav_attr_edit"><span>组</span>属性</a></li>';
    module += ' <li class="panel-module"><a class="desc module-a" id="nav_module">组件</a></li>';
    //module += ' <li class="panel-module"><a class="desc module-a" id="nav_microlayout">微布局</a></li>';
    module += '<li class="panel-module"><a class="desc module-a" id="nav_attr_ds">接入数据源</a></li>';
    module += ' </ul>';
    module += '</div>';
    module += ' <div class="box-edit-content">';
    module += '<div class="panel-module-content dcms-box-hide"><div class="edit-content "></div></div>';
    module += '<div class="panel-module-ds dcms-box-hide"><div id="attr_dsModule" class="attr"></div></div>';
    module += '<div class="panel-edit-attr">';
    module += ' <ul class="attr-tab fd-clr">';
    module += ' <li><input type="checkbox" id="autocratic" name="autocratic"><label for="autocratic">该属性只对当前控件有效</label></li>';
    module += '</ul>';
    module += '<div class="attr-elem-layout">';
    module += ' </div>';
    module += '</div>';
    module += ' </div>';
    //layout属性 add by hongss on 2012.12.05 for 栅格属性
    var layout = '<div class="tab-nav">\
                    <ul class="fd-clr">\
                        <li class="current panel-module"><a class="desc module-a" id="nav_attr_edit">栅格属性</a></li>\
                    </ul>\
                  </div>\
                  <div class="box-edit-content">\
                    <div class="panel-edit-attr">\
                        <ul class="attr-tab fd-clr">\
                            <li><input type="checkbox" id="autocratic" name="autocratic"><label for="autocratic">该属性只对当前控件有效</label></li>\
                        </ul>\
                        <div class="attr-elem-layout"></div>\
                    </div>\
                  </div>';
    
    //主导航条
    var pageDesignNav = '   <ul class="fd-clr">';
    pageDesignNav += ' <li class="panel-page-module "><button id="change_template">更换模版</button></li>';
    pageDesignNav += ' <li class="panel-page-module dcms-box-hide"><button id="change_background">页面背景</button></li>';
    pageDesignNav += ' <li class="dcms-box-hide panel-grid"><button id="change_page_grids">栅格库</button></li>';
    pageDesignNav += ' </ul>';
    var pageDesignCellNav = '<ul class="fd-clr">';
    pageDesignCellNav += ' <li class="panel-cell dcms-box-hide"><button id="cell_library">控件库</button></li>';
    pageDesignCellNav += ' </ul>';
    
    //新建组件
    var moduleDesignNav = '<ul class="fd-clr">\
                            <li class="panel-page-module "><button id="change_mod_width">栅格库</button></li>\
                          </ul>';
    var moduleGrids = '<div class="panel-module-width"><div class="tab-nav"><ul class="fd-clr"> <li class="current"><a class="desc cell-a" id="nav_grids">栅格库</a></li> </ul></div>\
                        <ul class="list-module-width">\
                        <li>\
                            <span class="span-radio"><input type="radio" id="radio-width-990" autocomplete="off" name="radio-module-width" value="990" /></span>\
                            <label class="span-img" for="radio-width-990"><img src="http://img.china.alibaba.com/cms/upload/2012/568/734/437865_983650061.png" /></label>\
                        </li>\
                          <li>\
                            <span class="span-radio"><input type="radio" id="radio-width-480" autocomplete="off" name="radio-module-width" value="490" /></span>\
                            <label class="span-img" for="radio-width-490"><img src="http://img.china.alibaba.com/cms/upload/2013/407/803/1308704_983650061.png" /></label>\
                        </li>\
                        <li>\
                            <span class="span-radio"><input type="radio" id="radio-width-780" autocomplete="off" name="radio-module-width" value="780" /></span>\
                            <label class="span-img" for="radio-width-780"><img src="http://img.china.alibaba.com/cms/upload/2013/206/803/1308602_983650061.png" /></label>\
                        </li>\
                        <li>\
                            <span class="span-radio"><input type="radio" id="radio-width-740" autocomplete="off" name="radio-module-width" value="740" /></span>\
                            <label class="span-img" for="radio-width-740"><img src="http://img.china.alibaba.com/cms/upload/2013/101/903/1309101_983650061.png" /></label>\
                        </li>\
                        <li>\
                            <span class="span-radio"><input type="radio" id="radio-width-660" autocomplete="off" name="radio-module-width" value="660" /></span>\
                            <label class="span-img" for="radio-width-660"><img src="http://img.china.alibaba.com/cms/upload/2013/302/903/1309203_983650061.png" /></label>\
                        </li>\
                        <li>\
                            <span class="span-radio"><input type="radio" id="radio-width-530" autocomplete="off" name="radio-module-width" value="530" /></span>\
                            <label class="span-img" for="radio-width-530"><img src="http://img.china.alibaba.com/cms/upload/2013/101/013/1310101_983650061.png" /></label>\
                        </li>\
                        <li>\
                            <span class="span-radio"><input type="radio" id="radio-width-330" autocomplete="off" name="radio-module-width" value="330" /></span>\
                            <label class="span-img" for="radio-width-330"><img src="http://img.china.alibaba.com/cms/upload/2013/102/013/1310201_983650061.png" /></label>\
                        </li>\
                        <li>\
                            <span class="span-radio"><input type="radio" id="radio-width-320" autocomplete="off" name="radio-module-width" value="320" /></span>\
                            <label class="span-img" for="radio-width-320"><img src="http://img.china.alibaba.com/cms/upload/2013/502/013/1310205_983650061.png" /></label>\
                        </li>\
                        <li>\
                            <span class="span-radio"><input type="radio" id="radio-width-240" autocomplete="off" name="radio-module-width" value="240" /></span>\
                            <label class="span-img" for="radio-width-240"><img src="http://img.china.alibaba.com/cms/upload/2013/203/013/1310302_983650061.png" /></label>\
                        </li>\
                        <li>\
                            <span class="span-radio"><input type="radio" id="radio-width-200" autocomplete="off" name="radio-module-width" value="200" /></span>\
                            <label class="span-img" for="radio-width-200"><img src="http://img.china.alibaba.com/cms/upload/2013/303/013/1310303_983650061.png" /></label>\
                        </li>\
                        <li>\
                            <span class="span-radio"><input type="radio" id="radio-width-712" autocomplete="off" name="radio-module-width" value="712" /></span>\
                            <label class="span-img" for="radio-width-712"><img src="http://img.china.alibaba.com/cms/upload/other/dcms/712.png" /></label>\
                        </li>\
                        <li>\
                            <span class="span-radio"><input type="radio" id="radio-width-512" autocomplete="off" name="radio-module-width" value="512" /></span>\
                            <label class="span-img" for="radio-width-512"><img src="http://img.china.alibaba.com/cms/upload/other/dcms/512.png" /></label>\
                        </li>\
                        <li>\
                            <span class="span-radio"><input type="radio" id="radio-width-472" autocomplete="off" name="radio-module-width" value="472" /></span>\
                            <label class="span-img" for="radio-width-472"><img src="http://img.china.alibaba.com/cms/upload/other/dcms/472.png" /></label>\
                        </li>\
                        <li>\
                            <span class="span-radio"><input type="radio" id="radio-width-232" autocomplete="off" name="radio-module-width" value="232" /></span>\
                            <label class="span-img" for="radio-width-232"><img src="http://img.china.alibaba.com/cms/upload/other/dcms/232.png" /></label>\
                        </li>\
                        <li>\
                            <span class="span-radio"><input type="radio" id="radio-width-192" autocomplete="off" name="radio-module-width" value="192" /></span>\
                            <label class="span-img" for="radio-width-192"><img src="http://img.china.alibaba.com/cms/upload/other/dcms/190.png" /></label>\
                        </li>\
                    </ul>\
                    <div class="edit-micro-layout"><div class="header"><h5 class="title">表格切分</h5></div><div class=" micro"><div class="dcms-box-layoutcontent micro-layout" data-eleminfo={"id":77,"tag":"","name":"微布局（勿删！）","type":"module","isResponsive":"1"}> <img class="dcms-box-right-image" src="http://img.china.alibaba.com/cms/upload/2012/704/364/463407_983650061.png" draggable="false"> <br><span>表格切分</span>  </div></div></div>\
                    <div class="tip-choose-width"><p class="msg-choose-width">请选择合适的尺寸</p></div></div>';
    
    var cell = '<div class="tab-nav">';
    cell += '<ul class="fd-clr">';
    cell += ' <li class="current"><a class="desc cell-a" id="nav_cell">控件库</a></li>';
    cell += '<li class="dcms-box-hide"><a class="desc cell-a" id="nav_cell_attr_edit">控件属性</a></li>';
    //cell += '<li class=""><a class="desc module-a" id="nav_attr_ds">接入数据源</a></li>';
    cell += ' </ul>';
    cell += '</div>';
    cell += ' <div class="box-edit-content">';
    cell += '<div class="panel-cell-content"><div class="edit-content"></div></div>';
    cell += '<div class="panel-edit-attr dcms-box-hide">';
    cell += ' <ul class="attr-tab fd-clr">';
    cell += ' <li><input type="checkbox" id="autocratic" name="autocratic"><label for="autocratic">该属性只对当前控件有效</label></li>';
    cell += '</ul>';
    cell += '<div class="attr-elem-layout">';
    cell += ' </div>';
    cell += '</div>';
    cell += ' </div>';

    var label = '<div class="tab-nav">';
    label += '<ul class="fd-clr">';
    // cell += ' <li class="current"><a class="desc cell-a" id="nav_cell">控件库</a></li>';
    label += '<li class="current"><a class="desc label-a" id="nav_label_attr_edit">元素属性</a></li>';
    //cell += '<li class=""><a class="desc module-a" id="nav_attr_ds">接入数据源</a></li>';
    label += ' </ul>';
    label += '</div>';
    label += ' <div class="box-edit-content">';
    // cell += '<div class="panel-cell-content edit-content"></div>';
    label += '<div class="panel-edit-attr">';
    label += ' <ul class="attr-tab fd-clr">';
    label += ' <li><input type="checkbox" id="autocratic" name="autocratic"><label for="autocratic">该属性只对当前控件有效</label></li>';
    label += '</ul>';
    label += '<div class="attr-elem-layout">';
    label += ' </div>';
    label += '</div>';
    label += ' </div>';
    var microLayout = '<div class="tab-nav">';
    microLayout += '<ul class="fd-clr">';
    microLayout += ' <li class="current"><a class="desc micro-a" id="nav_microlayout">表格切分</a></li>';
    //cell += '<li class="dcms-box-hide"><a class="desc cell-a" id="nav_cell_attr_edit">控件属性</a></li>';
    //cell += '<li class=""><a class="desc module-a" id="nav_attr_ds">接入数据源</a></li>';
    microLayout += ' </ul>';
    microLayout += '</div>';
    microLayout += '<div class="microlayout">';
    microLayout += '<dl class="micro-content">';
    microLayout += ' <dd class="">';
      microLayout += '   <div class="fd-clr wh">';
    microLayout += '     <div class="fd-left col disabled">';
    microLayout += '       <span >表格宽:</span>';
    microLayout += '      <input type="text" disabled="disabled" class="micro-input" id="tableWidth" />';
    microLayout += '    px';
    microLayout += '  </div>';
    microLayout += '   <!-- <div class="fd-left col">';
    microLayout += '         <span>高度:</span>';
    microLayout += '        <input type="text" class="micro-input" id="microHeight"  />';
    microLayout += '        px';
    microLayout += '      </div>-->';
    microLayout += '   </div>';
    microLayout += ' </dd>';
    microLayout += ' <dd class="">';
    microLayout += '   <div class="fd-clr wh">';
    microLayout += '     <div class="fd-left col disabled">';
    microLayout += '       <span >列宽:</span>';
    microLayout += '      <input type="text" disabled="disabled" class="micro-input" id="microWidth" />';
    microLayout += '    px';
    microLayout += '  </div>';
    microLayout += '   <!-- <div class="fd-left col">';
    microLayout += '         <span>高度:</span>';
    microLayout += '        <input type="text" class="micro-input" id="microHeight"  />';
    microLayout += '        px';
    microLayout += '      </div>-->';
    microLayout += '   </div>';

    microLayout += ' </dd>';
    microLayout += ' <dd class="" >';
    microLayout += '  <div class="cr">';
    microLayout += '    <div class="row col">';
    microLayout += '     <span>行:</span>';
    microLayout += '    <input type="text" class="micro-input" id="micro_row" />';

    microLayout += '  </div>';
    microLayout += '  <div class=" col">';
    microLayout += '  <span>列:</span>';
    microLayout += '   <input type="text" class="micro-input" id="micro_col"  />';

    microLayout += ' </div>';
    microLayout += ' </div>';

    microLayout += '<div class="opr"><ul class="col">';
    microLayout += ' <li class=" disabled"><a class="btn-basic txt merge-right-bin">';
    microLayout += '  向右合并';
    microLayout += '  </a></li>';
    microLayout += '   <li class=" disabled"><a class=" btn-basic txt merge-down-bin">';
    microLayout += '   向下合并';
    microLayout += '  </a></li>';
    microLayout += '  <li class=" disabled"><a class=" btn-basic txt no-margin-bottom merge-cancel-bin">';
    microLayout += '    取消合并';
    microLayout += ' </a></li>';
    microLayout += '</ul></div>';
    microLayout += '</dd>';
    // microLayout += ' <dd class="">';
    // microLayout += '<div class="border">';
    // microLayout += '  <span class="txt">边框:</span>';
    // microLayout += ' <input type="text" class="micro-input" id="microCol"  />';
    // microLayout += ' </div>';
    // microLayout += '  </dd>';
    microLayout += ' <dd class="">';
    microLayout += '<div class="border">';
    microLayout += ' <input type="checkbox"   id="border_transparent"  />';
    microLayout += '  <label for="border_transparent">边框透明</label>';

    microLayout += ' </div>';
    microLayout += '  </dd>';
    microLayout += '<dd class="no-bottom"><div class="micro-edit-finish"><a class="btn-basic micro-btn" id="micro_finish">编辑组属性</a><a id="micro_add_cell" class="btn-basic micro-btn">添加控件</a></div></dd>';
    microLayout += '</dl>';
    microLayout += '</div>';
    //页面栅格
    var pageGrids = ' <div class="tab-nav">';
    pageGrids += '<ul class="fd-clr">';
    pageGrids += '  <li class="current panel-grids"><a class="desc" id="nav_grids">栅格库</a></li>';
    pageGrids += ' </ul>';
    pageGrids += '</div>';
    pageGrids += ' <div class="page-grids box-edit-layout" id="edit_layout">';
    pageGrids +='<div class="top-line"><select id="layout-type" class="select-btn selected"><option selected="selected" value="layoutH990">行业990栅格系统</option><option value="layout" >全站952栅格系统</option><option value="layoutQ990">全站990栅格系统</option></select></div>';
    pageGrids += ' <div class="edit-layout"></div>';
    pageGrids += '  <div class="edit-float-layout"><div class="header"><h5 class="title">添加浮窗</h5></div><div class="content fd-clr"></div></div>';
    pageGrids += '<div class="bottom-line"><input type="checkbox" id="nav-banner" name="nav_banner" class="banner" /><label for="nav-banner" >顶部通栏</label><input type="checkbox" class="banner"  id="nav_footer" name="navFooter" /><label for="nav_footer">底部通栏</label></div>';
    pageGrids += '<div class="edit-micro-layout"><div class="header"><h5 class="title">表格切分</h5></div><div class=" micro"><div class="dcms-box-layoutcontent micro-layout" data-eleminfo={"id":77,"tag":"","name":"微布局（勿删！）","type":"module","isResponsive":"1"}> <img class="dcms-box-right-image" src="http://img.china.alibaba.com/cms/upload/2012/704/364/463407_983650061.png" draggable="false"> <br><span>表格切分</span>  </div></div></div>';
   
    pageGrids += '  </div>';
    
    var microLayoutModuleHtml = '<div class="crazy-box-module cell-module microlayout-demo" data-boxoptions={"css":[{"key":"background","name":"背景设置","type":"background"},{"key":"padding","name":"内边距","type":"ginputs"},{"key":"margin","name":"外边距","type":"ginputs"},{"key":"border","name":"边框","type":"border"}],"ability":{"copy":{"enable":"true"},"editAttr":[{"key":"id","name":"ID"}]}}>';
        microLayoutModuleHtml +=' <style data-for="cell-table-containter">';
        microLayoutModuleHtml +='  .cell-module .cell-table-containter {';
        microLayoutModuleHtml +='     width: 100%;';
        microLayoutModuleHtml +='       height: 100%;';
        microLayoutModuleHtml +=' table-layout: fixed;';
        microLayoutModuleHtml +='   }';
        microLayoutModuleHtml +='   cell-module .cell-table-containter .crazy-table-containter-td {';

        microLayoutModuleHtml +='  }';
        microLayoutModuleHtml +='  cell-module .cell-table-containter .crazy-table-containter-td:empty {';

        microLayoutModuleHtml +='  }';
        microLayoutModuleHtml +='   </style>';
        microLayoutModuleHtml +='   <table data-boxoptions=\'{"css":[{"key":"width","name":"宽度","type":"input"},{"key":"height","name":"高度","type":"input"},{"key":"border","name":"边框","type":"border"}]}\' class="crazy-box-microlayout crazy-box-enable-cell cell-table-containter">';
        microLayoutModuleHtml +='      <tbody><tr>';
        microLayoutModuleHtml +='    <td data-position="{&quot;row&quot;:0,&quot;col&quot;:0}" class="crazy-table-containter-td crazy-box-enable-cell tborder" data-boxoptions={"css":[{"key":"padding","name":"内边距","type":"ginputs"},{"key":"margin","name":"外边距","type":"ginputs"},{"key":"width","name":"宽度","type":"input"},{"key":"height","name":"高度","type":"input"},{"key":"border","name":"边框","type":"border"},{"key":"background","name":"背景","type":"background"}],"ability":{"container":{"enableType":"cell","number":"n"}}}></td>';
        microLayoutModuleHtml +='    <td data-position="{&quot;row&quot;:0,&quot;col&quot;:1}" class="crazy-table-containter-td crazy-box-enable-cell tborder" data-boxoptions={"css":[{"key":"padding","name":"内边距","type":"ginputs"},{"key":"margin","name":"外边距","type":"ginputs"},{"key":"width","name":"宽度","type":"input"},{"key":"height","name":"高度","type":"input"},{"key":"border","name":"边框","type":"border"},{"key":"background","name":"背景","type":"background"}],"ability":{"container":{"enableType":"cell","number":"n"}}}></td>';
        microLayoutModuleHtml +='   </tr>';
        microLayoutModuleHtml +='   <tr>';
        microLayoutModuleHtml +='     <td data-position="{&quot;row&quot;:1,&quot;col&quot;:0}" class="crazy-table-containter-td crazy-box-enable-cell tborder" data-boxoptions={"css":[{"key":"padding","name":"内边距","type":"ginputs"},{"key":"margin","name":"外边距","type":"ginputs"},{"key":"width","name":"宽度","type":"input"},{"key":"height","name":"高度","type":"input"},{"key":"border","name":"边框","type":"border"},{"key":"background","name":"背景","type":"background"}],"ability":{"container":{"enableType":"cell","number":"n"}}}></td>';
        microLayoutModuleHtml +='      <td data-position="{&quot;row&quot;:1,&quot;col&quot;:1}" class="crazy-table-containter-td crazy-box-enable-cell tborder" data-boxoptions={"css":[{"key":"padding","name":"内边距","type":"ginputs"},{"key":"margin","name":"外边距","type":"ginputs"},{"key":"width","name":"宽度","type":"input"},{"key":"height","name":"高度","type":"input"},{"key":"border","name":"边框","type":"border"},{"key":"background","name":"背景","type":"background"}],"ability":{"container":{"enableType":"cell","number":"n"}}}></td>';
        microLayoutModuleHtml +='    </tr>';
        microLayoutModuleHtml +='   </tbody></table>';
        microLayoutModuleHtml +='  </div>';
         //新建布局 选中组件
    var moduleLayoutDesignNav = '<ul class="fd-clr">';
    moduleLayoutDesignNav += '<li class="panel-page-module"><button id="change_page_grids">栅格库</button></li>';
    //moduleLayoutDesignNav += ' <li class="panel-page-module"><button id="change_background">页面背景</button></li>';
    moduleLayoutDesignNav += '</ul>';
         //新建页面
    var newPageDesignNav = '<ul class="fd-clr">';
    newPageDesignNav += '<li class="panel-page-module dcms-box-hide"><button id="change_page_grids">栅格库</button></li>';
    newPageDesignNav += ' <li class="panel-page-module"><button id="change_background">页面背景</button></li>';
    newPageDesignNav += '</ul>';
        //新建模版 左侧HTML代码
     var templateLayout = ' <div class="tab-nav">';
    templateLayout += '<ul class="fd-clr">';
    templateLayout += '  <li class="current panel-template-layout"><a class="desc" id="nav_layout">选择布局</a></li>';
    templateLayout += ' </ul>';
    templateLayout += '</div>';
    templateLayout +='<div class="box-layout-list"><div class="edit-content"></div><div class="page-pagination-nav"></div></div>';
     var templateDesignNav = '   <ul class="fd-clr">';
    templateDesignNav += ' <li class="panel-page-module dcms-box-hide"><button id="change_template">布局库</button></li>';
    templateDesignNav += ' <li class="panel-page-module dcms-box-hide"><button id="change_page_grids">栅格库</button></li>';
    templateDesignNav += ' <li class="panel-page-module"><button id="change_background">页面背景</button></li>'; 
    templateDesignNav += ' </ul>';
     

    
    var panelTab = $('#panel_tab'), panelNav = $('#panel_nav');
    var ToolsPanel = D.Class();
    ToolsPanel.fn = {
        constructor : ToolsPanel,
        init : function() {
            //this.panelTab = $('.panel-tab');
        },
    };

    ToolsPanel.extend({
        addHtmlLabel : function() {
            // var panelTab = $('#panel_tab'), panelNav = $('#panel_nav');
            panelNav.empty();
            //panelNav.append(pageDesignCellNav);

            panelTab.empty();
            panelTab.append(label);
        },
        addHtmlCell : function() {
            panelNav.empty();
            //console.log(panelNav);
            panelNav.append(pageDesignCellNav);
            panelTab.empty();
            panelTab.append(cell);
        },
        addHtmlTemplate : function() {
            //var panelTab = $('#panel_tab'), panelNav = $('#panel_nav');
            panelNav.empty();
            panelNav.append(pageDesignNav);
            panelTab.empty();
            panelTab.append(template);

        },
        addHtmlPageBackground : function() {
            //var panelTab = $('#panel_tab'), panelNav = $('#panel_nav');
            panelNav.empty();
            panelNav.append(pageDesignNav);
             var globalParams = $.unparam(location.href, '&');
            var templateType = $('#template_type').val()||globalParams.templateType||globalParams.template_type;
            if (templateType==='pl_template'){
                $('#change_template').html('布局库');
            }
            panelTab.empty();
            panelTab.append(background);
        },
        addHtmlModule : function() {
            // var panelTab = $('#panel_tab'), panelNav = $('#panel_nav');
            panelNav.empty();
            panelNav.append(pageDesignNav);
            panelTab.empty();
            panelTab.append(module);
        },
        //新建组件 选中组件
        addHtmlEModule: function(){
            panelNav.html(moduleDesignNav);
            panelTab.html(module);
        },
        addHtmlModuleGrids: function(){
            //panelNav.html(moduleDesignNav);
            panelNav.empty();
            panelTab.html(moduleGrids);
        },
        //栅格属性，“选择”栅格 add by hongss on 2012.12.05
        addHtmlLayouAttr: function(){
            panelTab.html(layout);
        },
        //microLayout
        addHtmlMicroLayout : function() {
            panelNav.empty();
            // panelNav.append(pageDesignNav);
            panelTab.empty();
            panelTab.append(microLayout);
        },
        //新建页面
        addHtmlPage:function(){
            panelNav.empty();
            panelNav.html(pageDesignNav);
              var globalParams = $.unparam(location.href, '&');
            var templateType = $('#template_type').val()||globalParams.templateType||globalParams.template_type;
            if (templateType==='pl_template'){
                $('#change_template').html('布局库');
            }
            panelTab.empty();
            panelTab.html(pageGrids);
        },
        //新建页面 选中组件
        addHtmlPageModule: function(){
            panelNav.empty();
            panelNav.append(newPageDesignNav);
            panelTab.empty();
            panelTab.html(module);
        },
         //新建页面 设置背景
        addHtmlPageBg: function(){
            panelNav.empty();
            panelNav.append(newPageDesignNav);
            panelTab.empty();
            panelTab.html(background);
        },
        //新建页面布局
        addHtmlLayout:function(){
            panelNav.empty();
            panelNav.html(templateDesignNav);
            panelTab.empty();
            panelTab.html(pageGrids);
        },
        //新建页面 从专场过来 选中组件
        addHtmlPageToolsSpecail:function(){
            panelNav.empty();
            panelNav.html(pageDesignNav);
            panelTab.empty();
            panelTab.html(module);
        },
         //新建布局 选中组件
        addHtmlLayoutModule: function(){
            panelNav.empty();
            panelNav.append(moduleLayoutDesignNav);
            panelTab.empty();
            panelTab.html(module);
        },
        /**
         * 新建模版 左则展示布局列表
         */
        addHtmlLayoutList:function(){
            panelNav.empty();
            panelNav.html(templateDesignNav);
            panelTab.html(templateLayout);
        },
        //新建模版 选中组件
        addHtmlTemplateModule:function(){
            panelNav.empty();
            panelNav.append(templateDesignNav);
            panelTab.empty();
            panelTab.html(module);
        }
    });
   ToolsPanel.MICRO_LAYOUT_HTML= microLayoutModuleHtml;
    D.ToolsPanel = ToolsPanel;
    

})(dcms, FE.dcms);
