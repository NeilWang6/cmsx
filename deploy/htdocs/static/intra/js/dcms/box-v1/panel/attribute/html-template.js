/**
 *  html����ģ��
 * @author springyu
 */

;(function($, D) {
    //ģ��
    var template = ' <div class="tab-nav">';
    template += '  <ul class="fd-clr">';
    template += '   <li class="current panel-template"><a class="desc" id="sys_recommend">ϵͳ�Ƽ�</a></li>';
    template += '   </ul>';
    template += '  </div>';
    template += '    <div class="panel-template-content panel-template">';
    template += '     <div id="template_tag_list" class="template-content" data-pageid="">';
    // template += '       <div class="template-search">';
    //template += '        <ul class="fd-clr">';
    //template += '       <li><label for="keyword">ɸѡ��</label><input class="search-keyword" type="text" name="keyword" id="keyword" placeholder="ͨ���ؼ��ʻ�URL����" value=""/></li>';
    //template += '      <li><div class="template-search-btn"><button class="search-submit-btn dcms-btn submit-btn" id="search-template">����</button></div></li>';
    //template += '    </ul>';
    //template += '   </div>';
    template += '   <div class="template-body dcms-box-list"></div>';
    template += '    <div class="template-page fd-clr"></div>';
    template += '   </div>';
    template += '    </div>';
    //ҳ�汳��
    var background = ' <div class="tab-nav">';
    background += '<ul class="fd-clr">';
    background += '  <li class="current panel-background"><a class="desc" id="nav_background">����ҳ�汳��</a></li>';
    background += ' </ul>';
    background += '</div>';
    background += ' <div class="page-background" id="page_background">';
    background += ' <div id="attr_content" class="attr ">';
    background += '  </div>';
    background += '  </div>';
    //�������
    var module = '<div class="tab-nav">';
    module += '<ul class="fd-clr">';
    module += '<li class="current panel-module"><a class="desc module-a" id="nav_attr_edit"><span>��</span>����</a></li>';
    module += ' <li class="panel-module"><a class="desc module-a" id="nav_module">���</a></li>';
    //module += ' <li class="panel-module"><a class="desc module-a" id="nav_microlayout">΢����</a></li>';
    module += '<li class="panel-module"><a class="desc module-a" id="nav_attr_ds">��������Դ</a></li>';
    module += ' </ul>';
    module += '</div>';
    module += ' <div class="box-edit-content">';
    module += '<div class="panel-module-content dcms-box-hide"><div class="edit-content "></div></div>';
    module += '<div class="panel-module-ds dcms-box-hide"><div id="attr_dsModule" class="attr"></div></div>';
    module += '<div class="panel-edit-attr">';
    module += ' <ul class="attr-tab fd-clr">';
    module += ' <li><input type="checkbox" id="autocratic" name="autocratic"><label for="autocratic">������ֻ�Ե�ǰ�ؼ���Ч</label></li>';
    module += '</ul>';
    module += '<div class="attr-elem-layout">';
    module += ' </div>';
    module += '</div>';
    module += ' </div>';
    //layout���� add by hongss on 2012.12.05 for դ������
    var layout = '<div class="tab-nav">\
                    <ul class="fd-clr">\
                        <li class="current panel-module"><a class="desc module-a" id="nav_attr_edit">դ������</a></li>\
                    </ul>\
                  </div>\
                  <div class="box-edit-content">\
                    <div class="panel-edit-attr">\
                        <ul class="attr-tab fd-clr">\
                            <li><input type="checkbox" id="autocratic" name="autocratic"><label for="autocratic">������ֻ�Ե�ǰ�ؼ���Ч</label></li>\
                        </ul>\
                        <div class="attr-elem-layout"></div>\
                    </div>\
                  </div>';
    
    //��������
    var pageDesignNav = '   <ul class="fd-clr">';
    pageDesignNav += ' <li class="panel-page-module "><button id="change_template">����ģ��</button></li>';
    pageDesignNav += ' <li class="panel-page-module dcms-box-hide"><button id="change_background">ҳ�汳��</button></li>';
    pageDesignNav += ' <li class="dcms-box-hide panel-grid"><button id="change_page_grids">դ���</button></li>';
    pageDesignNav += ' </ul>';
    var pageDesignCellNav = '<ul class="fd-clr">';
    pageDesignCellNav += ' <li class="panel-cell dcms-box-hide"><button id="cell_library">�ؼ���</button></li>';
    pageDesignCellNav += ' </ul>';
    
    //�½����
    var moduleDesignNav = '<ul class="fd-clr">\
                            <li class="panel-page-module "><button id="change_mod_width">դ���</button></li>\
                          </ul>';
    var moduleGrids = '<div class="panel-module-width"><div class="tab-nav"><ul class="fd-clr"> <li class="current"><a class="desc cell-a" id="nav_grids">դ���</a></li> </ul></div>\
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
                    <div class="edit-micro-layout"><div class="header"><h5 class="title">����з�</h5></div><div class=" micro"><div class="dcms-box-layoutcontent micro-layout" data-eleminfo={"id":77,"tag":"","name":"΢���֣���ɾ����","type":"module","isResponsive":"1"}> <img class="dcms-box-right-image" src="http://img.china.alibaba.com/cms/upload/2012/704/364/463407_983650061.png" draggable="false"> <br><span>����з�</span>  </div></div></div>\
                    <div class="tip-choose-width"><p class="msg-choose-width">��ѡ����ʵĳߴ�</p></div></div>';
    
    var cell = '<div class="tab-nav">';
    cell += '<ul class="fd-clr">';
    cell += ' <li class="current"><a class="desc cell-a" id="nav_cell">�ؼ���</a></li>';
    cell += '<li class="dcms-box-hide"><a class="desc cell-a" id="nav_cell_attr_edit">�ؼ�����</a></li>';
    //cell += '<li class=""><a class="desc module-a" id="nav_attr_ds">��������Դ</a></li>';
    cell += ' </ul>';
    cell += '</div>';
    cell += ' <div class="box-edit-content">';
    cell += '<div class="panel-cell-content"><div class="edit-content"></div></div>';
    cell += '<div class="panel-edit-attr dcms-box-hide">';
    cell += ' <ul class="attr-tab fd-clr">';
    cell += ' <li><input type="checkbox" id="autocratic" name="autocratic"><label for="autocratic">������ֻ�Ե�ǰ�ؼ���Ч</label></li>';
    cell += '</ul>';
    cell += '<div class="attr-elem-layout">';
    cell += ' </div>';
    cell += '</div>';
    cell += ' </div>';

    var label = '<div class="tab-nav">';
    label += '<ul class="fd-clr">';
    // cell += ' <li class="current"><a class="desc cell-a" id="nav_cell">�ؼ���</a></li>';
    label += '<li class="current"><a class="desc label-a" id="nav_label_attr_edit">Ԫ������</a></li>';
    //cell += '<li class=""><a class="desc module-a" id="nav_attr_ds">��������Դ</a></li>';
    label += ' </ul>';
    label += '</div>';
    label += ' <div class="box-edit-content">';
    // cell += '<div class="panel-cell-content edit-content"></div>';
    label += '<div class="panel-edit-attr">';
    label += ' <ul class="attr-tab fd-clr">';
    label += ' <li><input type="checkbox" id="autocratic" name="autocratic"><label for="autocratic">������ֻ�Ե�ǰ�ؼ���Ч</label></li>';
    label += '</ul>';
    label += '<div class="attr-elem-layout">';
    label += ' </div>';
    label += '</div>';
    label += ' </div>';
    var microLayout = '<div class="tab-nav">';
    microLayout += '<ul class="fd-clr">';
    microLayout += ' <li class="current"><a class="desc micro-a" id="nav_microlayout">����з�</a></li>';
    //cell += '<li class="dcms-box-hide"><a class="desc cell-a" id="nav_cell_attr_edit">�ؼ�����</a></li>';
    //cell += '<li class=""><a class="desc module-a" id="nav_attr_ds">��������Դ</a></li>';
    microLayout += ' </ul>';
    microLayout += '</div>';
    microLayout += '<div class="microlayout">';
    microLayout += '<dl class="micro-content">';
    microLayout += ' <dd class="">';
      microLayout += '   <div class="fd-clr wh">';
    microLayout += '     <div class="fd-left col disabled">';
    microLayout += '       <span >����:</span>';
    microLayout += '      <input type="text" disabled="disabled" class="micro-input" id="tableWidth" />';
    microLayout += '    px';
    microLayout += '  </div>';
    microLayout += '   <!-- <div class="fd-left col">';
    microLayout += '         <span>�߶�:</span>';
    microLayout += '        <input type="text" class="micro-input" id="microHeight"  />';
    microLayout += '        px';
    microLayout += '      </div>-->';
    microLayout += '   </div>';
    microLayout += ' </dd>';
    microLayout += ' <dd class="">';
    microLayout += '   <div class="fd-clr wh">';
    microLayout += '     <div class="fd-left col disabled">';
    microLayout += '       <span >�п�:</span>';
    microLayout += '      <input type="text" disabled="disabled" class="micro-input" id="microWidth" />';
    microLayout += '    px';
    microLayout += '  </div>';
    microLayout += '   <!-- <div class="fd-left col">';
    microLayout += '         <span>�߶�:</span>';
    microLayout += '        <input type="text" class="micro-input" id="microHeight"  />';
    microLayout += '        px';
    microLayout += '      </div>-->';
    microLayout += '   </div>';

    microLayout += ' </dd>';
    microLayout += ' <dd class="" >';
    microLayout += '  <div class="cr">';
    microLayout += '    <div class="row col">';
    microLayout += '     <span>��:</span>';
    microLayout += '    <input type="text" class="micro-input" id="micro_row" />';

    microLayout += '  </div>';
    microLayout += '  <div class=" col">';
    microLayout += '  <span>��:</span>';
    microLayout += '   <input type="text" class="micro-input" id="micro_col"  />';

    microLayout += ' </div>';
    microLayout += ' </div>';

    microLayout += '<div class="opr"><ul class="col">';
    microLayout += ' <li class=" disabled"><a class="btn-basic txt merge-right-bin">';
    microLayout += '  ���Һϲ�';
    microLayout += '  </a></li>';
    microLayout += '   <li class=" disabled"><a class=" btn-basic txt merge-down-bin">';
    microLayout += '   ���ºϲ�';
    microLayout += '  </a></li>';
    microLayout += '  <li class=" disabled"><a class=" btn-basic txt no-margin-bottom merge-cancel-bin">';
    microLayout += '    ȡ���ϲ�';
    microLayout += ' </a></li>';
    microLayout += '</ul></div>';
    microLayout += '</dd>';
    // microLayout += ' <dd class="">';
    // microLayout += '<div class="border">';
    // microLayout += '  <span class="txt">�߿�:</span>';
    // microLayout += ' <input type="text" class="micro-input" id="microCol"  />';
    // microLayout += ' </div>';
    // microLayout += '  </dd>';
    microLayout += ' <dd class="">';
    microLayout += '<div class="border">';
    microLayout += ' <input type="checkbox"   id="border_transparent"  />';
    microLayout += '  <label for="border_transparent">�߿�͸��</label>';

    microLayout += ' </div>';
    microLayout += '  </dd>';
    microLayout += '<dd class="no-bottom"><div class="micro-edit-finish"><a class="btn-basic micro-btn" id="micro_finish">�༭������</a><a id="micro_add_cell" class="btn-basic micro-btn">��ӿؼ�</a></div></dd>';
    microLayout += '</dl>';
    microLayout += '</div>';
    //ҳ��դ��
    var pageGrids = ' <div class="tab-nav">';
    pageGrids += '<ul class="fd-clr">';
    pageGrids += '  <li class="current panel-grids"><a class="desc" id="nav_grids">դ���</a></li>';
    pageGrids += ' </ul>';
    pageGrids += '</div>';
    pageGrids += ' <div class="page-grids box-edit-layout" id="edit_layout">';
    pageGrids +='<div class="top-line"><select id="layout-type" class="select-btn selected"><option selected="selected" value="layoutH990">��ҵ990դ��ϵͳ</option><option value="layout" >ȫվ952դ��ϵͳ</option><option value="layoutQ990">ȫվ990դ��ϵͳ</option></select></div>';
    pageGrids += ' <div class="edit-layout"></div>';
    pageGrids += '  <div class="edit-float-layout"><div class="header"><h5 class="title">��Ӹ���</h5></div><div class="content fd-clr"></div></div>';
    pageGrids += '<div class="bottom-line"><input type="checkbox" id="nav-banner" name="nav_banner" class="banner" /><label for="nav-banner" >����ͨ��</label><input type="checkbox" class="banner"  id="nav_footer" name="navFooter" /><label for="nav_footer">�ײ�ͨ��</label></div>';
    pageGrids += '<div class="edit-micro-layout"><div class="header"><h5 class="title">����з�</h5></div><div class=" micro"><div class="dcms-box-layoutcontent micro-layout" data-eleminfo={"id":77,"tag":"","name":"΢���֣���ɾ����","type":"module","isResponsive":"1"}> <img class="dcms-box-right-image" src="http://img.china.alibaba.com/cms/upload/2012/704/364/463407_983650061.png" draggable="false"> <br><span>����з�</span>  </div></div></div>';
   
    pageGrids += '  </div>';
    
    var microLayoutModuleHtml = '<div class="crazy-box-module cell-module microlayout-demo" data-boxoptions={"css":[{"key":"background","name":"��������","type":"background"},{"key":"padding","name":"�ڱ߾�","type":"ginputs"},{"key":"margin","name":"��߾�","type":"ginputs"},{"key":"border","name":"�߿�","type":"border"}],"ability":{"copy":{"enable":"true"},"editAttr":[{"key":"id","name":"ID"}]}}>';
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
        microLayoutModuleHtml +='   <table data-boxoptions=\'{"css":[{"key":"width","name":"���","type":"input"},{"key":"height","name":"�߶�","type":"input"},{"key":"border","name":"�߿�","type":"border"}]}\' class="crazy-box-microlayout crazy-box-enable-cell cell-table-containter">';
        microLayoutModuleHtml +='      <tbody><tr>';
        microLayoutModuleHtml +='    <td data-position="{&quot;row&quot;:0,&quot;col&quot;:0}" class="crazy-table-containter-td crazy-box-enable-cell tborder" data-boxoptions={"css":[{"key":"padding","name":"�ڱ߾�","type":"ginputs"},{"key":"margin","name":"��߾�","type":"ginputs"},{"key":"width","name":"���","type":"input"},{"key":"height","name":"�߶�","type":"input"},{"key":"border","name":"�߿�","type":"border"},{"key":"background","name":"����","type":"background"}],"ability":{"container":{"enableType":"cell","number":"n"}}}></td>';
        microLayoutModuleHtml +='    <td data-position="{&quot;row&quot;:0,&quot;col&quot;:1}" class="crazy-table-containter-td crazy-box-enable-cell tborder" data-boxoptions={"css":[{"key":"padding","name":"�ڱ߾�","type":"ginputs"},{"key":"margin","name":"��߾�","type":"ginputs"},{"key":"width","name":"���","type":"input"},{"key":"height","name":"�߶�","type":"input"},{"key":"border","name":"�߿�","type":"border"},{"key":"background","name":"����","type":"background"}],"ability":{"container":{"enableType":"cell","number":"n"}}}></td>';
        microLayoutModuleHtml +='   </tr>';
        microLayoutModuleHtml +='   <tr>';
        microLayoutModuleHtml +='     <td data-position="{&quot;row&quot;:1,&quot;col&quot;:0}" class="crazy-table-containter-td crazy-box-enable-cell tborder" data-boxoptions={"css":[{"key":"padding","name":"�ڱ߾�","type":"ginputs"},{"key":"margin","name":"��߾�","type":"ginputs"},{"key":"width","name":"���","type":"input"},{"key":"height","name":"�߶�","type":"input"},{"key":"border","name":"�߿�","type":"border"},{"key":"background","name":"����","type":"background"}],"ability":{"container":{"enableType":"cell","number":"n"}}}></td>';
        microLayoutModuleHtml +='      <td data-position="{&quot;row&quot;:1,&quot;col&quot;:1}" class="crazy-table-containter-td crazy-box-enable-cell tborder" data-boxoptions={"css":[{"key":"padding","name":"�ڱ߾�","type":"ginputs"},{"key":"margin","name":"��߾�","type":"ginputs"},{"key":"width","name":"���","type":"input"},{"key":"height","name":"�߶�","type":"input"},{"key":"border","name":"�߿�","type":"border"},{"key":"background","name":"����","type":"background"}],"ability":{"container":{"enableType":"cell","number":"n"}}}></td>';
        microLayoutModuleHtml +='    </tr>';
        microLayoutModuleHtml +='   </tbody></table>';
        microLayoutModuleHtml +='  </div>';
         //�½����� ѡ�����
    var moduleLayoutDesignNav = '<ul class="fd-clr">';
    moduleLayoutDesignNav += '<li class="panel-page-module"><button id="change_page_grids">դ���</button></li>';
    //moduleLayoutDesignNav += ' <li class="panel-page-module"><button id="change_background">ҳ�汳��</button></li>';
    moduleLayoutDesignNav += '</ul>';
         //�½�ҳ��
    var newPageDesignNav = '<ul class="fd-clr">';
    newPageDesignNav += '<li class="panel-page-module dcms-box-hide"><button id="change_page_grids">դ���</button></li>';
    newPageDesignNav += ' <li class="panel-page-module"><button id="change_background">ҳ�汳��</button></li>';
    newPageDesignNav += '</ul>';
        //�½�ģ�� ���HTML����
     var templateLayout = ' <div class="tab-nav">';
    templateLayout += '<ul class="fd-clr">';
    templateLayout += '  <li class="current panel-template-layout"><a class="desc" id="nav_layout">ѡ�񲼾�</a></li>';
    templateLayout += ' </ul>';
    templateLayout += '</div>';
    templateLayout +='<div class="box-layout-list"><div class="edit-content"></div><div class="page-pagination-nav"></div></div>';
     var templateDesignNav = '   <ul class="fd-clr">';
    templateDesignNav += ' <li class="panel-page-module dcms-box-hide"><button id="change_template">���ֿ�</button></li>';
    templateDesignNav += ' <li class="panel-page-module dcms-box-hide"><button id="change_page_grids">դ���</button></li>';
    templateDesignNav += ' <li class="panel-page-module"><button id="change_background">ҳ�汳��</button></li>'; 
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
                $('#change_template').html('���ֿ�');
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
        //�½���� ѡ�����
        addHtmlEModule: function(){
            panelNav.html(moduleDesignNav);
            panelTab.html(module);
        },
        addHtmlModuleGrids: function(){
            //panelNav.html(moduleDesignNav);
            panelNav.empty();
            panelTab.html(moduleGrids);
        },
        //դ�����ԣ���ѡ��դ�� add by hongss on 2012.12.05
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
        //�½�ҳ��
        addHtmlPage:function(){
            panelNav.empty();
            panelNav.html(pageDesignNav);
              var globalParams = $.unparam(location.href, '&');
            var templateType = $('#template_type').val()||globalParams.templateType||globalParams.template_type;
            if (templateType==='pl_template'){
                $('#change_template').html('���ֿ�');
            }
            panelTab.empty();
            panelTab.html(pageGrids);
        },
        //�½�ҳ�� ѡ�����
        addHtmlPageModule: function(){
            panelNav.empty();
            panelNav.append(newPageDesignNav);
            panelTab.empty();
            panelTab.html(module);
        },
         //�½�ҳ�� ���ñ���
        addHtmlPageBg: function(){
            panelNav.empty();
            panelNav.append(newPageDesignNav);
            panelTab.empty();
            panelTab.html(background);
        },
        //�½�ҳ�沼��
        addHtmlLayout:function(){
            panelNav.empty();
            panelNav.html(templateDesignNav);
            panelTab.empty();
            panelTab.html(pageGrids);
        },
        //�½�ҳ�� ��ר������ ѡ�����
        addHtmlPageToolsSpecail:function(){
            panelNav.empty();
            panelNav.html(pageDesignNav);
            panelTab.empty();
            panelTab.html(module);
        },
         //�½����� ѡ�����
        addHtmlLayoutModule: function(){
            panelNav.empty();
            panelNav.append(moduleLayoutDesignNav);
            panelTab.empty();
            panelTab.html(module);
        },
        /**
         * �½�ģ�� ����չʾ�����б�
         */
        addHtmlLayoutList:function(){
            panelNav.empty();
            panelNav.html(templateDesignNav);
            panelTab.html(templateLayout);
        },
        //�½�ģ�� ѡ�����
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
