/**
 * @package FD.app.cms.rule.manage
 * @author: hongss
 * @Date: 2011-03-09
 */


(function($, D){
    var gridOperationsWrap = $('#ruleListOperations'),
    cmsdomain = location.protocol+'//'+location.host,
    modObj = $('.dcms-page-module'),
    page = $('#page-num'),
    searchRule = $('#searchRule'),
    timeId;
    
    var ruleCategory = new D.Category($('#ruleCategoryOne'), $('#ruleCategoryTwo'), cmsdomain);
    ruleCategory.reset($('#catalogId').val(),$('#catalogChildId').val());
    
    $('.dcms-search-list tbody').delegate("tr", "mouseenter", function(){
        var container = $('td:last-child',$(this)),
        isWrap = ($('.dcms-grid-operations-wrap', container).length>0);
        timeId = window.setTimeout(function(){
            if (!isWrap) {
                gridOperationsWrap.appendTo(container);
            }
            gridOperationsWrap.fadeIn();
        }, 300);
    });
    $('.dcms-search-list tbody').delegate("tr", "mouseleave", function(){
        if(timeId){
            window.clearTimeout(timeId);
        }
        gridOperationsWrap.hide();
    });
    
    gridOperationsWrap.delegate(".view-data-btn", "mouseenter", function(e){
        var theCurrentTr = $(this).closest('tr'),
        id = $(this).closest('td').data('ruleid'),
        url = cmsdomain + '/position/chart_rule.html';
        $(this).attr('href', url+'?rid='+id);
        //e.preventDefault();
    });
    /*gridOperationsWrap.delegate(".remove-btn", "click", function(e){
        var theCurrentTr = $(this).closest('tr'),
        id = $(this).closest('td').data('ruleid'),
        url = cmsdomain + '/position/delete_rule.html';
        e.preventDefault();
        if(confirm('ȷ��Ҫɾ����չʾ������')){
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
                        alert("�Բ��𣬸�չʾ�����޷�ɾ����");
                    }
                    else if(canRemove==='remove'){
                        if(isSuccess === true){
                            theCurrentTr.fadeOut(500, function(){
                                $(this).animate({
                                    height : 0
                                },300);
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
    
    modObj.delegate(".dcms-next-btn", "click", function(){
        var n = page.val();
        if (n==='') { n=1; }
        page.val(parseInt(n)+1);
        searchRule.submit();
    });
    modObj.delegate(".dcms-previous-btn", "click", function(){
        var n = page.val();
        page.val(parseInt(n)-1);
        searchRule.submit();
    });
    modObj.delegate(".dcms-first-page-btn", "click", function(){
        page.val(1);
        searchRule.submit();
    });
    
    //��������ť���¼�
    $('#dcms-search-rule-btn').click(function(){
        $('#page-num').val(1);
        $(this).submit();
        return true;
    });
    //D.popTree('selcategoryName','selcategoryName','selCategoryId','dgPopTree','admin/catalog.html');
    //modify by hongss on 2011.12.05
    var popTree = new D.PopTree(),
    categoryIdEl = $('#selCategoryId'),
    categoryEl = $('#selcategoryName');
    
    categoryEl.click(function(){
        popTree.show(categoryEl, categoryEl, categoryIdEl);
    });
})(dcms, FE.dcms);