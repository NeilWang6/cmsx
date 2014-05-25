/**
 * ����Ͷ��λ
 * @author : yu.yuy
 * @createTime : 2011-03-11
 */
(function($, D){
    var timeId,
    cmsdomain = location.protocol+'//'+location.host,
    gridOperationsWrap = $('#boothListOperations'),
    searchPositionForm = $('#searchPositionForm'),
    pageNum = $('#pageNum'),
    pageModule = $('.dcms-page-module'),
    positionCategory;
    //��������������Ŀ����
    positionCategory = new D.Category($('#positionCategoryOne'), $('#positionCategoryTwo'), cmsdomain);
    positionCategory.reset($('#catalogId').val(),$('#catalogChildId').val());
    $('.booth-management tbody').delegate("tr", "mouseenter", function(){
        var container = $('.last-col',this);
        timeId = window.setTimeout(function(){
            gridOperationsWrap.appendTo(container);
            gridOperationsWrap.fadeIn();
        }, 300);
    });
    $('.booth-management tbody').delegate("tr", "mouseleave", function(){
        if(timeId){
            window.clearTimeout(timeId);
        }
        gridOperationsWrap.hide();
    });
    gridOperationsWrap.delegate(".favorites-btn", "click", function(e){
        var theCurrentTr = $(this).closest('tr');
        e.preventDefault();
    });
    gridOperationsWrap.delegate(".view-data-btn", "mouseenter", function(e){
        var theCurrentTr = $(this).closest('tr'),
        id = $('.position-id',theCurrentTr).val(),
        url = cmsdomain + '/position/chartPosition.html';
        $(this).attr('href', url+'?pid='+id);
        //e.preventDefault();
    });
    /*gridOperationsWrap.delegate(".remove-btn", "click", function(e){
        var theCurrentTr = $(this).closest('tr'),
        id = $('.position-id',theCurrentTr).val(),
        url = cmsdomain + '/position/deletePosition.html';
        e.preventDefault();
        if(confirm('ȷ��Ҫɾ����ҳ��λ����')){
            $.ajax(url,{
                dataType: "jsonp",
                data : {
                    id : id
                },
                success: function(o){
                    var canRemove = o['canRemove'],
                    isSuccess = o['isSuccess'];
                    if(canRemove==='logout'){
                        alert('�Բ������ȵ�¼��');
                    }
                    else if(canRemove==='isRelated'){
                        alert("�Բ��𣬸�ҳ��λ���޷�ɾ����");
                    }
                    else if(canRemove==='remove'){
                        if(isSuccess === true){
                            theCurrentTr.fadeOut(500, function(){
                                $(this).remove();
                            });
                            gridOperationsWrap.appendTo(document.body);
                        }
                        else{
                            alert('ɾ��ʧ�ܣ�');
                        }
                    }
                },
                error : function(){
                    alert('ɾ��ʧ�ܣ�');
                }
            });
        }
    });*/
    
    pageModule.delegate(".dcms-next-btn", "click", function(){
        var n = pageNum.val();
        pageNum.val(parseInt(n)+1);
        searchPositionForm.submit();
    });
    pageModule.delegate(".dcms-previous-btn", "click", function(){
        var n = pageNum.val();
        pageNum.val(parseInt(n)-1);
        searchPositionForm.submit();
    });
    pageModule.delegate(".dcms-first-page-btn", "click", function(){
        pageNum.val(1);
        searchPositionForm.submit();
    });
    
    /* add by hongss on 2011.03.17 for search */
    $('#dcms-search-position').click(function(){
        document.searchPosition.page.value = 1;
        $(this).submit();
        return true;
    });
    /* end */
   //D.popTree('selcategoryName','selcategoryName','selCategoryId','dgPopTree','admin/catalog.html');
   //modify by hongss on 2011.12.05
    var popTree = new D.PopTree(),
    categoryIdEl = $('#selCategoryId'),
    categoryEl = $('#selcategoryName');
    
    categoryEl.click(function(){
        popTree.show(categoryEl, categoryEl, categoryIdEl);
    });
})(dcms,FE.dcms);