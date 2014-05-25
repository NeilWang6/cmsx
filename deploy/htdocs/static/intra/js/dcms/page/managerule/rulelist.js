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
        if(confirm('确认要删除该展示规则吗？')){
            $.ajax(url,{
                dataType: "jsonp",
                data : {
                    id : id
                },
                success: function(o){
                    var canRemove = o['canRemove'],
                    isSuccess = o['isSuccess'];
                    if(canRemove==='logout'){
                        alert('对不起，请先登录！');
                    }
                    else if(canRemove==='isRelated'){
                        alert("对不起，该展示规则无法删除！");
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
                            alert('删除失败！');
                        }
                    }
                },
                error : function(){
                    alert('删除失败！');
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
    
    //给搜索按钮绑定事件
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