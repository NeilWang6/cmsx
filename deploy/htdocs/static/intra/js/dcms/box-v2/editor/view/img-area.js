/**
 * @author shanshan.hongss
 * @userfor 
 * @date  2013.08.05 
 * @rely 
 * @modify  by ���� on ���� for �޸ĵ����ݵ�(ÿ���޸Ķ�Ҫ����һ��)
 */

;(function($, D, ED, O, undefined) {
    D.box.editor.loadHandler.add(function(doc, dropInpage){
        var editCover = $(ED.config.SELECTOR_DATAEDIT_COVER, doc);
        showMenu(doc, dropInpage.config.dropArea, editCover);
        
        doMenu(doc);
    });
    
    var IMG_AREA_KEY = 'sysImgArea',
        IMG_AREA_SELECTOR = 'selector',
        IMG_AREA_VALUE = 'value',
        IMG_AREA_CLASS_ON = 'img-area-on',
        IMG_AREA_CLASS_OFF = 'img-area-off',
        anchorTool, boxconfig;
    
    function showMenu(doc, areaSelector, editCover){
        ED.selectOptionModule({
            doc: doc, //iframeԪ��
            areaSelector: areaSelector,  //dropArea ѡ����
            coverEl: editCover,
            done:function(moduleEl, e, coverEl){
                var objImgArea = getObjImgArea(moduleEl),
                    targetEl = objImgArea && moduleEl.find(objImgArea[IMG_AREA_SELECTOR]),
                    imgareaEl = coverEl.find('.area-opt dd.img-area');
                
                if (targetEl && targetEl[0]){
                    if (!imgareaEl[0]){
                        coverEl.find('.area-opt').append('<dd title="��������" class="img-area '+IMG_AREA_CLASS_OFF+'">��������</dd>');
                    } else {
                        imgareaEl.show();
                    }
                }
                
            },
            cancel:function(moduleEl, e, coverEl){
                var targetEl = coverEl.find('.area-opt dd.img-area');
                targetEl.hide();
                //offImgArea(targetEl);
            } 
        });
    }
    
    function doMenu(doc){
        //����ͼƬ��������
        ED.editMenu({
            doc: doc,
            selector:'.'+IMG_AREA_CLASS_OFF,
            bindType:'delegate',
            done: function(moduleEl, targetEl, event){
                onImgArea(targetEl);
                
                var objImgArea = getObjImgArea(moduleEl),
                    data, relEl;
                
                if (objImgArea){
                    data = objImgArea[IMG_AREA_VALUE],
                    relEl = objImgArea && moduleEl.find(objImgArea[IMG_AREA_SELECTOR]);
                    
                    anchorTool = (data) ? O.Anchor(relEl, {doc:doc}, data) : O.Anchor(relEl, {doc:doc});
                    anchorTool.disable(false);
                    
                    ED.setStopOptionFire(true);
                }
                
            }
        }, 'imgAreaOn');
        
        //�ر�ͼƬ��������
        ED.editMenu({
            doc: doc,
            selector:'.'+IMG_AREA_CLASS_ON,
            bindType:'delegate',
            done: function(moduleEl, targetEl, event){
                offImgArea(targetEl);
                
                var objImgArea = getObjImgArea(moduleEl);
                if (objImgArea){
                    anchorTool.disable(true);
                    objImgArea[IMG_AREA_VALUE] = anchorTool.getModel();
                    moduleEl.attr('data-boxconfig', JSON.stringify(boxconfig));
                    
                    D.BoxTools.setEdited();  //��ʶ�Ѿ��޸�������
                    
                    ED.setStopOptionFire(false);
                }
                
                
            }
        }, 'imgAreaOff');
    }
    
    function getObjImgArea(moduleEl){
        boxconfig = moduleEl.data('boxconfig'),
        objImgArea = boxconfig && boxconfig[0][IMG_AREA_KEY];
        return objImgArea;
    }
    
    function onImgArea(targetEl){
        targetEl.addClass(IMG_AREA_CLASS_ON);
        targetEl.removeClass(IMG_AREA_CLASS_OFF);
        
    }
    
    function offImgArea(targetEl){
        targetEl.addClass(IMG_AREA_CLASS_OFF);
        targetEl.removeClass(IMG_AREA_CLASS_ON);
    }
    
})(dcms, FE.dcms, FE.dcms.box.editor, FE.orange);
