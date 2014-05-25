/*
 * 行业搜索公用头部masthead
*/
(function($){

	$(function(){
	//noformat
	var masthead = $('#ali-masthead-5i');
	if(!masthead.length){
		return;
	}
	var form = $('form', masthead),
		switchMarket = $('div.ali-market-list', masthead),
		searchType = $('div.alisearch-type ul', masthead),
		searchContainer = $('div.alisearch-container', masthead),
		keywords = $('input[name=keywords]', searchContainer),
		from = $('input[name=from]', searchContainer),
		industryFlag = $('input[name=industryFlag]', searchContainer),
		searchKeywords = keywords.parent(),
		searchMarket = $('button.market', searchContainer),
		searchGlobal = $('button.global', searchContainer),
		submit = searchMarket,
		ie6 = $.util.ua.ie6,
		placeholderLabel,
		currentType,
		currentCfg,
		suggestion;
	//format
	var handlers = { 
		/**
		 * placeholder
		 */
		placeholderInit: function(placeholder){
			var element = keywords;
				//检查搜索元素的html标签中是否有placeholder属性,如果没有，此函数不执行
				if (!placeholder) return;	
				
				   //检查搜索元素是否支持HTML5的placeholder属性,如果不支持，则运行以下程序模拟placeholder属性     
				if (element.length >0 && !("placeholder" in document.createElement("input"))) {
					if(placeholderLabel){
						placeholderLabel.style.left=element.position().left+'px';
				}else{
					//当前文本控件是否有id, 没有则创建
					var idLabel = element.attr('id');
					if (!idLabel) {
						idLabel = "placeholder_" + new Date().getTime();
						element.attr('id', idLabel);
					}
					//创建label元素
					var eleLabel = document.createElement("label");              
					eleLabel.htmlFor = idLabel;
					//eleLabel.className='label-placeholder';					
					eleLabel.style.left=element.position().left+'px';  
					//插入创建的label元素节点
					element.before(eleLabel);
					placeholderLabel=eleLabel;
					$(eleLabel).css({"position":"absolute","height":"20px","line-height":"20px","padding-left":"5px","color":"#bbb","z-index":"995","cursor":"text","white-space":"nowrap"});		
				}
					//事件注册				
					element.bind('focus',function() {
						placeholderLabel.innerHTML = "";					
					});  
					element.bind('blur',function() {					                 
						if (element.val() == "") {
							placeholderLabel.innerHTML = placeholder;
						}
					}); 
					var lastCall=(new Date()).getTime(),resizeDefer,resizeThrottle =60,win=window;
					var positionLeft=function(event){
						var now = (new Date()).getTime();
						if(lastCall && now - lastCall < resizeThrottle ){
							win.clearTimeout( resizeDefer );
							resizeDefer = win.setTimeout(positionLeft, resizeThrottle);
							return;
						}
						else {							
							lastCall = now;							
						}
						placeholderLabel.style.left=element.position().left+'px';
					};
					$(window).bind("resize",positionLeft);
					//placeholder属性样式初始化
					if (element.val() == "") {
						placeholderLabel.innerHTML = placeholder;
					}
				}						
		},
		/**
		 * 类目切换
		 */
		typeInit: function(){
			var currentLi = searchType.find('li.current').get(0);
			searchType.on('mouseenter',function(){$(this).addClass('hover');}).on('mouseleave',function(){$(this).removeClass('hover');});
			//主类目
			searchType.delegate('li', 'click', typeChangeHandler);
			$('a', searchType).click(function(e){
				e.preventDefault();
			});
			//初始化搜索类目
			if (currentLi) {
				typeChangeHandler.call(currentLi, $.Event('click'), true);
			}
			/**
			 * 搜索大类别切换处理函数
			 * @param {Object} e
			 * @param {Object} isinit
			 */
			function typeChangeHandler(e, isinit){
				var li = $(this), type, config;
				if (!isinit && li.hasClass('current')) {
					return;
				}
				$('>li', searchType).removeClass('current');
				searchType.removeClass('hover');
				li.addClass('current');
				searchType.prepend(li);
				type = li.data('type');
				config = currentCfg = eval('(' + li.data('config') + ')');				
				configChangeHandler(currentCfg);
				currentType = type;
			}
		},
		/**
		 * 关键字搜索建议
		 */
		suggestionInit: function(){
			$.add('web-suggestion', {
				requires: ['ui-autocomplete'],
				js: ['suggestion.js']
			});
			if (currentCfg && currentCfg.suggest) {
				$.use('web-suggestion', function(){
					suggestion = new FE.ui.Suggestion(keywords, {
						appendTo: searchKeywords,
						url: currentCfg.url,
						type: currentCfg.type,
						position: {
							my: 'left top',
							at: 'left bottom',
							offset: '-5 0'
						},
						history:true,
						widthfix: 8,
						onSelected: function(e, ui){
							submit.click();
						}
					});	
				});
			}			
		},
		/**
		 *更多市场
		 */
		marketInit:function(){
			if(ie6){
				switchMarket.on('mouseenter',function(){
					$(this).addClass('hover');
				}).on('mouseleave',function(){
					$(this).removeClass('hover');
				});
			}
		},
		/**
		 * 按钮区事件
		 */
		actionInit: function(){
			//搜索本市场和搜索全站逻辑不同
			$('button.market', searchContainer).click(function(){
				if(currentType==="alisearch-product"){
					from.val('industrySearch');
					industryFlag.val($(this).data('industryFlag')||'');
				}
				else{
					from.val('');
					industryFlag.val('');
				}
				//form.trigger('submit');
			});
			$('button.global', searchContainer).click(function(){
				if(currentType==="alisearch-product"){
					from.val('marketSearch');
				}
				else{
					from.val('');
				}
				industryFlag.val('');
				form.trigger('submit');
			});
		},
		/**
		 * 重写表单onsubmit事件
		 */
		submitInit: function(){
			form.get(0).onsubmit = function(){
				if (!keywords.val()) {
					keywords.focus();
					return false;
				}
				//$.log('search submit!');
				return true;
			};
		},
		/**
		 * IE6下主logo透明滤镜
		 */
		iePNGFix: function(){
			if(ie6){
				var pngImg = $('img.iepngfix', masthead);
				if(pngImg.length){
					pngImg.each(function(i, img){
						$(img).css('filter', 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + img.src + '",sizingMethod="scale");');
						img.src = 'http://img.china.alibaba.com/images/common/util/1x1.gif';
					});
				}
			}
		}            
	};
	/**
	 * 切换配置处理函数
	 * @param {Object} o 配置
	 */
	function configChangeHandler(o){
		//placeholder
		
		//在搜狗兼容模式下有bug
		//keywords.attr('placeholder', o.placeholder);
		
		keywords[0].setAttribute('placeholder', o.placeholder);
		handlers.placeholderInit(o.placeholder);					
		
		//suggestion
		if (suggestion) {
			if (o.suggest) {
				suggestion.setOptions({
					url: o.url,
					type: o.type
				}).enable();
			} else {
				suggestion.disable();
			}
		}
		//修改表单样式 切换表单action属性
		form.removeClass().addClass(o.cls).attr('action', o.action);
	}

	for (var p in handlers) {
		handlers[p]();
	}
});

/*
 * 行业搜索公用头部导航
*/
	$(function(){
	var nav = $('#ali-nav-5i');
	if(!nav.length){
		return;
	}
	var
	timer,
	aliNavContainer = $('.ali-nav-container',nav),
	mainNav = $('#ali-nav-main .ali-nav-category ul'),
	mainNavList = mainNav.find('li'),
	subNav = $('#ali-nav-sub'),
	subNavList = subNav.find('ul'),
	currentNavIndex = mainNavList.index(mainNavList.filter('.current')),
	hoverNavIndex = -1,
	
	//设置子导航居中
	setLeftPosition = function(index){
		var
		pageWidth = aliNavContainer.width()||952,
		mainWidth = mainNavList.eq(index).width(),
		mainLeft = mainNavList.eq(index).position().left,
		subWidth = subNavList.eq(index).width(),
		subLeft = mainLeft - Math.floor((subWidth-mainWidth)/2),
		maxLeft;
		
		subWidth = subWidth>pageWidth?pageWidth:subWidth;
		maxLeft = pageWidth-subWidth;
		
		subLeft = subLeft>0?subLeft:0;
		subLeft = subLeft<maxLeft?subLeft:maxLeft;
		
		subNavList.eq(index).css('left',subLeft+'px');
	},
	//切换子导航函数
	switchNav = function(index){
		hoverNavIndex = index;
		clearTimeout(timer);
		timer = setTimeout(function(){
			if(hoverNavIndex>=0){
				if(hoverNavIndex===currentNavIndex){
					subNav.removeClass('hover');
				}
				else{
					if(!subNav.hasClass('hover')){
						subNav.addClass('hover');
					}
				}
				setLeftPosition(hoverNavIndex);
				mainNavList.eq(hoverNavIndex).addClass('hover');
				mainNavList.eq(hoverNavIndex).siblings('li').removeClass('hover');
				subNavList.eq(hoverNavIndex).show();
				subNavList.eq(hoverNavIndex).siblings('ul').hide();
			}else{
				subNavList.hide();
				subNavList.eq(currentNavIndex).show();
				mainNavList.removeClass('hover');
				subNav.removeClass('hover');
			}
		},200);
	};	
	//第一次载入时显示子导航
	currentNavIndex = currentNavIndex>0?currentNavIndex:0;
	setLeftPosition(currentNavIndex);
	//倾城系统自定义三级导航
	/* if(!subNavList.eq(currentNavIndex).find('.current').length){
		var nodeName = $('#doc').data('nodeName'),nodeURL = $('#doc').data('nodeUrl');
		if(nodeName&&nodeURL){
			subNavList.eq(currentNavIndex).prepend('<li class="current"><a href="'+nodeURL+'">'+nodeName+'</a></li>');
		}
	} */
	
	subNavList.eq(currentNavIndex).show();

	mainNav.on('mouseenter','li',function(){
		var
		self = $(this),
		index = mainNavList.index(self);
		switchNav(index);
	}).on('mouseleave','li',function(){
		switchNav(-1);
	});
	
	subNav.on('mouseenter','ul',function(){
		var
		self = $(this),
		index = subNavList.index(self);
		switchNav(index);
	}).on('mouseleave','ul',function(){
		switchNav(-1);
	});
	
});
//类似无痕打点，但是ruleid写死
	$(function(){
		function baseClick(param){
			var url = 'http://stat.1688.com/search/queryreport.html';
			param = '?static='+param+'&rule_id=501';
			if (typeof window.dmtrack != "undefined") {
				dmtrack.clickstat(url, param);
			} else {
				var d = new Date();
				if (document.images) {
					(new Image).src = url + param+'&time='+d.getTime();
				}
			}
			return true;
		}
	
		$('#header').on('mousedown','a,button',function(){
			var
			param = $(this).data('headerTrace')||'';
			if(param){
				baseClick(param);
			}
		});
	});

})(jQuery);