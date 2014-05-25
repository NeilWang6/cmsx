;(function($,T){
	function pageListCount (data) {
		this._default = {
            curPage: '',
            page: 0,//几页
            titlelist: 0,//多少条
            leftContent: '',//分页按钮左边内容
            rightContent: '',//分页按钮右边内容
            limit: 3,//显示分页个数
            width: 800 + 'px', //初始宽 
            left: 150 + 'px', //初始左侧定位
            curPageInput: $('input[name=curpage]').eq(0),
            transmitmode:'',//传输模式
            form: $('#pagefrmbottom'),//要提交的表单
            param: $('#pagefrmbottom input[name=page_num]'),//回传的表单内隐藏域
            noneShow:false
		}
		this.init = function(data){
			if( !data.noneShow ){
				if( !data.titlelist || data.titlelist == 0 ) return;
			}
			
			var _self = this;
			$.extend(this._default,data);			
			_self.data = data;			
			//渲染出页面
			_self.getHtml(data);
		}
		this.winresize = function(maxWidth,minWidth,width){
	        //自适应大小
	        $(window).resize(function(){
	            var winWidth = $(window).width();
	            // console.log(winWidth)
	            if((winWidth - 205) <= maxWidth && (winWidth - 205) >= minWidth){
	                $('#fixBottomPageList').width(winWidth - 205);
	            }else if( (winWidth - 205) > maxWidth ){
	                $('#fixBottomPageList').width(maxWidth)
	            }else if( (winWidth - 205) < minWidth ) {
	            	$('#fixBottomPageList').width(minWidth)
	            }                
	            // $('#fixBottomPageList').width
	        })
		}
		this.bindEvnet= function(data){
			var _self = this;
			//点页码
			$('li.pagination > a.pages').bind('click',function(){
				var toPage = $(this).data('page');
				//data.curPageInput.val(toPage);
				data.param.val(toPage);
				data.form.submit();
			})
			//点上下页
			$('#offer-page-prev').bind('click',function(){
				var toPage = parseInt(data.curPage) - 1;
				if( toPage == 0 ) {return}
				data.param.val(toPage);
				data.form.submit();
			})
			$('#offer-page-next').bind('click',function(){
				var toPage = parseInt(data.curPage) + 1;
				if( toPage > data.page ) {return}
				data.param.val(toPage);
				data.form.submit();
			})
			//页码后点击确定按钮
			$('.js-goto').click(function(){
                var toPage = $('input.js-jump-page').val();
                if( !isNaN(toPage) && parseInt(toPage) <= _self.data.page && parseInt(toPage) > 0 ) {
	 				data.param.val(toPage);
					data.form.submit();                    
                }else{
                    alert('请输入1 ~ ' + _self.data.page);
                }
            })
			$(".js-jump-page").live('keypress', function(event) {
                if(event.keyCode == '13') {
                    //var page = $(this).closest('.paging');
                    $('.js-goto').click();
                }
            });

		}
		this.ajaxBindEvent = function(data) {
            var _self = this;
            //点击页码跳转
            $('li.pagination > a.pages').live('click',function(){
                //获取页面
                var toPage = $(this).data('page');
                _self.data.curPageInput.val(toPage);
                //刷新页面
               	var reData = _self.data.flashContent();
                //刷新分页信息               
                _self.reflashpage(reData);
            })
            //点击上下页面跳转
            $('#offer-page-prev').click(function(){
                var curPage = parseInt($('input[name=curpage]').eq(formEq).val());
                if(curPage <= 1) return;
                var toPage = curPage - 1;
                _self.data.curPageInput.val(toPage);
                var reData = _self.data.flashContent();                
                _self.reflashpage(reData);
            })
            $('#offer-page-next').click(function(){
                var curPage = parseInt($('input[name=curpage]').eq(formEq).val());
                if(curPage >= _self.data.page) return;
                var toPage = curPage + 1;
                _self.data.curPageInput.val(toPage);
                var reData = _self.data.flashContent();               
                _self.reflashpage(reData);
            })
            //通过确定按钮跳转
            $('.js-goto').click(function(){
                var toPage = $('input.js-jump-page').val();
                if( !isNaN(toPage) && parseInt(toPage) <= _self.data.page && parseInt(toPage) > 0 ) {
                     _self.data.curPageInput.val(toPage);
                    var reData = _self.data.flashContent();               
                    _self.reflashpage(reData);
                }else{
                    alert('请输入1 ~ ' + _self.data.page);
                }
            })

            //通过键盘输入
            $(".js-jump-page").live('keypress', function(event) {
                if(event.keyCode == '13') {
                    //var page = $(this).closest('.paging');
                    $('.js-goto').click();
                }
            });	
		}
		this.reflashpage = function(data){
			$.use('web-sweet',function(){
			var htmlTemplate = '<% var j = 0;if( $data.curPage == $data.page && $data.page > ($data.limit - 1)) { %>\
										<a name="offer-page-num" data-page="<%= $data.page - $data.limit + 1 %>" href="javascript:;" class="pages offer-page-num"><%= $data.page - $data.limit + 1 %></a>\
									<%}\
									for( var i = ($data.curPage - parseInt($data.limit/2) ) ; i <= parseInt($data.page); i++ ) {\
									j++;if( j > parseInt($data.limit)){break};\
									if( i == 0 ) { continue };\
									if( $data.curPage == i ) {	%>\
										<span class="current"><%= i %></span>\
									<% } else{ %>\
										<a name="offer-page-num" data-page="<%= i %>" href="javascript:;" class="pages offer-page-num"><%= i %></a>\
									<% }\
								}\
								if ( $data.curPage == 1 && $data.page > ($data.limit - 1)  ) { %>\
									<a name="offer-page-num" data-page="<%= $data.limit %>" href="javascript:;" class="pages offer-page-num"><%= $data.limit%></a>\
								<% } %>';
			var html = FE.util.sweet(htmlTemplate).applyData(data);
			$('#offer-page-prev').nextUntil('#offer-page-next').remove();
			$('#offer-page-prev').after(html);
			})
		}
		this.getHtml= function(data){
			var _self = this;
			$.use('web-sweet',function(){
				var htmlTemplate = '<div id="fixBottomPageList" style="width:<%= $data.width%>;margin-left:<%= $data.left%>" class="fixed-bottom fix-bottom-total">\
									   	<div class="decorate">\
									        <i class="arrow-left"></i>\
									        <i class="arrow-right"></i>\
									    </div>\
									    <div class="fixed-body fixed-body-total">\
									    <div class="fix-bottom-optbar">\
									    	<%= $data.leftContent %>\
									    </div>\
									    <div class="page fix-bottom-pagebar">\
									    	<%= $data.rightContent %>\
									    	<div class="pagebar">\
									    		<ul class="paging-t">\
									    			<% if($data.page && $data.page > 0) {%>\
				    									<li class="pagination">\
															<a id="offer-page-prev" data-page="<%= $data.prePage%>" href="javascript:;" class="prev offer-page-num">上一页</a>\
															<% var j = 0;if( $data.curPage == $data.page && $data.page > ($data.limit - 1) ) { %>\
															<a name="offer-page-num" data-page="<%= $data.page - $data.limit + 1 %>" href="javascript:;" class="pages offer-page-num"><%= $data.page - $data.limit + 1 %></a>\
																<%}\
																for( var i = ($data.curPage - parseInt($data.limit/2) ) ; i <= parseInt($data.page); i++ ) {\
																j++;if( j > parseInt($data.limit)){break};\
																if( i == 0 ) { continue };\
																if( $data.curPage == i ) {	%>\
																	<span class="current"><%= i %></span>\
																<% } else{ %>\
																	<a name="offer-page-num" data-page="<%= i %>" href="javascript:;" class="pages offer-page-num"><%= i %></a>\
																<% }\
															}\
															if ( $data.curPage == 1 && $data.page > ($data.limit - 1) ) { %>\
																<a name="offer-page-num" data-page="<%= $data.limit %>" href="javascript:;" class="pages offer-page-num"><%= $data.limit%></a>\
															<% } %>\
															<a id="offer-page-next" data-page="<% $data.nextPage %>" href="javascript:;" class="next offer-page-num">下一页</a>\
														</li>\
														<li>共<em><%= $data.page %></em>页&nbsp;&nbsp;<%= $data.titlelist %>条&nbsp;&nbsp;\
															<input class="pnum js-jump-page" autocomplete="off" type="text">\
														</li>\
														<li>\
															<button type="button" class="js-goto btn-basic btn-gray">确 定</button>\
														</li>\
									    			<% } %>\
									    		<ul>\
									    	</div>\
									    </div>\
									    </div>\
									</div>'
				var html = FE.util.sweet(htmlTemplate).applyData(data);
				//重新设置宽度与LEFT值
				$('body').append($(html));
				//任务栏跟随
				_self.bunnerFlow();	
				//没有数据的时候仍然现实分页栏
				if(data.noneShow && data.titlelist <= 0) {
					$('#fixBottomPageList .fix-bottom-pagebar').hide();
				}
				//宽度跟随
				_self.winresize(data.maxWidth,data.minWidth,data.width)			
				//绑定方法
				if( data.transmitmode == 'ajax' ){
					_self.ajaxBindEvent(data);
				}else {
					_self.bindEvnet(data);
				}
				
			})

		}
		this.bunnerFlow = function() {
			var fixBottom = $('#fixBottomPageList');
			$('body').css('position','relative')
			var pretop = 0;
			var top = $(document).scrollTop();
			fixBottom.css({'top': top + $(window).height() - 44 });
			$(document).scroll(function(){
				// var documentHeight = $(document).height() - 400;
				// if( top + $(window).height() - 50 > $(document).height()){return};
				var top = $(document).scrollTop();
				// if( top + 10 > documentHeight) { top = pretop };				
				fixBottom.css({'top': top + $(window).height() - 44 })
				pretop = top;
			})
		}
	}
	T.pagelistall = pageListCount;
})(jQuery,FE.tools)