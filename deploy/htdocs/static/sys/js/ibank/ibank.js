/**
 * ͼƬ�ܼ�ϵͳ���
 * ��ֲ����YUI2��ͼƬ�ܼҹ������ΪjQuery�汾
 * @version 2.7
 * @update Denis 2011.08.23 �ṩ��ʼ��ѡ��ͼƬ����������
 * @author Denis 2011.06
 * @author Qijun 2011.09 BugFixed
 * @author Denis 2011.09 ����allowMultiple����
 * @update Qijun 2011.10 ����ͼƬѡ�����޵Ĺ���
 * @update Qijun 2011.10 �޸��������40 - 500
 * @update Denis 2011.11.17 ���������allowMultiple�ĸ߶ȣ��޸���false�¡�������ᡱ��ѡ�����롱ģʽʱ�ĸ߶����⡣
 *                          ��albumId�޷�ƥ��ʱĬ��ѡ�С��ҵ���ᡱ
 * @update Denis 2011.11.22 �����û������޶���������ᡱ������
 * @update hua.qiuh 2011.12.06 ����flash�ļ���ַ��ʹ��2.9�汾
 * @update Denis 2011.12.01 �ṩuploadAlbumChange������Ϊ�ϴ�����
 *                          �ṩ���޸ġ�����ͼƬ����ť���İ����� submitText
 *                          �ṩ�����ء�������ᡱ���ܵ����� albumCreate
 * @update Denis 2011.12.06 �ṩ��albumAuth���������ṩ��������ᴴ��Ȩ��ѡ��
 * @update Denis 2011.12.08 �ṩ��watermark���������������Ƿ�ѡˮӡ
 * @update Denis 2012.01.13 �޸��������ʱ�ϴ�ͼƬ�������ʾ�İ�
 * @update Denis 2012.02.14 ʹ��figo����picman��������ַ
 * @update Denis 2012.02.17 �޸�IE6��ͼƬ�ܼ�ͼƬ���hover������title��Ϣ��BUG
 * @update jianping.shenjp 2012.03.8 �л����µ�flash uploader2�ϴ������ʹ����IE��firefox��chrome�¾�ʹ��flash�����ϴ�;�Ż��ϴ�������ʾ�������û�����ԭ�����Ӧ���ϴ�ʧ�ܵ�ͼƬ
 * @update Denis 2012.05.30 �޸��û����������500֮�󣬡��ҵ���ᡱû�л�ȡ���������BUG���޸Ķ�ȡ����Ϊ1000
 * @update vivian.xul 2012.08.02 �޸�ֻ�������1��ͼƬʱ��ѡ��ǵ�ǰѡ��ͼƬ�󣬽���ѡ�е���ղ�������ѡ���ͼƬ
 * @update vivian.xul 2012.10.12 �ṩ��hasWatermark���������������Ƿ���ʾ����ˮӡ
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
            submitText: '����ͼƬ',
            fileFieldName:'imgFile'
		},
        pmDomain = FE.test['style.picman.url'] || 'http://picman.1688.com',
		configs = {},
		//��ѡ���ͼƬ
		selected = [],
		isReady;
	//format
    context = function(cfgs){
        //��д��ǰ����
		configs = $.extend(true, {}, defaults, cfgs);
		configs.tabs = cfgs.tabs || defaults.tabs;

        if (!isReady) {
            //���ɽṹ
            context._render();
            //��ʼ��
            context._init();
            //�¼�
            context._buildEvent();
            isReady = true;
        }

		context._refresh();

        var dia = configs.dialog, open = function(){
            //��ʾ��Ҫ��ʾ�ı�ǩ
            $.each(configs.tabs, function(i, tab){
                tabs.filter('.tab-' + tab).show();
            });
            //����Ĭ�ϱ�ǩ
            tabs.filter('.tab-' + configs.tab).triggerHandler('click');
        };
        //����tab
        tabs.hide();
        tabContents.hide();
        if (dia) {
            var openHandler = dia.open, closeHandler = dia.close;
            dia.close = function(){
                //uploader && $util.ua.ie && $util.flash.hasVersion(10) && uploader.flash('destroy');
//��ȫ����flash�ϴ��ķ�ʽ��ԭ���destroy����ִ��
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
        //Denis 2011.08.23 ��ʼ��ѡ�е�ͼƬ�б�
        $.each(configs.selected, function(i, item){
            item.id = item.id || 'ol-' + $.guid++;
            context._addToPool(item);
            albumList && context._addToList(item);
        });
        //Denis 2011.09.14 ��ʼ��allowMultiple
    };
    $.extend(context, {
        albumPuller: '{0}/album/ajax/album_puller_ajax.json',
        albumList: '{0}/album/ajax/image_detail_list.json',
        albumCreate: '{0}/album/ajax/createAlbum.json',
        imgUpload: '{0}/album/ajax/image_upload_ajax.json',
        /**
         * ���Ĭ������
         */
        _render: function(){
            container = $('<div>', {
                id: 'sys-ibank',
                css: {
                    display: 'none'
                }
            }).html('<div class="ib-wrap"><div class="ib-header handle">\
                    <h3>����ͼƬ</h3>\
                    <a class="close" href="javascript:;" title="�ر�"></a>\
                </div>\
                <div class="ib-content">\
                    <div class="tabs">\
                        <div class="tabs-nav">\
                            <div class="tips">ѡ����Ҫ���ͼƬ����Դ</div>\
                            <ul class="fd-clr"><li class="tab-album">ͼƬ�ܼ�</li><li class="tab-upload">�ҵĵ���</li><li class="tab-online">����ͼƬ</li></ul>\
                        </div>\
						<div class="tabs-content album" style="display:none;"></div>\
						<div class="tabs-content upload" style="display:none;"></div>\
						<div class="tabs-content online" style="display:none;"></div>\
					</div>\
                    <div class="insert">\
                        <div class="insert-header">\
                            <h4>Ҫ�����ͼƬ(<em>0</em>/<span></span>)</h4>\
                            <div class="tips">��ͨ����ק����ͼƬ˳��</div>\
                        </div>\
                        <div class="insert-content">\
                            <ul class="insert-pool fd-clr"></ul>\
                            <ul class="insert-bg fd-clr"></ul>\
                        </div>\
                    </div>\
                </div>\
                <div class="ib-footer action">\
                    <a class="button submit" href="javascript:;"><span class="btn-l"><em>����ͼƬ</em></span><span class="btn-r"></span></a>\
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
             * ��ѡ���ͼƬ
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
         * ��ʼ���¼�
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
                        //���Ϊ�յ���ʾ�İ�����upload��ǩ�ж�
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
         * ͼƬ�ܼ�Tab����HTML��ʼ��
         */
        _renderAlbumTab: function(i){
            tabContents[i].innerHTML = '<div class="album-filter">\
	                <div class="fd-locate"><select></select></div>\
	                <div class="tips">�������ͼƬ�ܼ��е��ѡ��ͼƬ</div>\
	            </div>\
	            <div class="album-list"><div class="loading"></div></div>\
	            <div class="album-paging fd-clr" style="visibility:hidden">\
	                <ul><li class="pagination"></li><li>��<em></em>��</li></ul>\
	            </div>\
	            <div class="empty">���������ͼƬ<span><a title="�ϴ�" href="javascript:;">�����ϴ�</a>����ѡ���������<span>��</div>';
        },
        /**
         * ��ʼ��ͼƬ�ܼ�Tab
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
            //��ʼ�������¼�
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
            //ѡȡͼƬ
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
                        //TODO: ����
                    }
                }
            });
            //��ʼ���������
            $.use('data-imgmanager-album', function(data){
                if (data.result === 'success') {
                    //���뵱ǰ�������
                    context._loadAlbumList(context._refreshCombo(data, albumCombo), 1, 20);
                }else{
                    //TODO: ��������ʧ����ʾ
                }
            });
        },
        /**
         * ���������ͼƬ
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
                        //�ѿ�span��λ
                        albumPaging.css('visibility', 'hidden');
                        albumList.html(loading);
                    },
                    success: function(data){
                        if (data.result === 'success') {
                            //�����б�
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
                                            //�����id ���ֺ��ַ����ụת
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
                            //���ɷ�ҳ
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
            tabContents[i].innerHTML = '<div class="info">�������ϣ���ϴ���ͼƬ������й���չʾ�����齫ͼƬ�ϴ��������������</div>\
                <div class="upload-form">\
                    <dl><dt>ѡ����᣺</dt><dd><select></select><a class="album-create" title="���������" href="javascript:;">���������</a></dd></dl>\
                    <dl><dt>�ϴ�ͼƬ��</dt><dd class="uploader"></dd></dl>\
                    <dl><dt></dt><dd><input id="album-watermark" name="album-watermark" type="checkbox" checked="checked"/><label for="album-watermark">���ͼƬˮӡ</label><a title="����ͼƬˮӡ" href="http://picman.1688.com/album/print_set.htm" target="_blank">����ͼƬˮӡ</a></dd></dl>\
                </div>\
                <div class="tips">\
                    <p class="d">��ʾ���������ϴ�<span></span>��ͼƬ��ѡ���ͼƬ���Ŵ�С������' + '5' + 'MB��֧��jpg,jpeg,gif,bmp,png��</p>\
                    <p class="n"></p>\
                    <p class="y">�ϴ��ɹ����� 1 �ţ�</p>\
                </div>\
				<div class="indicator"><table></table></div>\
                <div class="create" style="display:none;">\
                    <div class="ib-header">\
                        <h5>���������</h5>\
                        <a class="close" href="javascript:;" title="�ر�"></a>\
                    </div>\
                    <div class="ib-content">\
                        <form autocomplete="off">\
                            <dl><dt>������ƣ�</dt><dd><input class="create-field" type="text" name="name" maxlength="25"/></dd></dl>\
                            <dl class="authority">\
                                <dt>����Ȩ�ޣ�</dt>\
                                <dd>\
                                    <input id="album-manager-pub" type="radio" name="isPrivate" value="n" checked="checked"/>\
                                    <label for="album-manager-pub">����</label>\
                                    <input id="album-manager-pwd" type="radio" name="isPrivate" value="y"/>\
                                    <label for="album-manager-pwd">����</label>\
                                    <input id="album-manager-pri" type="radio" name="isPrivate" value="p"/>\
                                    <label for="album-manager-pri">������</label>\
                                    <img title="����������᲻����ʾ�����Ĺ�������б���" alt="" src="http://img.china.alibaba.com/images/common/icon_v03/gif/65.gif"/>\
                                </dd>\
                            </dl>\
                            <div class="create-pwd" style="display:none;">\
                                <dl><dt>���룺</dt><dd><input class="create-field" type="password" name="password" maxlength="16"/><br/><span>(4~16λ�������ַ�)</span></dd></dl>\
                                <dl><dt>ȷ�����룺</dt><dd><input class="create-field" type="password" name="passwordConfirm" maxlength="16"/></dd></dl>\
                            </div>\
                            <dl class="error" style="display:none;"><dt></dt><dd></dd></dl>\
                        </form>\
                    </div>\
                    <div class="ib-footer">\
                        <a class="button insert" href="javascript:;"><span class="btn-l"><em>����</em></span><span class="btn-r"></span></a>\
                    </div>\
                </div>';
        },
        /**
         * ˢ������������
         * @param {Object} data
         * @param {Object} combo
         * @return {Object} res ���ص�ǰ�������
         */
        _refreshCombo: function(data, combo){
            combo = $(combo);
            var groups = {
                '����': [],
                '�������': [],
                '������': []
            };
            var pub = [], pri = [], lock = [], value = combo.val() || configs.albumId, visible = combo.css('visibility'), res, group, selected = false;
            combo.css('visibility', 'hidden').empty();
            $.each(data.dataList, function(i, item){
                if (item.type === 'MY' || item.type === 'CUSTOM') {
                    if (item['private']) {
                        groups['������'].push(item);
                    }
                    else if (item['lock']) {
                        groups['�������'].push(item);
                    }
                    else {
                        groups['����'].push(item);
                    }
                }
                //�ж�ʱ����Ĭ��ѡ�е����
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
                        html: item.title.cut(10, '...') + (item.remain > 0 ? '' : ' (����)'),
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
         * �ҵĵ���Tab�����¼���ʼ��
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
            

            //��ʼ���������
            $.use('data-imgmanager-album', function(data){
                if (data.result === 'success') {
                    context._refreshCombo(data, uploadCombo);
                }else{
                    //TODO: ��������ʧ����ʾ
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
                    msg = '������������ƣ�';
                }
                else if (mPwd.css('display') !== 'none') {
                    if (!mField[1].value) {
                        msg = '���벻����Ϊ�գ�';
                    }
                    else if (mField[1].value.length < 4) {
                        msg = '�������Ϊ4-16λ�������ַ���';
                    }
                    else if (mField[1].value !== mField[2].value) {
                        msg = '��������������벻һ�£����������룡';
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
                        mErrorDD.html('���緱æ�����Ժ�ˢ��ҳ�����ԣ�');
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
        *��ȡͼƬ�ļ���
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
        *��ʾ�ļ����ϴ�״̬
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
                        status.html('׼���ϴ���');
                        break;
                    case 'done':
                    case 'not_transfered':
                    case 'refused':
                        if(context._isFileSuccess(file))
                        {
                            progress.progressbar('value', 100);
                            status.html('�ϴ��ɹ���');
                        }else{
                            status.html('�ϴ�ʧ�ܣ�');
                            status.css({"color":"#F00"});
                        }
                        break;
                    //�ͻ���ѹ������
                    case 'cs_processing':
                        progress.progressbar('value', Number(file.msg) * 100);
                        status.html('�����ϴ���');
                        break;
                }
            });     
        },
        /**
        *�ļ��ϴ��Ƿ�ɹ�
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
         * ��ʼ���ϴ����
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
                    //����flash���Ƿ�����ѡ�����ļ��ϴ�
                    if(configs.allowMultiple)
                    {
                        uploader.flash("enableMultiple");
                    }else
                    {
                        uploader.flash("disableMultiple");
                    }
                    //�����û���ѡ���ͼƬ���������Ƶ����ͼƬ�����������ϴ�����Ƿ����
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
                    //                    alert('�ļ�����id��' + o.fileList[0].id + "\n�ļ����ƣ�" + o.fileList[0].name + "\n�Ѿ�ѡ��");
                    //�����ϴ�״̬
					$.log("fileSelect~");
                    uploadTips.removeClass('success').removeClass('error');
                    var fileStatus = $(this).flash('getFileStatuses');                    
                    table.empty();
                                    
                    $.each(fileStatus, function(i, file){
                        var tr = table[0].insertRow(-1), name = tr.insertCell(0), progress = tr.insertCell(1), status = tr.insertCell(2);
                        //��ȡ�������ļ���������ᳬ������������
                        $(name).addClass('name').html(context._subStringImgName(file.name));
                        $(progress).addClass('progress').progressbar();
                        $(status).addClass('status');
                    });
                    //progressinfo.html('��ʼ�ϴ��ļ���');
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
                    //�ķ��ڴ����ʱ��>�ϴ���ʱ�䣬����Ŀǰ�ϴ��Ľ����޷���ã��ʽ�����processProgress�¼��д�������transferProgress�д���
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
                    var errorMap = {'TYPEERR'                :'��Ǹ��ͼƬ��ʽ���ԣ�ϵͳ֧�� jpg, jpeg, gif, bmp, png��',
                                    'IMGTYPEERR'             :'��Ǹ��ͼƬ��ʽ���ԣ�ϵͳ֧�� jpg, jpeg, gif, bmp, png��',
                                    'UNKNOWNERROR'           :'��Ǹ��ͼƬ��ʽ���ԣ�ϵͳ֧�� jpg, jpeg, gif, bmp, png��',
                                    'SIZE_OVERFLOW'          :'��Ǹ��ͼƬ�����5MB��',
                                    'REACH_MAX_FILE_COUNT'   :'��Ǹ�����ڳ����ϴ��������ơ�',
                                    'MAXIMGPERALBUMEXCEEDED' :'��Ǹ���������������',
                                    'COMPRESS_FAIL'          :'��Ǹ����ͼƬ�޷�ѹ����2M���ڣ������ϴ�ʧ�ܣ���ѹ�������ϴ���',
                                    'DEFAULT'                :'��Ǹ�������緱æ��'
                                    };
                    
                    function addErrorHtml(errorArray,errorMsg)
                    {
                        if(errorArray.length)
                        {
                            errorHtml.push(errorMsg+'����'+errorArray.length+'��ͼƬ�޷��ϴ�:'+errorArray.join(","));
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
                        y.text('�ϴ��ɹ����� ' + passNum + ' �ţ�');
                    }
                    $(this).flash('clear');
                    //������һ���ϴ��ɹ�����ˢ���������
                    if (passNum) {
                        //ˢ��������
                        context._loadAlbumCombo(function(item){
                            //�����µ�����ˢ���б�
                            if (albumCombo.val() === uploadCombo.val()) {
                                context._loadAlbumList(item, 1, 20);
                            }
                        }, done);
                    }else{
                        done();
                    }
                    //�����ϴ�״̬����
                    pass = true;
                    function done(){
                        overlay.hide();
                        table.empty();
                        indicator.appendTo(tabContents[i]);
                        ie6 && uploadCombo.css('visibility', '');
                    }
                }).bind('transferCompleteData.flash', function(e, o){
					$.log("transferCompleteData");
					//�ϴ���ϣ�����ص���Ϣ
                    var data = o.file.msg || {};
                    if (typeof data === 'string') {
                        data = $.parseJSON(data);
                    }
                    //�ϴ��ɹ�
                    if (data.result === 'success') {
                        //ˢ������б�
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
                        //alert('�ϴ��ɹ�!\n�ļ�����id��' + o.id + '\n�ļ����ƣ�' + o.fileName + '\n�ļ���ַ��' + data.url + '\n�ļ���С��' + data.fileSize + 'KB');
                        return;
                    }
                    //alert('�ļ�����id��' + o.id + '\n�ļ����ƣ�' + o.fileName + '\n�ϴ�ʧ�ܣ�������룺' + data.errCode);
                });
            });
        },
        /**
         * ������������
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
						<dt>��������ͼƬ��ַ</dt>\
						<dd><input type="text" maxlength="120" value="http://"/><div>��Ǹ��ͼƬ��ַ���ԣ�</div></dd>\
                        <dd><a class="button" href="javascript:;"><span class="btn-l"><em>���</em></span><span class="btn-r"></span></a></dd>\
                    </dl>\
                </div>\
                <div class="tips">\
                    <p>��ʾ���˴������ͼƬ��ʾ���ܵ�ͼƬ��ŵ�ַ��Ӱ�졣<a title="��λ�ȡ����ͼƬ�ĵ�ַ" href="http://baike.1688.com/doc/view-d2942066.html" target="_blank">��λ�ȡ����ͼƬ�ĵ�ַ</a></p>\
                </div>';
        },
        /**
         * ����ͼƬTab�����ʼ��
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
                    olErr.html('������ͼƬ��ַ��');
                    pass = false;
                }
                else if (!/^(https?|ftp):\/\/.+/.test(url)) {
                    olErr.html('��Ǹ��ͼƬ��ַ���ԣ�');
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
                        olErr.html('��Ǹ����ͼƬ�޷����أ�');
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
         * ��ѡ���ͼƬ����
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
         * �������ã����ͼƬ���б���
         * @param {Object} item
         * @return {Bolean|Int} ����Pool�е�ͼƬ���������ˣ�����Ӿͷ���false��
         */
        _addToPool: function(item){
            var len = $('>li', imgPool).length;
            //vivian.xul --�޸�����������1��ͼƬʱ�����ˣ�����false
            if (len === configs.limit && configs.limit > 1) {
                return false;
            }
            //vivian.xul --�޸�ֻ�������1��ͼƬʱ��ѡ��ǵ�ǰѡ��ͼƬ�󣬽���ѡ�е����
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
                title: '���ɾ����ͼƬ',
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
            //��ѡ��ѡ����
			if(!configs.allowMultiple) {
				setTimeout(function(){
                    btnSubmit.triggerHandler('click');
                }, 50); 
			}

            return len;
        },
        /**
         * �������ã��ӳ������Ƴ�ͼƬ
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
            //������9��
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
         * �����ѡͼƬ
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
         * �������ã����б����Ƴ�ͼƬ
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
         * �������ã����ͼƬ���б���
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
                html.push('<a class="next-disabled">��һҳ</a>');
            }
            else {
                html.push('<a class="next" href="#' + (cur + 1) + '">��һҳ</a>');
            }
            this.pagination.html(html.join(''));
        }
    };
    SYS.iBank = context;
})(jQuery, FE.sys);
