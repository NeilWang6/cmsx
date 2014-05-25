/**
 * @author springyu
 * @userfor 右则导航js
 * @date 2011-12-21
 */

;(function($, D) {
    /**
     * 右则module默认高度
     */
    var RIGHT_MODULE_HEIGHT = 512;
    var RIGHT_NAV_HEIGHT=70;
    var RIGHT_CONTENT_HEIGHT=455;
    var collectModule=$('#dcms_box_collect_ele');
    var findCell=$('#dcms_box_find_cell');
    var cellContent=$('#dcms_box_cell_context');
    var readyFun = [
    /**
     * module库操作
     */
    function() {
        $('#dcms_box_moduleclose').bind('click', function() {
            rightCloseResize();
            $('#dcms_box_modulebar').hide();
            $('#dcms_box_module_close').show();
            $('#dcms_box_moduleopen').show();
            
        });
        $('#dcms_box_moduleopen').bind('click', function() {
            $('#dcms_box_modulebar').show();
            $('#dcms_box_module_close').hide();
            $(this).hide();-10
            rightModuleResize();
        });
        D.divTensile('dcms-box-modulebar', {
            block : 'iframe#dcms_box_main',
            handles : {
                right : true,
                top:true,
                bottom:true,
                left:true
            }
        }, function(data) {
            //console.log(data);
        });
        $.use('ui-draggable', function() {
            var con = 'document';
            if ($.browser.mozilla){
                con = 'html';
            } 
            $('#dcms_box_modulebar').draggable({
                handle : '.module-bar-nav',
                containment : con
            });
        });
    },
     
    /**
     * 右则module窗口放大缩小处理
     */
    function() {
        $(window).scroll(autoRight);
        $(window).resize(autoRight);
        setTimeout(autoRight, 50);
    },
    function(){
        $('#nav-collect-module').bind('click', function() {//收藏夹
            findCell.hide();
            collectModule.show();
            cellContent.hide();
       	 D.getCellShowData("/page/box/queryCellAjax.html","fav",collectModule,1);
       });
        $('#nav-find-module').bind('click', function() {//查找
            findCell.show();
            collectModule.hide();
            cellContent.hide();
       });
       $('#dcms-find-module-bn').bind('click', function() {
           findCell.hide();
           collectModule.hide();
           cellContent.show();
           var txt= $('#dcms-find-module-txt').val();
            D.getCellShowData("/page/box/queryCellAjax.html?_input_charset=UTF8","find",cellContent,1,txt);
          });
        D.getCellShowData("/page/box/queryCellAjax.html","fav",collectModule,1);  //roobin.lij 初始化layout 数据
    },
    /**
     * @author zhuguo
     */
    function(){
        var btns = $('li.second-nav-title a');
        $('#nav-collect-module').addClass('a-selected');
        btns.bind('click',function(){
            btns.removeClass('a-selected');
            $(this).addClass('a-selected');
        });
    }
    ];

    function autoRight() {
        rightModuleResize();
        rightCloseResize();
    }

    /**
     * @author pingchun.yupc
     * @userfor 右则module窗口放大缩小处理
     * @date 2012-01-04
     */
    var rightModuleResize = function() {
        var winHeight = $(window).height();
        var moduleBar = $('#dcms_box_collect_ele').outerHeight()+RIGHT_NAV_HEIGHT;
        if(moduleBar && moduleBar >= winHeight) {
            $('#dcms_box_modulebar').css('height', winHeight-10);
            $('#dcms_box_collect_ele').css('height', winHeight - RIGHT_NAV_HEIGHT-10);
        } else {
            $('#dcms_box_modulebar').css('height', RIGHT_MODULE_HEIGHT+15);
            $('#dcms_box_collect_ele').css('height', RIGHT_CONTENT_HEIGHT);
        }
    };
    /**
     * @author pingchun.yupc
     * @userfor 右则close窗口放大缩小处理
     * @date 2012-01-04
     */
    var rightCloseResize = function() {
        var winHeight = $(window).height();
        var moduleClose = $('#dcms_box_module_close').outerHeight();
        if(moduleClose && moduleClose >= winHeight) {
            $('#dcms_box_module_close').css('height', winHeight);
        } else {
            $('#dcms_box_module_close').css('height', RIGHT_MODULE_HEIGHT);
        }
    };
    $(function() {
        for(var i = 0, l = readyFun.length; i < l; i++) {
            try {
                readyFun[i]();
            } catch(e) {
                if($.log) {
                    $.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
                }
            } finally {
                continue;
            }
        }
    });
    /**
     * @author roobin.lij   
     * @userfor 渲染页面设计右侧layout数据
     * @date 2012-01-07
     */
    FE.dcms.getLayoutShowData = function(url,type,content,callback){
        url = D.domain+url;
        $.ajax({
            url: url,
            dataType: "jsonp",
            data : {
                type : type
            },
            success: function(o){
               $.use('web-sweet,util-json', function(){
               var template = '<% for ( var i = 0; i < $data.length; i++ ) { %>\
                               <div class="dcms-box-layoutcontent">\
				               <img src="<%= $data[i].imageUrl%>" draggable="false"  data-eleminfo="<%=$data[i].eleminfo%>" >\
				               <input type="hidden" value="<%= $data[i].id %>"/>\
				               </div>\
                               <% } %>';
               var data = o['dataList'];
               var html = FE.util.sweet(template).applyData(data);
              content.html(html);
            });
            },
            error : function(){
            	 content.html("连接超时请重试！");
            }
        });
    };
    /**
     * @author roobin.lij   
     * @userfor 渲染页面设计右侧cell数据
     * @date 2012-01-07
     */
    FE.dcms.getCellShowData = function(url,type,content,currentPageSize,keyword,callback){
        url = D.domain+url;
        $.ajax({
            url: url,
            type: "POST",
            data : {
                type : type,
                currentPageSize:currentPageSize,
                keyword:keyword
            },
            success: function(o){
               //console.log(o.msg);
               o=$.parseJSON(o);
               $.use('web-sweet', function(){
               var template = '<% for ( var i = 0; i < $data.length; i++ ) { %>\
                               <div class="dcms-box-layoutcontent">\
				               <img class="dcms-box-right-image" src="<%= $data[i].imageUrl%>"  data-eleminfo="<%=$data[i].eleminfo%>"  draggable="false"  />\
            	               <br><span><%= $data[i].name%></span>\
				               </div>\
                               <% } %>';
               var data = o['dataList'];
               var html = FE.util.sweet(template).applyData(data);
               var countPage=o['pageSize'];
                   if(countPage>1){
                      html+=' <div class="dcms-box-page"><a href="#" id="upPage">&lt;</a>'+o['currentPage']+' / '+countPage+'<a href="#" id="downPage">&gt;</a></div>';
                   }
               content.html(html);
               $('#upPage').bind('click', function() {//上一页
                   findCell.hide();
                   collectModule.hide();
                   cellContent.show();
                   if(type==='find'){
                   var txt= $('#dcms-find-module-txt').val();
                    D.getCellShowData("/page/box/queryCellAjax.html?_input_charset=UTF8",type,cellContent,o['previousPage'],txt);
                   }else{
                	   D.getCellShowData("/page/box/queryCellAjax.html",type,cellContent,o['previousPage']);
                   }
                  });
               $('#downPage').bind('click', function() {//下一页
                   findCell.hide();
                   collectModule.hide();
                   cellContent.show();
                   if(type==='find'){
                   var txt= $('#dcms-find-module-txt').val();
                       D.getCellShowData("/page/box/queryCellAjax.html?_input_charset=UTF8",type,cellContent,o['nextPage'],txt);
                   }else{
                	   D.getCellShowData("/page/box/queryCellAjax.html",type,cellContent,o['nextPage']);
                   }
                  });
            });
            },
            error : function(){
            	 content.html("连接超时请重试！");
            }
        });
    };
})(dcms, FE.dcms);
