/**
 * Asynchronous render interface fly
 * @module    Fly
 * @creator   Arcthur.cheny
 * @class     Fly
 * @version   2.1
 */

('fly' in FE.sys) ||
(function($, Util, win) {
    var pageId = win.dmtrack_pageid = (typeof win.dmtrack_pageid === 'undefined') ? (new Date() - 0 + '' + Math.floor((Math.random() * 1000))) : win.dmtrack_pageid,
        hasOwn = Object.prototype.hasOwnProperty,
        exGroup = {}, exStr = [],
        defaultConfig = {
            /*
             * the callback content is rendered by sweet template when you pass the template string.
             */
            template: '',
            /*
             * maybe the API address will change to commend
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
     * @param   {Object}    DW params you need pass
     * @param   {Object}    User config
     */
    var Fly = function(container, params, config) {
        var self = this,
            query = win.location.search.substring(1).toLowerCase(),
            memberId = $.unparam(query, '&').memberid,
            lastLoginId = Util.lastLoginId,
            loginId = Util.loginId,
            beaconId = $.util.cookie('ali_beacon_id');

        //factory or constructor
        if (!(self instanceof Fly)) {
            return new Fly(container, params, config);
        }

        /*
         * the container of contain the rendered data
         * @property container
         * @type     HTML Element
         */
        self.container = container || win.document;

        /*
         * config of user
         * @property config
         * @type     object
         */
        //self.config = {};
        self.config = $.extend(true, {}, defaultConfig, config);
        
        /*
         * the DW params you should be passed
         * @property params
         * @type     object
         */

        params.uid = memberId || loginId || lastLoginId || beaconId || -1;
        params.pageid = pageId;

        self.params = {};
        self.params = params;

        self._request();
    };

    $.extend(Fly.prototype, {
        /*
         * @method  request the data
         * @protect
         */
        _request: function() {
            var self = this, p = [], i,
                params = self.params,
                API = 'http://res.1688.com/fly/recommend.do';

            (self.config.apitype !== 'commend') || (API = 'http://res.1688.com/fly/commend.do');

            for (i in params) {
                if (hasOwn.call(params, i)) {
                    p[p.length] = i + '=' + params[i];
                }
            }
            p = p.join('&');

            $.ajax({
                url: API + '?' + p,
                dataType: 'script',
                success: function() {
                    var result = win[params.jsonname] || win.flyResult;
                    if (__isCorrect(result)) {
                        self._onCallback(result);
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
         * @method  Success callback
         * @protect
         */
        _onCallback: function(result) {
            var self = this,
                data = result.data,
                config = self.config,
                container = self.container,
                i;

            // the callback function before template render
            if (config.onTemplatePre !== null) {
                data = config.onTemplatePre.call(self, data);
            }
            
            data.length !== 0 || (container.html('<p>Õ¯¬Á∑±√¶£¨«Î…‘∫Û‘Ÿ ‘£°</p>'));
            ! config.template || (container.html(Util.sweet(config.template).applyData(data, self)));

            // the callback function after template render
            if (config.onSuccess !== null) {
                config.onSuccess.call(self, data);
            }

            // click tracelog
            self.iclick();
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
                container.html('<p> ˝æ›º”‘ÿ ß∞‹£¨«Î<a target="_self" href="javascript:location.reload();">À¢–¬</a>÷ÿ ‘£°</p>');
            } else {
                config.onFailure.call(container);
            }
        },

        /*
         * @method  iclick
         * @param   {Object} params of click
         * @public
         */
        iclick: function() {
            var self = this;

            self.container.delegate('a.iclick', 'mousedown', function(e) {
                var param = [], urlParam,
                    el = $(this).data('fly-click'),
                    clickParam = __parseJSON(el);

                param.push('page=' + clickParam.page);
                clickParam.objectId && param.push('objectId=' + clickParam.objectId);
                clickParam.alg && param.push('alg=' + clickParam.alg);
                param.push('objectType=' + clickParam.objectType);
                param.push('recId=' + self.params.recid);
                clickParam.pid && param.push('pid=' + clickParam.pid);
                param.push('st_page_id=' + pageId);
                param.push('time=' + (+ new Date()));

                urlParam = '?' + param.join('&');
                
                $.getScript('http://stat.1688.com/bt/1688_click.html' + urlParam);
            });
        }
    });

    /*
     * @method  test the correction of return data on success return
     * @param   {Object}  the json of request from DW interface
     * @return  {Boolean} if the data valid
     * @private
     */
    function __isCorrect(o) {
        var flag = false;
        if (!! o && (o.returnCode === 0) && ($.isArray(o.data)) && o.data.length > 0) {
            flag = true;
        }
        return flag;
    };

    /*
     * @method  parse JSON modified
     * @param   {String}  the value of data
     * @private
     */
    function __parseJSON(data) {
        var json = data.replace(/'([^']*)'/g, '"$1"');
        return $.parseJSON(json);
    };

    /*
     * @method  fit length
     * @param   {String} the string need fit
     * @param   {Number} string length
     * @static
     */
    Fly.fitLength = function(s, len) {
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
    Fly.getOfferUrl = function(offer) {
        var offerUrl = (!! offer.eURL) ? offer.eURL : offer.offerDetailUrl;
        return offerUrl;
    };

    /*
     * @method  get company url
     * @param   {Object}
     * @static
     */
    Fly.getCompanyUrl = function(item) {
        var companyUrl = item.contact;
        return companyUrl;
    };

    /*
     * @method get bizref url
     * @param {Object}
     * @static
     */
    Fly.getBizrefUrl = function(item) {
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
    Fly.getPrice = function(offer) {
        var rmb = offer.rmbPrice,
            priceHtml = '';

        if ((rmb !== 0) && (rmb !== '')) {
            priceHtml = '<span class="fd-cny">&yen;</span><em class="value">' + rmb + '</em>';
        } else if (offer.foreignCurrency !== '') {
            priceHtml = '<span class="fd-cny">Õ‚±“</span>';
        } else {
            priceHtml = '<span class="fd-cny"></span>';
        }
        return priceHtml;
    };

    /*
     * @method  get img url
     * @param   {Object}
     * @param   {Number} the size of img
     * @static
     */
    Fly.getImgUrl = function(offer, size) {
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
    Fly.p4pSort = function(offerList) {
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
    Fly.resizeImg = function(img, w, h) {
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

    /*
     * @method  collect the exposure data
     * @public
     */
    Fly.collect = function(exId, exAlg, type) {
        var type = type || 0;

        $.isArray(exGroup[type]) || (exGroup[type] = []);
        exGroup[type][exGroup[type].length] = [exId, exAlg];
    };

    /*
     * @method  iexposure
     * @public
     */
    Fly.iexposure = function(exParams, num, start, type) {
        var self = this, i, m,
            param = [],
            startNum = start || 0,
            type = type || 0,
            group = exGroup[type],
            len;

        if (!!group){
            len = group.length > num ? num : group.length || group.length;
            exStr[type] = '';
            for (i = startNum; i < (len + startNum); i++) {
                exStr[type] += group[i][0] + ',' + group[i][1] + ';';
            }

            exStr[type] = exStr[type].slice(0, -1);
            param.push('object_ids=' + exStr[type]);
        }

        exGroup = {};
        param.push('page_id=' + pageId);

        for (m in exParams) {
            if (hasOwn.call(exParams, m)) {
                param.push(m + '=' + exParams[m]);
            }
        }

        // param.push('time=' + ( + new Date()));
        param = '?' + param.join('&');
        
        $.getScript('http://ctr.1688.com/ctr.html' + param);
    };

    FE.sys.fly = Fly;
    $.add('sys-fly');
})(jQuery, FE.util, window);
