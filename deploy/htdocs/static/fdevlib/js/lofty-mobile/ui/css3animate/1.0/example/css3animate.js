jQuery(function() {
	(function(jq, $) {
		jq('body').on('click', 'button', function(e) {
			var targetId = $(e.target).attr('id');

			displayCodeBlock(targetId);

			switch (targetId) {
				// translate
				case 'translateLeft':
					$('#transElem').css3Animate({
						x: -50,
						time: 1000,
						complete: function() {
							resetElem();
						}
					});
					break;
				case 'translateRight':
					$('#transElem').css3Animate({
						x: 50,
						time: 1000,
						complete: function() {
							resetElem();
						}
					});
					break;
				case 'translateUp':
					$('#transElem').css3Animate({
						y: -50,
						time: 1000,
						complete: function() {
							resetElem();
						}
					});
					break;
				case 'translateDown':
					$('#transElem').css3Animate({
						y: 50,
						time: 1000,
						complete: function() {
							resetElem();
						}
					});
					break;

				// scale
				case 'scaleXBigger':
					$('#transElem').css3Animate({
						scaleX: 2,
						origin: '50% 50%',
						time: 1000,
						complete: function() {
							resetElem();
						}
					});
					break;
				case 'scaleXSmaller':
					$('#transElem').css3Animate({
						scaleX: 0.5,
						origin: '50% 50%',
						time: 1000,
						complete: function() {
							resetElem();
						}
					});
					break;
				case 'scaleYBigger':
					$('#transElem').css3Animate({
						scaleY: 2,
						origin: '50% 50%',
						time: 1000,
						complete: function() {
							resetElem();
						}
					});
					break;
				case 'scaleYSmaller':
					$('#transElem').css3Animate({
						scaleY: 0.5,
						origin: '50% 50%',
						time: 1000,
						complete: function() {
							resetElem();
						}
					});
					break;

				// rotate
				case 'rotateX':
					$('#transElem').css3Animate({
						rotateX: '60deg',
						origin: '50% 50%',
						time: 1000,
						complete: function() {
							resetElem();
						}
					});
					break;
				case 'rotateX90':
					$('#transElem').css3Animate({
						rotateX: '90deg',
						origin: '50% 50%',
						time: 1000,
						complete: function() {
							resetElem();
						}
					});
					break;
				case 'rotateY':
					$('#transElem').css3Animate({
						rotateY: '60deg',
						origin: '50% 50%',
						time: 1000,
						complete: function() {
							resetElem();
						}
					});
					break;
				case 'rotateY90':
					$('#transElem').css3Animate({
						rotateY: '90deg',
						origin: '50% 50%',
						time: 1000,
						complete: function() {
							resetElem();
						}
					});
					break;
				case 'rotateZ':
					$('#transElem').css3Animate({
						rotateZ: '60deg',
						origin: '50% 50%',
						time: 1000,
						complete: function() {
							resetElem();
						}
					});
					break;
				// skew
				case 'skewX':
					$('#transElem').css3Animate({
						skewX: '60deg',
						origin: '50% 50%',
						time: 1000,
						complete: function() {
							resetElem();
						}
					});
					break;
				case 'skewY':
					$('#transElem').css3Animate({
						skewY: '60deg',
						origin: '50% 50%',
						time: 1000,
						complete: function() {
							resetElem();
						}
					});
					break;
			}
		});

		// 重置元素的状态（位置，大小，旋转等）
		function resetElem() {
			$('#transElem').css3Animate({x: 0, y: 0, rotateX: '0deg', rotateY: '0deg', scale: 1});
		}

		// 显示相应的代码块
		function displayCodeBlock(targetId) {
			var $preElem = jq('#' + targetId + 'Pre');

			$('pre').hide();

			if ($preElem.length) {
				$preElem.show();
			}
		}
	})(jQuery, af);
});