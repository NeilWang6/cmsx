/**
 * @author shanshan.hongss
 * @userfor ����ƫ��¥��˳�� ���
 * @date  2014.02.14
 * @rely 
 * @modify  by ���� on ���� for �޸ĵ����ݵ�(ÿ���޸Ķ�Ҫ����һ��)
 */

;(function($, D, ED, undefined) {
    ED.loadHandler.add(function(doc, dropInpage){
        var editCover = $(ED.config.SELECTOR_LAYOUT_COVER, doc);
        showMenu(doc, dropInpage.config.dropArea, editCover);
        
        doMenu(doc);
    });
    
    //�˵���ʾ
    function showMenu(doc, areaSelector, editCover){
        ED.widgetInterface('ED.selectLayout', {
            doc: doc, //iframeԪ��
            areaSelector: areaSelector,  //dropArea ѡ����
            coverEl: editCover,
            done:function(moduleEl, e, coverEl){
                var attrFloorEl = coverEl.find('.area-opt ul.list-more li.set-attr-floor');
                if (!attrFloorEl[0]){
                    coverEl.find('.area-opt ul.list-more').append('<li class="set-attr-floor" title="¥��ƫ������">¥��ƫ������</li>');
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
    
    //�����˵���¥��ƫ������
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
                                        <dt class="topic must-fill">ƫ�����ò㼶��</dt>\
                                        <dd>\
                                            <select id="floor-desc-level">\
                                                <option value="buid">BU</option>\
                                                <option value="pinleiid">Ʒ��</option>\
                                                <option value="marketId">�г�</option>\
                                                <option value="categoryId1">һ����Ŀ</option>\
                                                <option value="categoryId2">������Ŀ</option>\
                                                <option value="categoryId">Ҷ����Ŀ</option>\
                                            </select>\
                                        </dd>\
                                    </dl>\
                                    <dl class="item-form">\
                                        <dt class="topic must-fill">��ӦID��</dt>\
                                        <dd>\
                                            <input id="floor-ids" type="text" value="" />\
                                            <p class="explain">���ID֮������Ӣ�Ķ���(,)�ָ�</p>\
                                        </dd>\
                                    </dl>\
                                </div>';
                
                D.Msg['confirm']({
                    'title' : '¥��ƫ������',
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
                        
                        //��ʼ����������ƫ��¥�����Ե�ֵ
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
