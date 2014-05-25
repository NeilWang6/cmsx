/**
 * 图片管家系统组件
 * 移植基于YUI2的图片管家功能组件为jQuery版本
 * @version 2.7
 * @update Denis 2011.08.23 提供初始化选中图片的数组配置
 * @author Denis 2011.06
 * @author Qijun 2011.09 BugFixed
 * @author Denis 2011.09 增加allowMultiple配置
 * @update Qijun 2011.10 增加图片选择上限的功能
 * @update Qijun 2011.10 修改相册数据40 - 500
 * @update Denis 2011.11.17 由组件控制allowMultiple的高度，修复在false下“创建相册”并选择“密码”模式时的高度问题。
 *                          当albumId无法匹配时默认选中“我的相册”
 * @update Denis 2011.11.22 根据用户类型限定“创建相册”的类型
 * @update hua.qiuh 2011.12.06 更改flash文件地址，使用2.9版本
 * @update Denis 2011.12.01 提供uploadAlbumChange参数，为上传服务
 *                          提供可修改“插入图片”按钮的文案配置 submitText
 *                          提供可隐藏“创建相册”功能的配置 albumCreate
 * @update Denis 2011.12.06 提供“albumAuth”参数，提供可隐藏相册创建权限选择
 * @update Denis 2011.12.08 提供“watermark”参数，可设置是否勾选水印
 * @update Denis 2012.01.13 修改相册已满时上传图片错误的提示文案
 * @update Denis 2012.02.14 使用figo配置picman服务器地址
 * @update Denis 2012.02.17 修复IE6下图片管家图片鼠标hover不出现title信息的BUG
 * @update jianping.shenjp 2012.03.8 切换至新的flash uploader2上传组件，使得在IE，firefox，chrome下均使用flash进行上传;优化上传错误提示，告诉用户错误原因和相应的上传失败的图片
 * @update Denis 2012.05.30 修复用户相册数操作500之后，“我的相册”没有获取到而引起的BUG。修改读取上限为1000
 * @update vivian.xul 2012.08.02 修改只允许插入1张图片时，选择非当前选中图片后，将已选中的清空并插入新选择的图片
 * @update vivian.xul 2012.10.12 提供“hasWatermark”参数，可设置是否显示设置水印
 */
(function($, SYS){
    //noformat
    var $util = $.util,
		$substitute = $util.substitute,
		ie6 = $util.ua.ie6,
		context, 
		container,
        wrap,
		overlay, 
		tabs,
		tabContents,
		albumList,
		albumPaging,
		albumEmpty,
		albumPagingInst,
		uploader,
        albumCreate,
        albumAuthDl,
		watermark,
		watermarkDl,
		uploadTips,
		olField,
		olButton,
		olDD,
		insertContainer,
		imgPool,
		imgBg,
		albumCombo,
		uploadCombo,
		loading,
		poolNum,
		btnSubmit,
        btnSubmitEm,
        btnSubmitText,
		defaults = {
            selected: [],
            allowMultiple: true,
            uploadAlbumChange: true,
            albumCreate: true,
            albumAuth: true,
            watermark: false,
			hasWatermark: true,
			tab: 'album',
			tabs: ['album', 'upload', 'online'],
			limit: 10,
			appendTo: 'body',
			dialog: {
                center: true,
                draggable: { handle: 'div.handle' },
				fadeIn: 300
            },
			token: '',
			source: 'offer_detail',
            submitText: '插入图片',
            fileFieldName:'imgFile'
		},
        pmDomain = FE.test['style.picman.url'] || 'http://picman.1688.com',
		configs = {},
		//已选择的图片
		selected = [],
		isReady;
	//format
    context = function(cfgs){
        //重写当前配置
		configs = $.extend(true, {}, defaults, cfgs);
		configs.tabs = cfgs.tabs || defaults.tabs;

        if (!isReady) {
            //生成结构
            context._render();
            //初始化
            context._init();
            //事件
            context._buildEvent();
            isReady = true;
        }

		context._refresh();

        var dia = configs.dialog, open = function(){
            //显示需要显示的标签
            $.each(configs.tabs, function(i, tab){
                tabs.filter('.tab-' + tab).show();
            });
            //激活默认标签
            tabs.filter('.tab-' + configs.tab).triggerHandler('click');
        };
        //重置tab
        tabs.hide();
        tabContents.hide();
        if (dia) {
            var openHandler = dia.open, closeHandler = dia.close;
            dia.close = function(){
                //uploader && $util.ua.ie && $util.flash.hasVersion(10) && uploader.flash('destroy');
//完全换成flash上传的方式，原语句destroy不会执行
                uploader && uploader.flash('destroy');
                context._clearPool();
                closeHandler && closeHandler(arguments);
            };
            dia.open = function(){
                open();
                openHandler && openHandler(arguments);
            };
            $.use('ui-dialog' + (dia.draggable ? ',ui-draggable' : ''), function(){
                container.dialog(dia);
            });
        }
        else {
            container.appendTo(configs.appendTo);
            open();
        }
        //Denis 2011.08.23 初始化选中的图片列表
        $.each(configs.selected, function(i, item){
            item.id = item.id || 'ol-' + $.guid++;
            context._addToPool(item);
            albumList && context._addToList(item);
        });
        //Denis 2011.09.14 初始化allowMultiple
    };
    $.extend(context, {
        albumPuller: '{0}/album/ajax/album_puller_ajax.json',
        albumList: '{0}/album/ajax/image_detail_list.json',
        albumCreate: '{0}/album/ajax/createAlbum.json',
        imgUpload: '{0}/album/ajax/image_upload_ajax.json',
        /**
         * 组件默认配置
         */
        _render: function(){
            container = $('<div>', {
                id: 'sys-ibank',
                css: {
                    display: 'none'
                }
            }).html('<div class="ib-wrap"><div class="ib-header handle">\
                    <h3>插入图片</h3>\
                    <a class="close" href="javascript:;" title="关闭"></a>\
                </div>\
                <div class="ib-content">\
                    <div class="tabs">\
                        <div class="tabs-nav">\
                            <div class="tips">选择您要添加图片的来源</div>\
                            <ul class="fd-clr"><li class="tab-album">图片管家</li><li class="tab-upload">我的电脑</li><li class="tab-online">网上图片</li></ul>\
                        </div>\
						<div class="tabs-content album" style="display:none;"></div>\
						<div class="tabs-content upload" style="display:none;"></div>\
						<div class="tabs-content online" style="display:none;"></div>\
					</div>\
                    <div class="insert">\
                        <div class="insert-header">\
                            <h4>要插入的图片(<em>0</em>/<span></span>)</h4>\
                            <div class="tips">可通过拖拽调整图片顺序</div>\
                        </div>\
                        <div class="insert-content">\
                            <ul class="insert-pool fd-clr"></ul>\
                            <ul class="insert-bg fd-clr"></ul>\
                        </div>\
                    </div>\
                </div>\
                <div class="ib-footer action">\
                    <a class="button submit" href="javascript:;"><span class="btn-l"><em>插入图片</em></span><span class="btn-r"></span></a>\
                </div>\
				<div class="overlay" style="display:none;"></div></div>').appendTo('body');
        },
        _init: function(){
            wrap = container.children();
            overlay = $('>div.overlay', wrap);
            tabs = $('div.tabs-nav li', wrap);
            tabContents = $('div.tabs-content', wrap);
            insertContainer = $('div.insert', wrap);
            imgPool = $('ul.insert-pool', wrap);
			imgBg = $('ul.insert-bg', wrap);
            loading = $('<div>').addClass('loading');
            btnSubmit = $('a.submit', wrap);
            btnSubmitText = $('em', btnSubmit);
            /**
             * 已选择的图片
             */
            context._initImgPool();
        },
		
		_refresh: function() {
			var html = [];
			for (var i = 0, c = configs.limit; i < c; i++) {
				html.push('<li>', i + 1, '</li>');
			}
			imgBg.html(html.join(''));
            
            if (configs.allowMultiple) {
                wrap.addClass('ib-multiple');
            } else {
                wrap.removeClass('ib-multiple');
                configs.limit = 1;
            }
            
            
            if (configs.uploadAlbumChange) {
                uploadCombo && uploadCombo.prop('disabled', false);
            } else {
                uploadCombo && uploadCombo.prop('disabled', true);
            }
            if(configs.albumCreate){
                albumCreate && albumCreate.removeClass('fd-hide');
            } else {
                albumCreate && albumCreate.addClass('fd-hide');
            }
            
            if(configs.albumAuth){
                albumAuthDl && albumAuthDl.removeClass('fd-hide');
            } else {
                albumAuthDl && albumAuthDl.addClass('fd-hide');
            }
            if(configs.hasWatermark){
				watermarkDl && watermarkDl.removeClass('fd-hide');
				watermark && watermark.prop('checked', !!configs.watermark);
			} else {
				watermarkDl && watermarkDl.addClass('fd-hide');
				watermark && watermark.prop('checked', false);
			}
            
            
            btnSubmitText.text(configs.submitText);
            $('h4>span', wrap).text(configs.limit);
            uploadTips && $('>.d span', uploadTips).text(configs.limit);
		},

        /**
         * 初始化事件
         */
        _buildEvent: function(){
            tabs.one('click', function(e){
                var i = tabs.index(this);
                if ($(this).hasClass('tab-album')) {
                    context._initAlbumTab(i);
                }
                else if ($(this).hasClass('tab-upload')) {
                    context._initUploadTab(i);
                }
                else {
                    context._initOnlineTab(i);
                }
            }).bind('click', function(e){
                var i = tabs.index(this);
                tabs.removeClass('current');
                switch ($.trim(this.className)) {
                    case 'tab-album':
                        //相册为空的提示文案根据upload标签判断
                        if ($(tabs[1]).css('display') === 'none') {
                            albumEmpty.width(90).children('span').hide();
                        }
                        else {
                            albumEmpty.width(245).children('span').show();
                        }
                        
                        break;
                    case 'tab-upload':
                        uploader && uploader.flash('destroy');
                        uploader = null;
                        if (!(uploader && uploader.data('flash'))) {
                            context._initUploader(i);
                        }
                        uploadTips && uploadTips.removeClass('error success');
                        break;
                    case 'tab-online':
                        olDD && olDD.removeClass('error');
                        break;
                }
                $(this).addClass('current');
                tabContents.hide();
                $(tabContents[i]).show();
            });
            $('div.ib-header>a', wrap).click(function(e){
                e.preventDefault();
                container.dialog('close');
            });
            btnSubmit.click(function(e){
                e.preventDefault();
                configs.insert && configs.insert(selected);
                container.dialog('close');
            });
        },
        /**
         * 图片管家Tab区域HTML初始化
         */
        _renderAlbumTab: function(i){
            tabContents[i].innerHTML = '<div class="album-filter">\
	                <div class="fd-locate"><select></select></div>\
	                <div class="tips">请从您的图片管家中点击选择图片</div>\
	            </div>\
	            <div class="album-list"><div class="loading"></div></div>\
	            <div class="album-paging fd-clr" style="visibility:hidden">\
	                <ul><li class="pagination"></li><li>共<em></em>张</li></ul>\
	            </div>\
	            <div class="empty">该相册暂无图片<span><a title="上传" href="javascript:;">请先上传</a>，或选择其他相册<span>。</div>';
        },
        /**
         * 初始化图片管家Tab
         */
        _initAlbumTab: function(i){
            this._renderAlbumTab(i);
            $.add('data-imgmanager-album', {
                url: $substitute(context.albumPuller, [pmDomain]),
                dataType: 'jsonp',
                data: {
                    start: 1,
                    end: 1000,
                    _csrf_token: configs.token,
                    source: configs.source
                }
            });
            albumList = $('div.album-list', tabContents[i]);
            albumPaging = $('div.album-paging', tabContents[i]);
            albumEmpty = $('div.empty', tabContents[i]);
            //初始化下拉事件
            albumCombo = $('div.album-filter select', tabContents[i]).bind('change', function(e){
                var opt = $('option:selected', this);
                setTimeout(function(){
                    context._loadAlbumList(opt.data('album'), 1, 20);
                }, 0);
            });
            $('a', albumEmpty).click(function(e){
                tabs.filter('.tab-upload').triggerHandler('click');
                uploadCombo.val(albumCombo.val());
            });
            albumPagingInst = new Paging(albumPaging);
            //选取图片
            albumList.delegate('a', 'click', function(e){
                e.preventDefault(e);
                this.blur();
            }).delegate('li', 'click', function(e){
                li = $(this);
                if (li.hasClass('disabled')) {
                    return false;
                }
                var item = li.data('item');
                if (li.hasClass('selected')) {
                    if (context._delFromPool(item)) {
                        li.removeClass('selected');
                    }
                }
                else {
                    if (context._addToPool(item)) {
                        li.addClass('selected');
                    }
                    else {
                        //TODO: 警告
                    }
                }
            });
            //初始化相册数据
            $.use('data-imgmanager-album', function(data){
                if (data.result === 'success') {
                    //载入当前相册数据
                    context._loadAlbumList(context._refreshCombo(data, albumCombo), 1, 20);
                }else{
                    //TODO: 加载数据失败提示
                }
            });
        },
        /**
         * 载入相册内图片
         * @param {Object} o
         * @param {Object} start
         * @param {Object} end
         */
        _loadAlbumList: function(o, start, end){
            albumPaging.after(albumEmpty);
            if (o.count) {
                $.ajax($substitute(context.albumList, [pmDomain]), {
                    dataType: 'jsonp',
                    data: {
                        albumId: o.id,
                        start: start,
                        end: end,
                        _csrf_token: configs.token,
                        source: configs.source
                    },
                    beforeSend: function(){
                        //把空span归位
                        albumPaging.css('visibility', 'hidden');
                        albumList.html(loading);
                    },
                    success: function(data){
                        if (data.result === 'success') {
                            //生成列表
                            if (data.dataList.length) {
                                var ul = $('<ul>').addClass('fd-clr');
                                $.each(data.dataList, function(i, item){
                                    var img = new Image(), link = $('<a>', {
                                        title: item.title
                                    }), div = $('<div>'), li = $('<li>').data('item', item);
                                    img.onload = function(){
                                        imgResize(this, 64);
                                    };
                                    img.alt = item.title;
                                    if (item.status === 'approved') {
                                        link.attr('href', 'javascript:;');
                                        img.src = item.src;
                                        if (selected.some(function(s, j){
                                            //这里的id 数字和字符串会互转
                                            return s.id == item.id;
                                        })) {
                                            li.addClass('selected');
                                        }
                                    }
                                    else {
                                        var n = item.status === 'modified' ? 'verify1' : 'forbid1';
                                        img.src = $substitute('http://img.china.alibaba.com/images/common/icon_v02/{0}.gif', [n]);
                                        li.addClass('disabled');
                                    }
                                    ul.append(li.append(link.append(img)).append(div));
                                });
                                albumList.html(ul);
                            }
                            //生成分页
                            albumPagingInst.init({
                                current: Math.ceil(start / 20),
                                total: Math.ceil(o.count / 20),
                                count: o.count,
                                click: function(e, i){
                                    context._loadAlbumList(o, i * 20 - 19, i * 20);
                                }
                            });
                            albumPaging.css('visibility', '');
                        }
                    }
                });
            }
            else {
                albumList.html(albumEmpty);
                albumPaging.css('visibility', 'hidden');
            }
        },
        _renderUploadTab: function(i){
            tabContents[i].innerHTML = '<div class="info">如果您不希望上传的图片在相册中公开展示，建议将图片上传到不公开相册中</div>\
                <div class="upload-form">\
                    <dl><dt>选择相册：</dt><dd><select></select><a class="album-create" title="创建新相册" href="javascript:;">创建新相册</a></dd></dl>\
                    <dl><dt>上传图片：</dt><dd class="uploader"></dd></dl>\
                    <dl><dt></dt><dd><input id="album-watermark" name="album-watermark" type="checkbox" checked="checked"/><label for="album-watermark">添加图片水印</label><a title="设置图片水印" href="http://picman.1688.com/album/print_set.htm" target="_blank">设置图片水印</a></dd></dl>\
                </div>\
                <div class="tips">\
                    <p class="d">提示：您可以上传<span></span>张图片，选择的图片单张大小不超过' + '5' + 'MB，支持jpg,jpeg,gif,bmp,png。</p>\
                    <p class="n"></p>\
                    <p class="y">上传成功，共 1 张！</p>\
                </div>\
				<div class="indicator"><table></table></div>\
                <div class="create" style="display:none;">\
                    <div class="ib-header">\
                        <h5>创建新相册</h5>\
                        <a class="close" href="javascript:;" title="关闭"></a>\
                    </div>\
                    <div class="ib-content">\
                        <form autocomplete="off">\
                            <dl><dt>相册名称：</dt><dd><input class="create-field" type="text" name="name" maxlength="25"/></dd></dl>\
                            <dl class="authority">\
                                <dt>访问权限：</dt>\
                                <dd>\
                                    <input id="album-manager-pub" type="radio" name="isPrivate" value="n" checked="checked"/>\
                                    <label for="album-manager-pub">公开</label>\
                                    <input id="album-manager-pwd" type="radio" name="isPrivate" value="y"/>\
                                    <label for="album-manager-pwd">密码</label>\
                                    <input id="album-manager-pri" type="radio" name="isPrivate" value="p"/>\
                                    <label for="album-manager-pri">不公开</label>\
                                    <img title="不公开的相册不会显示在您的公开相册列表中" alt="" src="http://img.china.alibaba.com/images/common/icon_v03/gif/65.gif"/>\
                                </dd>\
                            </dl>\
                            <div class="create-pwd" style="display:none;">\
                                <dl><dt>密码：</dt><dd><input class="create-field" type="password" name="password" maxlength="16"/><br/><span>(4~16位非中文字符)</span></dd></dl>\
                                <dl><dt>确认密码：</dt><dd><input class="create-field" type="password" name="passwordConfirm" maxlength="16"/></dd></dl>\
                            </div>\
                            <dl class="error" style="display:none;"><dt></dt><dd></dd></dl>\
                        </form>\
                    </div>\
                    <div class="ib-footer">\
                        <a class="button insert" href="javascript:;"><span class="btn-l"><em>创建</em></span><span class="btn-r"></span></a>\
                    </div>\
                </div>';
        },
        /**
         * 刷新下拉框数据
         * @param {Object} data
         * @param {Object} combo
         * @return {Object} res 返回当前项的数据
         */
        _refreshCombo: function(data, combo){
            combo = $(combo);
            var groups = {
                '公开': [],
                '密码访问': [],
                '不公开': []
            };
            var pub = [], pri = [], lock = [], value = combo.val() || configs.albumId, visible = combo.css('visibility'), res, group, selected = false;
            combo.css('visibility', 'hidden').empty();
            $.each(data.dataList, function(i, item){
                if (item.type === 'MY' || item.type === 'CUSTOM') {
                    if (item['private']) {
                        groups['不公开'].push(item);
                    }
                    else if (item['lock']) {
                        groups['密码访问'].push(item);
                    }
                    else {
                        groups['公开'].push(item);
                    }
                }
                //判断时候有默认选中的相册
                if(!selected && value == item.id){
                    selected = true;
                }
            });
            for (var key in groups) {
                if (!groups[key].length) {
                    continue;
                }
                var group = $('<optgroup>').attr('label', key);
                $.each(groups[key], function(i, item){
                    var o = {
                        value: item.id,
                        html: item.title.cut(10, '...') + (item.remain > 0 ? '' : ' (已满)'),
                        title: item.title
                    };
                    if (!item.remain && uploadCombo && combo[0] === uploadCombo[0]) {
                        o.disabled = true;
                    }
                    
                    if (!selected && item.type === 'MY') {
                        o.selected = 'selected';
                        res = item;
                    }
                    if (selected && item.id == value) {
                        o.selected = 'selected';
                        res = item;
                    }
                    group.append($('<option>', o).data('album', item));
                });
                combo.append(group);
            }

			combo.css('visibility', visible);
			return res;
		},

        /**
         * 我的电脑Tab区域事件初始化
         */
        _initUploadTab: function(i){
            this._renderUploadTab(i);
            $.add('data-imgmanager-album', {
                url: $substitute(context.albumPuller, [pmDomain]),
                data: {
                    start: 1,
                    end: 500,
                    _csrf_token: configs.token,
                    source: configs.source
                
                },
                dataType: 'jsonp'
            });
            //noformat
            var modCreate = $('div.create', tabContents[i]), 
				mForm = $('form', modCreate),
				mRadios = $('input:radio', modCreate),
				mField = $('input.create-field', modCreate), 
				mPwd = $('div.create-pwd', modCreate), 
				mClose = $('a.close', modCreate), 
				mErrorDl = $('dl.error', modCreate),
				mErrorDD = $('>dd', mErrorDl),
				mInsert = $('a.insert', modCreate);
			//format
            albumCreate = $('a.album-create', tabContents[i]);
            albumAuthDl = $('dl.authority',  modCreate);
            watermark = $('#album-watermark');
			watermarkDl = watermark.closest('dl');
            uploadTips = $('div.tips', tabContents[i])
            uploadCombo = $('select', tabContents[i]);
			
			$('>.d span', uploadTips).text(configs.limit);	
            
            if(!configs.uploadAlbumChange){
                uploadCombo.prop('disabled', true);                
            }
            if(!configs.albumAuth){
                albumAuthDl.addClass('fd-hide');
            }
            
			if(!configs.hasWatermark){
				watermarkDl.addClass('fd-hide');
				watermark.prop('checked', false);
			}else{
				watermarkDl.removeClass('fd-hide');
				if(!configs.watermark){
	                watermark.prop('checked', false);
	            }
			}
            

            //初始化相册数据
            $.use('data-imgmanager-album', function(data){
                if (data.result === 'success') {
                    context._refreshCombo(data, uploadCombo);
                }else{
                    //TODO: 加载数据失败提示
                }
            });
            albumCreate.bind('click', function(e){
                e.preventDefault();
                $.use('ui-position', function(){
                    modCreate.fadeIn(300);
                    ie6 && uploadCombo.css('visibility', 'hidden');    
                });
            });
            mRadios.click(function(){
                var i = mRadios.index(this);
                if (i === 1) {
                    configs.allowMultiple || modCreate.css('marginTop', '-60px');
                    mPwd.show();
                }
                else {
                    configs.allowMultiple || modCreate.css('marginTop', '0');
                    mPwd.hide();
                }
            });
            mClose.click(function(e){
                e.preventDefault();
                modCreate.fadeOut(200, function(){
                    mErrorDl.hide();
                    mField.val('');
                    ie6 && uploadCombo.css('visibility', 'visible');
                });
            });
            mInsert.click(function(e){
                e.preventDefault();
                if ($(this).hasClass('button-disabled')) {
                    return;
                }
                var msg = '';
                if (!mField[0].value.trim()) {
                    msg = '请输入相册名称！';
                }
                else if (mPwd.css('display') !== 'none') {
                    if (!mField[1].value) {
                        msg = '密码不可以为空！';
                    }
                    else if (mField[1].value.length < 4) {
                        msg = '密码必须为4-16位非中文字符！';
                    }
                    else if (mField[1].value !== mField[2].value) {
                        msg = '您两次输入的密码不一致，请重新输入！';
                    }
                }
                if (msg) {
                    mErrorDD.html(msg);
                    mErrorDl.show();
                    return;
                }
                $.ajax($substitute(context.albumCreate, [pmDomain]), {
                    dataType: 'jsonp',
                    data: $.paramSpecial({
                        name: mField[0].value,
                        isPrivate: mRadios.filter(':checked').val(),
                        password: mField[1].value,
                        passwordConfirm: mField[2].value,
                        _csrf_token: configs.token,
                        source: configs.source
                    }),
                    beforeSend: function(){
                        mInsert.addClass('button-disabled');
                        mErrorDl.hide();
                    },
                    success: function(o){
                        if (o.result === 'success') {
                            context._loadAlbumCombo(undefined, function(data){
                                uploadCombo.val(o.dataList[0].id);
                            });
                            modCreate.fadeOut(200, function(){
                                mErrorDl.hide();
                                mField.val('');
                                ie6 && uploadCombo.css('visibility', '');
                            });
                        }
                        else {
                            this.error();
                        }
                    },
                    error: function(){
                        mErrorDD.html('网络繁忙，请稍后刷新页面再试！');
                        mErrorDl.show();
                    },
                    complete: function(){
                        mInsert.removeClass('button-disabled');
                    }
                });
            });
            
            if(!configs.albumCreate){
                albumCreate.addClass('fd-hide');
            }
        },
        /**
        *截取图片文件名
        */
        _subStringImgName:function(imgname){
            if(imgname.length < 13)
            {
                return imgname;
            }
            var imgReg=/(.+).(jpg|jpeg|gif|bmp|png)$/i;
            var result = imgReg.exec(imgname);
            if(result)
            {
                return result[1].substring(0,7)+"..."+result[2];
            }
            return imgname.substring(0,13);
        },
        /**
        *显示文件的上传状态
        */
        _showProgress:function(table,fileStatus){
            var trs = table[0].rows;
            $.each(fileStatus, function(i, file){
                var tr = trs[i], name = $('>td.name', tr), progress = name.next(), status = progress.next();
                $.log(file.name+"_"+file.status);
                switch (file.status) {
                    case 'ready':
                    default:
                        progress.progressbar('value', 5);
                        status.html('准备上传！');
                        break;
                    case 'done':
                    case 'not_transfered':
                    case 'refused':
                        if(context._isFileSuccess(file))
                        {
                            progress.progressbar('value', 100);
                            status.html('上传成功！');
                        }else{
                            status.html('上传失败！');
                            status.css({"color":"#F00"});
                        }
                        break;
                    //客户端压缩处理
                    case 'cs_processing':
                        progress.progressbar('value', Number(file.msg) * 100);
                        status.html('正在上传！');
                        break;
                }
            });     
        },
        /**
        *文件上传是否成功
        */
        _isFileSuccess:function (file){
            if(file && file.status === "done"){
                var jsonObj = $.parseJSON(file.msg);
                if(jsonObj)
                {
                    if(jsonObj.result === "success")
                    {
                        return true;
                    }
                }
            }
            return false;
        },
        /**
         * 初始化上传组件
         */
        _initUploader: function(i){
            $.use('ui-flash-uploader2,ui-progressbar,ui-position', function(){
                //noformat
                var n = $('>.n', uploadTips), y = $('>.y', uploadTips), 
					indicator = $('>div.indicator', tabContents[i]),
					table = $('>table', indicator), pass = true, errors = [];
				//format
                uploader = $('dd.uploader', tabContents[i]).flash({
                    width: 160,
                    height: 32,
                    module: 'uploader2',
                    flashvars: {
                        buttonSkin: 'http://img.china.alibaba.com/images/common/icon_v02/upload1.png'
                    }
                }).bind('swfReady.flash', function(e){
					$.log('swfReady');
                    //设置flash中是否允许选择多个文件上传
                    if(configs.allowMultiple)
                    {
                        uploader.flash("enableMultiple");
                    }else
                    {
                        uploader.flash("disableMultiple");
                    }
                    //根据用户已选择的图片数量和限制的最多图片数量，控制上传组件是否可用
                    if (selected.length < configs.limit) {
                        $(this).flash('enable');
                    } else {
                        $(this).flash('disable');
					}
				}).bind('mousedown.flash', function(){
                    var opt = $('option:selected', uploadCombo), data = opt.data('album'), count = Math.min(data.remain, configs.limit - selected.length);
                    try {
                        $(this).flash('setFileCountLimit', count);
                    } 
                    catch (ex) {
                    }
                }).bind('fileSelect.flash', function(e, o){
                    //                    alert('文件队列id：' + o.fileList[0].id + "\n文件名称：" + o.fileList[0].name + "\n已经选择！");
                    //创建上传状态
					$.log("fileSelect~");
                    uploadTips.removeClass('success').removeClass('error');
                    var fileStatus = $(this).flash('getFileStatuses');                    
                    table.empty();
                                    
                    $.each(fileStatus, function(i, file){
                        var tr = table[0].insertRow(-1), name = tr.insertCell(0), progress = tr.insertCell(1), status = tr.insertCell(2);
                        //截取过长的文件名，否则会超出进度条框体
                        $(name).addClass('name').html(context._subStringImgName(file.name));
                        $(progress).addClass('progress').progressbar();
                        $(status).addClass('status');
                    });
                    //progressinfo.html('开始上传文件！');
                    ie6 && uploadCombo.css('visibility', 'hidden');
                    overlay.after(indicator).show();
                    indicator.position({
                        of: wrap,
                        my: 'center center',
                        at: 'center center'
                    });

                    $(this).flash('uploadAll', $substitute(context.imgUpload, [pmDomain]), {
                        drawTxt: watermark.prop('checked'),
                        albumId: uploadCombo.val(),
                        _csrf_token: configs.token,
                        source: configs.source
                    }, configs.fileFieldName);
                    
                    context._showProgress(table,fileStatus);
                    $(this).triggerHandler('progress');
                }).bind('processProgress.flash',function()
                {
                    //耗费在处理的时间>上传的时间，而且目前上传的进度无法获得，故进度在processProgress事件中处理，不在transferProgress中处理
                    var fileStatus = $(this).flash('getFileStatuses');
                    context._showProgress(table,fileStatus);          
                }).bind('finish.flash', function(){
					$.log("finish.flash");
                    $(this).triggerHandler('progress');
                    var passNum = 0;
                    var hasError = false;
                    var fileStatus = $(this).flash('getFileStatuses');
                    context._showProgress(table,fileStatus); 
                    var errorHtml = [];
                    var errors = {
                                  'TYPEERR'                 :[],
                                  'SIZE_OVERFLOW'           :[],
                                  'REACH_MAX_FILE_COUNT'    :[],
                                  'MAXIMGPERALBUMEXCEEDED'  :[],
                                  'COMPRESS_FAIL'           :[],
                                  'DEFAULT'                 :[]
                                  };
                    var errorMap = {'TYPEERR'                :'抱歉，图片格式不对，系统支持 jpg, jpeg, gif, bmp, png。',
                                    'IMGTYPEERR'             :'抱歉，图片格式不对，系统支持 jpg, jpeg, gif, bmp, png。',
                                    'UNKNOWNERROR'           :'抱歉，图片格式不对，系统支持 jpg, jpeg, gif, bmp, png。',
                                    'SIZE_OVERFLOW'          :'抱歉，图片因大于5MB。',
                                    'REACH_MAX_FILE_COUNT'   :'抱歉，由于超过上传数量限制。',
                                    'MAXIMGPERALBUMEXCEEDED' :'抱歉，您的相册已满。',
                                    'COMPRESS_FAIL'          :'抱歉，因图片无法压缩到2M以内，导致上传失败，请压缩后再上传。',
                                    'DEFAULT'                :'抱歉，因网络繁忙。'
                                    };
                    
                    function addErrorHtml(errorArray,errorMsg)
                    {
                        if(errorArray.length)
                        {
                            errorHtml.push(errorMsg+'以下'+errorArray.length+'张图片无法上传:'+errorArray.join(","));
                        }
                    }
                    $.each(fileStatus,function(i,file){
                        function getFileMsg(file){
                            var jsonObj;
                            switch(file.status){
                                case 'refused':
                                    return file.msg;
                                case 'transferFail':
                                    return 'UNKNOWNERROR';
                                case 'transferCanceled':
                                    return 'CANCELED';
                                case "not_transfered":
                                    return 'COMPRESS_FAIL';
                                case 'done':
                                    jsonObj = $.parseJSON(file.msg);
                                    if(jsonObj)
                                    {
                                        if(jsonObj.result === "fail")
                                        {
                                            return jsonObj.errMsg[0];
                                        }
                                    }
                                    break;    
                            }
                        }
                        
                        if(context._isFileSuccess(file))
                        {
                           passNum++;
                        }else
                        {
                            var msg = getFileMsg(file);
                            hasError = true;
                            switch((msg).toUpperCase())
                            {
                                case 'TYPEERR':
                                case 'IMGTYPEERR':
                                case 'UNKNOWNERROR':
                                    errors['TYPEERR'].push(context._subStringImgName(file.name));
                                    break;
                                case 'SIZE_OVERFLOW':
                                case 'REACH_MAX_FILE_COUNT':
                                case 'MAXIMGPERALBUMEXCEEDED':
                                case 'COMPRESS_FAIL':
                                    errors[(msg).toUpperCase()].push(context._subStringImgName(file.name));
                                    break;
                                default:
                                    errors['DEFAULT'].push(context._subStringImgName(file.name));
                                    break;
                            }
                        }
                    });
                    if(hasError)
                    {
                        $.each(errors,function(str,errerArr){
                            addErrorHtml(errerArr,errorMap[str]);
                        });
                        n.html(errorHtml.join("<br>"));
                        uploadTips.removeClass('success').addClass('error');
                    }
                    //$.log("passNum:"+passNum+" hasError:"+hasError+" addErrorHtml"+errorHtml);
                    if(!hasError && pass && passNum){
                        uploadTips.removeClass('error').addClass('success');
                        y.text('上传成功，共 ' + passNum + ' 张！');
                    }
                    $(this).flash('clear');
                    //至少有一张上传成功，则刷新相册数据
                    if (passNum) {
                        //刷新下拉框
                        context._loadAlbumCombo(function(item){
                            //根据新的数据刷新列表
                            if (albumCombo.val() === uploadCombo.val()) {
                                context._loadAlbumList(item, 1, 20);
                            }
                        }, done);
                    }else{
                        done();
                    }
                    //重置上传状态变量
                    pass = true;
                    function done(){
                        overlay.hide();
                        table.empty();
                        indicator.appendTo(tabContents[i]);
                        ie6 && uploadCombo.css('visibility', '');
                    }
                }).bind('transferCompleteData.flash', function(e, o){
					$.log("transferCompleteData");
					//上传完毕，处理回调信息
                    var data = o.file.msg || {};
                    if (typeof data === 'string') {
                        data = $.parseJSON(data);
                    }
                    //上传成功
                    if (data.result === 'success') {
                        //刷新相册列表
                        if (context._addToPool({
                            id: $.makeArray(data.dataList)[0],
                            src: $.makeArray(data.miniImgUrls)[0],
                            bigSrc: $.makeArray(data.imgUrls)[0]
                        }) ===
                        configs.limit) {
                            $(this).flash('disable');
                        }
                        else {
                            $(this).triggerHandler('progress');
                        };
                        //alert('上传成功!\n文件队列id：' + o.id + '\n文件名称：' + o.fileName + '\n文件地址：' + data.url + '\n文件大小：' + data.fileSize + 'KB');
                        return;
                    }
                    //alert('文件队列id：' + o.id + '\n文件名称：' + o.fileName + '\n上传失败！错误代码：' + data.errCode);
                });
            });
        },
        /**
         * 更新下拉数据
         */
        _loadAlbumCombo: function(albumCallback, uploadCallback){
            albumCallback = albumCallback || $.noop;
            uploadCallback = uploadCallback || $.noop;
            $.use('data-imgmanager-album', function(data){
                if (data.result === 'success') {
                    albumCombo && albumCallback(context._refreshCombo(data, albumCombo));
                    uploadCombo && uploadCallback(context._refreshCombo(data, uploadCombo));
                }
            }, {});
        },
        /**
         *
         * @param {Object} i
         */
        _renderOnlineTab: function(i){
            tabContents[i].innerHTML = '<div class="online-adder">\
                    <dl>\
						<dt>输入网上图片地址</dt>\
						<dd><input type="text" maxlength="120" value="http://"/><div>抱歉，图片地址不对！</div></dd>\
                        <dd><a class="button" href="javascript:;"><span class="btn-l"><em>添加</em></span><span class="btn-r"></span></a></dd>\
                    </dl>\
                </div>\
                <div class="tips">\
                    <p>提示：此处插入的图片显示会受到图片存放地址的影响。<a title="如何获取网上图片的地址" href="http://baike.1688.com/doc/view-d2942066.html" target="_blank">如何获取网上图片的地址</a></p>\
                </div>';
        },
        /**
         * 网上图片Tab区域初始化
         */
        _initOnlineTab: function(i){
            this._renderOnlineTab(i);
            olField = $('input', tabContents[i]);
            olDD = olField.parent();
            olButton = $('a.button', tabContents[i]);
            var olErr = olField.next();
            olField.keydown(function(e){
                if (e.keyCode === 13) {
                    olButton.triggerHandler('click');
                }
            });
            olButton.click(function(e){
                e.preventDefault();
                if ($(this).hasClass('button-disabled')) {
                    return;
                }
                olDD.removeClass('error');
                var url = olField.val().trim(), pass = true;
                if (!url) {
                    olErr.html('请输入图片地址！');
                    pass = false;
                }
                else if (!/^(https?|ftp):\/\/.+/.test(url)) {
                    olErr.html('抱歉，图片地址不对！');
                    pass = false;
                }
                if (pass) {
                    var img = new Image();
                    img.onload = function(){
                        olDD.removeClass('error');
                        if (context._addToPool({
                            id: 'ol-' + $.guid++,
                            src: url,
                            bigSrc: url
                        }) ===
                        configs.limit) {
                            olField.prop('disabled', true);
                        }
                        else {
                            olButton.removeClass('button-disabled');
                        }
                        olField.val('');
                    };
                    img.onerror = function(){
                        olErr.html('抱歉，该图片无法加载！');
                        olDD.addClass('error');
                        if (selected.length < configs.limit) {
                            olButton.removeClass('button-disabled');
                        }
                    };
                    olButton.addClass('button-disabled');
                    img.src = url;
                }
                else {
                    olDD.addClass('error');
                }
                
            });
            if (selected.length === configs.limit) {
                olField.prop('disabled', true);
                olButton.addClass('button-disabled');
            }
        },
        /**
         * 已选择的图片区域
         */
        _initImgPool: function(){
            poolNum = $('h4>em', wrap);
            $.use('ui-portlets', function(){
                imgPool.portlets({
                    items: '>li',
                    placeholder: 'ui-state-highlight',
                    orientation: 'horizontal',
                    axis: 'x',
                    revert: 150,
                    scroll: false,
                    opacity: .5,
                    stop: function(e, ui){
                        var newIndex = $('>li', imgPool).index(ui.currentItem), item = ui.currentItem.data('item'), oldIndex = selected.indexOf(item);
                        selected.splice(newIndex, 0, selected.splice(oldIndex, 1)[0]);
                    }
                });
            });
            imgPool.delegate('a', 'click', function(e){
                e.preventDefault();
                var li = $(this).closest('li'), item = li.data('item');
                albumList && context._delFromList(item);
                context._delFromPool(item);
            });
        },
        /**
         * 根据配置，添加图片到列表中
         * @param {Object} item
         * @return {Bolean|Int} 返回Pool中的图片数，当满了，再添加就返回false。
         */
        _addToPool: function(item){
            var len = $('>li', imgPool).length;
            //vivian.xul --修改允许插入大于1张图片时，满了，返回false
            if (len === configs.limit && configs.limit > 1) {
                return false;
            }
            //vivian.xul --修改只允许插入1张图片时，选择非当前选中图片后，将已选中的清空
            if(configs.limit === 1) {
                var _current = $('li.selected',albumList),
                    _li = $('li',imgPool),
                    _item = _li.data('item');

                _current.length && _current.removeClass('selected');
                context._delFromPool(_item);
            }
            var li = $('<li>').data('item', item), div = $('<div>', {
                title: item.title || ''
            }), img = new Image(), del = $('<a>', {
                title: '点击删除该图片',
                href: 'javascript:;'
            });
            img.onload = function(){
                imgResize(this, 64);
            };
            img.alt = '';
            img.src = item.src;
            imgPool.append(li.append(div.append(img)).append(del));
            selected.push(item);
            len++;
            if (len === configs.limit) {
                uploader && uploader.flash('disable');
                if (olDD) {
                    olField.prop('disabled', true);
                    olButton.addClass('button-disabled');
                }
            }
            poolNum.html(len);
            //单选多选需求
			if(!configs.allowMultiple) {
				setTimeout(function(){
                    btnSubmit.triggerHandler('click');
                }, 50); 
			}

            return len;
        },
        /**
         * 根据配置，从池子中移除图片
         * @param {Object} item
         */
        _delFromPool: function(item){
            var deleted = false, lis = $('>li', imgPool), len = lis.length;
            lis.each(function(i, li){
                li = $(li);
                var data = li.data('item');
                if (data.id == item.id) {
                    li.animate({
                        width: 0
                    }, 150, function(){
                        li.remove();
                    });
                    
                    selected.remove(data);
                    deleted = true;
                    return false;
                }
            });
            //从满到9个
            if (len === configs.limit && deleted) {
                uploader && uploader.flash('enable');
                if (olDD) {
                    olField.prop('disabled', false);
                    olButton.removeClass('button-disabled');
                }
            }
            poolNum.html(selected.length);
            return deleted;
        },
        /**
         * 清空已选图片
         */
        _clearPool: function(){
            selected = [];
            $('li', albumList).removeClass('selected');
            imgPool.empty();
            poolNum.html(0);
            uploader && uploader.flash('enable');
            if (olDD) {
                olField.prop('disabled', false);
                olButton.removeClass('button-disabled');
            }
        },
        /**
         * 根据配置，从列表中移除图片
         * @param {Object} item
         */
        _delFromList: function(item){
            var deleted = false;
            $('li', albumList).each(function(i, li){
                li = $(li);
                var data = li.data('item');
                if (data.id == item.id) {
                    li.removeClass('selected');
                    deleted = true;
                    return false;
                }
            });
            return deleted;
        },
        /**
         * 根据配置，添加图片到列表中
         * @param {Object} item
         */
        _addToList: function(item){
            var added = false;
            $('li', albumList).each(function(i, li){
                li = $(li);
                var data = li.data('item');
                if (data.id === item.id) {
                    li.addClass('selected');
                    added = true;
                    return false;
                }
            });
            return added;
        }
    });
    /*
     * auto resize image
     * @param    img     img obj
     * @param    w       custom width
     * @param    h       custom height
     */
    function imgResize(img, w, h){
        if (img.width) {
            if (!h) {
                h = w;
            }
            if (img.width > w || img.height > h) {
                var scale = img.width / img.height, fit = scale >= w / h;
                img[fit ? 'width' : 'height'] = fit ? w : h;
                img[fit ? 'height' : 'width'] = (fit ? w : h) * (fit ? 1 / scale : scale);
            }
        }
    }
    /**
     *
     * @param {Object} ctn
     */
    function Paging(ctn){
        var self = this;
        self.pagination = $('li.pagination', ctn);
        self.counter = $('em', ctn);
        self.pagination.delegate('a', 'click', function(e){
            e.preventDefault(e);
            this.href && self.options.click && self.options.click.call(this, e, this.href.match(/#(\d+)/)[1] * 1);
        });
    }
    Paging.prototype = {
        init: function(configs){
            var self = this;
            self.options = configs || {};
            self.counter.html(configs.count);
            self.render(configs.current, configs.total);
        },
        /*
         *   creat page info
         *   @param  cur         index of page from 1
         *   @param  total       total page number from 1
         */
        render: function(cur, total){
            cur = cur || 1;
            total = total || 1;
            if (cur < 1) {
                cur = 1;
            }
            if (total < 1) {
                total = 1;
            }
            if (cur > total) {
                cur = total;
            }
            var html = [], pre, next;
            
            if (cur === 1) {
                html.push('<a class="pre-disabled"> </a>');
                html.push('<a class="current">1</a>');
            }
            else {
                html.push('<a class="pre" href="#' + (cur - 1) + '"> </a>');
                html.push('<a href="#1">1</a>');
            }
            if (total > 1) {
                if (cur > 4 && total > 7) {
                    html.push('<a class="omit">...</a>');
                }
                //cur==1?
                if (cur < 3) {
                    pre = 0;
                    next = (cur === 1 ? 5 : 4);
                    if (cur + next > total) {
                        next = total - cur;
                    }
                }
                else if (cur === 3) {
                    pre = 1;
                    next = 3;
                    if (cur + next > total) {
                        next = total - cur;
                    }
                }
                else {
                    pre = 2;
                    next = 2;
                    if (cur + next > total) {
                        next = total - cur;
                    }
                    pre = 4 - next;
                    if (cur + 3 > total) {
                        pre++;
                    }
                    if (cur - pre < 2) {
                        pre = cur - 2;
                    }
                }
                
                for (var i = pre; 0 < i; i--) {
                    html.push('<a href="#' + (cur - i) + '">' + (cur - i) + '</a>');
                }
                if (cur > 1) {
                    html.push('<a class="current">' + cur + '</a>');
                }
                for (var i = 1; i < next + 1; i++) {
                    html.push('<a href="#' + (cur + i) + '">' + (cur + i) + '</a>');
                }
                
                if (cur + next < total - 1) {
                    html.push('<a class="omit">...</a>');
                    html.push('<a href="#' + total + '">' + total + '</a>');
                }
                if (cur + next === total - 1) {
                    html.push('<a href="#' + total + '">' + total + '</a>');
                }
            }
            if (cur === total) {
                html.push('<a class="next-disabled">下一页</a>');
            }
            else {
                html.push('<a class="next" href="#' + (cur + 1) + '">下一页</a>');
            }
            this.pagination.html(html.join(''));
        }
    };
    SYS.iBank = context;
})(jQuery, FE.sys);
