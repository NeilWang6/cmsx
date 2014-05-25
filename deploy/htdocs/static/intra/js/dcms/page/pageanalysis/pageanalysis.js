/*
ҳ�����js
@author xutao
@date 2011-03-28
@date 2011-04-06
*/

(function($, D){
	var urlList,	//Ԥ��ҳ��url�б�
	timer=0,		//��ʱ����ʼ��
	searchType=0,	//�������� 0����ѡ�� 1ģ������
	curPageNo,		//��ǰҳ��ҳ��
	totalPage=1,	//��ҳ��
	curId;			//��ǰurlid
	
	/*
	����ҳ���������
	*/
	function request(){
        var paraObj = $.unparam(location.href,'&');		//����ת��Ϊ����
        curId = $('#js-urllist').data('default');		//��̨����ǰurlд��#js-urllist �� data-default����
		//curId = paraObj.urlid;
		if(paraObj.mode=="query"){						//Ĭ��ģʽ mode=query ģ������ select ����ѡ��
			$('#js-cascade').hide();
			$('#js-search').show();
			$('#searchtoggle').text('����ѡ��');
			searchType=1;
		}
		else{
			$('#js-query').attr('disabled','disabled');	//��ѯ��ť��δ����urllist֮ǰ������
			$('#js-query').addClass('gray');
		}
    };

	/*
	��ʾ�������Ϸ�����ʾ
 	@param content ��ʾ���� 
	@param duration ����ʱ��
	*/
	
	function showSearchTips(content,duration){
		var tips = $('.tips','.dcms-pageanalysis-search');
		if(content===''){								//����Ϊ���Զ�����
			tips.hide();
		}
		else{
			if(isNaN(duration)){						//Ĭ����ʾ3000ms
				duration = 3000;
			};
			tips.html(content);
			tips.show();
			if(duration!==0){							//0��ʾ���Զ���ʧ
				setTimeout(function(){
					tips.fadeOut();
				},duration);				
			}
		}
	};
	
	
	/*
	��ʾ���������ʾ��Ϣ
 	@param content ��ʾ���� 
	@param duration ����ʱ��
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
	��̬����Ԥ��ҳ��urllist
	*/
	function loadUrlList(){
		var defaultCate = -1,homeCate = -1,
		btn = $('.button','.dcms-pageanalysis-operation').eq(1);
		$.ajax('getPreUrl.do', {	//�ӿڵ�ַgetPreUrl.do
			dataType: 'jsonp',
			success: function(data){
				if((data.status==='success')&&(data.data))
				{
					$('#cate').empty();
					urlList = data.data;
					$.each(urlList, function(index, c) { 		//����urllist�������б�����Ĭ�ϵ���Ϊѡ��״̬
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
						changeUrl(); //�޸Ķ���url
					}, 1);
					$('#js-query').removeAttr('disabled','disabled');	//���ݼ��سɣ����ѯ��ť����
					$('#js-query').removeClass('gray');
				}
				else{
					showSearchTips('<span>Ԥ��ҳ��URL����ʧ��</span>',0);
				};
			},
			error:function(){
				showSearchTips('<span>Ԥ��ҳ��URL����ʧ��</span>',0);
			}
		});	
	};
	
	
	/*
	�޸Ķ���url
	*/
	function changeUrl(){
		if(urlList!==undefined){
			var cate=$('#cate').val(),			//�õ���ǰ��һ������
			sId=552,
			urls=urlList[cate].urls;
			$('#js-urllist').empty();
			$.each(urls, function(index, value) {	//����urls����ӵ��б�����curId����Ϊѡ��
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
	����������
 	@param date
	@param keyword
	@param pageNo ����ҳ��
	@param need �Ƿ�������ҳ�룬һ���һ�����󣬺��治���󣬼��ٷ���������
	*/
	function searchRequest(date,keyword,pageNo,need){
		var searchResult = $('#js-search-result'),
		searchResultBody=$('tbody',searchResult),
		searchResultFooter=$('.footer',searchResult);
		searchResultBody.empty();
		searchResultFooter.hide();	//����ǰ׼��
		searchResultBody.append('<tr><td class="center"><img class="wait" src="http://img.china.alibaba.com/cms/upload/2011/899/040/40998_1643551954.gif"></td></tr>');
		//showSearchTips('<span>�����������Ժ�...</span>',3000);
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
						showSearchTips('<span>û�ҵ��������</span>',0);
						searchResult.hide();
					}
					else
					{
						//showSearchTips('<span>�������</span>',1000);
						showSearchTips('',0);
						searchResultBody.empty();
						$.each(resultList, function(index, value) { 	//��ӵ�������������б�
							if((value.urlId)&&(value.url)){
								searchResultBody.append('<tr><td><a href="?urlId='+ value.urlId+'&date='+date+'&mode=query" title="'+ value.url +'">'+ value.url+'</a></td></tr>');
							}
						});
						searchResultFooter.show();
						if($.type(data.curPageNo)=== "number")	//����ҳ�水ť��ʾ״̬
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
					showSearchTips('<span>�޷��������</span>',0);
					searchResult.hide();
				};
			},
			error:function(){
				showSearchTips('<span>�޷��������</span>',0);
				searchResult.hide();
			}
		});
	};
	
	/*
	����flashͼ��
	*/
	function loadFlash(){
		$.use('ui-flash,ui-flash-chart', function(){
			var xmlUrl = $('#xml-url').val(),		//xml�ļ���ַ�ɺ�̨д��#xml-url
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
			
			chart.bind('swfReady.flash',function(){	//xml�ļ���flash׼����ɺ�̬����
				chart.flash('load',xmlUrl);
			});
		});
	
	};
	
	
	$(document).ready(function(){
		$('#cate').change(function(){	//һ����Ŀ�Ķ����Զ�����������Ŀ
			changeUrl();
		});
		
		$('#searchtoggle').click(function(e){	//ģ�������ͼ������л�
			var self = $(this);
			e.preventDefault();
			showSearchTips('',0);
			if(searchType===0){
				$('#js-cascade').hide();
				$('#js-search').show();
				self.text('����ѡ��');
				searchType=1;
				$('#js-query').removeAttr('disabled','disabled');
				$('#js-query').removeClass('gray');
			}
			else if(searchType===1){
				$('#js-search').hide();
				$('#js-cascade').show();
				self.text('ģ������');
				searchType=0;
				if(urlList==undefined){		//���Ԥ��url����ʧ�ܣ���ѯ��ť�ǲ����õ�
					$('#js-query').attr('disabled','disabled');
					$('#js-query').addClass('gray');
				}
			};
		});
		
		$('#js-query').click(function(e){	//������ѯ��ť
			e.stopPropagation();
			var date=$('#js-datepacker').val();
			if(searchType === 0){	//��ǰ״̬�Ǽ���
				location.href='?urlId='+$('#js-urllist').val()+'&date='+date+'&mode=select';
			};
			if(searchType === 1){	//��ǰ״̬��ģ������
				var keyword = $('#js-keyword').val().trim(),
				searchResult = $('#js-search-result'),
				searchResultBody=$('.body',searchResult);
				if(keyword === ''){
					showSearchTips('<span>�ؼ��ʲ���Ϊ��</span>',3000);
					return;
				};
				
				searchResult.click(function(e){		//��ⵥ���¼������������б�
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
		
		$('#js-keyword').keydown(function(e){	//ģ�������ؼ��ʿ򣬰�enter�󴥷�
			if (e.keyCode == '13') {
				e.preventDefault();
				$('#js-query').triggerHandler('click');
			}
		});
		
		$('button','#js-search-result').click(function(e){	//�����б�ť����
			var self = $(this),keyword = $('#js-keyword').val().trim();
			if(self.text()==='��ҳ'){
				searchRequest($('#js-datepacker').val(),keyword,1,'');
			};
			if(self.text()==='��һҳ'){
				searchRequest($('#js-datepacker').val(),keyword,curPageNo-1,'');
			};
			if(self.text()==='��һҳ'){
				searchRequest($('#js-datepacker').val(),keyword,curPageNo+1,'');
			};
		});
		
		$('a','.dcms-pageanalysis-operation').eq(1).click(function(e){ //��Ӷ��ư�ť����  
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
							showOperateTips('<span>��Ӷ��Ƴɹ�</span>');
						}
						else if(o.status==='fail'){
							showOperateTips('<span>��Ӷ���ʧ��</span>');
						}
						else if(o.status==='already'){
							showOperateTips('<span>���Ѿ����ƹ���ҳ��</span>');
						}
						else if(o.status==='full'){
							showOperateTips('<span>���Ķ������������޶���20��</span><br>���Ϲ���<a href="my_page.htm">�ҵĶ���</a>');
						};
					}
				});	
			}
			else{
				showOperateTips('<span>��Ӷ���ʧ��</span>');
			}
		});
		
		$('tbody tr','#analysis-grid').mouseenter(function(){	//��̬����鿴ԭҳ�渡����ť������fadeIn
			var self = $(this),fb = $('.float-button',self);
			if(fb.length===0){
				var	url = self.data('url');
				if((url)&&(url!=='')){
					$('td:last',self).append('<div class="fd-locate"><div class="float-button"><a target="_blank" href="'+url+'">�鿴ԭҳ��</a></div></div>');
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
		
		$('tbody tr','#analysis-grid').mouseleave(function(){	//����뿪trʱ�򸡶���ť����
			var self = $(this),fb = $('.float-button',self);
			clearTimeout(timer);
			timer = setTimeout(function(){
				fb.hide();	
			},200);
		});
		
		$('#js-tab').tabs({		//tab�л�
			isAutoPlay:false, 
			event:'click'
		});
		
		$('#js-reload').click(function(e){	//ˢ��ҳ��
			e.preventDefault();
			location.reload();
		});
		
		$.use('ui-datepicker-time', function(){ //ʱ��ѡ�񣬷�Χ�ǵ�ǰ-1����ǰ-60
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
