('spuprice' in jQuery.fn)||
(function($){

		$.widget('ui.spuprice',{
			options:{
				'apiUrl'  : 'http://spu.1688.com/spu/ajax/getSpuOfferPrice.htm',  //接口地址
				'spuId'   : '',  // spuid
				'memberId':'',
				'offerId' : '',  //offerid
				'width'   : 952, //宽度
				'height'  : 450, //高度
				'cssStr'  : ''   //自定义样式
			},
			_create:function(){
				//this.initFlash();
				this._getData();
			},
			/**
			 * 初始化flash chart
			 * 如果对图表颜色有变动，可以在配置项中自定义cssStr字段
			 */
			_initFlash:function(data){
			
				var self = this,
					el = this.element,
					opt = this.options,
					cssStr;
					
				//默认图表样式	
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
			 *  获取数据
			 * 	offerId和spuId可提供任意一个，或者两个都提供
			 *  提供offerId会返回offer的价格趋势数据，提供spuId将返回spu的价格趋势数据，两个都提供则offer和spu的价格趋势都将返回
			 *  @param (type)类型，默认为初始化flash图表，如为“loadData”：load外部数据，
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
			 *  load数据，用于组件初始化成功后，laod外部数据
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