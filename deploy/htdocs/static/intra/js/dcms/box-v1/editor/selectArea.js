/**
 * @name zhuliqi
 */
(function($,D) {

	function selectArea(){


	}
	selectArea.prototype = {
		init: function(setting){
			//��ʼ������
			var $container = Dom,self = this;
			self.Default = {
				Dom: $('#dcms_box_main').contents(),
				minWidth:"50",
				minHeight:"20"
			}
			self.setting = $.extend({},self.Default,setting);
			var Dom = self.setting.Dom,
			doc = $('#dcms_box_main').contents();
			var imageConrainer = Dom.closest('div.image-maps-conrainer');
			if( Dom[0].nodeName !== "IMG" ) {return false;}

        	if(Dom.attr('data-dsoptions')) return false;
            Dom.attr({
                usemap: '#map' + doc.find('img').index(Dom),
                ref: 'imageMaps'
            })
            if( !Dom.parent().parent().parent().hasClass('image-maps-conrainer') ) {
            	Dom.parent().parent().wrap('<div class="image-maps-conrainer" now="false" style="position:relative;zoom:1;"></div>');
            	// .css({'border':'1px solid #ccc'});
            }
			imageConrainer = Dom.closest('div.image-maps-conrainer');
			//��ͼƬ�������ֲ�
			if(imageConrainer.find('div.position-conrainer').size() == 0 ) {
				imageConrainer.append($.browser.msie ? $('<div class="position-conrainer" style="position:absolute;z-index:1001"></div>').css({
								background:'#fff',
								opacity:0
							}) : '<div class="position-conrainer" style="position:absolute;z-index:1001"></div>');
			}
			//�����ֲ��ƶ���ͼƬ���ص�
			var _img_offset = Dom.offset();
			var _img_conrainer_offset = imageConrainer.offset();
			imageConrainer.find('.position-conrainer').css({
				top:_img_offset.top - _img_conrainer_offset.top,
				left:_img_offset.left - _img_conrainer_offset.left,
				width: Dom.width(),
				height: Dom.height()
			})
				
			//��ʼ���ص�ʱ������а�������Ϲ��ܱ��
			imageConrainer.find('.map-position').each(function(){
				if( $(this).find('span.delete').size() == 0 ) {
					$(this).append('<span class="delete"></span><span class="resize"></span>');
				}
			})
			//��ʼ���ؼ����Ƿ���Ա༭ê��İ�ť
			if ( imageConrainer.find('.chagenTarget').size() == 0 ) {
				imageConrainer.append('<div class="chagenTarget crazy-box-chagenTarget" work="unwork" style="background-color:#4083a9;padding:4px 8px;line-height:16px;font-size:12px;position:absolute;top:'+ (_img_offset.top - _img_conrainer_offset.top) +'px;left:'+ (_img_offset.left - _img_conrainer_offset.left) +'px;z-index:1002;color:#fff;">ê��</div>')
				imageConrainer.find('.chagenTarget').hover(function(){
					$(this).css({'background-color':'#0e5d9f'});
				},function(){
					$(this).css({'background-color':'#4083a9'});
				})
			}
			imageConrainer.find('.chagenTarget').unbind('click').click(function(e){
				e.stopPropagation();
				if( $(this).attr('work') == 'work' ) {
					//�ر�ê�㹦�ܷ���
					self.closeMao($(this),true);
				}else{
					//��ê�㹦��
					self.openMao($(this));
				}
			})
			var imgPosition = imageConrainer.find('.position-conrainer'),
			iframe = $('#dcms_box_main').contents();
			//����Ļ�ҲҪ��ʾPOSITIONCONRAINER
			imgPosition.show().find('.map-position').show();
			//Ĭ����ʾê�㰴ť
			imageConrainer.find('.chagenTarget').show();
	        if (Dom.length == 0) return false;		
			//A��ǩ��������
			imgPosition.unbind('mousedown').mousedown(function(e){
				e.preventDefault();
				if( imgPosition.siblings('.chagenTarget').attr('work') == 'work' ) {
					var bankThis = this;
					var clickDom = $(e.target);
					var nowlink = '',				
					index = iframe.find('.map-position').size() + 1,
					_this = this;
					//ȡ�����ֵ�������ֵ���Ƹ�INDEX
					var max = 0;
					iframe.find('.map-position').each(function(){
						var val = $(this).attr('ref');
						if( parseInt(val) > max ) {
							max = parseInt(val);
						}
					})
					index = max + 1 ;
					var moveePosition = {};
					if( clickDom.hasClass('position-conrainer') ) {
						var clickeDocumentPosition = {left:e.pageX,top:e.pageY},
						clickDomPosition = $(this).offset(),
						clickePosition = {left: clickeDocumentPosition.left - clickDomPosition.left,top: clickeDocumentPosition.top - clickDomPosition.top};
						nowlink = $(self._getLinkHtml(index,clickePosition.left,clickePosition.top,'#'));

						$(this).append(nowlink);
						self._define_css(imageConrainer,'1');
						nowlink = iframe.find('div.map-position[ref='+ index +']');
						$(this).unbind('mousemove.myevent').bind('mousemove.myevent',function(ee){
							ee.preventDefault();
							if( !self._jadgeMousePosition(ee,$(_this)) ){
								var mousemovePostition = {left:ee.pageX,top:ee.pageY};
								moveePosition = {left: mousemovePostition.left - clickDomPosition.left,top: mousemovePostition.top - clickDomPosition.top};						
								nowlink.css({width:mousemovePostition.left - clickeDocumentPosition.left,height:mousemovePostition.top - clickeDocumentPosition.top});
							}
						})
						$(this).unbind('mouseup').mouseup(function(e){				
							e.stopPropagation();
							$(this).unbind('mousemove.myevent');
							//С�ڵ�ɾ��
							if(parseInt(nowlink.width()) < self.setting.minWidth || parseInt(nowlink.height()) < self.setting.minHeight || nowlink === '') {
								nowlink.remove();
							} else if($(this).find('div.map-position').eq(-1).find('span.delete').size() == 0) {
								//���MAP��ͼ������Ӱ�ť����
								if( $(this).siblings('.chagenTarget').attr('work') == 'work' ){
									var index = iframe.find('div.map-position').length;
									nowlink.append('<span class="delete">X</span><span class="resize"></span>');
									self._define_css(imageConrainer,'1');
									bind_map_event();
									index++;										
								}
				
							}
						})
					}
				}
			})

			//�󶨱�ǩ�¼�
			function bind_map_event(){
				self._bind_map_event(Dom,iframe,self.setting.module)
			}
			
			bind_map_event();
			//�༭CSS��ʽ����
			function define_css(){
				self._define_css(imageConrainer);
			}
			define_css();

		},

		//�ⲿ���ã���Ϊ���ֲ�TARGET��ָ��ƫ��
		//����������ͼƬ��ô��ʵͼƬ�����л���ţ
		changeTarget: function(target){

		    if($(target).hasClass('position-conrainer')) {
                return $(target).prev().find('img');
            }else{
                return $(target);
            }
		},
		//�󶨱�ǩ�¼�
		_bind_map_event:function(Dom,iframe,module){
			var self = this;
			if(module == 'jianyi') {
				Dom.closest('.image-maps-conrainer').find('.position-conrainer').each(function(){
					$(this).unbind('click').bind('click',function(event){
						if($(this).siblings('.chagenTarget').attr('work') == 'work') {
							event.stopPropagation();
							event.preventDefault();							
						}
					})
				})				
			}

			Dom.closest('.image-maps-conrainer').find('.map-position-bg').each(function(){

				var map_position_bg = $(this);
				var conrainer = $(this).parents('div.position-conrainer');
				if(module == 'jianyi') {
					map_position_bg.unbind('click').click(function(event){
						if( $(this).closest('.image-maps-conrainer').find('.chagenTarget').attr('work') == 'work'){
							event.stopPropagation();
							event.preventDefault();						
						}

					})				
				}

				//��Ǳ�ǩ���µ���Ĺ���
				map_position_bg.unbind('mousedown').mousedown(function(event){
					event.stopPropagation();
					event.preventDefault();
					if( conrainer.siblings('.chagenTarget').attr('work') == 'work' ) {
						map_position_bg.data('mousedown', true);
						map_position_bg.data('pageX', event.pageX);
						map_position_bg.data('pageY', event.pageY);
						map_position_bg.css('cursor','move');
					}
					return false;
				}).unbind('mouseup').mouseup(function(event){
					event.stopPropagation();
					event.preventDefault();				
					if( conrainer.siblings('.chagenTarget').attr('work') == 'work' ) {
						map_position_bg.data('mousedown', false);
						map_position_bg.css('cursor','default');
					}
					return false;
				});
				//�ƶ���ǩλ��
				conrainer.mousemove(function(event){
					event.preventDefault();
					event.stopPropagation();
					if (!map_position_bg.data('mousedown')) return false;
                    var dx = event.pageX - map_position_bg.data('pageX');
                    var dy = event.pageY - map_position_bg.data('pageY');
                    if ((dx == 0) && (dy == 0)){
                        return false;
                    }
					var map_position = map_position_bg.parent();
					var p = map_position.position();
					var left = p.left+dx;
					if(left <0) left = 0;
					var top = p.top+dy;
					if (top < 0) top = 0;
					var bottom = top + map_position.height();
					if(bottom > conrainer.height()){
						top = top-(bottom-conrainer.height());
					}
					var right = left + map_position.width();
					if(right > conrainer.width()){
						left = left-(right-conrainer.width());
					}
					map_position.css({
						left:left,
						top:top
					});
					map_position_bg.data('pageX', event.pageX);
					map_position_bg.data('pageY', event.pageY);
					
					bottom = top + map_position.height();
					right = left + map_position.width();
					$('.link-conrainer p[ref='+map_position.attr('ref')+'] .rect-value').val(new Array(left,top,right,bottom).join(','));
					return false;
				}).mouseup(function(event){
					map_position_bg.data('mousedown', false);
					map_position_bg.css('cursor','default');
					return false;
				});
			});
			//�ı��ǩ��С
			Dom.closest('.image-maps-conrainer').find('.map-position .resize').each(function(){
				var map_position_resize = $(this);
				var conrainer = $(this).closest('.position-conrainer');
				var _this = this;
				if(module == "jianyi") {
					map_position_resize.unbind('click').click(function(event){
						event.stopPropagation();
					})			
				}
				map_position_resize.unbind('mousedown').mousedown(function(event){
					event.stopPropagation();
					map_position_resize.data('mousedown', true);
					map_position_resize.data('pageX', event.pageX);
					map_position_resize.data('pageY', event.pageY);
					return false;
				}).unbind('mouseup').mouseup(function(event){
					event.stopPropagation();
					map_position_resize.data('mousedown', false);
					return false;
				});
				var oldEvent = '';
				conrainer.mousemove(function(event){
					event.stopPropagation();
					if (!map_position_resize.data('mousedown')) return false;
					if(parseInt(map_position_resize.parent().width()) <= self.setting.minWidth || parseInt(map_position_resize.parent().height()) <= self.setting.minHeight)  {
						if(oldEvent != '' && (oldEvent.pageX > event.pageX || oldEvent.pageY > event.pageY)) {
							map_position_resize.data('mousedown',false);
							arguments.callee(event);	
						}
					}
					if( self._jadgeMousePosition(event,conrainer) ){
						return false;
					}
                    var dx = event.pageX - map_position_resize.data('pageX');
                    var dy = event.pageY - map_position_resize.data('pageY');
                    if ((dx == 0) && (dy == 0)){
                        return false;
                    }
					var map_position = map_position_resize.parent();
					var p = map_position.position();
					var left = p.left;
					var top = p.top;
					var height = map_position.height()+dy;
					if((top+height) > conrainer.height()){
						height = height-((top+height)-conrainer.height());
					}
					if (height < self.setting.minHeight) height = self.setting.minHeight;
					var width = map_position.width()+dx;
					if((left+width) > conrainer.width()){
						width = width-((left+width)-conrainer.width());
					}
					if(width < self.setting.minWidth) width = self.setting.minWidth;
					map_position.css({
						width:width,
						height:height
					});
					map_position_resize.data('pageX', event.pageX);
					map_position_resize.data('pageY', event.pageY);
					
					bottom = top + map_position.height();
					right = left + map_position.width();
					$('.link-conrainer p[ref='+map_position.attr('ref')+'] .rect-value').val(new Array(left,top,right,bottom).join(','));
					oldEvent = event;
					return false;
				}).mouseup(function(event){
					map_position_resize.data('mousedown', false);
					return false;
				});
			});
			//��ɾ������
			Dom.closest('.image-maps-conrainer').find('.position-conrainer').find('.map-position .delete').unbind('click').click(function(e){
				e.stopPropagation();
				var ref = $(this).closest('div.map-position').attr('ref');
				var _map_position = $(this).closest('div.map-position');
				_map_position.remove();
				var index = 1;
				iframe.find('.map-position').each(function(){
					$(this).attr('ref',index);
					index ++;
				});
				return false;
			});

		},
		//ҳ�����ʱ��ӹ��ܱ�ǩ
		addItemLink: function(imageConrainer){
			imageConrainer.find('div.map-position').each(function(){
				$(this).parent().addClass('position-conrainer');
				if( $(this).find('span.delete').size() == 0 ) {
					$(this).append('<span class="delete"></span><span class="resize"></span>');
				}
			})
		},
		//selectArea��Ԥ��ֵ
		setPreargue:function(iframe){
            images = iframe.find('img');
            for(var i=0; i <= images.length;i++) {
            	if(images.eq(i).attr('data-dsoptions')) continue ;
                images.eq(i).attr({
                    usemap: '#map' + i,
                    ref: 'imageMaps'
                })
                if( !images.eq(i).parent().parent().parent().hasClass('image-maps-conrainer') ) {
                	images.eq(i).parent().parent().wrap('<div class="image-maps-conrainer" now="false" style="position:relative;zoom:1;"></div>');
                	// .css({'border':'1px solid #ccc'});
                }
            }
            
		},
		//���ɱ�ǩHTML
		_getLinkHtml:function(index,left,top,href){
		return '<div ref="'+index+'" class="map-position" style="left:'+ left +'px;top:'+ top +'px;width:0px;height:0px;"><a class="map-position-bg" style="display:block;" local-href="'+ href +'"  data-boxoptions=\'{"ability":{"editAttr":[{"key":"target","name":"target����","type":"select","val":{"_blank":"�´���","_self":"��ǰҳ"}}]}}\'></a></div>'

		},
		//������A��ǩHTML���ɷ���
		_getAHtml:function(top,left,width,height,index,href) {
			return '<div ref="'+index+'" class="map-position" style="left:'+left+'px;top:'+top+'px;width:'+width+'px;height:'+height+'px;"><a class="map-position-bg" style="display:block" local-href="'+ href +'"></a><span class="delete">X</span><span class="resize"></span></div>';
		},
		//�ж����λ���Ƿ�����Ҫ������
		_jadgeMousePosition:function(mouse,positionbg){
			//������Ϊ��
			var offset = positionbg.offset(),self=this;
			offset.right = offset.left + positionbg.width();
			offset.bottom = offset.top + positionbg.height();
			if(mouse.pageX <= offset.left || mouse.pageX >= offset.right || mouse.pageY <= offset.top || mouse.pageY >= offset.bottom) {
				return true;
			}else{
				return false;
			}

		},
		  //����Ͷ�֮ǰ��TARGETɾ����ǰ��ǣ�������TARGET���ϵ�ǰ���
		attrNow: function(target,pretarget){
			if(target && pretarget) {
				pretarget.closest('.image-maps-conrainer').attr('now','false');
				target.closest('.image-maps-conrainer').attr('now','true');
			}
		},
		//�ر�ê�㹦�ܷ���
		closeMao: function($this,ismao){
			var self = this,
			positionConrainer = $this.siblings('.position-conrainer'),
			chagenTarget = positionConrainer.closest('.image-maps-conrainer').find('.chagenTarget');
			$this.attr('work','unwork').text('ê��');
			positionConrainer.find('span.delete').hide();
			positionConrainer.find('span.resize').hide();
			positionConrainer.css('z-index','0');
			self._define_css(positionConrainer);
			if(positionConrainer.find('span.delete').size() == 0 && !ismao) {
				positionConrainer.closest('.image-maps-conrainer').find('.chagenTarget').remove();
				positionConrainer.remove();

			}
		},
		openMao: function($this){
			var self = this,
			positionConrainer = $this.siblings('.position-conrainer');
			$this.attr('work','work').text('�ر�');
			positionConrainer.find('span.delete').show();
			positionConrainer.find('span.resize').show();
			positionConrainer.css('z-index','1001');
			self._define_css(positionConrainer,'1');

		},
		//����뿪ʱ��ȷ���Ƿ�С���趨ֵ���С���趨ֵ��ɾ��
		_makeSure:function(Dom){
			var pretarget,self=this;
			Dom.bind('mousedown',function(e){
				pretarget = e.target;
			}).unbind('mouseup').bind('mouseup',function(e){
				var target = e.target;
				if(pretarget != target) {
	                var mapPosition = $(pretarget).find('div.map-position');
	                mapPosition.each(function(i){
	                	if($(this).find('span.delete').size() == 0) {
	                		$(this).remove();
	                	}
	                })
	            }
			})
		},
		editButton: function(pretarget,target){
			//���ҵ��༭��ť
			var editButton,
			self = this;
			if(pretarget) {
				if( pretarget[0].nodeName.toUpperCase() == "IMG" ) {
					editButton = pretarget.parent().siblings('.chagenTarget');
				}
				 if( pretarget.closest('.image-maps-conrainer').size() > 0 ) {
					editButton = pretarget.closest('.image-maps-conrainer').find('.chagenTarget');
				}
				if( pretarget.closest('.image-maps-conrainer').attr('now') === 'false' ) {
					//�رձ༭ê�㹦��
					editButton.hide();
					self.closeMao(editButton,false);
					//pretarget.closest('.image-maps-conrainer').find('.map-position').hide();
					//�������û��ȷ����A��ǩȫ��ɾ��
					pretarget.closest('.image-maps-conrainer').find('.map-position').each(function(){
						if( $(this).find('span.delete').size() == 0 ) {
							$(this).remove();
						}
					})
				}
			}
		},
		//�ⲿ��������POSITION
		hidePosition: function(doc){
			$(doc).find('.position-conrainer').hide();
		},
		_define_css: function(imageConrainer,type){
			if( type == '1' ) {
				//��������ʹ��ڸ�SPAN����X
				imageConrainer.find('span.delete').text('X');
				imageConrainer.find('.map-position .resize').css({
					display:'block',
					position:'absolute',
					right:0,
					bottom:0,
					width:5,
					height:5,
					cursor:'nw-resize',
					background:'#3879d9'
				});
				imageConrainer.find('.map-position .delete').css({
					display:'block',
					position:'absolute',
					right:0,
					top:0,
					width:10,
					height:12,
					'line-height':'11px',
					'font-size':12,
					'font-weight':'bold',
					background:'#3879d9',
					color:'#fff',
					'font-family':'Arial',
					'padding-left':'2px',
					cursor:'pointer',
					opactiey : 1,
					'z-index': 1001
				});
			}

			//CSS
			imageConrainer.find('.map-position').css({
				position:'absolute',
				border:'1px solid #3879d9',
				zoom:1
			});
			imageConrainer.find('.map-position .map-position-bg').css({
				position:'absolute',
				background:'#3879d9',
				opacity:0.5,
				top:0,
				left:0,
				right:0,
				bottom:0,
				zoom:1
			});

		}

	}
  D.selectArea = selectArea;
})(dcms,FE.dcms); 