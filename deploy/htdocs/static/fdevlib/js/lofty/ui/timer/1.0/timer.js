/**
 * ����ʱ���
 * @module lofty/ui/timer
 * @author daniel.xud
 * @date 2013-09-11
 * @version  1.0
 * @dependence lofty/alicn/now/1.0/now����ȡ������ʱ��
 */

/*!!cmd:compress=true*/
/*!!cmd:jsCompressOpt=["--disable-optimizations"]*/

define('lofty/ui/timer/1.0/timer', ['lofty/lang/class', 'lofty/ui/widget/1.0/widget', 'lofty/alicn/now/1.0/now', 'jquery'], function(Class, Widget, Now, $) {
	'use strict';

	var TMAP = ['year', 'month', 'day', 'hour', 'minute', 'second'],
		FMAP = {
			year: 'yyyy',
			month: 'MM',
			day: 'dd',
			hour: 'hh',
			minute: 'mm',
			second: 'ss'
		};

	var Timer = Class(Widget, {
		/**
		 * Ĭ������
		 */
		options: {
			format: 'y-M-d hh:mm:ss', 		// ����ʱ�����ʾ��ʽ��˫��ĸ����һλ��ʱ��0
			to: new Date(), 				// ����ʱ�䣬�������� [Date, Date, ...]
			stopEventName: 'stop', 			// �����󴥷����¼�������������	[String, String, ...]
			useServerTime: false, 			// �Ƿ�ʹ�÷�����ʱ��
			step: 1, 						// ����Ƶ�ʣ���λ�룩
			animate: false, 				// �Ƿ񶯻���ʾ��������ʾ��Ҫ�����ʽ�ļ���
			fixInterval: false,				// �Ƿ�����ƫ������ÿ60������һ�Σ�
			autoStart: true 				// �Ƿ��Զ���ʼ
		},

		/**
		 * ��ʼ��
		 */
		_create: function() {
			var self = this,
				container = self.get('el'),
				to = self.get('to'),
				tmp = '<dl><dd></dd></dl>';

			// ����ÿ��dom�ڵ�
			$.each(TMAP, function(i, item) {
				var placeholder = $('.' + item, container);
				if (placeholder.length) {
					self['ph' + item] = placeholder;
					if (self.get('animate')) {
					    placeholder.html(item === 'year' ? tmp : (tmp + tmp));
					    self['ph' + item] = placeholder.children();
					}
				}
			});

			// ��������
			// �Ƿ��ж�׶�
			self.multiStage = $.isArray(to) ? to.length : false;
			// ����ʱ��
			self.endTime = self.multiStage ? to[0] : to;
			// ��ǰ�׶�
			self.currentStage = self.multiStage ? 1 : false;
			// ��ƫ�޸�ʱ����
			self.fixInterval = self.get('fixInterval') ? 60 : false;

			self.on('timeReady', function() {
				self._setEndDiff();
				// ʱ���Ƿ�׼����
				self.timeReady = true;
				if (self.get('autoStart')) {
					self._start();
				}
			});

			self._setServerDiff();
		},

		/**
		 * ��ʼ����ʱ
		 */
		_start: function() {
			this._interval();
			return this;
		},

		/**
		 * ���ⷽ�������ÿ�ʼʱ��
		 * �˷�����Ҫ�������ԣ���console��ֱ��ִ�У����ĵ�ǰʱ��
		 * @param {Date||String} date ��Ҫ���õ���ʱ��
		 */
		setStartTime: function(date) {
			var self = this,
				t;

			if (date.constructor === Date) {
				t = date;
			}else if(date.constructor === String){
				t = new Date(date);
			}else{
				return;
			}

			self.debugTime = t;
			self.stop()._setEndDiff()._start();
			return self;
		},

		/**
		 * ���ⷽ������ʼ����ʱ
		 */
		start: function() {
			var self = this;

			if (self.timeReady) {
				// ���ʱ���Ѿ�׼���ã�ֱ�ӿ�ʼ
				self._start();
			} else {
				// �����ʱ��׼�����ٿ�ʼ
				self.on('timeReady', function() {
					self._start();
				});
			}
			return self;
		},

		/**
		 * ���ⷽ������������ʱ
		 */
		stop: function() {
			var self = this,
				stopEventName = self.get('stopEventName');

			if (self.timer) {
				clearTimeout(self.timer);
				delete self.timer;
				if (self.multiStage && self.currentStage < self.multiStage) {
					// �ж�׶β��һ�û��ִ���꣬������һ������ʱ
					// �����˴ε���ʱ�����¼�
					self.trigger(stopEventName[self.currentStage - 1]);
					// ������һ��ʱ��
					self.endTime = self.get('to')[self.currentStage++];
					self._setEndDiff()._start();
				} else if (self.multiStage) {
					// �ж�׶β�����ִ����
					self.trigger(stopEventName[self.currentStage - 1]);
				} else {
					self.trigger(stopEventName);
				}
			}
			return self;
		},

		/**
		 * ���ÿ�ʼ��������ʱ���
		 */
		_setEndDiff: function() {
			var self = this,
				t = self.debugTime || new Date();	// ��ʼʱ�䣬����debug����debug����

			t.setTime(t.getTime() + self.serverDiff);
			self.diff = new Date(self.endTime - t);
			return self;
		},

		/**
		 * ���ÿͻ���ʱ���������ʱ��Ĳ�ֵ
		 */
		_setServerDiff: function() {
			var self = this;

			if(self.get('useServerTime') && Now){
				Now.now(function(time){
					self.serverDiff = time ? time - (new Date()).getTime() : 0;
					self.trigger('timeReady');
				});
			}else{
				self.serverDiff = 0;
				self.trigger('timeReady');
			}
			
			return self;
		},

		/**
		 * ��ʱ��
		 */
		_interval: function() {
			var self = this,
				diff = self.diff;

			if (diff < 0) {
				self.stop();
				return;
			}

			var diffMap = {
				year: diff.getFullYear() - 1970,
				month: diff.getUTCMonth(),
				day: diff.getUTCDate() - 1,
				hour: diff.getUTCHours(),
				minute: diff.getUTCMinutes(),
				second: diff.getUTCSeconds()
			};
			if (self.get('animate')) {
				$.each(TMAP, function(i, item) {
					var preVal = self[item] || 0,
						val = diffMap[item];
					if (self['ph' + item] && preVal !== val) {
						//animate
						self._animate(self['ph' + item], preVal, val);
						self[item] = val;
					}
				});
			} else {
				$.each(TMAP, function(i, item) {
					var val = diffMap[item];
					if (self['ph' + item] && self[item] !== val) {
						self['ph' + item].html((val < 10 && self.get('format').indexOf(FMAP[item]) > -1) ? '0' + val : val);
						self[item] = val;
					}
				});
			}

			// ����ʱ���
			self.diff = new Date(self.diff - 1000 * self.get('step'));
			// ��ƫ�޸�
			if (self.fixInterval && diffMap.second % self.fixInterval === 0) {
				self._setEndDiff();
			}

			// �������ü�ʱ�������ǵ�һЩ����ɱ������ӳ�����Ϊ990ms
			self.timer = setTimeout(function() {
				self._interval.call(self);
			}, 990 * self.get('step'));
		},

		/**
         * ����ִ�к���
         * @param {Object} dds dd����
         * @param {Object} pre ֮ǰ��ֵ
         * @param {Object} now ֮���ֵ
         */
        _animate: function(dls, pre, now){
            var self = this,
            	len = dls.length, 
            	i = 0, 
            	p, n;
            pre = _strFix(pre, len);
            now = _strFix(now, len);
            for (; i < len; i++) {
                p = pre.charAt(i);
                n = now.charAt(i);
                if (p !== n) {
                    var dl = $(dls[i]), di = dl.children(), dd = $('<dd>').addClass('num' + n);
                    dl.append(dd);
                    di.animate({
                        marginTop: '-' + di.height() + 'px'
                    }, 800, function(){
                        $(this).remove();
                    });
                }
            }
        }

	});

	return Timer;

	/**
     * �Բ��㳤�ȵ��ַ�������0
     * @param {Object} len
     */
    function _strFix(str, len){
        str = str + '';
        var i = len - str.length;
        while (i) {
            str = '0' + str;
            i--;
        }
        return str;
    }
});