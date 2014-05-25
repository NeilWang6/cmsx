/**
 * Industry Masthead 1.0
 * @version FDev4 1.0 2012.08.29
 * @author raywu
 * @update xxx
 */
(function($){
	$(function(){
		var masthead = $('#ali-masthead-industry');
		if(!masthead.length){
			return;
		}
		var searchContainer = masthead.find('div.ali-search'),
			searchForm = searchContainer.find('form').eq(0),
			keywords = searchContainer.find('input.search-keywords'),
			keywordsContainer = keywords.closest('.alisearch-txt'),
			placeLabel = searchContainer.find('.alisearch-hint'),
			wpSearchUrl = searchForm.attr('action'),
			siteSearchUrl = 'http://s.1688.com/selloffer/offer_search.htm',
			suggestion;
		function baseTraceClick(param){
			var url = 'http://stat.1688.com/tracelog/click.html';
			param = '?tracelog='+param;
			if (typeof window.dmtrack != "undefined") {
				dmtrack.clickstat(url, param);
			} else {
				var d = new Date();
				if (document.images) {
					(new Image).src = url + param+'&time='+d.getTime();
				}
			}
			return true;
		}
		var handlers = { 
			/**
			 * placeholder
			 */
			placeholderInit: function(){
				if(keywords.val()!==''){
					searchContainer.addClass('search-input');
				}
				placeLabel.click(function(e){
					e.preventDefault();
					searchContainer.addClass('search-input');
					keywords.trigger('focus');
				});
				keywords.focus(function(){
					searchContainer.addClass('search-input');
					searchContainer.addClass('search-focus');
				});
				keywords.blur(function(){
					if(keywords.val()===''){
						searchContainer.removeClass('search-input');
					}
					searchContainer.removeClass('search-focus');
				});
			},
			/**
			 * 关键字搜索建议
			 */
			suggestionInit: function(){
				$.add('web-suggestion', {
					requires: ['ui-autocomplete'],
					js: ['suggestion.js']
				});
				keywords.bind('focus.suggestion', function(){
					$.use('web-suggestion', function(){
						suggestion = new FE.ui.Suggestion(keywords, {
							appendTo: keywordsContainer,
							url: 'http://suggest.1688.com/bin/suggest?cnt=10&recommend=Y',
							type: 'offer',
							position: {
								my: 'left top',
								at: 'left bottom',
								offset: '-7 5'
							},
							widthfix: 7
						});
					});
					keywords.unbind('focus.suggestion');
				});
			},
			/**
			 * 重写表单onsubmit事件
			 */
			submitInit: function(){
				searchForm.get(0).onsubmit = function(){
					if (keywords.val()==='') {
						keywords.focus();
						return false;
					}
					//$.log('search submit!');
					return true;
				};
			},
			/**
			 * 搜索按钮
			 */
			searchSubmit: function(){
				searchContainer.find('.search-wp-btn').click(function(e){
					e.preventDefault();
					if(keywords.val()!==''){
						searchForm.attr('action',wpSearchUrl);
						searchForm.attr('target','_self');
						searchForm.trigger('submit');
					}
				});
				searchContainer.find('.search-site-btn').click(function(e){
					e.preventDefault();
					if(keywords.val()!==''){
						searchForm.attr('action',siteSearchUrl);
						searchForm.attr('target','_blank');
						searchForm.trigger('submit');
					}
				});
			},
			/**
			 * 搜索按钮
			 */			 
			traceLogInit: function(){
				masthead.on('mousedown','[data-header-trace]',function(){
					var param=$(this).data('headerTrace')||'';
					if(param){
						if(typeof aliclick !== 'undefined'){
							aliclick(null,'?tracelog='+param);
						}else{
							baseTraceClick(param);
						}
					}
				});
			}
		};
		for (var p in handlers) {
			handlers[p]();
		}
	});
})(jQuery);

