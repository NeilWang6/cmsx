/*
综合KPI页面JS
@Author xutao
@Date 2011-03-28
*/
(function($, D){
	$(document).ready(function(){
		
		$('#js-reload').click(function(e){ //刷新按钮
			e.preventDefault();
			location.reload();
		});
		
		$.use('ui-datepicker-time', function(){ //日期选择控件，可选当前-1到当前-60，选择后重新请求页面
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
					e.preventDefault();
	            	var date=ui.date.format('yyyy-MM-dd');
	                $(this).val(date);
	                location.href='?date='+date;
	            }
	        });
	    });
	    
	    $.use('ui-flash,ui-flash-chart', function(){  	// 加载图表组件
	    	var chart = $('.content','.dcms-kpi-chart').flash({
				module:'chart',
				type:'line',
			    width: 840,
                height: 400,
                flashvars: {
                	eventHandler:'dcms.util.flash.triggerHandler',
                    cssUrl:'http://style.c.aliimg.com/css/app/cbu/cms/page/kpi/line.css'
                }
			});

			chart.bind('swfReady.flash',function(){  //flahs准备完成后动态加载cookie数据
				chart.flash('load','nodeKpiXml.htm?type=cookie&date='+$('#js-datepacker').val());
			}).bind('data_parsed.flash',function(){	//数据解析完成后，隐藏后面的数据
				var i;
				for(i=3;i<9;i++){
					chart.flash('setDatasetVisibility',i,false);
				}
			}); 
			
			$('#chart1').click(function(){	//根据单选框，动态载入数据
				chart.flash('load','nodeKpiXml.htm?type=fbcount&date='+$('#js-datepacker').val());
			});
			
			$('#chart2').click(function(){
				chart.flash('load','nodeKpiXml.htm?type=pv&date='+$('#js-datepacker').val());
			});
			
			$('#chart3').click(function(){
				chart.flash('load','nodeKpiXml.htm?type=cookie&date='+$('#js-datepacker').val());
			});
			
		});
	});
})(dcms,FE.dcms);
