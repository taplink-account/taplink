function initVars() {
	$mx.touch = {
		isXS: screen.width < 768 || $mx(window).width() < 768,
		isSM: (screen.width >= 768) && (screen.width < 992),
		isApplication: $mx.isset(window.navigator.standalone) && window.navigator.standalone,
		isDevice: false,
		isTouch: 'ontouchstart' in window,
		initScroll: function() {},
		isIOS: navigator.userAgent.match(/iphone|ipod|ipad/gi) != null
	}
}

initVars();

$mx(window).on('resize', initVars);
/*
	todo:	disable-pointer-events
			main-block-stack
			main-block
			$.layout.hash
			$.touch.isXS
			modal-autofocus
			$.layout.breadcrumb
			$.layout.current_path
			
	todo:	Правая панель
			Открытие модуля
			
	todo:	script[type="text/modal"]
*/

var scrollTop = 0;
var isXS = screen.width < 768 || $mx(window).width() < 768;

+function (d, w) { "use strict";
	$mx.router = {
		open: function(remote, method, size, title, hash, is_history_replace) {
			if (!method) method = 'module';
			if (!size) size = 'flat';
			if (!title) title = '...';
			
			remote = remote.replace('layout-refresh=yes', '').replace('?&', '?');
			
			//if (size == 'flat') {
				$mx(document.body).addClass('disable-pointer-events');
			//}
			

		    var l = /* ($mx.isset($.layout))?$.layout.current_path: */document.location.href;

		    if (remote.substring(0, 1) != '/') remote = l.substring(0, (remote[0] == '?')?((l.lastIndexOf('?') != -1)?l.lastIndexOf('?'):l.length):(l.lastIndexOf('/')+1)) + remote;

			var is_replace = (method != undefined && method == 'replace');
			var fp = null;
			var fc = null;
			var fw = null;
			var li = null;
			
			//alert(method+' - '+size);
			

			if (method == 'form') {
				var f = $mx('<div class="modal '+(isXS?'downup':'zoom')+'"><div class="modal-dialog modal-'+size+'"><div class="modal-content"><div class="waiting waiting-blue" style="min-height:200px"></div></div></div></div>').appendTo(document.body);
				fc = f.find('.modal-content');
				fw = f.find('.modal-body');
				var hash = document.location.hash;
				f.modal({keyboard: false, backdrop: 'static'});
				f.on('hidden.bs.modal', function() {
					if (isXS) {
						$mx(document.body).removeClass('lock-modal');//.css('margin-top', 0);
						$mx(window).scrollTop(scrollTop);
					}
					$mx(document.body).trigger('modal.hide');
					f.remove();
/*
					$.ajaxIgnore = true;
					if (hash) document.location.hash = 'none';
					$.ajaxIgnore = false;
*/
				});
				
				$mx(document.body).trigger('modal.show');
				
				if (hash && typeof hash != 'string') hash = hash.data('modal-hash');
/*
				
				if (hash) {
					$.ajaxIgnore = true;
					document.location.hash = hash;
					$.ajaxIgnore = false;
				}
*/

				if (isXS) {
					scrollTop = $mx(window).scrollTop();
					$mx(document.body).addClass('lock-modal');//.css('margin-top', -scrollTop+'px');
				}
// 				$(document.body).on('touchstart', function(o) { });
// 				alert(0);
				
			} else if (method == 'fullscreen' || method == 'fullscreen-iframe') {
				var f = $mx('<div class="modal downup"><div class="modal-dialog modal-fullscreen"><div class="modal-content waiting waiting-blue"></div></div></div>').appendTo(document.body);
				fc = fw = f.find('.modal-content');
				f.modal({keyboard: false, backdrop: 'static'}).on('hidden.bs.modal', function() {
					$mx(document.body).trigger('modal.hide');
					f.remove();
				});
				$mx(document.body).trigger('modal.show');
			} else if (method == 'module') {
				fp = fc = $mx($.app.body);
				fw = $mx('.main-block-stack.active > div:first-child');
				li = $mx('mx-header > ul li:last-child');
				$mx($.app.body).removeClass('open-menu');
			} else if (method != 'ajax') {
				if (is_replace) {
					fp = $mx('.main-block-stack.active');
				} else {
					fp = $mx('<div class="main-block-stack mx-scroll-content" data-scroll-y="true"><div></div></div>').appendTo('.main-block');
				}

				fw = fc = fp.children(':first-child');

				if (!is_replace) {
					li = $.layout.breadcrumb.push(title, hash);
				} else {
					li = $mx('mx-header > ul li:last-child');
// 					$.layout.breadcrumb.replace(title, hash);
				}

				if (isXS && !is_replace) {
					fp.addClass('pre-out-in').prev().addClass('pre-in-out');
					li.addClass('pre-out-in').prev().addClass('pre-in-out');
					
					setTimeout(function() {
						fp.addClass('in').prev().addClass('in');
						li.addClass('in').prev().addClass('in');
					}, 0);
					
					fp.addClass('active').prev().removeClass('active');
					
					setTimeout(function() {
						fp.removeClass('pre-out-in in').prev().removeClass('pre-in-out in active');
						li.removeClass('pre-out-in in').prev().removeClass('pre-in-out in');

					}, 400);
				}	
			}
			
			var tm = setTimeout(function() {
				if (isXS) {
					if (title && title != '...') $mx('mx-header > ul li:last-child').removeClass('has-subtitle').html(title);
					fw.addClass('waiting waiting-blue').html('');
				}
			}, 310);
			
			var url = remote;
			if (method == 'module') url += ((url.indexOf('?') == -1)?'?':'&')+'layout-module=yes';
			
			/*
			var fixTapDelay = false;
			var fixTapLoading = true;
			
			if ($.touch.isTouch) {
				fixTapDelay = true;
				setTimeout(function() {
					if (!fixTapLoading) $(document.body).removeClass('disable-pointer-events');
					fixTapDelay = false;
				}, 400);
			}
			*/
			
			if (method == 'fullscreen-iframe') {
				fc.html('');
				var iframe = $mx('<iframe frameborder="0"></iframe>').appendTo(fc);
				iframe.attr('src', url);
				$mx(iframe).on('load', function() {
					fc.removeClass('waiting');
					$mx(document.body).removeClass('disable-pointer-events');
				});
			} else {
				console.log(url);
				$mx.get(url).then(function(s) {
					s = s.data;
					clearTimeout(tm);
	
					if (method != 'push' && method != 'form' && method != 'ajax') {
						if (is_history_replace) {
							history.replaceState({}, document.title, remote);	
						} else {
							history.pushState({}, document.title, remote);	
						}
						
						if ($mx.isset($.layout)) $.layout.setCurrentPath();
					}


	
					$mx(window).trigger('hit', {'remote': remote, 'title': document.title});
	
					if (!$mx.form.parseResult(s)) {
						
						if (isXS) fw.removeClass('waiting waiting-blue');
						
						setTimeout(function() {
							fc.html(''); //Когда вне setTimeout — мерцает
							fc.html(s);
							
							fc.find(':focus').focus();
							
							fc.toggleClass('mx-scroll-content-has-disabled', fc.find('.mx-scroll-content-disable').length > 0);
							
							if (method != 'form') {
								if (!isXS && !is_replace) {
									fp.addClass('active').prev().removeClass('active');
								}
		
								fc.find('form').each(function() {
									if ($mx(this).attr('action') == undefined) $mx(this).attr('action', remote);
								});
								
/*
								fc.find('[data-dismiss="modal"]').click(function() {
									if ($mx.isset($.layout)) $.layout.breadcrumb.pop();
								});
*/
								
								var title = $mx('mx-breadcrumb', fc).data('title');
								if (!title) title = fc.find('.modal-title').html();
								
								li.text(title);
		
// 								if ($mx.isset($.layout.breadcrumb)) $.layout.breadcrumb.executeBreadcrumb(fc);						
							}
							
							//$.touch.initScroll();
							
							if (!isXS) {
								fc.find('[modal-autofocus]').focus();
							} else {
								fc.find('[autofocus]').removeAttr('autofocus');
							}
						}, 0);
					}
					$mx(document.body).removeClass('disable-pointer-events');
	
// 					if ($mx.isset($.layout) && $.layout.hash.cb) $mx(function() { $.layout.hash.cb(); });
				});/*
.chatch(function(xhr, s) {
					alert('Проблема с сетью');
					if (method == 'form') {
						f.modal('hide');
					}
				})
*/
			}
		}
	}
	
}(document, window);

// $mx(function() {
/*
	$mx(document.body).on('click', '.mx-tap', function() {
		var o = $(this).addClass('active');
		setTimeout(function() {
 			o.removeClass('active');
		}, 0);
	});
*/
	// Удаление :hover стилей для Touch девайсов
/*
	if ($.touch.isTouch) {
		try {
			var ignore = /:hover/;
			for (var i = 0; i < document.styleSheets.length; i++) {
				var sheet = document.styleSheets[i];
				if (!sheet.cssRules) continue;

				for (var j = sheet.cssRules.length - 1; j >= 0; j--) {
					var rule = sheet.cssRules[j];
					if (rule.type === CSSRule.STYLE_RULE) {
						var slist = rule.selectorText.split(',');
						var sclear = [];
						
						for (var n = 0; n < slist.length; n++) {
							if (!ignore.test(slist[n])) sclear.push(slist[n]);
						}
						
						if (sclear.length == 0 && slist.length) {
							sheet.deleteRule(j);
						} else if (ignore.test(rule.selectorText)) {
							rule.selectorText = sclear.join(',');
						}
					}
				}
			}
		}
		catch(e) {
		}
	}
*/
	
	/*
	jQuery.ajaxSetup({
	    'beforeSend': function(xhr) {xhr.setRequestHeader(referer, "header value")}
	})
	*/
	
	/*
		data-modal:	native, form, push, replace
	*/
/*
	var submenuEvent = $mx.nvl($('header').data('submenu-event'), 'mouseenter');
	var submenuEntered = false;
	
	$mx.observe('script[type="ajax/command"]', function(o) {
		$mx.form.parseResult(o.text());
	})
*/

/*
	$(document.body).on(submenuEvent, '.header-menu a', function(e) {
		if ($.touch.isXS || (submenuEvent == 'mouseenter' && submenuEntered)) return;
		if (!$(this).data('hide-submenu')) $.admin.menuPanel(e, $(this).data('index'));
		submenuEntered = true;
	}).on('mouseleave', '.header-menu a', function(e) {
		submenuEntered = false;
	});
	
	if (submenuEvent != 'click') {
		$(document.body).on('click', '.header-menu a', function(e) {
			if ($.touch.isTouch) {
				$.admin.menuPanel(e, $(this).data('index'), $(this).data('hide-submenu'));
			} else {
				$.admin.menuPanel(e, $(this).data('index'), true);
			}
		});
	}
*/
// });
+function (d, w) { "use strict";
	$mx.form = {
		closeForm: function(form) {
/*
			if ($mx.isset(form) && form && form.attr('data-event-closest')) {
				console.log(1);
				form.closest(form.data('event-closest')).trigger('close');
			} else {
*/
				var m = ($mx.isset(form) && form)?form.closest('.modal'):null;
				if (m && m.length) {
					m.modal('hide');
				} else {
					//$mx.layout.breadcrumb.pop();
				}
// 			}
		},
		
		parseResult: function(s, form, target) {
			
			if (s == 'ok') {
// 				if (false/*url*/) {
// 					$.go((url == '.')?document.location.href:url);
// 					return true;
// 				} else {
					if (form) form.trigger('close');
					return true;
// 				}
			}
			
			if (s.substring(0, 2) == 'ok') {
					s = s.split(':');
					s.shift();
					
					for (var i = 0; i < s.length; i++) {
						switch (s[i]) {
							case 'update':
								i++;
								//refeshBlocks(s[i]);
								break;
							case 'call':
								i++;
								eval(s[i]);
								break;
							case 'close':
								if (form && $mx(form).closest('.layout-panel-right').length) {
									$.layout.panels.right.close();
								} else {
									$mx.form.closeForm(form);
								}
								form = null;
								break;
							case 'go':
								$mx(document.body).removeClass('authscreen');
								i++;
								go(s[i], false, true);
								break;
							case 'gohard':
								i++;
								go(s[i], true);
								break;
							case 'modal':
								i++;
								var ms = s[i].split('@');
								$mx.router.open(ms[0], 'push', (ms[1] == undefined)?'':ms[1], (ms[2] == undefined)?null:ms[2], (ms[3] == undefined)?null:ms[3]);
								break;
							case 'modalform':
								i++;
								var ms = s[i].split('@');
								$mx.router.open(ms[0], 'form', (ms[1] == undefined)?'':ms[1], (ms[2] == undefined)?null:ms[2], (ms[3] == undefined)?null:ms[3]);
								break;
							case 'fullscreen':
							case 'fullscreen-iframe':
								i++;
								var ms = s[i].split('@');
								$mx.router.open(ms[0], s[i-1], (ms[1] == undefined)?'':ms[1], (ms[2] == undefined)?null:ms[2], (ms[3] == undefined)?null:ms[3]);
								break;
							case 'remove':
								i++;
								$mx(s[i]).remove();
								break;
						}
					}
					
					return true;
					
			} else {
				return false;
			}	
				
		},
			
		updateForm: function(o, action, target, type, disabled, callback, data) {
			if ($mx.isset(o.preventDefault)) o.preventDefault();
			var el = $mx((o.target == undefined || o.tagName != undefined)?o:o.target);
			var form = el.is('form')?el:el.closest('form');
			//if (form.data('updating')) return false;
			//form.data('updating', true);
			var data = (data == undefined)?[]:data;//list.serializeArray();
			if (action != undefined && action != '') {
				data.action = action;
			}
			
			form.trigger('beforeSubmit');
			
			form.addClass('mx-form-updating');
			
			$mx(document.body).trigger('keyboardclose');
			
			if (!$mx.isset(disabled)) disabled = true;
	 		
	 		var fi = $mx(document.activeElement);
			var focus = fi.attr('name');
			var pos = fi.is('textarea,input[type=text],input[type=tel]')?fi.caret():null;
			if (el.is('button')) {
				if (!el.find('.updating-block').length) $mx('<div class="updating-block"></div>').appendTo(el);
				if (!el.is('.ignore-updating-link')) el.addClass('is-loading');
			}
			
			let values = [];
			form.find('input,textarea,button[name]').each(v => {
				values[v.name] = v.value;
			});
			
			//try {
				$mx.request({
					url: form.attr('action'),
					data: values,
					method: (type == undefined)?'post':type
				}).then(function(s) {
					s = s.data;
/*
					var url = form.data('update-url');
					if (url == undefined) url = form.attr('action');
*/
					
					form.find('button[type="submit"]').removeClass('is-loading');
					if (el.is('button')) el.removeClass('is-loading');
					
					
					form.removeClass('mx-form-updating');
					$mx(document.body).removeClass('grayscale-sm disable-pointer-events');

					if (!$mx.form.parseResult(s, form, target)) {
						var f = ((target == undefined)?form.parent():$mx(target));
						if (form.data('modal-animation') == 'opacity') {
							f.animate({'opacity': 0}, 'fast', function() {
								f.html(s);
								f.animate({'opacity': 1}, 'fast');
							});
						} else {
							f.html(s);
						}
						
						form = f.find('form');
						
						//form.bind('close', onclose);					
						
						if (focus) setTimeout(function() { 
							//caret из maskinput
							var f = $mx("[name='"+focus+"']");
							f.focus();
							if (pos) f.caret(pos.begin, pos.end); 
						}, 0);
						if (callback != undefined) callback();
						form.data('updating', false);
						
						f.find('[data-dismiss="modal"]').click(function() {
							$mx.form.closeForm(f.find('form'));
						});
						
						var rr = f.find('script[type="form/result"]');
						if (rr.length) {
							$mx.form.parseResult('ok:'+rr.text(), form, target);
						}
					}
					
					//list.prop('disabled', false).removeClass('disabled');
				});
/*
			} catch(e) {
				//if (disabled) list.prop('disabled', false);
				form.data('updating', false);
				$mx(document.body).removeClass('grayscale-sm disable-pointer-events');
				alert('Проблема с сетью');
			}
*/
			
			return false;
		}
	}
	
	$mx.observe("form[data-target='modal']", function(o) {
// 		var is_validator = (o.data('validator') == 'yes');
		o.removeAttr('data-validator');
		
		function formSubmit(e, action, data) {
/*
			if (is_validator && action != 'delete' && !$.validator.isValid($mx(e).closest('form'))) {
				$mx(e).removeClass('is-loading');
				return false;
			}
*/
			return $mx.form.updateForm(e, action, o.data('selection'), undefined, undefined, undefined, data);
		}
		
		if (!o.data('observe') && !o.data('enter-ignore')) {
			$mx('input', o).keypress(function(e) {
				if (e.keyCode == 13) {
					var e = $mx(this);
					return formSubmit(this, e.hasAttr('data-observe')?e.data('observe'):'submit');
				}
			});
		}
		
		if (o.data('enter-ignore')) {
			$mx('input', o).keypress(function(e) {
				if (e.keyCode == 13) e.preventDefault();
			});
		}
		
		if (o.data('observe-changed')) {
			$mx('input,textarea', o).change(function() {
				if ($mx(this).data('observe-ignore')) return;
				return formSubmit(this, 'submit')
			});
		}
		
		if (o.data('observe')) {
			o.observe(function() {
				//if ($mx(this).data('observe-ignore')) return;
				formSubmit(o, null);
			});
			
			o.on('submit', function() { return false; });
			o.on('observe', function() { return formSubmit(this, 'submit') });
		} else {
			o.on('submit', function() { return formSubmit(this, 'submit') });
		}
		
		o.delegate('[data-submit-action]', 'keydown', function(e) {
			if ( e.which == 13 ) {
				e.preventDefault();
				return formSubmit(this, $mx(this).data('submit-action'));
			}
		});
		
		o.delegate('button[type=submit], button[data-type="submit"]', 'click', function() {
			var d = $mx(this);
			var name = d.attr('name');
			var data = {};
			var val = 'submit';
			
			if ($mx.isset(name)) {
				if (name == 'action') {
					val = d.attr('value');
				} else {
					data[name] = d.attr('value');
				}
			}
			
			if (d.data('modal-confirm')) {
				if (!confirm(d.data('modal-confirm'))) return false;
			}
			
// 			if (!o.find('.updating-block').length) $mx('<div class="updating-block"></div>').appendTo(d);
// 			d.addClass('updating-link');

			return formSubmit(this, val, data);
		});
		
		o.delegate('[data-observe]', 'change', function() {
			var o = this;
			setTimeout(function() { formSubmit(o, $mx(o).data('observe')); }, 0);
		});
	

	});

	
}(document, window);
	
$mx(function() {
	
	//[href!='#']
	$mx(document.body).on('click', "a[data-modal], .mx-link .item-row > div:not(.mx-not-link)", function(ev) {
		var e = $mx(this);
				
		if (e.closest('.mx-link').length) e = e.closest('.mx-link');
		
		if (e.is(':disabled') || e.is('.disabled') || e.attr('disabled')) {
			ev.stopPropagation();
			ev.preventDefault();
			return;
		}
		
		var d = e.data();
		
		var link = d.remote?d.remote:e.attr('href')
		
		if (link.indexOf('javascript:') == 0 || link.substring(0, 1) == '#') return true;
		if (this.target || ev != null && ev.metaKey) {
			$mx('.modal-backdrop-header-panel').click();
			return true;
		}
		
		if (d.modalConfirm) {
			if (!confirm(d.modalConfirm)) {
				ev.stopPropagation();
				ev.preventDefault();
				return false;
			}
		}
/*
		
		var title = d.modalTitle?d.modalTitle:'...';
		var et = e.find('.mx-link-title');
		
*/
		
/*
		if (title == '...') {
			if (et.length) {
				title = et.text();
			} else if (e.is('button, a')) {
				title = e.text();
			}
		}
*/
		
		$mx.router.open(link, d.modal, undefined, undefined/* size , title*/, e);
/*
		
		if (d.modal == 'panel') {
			$.layout.panels.right.open(link)
		} else if (d.modal == 'native') {
			return true;
		} else {
			if (d.modal == 'module') {
				if (ev != null && ev.metaKey) return true;
				if (link) link = link.replace('layout-refresh=yes', '').replace('&&', '&').replace('&?', '?');
				$mx.router.open(link, 'module', '', title);
			} else {
				var size = d.modalSize;
				if (size == undefined) {
					size = (d.modal == 'form')?'':'flat';
				}
				
				if (!d.modal) d.modal = 'replace';
				
				if (d.modal == 'replace') return true;
				
				$mx.router.open(link, d.modal, size, title, e);
			}
		}
*/
		
		return false;		
	});
});
