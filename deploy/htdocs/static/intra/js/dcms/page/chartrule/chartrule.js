/*
@Author xutao
@Date 2011-04-01
 modify by hongss on 2011.07.05 for datepicker
*/
(function($, D){
	$(document).ready(function(){
        var startEl = $('#start-time'),
        endEl = $('#end-time'), rid,
        effDomain = 'http://dwsoa.b2b.alibaba-inc.com/',
        //effDomain = 'http://10.20.130.209:69/',
        type = 'exposurepv',
        arrDate, beginDate, endDate;
        //注册时间控件
        D.setDatepicker(startEl, endEl);
        setDate();
		
		rid = $.unparam(location.href,'&').rid;   //得到参数rid;
		if((!rid)||(isNaN(rid))){
			rid = 1;		//默认是1
		}
		
	    $.use('ui-flash,ui-flash-chart', function(){  	// 加载图表组件
	    	var chart = $('#dcms-chart-positions').flash({
				module:'chart',
				type:'line',
			    width: 830,
                height: 500,
                flashvars: {
                	eventHandler:'dcms.util.flash.triggerHandler',
                    cssUrl:'http://style.c.aliimg.com/css/app/cbu/cms/module/chart.css'		//图表的样式
                }
			}),
            chartTotal = $('#dcms-chart-rule').flash({
				module:'chart',
				type:'line',
			    width: 830,
                height: 380,
                flashvars: {
                	eventHandler:'dcms.util.flash.triggerHandler',
                    cssUrl:'http://style.c.aliimg.com/css/app/cbu/cms/module/chart-total.css'		//图表的样式
                }
			});

			chart.bind('swfReady.flash',function(){  //flahs准备完成后动态加载cookie数据   'line.php?type=pv&rid=' + rid
                chart.flash('load', effDomain+'dwsoa/dubbo/Dcms.dox?action=Dcms_action&event_submit_do_rule=true&beginDate='+beginDate+'&endDate='+endDate+'&type=exposurepv&rid='+rid);  //默认加载type=pv rid是位置id //数据是utf-8 如果是gbk chart.flash('load','line.php?type=pv&rid=111','gbk');
				}).bind('data_parsed.flash',function(){	//数据解析完成后，隐藏后面的数据
				var i;
				for(i=5;i<12;i++){
					chart.flash('setDatasetVisibility',i,false);  //5-11号数据设为不可见
				}
			}); 
            chartTotal.bind('swfReady.flash',function(){  //flahs准备完成后动态加载cookie数据   'line.php?type=pv&rid=' + rid
				chartTotal.flash('load', effDomain+'dwsoa/dubbo/Dcms.dox?action=Dcms_action&event_submit_do_rule_single=true&beginDate='+beginDate+'&endDate='+endDate+'&type=exposurepv&rid='+rid);  //默认加载type=pv rid是位置id //数据是utf-8 如果是gbk chart.flash('load','line.php?type=pv&rid=111','gbk');
			}); 
			
			$('input[type=radio]','.dcms-ruleeffect-chart').click(function(){	//根据单选框，动态载入数据
				type = $(this).val();	//类型加载在radio的data-type属性里
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
                chart.flash('load',effDomain+'dwsoa/dubbo/Dcms.dox?action=Dcms_action&event_submit_do_rule=true&beginDate='+beginDate+'&endDate='+endDate+'&type='+type+'&rid='+rid);   //'type=' + type + '&rid=' + rid
                chartTotal.flash('load',effDomain+'dwsoa/dubbo/Dcms.dox?action=Dcms_action&event_submit_do_rule_single=true&beginDate='+beginDate+'&endDate='+endDate+'&type='+type+'&rid='+rid); 
            }
            
		});
        
        function setDate(){
            arrDate = D.getDate(startEl, endEl);
            beginDate = arrDate[0];
            endDate = arrDate[1];
        }
	});
})(dcms,FE.dcms);
