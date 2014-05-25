/*
 * @Project ���Ի��Ƽ�����
 * @Description ������������Ի��Ƽ����
 * @create 2011-11-03 by Ray Wu
 * @update Ray Wu 2011.11.18 1.���Ӽ������õľ�̬���� 2.�������ص����������Ż�
 * @update Ray Wu 2011.12.13 unparam��֧��gbk���ĵ����
*/
('irecom' in FE.sys) ||
(function($, Util, win) {
    var pageId = win.dmtrack_pageid = (typeof win.dmtrack_pageid === 'undefined') ? (new Date() - 0 + '' + Math.floor((Math.random() * 1000))) : win.dmtrack_pageid,
        hasOwn = Object.prototype.hasOwnProperty,
        exGroup = {}, exStr = [],
        defaultConfig = {
            template: null,//��Ⱦ��sweetģ��
			filter:null,//ɸѡ���Ի����ؽ�������飬����ǰn�����߷��Ϲ��˺����Ľ������Ϊ�����������Ƿ�������Ĭ�ϲ�����
			statScene:"",//�ع��㣨ctr_type����clickstat(page)���ʱ��ĳ�������
            /*
             * �������
             */
			apiUrl:'http://res.1688.com/fly/irecom.do',
            debug: false,
			debugUrl:'http://10.20.150.79/fly/irecom.do',
			datalazyload:false,//�Ƿ�ʹ�������أ�Ĭ�ϲ�ʹ��
			ctrQueue:[],//�ع�������ݶ���
            /*
             * Callback�ص�����
             * onTemplateReady  : callback before template render
			 * onLazyloadReady  : callback before lazyload init
             * onSuccess      : callback after template render or without template
             * onFailure      : callback when failure render
             */
            onTemplateReady: null,
			onLazyloadReady: null,
            onSuccess: null,
            onFailure: null
        };

    /*
     * irecom (dw data interface)
     * @namespace   irecom
     * @constructor
     * @param   {Object}    HTML element of contain the content
	 * @param   {Object}    DW����������Ҫ���Ĳ�������
     * @param   {Object}    User config
     */
    function irecom(container,params,config) {
        var self = this;

        //factory or constructor
        if (!(self instanceof irecom)) {
            return new irecom(container,params,config);
        }

        /*
         * the container of contain the rendered data
         * @property container
         * @type     HTML Element
         */
        self.container = $(container) || $(win.document);

        /*
         * config of user
         * @property config
         * @type     object
         */
        self.config = $.extend(true, {}, defaultConfig, config);
        self.params = $.isPlainObject(params)?params:{};
        self._init();
    };

    $.extend(irecom.prototype, {
        /*
         * @method  init
         * @protect
         */
		_init : function(){
			var self = this,
                params = {},
				query = win.location.search.substring(1).toLowerCase(),
				memberId,
				lastLoginId = Util.lastLoginId,
				loginId = Util.loginId,
				beaconId = $.util.cookie('ali_beacon_id'),
				datalazyload;
			try{
				memberId = $.unparam(query, '&').memberid;
			}catch(e){
				//��֧��gbk��������ĵȷ�ʽ
			}
			params.uid = memberId || loginId || lastLoginId || beaconId || -1;
			params.pageid = pageId;
			self.params = $.extend(true, {}, params, self.params);
            self.config.debug && (self.config.apiUrl = self.config.debugUrl);
			if(self.config.datalazyload){
				$.use('web-datalazyload', function() {
					datalazyload = self.datalazyload = Util.datalazyload;
					datalazyload.bind(self.container,function(){
						self._request();
					});
					datalazyload.init();
				});
			}else{
				self._request();
			}
		},
		/*
         * @method  request the data
         * @protect
         */
        _request: function() {
            var self = this;
            $.ajax({
                url:self.config.apiUrl,
				data:self.params,
                dataType: 'jsonp',
                success: function(o) {
                    if (self._isCorrect(o)) {
                        self._onCallback(o);
                    } else {
                        self._onFailure();
                    }
                },
                error: function() {
                    self._onFailure();
                }
            });
        },
		/*
		 * @method  test the correction of return data on success return
		 * @param   {Object}  the json of request from DW interface
		 * @return  {Boolean} if the data valid
		 * @private
		 */
		_isCorrect:function(o) {
			var self = this,
                config = self.config,
				flag = false;
			if (!! o && o.success && (o.data.returnCode === 0) && ($.isArray(o.data.data))){
				if(typeof config.filter==="number"&&config.filter>=1){
					o.data.data=o.data.data.slice(0,config.filter);
				}else if(typeof config.filter==="function"){
					o.data.data = $.grep( o.data.data, config.filter);
				}
				if(o.data.data.length > 0) {
					flag = true;
				}
			}
			return flag;
		},
        /*
         * @method  Success callback
         * @protect
         */
        _onCallback: function(o) {
            var self = this,
                data = self.data = o.data;
            self._loadTemplate($.proxy(self,'_renderData'));
        },
		_loadTemplate: function(callback) {
			var self = this,
                data = self.data.data,
				config = self.config,
                container = self.container,
				tpl;
			if(!config.template){
				container.html('<p>û��ָ����Ⱦģ�壡</p>');
			}else{
				if (tpl) {
					return callback(tpl);
				}
				$.use('web-sweet', function() {
					// the callback function before template render
					config.onTemplateReady && config.onTemplateReady.call(self, data);
					tpl = Util.sweet(config.template);
					callback(tpl);
				});
			}
		},
		_renderData: function(tpl) {
			var self = this,
                data = self.data.data,
                config = self.config,
                container = self.container;
			self.tpl=tpl;
			if(self.config.datalazyload){
				self._datalazyloadHandler();
			}else{
				self._renderHandler();
				config.onSuccess && config.onSuccess.call(self, data);
			}
			
		},
		_datalazyloadHandler:function(){
			var self = this,
                data = self.data.data,
                config = self.config;
			self._renderHandler();
			config.onLazyloadReady && config.onLazyloadReady.call(self, data);				
			self.datalazyload.register({containers:self.container});
			config.onSuccess && config.onSuccess.call(self, data);
		},
		_renderHandler:function(){
			var self = this,
				data = self.data.data,
                container = self.container
				tpl=self.tpl;
			container.html($(tpl.applyData(data,self)));
			// clickstat������
			self._clickstat();
			// ctr�ع������
			self._ctrstat();
		},
        /*
         * @method  Failure callback
         * @protect
         */
        _onFailure: function() {
            var self = this,
                container = self.container,
                config = self.config;

            if (config.onFailure === null) {
                container.html('<p>���ݼ���ʧ�ܣ���<a target="_self" href="javascript:location.reload();">ˢ��</a>���ԣ�</p>');
            } else {
                config.onFailure.call(container);
            }
        },
        /*
         * @method  clickstat��������������
         * @private
         */
        _clickstat: function() {
            var self = this;
            self.container.delegate('a[data-clickstat]', 'mousedown', function(e) {
                var param = {},
                    nodeData = $(this).data('clickstat'),
					arrData=[],
					m;
				nodeData=self._parseObj(nodeData);
				nodeData.objectId && (param.objectId=nodeData.objectId);
				nodeData.alg && (param.alg=nodeData.alg);
				nodeData.pid && (param.pid=nodeData.pid);
				nodeData.objectType && (param.objectType=nodeData.objectType);
				param.page=self.config.statScene;
				param.recId=self.params.recid;
				param.st_page_id=pageId;
				param.time=new Date().getTime();
				for (m in param) {
					if (hasOwn.call(param, m)) {
						arrData.push(m + '=' + param[m]);
					}
				}
				arrData = '?' + arrData.join('&');
                $.getScript('http://stat.1688.com/bt/1688_click.html'+arrData);
            });
        },
		/*
         * @method  �ع�����������
         * @private
         */
		_ctrstat:function(){
			var self=this,
				ctrQueue=self.config.ctrQueue;
			self.ctrData={};
			$.each(ctrQueue,function(index,data){
				if(self._isCtrBatch(data)){
					self._sniffBatch(data,index);
				}else{
					self.datalazyload.bind(self.container.find(data.selector),function(el){
						self._ctrRequest(data.param,self._sniffNode($(el)));
					});
				}
			});
			$.each(ctrQueue,function(index,data){
				if(self._isCtrBatch(data)){
					self._ctrBatch(data,index);
				}
			});
		},
		/*
         * @method  �Ƿ����õ����ع��㣨����������²����ã�
         * @private
         */
		_isCtrBatch:function(data){
			var self=this;
			return (!self.config.datalazyload||typeof data.ctrBatch==='undefined'||data.ctrBatch);
		},
		/*
		 * @method  ctr�ع�������������̽�ɼ�
		 * @private
		 */
		_sniffBatch: function(o,i) {
			var self=this,
				data=self.ctrData;
			$.isArray(data[i]) || (data[i] = []);
			data[i]=self._sniffNode($(o.selector,self.container));
		},
		/*
		 * @method  ctr�ع���ڵ�������̽�ɼ�
		 * @private
		 */
		_sniffNode:function(els) {
			var self=this,
				arr=[],
				nodeData;
			self.container.find(els).each(function(){
				nodeData=self._parseObj($(this).data('ctr'));
				if(!$.isPlainObject(nodeData)){
					nodeData={
						objectId:'',
						alg:''
					}
				}
				arr.push((nodeData.objectId||'')+','+(nodeData.alg||''));
			});
			return arr;
		},
		/*
		 * @method  ctr�ع��������
		 * @private
		 */
		_ctrBatch:function(o,i) {
			var self=this,
				data=self.ctrData,
				size=o.size||data[i].length,
				start=o.start||0;
			self._ctrRequest(o.param,data[i].slice(start,start+size));
		},
		/*
		 * @method  ctr�ع�������
		 * @private
		 */
		_ctrRequest:function(userParam,objectIdsArr){
			var self=this,
				param=userParam||{},
				arrData=[],
				m;
			param.object_ids=objectIdsArr.join(';');
			param.page_area=self.params.recid;
			param.ctr_type=self.config.statScene;
			param.page_id=pageId;
			for (m in param) {
				if (hasOwn.call(param, m)) {
					arrData.push(m + '=' + param[m]);
				}
			}
			arrData = '?' + arrData.join('&');
			$.getScript('http://ctr.1688.com/ctr.html'+arrData);
		},
		/*
		 * @method  onSuccess�е��ô����ع�
		 * @public
		 */
		ctrManual:function(baseNode,userParam,size,start){
			var self=this,
				arr=self._sniffNode(baseNode);
			size=size||arr.length;
			start=start||0;
			self._ctrRequest(userParam,arr.slice(start,start+size));
		},
		/*
		 * @method  �ַ���ת���󷽷�������ʹ��evel������ͬʱ�Խڵ�����"{}"��ȡ����Ϊobject�ͷ�string�����޸���ͬʱ����Ƿ��ַ������ؿն���
		 * @private
		 */
		_parseObj:function(data){
			try {
				return (typeof data === "object") ? data : (new Function("return " + data))();
			} 
			catch (e) {
				return {};
			}
		}
    });
	
    /*
     * @method  fit length
     * @param   {String} the string need fit
     * @param   {Number} string length
     * @static
     */
    irecom.fitLength = function(s, len) {
        s = $.util.unescapeHTML(s);
        if (s.lenB() > len) {
            s = s.cut(len - 3) + '...';
        }
        return $.util.escapeHTML(s);
    };
	/*
     * @method  get offer url
     * @param   {Object}
     * @static
     */
    irecom.getOfferUrl = function(offer) {
        var offerUrl = (!! offer.eURL) ? offer.eURL : offer.offerDetailUrl;
        return offerUrl;
    };
    /*
     * @method  get searchlist url
     * @param   {Object}
     * @static
     */
    irecom.getSearchUrl = function(item) {
        var searchUrl = 'http://s.1688.com/search/offer_search.htm?keywords='+item.categoryDesc;
        return searchUrl;
		
    };
    /*
     * @method  get company url
     * @param   {Object}
     * @static
     */
    irecom.getCompanyUrl = function(item) {
        var companyUrl = item.contact;
        return companyUrl;
    };

    /*
     * @method get bizref url
     * @param {Object}
     * @static
     */
    irecom.getBizrefUrl = function(item) {
        var domainID = item.domainID,
            memberId = item.memberId,
            bizrefUrl = '';

        !domainID || (bizrefUrl = 'http://' + domainID + '.cn.1688.com/athena/bizreflist/' + domainID + '.html');
        !memberId || (bizrefUrl = 'http://' + memberId + '.cn.1688.com/athena/bizreflist/' + memberId + '.html');

        return bizrefUrl;
    };
	/*
     * @method  get price
     * @param   {Object}
     * @static
     */
	irecom.getPrice=function(offer,mode) {
        var priceHtml = '',
			mode=mode||0;
        if ([0,''].indexOf(offer.rmbPrice)===-1) {
            priceHtml = '<span class="fd-cny">&yen;</span><em class="value">' + offer.rmbPrice + '</em>'+(mode?'<span class="unit">/'+offer.unit+'</span>':'');
        } else if ([0,''].indexOf(offer.foreignPrice)===-1) {
            priceHtml = '<em class="value">'+offer.foreignPrice+offer.foreignCurrency+'</em>'+(mode?'<span class="unit">/'+offer.unit+'</span>':'');
        } else {
            priceHtml = '<em class="value">�۸�����</em>';
        }
        return priceHtml;
    };
    /*
     * @method  get img url
     * @param   {Object}
     * @param   {Number} the size of img
     * @static
     */
    irecom.getImgUrl = function(offer, size) {
        var url = offer.offerImageUrl,
            imgSize = size || 100,
            imgUrl = '';
        if (!url) {
            if (imgSize < 151) {
                if (imgSize < 101) {
                    imgUrl = 'http://img.china.alibaba.com/cms/upload/other/nopic-100.png';
                } else {
                    imgUrl = 'http://img.china.alibaba.com/cms/upload/other/nopic-150.png';
                }
            } else {
                if (imgSize < 221) {
                    imgUrl = 'http://img.china.alibaba.com/cms/upload/other/nopic-220.png';
                } else {
                    imgUrl = 'http://img.china.alibaba.com/cms/upload/other/nopic-310.png';
                }
            }
        } else {
            if (imgSize < 151) {
                if (imgSize < 101) {
                    imgUrl = url + '.summ.jpg';
                } else {
                    imgUrl = url + '.search.jpg';
                }
            } else {
                if (imgSize < 221) {
                    imgUrl = url + '.220x220.jpg';
                } else {
                    imgUrl = url + '.310x310.jpg';
                }
            }
        }

        return imgUrl;
    };

    /*
     * @method  p4p sort
     * @param   {Object}
     * @static
     */
    irecom.p4pSort = function(offerList) {
        offerList.sort(function(a, b) {
            var x = (!a.eURL) ? 1 : 0,
                y = (!b.eURL) ? 1 : 0;
            return x - y;
        });
    };

    /*
     * @method  resize image
     * @param   {Object} this image
     * @param   {Number} width
     * @param   {Number} height
     * @static
     */
    irecom.resizeImg = function(img, w, h) {
        img.removeAttribute('width');
        img.removeAttribute('height');
        var pic;
        if (win.ActiveXObject) {
            pic = new Image();
            pic.src = img.src;
        } else {
            pic = img;
        }
        if (pic && pic.width && pic.height && w) {
            if (!h) {
                h = w;
            }
            if (pic.width > w || pic.height > h) {
                var scale = pic.width / pic.height,
                    fit = scale >= w / h;
                img[fit ? 'width' : 'height'] = fit ? w : h;
                if (win.ActiveXObject) {
                    img[fit ? 'height' : 'width'] = (fit ? w : h) * (fit ? 1 / scale : scale);
                }
            }
        }
    };
    FE.sys.irecom = irecom;
    $.add('sys-irecom');
})(jQuery, FE.util, window);