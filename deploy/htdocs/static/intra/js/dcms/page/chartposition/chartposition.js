/*
@Author xutao
@Date 2011-04-01
 modify by hongss on 2011.07.05 for datepicker
*/
(function($, D){
	$(document).ready(function(){
		var startEl = $('#start-time'),
        endEl = $('#end-time'), pid, 
        //effDomain = 'http://10.20.130.209:69/',
        effDomain = 'http://dwsoa.b2b.alibaba-inc.com/',
        endDate ,startDate, arrDate,
        type = 'exposurepv';
        //注册时间控件
        D.setDatepicker(startEl, endEl);
        setDate();
		
		pid = $.unparam(location.href,'&').pid;   //得到参数rid;
		if((!pid)||(isNaN(pid))){
			pid = 1;		//默认是1
		}
		
		$('#js-reload').click(function(e){ //刷新按钮
			e.preventDefault();
			location.reload();
		});
		
	    $.use('ui-flash,ui-flash-chart', function(){  	// 加载图表组件
	    	
            var chart = $('#dcms-chart-rules','.dcms-positioneffect-chart').flash({
				module:'chart',
				type:'line',
			    width: 830,
                height: 500,
                flashvars: {
                	eventHandler:'dcms.util.flash.triggerHandler',
                    cssUrl:'http://style.c.aliimg.com/css/app/cbu/cms/module/chart.css'		//图表的样式
                }
			}),
            chartTotal = $('#dcms-chart-position','.dcms-positioneffect-chart').flash({
				module:'chart',
				type:'line',
			    width: 830,
                height: 380,
                flashvars: {
                	eventHandler:'dcms.util.flash.triggerHandler',
                    cssUrl:'http://style.c.aliimg.com/css/app/cbu/cms/module/chart-total.css'		//图表的样式
                }
			});

			chart.bind('swfReady.flash',function(){  //flahs准备完成后动态加载cookie数据
				chart.flash('load', effDomain+'dwsoa/dubbo/Dcms.dox?action=Dcms_action&event_submit_do_position=true&beginDate='+beginDate+'&endDate='+endDate+'&type=exposurepv&pid=' + pid);  //默认加载type=pv pid是位置id //数据是utf-8 如果是gbk chart.flash('load','line.php?type=pv&pid=111','gbk');
				}).bind('data_parsed.flash',function(){	//数据解析完成后，隐藏后面的数据
				var i;
				for(i=5;i<12;i++){
					chart.flash('setDatasetVisibility',i,false);  //5-11号数据设为不可见
				}
			}); 
            chartTotal.bind('swfReady.flash',function(){  //flahs准备完成后动态加载cookie数据
				chartTotal.flash('load', effDomain+'dwsoa/dubbo/Dcms.dox?action=Dcms_action&event_submit_do_position_single=true&beginDate='+beginDate+'&endDate='+endDate+'&type=exposurepv&pid=' + pid);  //默认加载type=pv pid是位置id //数据是utf-8 如果是gbk chart.flash('load','line.php?type=pv&pid=111','gbk');
			}); 
			
			$('input[type=radio]','.dcms-positioneffect-chart').click(function(){	//根据单选框，动态载入数据
				//var type = $(this).data('type');	//类型加载在radio的data-type属性里
                type = $(this).val();
				if((type)&&(type!==''))	//根据类型调用接口
				{
					reloadChart();
                }
			});
            
            $('#confirm-date').click(function(){
                reloadChart();
            });
			
            function reloadChart(){
                setDate();
                chart.flash('load',effDomain+'dwsoa/dubbo/Dcms.dox?action=Dcms_action&event_submit_do_position=true&beginDate='+beginDate+'&endDate='+endDate+'&type='+type+'&pid=' + pid);
                chartTotal.flash('load',effDomain+'dwsoa/dubbo/Dcms.dox?action=Dcms_action&event_submit_do_position_single=true&beginDate='+beginDate+'&endDate='+endDate+'&type='+type+'&pid=' + pid);
            }
		});
        function setDate(){
            arrDate = D.getDate(startEl, endEl);
            beginDate = arrDate[0];
            endDate = arrDate[1];
        }
	});
})(dcms,FE.dcms);
