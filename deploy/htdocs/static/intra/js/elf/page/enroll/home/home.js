/**
 * @author: lusheng.linls
 * @Date: 2012-09-20
 */

;(function($, T) {
    var readyFun = [
    //tab�л�
    function() {
        $.use('ui-tabs-effect', function() {
            tabs = $('#tab');
            tabs.tabs({
                isAutoPlay : false,
                event : 'click',
                select : function(e, data) {
                    var allTabs = $('.f-tab-t');
                    allTabs.find('.vline').html('|');
                    var current = $(allTabs[data.index]);
                    current.find('.vline').html('&nbsp');
                    $(current.prev()[0]).find('.vline').html('&nbsp');
                }
            });

            //�������� ��ʼ����ѯ ���� search.htm#tab=offer&memberId=ayisha000&topicId=101&topicName=%E5%95%86%
            var hash = window.location.hash.split('#');
            if(hash.length !== 2) {
                //tabs.tabs('select', 0);
                return;
            }
            if(hash[1].search('tab=collectTopic') !== -1) {
                tabs.tabs('select', 1);
            } else if(hash[1].search('tab=collectChannel') !== -1) {
                tabs.tabs('select', 2);
            } else if(hash[1].search('tab=collectTpl') !== -1) {
                tabs.tabs('select', 3);
            }
            tabs.removeClass("display-none");
        });
		
		$("#tab").delegate('.js-seriesid-del', 'click', function(e) {
            e.preventDefault();
			
            var seriesId = $(this).data('id');
			var count = $(this).data('count');
            var ajaxUrl = FE.tools.domain + '/enroll/v2012/close_series.json?seriesid=' + seriesId;
			
			if( parseInt(count) > 0 ) {
				alert('��ϵ��������ר����ʱ��ſ���ɾ����');
			} else {
				if(confirm('��ȷ��ɾ����ϵ����')) {
					jQuery.ajax(ajaxUrl, {
						type: "GET",
						async: true,
						cache: false,
						data: {},
						dataType: 'jsonp',
						success: function(dataR, textStatus){
							if( dataR.success == 'true' ) {
								window.location.reload();
							}
						}
					});
				}
			}
        });
    }];

    $(function() {
        for(var i = 0, l = readyFun.length; i < l; i++) {
            try {
                readyFun[i]();
            } catch(e) {
                if($.log) {
                    $.log('Error at No.' + i + '; ' + e.name + ':' + e.message);
                }
            } finally {
                continue;
            }
        }
    });
})(jQuery, FE.tools);
