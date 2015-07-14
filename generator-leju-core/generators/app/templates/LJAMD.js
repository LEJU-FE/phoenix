/**
 *@description 简单的AMD依赖关系
 *@version 1.0
 *@author tianxin@leju.com
 *@method require
 *@param {Array|String} [id] 引入的文件（文件组）的路径
 *@param {Function|null} [callback] 引入文件后的回调
 *@method define
 *@param {String} [id] 定义的文件（函数）id
 *@param {Array|null} [deps] 依赖关系,所依赖的文件
 *@param {Function} [factory] define定义的函数
 *@description 有全局参数ex.modules.name.exports来选择模块中的return值进行调用
 */
(function(_) {
	var modules = {}, //存储全部define信息
		exports = [], //存储define的依赖返回值
		exportsrequire = [], //存储require的文件的返回值
		baseUrl = '', 
		branchPath = {},
		script = document.getElementsByTagName('script');
	var ex = {
		define: function(id, deps, factory) {
			id = id;
			if (modules[id]) {
				throw "module " + id + " 模块已存在!";
			}
			if (arguments.length > 2) {
				modules[id] = {
					id: id,
					deps: deps,
					factory: factory,
					exports: ''
				};
			} else {
				factory = deps;
				modules[id] = {
					id: id,
					factory: factory
				};
				modules[id].exports = factory.call(window) || '';
			}	
		},
		require: function(id, callback) {
			if (Object.prototype.toString.call(id) === '[object Array]') {
				if (id.length > 1) {
					return makeRequire(id, callback);
				}
				id = id[0];
				loadScript(id, function(loadmodule) {
					if (!modules[loadmodule]) {
						throw "module " + loadmodule + " not found";
					}
					if (callback) {
						var module = build(modules[loadmodule], callback);
						return module;
					} else {
						if (modules[id].factory) {
							return build(modules[loadmodule]);
						}
						return modules[loadmodule].exports;
					}
				})
			}
		}
	};
	ex.require.config = {
		paths:{},
		baseUrl:''
	}
    //阻塞加载执行javascript
	function ajaxstop(url) {
		var XMLHttpReq;
		try {
			XMLHttpReq = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (E) {
			try {
				XMLHttpReq = new ActiveXObject("Microsoft.XMLHTTP"); 
			} catch (E) {
				XMLHttpReq = new XMLHttpRequest(); 
			}
		}
		XMLHttpReq.open("GET", url, false);  
	    XMLHttpReq.send(null);
	    var se = document.createElement('script');
	    se.type = 'text/javascript';
	    se.text = XMLHttpReq.responseText;
	    document.getElementsByTagName('HEAD').item(0).appendChild(se)
	}

	function each(obj, fn) {
		if (obj.length == undefined) {
			for (var i in obj)
				fn.call(obj[i], obj);
		} else {
			for (var i = 0, ol = obj.length; i < ol; i++) {
				if (fn.call(obj[i], obj) === false)
					break;
			}
		}
	}

	function loadScript(path, callback) {
		var def = path,
		callback = callback || function() {};
		if (def.match('.js')) {
			def = def.split('.js')[0];
			path = path.split('.js')[0];
		}
		var Head = document.getElementsByTagName('HEAD').item(0),
			Script = document.createElement('script'),
			done = document.dispatchEvent;
		Script.type = 'text/javascript';
		if (ex.require.config.baseUrl){
			Script.src = ex.require.config.baseUrl + (ex.require.config.paths[def]||path).split('.js')[0]+ '.js';}
		else
			Script.src = (ex.require.config.paths[def]||path).split('.js')[0] + '.js';
		Head.appendChild(Script);
		Script[done ? 'onload' : 'onreadystatechange'] = function() {
			if (done || /load|complete/i.test(Script.readyState)) {
				callback.call(window, def)
			}
		}
	}
	//解析依赖关系。**核心函数**
	function parseDeps(module, callback) {
		var deps = module['deps'],
			arr = deps.slice(0),
			cb = callback || function() {};
		(function recur(singlemodule) {
			loadScript(singlemodule, function(loadmodule) {
				if (modules[loadmodule]['deps']) {
					parseDeps(modules[loadmodule], function() {
						modules[loadmodule]['exports'] = modules[loadmodule].factory.call() || '';
						//TO DO:返回暂时没用，用遍历deps来确定参数
						exports.push(modules[loadmodule]['exports']);
						arr.length == 0?cb.call():recur(arr.shift());
					})
				} else arr.length == 0?cb.call():recur(arr.shift());
			})
		})(arr.shift())
		//返回函数return值供callback调用
		return exports;
	}
	//对require的解析
	function build(module, callback) {
		if(module){
            var depsList, existMod,
                factory = module['factory'],
                id = module['id'];
            if (module['deps']) {
                depsList = parseDeps(module, function() {
                    var tem = [];
                    for (var i = 0, len = module['deps'].length; i < len; i++) {
                        modules[module['deps'][i]]&&modules[module['deps'][i]]['exports'] ? tem.push(modules[module['deps'][i]]['exports']) : tem;
                    }
                    exportsrequire.push(module['exports'] = factory.apply(module, tem));
                    if (callback) {
                        callback.apply(module, exportsrequire);
                        ex.modules = modules;
                    }
                });
            }else callback?callback.call():true;
        }else callback?callback.call():true;
        return exportsrequire;
	}

	function makeRequire(ids, callback) {
		var arr = ids.slice(0),
			fn,
			factory = callback;
		(function recur(singlemodule) {
			loadScript(singlemodule, function(loadmodule) {
					build(modules[loadmodule], function() {
						if (arr.length == 0) {
							if (factory)
								factory.apply(window, exportsrequire)
						} else {
							recur(arr.shift());
						}
					})
				if (arr.length == 0) return;
			})
		})(arr.shift());
	}

	window.exmodules = modules;
	if (typeof module === "object" && typeof require === "function") {
		module.exports.require = ex.require;
		module.exports.define = ex.define;
	} else {
		_.require = ex.require;
		_.define = ex.define;
	}
	for (var i = 0, len = script.length; i < len; i++) {
		if (script[i].getAttribute('src').match('LJAMD') && script[i].getAttribute('data-main')) {
			ajaxstop(script[i].getAttribute('data-main'))
		}
	}
})(window);