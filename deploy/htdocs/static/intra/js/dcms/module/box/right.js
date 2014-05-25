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
    var layoutFlag=true;
    var gridFlag=true;
    var outBroder=$('#dcms_box_modulecontent');
    var inBroder=$('#dcms_box_grid');
    var collectModule=$('#dcms_box_collect_ele');
    var findCell=$('#dcms_box_find_cell');
   //var cellCunontent=$('#dcms_box_cell_context');
   var readyFun = [
    /**
     * module库操作
     */
    function() {
        $('#close_layout_content').bind('click', function() {
            //rightCloseResize();
            $('#close_layout_content').parent().hide();
            $('#dcms_box_module_close').show();
            $('#dcms_box_moduleopen').show();
            
        });
        $('#dcms_box_moduleopen').bind('click', function() {
            $('#close_layout_content').parent().show();
            $('#dcms_box_module_close').hide();
            $(this).hide();
            //rightModuleResize();
        });
        
        $('#module_nav_bank').bind('click', function() {
            $('#module_second_bank').show();
            $('#module_second_ele').hide();
            $('#module_nav_ele').css('border-bottom', 'solid 1px #b0c6db');
            $('#module_nav_bank').css('border-bottom', 'none');
            inBroder.hide();
            findCell.hide();
            collectModule.hide();
            outBroder.show();
            //cellContent.hide();
            if(layoutFlag){
            	layoutFlag=false;
            	D.getLayoutShowData("/page/box/queryLayoutAjax.html","layout",outBroder);
            }
        });
        $('#module_nav_ele').bind('click', function() {
            $('#module_second_bank').hide();
            $('#module_second_ele').show();
            $('#module_nav_ele').css('border-bottom', 'none');
            $('#module_nav_bank').css('border-bottom', 'solid 1px #b0c6db');
            outBroder.hide();
            inBroder.hide();
            findCell.hide();
            collectModule.show();
            //cellContent.hide();
            D.getCellShowData("/page/box/queryCellAjax.html","fav",collectModule,1);
        });
        
         // D.divTensile('dcms-box-modulebar', {
           // block : 'iframe#dcms_box_main',
           // handles : {
                //right : true,
                //top:true,
                //bottom:true,
                //left:true
           // }
        //}, function(data) {
            //console.log(data);
        //});
       // $.use('ui-draggable', function() {
           // var con = 'document';
           // if ($.browser.mozilla){
               // con = 'html';
           // } 
            //$('#dcms_box_modulebar').draggable({
              //  handle : '.module-bar-nav',
             //   containment : con
           // });
       // });
    },
    /**
     * 
     */
    function(){
 
 
    },
     
    /**
     * 计算编辑布局和iframe的位置
     */
    function() {
        $(window).scroll(autoRight);
        $(window).resize(autoRight);
        setTimeout(autoRight, 50);
    },
    function(){
        $('#nav-out-border').bind('click', function(e) {//外框
            e.preventDefault();
            inBroder.hide();
            findCell.hide();
            collectModule.hide();
            outBroder.show();
            //cellContent.hide();
            if(layoutFlag){
            	layoutFlag=false;
            	D.getLayoutShowData("/page/box/queryLayoutAjax.html","layout",outBroder);
            }
        });
        $('#nav-in-border').bind('click', function(e) {//内框
        	inBroder.show();
            findCell.hide();
            collectModule.hide();
            outBroder.hide();
            //cellContent.hide();
            if(gridFlag){
            	gridFlag=false;
            	D.getLayoutShowData("/page/box/queryLayoutAjax.html","row",inBroder);
           }
        });
        $('#nav-collect-module').bind('click', function() {//收藏夹
        	inBroder.hide();
            findCell.hide();
            collectModule.show();
            outBroder.hide();
            //cellContent.hide();
       	 D.getCellShowData("/page/box/queryCellAjax.html","fav",collectModule,1);
       });
        $('#nav-find-module').bind('click', function() {//查找
        	inBroder.hide();
            findCell.show();
            collectModule.hide();
            outBroder.hide();
            //cellContent.hide();
       });
       $('#dcms-find-module-bn').bind('click', function() {
    	   inBroder.hide();
           findCell.hide();
           collectModule.show();
           outBroder.hide();
          // cellContent.show();
           var txt= $('#dcms-find-module-txt').val();
            D.getCellShowData("/page/box/queryCellAjax.html?_input_charset=UTF8","find",collectModule,1,txt);
          });
    	D.getLayoutShowData("/page/box/queryLayoutAjax.html","layout",outBroder);  //roobin.lij 初始化layout 数据
    },
    /**
     * @author zhuguo
     */
    function(){
        var btns = $('li.second-nav-title a');  
        $('#nav-out-border').addClass('a-selected');

        btns.bind('click',function(){
            btns.removeClass('a-selected');
            $(this).addClass('a-selected');
        });

        $('#module_nav_bank').bind('click', function() {
            btns.removeClass('a-selected');
            $('#nav-out-border').addClass('a-selected');
        });

        $('#module_nav_ele').bind('click', function() {
            btns.removeClass('a-selected');
            $('#nav-collect-module').addClass('a-selected');
        });
    }];

    var autoRight = function () {
         /**
         * window窗口
         */
        var winHeight = $(window).height(),winWidth = $(window).width();
        /**
         * 预览一行的高度和宽度
         */
        var _h = $('#dcms_box_grid_pre').parent().height(), _w = $('.db-operation-nav').width(),_left = (winWidth - _w)/2;
       $('.box-layout-content').css('left',_left-1);//1表示
       /**
        * 页面背景高度和宽度
        */
       var _hArea = $('#operation_area').height();
       var _hNav = $('.db-operation-nav').parent().height();
       /**
        * 底部属性高度
        */
       var _hBottom = $('#page_attribute').height();
       $('#page_attribute').css('width',winWidth-_left-150-5);
       //40 为头部高度 
       $('.box-layout-content').css('height',(winHeight-_h-40-4));
       //150为编辑内容和编辑布局的宽度 10为隐藏工具条宽度
       $('.dcms-box-center').css('width',winWidth-_left-150);
       // 40 为头部高度 10 为dcms-box-body的margin高度
       //$('.dcms-box-center').css('height',winHeight-_hArea-_hNav-_hBottom-40-10);
        $('.dcms-box-main').css('height',winHeight-_hArea-_hNav-_hBottom-40-10);
    };

    /**
     * @author pingchun.yupc
     * @userfor 右则module窗口放大缩小处理
     * @date 2012-01-04
     */
    var rightModuleResize = function() {
        var winHeight = $(window).height();
        var moduleBar = $('#dcms_box_modulecontent').outerHeight()+RIGHT_NAV_HEIGHT;
        if(moduleBar && moduleBar >= winHeight) {
            $('#dcms_box_modulebar').css('height', winHeight-10);
            $('#dcms_box_modulecontent').css('height', winHeight - RIGHT_NAV_HEIGHT-10);
        } else {
            $('#dcms_box_modulebar').css('height', RIGHT_MODULE_HEIGHT+15);
            $('#dcms_box_modulecontent').css('height', RIGHT_CONTENT_HEIGHT);
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
                               <div class="dcms-box-layoutcontent"  data-eleminfo="<%=$data[i].eleminfo%>">\
				               <img class="dcms-box-right-image" src="<%= $data[i].imageUrl%>" draggable="false">\
				               <br><span><%= $data[i].name%></span>\
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
           // dataType: "jsonp",
            type: "POST",
            data : {
                type : type,
                currentPageSize:currentPageSize,
                keyword:keyword
            },
            success: function(o){
             o=$.parseJSON(o);
               $.use('web-sweet', function(){
               var template = '<% for ( var i = 0; i < $data.length; i++ ) { %>\
                               <div class="dcms-box-layoutcontent">\
				               <img class="dcms-box-right-image" src="<%= $data[i].imageUrl%>"  data-eleminfo="<%=$data[i].eleminfo%>" draggable="false"  />\
            	               <br><span><%= $data[i].name%></span>\
				               </div>\
                               <% } %>';
               var data = o['dataList'];
               var html = FE.util.sweet(template).applyData(data);
               var type=o['type'];
               var countPage=o['pageSize'];
                   if(countPage>1){
                   	  if(type==='find'){
                      html+=' <div class="dcms-box-page"><a href="#" id="upPage">&lt;</a>'+o['currentPage']+' / '+countPage+'<a href="#" id="downPage">&gt;</a></div>';
                      }else{
                       html+=' <div class="dcms-box-page"><a href="#" id="upPageFav">&lt;</a>'+o['currentPage']+' / '+countPage+'<a href="#" id="downPageFav">&gt;</a></div>';
                      }
                      
                   }
               content.html(html);
               $('#upPage').bind('click', function() {//上一页
            	   inBroder.hide();
                   findCell.hide();
                   collectModule.show();
                   outBroder.hide();
                    var txt= $('#dcms-find-module-txt').val();
                    D.getCellShowData("/page/box/queryCellAjax.html?_input_charset=UTF8",o['type'],collectModule,o['previousPage'],txt);
                  });
              $('#downPage').bind('click', function() {//下一页
            	   inBroder.hide();
                   findCell.hide();
                   collectModule.show();
                   outBroder.hide();
                   var txt= $('#dcms-find-module-txt').val();
                    D.getCellShowData("/page/box/queryCellAjax.html?_input_charset=UTF8",o['type'],collectModule,o['nextPage'],txt);
                   
                  });
               $('#upPageFav').bind('click', function() {//上一页
            	   inBroder.hide();
                   findCell.hide();
                   collectModule.show();
                   outBroder.hide();
                   D.getCellShowData("/page/box/queryCellAjax.html",type,collectModule,o['previousPage']);
                  });
              $('#downPageFav').bind('click', function() {//下一页
            	   inBroder.hide();
                   findCell.hide();
                   collectModule.show();
                   outBroder.hide();
                   D.getCellShowData("/page/box/queryCellAjax.html",type,collectModule,o['nextPage']);
                  });
            });
            },
            error : function(){
            	 content.html("连接超时请重试！");
            }
        });
    };
})(dcms, FE.dcms);
