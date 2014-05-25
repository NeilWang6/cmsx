('spuprice' in jQuery.fn)||
(function($){

		$.widget('ui.spuprice',{
			options:{
				'apiUrl'  : 'http://spu.1688.com/spu/ajax/getSpuOfferPrice.htm',  //�ӿڵ�ַ
				'spuId'   : '',  // spuid
				'memberId':'',
				'offerId' : '',  //offerid
				'width'   : 952, //���
				'height'  : 450, //�߶�
				'cssStr'  : ''   //�Զ�����ʽ
			},
			_create:function(){
				//this.initFlash();
				this._getData();
			},
			/**
			 * ��ʼ��flash chart
			 * �����ͼ����ɫ�б䶯�����������������Զ���cssStr�ֶ�
			 */
			_initFlash:function(data){
			
				var self = this,
					el = this.element,
					opt = this.options,
					cssStr;
					
				//Ĭ��ͼ����ʽ	
				cssStr = 'line dot label {\
						visibility	: hidden;\
					}\
					chart {\
						colors	: #69acff,#fe0000,#4D99DA,#CE5555,#DCBB29,#55BECE,#AF80DE;\
						animate	: true;\
						leftAxisVisibility	: visible;\
						bottomAxisVisibility : hidden;\
						smooth : true;\
						width: '+ (opt.width - 70) +';\
                		height: '+ (opt.height - 60) +';\
					}\
					yaxis {\
						tickColor	: #666666;\
						tickThickness	: null;\
						lineThickness	: null;\
					}\
					yAxis label {\
						color: #000;\
						fontSize: 12;\
					}\
					line {\
						alpha	: 1;\
						dropShadow	: none;\
						thickness	: 2;\
						lineMethod	: line;\
					}\
					line dot {\
						color	: #FFFFFF;\
						shape	: circle;\
						borderThickness	: 1;\
						borderColor	: inherit#color;\
						radius	: 3;\
						radius.hl : 3;\
					}\
					tooltip {\
						enabled	: true;\
					}\
					canvas {\
						borderThickness	: 2;\
						borderColor	: #545454;\
						backgroundColor2 : #f7f7f7;\
						priLineThickness : 1;\
						secLineThickness : 1;\
						secLineColor : #e3e3e3;\
					}\
					xaxis {\
						tickThickness	: 0;\
						lineThickness	: 0;\
						labelGap: auto;\
					}\
					legend {\
						paddingRight	: 0;\
						position	: top;\
						align	: right;\
					}';
				
				$.use('ui-flash-chart', function(){    
	              var chart = el.flash({ 
	                 module     : 'chart', 
	                 type       : 'line', 
	                 width      : opt.width, 
	                 height     : opt.height, 
	                 flashvars  : { 
						width:opt.width-70,
						height:opt.height-60,
	                    css : opt.cssStr || cssStr,
						data : data
	                 } 
	              }); 
	           });
			},
			
			/**
			 *  ��ȡ����
			 * 	offerId��spuId���ṩ����һ���������������ṩ
			 *  �ṩofferId�᷵��offer�ļ۸��������ݣ��ṩspuId������spu�ļ۸��������ݣ��������ṩ��offer��spu�ļ۸����ƶ�������
			 *  @param (type)���ͣ�Ĭ��Ϊ��ʼ��flashͼ����Ϊ��loadData����load�ⲿ���ݣ�
			 */
			
			_getData:function(type){
				var self = this,
					opt = this.options,
					el = this.element,
					url= opt.apiUrl;
					
				if (!url){ return; }
				
				$.ajax(url,{
					dataType:'jsonp',
					data:{
						'spuId':opt.spuId || '',
						'offerId':opt.offerId || '',
						'memberId':opt.memberId ||''
					},
					success:function(data){
						if(type === 'loadData'){
							data && el.flash('getFlash').parse(data);
						}else{
							data && self._initFlash(data);
						}
					},
					error:function(e,o){
						$.log(e)
					}
				});
				
			},
			/**
			 *  load���ݣ����������ʼ���ɹ���laod�ⲿ����
			 */
			loadData:function(o){
				var opt = this.options,
					offerId = o.offerId || '',
					spuId = o.spuId || '';
				
				if(!offerId && !spuId) {return;}
				
				opt.spuId = spuId;
				opt.offerId = offerId;
				
				this._getData('loadData');
			}

		});
	// });
	$.add('ui-spuprice');	
})(jQuery);