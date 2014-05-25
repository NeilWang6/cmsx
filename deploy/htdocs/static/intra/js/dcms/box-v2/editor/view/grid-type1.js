/**
 * @author shanshan.hongss
 * @userfor դ������ѡ�񡢱�����
 * @date  2013.08.16
 * @rely 
 * @modify  by ���� on ���� for �޸ĵ����ݵ�(ÿ���޸Ķ�Ҫ����һ��)
 */

;(function($, D, ED, undefined) {
    var pageId, templateId, draftId, type, gridType, pageContent,
        TYPE_NAME_PAGE = 'page',
        TYPE_NAME_TEMPLATE = 'template',
        TYPE_LAYOUT_PRE = 'layout',
        //DEFAULT_GRID_TYPE = 'layoutH990',
        pageContent = $('#textarea-content').text(),
        readyFun = [
        //��ʼ������ֵ
        function(){
            var pageIdEl = $('#pageId'),
                templateIdEl = $('#templateId');
            
            gridType = $('#gridType').val();
            draftId = $('#draftId').val();
            if (pageIdEl[0]){
                type = TYPE_NAME_PAGE;
                pageId = pageIdEl.val();
            } else if(templateIdEl[0]) {
                type = TYPE_NAME_TEMPLATE;
                templateId = templateIdEl.val();
            }
        },
        //���դ�����ͣ��½�(ҳ��|ģ��)ʱ���豣�浽�ݸ���ȥ
        function(){
            $(document).delegate('#select-grid', 'change', function(e){
                var selectEl = $(this),
                    gridTypeVal = selectEl.val(),
                    gridHiddenEl = selectEl.next('#hide-grid');
                //��������½�
                if (pageId || templateId){
                    var strHtml = '<div class="simple">\
                                     <i class="tui-icon-36 icon-question"></i>\
                                     <div class="msg">����դ�����ҳ������ȫ����գ�ȷ��Ҫ����դ��</div>\
                                   </div>';
                    D.Msg['confirm']({
                        title: '�༭�Զ������Դ��',
                        body: strHtml,
                        noclose: true,
                        success: function(e){
                            var data = {};
                            data['gridType'] = gridTypeVal;
                            //դ������ˢ��ҳ��
                            sendModifyGrid(data, function(){
                                location.reload();
                            });
                        },
                        close: function(){
                            selectEl.val(gridHiddenEl.val());
                        }
                    });
                    
                }
                gridHiddenEl.val(gridTypeVal);
            });
        },
        //��δȷ��դ�����͵���ҳ��|ģ��
        function(){
            if (!gridType && (pageId || templateId || draftId)){
                //�������󱣴�դ��
                var data = {};
                data['initOldBoxPage'] = true;
                data['gridType'] = getHtmlGridType(pageContent);
                sendModifyGrid(data, function(){
                    gridType = data['gridType'];
                });
            }
            
        }/*,
        //�½�ҳ��Ĭ��դ������ 
        function(){
            console.log(type);
            console.log(pageId);
            console.log(gridType);
            if (type===TYPE_NAME_PAGE && !pageId){
                var strGridType = gridType || DEFAULT_GRID_TYPE,  //����˻�Ĭ��gridType
                    gridSelectEl = $('#select-grid');
                console.log(strGridType);
                gridSelectEl.val(strGridType);
                gridSelectEl.nextAll('#hide-grid').val(strGridType);
            }
        }*/
    ];
    
    function sendModifyGrid(data, success){
        var url = D.domain + ED.config.AJAX_JSONP_URL;
        switch (type){
            case TYPE_NAME_PAGE:
                data['pageId'] = pageId ;
                break;
            case TYPE_NAME_TEMPLATE:
                data['templateId'] = templateId ;
        }
        data['draftId'] = draftId;
        data['event_submit_do_settingGridType'] = true;
        data['action'] = 'GridTypeAction';
        
        $.ajax({
            url: url,
            data: data,
            dataType: 'jsonp'
        }).done(function(o){
            if (o.status === 'success'){
                if (success && $.type(success)==='function'){
                    success.call(this, o);
                }
            } else {
                console.log(o.msg);
            }
        });
    }
    
    function getHtmlGridType(strHtml){
        var className = strHtml.match(/(dcms-crazy-box-q952)|(dcms-crazy-box-q990)|(dcms-crazy-box-h990)/g), strGridType;
        
        if (className && className[0]){
            strGridType = className[0].replace('dcms-crazy-box-', '');
            strGridType = TYPE_LAYOUT_PRE + strGridType.toUpperCase();
            return strGridType;
        }
        
        return '';
        
    }
    
    function getGridType(){
        if (!gridType){
            gridType = getHtmlGridType(pageContent);
        }
        return gridType;
    }
    
    var getLayoutParam = function(){
        var strParam = [],
            strGridType = getGridType();
        
        if (draftId){
            strParam.push('draftId='+draftId);
        }
        if (gridType){
            strParam.push('gridType='+strGridType);
        }
        if (pageId){
            strParam.push('pageId='+pageId);
        }
        if (templateId){
            strParam.push('templateId='+templateId);
        }
        return strParam.join('&');
    }
    
    ED.getLayoutParam = getLayoutParam;
    ED.getGridType = getGridType;
    
    $(function(){
        for (var i=0, l=readyFun.length; i<l; i++) {
            //try {
                readyFun[i]();
            /*} catch(e) {
                if (console.log) {
                    console.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
                }
            } finally {
                continue;
            }*/
        }
    });
    
})(dcms, FE.dcms, FE.dcms.box.editor);
