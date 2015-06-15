define('LJajax', function() {
	LJ.ajax = (function() {
		var json2str = function(json) {
			var strArr = [];
			for (var i in json) {
				if (i == "method" || i == "timeout" || i == "async") continue;
				if (!((typeof json[i]).toLowerCase() == "function" || (typeof json[i]).toLowerCase() == "object")) {
					strArr.push(encodeURIComponent(i) + "=" + encodeURIComponent(json[i]));
				}
			}
			return strArr.join("&");
		};
		var creatAjaxRequest = function() {
			var xmlHttp = null;
			if (window.XMLHttpRequest) {
				xmlHttp = new XMLHttpRequest();
			} else {
				try {
					xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
				} catch (e) {
					try {
						xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
					} catch (e) {}
				}
			}
			return xmlHttp;
		};

		return function(options) {
			//例如LJ.ajax({url:'xxxx',method:'GET',data:{id:'a',name:'b'},completeListener:function() {alert(this.responsetext);}});
			//options.url                   请求地址
			//options.method                字符串 请求类型 默认为GET
			//options.data                  ajax参数对象
			//options.timeout               超时时间设置(毫秒),默认8000,超时后触发timeOutListener
			//options.loadListener          当readState为1时调用
			//options.loadedListener        当readState为2时调用
			//options.interaciveListener    当readState为3时调用
			//options.jsResponseListener     请求成功 并且响应的Content-Type为text/javascript 或 application/javascript 这个侦听器将用响应的js字符串作为第一个参数 执行必须用eval()
			//options.jsonResponseListener  请求成功 并且响应的Content-Type为application/json 这个侦听器将用响应的JSON对象作为第一个参数
			//options.xmlResponseListener   请求成功 并且响应的Content-Type为application/xml 或 application/xhtml+html 这个侦听器将用响应的XML DOM文档作为第一个参数
			//options.htmlResponseListener  请求成功 并且响应的Content-Type为text/html 这个侦听器将用响应的HTML 字符串作为第一个参数
			//options.completeListener      这个方法总是在成功响应的最后被调用 如果响应中没有适当的Content-Type头部信息 则执行此方法
			//options.errorListener         当响应状态值不是200也不是0时被调用 如是在不会提供响应代码系统（如硬盘驱动器本地文件系统）上运行XMLHttpRequest 那么状态始终为0，只有completeListener被调用
			//options.timeOutListener       当请求超时时被调用
			//options.type                  如果设置了type则会按照type指定的数据类型来解析返回值
			//                              text/javascript  对应jsResponseListener
			//                              application/json 对应jsonResponseListener
			//                              text/xml         对应xmlResponseListener
			//                              text/html        对应
			var timeIsOut = false,
				def = LJ.Deferred(),
				submitStr = '';
			var req = creatAjaxRequest();
			if (!req || !options.url) return false;
			options = options || {};
			options.method = options.method ? options.method.toUpperCase() : 'GET';
			options.send = options.send || null;
			options.timeout = options.timeout || 8000;

			var timerID = setTimeout(function() {
				if (req.readyState != 4) {
					timeIsOut = true;
					req.abort();
					clearTimeout(timerID);
				}
			}, options.timeout);

			if (!LJ.isEmptyObject(options.data)) {
				submitStr = json2str(options.data);
			}

			req.onreadystatechange = function() {
				switch (req.readyState) {
					case 1:
						if (options.loadListener) {
							options.loadListener.apply(req, arguments);
						}
						break;
					case 2:
						if (options.loadedListener) {
							options.loadedListener.apply(req, arguments);
						}
						break;
					case 3:
						if (options.ineractiveListener) {
							options.interaciveListener.apply(req, arguments);
						}
						break;
					case 4:
						var contentType = req.getResponseHeader('Content-Type');
						var mimeType = options.type || contentType.match(/\s*([^;]+)\s*(;|$)/i)[1];

						function switchtype() {
							switch (mimeType) {
								case 'json':
								case 'application/json':
									var json = JSON.parse(req.responseText);
									return json;
									break;
								case 'xml':
								case 'text/xml':
								case 'application/xml':
								case 'application/xhtml+xml':
									return req.responseXML;
									break;
								default:
									return req.responseText;
							}
						}
						try {
							if (!timeIsOut && req.status == 200) {
								if (!options.jsResponseListener && !options.jsResponseListener && !options.xmlResponseListener && !options.htmlResponseListener && !options.completeListener) {
									def.resolve(req, switchtype());
								}else{
									switch (mimeType) {
										case 'script':
										case 'text/javascript':
										case 'application/javascript':
											if (options.jsResponseListener) {
												options.jsResponseListener.call(
													req, req.responseText);
											}
											break;
										case 'json':
										case 'application/json':
											if (options.jsonResponseListener) {
												try {
													var json = JSON.parse(
														req.responseText
													);
												} catch (e) {
													var json = false;
												}
												options.jsonResponseListener.call(
													req, json);
											}
											break;
										case 'xml':
										case 'text/xml':
										case 'application/xml':
										case 'application/xhtml+xml':
											if (options.xmlResponseListener) {
												options.xmlResponseListener.call(
													req, req.responseXML);
											}
											break;
										case 'html':
										case 'text/html':
											if (options.htmlResponseListener) {
												options.htmlResponseListener.call(
													req, req.responseText);
											}
											break;
									}
								}
								if (options.completeListener) {
									options.completeListener.apply(req, arguments);
								}
							} else {
								if (timeIsOut) {
									if (!options.timeOutListener)
										def.reject(req, arguments);
									else
										options.timeOutListener.apply(req, arguments);
								} else if (!options.errorListener)
									def.reject(req, arguments);
								else if(options.errorListener)
									options.errorListener.apply(req, arguments);
								}
						} catch (e) {

						}
						break;
				}
			};
			var str = options.url + (options.url.indexOf("?") == -1 ? "?" : "&") + (options.method == "POST" ? "" : submitStr + "&noCache=" + +new Date);
			req.open(options.method, str, true);
			req.setRequestHeader('X-LJ-Ajax-Request', 'AjaxRequest');
			req.setRequestHeader('HTTP_X_REQUESTED_WITH', 'HTTP_X_REQUESTED_WITH');
			if (options.method == "POST") {
				req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
				req.send(submitStr);
			} else {
				req.send(null);
			}
			return def.promise();
		};
	})()
})