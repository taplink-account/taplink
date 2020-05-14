
window.$app.defineComponent("index", "vue-index-footer", {methods: {
			checkUrlPrefix(s) {
				return window.base_path_prefix + s;
			}
		}, template: `<footer class="is-hidden-mobile"> <div class="container"> <div class="level"> <div class="level-left"> <a :href="checkUrlPrefix('/guide/')">{{'Подробные инструкции'|gettext}}</a> <a :href="checkUrlPrefix('/faq/')">{{'Вопросы и ответы'|gettext}}</a> <a @click="Intercom('show')">{{'Задать вопрос'|gettext}}</a> <a :href="checkUrlPrefix('/tariffs/')">{{'Цены и тарифы'|gettext}}</a> </div> <div class="level-right"> <vue-component-locale-change></vue-component-locale-change> </div> </div> </div> </footer>`});

window.$app.defineComponent("index", "vue-index-index", {data() {
			return {
				isAuth: false,
				current: null
			}
		},
		
		computed: {
			isShow() {
				return this.current && (((this.current.name == 'main') && this.isAuth) || (this.current.name != 'main'));
			}
		},

		created() {
			window.$events.on('navigate', this.navigate);
			this.navigate(null, this.$router.currentRoute);
			
			if (this.$account.profile_id == undefined) {
				if (this.$router.currentRoute.name == 'index') {
					window.$events.one('account:refresh', () => {
						this.$router.replace({name: 'pages', params: {page_id: this.$account.page_id}});
/*
						if (this.$account.user.email || 1) {
							this.$router.replace({name: 'pages', params: {page_id: this.$account.page_id}});
						} else {
							this.$router.replace({name: 'email'});
						}
*/
					});
				}

				this.$auth.refresh(null, null, () => {
					// Если ссылка была на внутреннюю страницу - созраняем ее в куках
					let location = document.location.href;
	
					if (location.indexOf('/auth/') == -1) {
						Cookies.set('auth-redirect', location);
					} else {
						Cookies.remove('auth-redirect');
					}
				});
			} else {
				this.isAuth = true;
			}
			
			window.$events.on('account:refresh', () => {
				if (!this.$account.user.email) return this.$router.replace({name: 'email'});
				this.isAuth = true;
			});
			
			this.$io.on('events:account:logout', this.logout);
			window.$events.on('account:logout', this.logout);

			this.$io.on('events:avatar:updated', this.avatarUpdated);
			
			let mainBlock = $mx('.main-block');
			
			mainBlock.on("scroll", (e) => {
				$mx(document.body).toggleClass('is-scrolled', mainBlock[0].scrollTop > 20);
			});
		},
		
		mounted() {
			window.scrollTo(0, 1);
		},
		
		destroyed() {
			window.$events.off('navigate', this.navigate);
			this.$io.off('events:account:logout', this.logout);
			this.$io.off('events:avatar:updated', this.avatarUpdated);
		},

		methods: {
			avatarUpdated(data) {
				this.$account.avatar.url = '//'+this.$account.storage_domain+data.pathname;
			},
			
			navigate(e, to) {
				this.current = to?((to.matched.length > 1)?to.matched[1]:to):null;
			},

			logout() {
				this.isAuth = false;
				this.$account.profile_id = null;				
				if (['main', 'index'].indexOf(this.current.name) != -1) this.$router.replace({name: 'signin'});
			}
		}, template: `<router-view v-if="isShow" :class="{'has-auth':isAuth}"></router-view>`});

window.$app.defineComponent("index", "vue-index-main", {data() {
			return {
				connection: 1,
				connectionTimer: null,
				online: true,
				isMounted: false
			}
		},
		props: ['page_id'],
		
		created() {
			$mx(window).on('online offline', this.updateIndicator);
			this.$events.on('theme:refresh', this.themeRefresh);
		},
		mounted() {
			this.isMounted = true;
			this.themeRefresh();	
		},
		destroyed() {
			$mx(window).off('online offline', this.updateIndicator);
			this.$events.off('theme:refresh', this.themeRefresh);
			this.isMounted = false;
		},
		methods: {
			themeRefresh() {
				if (this.isMounted) {
					StylesFactory.updateCSSBlock(this.$account.styles/* Object.assign({_:[this.$account.styles]}, this.$account.styles )*/, this.$refs.styles);
				}
			},
			updateIndicator() {
				this.online = navigator.onLine;
				
				if (this.online) {
					if (this.connectionTimer) {
						clearInterval(this.connectionTimer);
						this.connectionTimer = null;
					}
					$mx('html').removeClass('is-clipped');
				} else {
					this.connectionTimer = setInterval(() => {
						this.connection++;
						if (this.connection == 5) this.connection = 1;
					}, 1000);
					
					$mx('html').addClass('is-clipped');
				}

			},
			navigate(e, to) {
				this.current = to?((to.matched.length > 1)?to.matched[1]:to):null;
			}
		}, template: `<div style="display: flex;flex-direction: column;flex-shrink:0;flex-grow: 1"> <div ref='styles'></div> <vue-index-menu :page_id="page_id"></vue-index-menu> <router-view style="flex-grow: 1"></router-view> <vue-index-footer></vue-index-footer> <div class="network-status" v-if="!online"> <div class="network-status-icon"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"> <g class="fa-group" v-if="connection == 1"><path class="fa-secondary" fill="currentColor" d="M634.9 154.9C457.7-9 182.2-8.9 5.1 154.9c-6.4 6-6.8 16-.9 22.5.2.2.3.4.5.5l34.2 34c6.2 6.1 16 6.2 22.4.4 145.9-133.7 371.3-133.7 517.2 0 6.4 5.9 16.2 5.7 22.4-.4l34.2-34c6.3-6.2 6.3-16.2.2-22.5 0-.2-.2-.4-.4-.5zM522.7 268.4c-115.3-101.9-290.2-101.8-405.3 0-6.5 5.8-7.1 15.8-1.4 22.3.3.3.5.6.8.8l34.4 34c6 5.9 15.6 6.3 22.1.8 83.9-72.6 209.7-72.4 293.5 0 6.4 5.5 16 5.2 22-.8l34.4-34c6.2-6.1 6.4-16.1.3-22.4-.3-.2-.5-.4-.8-.7z"></path><path class="fa-primary" fill="currentColor" d="M320 352c35.3 0 64 28.7 64 64s-28.7 64-64 64-64-28.7-64-64 28.7-64 64-64z"></path></g> <g class="fa-group" v-if="connection != 1"><path :class="{'fa-secondary': connection== 2 || connection== 4, 'fa-primary': connection== 3}" fill="currentColor" d="M635.3 177.9l-34.2 34c-6.2 6.1-16 6.2-22.4.4-146-133.7-371.3-133.7-517.2 0-6.4 5.9-16.2 5.7-22.4-.4l-34.2-34-.5-.5c-6-6.4-5.6-16.5.9-22.5C182.2-8.9 457.7-9 634.9 154.9c.2.2.4.3.5.5 6.2 6.3 6.1 16.3-.1 22.5z"></path><path class="fa-primary" fill="currentColor" d="M320 352c-35.3 0-64 28.7-64 64s28.7 64 64 64 64-28.7 64-64-28.7-64-64-64zm203.5-82.8l-.8-.8c-115.3-101.9-290.2-101.8-405.3 0-6.5 5.8-7.1 15.8-1.4 22.3.3.3.5.6.8.8l34.4 34c6 5.9 15.6 6.3 22 .8 84-72.6 209.7-72.4 293.5 0 6.4 5.5 16 5.2 22-.8l34.4-34c6.4-6 6.5-16 .4-22.3z"></path></g> </svg> </div> <h2 class="has-mb-2 has-text-centered">{{'Отсутствует соединение'|gettext}}</h2> <h3 class="has-text-centered">{{'Убедитесь, что ваше устройство подключено к интернету'|gettext}}</h3> </div> </div>`});

window.$app.defineComponent("index", "vue-index-menu", {data() {
			return {
				favourites: [],
				standalone: window.standalone,
				title: '',
// 				kurs: false,
				currentRoute: null,
				menuOpened: false
			}
		},
		
		props: {'page_id': Number},
		
		created() {
			this.fillTitle(this.currentRoute = this.$router.currentRoute);

			
			window.$events.on('navigate', (e, to) => {
				this.fillTitle(this.currentRoute = to);
				this.moveSubmenu(to.name);
			});
			
			$mx(document.body).on('touchstart', this.onTouchStart);			
		},
		
		computed: {
			currentSubmenu() {
				if (this.currentRoute.matched.length < 3) return null;

				let submenu = this.$router.getRoute({name: this.currentRoute.matched[2].name});
				let result = (submenu && submenu.children != undefined && (submenu.meta == undefined || submenu.meta.submenu == undefined || submenu.meta.submenu))?this.$auth.prepareMenu(submenu.children):null;
				
				let findChildrens = (item) => {
					if (this.currentRoute.name == item.name) return true; 
					if (item.children && item.children.length) for (j = 0; j < item.children.length; j++) if (findChildrens(item.children[j])) return true;
					return false;
				}
				
				if (result) {
					let found = false;
					for (i = 0; i < result.length; i++) {
						if (findChildrens(result[i])) {
							found = true;
							break;
						}
					}

					if (!found) {
						this.$router.replace(result[0]);
					}
				}

				return result;
			},
			
			ratePlanLink() {
				return window.base_path_prefix+'/tariffs/';
			},
			
			tariffEndsMessage() {
				return this.$format(this.$gettext('Через {1} истекает срок действия вашего тарифа, вам необходимо <a href="{2}">продлить ваш тариф</a>'), this.$plural('день', this.$account.tariff_ends_days), this.ratePlanLink);
			}
		},

		mounted() {
			this.$io.on('events:menu.hits:changed', this.changedHits);
			this.$io.on('events:system:updated', this.updatedSystem);
			this.$io.on('events:profiles.favourites:refresh', this.refreshFavourites);
			
			NativeApplication.setBadge(this.calcHits());
			this.moveSubmenu(this.currentRoute.name, 0);
			
			window.$events.on('account:refresh', this.accountRefresh);
			window.$events.on('account:logout', this.accountLogout);
			window.$events.on('menu:close', () => {
				$mx('.projects-menu').css('pointer-events', 'none');
				this.menuOpened = false;
				setTimeout(function() { $mx('.projects-menu').css('pointer-events', 'all'); }, 50);
			});
		},
		
		destroyed() {
			this.$io.off('events:menu.hits:changed', this.changedHits);
			this.$io.off('events:system:updated', this.updatedSystem);
			this.$io.off('events:profiles.favourites:refresh', this.refreshFavourites);
			
			window.$events.off('account:refresh', this.accountRefresh);
			window.$events.off('account:logout', this.accountLogout);

			$mx(document.body).off('touchstart', this.onTouchStart);			
		},
		
		methods: {
			isActiveMenu(m) {
				for (i = this.currentRoute.matched.length - 1; i >= 0; i--) if (this.currentRoute.matched[i].name == m.name) return true;
				return false;	
			},
			moveSubmenu(name, duration = 300) {
				if (this.currentSubmenu == null) return;
				
				
				this.$nextTick(() => {
					let _walk = (list, name, i) => {
						let result = null;
						for (let k = 0; k < list.length; k++) {
							let item = list[k];
							let y = (i != undefined)?i:k;
							if (item.name == name) return y;
							if (item.children != undefined && item.children.length) {
								result = _walk(item.children, name, y);
								if (result != null) return result;
							}
						}
						
						return null;
					}
									
					let current = _walk(this.currentSubmenu, name);
					
					if (current !== null) {
						if (this.$refs.submenu != undefined) {
							let o = this.$refs.submenu.children[current];
							scrollIt(o.offsetLeft - ((this.$refs.submenu.offsetWidth - o.offsetWidth) / 2), 'x', this.$refs.submenu, duration)
						}
					}
				});
			},
			accountRefresh() {
				NativeApplication.setBadge(this.calcHits());
			},
			accountLogout() {
				NativeApplication.setBadge(null);
			},
			startTouchSubmenu() {
				$mx('html').addClass('is-dragging');
			},
			stopTouchSubmenu() {
				$mx('html').removeClass('is-dragging');
			},
			isXs() {
				return window.matchMedia("(max-width: 767px)").matches?true:false;
			},
			onTouchStart(o) {
				var t = $mx(o.target);
				if ($mx('html').is('.is-dragging') || $mx('html').is('.is-clipped') || t.closest('.b-slider').length) return;

				if (!this.isXs()) return;
				
				var resp = t.closest('.main');
				var is_stop = resp.length;
		
				var maxX = screen.width / 100 * 85;
				var startX = o.touches[0].pageX;
				var startY = o.touches[0].pageY;
				var startMenu = $mx('html').is('.open-menu')?maxX:0;
				var delta = 0;
				var startTime = 0;
				
				if (is_stop) {
					var startRespScroll = resp.data('scroll-x');
					is_stop = startRespScroll < -50;
				}
				
				var oo = $mx('.main');
				var is_started = false;
				var is_started_y = false;
				var x = 0;
			
				if (!is_stop) {
					function touchMove(e) {
						if ($mx('html').is('.is-dragging')) return;
						
						x = e.touches[0].pageX;
						y = e.touches[0].pageY;
						
						if (!is_started_y && (is_started || Math.abs(x - startX) > 45)) {
							delta = x - startX + startMenu;
			
							if (is_stop && delta > 0) is_stop = false;
							if (delta < 0 && resp.length) is_stop = true;
							
							if (!is_stop) {
								if (!is_started) {
									oo.addClass('stop-transition');
									is_started = true;
									startTime = e.timeStamp;
								}
								oo.css('transform', 'translate3d('+Math.min(Math.max(0, delta), maxX)+'px,0,0)')
							}
						}
						
						if (!is_started && Math.abs(y - startY) > 45) {
							is_started_y = true;
						}
					}
					
					t.on('touchmove', touchMove).one('touchend', (e) => {
						t.off('touchmove', touchMove);
						
						if (is_started) {
							oo.removeClass('stop-transition');
							$mx('.main-block').removeClass('disable-pointer-events')
		
							var time = e.timeStamp - startTime;
							var velocityX = Math.abs(x - startX) / time;
							var v = 0;
			
							if (velocityX > 0.4) {
								v = (x - startX) > 0;
							} else {
								v = delta > screen.width / 2;
							}
							
							setTimeout(() => {
								oo.css('transform', '')
								this.menuOpen(null, v);
							}, 0);
							
							is_started = false;
						}
						
						is_started_y = false;
					});
				}
			},
			
			fillTitle(to) {
				let title = null;
				for (var i = to.matched.length - 1; i > 0; i--) {
					if (to.matched[i].meta != undefined && to.matched[i].meta.title != undefined) title = to.matched[i].meta.title;
				}

				this.title = title;
			},
			
			changedHits(m) {
				this.$account.hits = _.merge(this.$account.hits, m);
				NativeApplication.setBadge(this.calcHits());
			},
			
			updatedSystem() {
				this.$confirm(this.$gettext('Произошло обновление системы, необходимо перезагрузить страницу'), 'is-danger').then(() => {
					document.location.reload();
				});
			},
			
			menuOpen(e, v) {
				if (v == undefined) v = !$mx('html').is('.open-menu');
				
				$mx('html').toggleClass('open-menu', v);
				
				if (v) $mx('.main').one('click', () => {
					$mx('html').removeClass('open-menu');
				});
				
/*
				let o = document.getElementsByTagName('html')[0];
				if (o.className.indexOf('open-menu') != -1) {
					o.className = o.className.replace(' open-menu', '');
				} else {
					o.className += ' open-menu';
				}
*/
			},
			
			refreshFavourites() {
				this.$api.get('account/favourites').then((data) => {
					this.$account.favourites = data.response.favourites;
				});
			},
			
			checkViewBox(m) {
				return (m.icon_viewbox == undefined)?'0 0 512 512':m.icon_viewbox;
			},
			
			prepareHits(m) {
				return (this.calcHits(m)?' menu-hits':'');
			},
			
			calcHits(m) {
				let hits = 0;

				let sum = (items) => {
					let v = 0;
					for (var i in items) {
						if (typeof items[i] == 'object') {
							v += sum(items[i]);
						} else {
							v += items[i];
						}
					}
					
					return v;
				}
				
				if (m != undefined) {
					if (this.$account.hits[m.name]) hits = sum(this.$account.hits[m.name]);
				} else {
					_.each(this.$account.hits, (v) => {
						hits += sum(v);
					});
				}
				
				return hits;
			},
			
			prepareIcon(m) {
				return m.meta.icon + this.prepareHits(m);
			},
			
			click(e) {
				if (window.standalone) go($mx(e.target).closest('a').attr('href'));
				this.$auth.closeMenu();
			},
			
			submenuClick(e) {
				let o = $mx(e.target.parentNode);
//				scrollIt(e.target.offsetLeft - ((e.target.parentNode.offsetWidth - e.target.offsetWidth) / 2), 'x', e.target.parentNode)
			},
			
			logout() {
				this.$api.get('auth/logout').then((data) => {
					if (data.result == 'success') {
						this.$auth.closeMenu();
						
						if (data.response != undefined) {
							this.$auth.refresh(data.response, () => {
								this.$router.replace({name: 'pages', params: {page_id: this.$account.page_id}});	
							});
						} else {
							this.$account.profile_id = null;
							window.$events.fire('account:logout');
						}
					}
				})
			}
		}, template: `<div> <a class="message has-text-centered" :href="ratePlanLink" v-if="!$auth.isAllowTariff('pro') && window.$promotion" style="background: #000;color: #fff;font-size: 110%;margin: 0;border-radius: 0;text-decoration:none;padding: .7rem 0;z-index:1;display:block" v-html="window.$promotion.promotion_message"></a> <header class="is-top is-auth"> <div class="container"> <div> <a @click.stop="menuOpen" class="menu-btn"><i class="fal fa-bars"></i><i :class="prepareHits()"></i></a> <span @click.stop="menuOpen" class="menu-title">{{title|gettext}}</span> <div class="scrolling-container"> <div> <div class="menu"> <router-link v-for="(m, index) in $auth.prepareMenu($router.getRoute({name: 'main'}).children)" :key="index" :to="{name: m.name, params: { page_id: page_id }}" :class="{active: isActiveMenu(m)}" v-if="m.meta && (m.meta.icon || m.meta.icon_svg)" @click.native="click"><svg :viewBox="checkViewBox(m.meta)" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" v-if="m.meta.icon_svg != undefined" v-html="m.meta.icon_svg"></svg><i :class="prepareHits(m)"></i><em :class="prepareIcon(m)" v-else></em><span>{{m.meta.title|gettext}}</span><dd :data-value="calcHits(m)" v-if="calcHits(m)"></dd></router-link> </div> </div> </div> <div class="header-choose-profile"> <div class="a projects-menu" :class="{in: menuOpened}"> <div @click.prevent.stop="menuOpened = false" class="background"></div> <div class="d" @click="if (isXs()) menuOpened=true"><img :src='$account.avatar.url' class="avatar"><i class="fa fa-angle-down is-hidden-mobile has-ml-1"></i></div> <div class="ul"> <div class="li is-first"><router-link :to="{name: 'profiles', params: {page_id: page_id}}" @click.native="click">{{'Мои профили'|gettext}}</router-link></div> <div class="li divider" v-if="$account.favourites.length"></div> <div class="menu-favourites"> <div v-for="f in $account.favourites" class="li"><a class='profile' @click="$auth.changeProfile(f.profile_id)"><i class="fa fa-share-alt" v-if="f.is_share"></i><dd>{{f.nickname}}</dd></a></div> </div> <div class="li divider"></div> <div class="li"><router-link :to="{name: 'access', params: {page_id: page_id}}" @click.native="click">{{'Совместный доступ'|gettext}}</router-link></div> <div class="li divider"></div> <div class="li"><router-link :to="{name: 'account-settings', params: {page_id: page_id}}" @click.native="click">{{'Настройки аккаунта'|gettext}}</router-link></div> <div v-if="$account.manager_id"> <div class="li divider"></div> <div class="li"><router-link :to="{name: 'manager', params: {page_id: page_id}}" @click.native="click">{{'Администрирование'|gettext}}</router-link></div> </div> <div v-if="$account.partner_id && $account.partner.percent"> <div class="li divider"></div> <div class="li"><router-link :to="{name: 'partner', params: {page_id: page_id}}" @click.native="click">{{'Партнерская программа'|gettext}}</router-link></div> </div> <div class="li divider"></div> <div><a :href="ratePlanLink">{{'Цены и тарифы'|gettext}}</a></div> <div class="li divider"></div> <div class="li is-last"><a @click="logout">{{'Выход'|gettext}}</a></div> </div> </div> </div> </div> </div> </header> <em></em> <div class="message is-warning alert-header" v-if="!$auth.isAllowTariff('pro')"><i class='fa fa-star-o'></i> {{'У вас базовый тариф'|gettext}}, <a :href='ratePlanLink' class="text-black">{{'обновить тариф'|gettext}}</a></div> <div v-else> <div class="message is-danger alert-header" v-if="$account.tariff_ends && $account.tariff_ends_days> 0 && $account.tariff_ends_days < 14"><i class='fa fa-exclamation-triangle'></i> <span v-html="tariffEndsMessage"></span></div> </div> <div class="top-panel" v-if="currentSubmenu"> <div class="container"> <div class="scrolling-container is-submenu" @touchstart="startTouchSubmenu" @touchend="stopTouchSubmenu"> <div ref="submenu" style="overflow-x: scroll"> <router-link :to="{name: m.name, params: {page_id: page_id}}" v-for="m in currentSubmenu" class="button":class="{active: isActiveMenu(m)}" @click.native="submenuClick">{{m.meta.title|gettext}}</router-link> <a class="button" style="pointer-events: none;visibility: hidden;padding-left: 70px"></a> </div> </div> </div> </div> </div>`});
window.$app.defineModule("index", [{ path: '/', component: 'vue-index-index', name: 'index', children: [ 
	
	{ path: '/auth/', redirect: 'auth/signin/', name: 'auth', children: [
		{ path: 'signin/', component: 'vue-auth-signin', name: 'signin' },
		{ path: 'email/', component: 'vue-auth-email', name: 'email' },
		{ path: 'restore/', component: 'vue-auth-restore', name: 'restore' },
		{ path: 'attach/', component: 'vue-auth-attach', name: 'attach' }
	] },
	
	{ path: '/:page_id/', props: true, component: 'vue-index-main', name: 'main', feature: 'taplink', children: [
		{ path: 'account/', redirect: 'account/settings/', name: 'account', meta: {title: 'Аккаунт'}, children: [
			{ path: 'profiles/', component: 'vue-account-profiles-list', props: true, name: 'profiles', meta: {title: 'Мои профили'}},
			{ path: 'access/', props: true, redirect: 'access/main/', name: 'access', meta: {title: 'Совместный доступ'}, children: [
				{ path: 'main/', component: 'vue-account-access-list', props: {part: 'main'}, name: 'access-main'},
				{ path: 'shared/', component: 'vue-account-access-list', props: {part: 'shared'}, name: 'access-shared'}
			]},
			{ path: 'settings/', component: 'vue-account-settings-form', props: true, name: 'account-settings', meta: {title: 'Настройки аккаунта'}}
		]},

		{ path: 'pages/', component: 'vue-pages-page', props: true, name: 'pages', meta: { title: 'Страница', icon_svg: '<path d="M76 160h40a12 12 0 0 0 12-12v-40a12 12 0 0 0-12-12H76a12 12 0 0 0-12 12v40a12 12 0 0 0 12 12zM0 224v208a48 48 0 0 0 48 48h416a48 48 0 0 0 48-48V224z" class="fa-secondary"/><path d="M464 32H48A48 48 0 0 0 0 80v144h512V80a48 48 0 0 0-48-48zM128 148a12 12 0 0 1-12 12H76a12 12 0 0 1-12-12v-40a12 12 0 0 1 12-12h40a12 12 0 0 1 12 12zm320 0a12 12 0 0 1-12 12H188a12 12 0 0 1-12-12v-40a12 12 0 0 1 12-12h248a12 12 0 0 1 12 12z"/>', tariff: 'basic', feature: 'taplink' }},
		{ path: 'statistics/', component: 'vue-statistics-list', props: true, name: 'statistics', meta: { title: 'Статистика', icon_svg: '<path d="M512 400v32a16 16 0 0 1-16 16H32a32 32 0 0 1-32-32V80a16 16 0 0 1 16-16h32a16 16 0 0 1 16 16v304h432a16 16 0 0 1 16 16z" class="fa-secondary"/><path d="M275.2 96h-38.4c-6.4 0-12.8 6.4-12.8 12.8v198.4c0 6.4 6.4 12.8 12.8 12.8h38.4c6.4 0 12.8-6.4 12.8-12.8V108.8c0-6.4-6.4-12.8-12.8-12.8zm-96 128h-38.4c-6.4 0-12.8 6.4-12.8 12.8v70.4c0 6.4 6.4 12.8 12.8 12.8h38.4c6.4 0 12.8-6.4 12.8-12.8v-70.4c0-6.4-6.4-12.8-12.8-12.8zm288-160h-38.4c-6.4 0-12.8 6.4-12.8 12.8v230.4c0 6.4 6.4 12.8 12.8 12.8h38.4c6.4 0 12.8-6.4 12.8-12.8V76.8c0-6.4-6.4-12.8-12.8-12.8zm-96 96h-38.4c-6.4 0-12.8 6.4-12.8 12.8v134.4c0 6.4 6.4 12.8 12.8 12.8h38.4c6.4 0 12.8-6.4 12.8-12.8V172.8c0-6.4-6.4-12.8-12.8-12.8z"/>', icon_viewbox: '0 0 562 512', tariff: 'basic', access: 64, feature: 'taplink' }},
		{ path: 'billing/', component: 'vue-billing-index', props: true, name: 'billing'},


		{ path: 'inbox/', component: 'vue-inbox-index', props: true, name: 'typebot-inbox', meta: {title: 'Диалоги', icon_svg: '<g class="fa-group"><path class="fa-secondary" d="M448 0H64A64.06 64.06 0 0 0 0 64v288a64.06 64.06 0 0 0 64 64h96v84a12 12 0 0 0 19.1 9.7L304 416h144a64.06 64.06 0 0 0 64-64V64a64.06 64.06 0 0 0-64-64zM128 240a32 32 0 1 1 32-32 32 32 0 0 1-32 32zm128 0a32 32 0 1 1 32-32 32 32 0 0 1-32 32zm128 0a32 32 0 1 1 32-32 32 32 0 0 1-32 32z"></path><path class="fa-primary"  d="M384 176a32 32 0 1 0 32 32 32 32 0 0 0-32-32zm-128 0a32 32 0 1 0 32 32 32 32 0 0 0-32-32zm-128 0a32 32 0 1 0 32 32 32 32 0 0 0-32-32z"></path></g>', icon_viewbox: '0 0 512 512', feature: 'typebot', submenu: false} },
		{ path: 'chatbots/', component: 'vue-chatbots-index', props: true, name: 'chatbots', meta: {title: 'Автоматизация', icon_svg: '<path class="fa-secondary" d="M149.333 56v80c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24V56c0-13.255 10.745-24 24-24h101.333c13.255 0 24 10.745 24 24zm181.334 240v-80c0-13.255-10.745-24-24-24H205.333c-13.255 0-24 10.745-24 24v80c0 13.255 10.745 24 24 24h101.333c13.256 0 24.001-10.745 24.001-24zm32-240v80c0 13.255 10.745 24 24 24H488c13.255 0 24-10.745 24-24V56c0-13.255-10.745-24-24-24H386.667c-13.255 0-24 10.745-24 24zm-32 80V56c0-13.255-10.745-24-24-24H205.333c-13.255 0-24 10.745-24 24v80c0 13.255 10.745 24 24 24h101.333c13.256 0 24.001-10.745 24.001-24zm-205.334 56H24c-13.255 0-24 10.745-24 24v80c0 13.255 10.745 24 24 24h101.333c13.255 0 24-10.745 24-24v-80c0-13.255-10.745-24-24-24zM0 376v80c0 13.255 10.745 24 24 24h101.333c13.255 0 24-10.745 24-24v-80c0-13.255-10.745-24-24-24H24c-13.255 0-24 10.745-24 24zm386.667-56H488c13.255 0 24-10.745 24-24v-80c0-13.255-10.745-24-24-24H386.667c-13.255 0-24 10.745-24 24v80c0 13.255 10.745 24 24 24zm0 160H488c13.255 0 24-10.745 24-24v-80c0-13.255-10.745-24-24-24H386.667c-13.255 0-24 10.745-24 24v80c0 13.255 10.745 24 24 24zM181.333 376v80c0 13.255 10.745 24 24 24h101.333c13.255 0 24-10.745 24-24v-80c0-13.255-10.745-24-24-24H205.333c-13.255 0-24 10.745-24 24z"></path>', icon_viewbox: '0 0 512 512', feature: 'typebot', submenu: false} },
		{ path: 'subscribers/', component: 'vue-subscribers-index', props: true, name: 'typebot-subscribers', meta: {title: 'Аудитория', icon_svg: '<path d="M96 224c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm448 0c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm32 32h-64c-17.6 0-33.5 7.1-45.1 18.6 40.3 22.1 68.9 62 75.1 109.4h66c17.7 0 32-14.3 32-32v-32c0-35.3-28.7-64-64-64zm-256 0c61.9 0 112-50.1 112-112S381.9 32 320 32 208 82.1 208 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C179.6 288 128 339.6 128 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zm-223.7-13.4C161.5 263.1 145.6 256 128 256H64c-35.3 0-64 28.7-64 64v32c0 17.7 14.3 32 32 32h65.9c6.3-47.4 34.9-87.3 75.2-109.4z"></path>', icon_viewbox: '0 0 640 512', feature: 'typebot1', submenu: false} },

		{ path: 'sales/', redirect: 'sales/leads/', props: true, name: 'sales', meta: {title: 'Заявки', icon_svg: '<path d="M0 432a48 48 0 0 0 48 48h480a48 48 0 0 0 48-48V256H0zm192-68a12 12 0 0 1 12-12h136a12 12 0 0 1 12 12v40a12 12 0 0 1-12 12H204a12 12 0 0 1-12-12zm-128 0a12 12 0 0 1 12-12h72a12 12 0 0 1 12 12v40a12 12 0 0 1-12 12H76a12 12 0 0 1-12-12zM528 32H48A48 48 0 0 0 0 80v48h576V80a48 48 0 0 0-48-48z" class="fa-secondary"/><path d="M576 256H0V128h576z"/>', icon_viewbox: '0 0 576 512', tariff: 'business', feature: 'crm', 'access': 4 }},
		{ path: 'products/', redirect: 'products/active/', props: true, name: 'products', meta: {title: 'Товары', icon_svg: '<path d="M551.64 286.8a102.1 102.1 0 0 0 16.4-3.6V480a32 32 0 0 1-32 32H88a32 32 0 0 1-32-32V283.2a125.76 125.76 0 0 0 16.4 3.6 134.93 134.93 0 0 0 18 1.2 132.48 132.48 0 0 0 29.5-3.8V384h384v-99.8a126.88 126.88 0 0 0 29.5 3.8 139.07 139.07 0 0 0 18.24-1.2z" class="fa-secondary"/><path d="M605.94 118.6c33.6 53.6 3.8 128-59 136.4a102.81 102.81 0 0 1-13.7.9 99.07 99.07 0 0 1-73.8-33.1 98.82 98.82 0 0 1-147.6 0 98.82 98.82 0 0 1-147.6 0 98.74 98.74 0 0 1-73.8 33.1 103.92 103.92 0 0 1-13.7-.9c-62.6-8.5-92.3-82.9-58.8-136.4L82.84 15a32 32 0 0 1 27.1-15h404A32 32 0 0 1 541 15z"/>', icon_viewbox: '0 0 618 512', tariff: 'business', feature: 'taplink,products', 'access': 16} },

		{ path: 'addons/', redirect: 'addons/all/', props: true, name: 'addons', meta: {title: 'Модули', icon_svg: '<path d="M12.41 236.31L70.51 210l161.63 73.27a57.64 57.64 0 0 0 47.72 0L441.5 210l58.09 26.33c16.55 7.5 16.55 32.5 0 40L266.64 381.9a25.68 25.68 0 0 1-21.29 0L12.41 276.31c-16.55-7.5-16.55-32.5 0-40z" class="fa-secondary"/><path d="M12.41 148l232.94 105.7a25.61 25.61 0 0 0 21.29 0L499.58 148c16.55-7.51 16.55-32.52 0-40L266.65 2.32a25.61 25.61 0 0 0-21.29 0L12.41 108c-16.55 7.5-16.55 32.52 0 40zm487.18 216.11l-57.87-26.23-161.86 73.37a57.64 57.64 0 0 1-47.72 0L70.29 337.88l-57.88 26.23c-16.55 7.5-16.55 32.5 0 40L245.35 509.7a25.68 25.68 0 0 0 21.29 0l233-105.59c16.5-7.5 16.5-32.5-.05-40z"/>', icon_viewbox: '0 0 582 512', feature: 'addons', submenu: false} },
		{ path: 'settings/', redirect: 'settings/design/', props: true, name: 'settings', meta: {title: 'Настройки', icon_svg: '<path d="M487.75 315.6l-42.6-24.6a192.62 192.62 0 0 0 0-70.2l42.6-24.6a12.11 12.11 0 0 0 5.5-14 249.2 249.2 0 0 0-54.7-94.6 12 12 0 0 0-14.8-2.3l-42.6 24.6a188.83 188.83 0 0 0-60.8-35.1V25.7A12 12 0 0 0 311 14a251.43 251.43 0 0 0-109.2 0 12 12 0 0 0-9.4 11.7v49.2a194.59 194.59 0 0 0-60.8 35.1L89.05 85.4a11.88 11.88 0 0 0-14.8 2.3 247.66 247.66 0 0 0-54.7 94.6 12 12 0 0 0 5.5 14l42.6 24.6a192.62 192.62 0 0 0 0 70.2l-42.6 24.6a12.08 12.08 0 0 0-5.5 14 249 249 0 0 0 54.7 94.6 12 12 0 0 0 14.8 2.3l42.6-24.6a188.54 188.54 0 0 0 60.8 35.1v49.2a12 12 0 0 0 9.4 11.7 251.43 251.43 0 0 0 109.2 0 12 12 0 0 0 9.4-11.7v-49.2a194.7 194.7 0 0 0 60.8-35.1l42.6 24.6a11.89 11.89 0 0 0 14.8-2.3 247.52 247.52 0 0 0 54.7-94.6 12.36 12.36 0 0 0-5.6-14.1zm-231.4 36.2a95.9 95.9 0 1 1 95.9-95.9 95.89 95.89 0 0 1-95.9 95.9z" class="fa-secondary"/><path d="M256.35 319.8a63.9 63.9 0 1 1 63.9-63.9 63.9 63.9 0 0 1-63.9 63.9z"/>', tariff: 'basic', 'access': 128}},
		{ path: 'partner/', redirect: 'partner/statistics/', component: 'vue-partner-index', props: true, name: 'partner', meta: {title: 'Партнерская программа', submenu: false}},
		{ path: 'manager/', redirect: 'manager/profiles/', props: true, name: 'manager'}
	]}
	
]}]);