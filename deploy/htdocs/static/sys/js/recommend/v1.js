/**
 * Fall In Love的推荐，重写李晓东的Fdev3版本
 */
(function($){
    var mod, FU = FE.util, tradePurchaseFoucs, tradePurchaseFoucsTab, acceleration = {
        init: function(){
            mod = $('#mod-tab');
            if (!mod.length) {
                return;
            }
            leftmenu = $('#leftmenu');
            tradePurchaseFoucs = $('#trade-purchase-foucs');
            tradePurchaseFoucsTab = $('#trade-purchase-foucs-tab');
            this.isDisplay();
        },
        isDisplay: function(){
            var beaconId = $.util.cookie('ali_beacon_id');
            if (FU.lastLoginId === '' && beaconId === '') {
                mod.hide();
            }
            else {
                mod.css('height', 270);
                this.stopATagDefault();
                this.initTab();
                this.getCatids();
            }
        },
        stopATagDefault: function(){
            $('ul.class-tab-blue a', mod).click(function(e){
                e.preventDefault();
            });
        },
        initTab: function(){
            $.use('ui-tabs', function(){
                mod.tabs({
                    isAutoPlay: false,
                    titleSelector: '.tab-t',
                    boxSelector: '.tab-b'
                });
            });
        },
        getCatids: function(){
            var offerCatidUrl = $('#offerCatidUrl'), url, _offer;
            if (!offerCatidUrl.length) {
                mod.hide();
                return;
            }
            _offer = $('[name=cargoIdentity]');
            if (_offer.length === 0) {
                this.noFoucsData();
            }
            else {
                var _offerids = [];
                _offer.each(function(i, item){
                    var v = item.value;
                    if (_offerids.indexOf(v) < 0) {
                        _offerids.push(v);
                    }
                });
                url = offerCatidUrl.val() + '?offerIds=' + _offerids.join();
                
                $.ajax(url, {
                    dataType: 'script',
                    success: function(){
                        if (typeof window.result == 'undefined') {
                            acceleration.getGuessData();
                            return;
                        }
                        var _catids = [], _id = [];
                        for (i = 0; i < _offerids.length; i++) {
                            var offerid = _offerids[i];
                            if (window.result[offerid]) {
                                //alert(window.result[offerid]);
                                _catids.push(window.result[offerid]);
                                _id.push(offerid);
                            }
                            
                            
                        }
                        acceleration.getFoucsData(_id, _catids);
                        acceleration.getGuessData();
                        
                    },
                    error: this.noFoucsData
                });
            }
        },
        noFoucsData: function(){//只显示猜你喜欢
            tradePurchaseFoucs.hide();
            tradePurchaseFoucsTab.hide();
            this.getGuessData();
        },
        getFoucsData: function(id, catid){
            var _catids = catid, _offerids = id, _ctr_type = $('#ctr_type').val(), _foucs_pid = $('#foucs_pid').val();
            
            if (!tradePurchaseFoucs.length) {
                return;
            }
            // 取得进货单上的offerIds及相应类目ID
            mod.show();
            tradePurchaseFoucsTab.show();
            if (leftmenu.length) {
                initTreeHeight();
            }
            FD.sys.fly.Ao({
                'catids': _catids,
                'offerids': _offerids,
                'flyWidgetId': 'trade-purchase-foucs',
                'jsonname': 'tPFFlyResult',
                'count': 5,
                'pid': _foucs_pid,
                'recid': '1030',
                'coaseType': _ctr_type,
                'coasePageArea': '5'
            }).use(FD.sys.fly.TradePurchaseFocus);
        },
        getGuessData: function(){
            var tradePurchaseGuess = $('#trade-purchase-guess');
            if (tradePurchaseFoucs.is(':hidden') && tradePurchaseGuess.length) {
                toDo();
            }
            else {
                var guessBtn = $('ul.list li.rt', mod);
                guessBtn.mouseover(function(){
                    var isExist = !!$('.mod-guess-link', tradePurchaseGuess).length;
                    if (tradePurchaseFoucs.length && tradePurchaseGuess.length && !isExist) {
                        toDo();
                    }
                });
            }
            function toDo(){
                var _ctr_type = $('#ctr_type').val(), _guess_pid = $('#guess_pid').val();
                mod.show();
                if (leftmenu.length) {
                    initTreeHeight();
                }
                FD.sys.fly.Ao({
                    'flyWidgetId': 'trade-purchase-guess',
                    'jsonname': 'tPGFlyResult',
                    'count': 5,
                    'pid': _guess_pid,
                    'recid': '1010',
                    'coaseType': _ctr_type,
                    'coasePageArea': '6'
                }).use(FD.sys.fly.TradePurchaseGuess);
            }
        }
    };
    
    $(function(){
        acceleration.init();
    });
})(jQuery);
