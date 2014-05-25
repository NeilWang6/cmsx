/**
 * @package 
 * @version 
 * @author 
 */
;(function($, D){
    jQuery(function($){
        var docEl = null, aEls = null,
            pageId = $('.part1 #pageId').val(),
            strDate=$('.part1 #date-input').val();
        
        $.use('ui-datepicker, util-date', function(){
            //日期控件
            $('#date-input').datepicker({
                closable:true,
                maxDate: new Date(),
                select:function(e, ui){
                    var strDate = ui.date.format('yyyy-MM-dd');
                    //当天
                	$(this).val(strDate);
                	var pageId=$('.part1 #pageId').val();
                    responseData(strDate, pageId, docEl, aEls);
                }
            });
        });
        
        FE.dcms.resolveData = function(iframe){
            docEl = $(iframe.contentDocument.document || iframe.contentWindow.document);
            aEls = docEl.find('a');
            responseData(strDate, pageId, docEl, aEls);
        };
        
        //iframe高度
        var iframeCon = $('.con-iframe');
        iframeCon.height($(window).height()-$('.part1').outerHeight());
        
        var iframe = $('#ipageIframe');
        iframe.hide();
        iframe.attr('onload', 'FE.dcms.resolveData(this)');
        iframe.show();
        //responseData(strDate, pageId, docEl, aEls);
        
        
        $('.part1 .click-stat').on('click', function(e){
            e.preventDefault();
            var el = $(this);
            el.siblings().removeClass('current');
            el.addClass('current');
            showClick(docEl, aEls);
        });
        
    });
    var strDate = null;
    var backDate = '';
    function responseData(date, pageId, docEl, aEls){
        var url = D.domain+'/page/dataanalysis/pageData.html';
        $.getJSON(url, {pageId:pageId, date:date}, function(o){
            if (o){
                backDate = o.htmlContent;
                if (!docEl){
                    var iframe = document.getElementById('ipageIframe');
                    docEl = $(iframe.contentDocument.document || iframe.contentWindow.document);
                    aEls = docEl.find('a');
                }
                docEl.find('label').hide();
                showClick(docEl, aEls);
                strDate = date;
				
				// 页面统计数据
				showPageStatData(o.pageData);
            }
        });
    }
    
    /*function getBackData(o){
        var backDate = {};
        for (var i=0, l=o.length; i<l; i++){
            var key = o[i].REAL_URL;
            backDate[key] = {};
            backDate[key].PV_CNT_1D_065 = o[i].PV_CNT_1D_065;
            backDate[key].UV_CNT_1D_120 = o[i].UV_CNT_1D_120;
        }
        return backDate;
    }*/
    
	function showPageStatData(pageData) {
		if(pageData && pageData.PV_CNT_1D_065) {
			$('#pageData_PV_CNT_1D_065').html(pageData.PV_CNT_1D_065);
		} else {
			$('#pageData_PV_CNT_1D_065').html('0');
		}
		if(pageData && pageData.UV_CNT_1D_120) {
			$('#pageData_UV_CNT_1D_120').html(pageData.UV_CNT_1D_120);
		} else {
			$('#pageData_UV_CNT_1D_120').html('0');
		}
	}
	
    function showClick(docEl, aEls){
        if (!backDate){ return; }
        var stat = $('.click-stat.current').data('stat-type'),
            length = aEls.length,
            partsLen = Math.ceil(length/400);
        
        aEls.each(function(j){
            //for (var i=0, l=backDate.length; i<l; i++){
                try {
                    var aEl = $(this),
                        href = resolveHref(aEl.attr('href')),
                        labelEl = aEl.find('.show-hit');
                    
                    if (backDate[href]){
                        //var labelEl = aEl.find('.show-hit');
                        if (!labelEl[0]){
                            labelEl = $('<label class="show-hit"></label>').appendTo(aEl);
                            
                            if (aEl.css('position')!=='absolute'){
                                aEl.css('position', 'relative');
                            }
                        } else {
                            labelEl.show();
                        }
                        
                        if (aEl.css('display')==='table-cell'){
                            aEl.css('display', 'inline-block');
                        }
                        
                        labelEl.data(stat+strDate, backDate[href][stat]);
                        labelEl.attr('title', backDate[href][stat]);
                        labelEl.text(backDate[href][stat]);
                        
                        var number = Number(backDate[href][stat]);
                        if (number<100){
                            labelEl.css('background-color', '#BC7300');
                        } else if(100<=number && number<500){
                            labelEl.css('background-color', '#FF9900');
                        } else if(500<=number && number<1000){
                            labelEl.css('background-color', '#D1FE05');
                        } else if(1000<=number && number<10000){
                            labelEl.css('background-color', '#729A14');
                        } else if (number>=10000) {
                            labelEl.css('background-color', '#00DB00');
                        }
                    }
				} catch (e) {}
            //}    
        });
            
        
    }
    
    function resolveHref( strHref ){
		if(!strHref) {return null;}
        //去除http:/或https://, 去除空白符, 单引号, 双引号, 反斜杠, 退格符
        var result = strHref.replace(/(https?:\/|\\s|\'|\"|\\\\|\b)/g, '').replace("&gt", ">").replace("&lt", "<").replace("&eq", "=").replace("&ne", "!=").replace("&le", "<=").replace("&ge", ">=").replace("%2C", ",").replace("&amp;","&");
        //去除spm 和 tracelog 
        result = result.replace(/([\?&])(spm=[^&$]*(&|$))/g, '$1');
        
        if (result.lastIndexOf("#") != -1 && result.substring(result.lastIndexOf("#")).indexOf("=") == -1) {
			result = result.substring(0, result.lastIndexOf("#"));
		}
        //去除最后的 ? & 和空白符
        result = result.replace(/[\?&\/\s]*$/g, '');
        //去除 ?之前的 /
        result = result.replace(/[\/]*(\?)/g, '$1');
        
        return result.toLocaleLowerCase();
    }
})(dcms, FE.dcms);
