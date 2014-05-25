function initTinyMCE() {
    tinyMCE.init({
		// General options
		mode: "exact", 		//编辑器使用的数据源来自textarea
		elements: "description",
		theme: "advanced", 		//编辑器的基础功能配置为advanced
		skin: 'aliRTE', 			//编辑器皮肤aliRTE
		//以上三项请在没有必要时不要随意改动
		//plugins为编辑器加载的插件配置，删除plugins中的插件会自动删除相关的按钮，但是删除工具栏的按钮并不会删除相关功能
		//plugins中以ali开头的插件名为aliRTE特制插件，相关的配置项会在后面描述
		plugins: "contextmenu,aliwindow,inlinepopups,paste,table,aliCCBUImage,advlink,aliFilter,emotions,aliCount,aliGroup,aliViewAndCode,aliResize,aliTracelog,aliMultiLanguage,fullscreen",
        //plugins: "contextmenu,inlinepopups,paste,table,aliImage,advlink,emotions,fullscreen,aliFilter,aliCount,aliGroup,aliViewAndCode,aliResize,aliTracelog,aliMultiLanguage",
		//编辑器大小配置
		width: 535,
		height: 170, 

		// Theme options
		//编辑器工具栏配置，theme_advanced_buttons1代表工具栏第一行，theme_advanced_buttons2代表工具栏第二行
		//在工具栏中删除按钮并不会删除相关功能，譬如删除table按钮，在鼠标右键菜单中将仍然可以看到“插入编辑表格”的功能
		//按钮中出现的group按钮为下拉按钮组合，对因aliGroup插件，相关的配置请见49行
		theme_advanced_buttons1: "undo,fontselect,fontsizeselect,forecolor,backcolor,group,|,justifyleft,justifycenter,justifyright,|,group,group,|,emotions,link,table,image,fullscreen",
		theme_advanced_buttons2: "",
		theme_advanced_toolbar_location: "top", 			//工具栏设置在编辑器顶部
		theme_advanced_toolbar_align: "left", 			//工具栏中按钮对齐方式为左对齐
		theme_advanced_statusbar_location: "bottom", 	//状态栏设置在编辑器底部
		//编辑器文字大小自定义配置，默认为"1,2,3,4,5,6,7"
		//配置方法为“显示文案=大小”，如“一号=26pt;小一=24pt”
		//注意：为了保证在utf-8和gb2312等不同编码的页面中都可以正常显示汉字，这里的汉字都做了unicode编码，如：“一号”为“\u4E00\u53F7”
		theme_advanced_font_sizes: "\u4E00\u53F7=26pt;\u5C0F\u4E00=24pt;\u4E8C\u53F7=22pt;\u5C0F\u4E8C=18pt;\u4E09\u53F7=16pt;\u5C0F\u4E09=15pt;\u56DB\u53F7=14pt;\u5C0F\u56DB=12pt;\u4E94\u53F7=10pt;\u5C0F\u4E94=9pt;\u516D\u53F7=7.5pt;\u5C0F\u516D=6.5pt;\u4E03\u53F7=5.5pt;\u516B\u53F7=5pt",
		//编辑器文字字体自定义配置，默认为英文字体，因此在中文环境下，请务必配置此项
		//配置方法为“显示文案=字体”，如“宋体=simsun;黑体=simhei”
		//注意：为了保证在utf-8和gb2312等不同编码的页面中都可以正常显示汉字，这里的汉字都做了unicode编码，如：“宋体”为“\u5B8B\u4F53”
		theme_advanced_fonts: "\u5B8B\u4F53=simsun;\u9ED1\u4F53=simhei;\u6977\u4F53=\u6977\u4F53_GB2312;\u96B6\u4E66=\u96B6\u4E66;\u5E7C\u5706=\u5E7C\u5706;\u4EFF\u5B8B=\u4EFF\u5B8B_GB2312;\u5FAE\u8F6F\u96C5\u9ED1=\u5FAE\u8F6F\u96C5\u9ED1",
		//配置是否允许编辑器变化大小
		theme_advanced_resizing: true,

		//编辑器语言配置
		//简体中文：cn
		//繁体中文：zh
		//英文：en
		language: 'cn',

		//aliGroup Config
		//下拉组合按钮插件配置项
		//group_set为对象数组，每个对象对应一个组合按钮，数组的长度和工具栏按钮配置中的"group"数量必须相同
		//每个对象中icon为组合按钮显示的图标，buttons为功能按钮组合
		group_set: [
			{
				icon: '/themes/advanced/skins/aliRTE/img/icon-underline.gif',
				buttons: 'bold,italic,underline,strikethrough',
                tracelog: 'topmark,submark'
			},
			{
				icon: '/themes/advanced/skins/aliRTE/img/icon-bullist.gif',
				buttons: 'bullist,numlist',
                tracelog: 'topmark,submark'
			},
			{
				icon: '/themes/advanced/skins/aliRTE/img/icon-indent.gif',
				buttons: 'indent,outdent',
                tracelog: 'topmark,submark'
			}
		],

		//aliCount Config
		//编辑器字符数限制
		textTotal: 500,

		//aliResize config
		//编辑器大小变化配置，分别为最大高度，最小高度，步进高度
		resize_set: {
			maxHeight: 600,
			minHeight: 320,
			stepHeight: 70
		},

		//aliTracelog Config
		//编辑器被加载时发送的tracelog
		tracelog: 'blog_aliRTE',

		//i18n Rewrite Config
		//自定义文案配置，具体配置方案请参照custom_i18n.docx
		custom_i18n: {
			'cn.aliResize': {
				isLargest: '\u7F16\u8F91\u5668\u5DF2\u7ECF\u662F\u6700\u5927\u4E86',
				isSmallest: '\u7F16\u8F91\u5668\u5DF2\u7ECF\u662F\u6700\u5C0F\u4E86'
			},
			'en.advlink_dlg': {
				msginfo: "You can insert all links.",
				errorMsg: "URL permission denied"
			},
			'cn.aliimage': {
				validFailNotLogin: '\u60A8\u9700\u8981\u767B\u5F55\u624D\u53EF\u4EE5\u4E0A\u4F20\u56FE\u7247',
				validFailNormal: '\u62B1\u6B49\uFF0C\u670D\u52A1\u5668\u9519\u8BEF\uFF0C\u56FE\u7247\u4E0A\u4F20\u5931\u8D25\u3002',

				availableDomainsInfo: '\u53EA\u5141\u8BB8\u63D2\u5165\u4EE5\u4E0B\u57DF\u540D\u4E0B\u7684\u56FE\u7247\uFF08{#domain}\uFF09',
				validFailInvalidDomain: '\u56FE\u7247\u5730\u5740\u4E0D\u5408\u6CD5\uFF0C\u8BF7\u91CD\u65B0\u8F93\u5165'
			}
		},

		//table config
		//插入编辑表格配置项
		table_default_border: 1, 					//表格默认边框
		table_default_width: '100%', 				//表格默认宽度
		table_default_class: 'aliRTE-table', 	//表格默认className，没有必要请不要修改
		table_col_limit: 12, 						//表格最大列数
		table_row_limit: 128, 						//表格最大行数

		//link config
		//插入编辑链接配置项
		link_config: {
			allow_all: false, 						//是否允许所有外部链接
			is_ali_only: false, 						//是否只允许阿里巴巴旗下域名的链接
			white_list: [									//可使用的外部链接白名单
				'*.aliui.com', '*.aliued.com'
			]
		},

		//ali-image-insert config
		//插入编辑图片配置项
		aliimage_config: {
			/*allow_all: false, 						//是否允许所有外部图片链接
			is_ali_only: false, 						//是否只允许阿里巴巴旗下域名的图片链接
			white_list: [									//允许添加的外部图片链接白名单
				'*.aliui.com', '*.aliued.com'
			],
			compressSize: 3 * 1024 * 1024, 		//可上传的图片大小限制
			sizeLimitEach: 200 * 1024, 			//压缩后图片大小限制
			fileTypes: '', 							//图片类型限制
			fileCountLimit: 10, 						//一次可上传的图片张数限制
			
			upload_response_checker: function(response) {
				alert('[自定义上传检查函数]--数据:' + response);
				return true;
			},
			uploadUrl: 'http://110.75.194.130/upload/blog/upload.html', 							//在没有flash的情况下使用HTTP上传方式的代理页面地址
			checkUrl: 'http://blog.1688.com/misc/arandaHttpCheck.htm', 	//上传图片token安全验证的代理页面地址
			imgPrefix: '$alibabaImageServer/blog/upload/', //图片上传后的url前缀
			fileFieldName: 'imgFile', //post请求中，文件数据的字段名称
			uploadVars_flash: { test: '~~~' },
			uploadVars_html: { jsmode: true, proxyurl: 'html-uploaded-ICBU.htm' },
			allowUpload: true,
			allowAblum: false,
			allowWeb: true
			*/
		allowUpload: false,
		allow_all: false,
		is_ali_only: true,
		white_list: ['*.aliui.com', '*.aliued.com'],
		compressSize: 3 * 1024 * 1024, //插入本地图片-需要进行压缩的图片大小
		sizeLimitEach: 200 * 1024, 	//插入本地图片-压缩后运行上传的图片大小
		fileTypes: '', 			//插入本地图片-上传图片的类型
		fileCountLimit: 10, 			//插入本地图片-一次上传图片的数量
		//上传地址
		uploadUrl: 'http://110.75.194.130/upload/blog/upload.html',
		//验证地址
		checkUrl: 'http://blog.1688.com/misc/arandaHttpCheck.htm',
		imgPrefix: '$alibabaImageServer/blog/upload/'
		//图片前缀
		},

		//Example content CSS (should be your site CSS)
		//在编辑器中引用外部CSS，以便达到所见即所得，让编辑器内的显示效果和发布后的现实效果保持一致
		content_css: "",

		// Replace values for the template plugin
		template_replace_values: {
			username: "Some User",
			staffid: "991234"
		}
	});	
}