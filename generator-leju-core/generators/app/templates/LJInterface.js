define('LJPoseidon/js/app/LJInterface',function(){
	var defFace = {
		/**
		@author <a href="https://github.com/xtx1130">tianxin@leju.com</a> 
		@description:日历插件相关接口
		@param {String} dateFormatStyle 日期格式
		@param {String} beginDate 开始时间
		@param {String} enddate 结束时间
		@param {Num} lang 中英文
		*/
		calender:{
			dateFormatStyle:'yyyy-MM-dd',
			beginDate:'2010-01-01',
			enddate:'2020-01-01',
			lang:1
		},
	/**
		@author wenjing
		@description:倒计时(数字)插件相关接口
		@param {String} date 倒计时结束时间
		@param {String} divname 展示倒计时节点id
		@param {String} str 倒计时前展示文字
		*/
		countdown : {
			abolish:"on",
			date:"2015-7-25-18-35-00",
			divname:"divdown1",
			str:"哈哈"
		},
		/**
		@author wenjing
		@description:倒计时(图片)插件相关接口
		@param {String} date 倒计时结束时间
		*/
		countdownpic : {
			abolish:"on",
			date:"2015-7-25-18-35-00"
		},
		/**
		  js waterFlow plugin
		  @name waterFlow.js
		  @author darren
		  @version 1.0.0
		  @date 06/15/2015
		  @category javascript plugin
		  @param {String} gridWrap 父级id
		  @param {String} gridCls 数据块儿的class,
		  @param {String} colWidth 数据块儿宽度,
		  @param {Number} gutWidth 数据块儿的水平间距
		  @param {Number} gutHeight 数据块儿的垂直间距
		  @param {Number} wrapGut 据页面两边的距离
		  @param {Object} data 数据块儿中的数据
		  @param {String} bufferPix 滚动时, 窗口底部到瀑布流最小高度列的距离 > bufferPixel时, 自动加载新数据
		  @param {Boolean} resizeAble 改变浏览器大小时数据是否重排
		  @param {Number} resizeDelay
		*/
		waterfall : {
			gridWrap : '#waterFlow_wrap',
	        gridCls : '.waterFlow_grid',
	        colWidth : 230,
	        gutWidth : 15,
	        gutHeight :15,
	        wrapGut : 10,
	        data : {
                source : '',
                alt : '',
                description : ''
            },
	        bufferPix : '100',
	        resizeAble : true,
	        resizeDelay : 500
		},
		/**
		  @author 					zhangxu9@leju.com
		  @name   					zhover.js
		  @description              鼠标悬停插件
		  @param {String} opacity   遮罩层的透明度，取值范围为0-1
		  @param {String} duration  每个 li元素 运动的快慢
		  @param {String} easing    运动的方式 减速、减速、匀速
		  @param {Object} text      每个 li元素 的浮层文本及链接
		  @param {String} pattern   动画的风格
		  @param {String} fSize     标题文字大小
		*/
		zhover: {
			opacity: '0.7',
			duration: '500',
			easing: 'ease-in',
			text: [																	
					{'title': '', 'content': '', 'href': 'javascript:;'}
					,{'title': '', 'content': '', 'href': 'javascript:;'}
					,{'title': '', 'content': '', 'href': 'javascript:;'}
					,{'title': '', 'content': '', 'href': 'javascript:;'}
					,{'title': '', 'content': '', 'href': 'javascript:;'}
					,{'title': '', 'content': '', 'href': 'javascript:;'}
					,{'title': '', 'content': '', 'href': 'javascript:;'}
					,{'title': '', 'content': '', 'href': 'javascript:;'}
				],
			pattern: 'sildeTop',
			fSize: '2'
		},
		/**
		 @description:回到顶部插件相关接口
		 @param {String} millisecond 毫秒
		 @param {String} speed 匀速
		 @param {String} id  id
		 */
		goTop: {
			'millisecond': 10,
			'speed': 1.1,
			'id': 'goTopBtn'
		},
		/**
		 @description:在线客服插件相关接口
		 @param {String} id id
		 @param {String} millisecond 设置毫秒的大小值
		 @param {String} height  设置高度
		 @param {String} time 设置定时器的大小值
		 @param {String} millisecond 设置毫秒的大小值
		 @param {String} class  类名
		 @param {String} num QQ个数
		 @param {String} qq 数组的号码
		 @param {String} name  属性值(可以设宽高等属性)
		 */
		onLine: {
			'id': 'cs_online',
			'millisecond': 1,
			'height': 150,
			'time': 1,
			'class': 'qq_num',
			'num': 5,
			'qq': ['147430218', '147430218', '147430218', '147430218', '147430218'],
			'name': 'width'
		},
		/**
		  @author   				  zhangxu9@leju.com
		  @name   					  zstar.js
		  @description                星星评分插件
		  @param {Number}   count     星星的个数
		  @param {Number}   width     星星的尺寸
		  @param {Boolean}  score     是否在星星后面显示分数
		  @param {Boolean}  val       是否创建隐藏文本框
		  @param {String}   pattern   星星的风格
		  @param {Function} func      选择分数之后的回调函数，参数为分值
		*/
		zstar: {
			count: 6,
			width: 35,
			score: false,
			val: true,
			pattern: 'blue',
			func: function(s){
				console.log(s);
			}
		},
		tab:{means:'',
			ids:'#tabpannel',
			contents:[{
			name:'xtx0',
			tree:[{
				name:'xtx00',
				tree:[{
					name:'xtx000'
					}]
				},{
				name:'xtx01',
				tree:[{
					name:'xtx010'
					}]
				}]
			},{
			name:'xtx1',
			tree:[{
				name:'xtx10',
				tree:[{
					name:'xtx100'
					}]
				},{
				name:'xtx11',
				tree:[{
					name:'xtx110'
					}]
				}]
			}]
		}
	};
	LJ.interface = defFace;
	return defFace
})