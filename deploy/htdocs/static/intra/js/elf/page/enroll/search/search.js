/**
 * @package FE.app.elf.enroll.search
 * @author: lusheng.linls
 * @Date: 2012-09-07
 */

;(function($, T) {
    var topicCell = new T.Topiccell($("#tab")),
		dialogSeriesDelConfirm;
    var readyFun = [
    //tab切换
    function() {
        var curTab = $('#curTab').val();
        var defaultSelected=1;
        if(curTab.length > 0) {
            if(curTab.search('tab=series') !== -1) {
                defaultSelected=0;
            } else if(curTab.search('tab=topic') !== -1) {
                defaultSelected=1;
            } else if(curTab.search('tab=offer') !== -1) {
                defaultSelected=2;
            } else if(curTab.search('tab=member') !== -1) {
               defaultSelected=3;
            }
        }
        $.use('ui-tabs-effect', function() {
            var tabs = $('#tab'),
            initSearch=false;
            tabs.tabs({
                selected : defaultSelected,
                isAutoPlay : false,
                event : 'null',
                select : function(e, data) {
                    var allTabs = $('.f-tab-t');
                    allTabs.find('.vline').html('|');
                    var current = $(allTabs[data.index]);
                    current.find('.vline').html('&nbsp');
                    $(current.prev()[0]).find('.vline').html('&nbsp');
                    if(!initSearch){
                        initSearch=true;
                        if(defaultSelected==1){
                        	$("#searchType").val("myTopic");
                        }
                        search(data.box.find('.js-search'), false);
                    }
                }
            });
            tabs.removeClass("display-none");
        });
    },

    //初始化表格
    function() {
    	//html复制
        var prototypes = $(".detail");
        for(var i = 0; i < prototypes.length; i++) {
            var prototype = $(prototypes[i]);
            var sample = "";
            var pageSize = prototype.closest('.f-tab-b').find('input[name=pagesize]').val();
            for(var j = 1; j < pageSize; j++) {
                var clone = prototype.clone();
                sample = sample + clone.html();
            }
            $(sample).appendTo(prototype);
        }
    },

    //我的专场，我的收藏，全部专场，3个链接事件
    function(){
    	$("#myTopic").bind("click", function() {
    		$(".collection-area").find('.current').removeClass('current');
    		this.parentNode.className="current";
    		$("#detailCondition").addClass("display-none");
    		$("#searchType").val("myTopic");
    		search($("#searchTopic"), false);
        });
    	$("#myCollection").bind("click", function() {
    		$(".collection-area").find('.current').removeClass('current');
    		this.parentNode.className="current";
    		$("#detailCondition").addClass("display-none");
    		$("#searchType").val("myCollection");
    		search($("#searchTopic"), false);
        });
    	$("#allTopics").bind("click", function() {
    		$(".collection-area").find('.current').removeClass('current');
    		this.parentNode.className="current";
        	$("#detailCondition").removeClass("display-none");
    		$("#searchType").val("allTopics");
    		search($("#searchTopic"), false);
        });
    },
    
    //渲染查询结果
    function() {
        $.use('web-alitalk', function() {
            $(".f-tab-b .detail").live("reload", function(event, data) {
                var detail = $(event.currentTarget);
                var msg = detail.siblings('.msg');
                var page = detail.siblings('.paging');
                if(data.list === null || data.list.length <= 0) {
                    detail.css("display", "none");
                    page.css("display", "none");
                    msg.css("display", "block");
                    return;
                }
                detail.siblings('.msg').css("display", "none");
                detail.css("display", "block");

                var samples = detail.find('.sample');
                var condition = detail.closest('.f-tab-b').find('.condition');
                var hidden = false;
                if(data.list.length > 1) {
                    hidden = true;
                }
                //主记录
                for(var i = 0; i < data.list.length; i++) {
                    var sample = $(samples[i]);
                    var mainRec = data.list[i];
                    renderSeries(sample, mainRec);
                    topicCell.renderTopic(sample, mainRec, data.loginId);
                    renderOfferMember(sample, mainRec, hidden);
                    sample.css("display", "inline-table");
                }
                //把多余的行隐藏
                for(var i = data.list.length; i < samples.length; i++) {
                    $(samples[i]).css("display", "none");
                }
                buildPage(condition, data, page);
                //console.log(data);
                pagelistallEvent(data);

            });
        });
    },

    //各种触发查询操作事件绑定
    function() {
        //鼠标点击立即查询
        $(".js-search").bind("click", function() {
            search($(this), false);
        });
        //立即查询回车触发
        $(".condition").live('keypress', function(event) {
            if(event.keyCode == '13') {
                var jsSearch = $(this).find('.js-search');
                search(jsSearch, false);
            }
        });
        //分页页码触发
        $(".f-tab-b .detail").siblings('.paging').delegate('a', 'click', function() {
            var jThis = $(this);
            if(!jThis.data('page')) {
                return;
            }
            var condition = jThis.closest('.f-tab-b').find('.condition');
            condition.find('input[name=curpage]').val(jThis.data('page'));
            search(condition.find(".js-search"), true);
        });
    },
	//事件绑定
	function() {

        //选择品类
        new FE.tools.Select('#select-pinlei', {
                    optionEl: 'dd'
                });
        
		//删除系列确认浮出层
		$(".js-dialog-confirm-delete").bind("click",function(e){
			var delEl = $(this).data('delEl');
			jQuery.ajax($(this).data('delUrl'), {
				type: "GET",
				async: true,
				cache: false,
				data: {},
				dataType: 'jsonp',
				success: function(dataR, textStatus){
					if( dataR.success == 'true' ) {
						delEl.hide(300);
					}
				}
			});
			
			dialogSeriesDelConfirm.dialog('close');
		});
		
		//浮层的关闭按钮
		$('.dialog-series-confirm-delete .btn-cancel, .dialog-series-confirm-delete .close').click(function(){
			dialogSeriesDelConfirm.dialog('close');
		});
	},

    //查询结果中的操作列
    function() {
		var dialogComfirm = $(".js-dialog-confirm-delete");
		$("#tab").delegate('.js-seriesid-del', 'click', function(e) {
            e.preventDefault();
			
			var el = $(this);
			var sample = el.closest('.sample');
			
            var seriesId=$(this).data('series').seriesId;
			var count=$(this).data('series').topicCount;
            var ajaxUrl = FE.tools.domain + '/enroll/v2012/close_series.json?seriesid=' + seriesId;
			
			if( parseInt(count) > 0 ) {
				alert('当系列下面无专场的时候才可以删除！');
			} else {
				$.use('ui-dialog', function(){
					dialogSeriesDelConfirm = $('.dialog-series-confirm-delete').dialog({
						center: true,
						fixed:true
					});
				});
				dialogComfirm.data('delEl', sample);
				dialogComfirm.data('delUrl', ajaxUrl);
			}
        });
        $("#tab").delegate('.js-rejectreason', 'click', function(e) {
            e.preventDefault();
            $(this).closest('.sub-sample').next('.sub-sample-msg').toggle(200);
        });
        $("#tab").delegate('.js-enroll-offer-detail', 'click', function(e) {
            e.preventDefault();
            var subSample = $(this).closest('.sub-sample');
            var topicName = subSample.find('.js-topicname').text();
            var topicId = subSample.find('.js-topicid').text();
            var sample = subSample.closest('.sample');
            var memberId = sample.find('.js-member-id').text();
            window.open(T.domain + '/enroll/v2012/search.htm?tab=offer&memberId=' + memberId + '&topicId=' + topicId + '&topicName=' + topicName);
        });
    },


    //折叠展开
    function() {
        $(".js-sublist-more").live("click", function() {
            var e = $(this);
            if(e.text() === '＋ 展开所有') {
                e.text('－ 恢复折叠');
                e.closest('.sample').find('.sub-sample').removeClass('display-none');
            } else if(e.text() === '－ 恢复折叠') {
                e.text('＋ 展开所有');
                var subSamples = e.closest('.sample').find('.sub-sample');
                for(var i = 4; i < subSamples.length; i++) {
                    var subSample = $(subSamples[i]);
                    subSample.addClass('display-none');
                    var subSampleMsg = subSample.next('.sub-sample-msg');
                    subSampleMsg.css('display', "none");

                }
            }

        });
    },

    //活动专场选择控件
    function() {
        var topicSeriesJsonUrl=T.domain + '/enroll/v2012/topic_series.json';
        //查找活动
        new FE.tools.Suggestion('#js-select-series', {
            url : topicSeriesJsonUrl,
            data : {
                'type' : '1'
            },
            paramName : 'seriesName',
            valInput : '#js-select-series-id',
            isDefaultItem : false
        });
        $('#js-select-series').live('change', function() {
            var e = $(this);
            if($.trim(e.val()) === '') {
                $('#js-select-series-id').val('');
            };
        });
        //查找offer
        new FE.tools.Suggestion('#js-select-topic', {
            url : topicSeriesJsonUrl,
            data : {
                'type' : '2'
            },
            paramName : 'topicName',
            valInput : '#js-select-topic-id',
            isDefaultItem : false
        });
        $('#js-select-topic').live('change', function() {
            var e = $(this);
            if($.trim(e.val()) === '') {
                $('#js-select-topic-id').val('');
            };
        });
        //查找专场
        var jsSelectTopic2 = new FE.tools.Suggestion('#js-select-topic-2', {
            url : topicSeriesJsonUrl,
            data : {
                'type' : '2'
            },
            paramName : 'topicName',
            valInput : '#js-select-topic-id-2',
            isDefaultItem : false
        });
        $('#js-select-topic-2').live('change', function() {
            var e = $(this);
            if($.trim(e.val()) === '') {
                $('#js-select-topic-id-2').val('');
            };
        });
        new FE.tools.Suggestion('#js-select-series-2', {
            url : topicSeriesJsonUrl,
            data : {
                'type' : '1'
            },
            paramName : 'seriesName',
            valInput : '#js-select-series-id-2',
            isDefaultItem : false,
            complete : function() {
                $('#js-select-series-2').change();
            }
        });
        $('#js-select-series-2').live('change', function() {
            var e = $(this);
            var eVal = $.trim(e.val());
            if(eVal === '') {
                $('#js-select-series-id-2').val('');
                jsSelectTopic2.setConfig({
                    data : {
                        'type' : '2'
                    }
                });
                return;
            };
            $('#js-select-topic-2').val('');
            $('#js-select-topic-id-2').val('');
            var seriesId = $('#js-select-series-id-2').val();
            jsSelectTopic2.setConfig({
                data : {
                    'type' : '2',
                    'seriesId' : seriesId
                }
            });
        });
    },

    //验证或修正输入
    function() {
        $("input[name=offerid]").bind("keyup", function() {
            var e = $(this);
            e.val(e.val().replace(/[^\d]/g, ''));
        });
    },

    //输入框默认去前后空格
    function() {
        $("input[type=text]").bind("blur", function() {
            var e = $(this);
            e.val($.trim(e.val()));
        });
    }];
    //zhuliqi pagelist
    function getParamData(formEq,rs) {
        var pagesize = parseInt($('input[name=pagesize]').eq(formEq).val());
        var maxWidth = [999,999,999,999]
        var minWidth = [745,745,809,809]
        if(formEq == 0 || formEq == 1) {
            var maxLeft = 0;
            var formEq = $('.tab-b li').index($('.tab-b .current'))
            $('.detail').eq(formEq).find('div.sample').each(function(){
                if($(this).offset().left > maxLeft) {
                    maxLeft = $(this).offset().left
                }
            })
            //缩进于非缩进的宽度变化
            if( !$('.libra-js-menu-ctrl').hasClass('toright') ){
                width = maxLeft + 40;
            }else {
                width = maxLeft + 40;
            }
            
            if(width < 745) width = 745;
        }else{
            var width = $('#tab').width() + 10;
            if(width < minWidth[2] ) width = minWidth[2];
        }        
        var left = $('.js-rs-detail').eq(formEq).offset().left - 10;
        var data = {
            curPage: $('input[name=curpage]').eq(formEq).val(),
            page: Math.ceil(rs.count / pagesize),//几页
            titlelist: rs.count,//多少条
            leftContent: '',
            rightContent: '',
            limit: 3,
            width: width + 'px',
            left: left + 'px',
            curPageInput: $('input[name=curpage]').eq(formEq),
            maxWidth: maxWidth[formEq],
            minWidth: minWidth[formEq]
        }
        return data       
    }
    function pagelistallEvent(rs){
        var _this = this;
        if( $('html').attr('pagelistallEvent') ) {return}; 
        $('html').attr('pagelistallEvent',true);
        var formEq = $('.tab-b .f-tab-t').index($('.tab-b .current'));        
        var data = getParamData(formEq,rs);
        var pagelistall = new T.pagelistall(data);
        pagelistall.bindEvnet = function(){
            var _self = this;
            //点击页码跳转
            $('li.pagination > a.pages').live('click',function(){
                //获取页面
                var toPage = $(this).data('page');
                _self.data.curPageInput.val(toPage);
                //刷新也页面
                search($('button.js-search').eq(formEq),true);
                //刷新分页信息  
                var data = getParamData(formEq,rs);              
                _self.reflashpage(data);
            })
            //点击上下页面跳转
            $('#offer-page-prev').click(function(){
                var curPage = parseInt($('input[name=curpage]').eq(formEq).val());
                if(curPage <= 1) return;
                var toPage = curPage - 1;                
                _self.data.curPageInput.val(toPage);
                search($('button.js-search').eq(formEq),true);
                var data = getParamData(formEq,rs);                
                _self.reflashpage(data);
            })
            $('#offer-page-next').click(function(){
                var curPage = parseInt($('input[name=curpage]').eq(formEq).val());
                if(curPage >= _self.data.page) return;
                var toPage = curPage + 1;
                _self.data.curPageInput.val(toPage);
                search($('button.js-search').eq(formEq),true);
                var data = getParamData(formEq,rs);                
                _self.reflashpage(data);
            })
            //通过确定按钮跳转
            $('.js-goto').click(function(){
                var toPage = $('input.js-jump-page').val();
                if( !isNaN(toPage) && parseInt(toPage) <= _self.data.page && parseInt(toPage) > 0 ) {
                     _self.data.curPageInput.val(toPage);
                    search($('button.js-search').eq(formEq),true);
                    var data = getParamData(formEq,rs);                
                    _self.reflashpage(data);
                }else{
                    alert('请输入1 ~ ' + _self.data.page);
                }
            })

            //通过键盘输入
            $(".js-jump-page").live('keypress', function(event) {
                if(event.keyCode == '13') {
                    //var page = $(this).closest('.paging');
                    $('.js-goto').click();
                }
            });

        };
        pagelistall.winresize = function(maxWidth,minWidth,width){
            //自适应大小
            var newWidth = 205;
            var newmaxWidth = maxWidth + 310;

            $(window).resize(function(){
                // if($('.libra-js-menu-ctrl').hasClass('toright')) {
                //     newWidth = 150;
                //     maxWidth = newmaxWidth;
                //     // console.log(1);
                // }
                var formEq = $('.tab-b li').index($('.tab-b .current'))
                if(formEq == 2 || formEq == 3) {
                    var winWidth = $(window).width();
                    // console.log(winWidth)
                    if((winWidth - newWidth) <= maxWidth && (winWidth - newWidth) >= minWidth){
                        $('#fixBottomPageList').width(winWidth - newWidth);
                    }else if( (winWidth - newWidth) > maxWidth ){
                        $('#fixBottomPageList').width(maxWidth)
                    }else if( (winWidth - newWidth) < minWidth ) {
                        $('#fixBottomPageList').width(minWidth)
                    }                     
                }else{
                    var maxLeft = 0;
                    $('.detail').eq(formEq).find('div.sample').each(function(){
                        if($(this).offset().left > maxLeft) {
                            maxLeft = $(this).offset().left
                        }
                    })
                   // _self.saveLeft = $('#fixBottomPageList').width();
                   if( !$('.libra-js-menu-ctrl').hasClass('toright') ){
                        if(minWidth <= maxLeft + 40) {
                            $('#fixBottomPageList').width(maxLeft + 40)
                        }else{
                            $('#fixBottomPageList').width(minWidth)
                        }
                        
                    }else {
                        if(minWidth <= maxLeft + 240) {
                            $('#fixBottomPageList').width(maxLeft + 240)
                        }else{
                            $('#fixBottomPageList').width(minWidth)
                        }
                    }
                    
                }
               
                // $('#fixBottomPageList').width

            })
        }
        _this.pagelistall = pagelistall;
        pagelistall.init(data);

    }
    //查找 e：立即查询按钮;page：是否保留当前页
    var searchEnable = true;
    function search(e, page) {
        var _self = this;
        if(!searchEnable) {
            return;
        }
        $('#fixBottomPageList').hide();
        searchEnable = false;
        // $(this).toggleClass("btn-blue");
        // $(this).toggleClass("btn-gray");
        var tab = e.closest(".f-tab-b");
        var form = e.closest("form");
        var jsRsDetail = tab.find('.js-rs-detail');
        var loading = tab.find('.loading');
        jsRsDetail.addClass('display-none');
        loading.removeClass('display-none');
        var detail = tab.find('.detail');
        if(!page) {
            form.find('input[name=curpage]').val(1);
        }
        var params = form.serialize();
        var url = form.data("url");
        $(window).scrollTop(0);
        $.ajax({
            url : url + "?_input_charset=UTF-8",
            type : "post",
            data : params,
            error : function(jqXHR, textStatus, errorThrown) {
                searchEnable = true;
                var msg = '页面超时，请刷新重试';
                if(jqXHR.status === 0) {
                    msg = '没权限！'
                }
                alert(msg);
                jsRsDetail.removeClass('display-none');
                loading.addClass('display-none');
                return;
            },
            success : function(rs, textStatus, jqXHR) {
                searchEnable = true;
                jsRsDetail.removeClass('display-none');
                loading.addClass('display-none');
                if(!rs.success) {
                    alert("页面超时，请刷新重试");
                    return;
                }
                detail.trigger("reload", rs);
                //pagelist reflash
                var formEq = $('.tab-b .f-tab-t').index($('.tab-b .current'));
                var data = getParamData(formEq,rs);   
                var pagelist = new T.pagelistall();
                var pagesize = parseInt($('input[name=pagesize]').eq(formEq).val());
                pagelist.reflashpage(data);                
                $('.paging-t li').eq(1).html('共<em>'+ Math.ceil(rs.count / pagesize) +'</em>页&nbsp;&nbsp;'+ rs.count +'条&nbsp;&nbsp;<input class="pnum js-jump-page" autocomplete="off" type="text">')
                if(_self.pagelistall) {
                    _self.pagelistall.data = data;
                    _self.pagelistall.bunnerFlow();
                    $('#fixBottomPageList').show();
                }
                //分页面宽度调整
                $(window).resize();
                if( rs.list == null ) { 
                    $('#fixBottomPageList').hide() 
                    return 
                }
                $('#fixBottomPageList').show()

            }
        });

    };

    function alitalkOnremote(data) {
        var el = $(this);
        el.html(data.id);
        switch (data.online) {
            case 0:
            case 2:
            case 6:
            default:
                //不在线
                el.html('');
                break;
            case 1:
                //在线
                el.html('');
                break;
            case 4:
            case 5:
                //手机在线
                el.html('');
                break;
        }
    };

    //分页
    function buildPage(condition, data, page) {
        var pagesize = parseInt(condition.find('input[name=pagesize]').val());
        var cur = parseInt(condition.find('input[name=curpage]').val());
        var pageCount = Math.ceil(data.count / pagesize);
        var no = '';

        var total = pageCount;
        if(cur < 1)
            cur = 1;
        if(total < 1)
            total = 1;
        if(cur > total)
            cur = total;
        var html = [], pre, next;

        if(cur == 1) {
            html.push('<a class="prev-disabled" href="javascript:;">上一页</a>');
            html.push('<span class="current">1</span>');
        } else {
            html.push('<a class="prev" href="javascript:;" data-page="' + (cur - 1) + '">上一页</a>');
            if(cur <= 4 || total <= 7)
                html.push('<a href="javascript:;" data-page="1">1</a>');
        }
        if(total > 1) {
            //cur==1?
            if(cur < 3) {
                pre = 0;
                next = cur == 1 ? 5 : 4;
                if(cur + next > total)
                    next = total - cur;
            } else if(cur == 3) {
                pre = 1;
                next = 3;
                if(cur + next > total)
                    next = total - cur;
            } else {
                pre = 2;
                next = 2;
                if(cur + next > total)
                    next = total - cur;
                pre = 4 - next;
                if(cur + 3 > total)
                    pre++;
                if(cur - pre < 2)
                    pre = cur - 2;
            }

            for(var i = pre; 0 < i; i--)
            html.push('<a href="javascript:;" data-page="' + (cur - i) + '">' + (cur - i) + '</a>');
            if(cur > 1)
                html.push('<span class="current">' + cur + '</span>');
            for(var i = 1; i < next + 1; i++)
            html.push('<a href="javascript:;" data-page="' + (cur + i) + '">' + (cur + i) + '</a>');

            if(cur + next < total - 1) {
                html.push('<span class="omit">...</span>');
            }
            if(cur + next == total - 1)
                html.push('<a href="javascript:;" data-page="' + total + '">' + total + '</a>');
        }
        if(cur == total)
            html.push('<a class="next-disabled" href="javascript:;">下一页</a>');
        else {
            html.push('<a class="next" href="javascript:;" data-page="' + (cur + 1) + '">下一页</a>');
        }
        var pagination = page.find('.pagination');
        pagination.empty();
        $(html.join('')).appendTo(pagination);
        page.find('.js-count').text(pageCount);
        page.css("display", "block");
    };

    //渲染活动
    function renderSeries(sample, mainRec) {
        if(!sample.closest('#search-series')[0]) {
            return;
        }
        var jsSeriesid=sample.find('.js-seriesid');
        if(mainRec.seriesId==106){
            jsSeriesid.data('series', mainRec).addClass('display-none');
        }else{
            jsSeriesid.data('series', mainRec).removeClass('display-none');
        }
        jsSeriesid.attr('href',FE.tools.domain + '/enroll/v2012/series.htm?id=' + jsSeriesid.data('series').seriesId);

		if(mainRec.seriesId==106){
            sample.find('.js-seriesid-del').data('series', mainRec).addClass('display-none');
        }else{
            sample.find('.js-seriesid-del').data('series', mainRec).removeClass('display-none');
        }
        sample.find('.js-gmtcreate').text(mainRec.gmtCreate);
        var topicUrl = T.domain + '/enroll/v2012/topic_list.htm?seriesId=' + mainRec.seriesId;
        sample.find('.js-series-name').html('<a target="_blank" href="' + topicUrl + '">' + mainRec.seriesName + '</a>').attr('title', mainRec.seriesName);
        sample.find('.js-topic-count').html('<a target="_blank" href="' + topicUrl + '">' + mainRec.topicCount + '个专场</a>');
        var chineseName = '';
        if(mainRec.chineseName !== null && mainRec.chineseName !== '') {
            chineseName = mainRec.chineseName;
        } else {
            chineseName = mainRec.operator;
        }
        var alitalk = new Object();
        if(mainRec.aliWW !== null && mainRec.aliWW !== '') {
            alitalk.id = mainRec.aliWW;
            alitalk.siteID = 'cnalichn';
        } else if(mainRec.tbWW !== null && mainRec.tbWW !== '') {
            alitalk.id = mainRec.tbWW;
            alitalk.siteID = 'cntaobao';
        } else {
            alitalk.id = chineseName;
            alitalk.siteID = 'cnalichn';
        }
        var alitalkJson = "{id:'" + alitalk.id + "',siteID:'" + alitalk.siteID + "'}";
        var newOperator = $('<a class="fd-right js-operator" href="#" data-alitalk="' + alitalkJson + '">' + chineseName + '</a>');
        var operator = sample.find('.js-operator');
        operator.replaceWith(newOperator);
        FE.util.alitalk(newOperator, {
            onRemote : function(data) {
                alitalkOnremote(data);
            }
        });
    };

    //渲染offer和member
    function renderOfferMember(sample, mainRec, hidden) {
        if(!sample.closest('#search-offer,#search-member')[0]) {
            return;
        }
        sample.find('.js-offer-id').text(mainRec.offerId);
        sample.find('.js-member-id').text(mainRec.memberId);
        sample.find('.js-audit-pass').text(mainRec.auditPass);
        sample.find('.js-enroll-count').text(mainRec.enrollCount);
        sample.find('.js-pass-rate').text(mainRec.passRate);
        var ahref = 'http://amos.im.alisoft.com/msg.aw?v=2&uid=' + mainRec.loginIdEscapeURL + '&site=cnalichn&s=4&charset=gbk';
        var imgSrc = 'http://amos.im.alisoft.com/online.aw?v=2&uid=' + mainRec.loginIdEscapeURL + '&site=cnalichn&s=4&charset=gbk'
        sample.find('.js-login-id-a').attr('href', ahref);
        sample.find('.js-login-id-img').attr('src', imgSrc);

        if(!mainRec.subList || mainRec.subList === null) {
            sample.css("display", "inline-table");
            return;
        }
        //附属记录
        var subSamples = sample.find('.sub-sample');
        //补充行
        var prototype = $(subSamples[0]);
        var sampleHtml = "";
        for(var k = subSamples.length; k < mainRec.subList.length; k++) {
            var clone = prototype.clone();
            sampleHtml = sampleHtml + clone[0].outerHTML + '<tr class="sub-sample-msg"><td colspan="5"></td></tr>';
        }
        if(sampleHtml !== "") {
            prototype.next('.sub-sample-msg').after(sampleHtml);
            //dom更新后，得重新find一次
            subSamples = sample.find('.sub-sample');
        }
        var jsSublistMore = sample.find('.js-sublist-more');
        jsSublistMore.text('');
        for(var j = 0; j < subSamples.length; j++) {
            var subSample = $(subSamples[j]);
            subSample.addClass('display-none removed');
            var subSampleMsg = subSample.next('.sub-sample-msg');
            subSampleMsg.css('display', "none");
            var rejectreason = subSample.find(".js-rejectreason");
            rejectreason.addClass('display-none').removeClass('inline');
            var jsState = subSample.find('.js-state');
            jsState.removeClass('green red');
            if(j >= mainRec.subList.length) {
                continue;
            }
            var subRec = mainRec.subList[j];
            jsState.text(subRec.state);
            subSample.find('.js-sourceRefCn').text(subRec.sourceRefCn);
            subSample.find('.js-enrolltime').text(subRec.enrollTime);
            subSample.find('.js-topicname').text(subRec.topicName);
            subSample.find('.js-topicid').text(subRec.topicId);
            if(subRec.state === '未通过') {
                jsState.addClass('red');
                rejectreason.addClass('inline').removeClass('display-none');
                if(subRec.rejectResons === 'null' || subRec.rejectResons === '') {
                    subRec.rejectResons = '资质审核不通过'
                }
                subSampleMsg.find('td').html(subRec.rejectResons);
            } else if(subRec.state === '已通过') {
                jsState.addClass('green');
            }
            if(j <= 3 || !hidden) {
                subSample.removeClass('display-none');
            } else {
                jsSublistMore.text('＋ 展开所有');
            }
            subSample.removeClass('removed');
        }
    };

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
