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
        //ע��ʱ��ؼ�
        D.setDatepicker(startEl, endEl);
        setDate();
		
		pid = $.unparam(location.href,'&').pid;   //�õ�����rid;
		if((!pid)||(isNaN(pid))){
			pid = 1;		//Ĭ����1
		}
		
		$('#js-reload').click(function(e){ //ˢ�°�ť
			e.preventDefault();
			location.reload();
		});
		
	    $.use('ui-flash,ui-flash-chart', function(){  	// ����ͼ�����
	    	
            var chart = $('#dcms-chart-rules','.dcms-positioneffect-chart').flash({
				module:'chart',
				type:'line',
			    width: 830,
                height: 500,
                flashvars: {
                	eventHandler:'dcms.util.flash.triggerHandler',
                    cssUrl:'http://style.c.aliimg.com/css/app/cbu/cms/module/chart.css'		//ͼ�����ʽ
                }
			}),
            chartTotal = $('#dcms-chart-position','.dcms-positioneffect-chart').flash({
				module:'chart',
				type:'line',
			    width: 830,
                height: 380,
                flashvars: {
                	eventHandler:'dcms.util.flash.triggerHandler',
                    cssUrl:'http://style.c.aliimg.com/css/app/cbu/cms/module/chart-total.css'		//ͼ�����ʽ
                }
			});

			chart.bind('swfReady.flash',function(){  //flahs׼����ɺ�̬����cookie����
				chart.flash('load', effDomain+'dwsoa/dubbo/Dcms.dox?action=Dcms_action&event_submit_do_position=true&beginDate='+beginDate+'&endDate='+endDate+'&type=exposurepv&pid=' + pid);  //Ĭ�ϼ���type=pv pid��λ��id //������utf-8 �����gbk chart.flash('load','line.php?type=pv&pid=111','gbk');
				}).bind('data_parsed.flash',function(){	//���ݽ�����ɺ����غ��������
				var i;
				for(i=5;i<12;i++){
					chart.flash('setDatasetVisibility',i,false);  //5-11��������Ϊ���ɼ�
				}
			}); 
            chartTotal.bind('swfReady.flash',function(){  //flahs׼����ɺ�̬����cookie����
				chartTotal.flash('load', effDomain+'dwsoa/dubbo/Dcms.dox?action=Dcms_action&event_submit_do_position_single=true&beginDate='+beginDate+'&endDate='+endDate+'&type=exposurepv&pid=' + pid);  //Ĭ�ϼ���type=pv pid��λ��id //������utf-8 �����gbk chart.flash('load','line.php?type=pv&pid=111','gbk');
			}); 
			
			$('input[type=radio]','.dcms-positioneffect-chart').click(function(){	//���ݵ�ѡ�򣬶�̬��������
				//var type = $(this).data('type');	//���ͼ�����radio��data-type������
                type = $(this).val();
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
