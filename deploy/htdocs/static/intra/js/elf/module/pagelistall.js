;(function($,T){
	function pageListCount (data) {
		this._default = {
            curPage: '',
            page: 0,//��ҳ
            titlelist: 0,//������
            leftContent: '',//��ҳ��ť�������
            rightContent: '',//��ҳ��ť�ұ�����
            limit: 3,//��ʾ��ҳ����
            width: 800 + 'px', //��ʼ�� 
            left: 150 + 'px', //��ʼ��ඨλ
            curPageInput: $('input[name=curpage]').eq(0),
            transmitmode:'',//����ģʽ
            form: $('#pagefrmbottom'),//Ҫ�ύ�ı�
            param: $('#pagefrmbottom input[name=page_num]'),//�ش��ı���������
            noneShow:false
		}
		this.init = function(data){
			if( !data.noneShow ){
				if( !data.titlelist || data.titlelist == 0 ) return;
			}
			
			var _self = this;
			$.extend(this._default,data);			
			_self.data = data;			
			//��Ⱦ��ҳ��
			_self.getHtml(data);
		}
		this.winresize = function(maxWidth,minWidth,width){
	        //����Ӧ��С
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
			//��ҳ��
			$('li.pagination > a.pages').bind('click',function(){
				var toPage = $(this).data('page');
				//data.curPageInput.val(toPage);
				data.param.val(toPage);
				data.form.submit();
			})
			//������ҳ
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
			//ҳ�����ȷ����ť
			$('.js-goto').click(function(){
                var toPage = $('input.js-jump-page').val();
                if( !isNaN(toPage) && parseInt(toPage) <= _self.data.page && parseInt(toPage) > 0 ) {
	 				data.param.val(toPage);
					data.form.submit();                    
                }else{
                    alert('������1 ~ ' + _self.data.page);
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
            //���ҳ����ת
            $('li.pagination > a.pages').live('click',function(){
                //��ȡҳ��
                var toPage = $(this).data('page');
                _self.data.curPageInput.val(toPage);
                //ˢ��ҳ��
               	var reData = _self.data.flashContent();
                //ˢ�·�ҳ��Ϣ               
                _self.reflashpage(reData);
            })
            //�������ҳ����ת
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
            //ͨ��ȷ����ť��ת
            $('.js-goto').click(function(){
                var toPage = $('input.js-jump-page').val();
                if( !isNaN(toPage) && parseInt(toPage) <= _self.data.page && parseInt(toPage) > 0 ) {
                     _self.data.curPageInput.val(toPage);
                    var reData = _self.data.flashContent();               
                    _self.reflashpage(reData);
                }else{
                    alert('������1 ~ ' + _self.data.page);
                }
            })

            //ͨ����������
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
															<a id="offer-page-prev" data-page="<%= $data.prePage%>" href="javascript:;" class="prev offer-page-num">��һҳ</a>\
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
															<a id="offer-page-next" data-page="<% $data.nextPage %>" href="javascript:;" class="next offer-page-num">��һҳ</a>\
														</li>\
														<li>��<em><%= $data.page %></em>ҳ&nbsp;&nbsp;<%= $data.titlelist %>��&nbsp;&nbsp;\
															<input class="pnum js-jump-page" autocomplete="off" type="text">\
														</li>\
														<li>\
															<button type="button" class="js-goto btn-basic btn-gray">ȷ ��</button>\
														</li>\
									    			<% } %>\
									    		<ul>\
									    	</div>\
									    </div>\
									    </div>\
									</div>'
				var html = FE.util.sweet(htmlTemplate).applyData(data);
				//�������ÿ����LEFTֵ
				$('body').append($(html));
				//����������
				_self.bunnerFlow();	
				//û�����ݵ�ʱ����Ȼ��ʵ��ҳ��
				if(data.noneShow && data.titlelist <= 0) {
					$('#fixBottomPageList .fix-bottom-pagebar').hide();
				}
				//��ȸ���
				_self.winresize(data.maxWidth,data.minWidth,data.width)			
				//�󶨷���
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