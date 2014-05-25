/*add by zhangfan*/
;(function( $, D, window, undefined ){

D.popTree = function(){};

var popTree = function(trigger,input,hidden,dialog,url){
    var
        trigger = $('#'+trigger),
        input = $('#'+input),
        dialog = $('#'+dialog),
        hidden = $('#'+hidden),
        listId = hidden.val()?hidden.val().split(','):[],

        oldListId = hidden.val(),
        oldName = input.val(),

        popTree = new D.Tree({
            render : $('.treePanel',dialog),
            url : D.domain+'/' + url,
            template: D.treeTemplate.limited
        });

    popTree.render();
    trigger.click(function(e){
        dialog.dialog({
            modal: false,
            css: {
                left: trigger.offset().left + 5 + dialog.width()/2,
                top: trigger.offset().top - $(document).scrollTop()
            }
        });
        popTree.set('checked', hidden.val()?hidden.val().split(','):[]);
        popTree.renderExpandChecked();
    });


    $('.close-btn,.cancel-btn').click(function(e){
        e.preventDefault();

        input.val(oldName);
        hidden.val(oldListId);
        listId = oldListId?oldListId.split(','):[];
        popTree.renderExpandChecked();

        $(this).closest('.dcms-dialog').dialog('close');

    });

    popTree.on('ui_checked',function(v,el){

        var self = this,

            listName = [],
            id = v.id;
        
        if( el.filter(':checked').length ){
            if($.inArray(id,listId) == -1 && id!=''){
                listId.push(id);
            }
        }else{
           listId =  $.grep( listId ,function( v, i ){
                return v!= id;
            });
        }

        $.each( listId , function(k,v){
            var info =  self.getNodeInfo(v);
            if(info){
                listName.push(  info.name );
            }
        });

        //hidden.val( listId.join(',') );
        input.val ( listName.join(',') );
    });

    $('.submit-btn',dialog).click(function(){
        var self = this;
        hidden.val( listId.join(',') );

        oldListId = hidden.val();
        oldName = input.val();
        $(self).closest('.dcms-dialog').dialog('close');
    });
    return popTree;
};
D.popTree = popTree;

})(jQuery, FE.dcms, window);