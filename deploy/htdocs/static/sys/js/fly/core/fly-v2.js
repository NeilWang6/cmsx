/**
 * Asynchronous render interface fly
 * @module    Fly
 * @creator   Arcthur.cheny
 * @namespace Fly
 * @class     FD.sys.fly
 * @version   2.0
 */

FDEV.namespace("FD.sys.fly");
(function (win, undefined) {
    var doc = win.document,
        hasOwn = Object.prototype.hasOwnProperty,
        L = FDEV.lang,
        C = FD.common,
        API = 'http://res.1688.com/fly/recommend.do',
        pageId = __getPageId(),
        defaultConfig = {
            /*
             * the callback content is rendered by sweet template when you pass the template string.
             */
            template: '',
            /*
             * click (must have): contained dw documents params object, and have page, recId and objectType
             *      fac_name    : (must) return function name
             */
            click: '',
            /*
             * apitype  :   "recommend" or "commend" (default - recommend)
             */
            apitype: 'recommend',
            /*
             * Callback
             * onTemplatePre  : callback before template render
             * onSuccess      : callback after template render or without template
             * onFailure      : callback when failure render
             */
            onTemplatePre: null,
            onSuccess: null,
            onFailure: null
        };
    
    /*
     * Fly (dw data interface)
     * @namespace   Fly
     * @constructor
     * @param   {Object}    HTML element of contain the content
     * @param   {Object}    params of DW
     * @param   {Object}    config of user
     */
    var Fly = function (container, params, config) {
        var self = this,
            args = __getArgs(),
            lastLoginId = C.lastLoginId,
            loginId = C.loginId,
            beaconId = C.cookie('ali_beacon_id');
        
        // factory or constructor
        if (!(self instanceof Fly)) {
            return new Fly(container, params, config);
        }
        
        // if the containers is HTMLElement
        if (!L.isArray(container)) {
            container = FYG(container) || doc;
        }
        
        /*
         * config of user
         * @property config
         * @type     object
         */
        self.config = C.applyIf(config, defaultConfig);
        
        if (self.config.apitype === 'commend') {
            API = "http://res.1688.com/fly/commend.do";
        }
        
        /*
         * the container of contain the rendered data
         * @property container
         * @type     HTML Element
         */
        self.container = container;
        
        /*
         * the DW params you should be passed
         * @property params
         * @type     object
         */
        self.params = {};
        self.params.uid = args.memberid ? args.memberid : (loginId ? loginId : (lastLoginId ? lastLoginId : ( beaconId ? beaconId : -1 )));
        self.params.pageid = pageId;

        C.applyIf(self.params, params);
        
        self._request();
    };

    L.augmentObject(Fly.prototype, {
        /*
         * @method  request the data
         * @protect
         */
        _request: function () {
            var self = this,
                params = self.params,
                p = [], i;

            for (i in params) {
                if (hasOwn.call(params, i)) {
                    p[p.length] = i + '=' + params[i];
                }
            }
            p = p.join('&');
            
            FDEV.util.Get.script(API + '?' + p, {
                onSuccess: function () {
                    var result = win[params.jsonname] || win.flyResult;
                    
                    if (__isCorrect(result)) {
                        self._onCallback(result);
                    } else {
                        self._onFailure();
                    }
                },
                onFailure: function () {
                    self._onFailure();
                },
                onTimeout: function () {
                    self._onFailure();
                },
                autopurge: true,
                timeout: 10000
            });
        },

        /*
         * @method  Callback on Success
         * @protect
         */
        _onCallback: function (result) {
            var self = this,
                data = result.data,
                config = self.config,
                container = self.container,
                i;

            if (config.onTemplatePre !== null) {
                config.onTemplatePre.call(self, result);
            }
            
            data.length !== 0 || (container.innerHTML = '<p>暂无数据！</p>');
            ! config.template || (container.innerHTML = FD.widget.Sweet(config.template).applyData(data, self));

            if (!! config.click) {
                if (L.isArray(config.click)) {
                    for ( i = config.click.length; i-- ; ) {
                        FD.sys.fly[config.click[i].fac_name] = Fly.iclick (config.click[i]);
                    }
                } else {
                    FD.sys.fly[config.click.fac_name] = Fly.iclick (config.click);
                }
            }

            if (config.onSuccess !== null) {
                config.onSuccess.call(self, result);
            }
        },

        /*
         * @method  on failure
         * @protect
         */
        _onFailure: function () {
            var self = this,    
                container = self.container,
                config = self.config;
            
            if (config.onFailure === null) {
                container.innerHTML = '<p>数据加载失败，请<a target="_self" href="javascript:location.reload();">刷新</a>重试！</p>';
            } else {
                config.onFailure.call(container);
            }
        }
    });
    
    /*
     * @method  get pageid
     * @return  {String} pageid
     * @private
     */
    function __getPageId () {
        var pageId = typeof win.dmtrack_pageid === 'undefined' ? (new Date () - 0 + '' + Math.floor((Math.random() * 1000))) : win.dmtrack_pageid;
        win.dmtrack_pageid = pageId;
        return pageId;
    };

    /*
     * @method get args from url(get memberId mainly)
     * @return {Object} args
     * @private
     */
    function __getArgs () {
        var args = {},
            query = win.location.search.substring(1).toLowerCase(),
            pairs = query.split("&"), i, len;
        for (i = 0, len = pairs.length; i < len; i++) {
            var pos = pairs[i].indexOf("="),
                argname, value;
            if (pos === -1) { continue; }
            argname = pairs[i].substring(0, pos);
            value = pairs[i].substring(pos + 1);
            args[argname] = value;
        }
        return args;
    };
    
    /*
     * @method  test the correction of return data on success return
     * @param   {Object}  the json of request from DW interface
     * @return  {Boolean} if the data valid
     * @private
     */
    function __isCorrect (o) {
        if (!! o && (o.returnCode === 0) && (L.isArray(o.data)) && o.data.length > 0) {
            return true;
        } else {
            return false;
        }
    };
    
    /*
     * iclick
     * @param   {Object} params of click
     * @static
     */
    Fly.iclick = function (clickParam) {
        var self = this,
            param = [], i,
            customParam = clickParam || {};
        
        param[param.length] = 'st_page_id=' + pageId;
        
        for (i in customParam) {
            if (hasOwn.call(customParam, i) && i !== 'fac_name') {
                param[param.length] = i + '=' + customParam[i];
            }
        }
        
        return function (objectId, alg, pid) {
            var paramBak = [].concat(param);
            paramBak[paramBak.length] = 'objectId=' + objectId;
            paramBak[paramBak.length] = 'alg=' + alg;
            
            if (pid) {
                paramBak[paramBak.length] = 'pid=' + pid;
            }
            
            paramBak[paramBak.length] = 'time=' + ( + new Date() );
            paramBak = '?' + paramBak.join('&');

            FDEV.util.Get.script('http://stat.1688.com/bt/1688_click.html' + paramBak, {
                autopurge: true
            });
        };
    };
    
    /*
     * @method  fit length
     * @param   {String} the string need fit
     * @param   {Number} string length
     * @static
     */
    Fly.fitLength = function (s, len) {
        s = C.unescapeHTML(s);
        if (s.lenB() > len) {
            s = s.cut(len - 3) + '...';
        }
        return C.escapeHTML(s);
    };
    
    /*
     * @method  get offer url
     * @param   {Object}
     * @static
     */
    Fly.getOfferUrl = function (offer) {
        return (!! offer.eURL) ? offer.eURL : offer.offerDetailUrl;
    };
    
    /*
     * @method  get company url
     * @param   {Object}
     * @static
     */
    Fly.getCompanyUrl = function (item) {
        return item.contact;
    };
    
    /*
     * @method get bizref url
     * @param {Object}
     * @static
     */
    Fly.getBizrefUrl = function(item){
        var domainID = item.domainID,
            memberId = item.memberId;
        
        if (domainID !== '') {
            return 'http://' + domainID + '.cn.1688.com/athena/bizreflist/' + domainID + '.html';
        }
        
        if (memberId !== '') {
            return 'http://' + memberId + '.cn.1688.com/athena/bizreflist/' + memberId + '.html';
        }
        
        return '';
    };
    
    /*
     * @method  get price
     * @param   {Object}
     * @static
     */
    Fly.getPrice = function (offer) {
        var rmb = offer.rmbPrice;
        if ((rmb !== 0) && (rmb !== '')) {
            return '<span class="fd-cny">&yen;</span><em class="value">' + rmb + '</em>';
        } else if (offer.foreignCurrency !== '') {
            return '<span class="fd-cny">外币</span>';
        } else {
            return '<span class="fd-cny"></span>';
        }
    };

    /*
     * @method  get img url
     * @param   {Object}
     * @param   {Number} the size of img
     * @static
     */
    Fly.getImgUrl = function (offer, size) {
        var url = offer.offerImageUrl,
            imgSize = size || 100;
        if (!url) {
            if (imgSize < 151) {
                if (imgSize < 101) {
                    return 'http://img.china.alibaba.com/cms/upload/other/nopic-150.png';
                } else {
                    return 'http://img.china.alibaba.com/cms/upload/other/nopic-100.png';
                }
            } else {
                if (imgSize < 221) {
                    return 'http://img.china.alibaba.com/cms/upload/other/nopic-220.png';
                } else {
                    return 'http://img.china.alibaba.com/cms/upload/other/nopic-310.png';
                }
            }
        }
        
        if (imgSize < 151) {
            if (imgSize < 101) {
                return url + '.summ.jpg';
            } else {
                return url + '.search.jpg';
            }
        } else {
            if (imgSize < 221) {
                return url + '.220x220.jpg';
            } else {
                return url + '.310x310.jpg';
            }
        }
    };

    /*
     * @method  p4p sort
     * @param   {Object}
     * @static
     */
    Fly.p4pSort = function (offerList) {
        offerList.sort(function (a, b) {
            var x = (!a.eURL) ? 1 : 0;
            var y = (!b.eURL) ? 1 : 0;
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
    Fly.resizeImg = function (img, w, h) {
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

    FD.sys.fly = Fly;

    /*
     * Exposure (dw data interface exposure)
     * @namespace   Exposure
     * @constructor
     * @param   {Object}    passed params
     */
    var Exposure = function (params) {
        var self = this;

        self.exGroup = [];
        self.exParams = params || {};
    }

    L.augmentObject(Exposure.prototype, {
        /*
         * @method  collect the data
         * @public
         */
        collect : function (exId, exAlg) {
            var self = this;

            self.exGroup[self.exGroup.length] = [exId, exAlg]; 
        },

        /*
         * @method  send the request
         * @public
         */
        send : function (num, start) {
            var self = this, i, m, exStr = '', param = [],
                startNum = start || 0,
                exGroup = self.exGroup,
                exParams = self.exParams,
                len = exGroup.length > num ? num : exGroup.length || exGroup.length;

            for (i = startNum; i < (len + startNum); i++) {
                exStr += exGroup[i][0] + ',' + exGroup[i][1] + ';';
            }

            exStr = exStr.slice(0, -1);
            param[param.length] = 'object_ids=' + exStr;
            param[param.length] = 'page_id=' + pageId;

            for (m in exParams) {
                if (hasOwn.call(exParams, m)) {
                    param[param.length] = m + '=' + exParams[m];
                }
            }

            param[param.length] = 'time=' + ( + new Date());
            param = '?' + param.join('&');
            
            FDEV.util.Get.script('http://ctr.1688.com/ctr.html' + param, {
                autopurge: true
            });
        }
    });

    FD.sys.fly.exposure = Exposure;
})(window);
