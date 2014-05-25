/**
 * div放大缩小
 * @author springyu
 * @date 2012-2-28
 */

;(function($, D) {
    D.divTensile = function(target, config, callback) {
        var tensile = new Tensile(target, config, callback);
        tensile.init();
    };
    function Tensile(target, config, callback) {
        this.target = target;
        this.config = config;
        this.callback = callback;

    };
    Tensile.prototype._tensile = function(target, tensile, props) {
        var pos = props.handles;
        for(var n in pos) {
            var posObj = tensile[n];
            if(document.all) {
                //阻止ie选中
                if(pos[n] && pos[n] === true) {
                    posObj[0].onselectstart = function() {
                        return false;
                    };
                }
            }
            posObj[0].onmousedown = function() {
                D.divTensile.tMouse.setMouseD(true);
                D.divTensile.tMouse.setDrag(this);

            };
            posObj[0].onmouseup = function() {
                D.divTensile.tMouse.setMouseD(false);
                D.divTensile.tMouse.setDrag('');

                D.divTensile.block.remove();
            };

            target.append(posObj);
        }

    };
    Tensile.prototype.init = function() {
        var _oTarget = $('.' + this.target);
        var tensileDiv = $('<div class="tensile-top"></div>');
        var tensileRight = $('<div class="tensile-right"></div>');
        var tensileBottom = $('<div class="tensile-bottom"></div>');
        var tensileLeft = $('<div class="tensile-left"></div>'), e = window.event;

        var currentObj = {
            self : this.target + '-top',
            parent : this.target,
            callback : this.callback
        };
        tensileDiv.data('target', currentObj);
        currentObj = {
            self : this.target + '-right',
            parent : this.target,
            callback : this.callback
        };
        tensileRight.data('target', currentObj);
        currentObj = {
            self : this.target + '-bottom',
            parent : this.target,
            callback : this.callback
        };
        tensileBottom.data('target', currentObj);
        currentObj = {
            self : this.target + '-left',
            parent : this.target,
            callback : this.callback
        };
        tensileLeft.data('target', currentObj);

        this._tensile(_oTarget, {
            top : tensileDiv,
            right : tensileRight,
            bottom : tensileBottom,
            left : tensileLeft
        }, this.config);
        document.onmouseup = function() {
            D.divTensile.tMouse.setMouseD(false);
            D.divTensile.tMouse.setDrag('');
            D.divTensile.block.remove();

        };
        var props = this.config;

        document.onmousemove = function(e) {
            var e = e ? e : event, _height, _width;
            if(D.divTensile.tMouse.getMouseD() === true && D.divTensile.tMouse.getDrag()) {
                var self = $(D.divTensile.tMouse.getDrag());
                var selfParent = self.parent();
                var mTarget = self.data('target').self;
                var mpTarget = self.data('target').parent;
                var _callback = self.data('target').callback;

                D.divTensile.block.add(props.block);
                var _h = $(window).height();
                var _w = $(window).width();

                if(mTarget && mTarget === mpTarget + '-top') {
                    _height = _h - e.clientY;
                    selfParent.css('height', _height);
                }
                if(mTarget && mTarget === mpTarget + '-left') {
                    _width = _w - e.clientX;
                    selfParent.css('width', _width);
                }

                if(mTarget && mTarget === mpTarget + '-right') {
                    _width = e.clientX - selfParent.offset().left;
                    selfParent.css('width', _width);
                }
                if(mTarget && mTarget === mpTarget + '-bottom') {
                    _height = e.clientY - selfParent.offset().top;
                    selfParent.css('height', _height);
                }

                if(_callback && typeof _callback === 'function') {
                    _callback.call(selfParent, {
                        height : _height,
                        width : _width
                    });
                }
            }
        };
        //
    };

    D.divTensile.block = {
        add : function(block) {
            var oIframe = $(block), oDiv;
            if(oIframe.length >= 1) {
                oDiv = oIframe.parent();
                oDiv.css('position', 'relative');
                var blockIframe = $('#blockIframe');
                if(blockIframe.length <= 0) {//border:1px solid red;
                    blockIframe = $('<div id="blockIframe" style="position:absolute;background:transparent;opacity:0.5;filter:alpha(opacity=50);"></div>');
                    blockIframe.css('width', oIframe.width());
                    blockIframe.css('height', oIframe.height());
                    blockIframe.css('top', 32);
                    if($.browser.mozilla) {
                        blockIframe.css('top', oIframe.offset().top);
                    }

                    blockIframe.css('left', 0);
                    oDiv.append(blockIframe);
                } else {
                    blockIframe.css('height', oIframe.height());
                }
            }
        },
        remove : function() {
            var blockIframe = $('#blockIframe');
            if(blockIframe && blockIframe.length > 0) {
                blockIframe.parent().css('position', 'static');
                blockIframe.remove();
            }
        }
    };
    $(function() {
        D.divTensile.tMouse = {

            getMouseD : function() {
                return this._mouseD;
            },
            setMouseD : function(mouseD) {
                this._mouseD = mouseD;
            },
            getDrag : function() {
                return this._drag;
            },
            setDrag : function(drag) {
                this._drag = drag;
            }
        };
    });
})(dcms, FE.dcms);
