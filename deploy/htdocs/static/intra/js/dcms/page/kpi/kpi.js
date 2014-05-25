/*
�ۺ�KPIҳ��JS
@Author xutao
@Date 2011-03-28
*/
(function($, D){
	$(document).ready(function(){
		
		$('#js-reload').click(function(e){ //ˢ�°�ť
			e.preventDefault();
			location.reload();
		});
		
		$.use('ui-datepicker-time', function(){ //����ѡ��ؼ�����ѡ��ǰ-1����ǰ-60��ѡ�����������ҳ��
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
	    
	    $.use('ui-flash,ui-flash-chart', function(){  	// ����ͼ�����
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

			chart.bind('swfReady.flash',function(){  //flahs׼����ɺ�̬����cookie����
				chart.flash('load','nodeKpiXml.htm?type=cookie&date='+$('#js-datepacker').val());
			}).bind('data_parsed.flash',function(){	//���ݽ�����ɺ����غ��������
				var i;
				for(i=3;i<9;i++){
					chart.flash('setDatasetVisibility',i,false);
				}
			}); 
			
			$('#chart1').click(function(){	//���ݵ�ѡ�򣬶�̬��������
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
