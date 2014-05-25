/**
@Author xutao
@Date 2011-04-01
@接口 line.json 其实可以和位置的接口
*/
(function($, D){
	$(function(){
		var 
		obj = $.unparam(location.href,'&'),   //得到参数rid,pid;
		rid = obj.rid,
		pid = obj.pid,
        now = new Date(),
        statDate = new Date(Date.parse(now)-24*3600*1000).format(),
        url = 'http://dwsoa.b2b.alibaba-inc.com/dwsoa/dubbo/Dcms.dox?action=Dcms_action&event_submit_do_top=true';
        // modfiy by pingchun.yupc 2011-12-07 查询操作
        var sdEl = $("#start-date");
        if (!sdEl.val()){
            sdEl.val(statDate);
        }
		
		if((!rid)||(isNaN(rid))){
			rid = 1;		//默认是1
		}
		
		if((!pid)||(isNaN(pid))){
			pid = 1;		//默认是1
		}
		// modfiy by pingchun.yupc 2011-12-07 查询操作
		$('#js-reload').click(function(e){ //刷新按钮
		    statDate=sdEl.val();
			e.preventDefault();
			//location.reload();
			reqDubbo();
		});
		
		$('#start-date').one('focus', function(){
            var self = $(this);
            $.use('ui-datepicker, util-date', function(){
                    self.datepicker({
                        triggerType: 'focus',
                        select: function(e, ui){
                            self.val(ui.date.format()).datepicker('hide');
                            //add by pingchun.yupc
                             statDate=sdEl.val();
                            reqDubbo();
                        }
                }).triggerHandler('focus');
            });
        });
        
        function reqDubbo() {
            $.ajax(url, {   //接口地址data.php
            dataType: 'jsonp',
            data:{
                pid:pid,
                rid:rid,
                statDate:statDate
            },
            success: function(data){
                if(data && data.data)
                {
                    var list = data.data;
                    if(list){
                        var text, jsonData = $('#json-data'),
                        tbody = $('tbody','.dcms-grid'),  //插入tbody
                        $substitute = $.util.substitute,
                        row = '<tr>'
                                    +'<td><a target="_blank" title="{0}" href="{0}">{1}</a></td>'
                                    +'<td>{2}</td>'
                                    +'<td>{3}</td>'
                                +'</tr>';
                          //console.log(JSON.stringify(list));
                        jsonData.val(encodeURIComponent(JSON.stringify(data)));
                        tbody.empty();
                        $.each(list, function(index, value){
                            text = value.url;
                            if(text.length>50){
                                text = text.substring(0,50)+'...';
                            }
                            tbody.append($substitute(row,[value.url,text,value.clickPv,value.clickCookie]));
                        });
                 
                    }           
                    //设置页面左侧蓝条高度
                    //$('#js-dcmstoggle').css('height', $('section.dcms-main-body').height());
                }
                else{
                    console.log('fail');
                };
            },
            error:function(){
                console.log('fail');
            }
        }); 
        }
        reqDubbo();
	});
})(dcms,FE.dcms);
