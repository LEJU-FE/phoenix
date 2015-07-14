define('LJPoseidon/js/app/LJselector',function(){
	/**
 	 *@descripttion:可用选择器：#id,.class,tag,[attr]
	*/
	LJ.$=function(str) {
		var tempo = document,
			tempopt,
			regEncoding = "(?:\\\\.|[\\w\-?\\d*]|[^\\x00-\\xa0])+",
			whitespace = "[\\x20\\t\\r\\n\\f]",
			attr = "(?:\\[(.*)\\])?",
			selector,//内部私有，暂时无法扩展fn方法
			RE = {
				"ID": new RegExp("^#(" + regEncoding + ")" + attr),
				"CLASS": new RegExp("^\\.(" + regEncoding + ")" + attr),
				"TAG": new RegExp("^(" + regEncoding.replace("w", "w*") + ")" + attr)
			},
			order = ['ID', 'CLASS', 'TAG'],
			FIND = {
				ID: function(obj, name) {
					if (arguments[2])
						obj = doAttr(obj, arguments[2]);
					if (obj && !doChklen(obj)) {
						return (function getElementsByClass(searchId, node) {
							var els = node.getElementsByTagName('*'),
								elsLen = els.length,
								i;
							for (i = 0; i < elsLen; i++) {
								if (els[i].getAttribute('id') == searchId) {
									var idElements = els[i];
									break;
								}
							}
							return idElements;
						})(name, obj);
					} else if (obj) {
						LJ.each(obj, function() {
							var that = this;
							return (function getElementsByClass(searchId, node) {
								var els = node.getElementsByTagName('*'),
									elsLen = els.length,
									i;
								for (i = 0; i < elsLen; i++) {
									if (that.getAttribute('id') == searchId) {
										var idElements = that;
										break;
									}
								}
								return idElements;
							})(name, obj[i]);
						})


					} else {
						return document.getElementById(name);
					}
				},
				CLASS: function(obj, name) {
					if (obj) {
						return getElementsByClassName(obj, name, arguments[2]);
					} else {
						return getElementsByClassName(document, name, arguments[2]);
					}
				},
				TAG: function(obj, name) {
					obj = obj || document;
					var temarr = [],attrName = arguments[2],
						arrattr = [];//存储含有attr的数组
					function checkre(arr,obj){//去除数组中的重复
						if(arr.length==0){
							return true
						}
						for(var i=0;i<arr.length;i++){
							if(arr[i]==obj);
								return false;
						}
						return true;
					}
					if (obj && !doChklen(obj)) {
						var temo = obj.getElementsByTagName(name)
						if (arguments[2]){
							temo = doAttr(temo, arguments[2]);
						}
						if(temo)
							return temo.length == 1 ? temo[0] : temo;
					} else if (obj) {
						LJ.each(obj, function() {
							var temo = this.getElementsByTagName(name);
							if (temo) {
								for (var o=0;o<temo.length;o++) {
									if (typeof temo[o] == 'object') {
										if (attrName){
											var t = doAttr(temo[o], attrName);
											if(t&&checkre(arrattr,t)){
												arrattr.push(t)	
											}
										}
									}
								}
							}
						})
						return arrattr.length == 1 ? arrattr[0] : arrattr;
					} else {
						var temo = obj.getElementsByTagName(name);
						return temo.length == 1 ? temo[0] : temo;
					}
				}
			};
		//main selector
		selector = function(str) {
			return new selector.fn.init(str)
		};
		selector.fn = selector.prototype = {
			init: function(str) {
				if (str) {
					if (Object.prototype.toString.call(str) == '[object Object]') {
						if (str.length&&str.splice) {
							return str;
						} else {
							this[0] = str;
						}
					} else if (Object.prototype.toString.call(str) != '[object String]') {
						if (!str.length) {
							this[0] = str;
						} else if (str.length == 1) {
							this[0] = str[0];
						} else {
							for (var i = 0; i < str.length; i++) {
								this[i] = str[i]
							}
						}
					} else {
						var temobj = jselemSelected(str); //jselemSelected is the method deal with string
						if (temobj.length > 1) {
							for (var i = 0; i < temobj.length; i++) {
								this[i] = temobj[i];
							}
						} else if (temobj){
							this[0] = temobj;
							var i = 1;
						} else{
							this[0] = temobj;
						}
					}
				}
				this.length = i || 1;
				this.context = document;
			},
			splice: [].splice,
			/**
			 *@description 返回LJ.$对象
			 *@param {number} num 索引
			 */
			eq: function(num) {
				var that = this;
				return LJ.$(that[num]);
			},
			/**
			 *@description 返回元素的索引
			 *@param {String or Object or undefined} elem 元素
			 */
			//如果不给.index()方法传递参数，那么返回值就是这个对象集合中第一个元素相对于其同辈元素的位置。
			//如果参数是一组DOM元素或者LJ对象，那么返回值就是传递的元素相对于原先集合的位置。
			//如果参数是一个选择器，那么返回值就是原先元素相对于选择器匹配元素中的位置。如果找不到匹配的元素，则返回-1。
			//事例:
			//LJ.$('li').index(document.getElementById('bar')); //1，传递一个DOM对象，返回这个对象在原先集合中的索引位置
			//LJ.$('li').index(LJ.$('#bar')); //1，传递一个LJ对象
			//LJ.$('#bar').index('li'); //1，传递一个选择器，返回#bar在所有li中的做引位置
			//LJ.$('#bar').index(); //1，不传递参数，返回这个元素在同辈中的索引位置。  
			index : function(elem){
				if(!elem || typeof elem === 'string'){
					return LJ.inArray(this[0],elem ? LJ.$(elem) : this.parent().children());
				}

				return LJ.inArray(/html/.test(LJ.type(elem)) ? elem : elem[0] , this)
			},
			/**
			 *@description 内部方法过滤多余标签。eg:<script><link><meta>
			 *@return 过滤后的LJ.$对象
			 */
			_rejection: function() {
				var that = this,
					r = [];
				for (var i = 0, len = that.length; i < len; i++) {
					if (that[i].nodeName&&!that[i].nodeName.match(/script|meta|title|link/ig)) {
						r.push(that[i]);
					}
				}
				return LJ.$(r);
			},
			/**
			 *@description 下一个元素
			 */
			next: function() {
				var node = this[0];
				if (node.nextSibling.nodeType == 3) {
					node = node.nextSibling.nextSibling;
				} else {
					node = node.nextSibling;
				}
				return LJ.$(node);
			},
			/**
			 *@description 上一个元素
			 */
			prev: function() {
				var node = this[0];
				if (node.previousSibling.nodeType == 3) {//html5 previousElementsSiblings
					node = node.previousSibling.previousSibling;
				} else {
					node = node.previousSibling;
				}
				return LJ.$(node);
			},
			/**
			 *@description 相邻元素
			 */
			siblings: function() {
				var r = [],
					that = this[0],
					n = that,
					k = that;
				for (; k; k = k.previousSibling) {
					if (k.nodeType === 1 && k != this[0]) {
						r.push(k)
					}
				}
				for (; n; n = n.nextSibling) {
					if (n.nodeType === 1 && n != this[0]) {
						r.push(n)
					}
				}
				return LJ.$(r)._rejection();
			},
			children: function() {
				var r = [],
					that = this[0],
					chidren = that.childNodes||[];
				if(chidren.length){
					for (var i = 0, len = chidren.length; i < len; i++) {
						if (chidren[i].nodeType === 1) {
							r.push(chidren[i])
						}
					}
					if(r.length)
						return LJ.$(r)._rejection();
					else{
						return new Array();
					}
				}else{
					return new Array()
				}
			},
			parent: function(str) {
				var that = this[0],
					arr = [];
				if(!arguments[0]){
					var parent = that.parentNode;
					return LJ.$(parent)._rejection();
				}else{
					function dofind(obj){
						var that = obj;
						arr.push(that);
						if(that.parentNode){
							dofind(that.parentNode)
						}else{
							return arr;
						}
					}
					dofind(that);
					var ar = arr.slice(),
						finalElem;
					if(arr.length>=2){
						ar.shift();
						(function doparent(){
							var temobj = LJ.$(jselemSelected(str,ar.shift()));
							for(var i = 0 ; i<temobj.length;i++){
								for(var j = 0 ; j<arr.length;j++){
									if(temobj[i]==arr[j]){
										finalElem = arr[j]
									}
								}
							}
							if(ar.length&&!finalElem){
								arguments.callee()
							}else{
								return;
							}
						})()
						return LJ.$(finalElem)
					}else{
						return LJ.$(arr)
					}
				}
			},
			find: function(str){
				var arr = [];
				function dofind(obj){//递归遍历HTMLnode
					var that = obj;
					LJ.each(that.children(),function(){
						arr.push(this);
						if(LJ.$(this).children().length){
							dofind(LJ.$(this))
						}
					})
				}
				dofind(this);
				if(!arguments[0])
					return LJ.$(arr)._rejection();
				else{
					var temobj = LJ.$(jselemSelected(str,this[0]));
					if(temobj.length==1){
						for(var i = 0;i< arr.length;i++){
							if(arr[i]==temobj[0]){
								return LJ.$(temobj[0])._rejection()
							}
						}
					}else if(temobj.length==0){
						return new Array();
					}else{
						var ar=[];
						for(var i = 0;i<temobj.length;i++){
							for(var j = 0 ;j<arr.length;j++){
								if(temobj[i]==arr[j]){
									ar.push(arr[j])
								}
							}
						}
						return LJ.$(ar)._rejection()
					}
				}
			},
			bind: function(type, fn) {
				LJ.each(this, function() {
					var that = this;
					if (window.addEventListener) {
						that.addEventListener(type, fn, false);
					} else if (window.attachEvent) {
						that['e' + type + fn] = fn;
						that[type + fn] = function() {
							that['e' + type + fn](window.event);
						}
						that.attachEvent('on' + type, that[type + fn]);
					}
				})
			},
			on: function(type, elem, fn) {
				this.bind(type, function(e) {
					e=event||e;
					var target = e.target||e.srcElement;
					var that = LJ.$(elem);
					LJ.each(that, function() {
						if(this==target)
							fn.call(LJ.$(target))
						else {
							for(var i in LJ.$(this).children()){
								if (LJ.$(this).children()[i] == target){
									fn.call(LJ.$(target));
									break;
								}
							}
						}
					})
				});
			},
			trigger: function(type) {
				var kind = '';
				if (type.match(/abort|blur|change|error|focus|load|reset|resize|scroll|select|submit|unload/ig)) {
					kind = 'HTMLEvents';
				} else if (type.match(/DOMActivate|DOMFocusIn|DOMFocusOut|keydown|keypress|keyup/ig)) {
					kind = 'UIEevents';
				} else if (type.match(/click|mousedown|mousemove|mouseout|mouseover|mouseup/ig)) {
					kind = 'MouseEvents';
				}
				try {
					var evObj = document.createEvent(kind);
					evObj.initEvent(type, true, false);
					this[0].dispatchEvent(evObj);
				} catch (e) {
					this[0].fireEvent('on' + type);
				}
			},
			/**
			 *@description 获取元素内部的文本
			*/
			text: function() {
				var node,
					ret = "",
					i = 0,
					that = this[0],
					nodeType = that.nodeType;
				if (!nodeType) {
					for (;(node = that[i]); i++) {
						ret += LJ.$(node).text();
					}
				} else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
					if (typeof that.textContent === "string") {
						return LJ.trim(that.textContent);
					} else {
						for (that = that.firstChild; that; that = that.nextSibling) {
							ret += LJ.$(that).text();
						}
					}
				} else if (nodeType === 3 || nodeType === 4) {
					return LJ.trim(that.nodeValue);
				}
				return LJ.trim(ret);
			},
			//@param {String or HTMLElement} 支持HTML元素和DOM元素
			//用法事例 : LJ.$("#a").append("<p>1111</p>") or LJ.$("#a").append(document.createElement("p")),支持script标签
			//注意:只能给一个元素绑定append方法
			//prepend,brefore,after方法与其同理
			append : function(){
				return domManip(this,arguments,function(elem) {
                    if (this.nodeType === 1){
                        this.appendChild(elem);	
                    }
                });
			},
			prepend : function(){
				return domManip(this,arguments,function(elem) {
                    if (this.nodeType === 1){
                        this.insertBefore(elem,this.firstChild);
                    }
                });
			},
			after : function(){
				return domManip(this,arguments,function(elem) {	
                    this.parentNode.insertBefore(elem,this.nextSibling);
                });
			},
			before : function(){
				return domManip(this,arguments,function(elem) {	
                    this.parentNode.insertBefore(elem,this);
                });
			},
			//@param {String} classN 类名
			//用法事例 : LJ.$("#a").hasClass("active") =》 true or false
			hasClass : function(classN){
                if(LJ.type(classN) === 'string'){
                    if (this[0].classList) {
                        return this[0].classList.contains(classN);
                    }else {
                        return new RegExp('(\\s|^)'+classN+'(\\s|$)').test(this[0].className)
                    }
                }
            },
            //@param {String and Array} classN 类名 可以是数组，同时添加两个类
			//用法事例 : LJ.$("#a").addClass("active") 或者 LJ.$("#a").addClass(["active","state"])
            addClass : function(classN){
            	var that = this;
            	LJ.forEach(this,function(index,item){
	                if(LJ.type(classN) === 'string' && !item.className.match(classN)){
	                    typeof item.classList === 'undefined' ? item.className += ' ' + classN : item.classList.add(classN)
	                }else{
	                	LJ.forEach(classN,function(num,val){
	                        that.eq(num).addClass.call(that.eq(num),val,classN);
	                    })
	                }
            	})
            	return this;
            },
            //@param {String} classN 类名 可以是数组，同时删除两个类
			//用法事例 : LJ.$("#a").removeClass("active") 或者 LJ.$("#a").removeClass(["active","state"])
            removeClass : function(classN){
            	var that = this;
            	LJ.forEach(this,function(index,item){
	                if(LJ.type(classN) === 'string' && item.className.match(classN)){
	                    typeof item.classList === 'undefined' ? item.className = item.className.replace(new RegExp('(^|\\b)' + classN.split(' ').join('|') + '(\\b|$)', 'gi'), ' ') : item.classList.remove(classN);
	                }else{
	                	LJ.forEach(classN,function(num,val){
	                        that.eq(num).removeClass.call(that.eq(num),val,classN);
	                    })
	                }
            	})
            	return this;
            },
            //@param {String and Object} property 属性名 可以是对象同时添加多个样式
            //@param {String} value 属性值
			//用法事例 : LJ.$("#a").css("width") =》"100px" 或者
			// LJ.$("#a").css({"width":"100px","height":"100px"})
			// 或者 LJ.$("#a").css("width","100px")
			css : function(property,value){
				switch(arguments.length){
                    case 1:
                    	if(typeof arguments[0] === 'object'){
                    		LJ.forEach(this,function(index,item){
                    			for(var attr in property){
	                                if (property.hasOwnProperty(attr)){
	                                    if(attr === 'opacity' && LJ.isIE()){
	                                        item.style.filter = 'alpha(opacity=' + parseInt(property[attr] * 100)+')'
	                                    }
	                                    item.style[attr] = property[attr]
	                                }
	                            }
                    		})
                        }else{
                        	var _this = this[0]
                        	if(_this.style[property]){
	                            return _this.style[property]
	                        }else if(_this.currentStyle){
	                            property = property.replace(/-(\w?)/,function(){
	                                return arguments[1].toUpperCase()
	                            });
	                            return _this.currentStyle[property]
	                        }else if(document.defaultView && document.defaultView.getComputedStyle){
	                            property = property.replace(/([A-Z])/g,'-$1').toLowerCase();
	                            return document.defaultView.getComputedStyle(_this,null).getPropertyValue(property)
	                        }else if(property === 'opacity'){
	                            var filter = _this.currentStyle["filter"];
	                            value = /opacity/.test(filter) ? filter.match(/opacity=(\d+)/i)[1] / 100 : 1;
	                            return value;
	                        }else{
	                            return null;
	                        }
                        }
                    break;
                    case 2:
                        LJ.forEach(this,function(index,item){
							value = property === 'opacity' ? parseInt(value) : value;
							if(property === 'opacity' && LJ.isIE()){
								item.style.filter = 'alpha(opacity=' + value * 100 + ')'
							}
							item.style[property] = value;
                        })
                    break;
                }
			},
			//@param {Object} props 可以添加多个动画样式
            //@param {Number} duration 动画时间
            //@param {String} easing 运动方式 可用的参数有"linear","easeIn","easeOut","easeInOut"
            //@param {Function} fn 回调函数
            //事例
            /*LJ.$("#box").animate({
            	"left" : "-200px"
            },500,"linear",function(){
            })*/
			//另可以用LJ.$("#box").getAttribute('data-animateRamaining')的值是否为0或1(1表示动画正在进行)的方法来判断当前元素是否处于动画中
			animate : function(props,duration,easing,fn){
				var _this = this;
                var animation = function(props,duration,easing,fn) {
                    this.elem = _this[0];
                    this.props = props;
                    this.duration = duration && typeof duration === 'number' ? duration : 1000;
                    if(easing && typeof easing === "string"){
                        switch(easing) {
                            case 'linear' :
                            this.easing =  function(t, b, c, d) {
                                return t * c / d + b;
                            };
                            break;
                            case 'easeIn' :
                            this.easing =  function(t, b, c, d) {
                                return c * (t /= d) * t + b;
                            };
                            break;
                            case 'easeOut' :
                            this.easing =  function(t, b, c, d) {
                                return - c * (t /= d) * (t - 2) + b;
                            };
                            break;
                            case 'easeInOut' :
                            this.easing =  function(t, b, c, d) {
                                if ((t /= d / 2) < 1){
                                    return c / 2 * t * t + b;
                                }
                                return - c / 2 * ((--t) * (t - 2) - 1) + b;
                            };
                            break;
                            default :
                            this.easing =  function(t, b, c, d) {
                                return t * c / d + b;
                            };
                            break;
                        }
                    }
                    this.fn = fn && typeof fn === 'function' ? fn : function(){};
                    this.pushQueue.call(this,this.props,this.duration,this.easing);
                }
                animation.prototype = {
                    init: function(props, duration,easing){
                        this.timer = null;
                        this.isRunning = false;
                        this.getStyle = {};
                        this.curframe = 0;
                        this.frames = Math.ceil(this.duration * 50 / 1000);
                        for (var prop in this.props) {
                            this.getStyle[prop] = {
                                curStyle: parseFloat(_this.css(prop)),
                                propStyle: parseFloat(this.props[prop])
                            };
                        }
                        this.start.call(this);
                    },
                    start: function() {
                        if (!this.isRunning && this.hasLength()) {
                            this.queue.shift().call(this)
                        }
                    },
                    startRun: function(callback) {
                        var that = this;
                        this.isRunning = true;
                        this.elem.setAttribute("data-animateRamaining",this.queue.length + 1);
                        this.timer && this.stopRun();
                        this.timer = setInterval(function() {
                            if (that.end()){
                                that.stopRun();
                                that.isRunning = false;
                                if(that.queue.length <= 1){
                                    that.elem.removeAttribute('data-animateRamaining');
                                    that.fn.call(that.elem);
                                }
                                callback && callback.call(that);
                                return;
                            };
                            that.curframe++;
                            that.renderCss.call(that);
                        },20);
                    },
                    stopRun: function() {
                        if (this.timer) {
                            clearInterval(this.timer);
                            this.timer = null;
                        }
                    },
                    pushQueue: function(props,duration,easing) {
                        this.queue = [];
                        var that = this;
                        this.queue.push(function() {
                            that.init.call(that, props, duration, easing);
                            that.startRun.call(that,that.start);
                        });
                        this.start.call(this);
                    },
                    renderCss: function() {
                        var resultVal;
                        for (var prop in this.getStyle) {
                            resultVal = this.easing(this.curframe, this.getStyle[prop]['curStyle'], this.getStyle[prop]['propStyle'] - this.getStyle[prop]['curStyle'], this.frames).toFixed(2);
							_this.css(prop,resultVal + 'px');
                        }
                    },
                    end: function() {
                        return this.curframe >= this.frames;
                    },
                    hasLength: function() {
                        return this.queue.length > 0;
                    },
                }
                return new animation(props,duration,easing,fn);
			}
		}
		selector.fn.init.prototype = selector.fn;
		return selector(str);

		function jselemSelected(str) {
			str = LJ.trim(str).split(' ') || 'window';

			for (var i = 0, tempj = arguments[1]||''; i < str.length; i++) {
				if (i < str.length - 1) {
					tempj = doFind(tempj, str[i]);
				} else if (i == str.length - 1) {
					return doFind(tempj, str[i]);
				}
			}
		}

		function getElementsByClassName(node, classname) {
			function getClass(searchClass, node) {
				if (node == null)
					node = document;
				var classElements = [],
					els = node.getElementsByTagName('*'),
					elsLen = els.length,
					pattern = new RegExp('(^|\\s)' + searchClass + '(\\s|$)'),
					k, j;
				for (k = 0, j = 0; k < elsLen; k++) {
					if (pattern.test(els[k].className)&&els[k].nodeType==1) {
						classElements[j] = els[k];
						j++;
					}
				}
				if (arguments[2])
					classElements = doAttr(classElements, arguments[2]);
				return classElements.length == 1 ? classElements[0] : classElements;
			}
			if (node == document) {
				if (node.getElementsByClassName) {
					var tempcla = node.getElementsByClassName(classname);
					if (arguments[2])
						tempcla = doAttr(tempcla, arguments[2]);
					return tempcla.length == 1 ? tempcla[0] : tempcla;
				} else {
					return getClass(classname, node, arguments[2]);
				}
			} else {
				if (!node.length) {
					if (node.getElementsByClassName) {
						var tempcla = node.getElementsByClassName(classname);
						if (arguments[2])
							tempcla = doAttr(tempcla, arguments[2]);
						return tempcla.length == 1 ? tempcla[0] : tempcla;
					} else {
						return getClass(classname, node, arguments[2]);
					}
				} else {
					for (var i = 0; i < node.length; i++) {
						if (node[i].getElementsByClassName) {
							var tempcla = node.getElementsByClassName(classname);
							if (arguments[2])
								tempcla = doAttr(tempcla, arguments[2]);
							return tempcla.length == 1 ? tempcla[0] : tempcla;
						} else {
							return getClass(classname, node[i], arguments[2]);
						}
					}
				}
			}
		}

		function doFind(obj, st) { //main function about HTMLElements target
			var arr = [],
				match,
				obj = obj || '';
			for (var i = 0, len = order.length; i < len; i++) {
				if (match = RE[order[i]].exec(st)) {
					return FIND[order[i]](obj, match[1], match[2]);
				}
			}
		}

		function doAttr(obj, attr) {
			var temarr = [];
			if (obj && !doChklen(obj)) {
				if (obj.getAttribute(attr)!=null) {
					return obj;
				}
			} else if (obj) {
				for (var i = 0; i < obj.length; i++) {
					if (obj[i].getAttribute(attr) != null) {
						temarr.push(obj[i]);
					}
				}
				return temarr.length == 1 ? temarr[0] : temarr;
			}
		}

		function doChklen(obj) {
			if (obj.length > 1)
				return true;
			return false;
		}

		function domManip(context,target,callback) {
			var scripts,
			hasScripts,
			fragment,
			childLen,
			code,
			first,
			nextNode,
			newNode,
			arrTarget = [];
			while(target.length--){
				if(LJ.type(target[target.length]) !== 'function'){
					arrTarget.unshift(target[target.length]);
				}
			}
			fragment = buildFragment(arrTarget, context[0].ownerDocument);
			childLen = fragment.children.length;
			while(childLen--){
				first = fragment.children[childLen].firstChild;
				if (first){
					nextNode = fragment.children[childLen+1];
					if(first.nodeName.toLowerCase() === 'script'){
						if(first.src && !first.textContent){
							var scriptNode = document.createElement("script");
								scriptNode.type = "text/javascript";
								scriptNode.src = first.src;
							fragment.removeChild(fragment.children[childLen]);
							fragment.insertBefore(scriptNode,nextNode);
						}else{
							scripts = disableScript(first);
							restoreScript(scripts);
							code = scripts.textContent.replace(/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g, "");
							eval(code);
						}
					}
					if(!first.src){
						newNode = first.cloneNode(true);
						fragment.removeChild(fragment.children[childLen]);
						fragment.insertBefore(newNode,nextNode);
					}	
				}
			}
			callback.call(context[0],fragment);
		}

		function buildFragment(elems, context){
			var fragment = context.createDocumentFragment(),
				nodes = [],
				temScript,
				elem,
				i = 0,
				len = elems.length,
				str = '';
			for ( ; i < len; i++) {
				elem = elems[i];
				if(LJ.type(elem) === 'string'){
					var temScript = context.createElement("div");
					temScript.innerHTML = elem;
					nodes.push(temScript);	
				}else if(/html/.test(LJ.type(elem))){
					elem.nodeType ? nodes.push(elem) : nodes.push(elem[0]);
				}else if(LJ.type(elem) === 'object'){
					nodes.push(elem[0]);
				}else if(!/<|&#?\w+;/.test(elem)){
					nodes.push(context.createTextNode(elem));
				}
			}
			i = 0;
			while ((elem = nodes[i++])) {
				fragment.appendChild(elem)
			}
			return fragment;
		}

		function disableScript(elem) {
			elem.type = (elem.getAttribute("type") !== null) + "/" + elem.type;
			return elem;
		}

		function restoreScript(elem) {
			elem.setAttribute("type","text/javascript");
			return elem;
		}
	}
})
