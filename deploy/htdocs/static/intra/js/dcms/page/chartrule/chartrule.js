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
        //ע��ʱ��ؼ�
        D.setDatepicker(startEl, endEl);
        setDate();
		
		rid = $.unparam(location.href,'&').rid;   //�õ�����rid;
		if((!rid)||(isNaN(rid))){
			rid = 1;		//Ĭ����1
		}
		
	    $.use('ui-flash,ui-flash-chart', function(){  	// ����ͼ�����
	    	var chart = $('#dcms-chart-positions').flash({
				module:'chart',
				type:'line',
			    width: 830,
                height: 500,
                flashvars: {
                	eventHandler:'dcms.util.flash.triggerHandler',
                    cssUrl:'http://style.c.aliimg.com/css/app/cbu/cms/module/chart.css'		//ͼ�����ʽ
                }
			}),
            chartTotal = $('#dcms-chart-rule').flash({
				module:'chart',
				type:'line',
			    width: 830,
                height: 380,
                flashvars: {
                	eventHandler:'dcms.util.flash.triggerHandler',
                    cssUrl:'http://style.c.aliimg.com/css/app/cbu/cms/module/chart-total.css'		//ͼ�����ʽ
                }
			});

			chart.bind('swfReady.flash',function(){  //flahs׼����ɺ�̬����cookie����   'line.php?type=pv&rid=' + rid
                chart.flash('load', effDomain+'dwsoa/dubbo/Dcms.dox?action=Dcms_action&event_submit_do_rule=true&beginDate='+beginDate+'&endDate='+endDate+'&type=exposurepv&rid='+rid);  //Ĭ�ϼ���type=pv rid��λ��id //������utf-8 �����gbk chart.flash('load','line.php?type=pv&rid=111','gbk');
				}).bind('data_parsed.flash',function(){	//���ݽ�����ɺ����غ��������
				var i;
				for(i=5;i<12;i++){
					chart.flash('setDatasetVisibility',i,false);  //5-11��������Ϊ���ɼ�
				}
			}); 
            chartTotal.bind('swfReady.flash',function(){  //flahs׼����ɺ�̬����cookie����   'line.php?type=pv&rid=' + rid
				chartTotal.flash('load', effDomain+'dwsoa/dubbo/Dcms.dox?action=Dcms_action&event_submit_do_rule_single=true&beginDate='+beginDate+'&endDate='+endDate+'&type=exposurepv&rid='+rid);  //Ĭ�ϼ���type=pv rid��λ��id //������utf-8 �����gbk chart.flash('load','line.php?type=pv&rid=111','gbk');
			}); 
			
			$('input[type=radio]','.dcms-ruleeffect-chart').click(function(){	//���ݵ�ѡ�򣬶�̬��������
				type = $(this).val();	//���ͼ�����radio��data-type������
				if((type)&&(type!==''))	//�������͵��ýӿ�
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
