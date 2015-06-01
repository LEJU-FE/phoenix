/**
 *@description jQuery 插件库，整合一些jquery插件用
 *@author tianxin@leju.com
 */
(function($, _) {
	//基类，提供封装插件的一些方法相当于model层
	$.ajaxSetup({
		cache: true
	});
	var yr = (function() {
		//私有属性
		var url = window.location.href,
			BASE_URL = url.substring(0, url.indexOf('/', 7) + 1);
		return {
			extend: function(o) {
				var extended = o.extended || function() {};
				$.extend(this, o);
				if (extended) extended(this);
			},
			BASE_URL: BASE_URL,
			LOAD_ARR: [],
			FLAG_ARR: {},
			/**
			 *@description 开辟子命名空间，支持开辟多级空间
			 */
			namespace: function(name) {
				if (typeof name != 'string') {
					return false;
				}
				name = name.split('.');
				var that = this,
					key;
				for (var i = 0, len = name.length; i < len, key = name[i]; i++) {
					that = (that[key] = that[key] || {});
				}
				return that;
			},
			/**
			 *@description 动态加载js方法，可加载多个js
			 *@param src {string||array} 需要动态加载的js
			 *@param callback {function} 加载完成的回调
			 */
			load: function(src, callback) {
				var baseobj = {},
					fsobj = {},
					arr = [];

				function load(s) {
					yr.LOAD_ARR.push(arr[s]);
					if (arr.length == 0) {
						var k = setInterval(function() {
							var fl = true;
							for (var t = 0; t < src.length; t++) {
								if (!yr.FLAG_ARR[t]) {
									fl = false;
								}
							}
							if (fl) {
								clearInterval(k)
								callback.call()
							}
						}, 100)
					} else if (s == arr.length - 1) {
						$.getScript(arr[s]).done(function() {
							yr.FLAG_ARR[s] = 1
							if (callback)
								callback.call()
						});
					} else {
						$.getScript(arr[s]).done(function() {
							yr.FLAG_ARR[s] = 1
							s++;
							load(s);
						}).progress(function() {
							yr.LOAD_ARR.pop();
							load(s)
						})
					}
				}
				if (Object.prototype.toString.call(src) == '[object String]') {
					for (var i = 0; i < yr.LOAD_ARR.length; i++) {
						if (yr.LOAD_ARR[i] == src) {
							var k = setInterval(function() {
								if (yr.FLAG_ARR[src]) {
									clearInterval(k)
									callback.call()
								}
							}, 100)
							return;
						}
					}
					yr.LOAD_ARR.push(src);
					$.getScript(src).done(function() {
						yr.FLAG_ARR[src] = 1
						callback.call()
					});
				} else if (Object.prototype.toString.call(src) == '[object Array]') {
					for (var i = 0; i < yr.LOAD_ARR.length; i++) {
						baseobj[yr.LOAD_ARR[i]] = i + 1;
						fsobj[yr.LOAD_ARR[i]] = 1;
					}
					for (var j = 0; j < src.length; j++) {
						if (!baseobj[src[j]]) {
							baseobj[src[j]] = i + 1;
							i++;
						}
					}
					for (var k in baseobj) {
						if (!fsobj[k]) {
							arr.push(k);
						}
					}
					load(0);
				}
			},
			/**
			 *@description 提供reg匹配方法，表单中会用到
			 */
			reg: {
				rUrl: function(url) {
					var regExp = /(?:(?:http[s]?|ftp):\/\/)?[^\/\.]+?(\.)?[^\.\\\/]+?\.\w{2,}.*$/i;
					if (url.match(regExp)) {
						return true;
					} else {
						return false;
					}
				},
				rWeibo: function(url) {
					var regExp = /^((https|http):\/\/)?([\w-]+\.)?weibo\.com\/?[u\/]+?[^\/\.]+?(\.)?[^\.\\\/]+.*$/i;
					if (url.match(regExp)) {
						return true;
					} else {
						return false;
					}
				},
				rEmail: function(email) {
					var regExp = /^([a-zA-Z0-9_\-\.\+])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
					if (!regExp.exec(email)) {
						return false;
					}
					var Table = new Array("\"", "\'", "<", ">", "~", "\\", ";", ",", "?", "/"),
						I, J;
					for (I = 0; I < email.length; I++) {
						for (J = 0; J < Table.length; J++) {
							if (email.charAt(I) == Table[J]) {
								return false;
							}
						}
					}
					return true;
				},
				rNumber: function(words) {
					var patrn = /^\d*$/;
					return patrn.test(words);
				},
				rPhoneNumber: function(words) {
					var patrn = /^\+{0,1}(\d+\-{0,}\d+)+$/g;
					if (!patrn.test(words) || words.length != 11) {
						return false;
					} else {
						return true;
					}
				},
				rQQ: function(words) {
					var patrn = /^\d{5,11}$/g;
					if (!patrn.test(words) || words.length > 11 || words.length < 5) {
						return false;
					} else {
						return true;
					}
				},
				rEnglish: function(words) {
					var patrn = /(\?|\>|\<|\(|\&|\!|\#|[\u4E00-\u9FBF])+/g;
					if (patrn.test(words) || words.length < 5) {
						return false;
					} else {
						return true;
					}
				},
				getLength: function(str, shortUrl) {
					str = str + '';
					return str.length;
					if (true == shortUrl) {
						// 一个URL当作十个字长度计算
						return Math.ceil(str.replace(/((news|telnet|nttp|file|http|ftp|https):\/\/){1}(([-A-Za-z0-9]+(\.[-A-Za-z0-9]+)*(\.[-A-Za-z]{2,5}))|([0-9]{1,3}(\.[0-9]{1,3}){3}))(:[0-9]*)?(\/[-A-Za-z0-9_\$\.\+\!\*\(\),;:@&=\?\/~\#\%]*)*/ig, 'sxooxxooxxsxooxxooxx')
							.replace(/^\s+|\s+$/ig, '').replace(/[^\x00-\xff]/ig, 'xx').length / 2);
					} else {
						return Math.ceil(str.replace(/^\s+|\s+$/ig, '').replace(/[^\x00-\xff]/ig, 'xx').length / 2);
					}
				}
			}
		};
	}());
	//view 相关东西beginning,内容中绑定了界面元素
	yr.namespace('view');
	yr.view.formHanderConfig = {
		commitstate: 'state', //ajax返回的提交状态接口
		ajaxstate: 'state', //ajax 验证返回的提交状态接口
		ajaxtype: 'post' //ajax 验证的提交method，默认为post
	};
	/**
		 *@description form提交控制函数，
		 class：submit是提交，
		 reset是重置，
		 back返回上一个页面
		 on 值不能为空
		 *@param id {string} 绑定的form的id
	     *@param {function} ajax完成后的回调
		 *@param {function} 提交之前的回调
		 *@author tianxin@leju.com
		*/
	yr.view.formHandler = function(id) {
		var that = $(id),
			commit = that.find('.submit'),
			reset = that.find('.reset'),
			back = that.find('.back'),
			input = that.find('input'),
			action = that.attr('action'),
			re = /(rNumber)|(rUrl)|(rWeibo)|(rEmail)|(rPhoneNumber)|(rQQ)|(rEnglish)/ig,
			option = arguments,
			method = $(that).attr('method') || 'post',
			o = {};

		function doCheckErrortext(obj, str) {
			if (obj.next('.error_text').length) {
				obj.next('.error_text').html(str);
			} else {
				that.find('.error_text').html(str);
			}
		}

		function doCheckNull() {
			var text = that.find(".on"),
				length = text.length;
			while (--length >= 0) {
				if (text.eq(length).val() == '') {
					text.eq(length).addClass('error');
					doCheckErrortext(text.eq(length), '此项不能为空！');
				} else {
					text.eq(length).removeClass('error');
					doCheckErrortext(text.eq(length), '');
				}
			}
		}

		function doCheckReg(_this, cla) {
			//正则验证
			if (yr.reg[cla](String(_this.val()))) {
				doCheckErrortext(_this, '');
				_this.removeClass('error');
			} else {
				doCheckErrortext(_this, '您书写的格式不符合规范！');
				_this.addClass('error');
			}
		}

		function ajaxConform(obj) {
			var url = obj.attr('url_check'),
				d = obj.attr('data').split(' '),
				o = {},
				dstr = [];
			for (var i = 0; i < d.length; i++) {
				dstr[i] = d[i].split(':');
				if (dstr[i][1]) {
					o[dstr[i][0]] = dstr[i][1];
				} else {
					o[dstr[i][0]] = obj.val();
				}
			}
			$.ajax({
				url: url,
				type: yr.view.formHanderConfig.ajaxtype,
				dataType: "json",
				data: o,
				success: function(result) {
					if (typeof result != 'object')
						result = $.parseJSON(result);
					if (!result[yr.view.formHanderConfig.ajaxstate]) {
						obj.addClass('error');
						var str = result.msg;
						doCheckErrortext(obj, str);
					} else {
						obj.removeClass('error');
						doCheckErrortext(obj, '');
					}
				}
			});
		}

		$.merge(input, that.find('select'));
		$.merge(input, that.find('textarea'));
		if (input) {
			input.each(function() {
				if ($(this).attr('class')) {
					var cla = String($(this).attr('class').match(re));
					if (cla != 'null') {
						$(this).on('blur', function() {
							if ($(this).val())
								doCheckReg($(this), cla);
							else {
								doCheckErrortext($(this), ' ');
							}
						});
					}
				}
			});
		}
		if (that.find('[url_check]')) {
			that.find('[url_check]').each(function() {
				$(this).on('blur', function() {
					ajaxConform($(this));
				});
			})
		}

		function checkpassword() {
			if (that.find('.password1').length) {
				if (that.find('.password1').val() != that.find('.password2').val()) {
					that.find('.password2').addClass('error');
					that.find('.password2').siblings('.error_text').html('两次输入的密码不一致')
				} else {
					that.find('.password2').removeClass('error');
					that.find('.password2').siblings('.error_text').html('')
				}
			}
		}
		back.on('click', function(e) {
			e.preventDefault();
			window.history.back();
		});
		commit.on('click', function(e) {
			e.preventDefault();
			doCheckNull();
			checkpassword()
			if (option[2]) {
				option[2].call(that)
			}
			if (!that.find('.error').length) {
				if (that.hasClass('Ajax')) {
					// for (var i = 0; i < input.length; i++) {
					// 	o[input.eq(i).attr('name')] = input.eq(i).val();
					// }
					o = that.serialize();
					o = o + '&submit=js';
					$.ajax({
						type: method,
						url: action,
						data: o,
						success: function(opt) {
							if (typeof opt != 'object')
								opt = $.parseJSON(opt);
							if (!opt[yr.view.formHanderConfig.commitstate]) {
								alert(opt.result.err);
							} else {
								if (option[1]) {
									option[1].call(that, opt);
								}
							}
						}
					});
				} else {
					that.submit();
				}
			} else {
				return false;
			}
		});
		reset.on('click', function(e) {
			e.preventDefault();
			that.find("input[type='text']").each(function() {
				$(this).val('');
			});
		});
	}; //formhander end
	yr.view.autocomplete = function(obj) {
			var oldValue;

			function sear_kerlog(event, index) {
				event = event ? event : window.event;
				var keyCode = event.keyCode;
				mouse = false;
				if (keyCode == 38) {
					if (keyindex > 0) {
						keyindex--;
						setKeyvalue(keyindex);
					} else {
						keyindex = length;
						setKeyvalue(keyindex);
					}
				}
				if (keyCode == 40) {
					if (keyindex < index) {
						keyindex++;
						setKeyvalue(keyindex);
					} else {
						keyindex = 0;
						setKeyvalue(keyindex);
					}
				}
				if (keyCode == 13) {
					if ($('.mouseover').length)
						window.location.href = $('.mouseover').attr('href')
					else {
						$('#mainsearch').trigger('click');
					}
				}
			}

			function setKeyvalue(index) {
				var index2 = index - 1;
				if (index != 0) {
					$('.d_searchInner li a').removeClass('mouseover').eq(index2).addClass('mouseover');
					obj.val($('.d_searchInner li:eq(' + index2 + ') a').text());
				} else {
					$('.d_searchInner li a').removeClass('mouseover');
					obj.val(oldValue);
				}
				mouse = true;
			}

			function ulhoverEvent() {
				$('.d_searchInner li a').each(function(index, element) {

					$(this).bind('mouseover', function() {
						$('.d_searchInner li a').removeClass('mouseover');
						$(this).addClass('mouseover');
						keyindex = index + 1;
					})
					$(this).bind('mouseout', function() {
						$(this).removeClass('mouseover');
					})

				});
			}
			obj.keydown(function(event) {
				event = event ? event : window.event;
				var keyCode2 = event.keyCode;
				if ($(this).val().length >= 128) {
					alert('您输入的字符太长了！');
					$(this).val('')
					return false;
				}
				if (keyCode2 != 38 && keyCode2 != 40 && keyCode2 != 13) {
					return;
				} else {
					if ($('ul.d_searchInner')) {
						sear_kerlog(event, $('ul.d_searchInner li').length);
					}
				}
			});
			obj.on('keyup', function(event) {
				event = event ? event : window.event;
				event.stopPropagation();
				var keyCode = event.keyCode;
				var txt = $(this).val();
				if (keyCode != 38 && keyCode != 40) {
					if (txt != '') {
						oldValue = obj.val();
						$('.d_searchInner li').removeClass('mouseover');
						keyindex = 0;
						$.ajax({
							type: "POST",
							url: "../json/autocomplete.json",
							data: {
								txt: txt
							},
							dataType: "json",
							success: function(data) {
								var li = data.result.list || [];
								if (li.length) {
									if ($('.d_searchInner').length) {
										$('.d_searchInner').remove();
									}
									var temp;
									if (data.state == 1) {
										temp = '<ul class="d_searchInner">';
										for (var i = 0; i < li.length; i++) {
											var str = eval("/" + txt + "/ig");
											temp += '<li><a href="' + li[i].link + '">' + li[i].keytxt.replace(str, "<strong>" + txt + "</strong>") + '</a></li>'
										}
										temp += '</ul>';
										obj.parent().after(temp);
										ulhoverEvent();
									} else {
										return;
									}
								}
							}
						});
					} else {
						$('.d_searchInner').remove()
					}
				}
			})
		}
		/**
		 * @description 封装swfupload.js
		 */
	yr.view.imgUpload = function(onupload, afterupload) {
		yr.load(['http://cdn0.ljimg.com/plugins/swfupload/swfupload.js', 'http://cdn0.ljimg.com/plugins/swfupload/swfupload.queue.js'], function() {
			var imgOption = {
				flash_url: "http://cdn0.ljimg.com/plugins/swfupload/swfupload.swf",
				pkey: window.src_img_pkey || "98f17f9a3e912a69892eb1a399f1977e", // pkey
				mkey: window.src_img_mkey || "6550fc9da9146f2105f803ef549ffe59", // mkey
				previewSize: "_S98X98", // 预览图尺寸
				img_pre_url: "http://src.house.sina.com.cn/imp/imp/deal/", // 图片地址前缀
				upload_url: "http://src.house.sina.com.cn/resource/resource/upload/", // 图片上传接口地址
				file_size_limit: "4000", // 图片最大上传尺寸
				file_upload_limit: 256, // 全部上传数量限制
				file_types: "*.jpg;*.gif;*.png"
			};
			//单图上传          
			pluginInit($(obj));
			/**
			 *  @description 初始化控件
			 *  @param {Object} $input jquery对象 plugin对应的input
			 */
			function pluginInit($input) {
				initSwfupload();
				/**
				 *  @description 初始化swfupload
				 */
				function initSwfupload() {
						var swfuSettings = {
							flash_url: imgOption.flash_url,
							upload_url: imgOption.upload_url,
							post_params: {
								"pkey": imgOption.pkey,
								"mkey": imgOption.mkey
							},
							file_size_limit: imgOption.file_size_limit,
							file_types: imgOption.file_types,
							file_upload_limit: imgOption.file_upload_limit,
							file_queue_limit: 1,

							//button
							button_image_url: 'http://cdn0.ljimg.com/plugins/swfupload/add.png',
							button_placeholder_id: 'sinButtonHole',
							button_width: o.width || 126,
							button_height: o.height || 122,
							button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,
							button_cursor: SWFUpload.CURSOR.HAND,

							//handler
							file_dialog_complete_handler: fileDialogComplete, //选择完图片后执行                 
							upload_success_handler: uploadSuccess, //上传成功后执行
							upload_error_handler: uploadError //上传错误处理		

						};
						new SWFUpload(swfuSettings);
					}
					/**
					 *  @description 选择图片后关闭时执行。
					 *  @param {Number} numFilesSelected 所选图片数量
					 *  @param {Number} numFilesQueued 队列中图片数量
					 */
				function fileDialogComplete(numFilesSelected, numFilesQueued) {
						if (numFilesQueued === 1) {
							this.startUpload();
							onupload.call(this)

						}
					}
					/**
					 *  @description 获取接口返回数据
					 *  @param {Object} file 上传图片对象
					 *  @param {Object} serverData 服务器返回数据
					 */
				function uploadSuccess(file, serverData) {
						try {
							afterupload.call(this, serverData);

						} catch (e) {
							uploadError(file);
						}
					}
					/**
					 *  @description 统一错误处理
					 *  @param {Object} file 上传图片对象
					 *  @param {Number} errorCode 错误代码
					 *  @param {String} message 错误描述
					 */
				function uploadError(file, errorCode, message) {
					$info.html('上传失败, 请重新上传');
				}
			}
		})
	}
	yr.view.selectbox = function(obj) {
		var that = $(obj),
			ulall = (function() {
				var s = [];
				obj.each(function() {
					s.push($(this).find('ul'))
				})
				return s;
			})();
		that.each(function() {
			var _that = $(this),
				ul = _that.find('ul'),
				li = _that.find('ul li');
			_that.on('click', function(e) {
				e.stopPropagation()
				li = _that.find('ul li');
				li.each(function() {
					$(this).on('mouseenter', function() {
						$(this).css('background', '#efefef')
					}).on('mouseleave', function() {
						$(this).css('background', 'white')
					})
				})
				for (var i = 0; i < ulall.length; i++) {
					if (ulall[i][0] != ul[0]) {
						if (ulall[i].css('display') != 'none') {
							ulall[i].css({
								display: 'none'
							})
						}
					}
				}
				if (ul.css('display') != 'none') {
					ul.css({
						display: 'none'
					})
				} else {
					ul.css({
						display: 'block'
					})
				}
			});
			_that.on('click', 'li', function(e) {
				e.stopPropagation();
				var li = _that.find('ul li');
				var index = li.index(this)
				ul.css({
					display: 'none'
				});
				_that.find('.select').html($(this).text())
				_that.find('select option').each(function() {
					$(this).removeAttr('selected')
				})
				_that.find('select option').eq(index).attr('selected', 'selected')
			})
		})
	}
	yr.view.textNum = function(obj, val) {
			var that = obj;
			that.on('keyup', function(e) {
				var num = that.val();
				var len = yr.reg.getLength(num, '');
				if (len <= val - 1) {
					$('.describenum').html(val - len);
				} else if (len > val - 1) {
					$('.describenum').html(0);
					that[0].readOnly = true;
					//if (e.keyCode == 8) {
					e.preventDefault();
					that.removeClass('txa-no');
					that[0].readOnly = false;
					var s = $(this).val(),
						str = '',
						base_len = 0;
					for (var i = 0; i <= base_len; i++) {
						if (yr.reg.getLength(s[i], '') == 1) {
							base_len += 2;
						} else if (yr.reg.getLength(s[i], '') == 2) {
							base_len += 1;
						} else {
							base_len = base_len / 2;
						}
					}
					for (var j = 0; j <= base_len - 2; j++) {
						str += s[j];
					}
					that.val(str)
						//}
				}
			});
		}
		//art api 详解 http://blog.csdn.net/techbirds_bao/article/details/8531083
	yr.view.artdialog = function(opt, url, callback) {
		if (-[1, ]) {
			yr.load(['http://cdn0.ljimg.com/plugins/artDialog/artDialog.js', 'http://cdn0.ljimg.com/plugins/artDialog/iframeTools.js'], function() {
				art.dialog.opt = {
					lock: true,
					fixed: true,
					okVal: '确定',
					cancelVal: '取消',
					opacity: 0.3,
					zIndex: 10000,
					resize: false,
					esc: true,
					title: '',
					css: false
				};
				$.extend(art.dialog.opt, opt);
				if (!url) {
					art.dialog(art.dialog.opt);
				} else {
					art.dialog.open(url, art.dialog.opt)
				}
				if (callback)
					return callback.call(window.art);
			})
		} else {
			function Ieart() {

			}
			Ieart.prototype = {
				method: function() {
					var shadow = '<div class="shadow" style="width: 100%; height: 100%; position: fixed; z-index: 1987; top: 0px; left: 0px; overflow: hidden;"><div style="height: 100%; opacity: 0.3;filter:alpha(opacity=50); background: rgb(0, 0, 0);"></div></div>';
					var content = '<div class="aui_state_focus aui_state_lock" style="position: fixed; left: 332px; top: 0px; width: auto; z-index: 1988;overflow-x:hidden">';
					if (opt.content) {
						content += opt.content + '</div>';
					} else if (url) {
						content += '<iframe src="' + url + '" frameborder="0" allowtransparency="true" style="margin-top:40px;width: ' + opt.width + '; height: ' + opt.height + '; border: 0px none;"></iframe></div>';
					}
					$('body').append(shadow)
					$('body').prepend(content)
					var left = (document.documentElement.clientWidth - $('.aui_state_focus')[0].offsetWidth) / 2;
					$('.aui_state_focus').css('left', left + 'px')
					return content;
				}
			}
			var arts = new Ieart(),
				con = arts.method();
			if (callback)
				callback.call(this)
		}
	}
	_.yr = yr;
})(jQuery, window);