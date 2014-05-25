/**
 * @author shanshan.hongss
 * @userfor 集采偏好楼层顺序 插件
 * @date  2014.02.14
 * @rely 
 * @modify  by 姓名 on 日期 for 修改的内容点(每次修改都要新增一条)
 */

;(function($, D, ED, undefined) {
    ED.loadHandler.add(function(doc, dropInpage){
        var editCover = $(ED.config.SELECTOR_LAYOUT_COVER, doc);
        showMenu(doc, dropInpage.config.dropArea, editCover);
        
        doMenu(doc);
    });
    
    //菜单显示
    function showMenu(doc, areaSelector, editCover){
        ED.widgetInterface('ED.selectLayout', {
            doc: doc, //iframe元素
            areaSelector: areaSelector,  //dropArea 选择器
            coverEl: editCover,
            done:function(moduleEl, e, coverEl){
                var attrFloorEl = coverEl.find('.area-opt ul.list-more li.set-attr-floor');
                if (!attrFloorEl[0]){
                    coverEl.find('.area-opt ul.list-more').append('<li class="set-attr-floor" title="楼层偏好设置">楼层偏好设置</li>');
                } else {
                    attrFloorEl.show();
                }
            },
            cancel: function(moduleEl, e, coverEl){
                var attrFloorEl = coverEl.find('.area-opt ul.list-more li.set-attr-floor');
                attrFloorEl.hide();
            }
        }, 'prefer-floor');

    }
    
    //操作菜单，楼层偏好设置
    function doMenu(doc){
        ED.layoutMenu({
            doc: doc,
            selector:'.set-attr-floor',
            bindType:'delegate',
            done:function(layoutEl, targetEl, event){
                var LAYOUT_FLOOR_PREFER = 'prefer',
                    LAYOUT_CONFIG_DATA_NAME = 'config',
                    strHtml = '<div class="form-vertical">\
                                    <dl class="item-form">\
                                        <dt class="topic must-fill">偏好设置层级：</dt>\
                                        <dd>\
                                            <select id="floor-desc-level">\
                                                <option value="buid">BU</option>\
                                                <option value="pinleiid">品类</option>\
                                                <option value="marketId">市场</option>\
                                                <option value="categoryId1">一级类目</option>\
                                                <option value="categoryId2">二级类目</option>\
                                                <option value="categoryId">叶子类目</option>\
                                            </select>\
                                        </dd>\
                                    </dl>\
                                    <dl class="item-form">\
                                        <dt class="topic must-fill">相应ID：</dt>\
                                        <dd>\
                                            <input id="floor-ids" type="text" value="" />\
                                            <p class="explain">多个ID之间请用英文逗号(,)分隔</p>\
                                        </dd>\
                                    </dl>\
                                </div>';
                
                D.Msg['confirm']({
                    'title' : '楼层偏好设置',
                    'body' : strHtml,
                    'onlymsg':false,
                    'success':function(e){
                        var dialogEl = e.data.dialog,
                            descLevel = dialogEl.find('#floor-desc-level').val(),
                            ids = dialogEl.find('#floor-ids').val(),
                            config = layoutEl.data(LAYOUT_CONFIG_DATA_NAME);
                        
                        if (!config){
                            config = {};
                        }
                        config[LAYOUT_FLOOR_PREFER] = descLevel+'-'+ids;
                        if (config[LAYOUT_FLOOR_PREFER] && !ids){
                            config[LAYOUT_FLOOR_PREFER] = null;
                        }
                        layoutEl.attr('data-'+LAYOUT_CONFIG_DATA_NAME, JSON.stringify(config));
                    }
                }, {
                    'open':function(e){
                        var dialogEl = $(e.target);
                        dialogEl.addClass('dialog-set-floor');
                        
                        //初始化已设置了偏好楼层属性的值
                        var config = layoutEl.data(LAYOUT_CONFIG_DATA_NAME),
                            attrFloor =  config && config[LAYOUT_FLOOR_PREFER];
                        if (attrFloor){
                            attrFloor = attrFloor.split('-');
                            dialogEl.find('#floor-desc-level').val(attrFloor[0]);
                            dialogEl.find('#floor-ids').val(attrFloor[1]);
                        }
                    },
                    'close':function(e){
                        $(e.target).removeClass('dialog-set-floor');
                    }
                });
            }
        }, 'attrFloor');
    }
})(dcms, FE.dcms, FE.dcms.box.editor);
