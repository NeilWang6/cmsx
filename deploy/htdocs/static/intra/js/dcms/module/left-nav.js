/**
 * @package FD.app.cms.left-nav
 * @author: yanlong.liuyl
 * @date: 2011-03-06
 */

(function($) {
	//边栏高度设定
	var $win = $(window), width = $win.width(), height = 0;
	var sHeight = (document.documentElement.scrollHeight), cHeight = (document.documentElement.clientHeight);
	height = Math.max(sHeight, cHeight);
	$('#js-dcmsleftnav').css('height', height - $('.dcms-header').outerHeight() - $('.page-content').outerHeight());
	/*modify by hongss on 2011.03.13 start*/
	var domLeftNav = $('#js-dcmsleftnav'), domToggle = $('#js-dcmstoggle'), domLeftTitles = $('h2', domLeftNav), toggleHeight = $('section.dcms-main-body').height();

	domLeftTitles.click(function(e) {
		if($(this).hasClass('dcms-slide') && !$(this).hasClass('menuitem')) {
			$(this).next('ul').slideToggle(200);
			$(this).toggleClass('dcms-slide');
		} else if(!$(this).hasClass('menuitem')) {
			$('ul', domLeftNav).hide(200);
			domLeftTitles.removeClass('dcms-slide');
			$(this).next('ul').show(200);
			$(this).addClass('dcms-slide');
		}
	});

	var currentPage = $('body').attr('class').split(' ')[1].replace('page', 'nav');
	if(currentPage.match('modify')) {//修改指向管理，如modifyPosition 指向 managePosition
		currentPage = currentPage.replace(/modify/g, 'manage');
	}
	if(currentPage.match('copy')) {//复制指向新建，如copyPosition 指向 createPosition
		currentPage = currentPage.replace(/copy/g, 'create');
	}

	var currentA = $('.' + currentPage, domLeftNav);
	var tep = window.location.search.slice(1).split('&');
	$(tep).each(function() {
		var value = this.split('=');
		if(value[0] == 'template_type' && value[1] == 'page_layout') {
			currentA = $('.' + currentPage + '-page_layout', domLeftNav);
		}
		if(value[0] == 'template_type' && value[1] == 'box') {
			currentA = $('.' + currentPage + '-box', domLeftNav);
		}
	})
	currentA.addClass('dcms-current').parent().parent().show(0).prev().addClass('dcms-slide');
	$('nav', '#js-dcmsleftnav').find('a').click(function() {
		$('nav', '#js-dcmsleftnav').find('a').removeClass('dcms-current');

		$(this).addClass('dcms-current');
	})
	/*end*/
	domToggle.click(function(e) {
		domLeftNav.toggle();
		$('.dcms-main-body').toggleClass('dcms-leftnav-hidden');

	});

	//domToggle.css('height', toggleHeight);
	$('#js-dcmsleftnav').on('click', 'h2', function() {
		$('#js-dcmsleftnav').find('i.cms-icon-close').removeClass('cms-icon-open');
		if($(this).hasClass('dcms-slide')) {
			$(this).find('i.cms-icon-close').toggleClass('cms-icon-open');
		}

	})
	$('.dcms-current').closest('nav').find('i.cms-icon-close').addClass('cms-icon-open')
	//移动动画
	var topLeft = $('#js-dcmsleftnav'), topLeftButton = $('.page-content').find('.icon-moveposition'), contentBody;

	//缩进
	topLeftButton.click(function() {
		if($('.dcms-content')[0]) {
			contentBody = $('.dcms-content');
		} else {
			contentBody = $('.dcms-box-body');
		}
		if($(this).hasClass('toright')) {
			topLeft.removeClass('move-moveend--182')
			topLeft.addClass('move-moveend-0');
			$(this).removeClass('toright')
			$('.page-content').removeClass('move-moveend--182').addClass('move-moveend-0');
			// contentBody.removeClass('move-moveend--182').addClass('move-moveend-0');
			contentBody.removeClass('move-marginleft16-500ms').addClass('move-marginleft200-500ms');

			if($('#tools_panel')[0]) {
				contentBody.css({
					//width : '1237',
					transition : 'margin-left 500ms'
				});
				$('#tools_panel').removeClass('move-moveend--182').addClass('move-moveend-0');
			}
		} else {
			topLeft.removeClass('move-moveend-0');
			topLeft.addClass('move-moveend--182');
			$(this).addClass('toright');
			$('.page-content').removeClass('move-moveend-0').addClass('move-moveend--182');
			// contentBody.removeClass('move-moveend-0').addClass('move-moveend--182');
			contentBody.removeClass('move-marginleft200-500ms').addClass('move-marginleft16-500ms');
			if($('#tools_panel')[0]) {
				$('#tools_panel').removeClass('move-moveend-0').addClass('move-moveend--182');
				contentBody.css({
					//width : '1422',
					transition : 'margin-left 500ms'
				});
			}
		}
	});
	//权限管理，没有LI的分类隐藏掉
	$('#js-dcmsleftnav > nav').each(function() {
		if($(this).find('li').size() === 0) {
			$(this).hide()
		} else {
			$(this).show()
		}
	})
	//标签HOVER状态绑定
	if(location.hostname.slice(0, 3) === "cms" && $('div.menu_nav')[0]) {
		$('div.menu_nav').eq(0).addClass('nowapply');
	}

})(dcms); 