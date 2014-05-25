/*
页面分析js
@author xutao
@date 2011-03-28
@date 2011-04-06
*/

(function($, D){
	var urlList,	//预设页面url列表
	timer=0,		//定时器初始化
	searchType=0,	//搜索类型 0级联选择 1模糊搜索
	curPageNo,		//当前页面页号
	totalPage=1,	//总页数
	curId;			//当前urlid
	
	/*
	分析页面请求参数
	*/
	function request(){
        var paraObj = $.unparam(location.href,'&');		//参数转化为对象
        curId = $('#js-urllist').data('default');		//后台讲当前url写入#js-urllist 的 data-default属性
		//curId = paraObj.urlid;
		if(paraObj.mode=="query"){						//默认模式 mode=query 模糊搜索 select 级联选择
			$('#js-cascade').hide();
			$('#js-search').show();
			$('#searchtoggle').text('级联选择');
			searchType=1;
		}
		else{
			$('#js-query').attr('disabled','disabled');	//查询按钮在未加载urllist之前不可用
			$('#js-query').addClass('gray');
		}
    };

	/*
	显示搜索框上方的提示
 	@param content 显示内容 
	@param duration 持续时间
	*/
	
	function showSearchTips(content,duration){
		var tips = $('.tips','.dcms-pageanalysis-search');
		if(content===''){								//内容为空自动隐藏
			tips.hide();
		}
		else{
			if(isNaN(duration)){						//默认显示3000ms
				duration = 3000;
			};
			tips.html(content);
			tips.show();
			if(duration!==0){							//0表示不自动消失
				setTimeout(function(){
					tips.fadeOut();
				},duration);				
			}
		}
	};
	
	
	/*
	显示操作框的提示信息
 	@param content 显示内容 
	@param duration 持续时间
	*/
	function showOperateTips(content,duration){
		var tips = $('.tips','.dcms-pageanalysis-operation');
		if(isNaN(duration)){
			duration = 3000;
		};
		tips.html(content);
		tips.show();
		if(duration!==0){
			setTimeout(function(){
				tips.fadeOut();
			},duration);				
		}
	};
	
	/*
	动态载入预设页面urllist
	*/
	function loadUrlList(){
		var defaultCate = -1,homeCate = -1,
		btn = $('.button','.dcms-pageanalysis-operation').eq(1);
		$.ajax('getPreUrl.do', {	//接口地址getPreUrl.do
			dataType: 'jsonp',
			success: function(data){
				if((data.status==='success')&&(data.data))
				{
					$('#cate').empty();
					urlList = data.data;
					$.each(urlList, function(index, c) { 		//遍历urllist，加入列表，符合默认的设为选中状态
						if(!c.pageType){
							c.pageType = '------';
						}
						$('#cate').append('<option value="'+index+'">'+c.pageType+'</option>');
						if(defaultCate<0){
							$.each(c.urls, function(j, value) {
								if(curId===value.urlId){
									btn.removeClass('dcms-hide');
									defaultCate = index;
									return false;
								}
								if(552===value.urlId){
									homeCate = index;
								}
							});
						}
					});
					if(defaultCate<0){
						defaultCate = homeCate;
					}
					setTimeout(function() { 	
						$('option[value="'+defaultCate+'"]','#cate').attr('selected','selected');
						changeUrl(); //修改二级url
					}, 1);
					$('#js-query').removeAttr('disabled','disabled');	//数据加载成，则查询按钮可用
					$('#js-query').removeClass('gray');
				}
				else{
					showSearchTips('<span>预设页面URL加载失败</span>',0);
				};
			},
			error:function(){
				showSearchTips('<span>预设页面URL加载失败</span>',0);
			}
		});	
	};
	
	
	/*
	修改二级url
	*/
	function changeUrl(){
		if(urlList!==undefined){
			var cate=$('#cate').val(),			//得到当前的一级分类
			sId=552,
			urls=urlList[cate].urls;
			$('#js-urllist').empty();
			$.each(urls, function(index, value) {	//遍历urls，添加到列表，符合curId的设为选中
				if((value.urlId)&&(value.url)){
					if(!value.urlDesc){
						value.urlDesc = '-';
					}
					if(value.urlId==curId){
						sId = curId;
					}
					$('#js-urllist').append('<option value="'+value.urlId+'">'+value.urlDesc+' '+value.url+'</option>');					
				}
			});
			setTimeout(function() { 
				$('option[value="'+sId+'"]','#js-urllist').attr('selected','selected');
			}, 1);
		};
	};	
	
	/*
	搜索请求函数
 	@param date
	@param keyword
	@param pageNo 请求页码
	@param need 是否请求总页码，一般第一次请求，后面不请求，减少服务器开销
	*/
	function searchRequest(date,keyword,pageNo,need){
		var searchResult = $('#js-search-result'),
		searchResultBody=$('tbody',searchResult),
		searchResultFooter=$('.footer',searchResult);
		searchResultBody.empty();
		searchResultFooter.hide();	//请求前准备
		searchResultBody.append('<tr><td class="center"><img class="wait" src="http://img.china.alibaba.com/cms/upload/2011/899/040/40998_1643551954.gif"></td></tr>');
		//showSearchTips('<span>正在搜索请稍候...</span>',3000);
		searchResult.show();
		$.ajax('queryByKeyWord.do', {
			dataType: 'jsonp',
			data: {
				date: date,
				keyword:keyword,
				curPageNo:pageNo-1,
				need:need
			},
			success: function(data){
				if(data.status==='success')
				{
					var resultList = data.data,
					buttons = $('button',searchResult);
					if((resultList==="")||($.isEmptyObject(resultList)))
					{
						showSearchTips('<span>没找到搜索结果</span>',0);
						searchResult.hide();
					}
					else
					{
						//showSearchTips('<span>搜索完成</span>',1000);
						showSearchTips('',0);
						searchResultBody.empty();
						$.each(resultList, function(index, value) { 	//添加到搜索结果下拉列表
							if((value.urlId)&&(value.url)){
								searchResultBody.append('<tr><td><a href="?urlId='+ value.urlId+'&date='+date+'&mode=query" title="'+ value.url +'">'+ value.url+'</a></td></tr>');
							}
						});
						searchResultFooter.show();
						if($.type(data.curPageNo)=== "number")	//控制页面按钮显示状态
						{
							curPageNo = data.curPageNo + 1;
						};
						if($.type(data.count)=== "number"){
							totalPage = data.count;
						};
						
						$('span',searchResult).text(curPageNo+'/'+totalPage);
						
						if(curPageNo==1){
							buttons.eq(0).attr('disabled','disabled');
							buttons.eq(0).addClass('gray');
							buttons.eq(1).attr('disabled','disabled');
							buttons.eq(1).addClass('gray');
						}
						else{
							buttons.eq(0).removeAttr('disabled');
							buttons.eq(0).removeClass('gray');
							buttons.eq(1).removeAttr('disabled');
							buttons.eq(1).removeClass('gray');
						};
						
						if(curPageNo>=totalPage){
							buttons.eq(2).attr('disabled','disabled');
							buttons.eq(2).addClass('gray');
						}
						else{
							buttons.eq(2).removeAttr('disabled');
							buttons.eq(2).removeClass('gray');
						};
					}
				}
				else{
					showSearchTips('<span>无法完成搜索</span>',0);
					searchResult.hide();
				};
			},
			error:function(){
				showSearchTips('<span>无法完成搜索</span>',0);
				searchResult.hide();
			}
		});
	};
	
	/*
	载入flash图表
	*/
	function loadFlash(){
		$.use('ui-flash,ui-flash-chart', function(){
			var xmlUrl = $('#xml-url').val(),		//xml文件地址由后台写入#xml-url
			chart = $('#xml-url').parent();
			$('#xml-url').remove();
			chart.flash({
				module:'chart',
				type:'line',
			    width: 840,
                height: 400,
                flashvars: {
                	eventHandler:'dcms.util.flash.triggerHandler',
                    cssUrl:'http://style.c.aliimg.com/css/app/cbu/cms/page/pageanalysis/line.css'
                }
			});
			
			chart.bind('swfReady.flash',function(){	//xml文件在flash准备完成后动态载入
				chart.flash('load',xmlUrl);
			});
		});
	
	};
	
	
	$(document).ready(function(){
		$('#cate').change(function(){	//一级类目改动后，自动调整二级类目
			changeUrl();
		});
		
		$('#searchtoggle').click(function(e){	//模糊搜索和级联的切换
			var self = $(this);
			e.preventDefault();
			showSearchTips('',0);
			if(searchType===0){
				$('#js-cascade').hide();
				$('#js-search').show();
				self.text('级联选择');
				searchType=1;
				$('#js-query').removeAttr('disabled','disabled');
				$('#js-query').removeClass('gray');
			}
			else if(searchType===1){
				$('#js-search').hide();
				$('#js-cascade').show();
				self.text('模糊搜索');
				searchType=0;
				if(urlList==undefined){		//如果预设url加载失败，查询按钮是不可用的
					$('#js-query').attr('disabled','disabled');
					$('#js-query').addClass('gray');
				}
			};
		});
		
		$('#js-query').click(function(e){	//单击查询按钮
			e.stopPropagation();
			var date=$('#js-datepacker').val();
			if(searchType === 0){	//当前状态是级联
				location.href='?urlId='+$('#js-urllist').val()+'&date='+date+'&mode=select';
			};
			if(searchType === 1){	//当前状态是模糊搜索
				var keyword = $('#js-keyword').val().trim(),
				searchResult = $('#js-search-result'),
				searchResultBody=$('.body',searchResult);
				if(keyword === ''){
					showSearchTips('<span>关键词不能为空</span>',3000);
					return;
				};
				
				searchResult.click(function(e){		//检测单击事件，隐藏下拉列表
					e.stopPropagation();
				});
			
				$(document).click(function(){
					searchResult.slideUp();
					searchResult.unbind('click');
					$(document).unbind('click');
					showSearchTips('',0);
				});
				searchRequest(date,keyword,1,'count');
			};
		});
		
		$('#js-keyword').keydown(function(e){	//模糊搜索关键词框，按enter后触发
			if (e.keyCode == '13') {
				e.preventDefault();
				$('#js-query').triggerHandler('click');
			}
		});
		
		$('button','#js-search-result').click(function(e){	//下拉列表按钮处理
			var self = $(this),keyword = $('#js-keyword').val().trim();
			if(self.text()==='首页'){
				searchRequest($('#js-datepacker').val(),keyword,1,'');
			};
			if(self.text()==='上一页'){
				searchRequest($('#js-datepacker').val(),keyword,curPageNo-1,'');
			};
			if(self.text()==='下一页'){
				searchRequest($('#js-datepacker').val(),keyword,curPageNo+1,'');
			};
		});
		
		$('a','.dcms-pageanalysis-operation').eq(1).click(function(e){ //添加定制按钮处理  
			e.preventDefault();
			//curId='11';
			if(curId!==''){
				$.ajax('custom_url.htm',{
					dataType: 'jsonp',
					data: {
						urlId: curId,
						operate:'add'
					},
					success: function(o){
						if(o.status==='success'){
							showOperateTips('<span>添加定制成功</span>');
						}
						else if(o.status==='fail'){
							showOperateTips('<span>添加定制失败</span>');
						}
						else if(o.status==='already'){
							showOperateTips('<span>您已经定制过该页面</span>');
						}
						else if(o.status==='full'){
							showOperateTips('<span>您的定制已满，上限定制20条</span><br>马上管理<a href="my_page.htm">我的定制</a>');
						};
					}
				});	
			}
			else{
				showOperateTips('<span>添加定制失败</span>');
			}
		});
		
		$('tbody tr','#analysis-grid').mouseenter(function(){	//动态插入查看原页面浮动按钮，并且fadeIn
			var self = $(this),fb = $('.float-button',self);
			if(fb.length===0){
				var	url = self.data('url');
				if((url)&&(url!=='')){
					$('td:last',self).append('<div class="fd-locate"><div class="float-button"><a target="_blank" href="'+url+'">查看原页面</a></div></div>');
				}
				else{
					return;
				}
				fb = $('.float-button',self);
			};
			timer = setTimeout(function(){
				fb.fadeIn('fast');
			},200);
			
		});
		
		$('tbody tr','#analysis-grid').mouseleave(function(){	//鼠标离开tr时候浮动按钮隐藏
			var self = $(this),fb = $('.float-button',self);
			clearTimeout(timer);
			timer = setTimeout(function(){
				fb.hide();	
			},200);
		});
		
		$('#js-tab').tabs({		//tab切换
			isAutoPlay:false, 
			event:'click'
		});
		
		$('#js-reload').click(function(e){	//刷新页面
			e.preventDefault();
			location.reload();
		});
		
		$.use('ui-datepicker-time', function(){ //时间选择，范围是当前-1到当前-60
			var now = new Date(),
			maxDate = new Date(Date.parse(now)-1000*60*60*24),
			minDate = new Date(Date.parse(now)-1000*60*60*24*60),
			val = $('#js-datepacker').val();
			if(val != ''){
				now = Date.parseDate(val);
			}
			$('#js-datepacker').datepicker({
				date:now,
				closable:true,
				minDate:minDate,
				maxDate:maxDate,
	            select: function(e, ui){
	                $(this).val(ui.date.format('yyyy-MM-dd'));
	            }
	        });
	    });
	    request();
	    loadUrlList();
	    loadFlash();
	});
})(dcms,FE.dcms);
