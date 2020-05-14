
window.$app.defineComponent("settings", "vue-settings-common", {data() {
			return {
				isUpdating: false,
				isFetching: false,
				is_active_onlinekassa: false,
				variants: {time_zones: [], languages: [], currencies: [], unit_systems: {m: '', i: ''}, weight_units: {m: {h: null, l: null}, i: {h: null, l: null}}},
				values: {utc_timezone: 5, language_id: 0, currency_code: '', is_hidelink: false, options: {unit_system: 'm', weight: {unit: 'h'}}},
				errors: {},
				fractional_prices: true
			}
		},
		
		mixins: [FormModel],

		created() {
			this.fetchData();
		},
		
		watch: {
			fractional_prices(v) {
				this.values.options.currency.precision = v?2:0;
			}
		},
		
		computed: {
			tariff() {
				return this.$account.tariff;
			}
			
/*
			filteredCurrency() {
				return _.filter(this.variants.currencies, (option) => {
                    return option
                        .toString()
                        .toLowerCase()
                        .indexOf(this.values.currency_code.toLowerCase()) >= 0
                });
			}
*/
		},

		methods: {
			fetchData() {
				this.isFetching = true;
				this.$api.get('settings/common/get').then((data) => {
					this.isFetching = false;
					let c = data.response.common;
					
					this.variants = c.variants;
					this.values = c.values;
					this.fractional_prices = this.values.options.currency.precision == 2;
					this.is_active_onlinekassa = c.is_active_onlinekassa;

					this.fetchTimezones();
				});
			},
			
			fetchTimezones() {
				this.variants.time_zones = [];
				var d = new Date();
				var utc = d.getTimezoneOffset() / 60;
				var t = d.getTime();
				for (var i = -12; i <= 13; i++) {
					d.setTime(t - (-utc - i) * 3600 * 1000);
					this.variants.time_zones.push({key: i, title: this.$datetime(d)+', (Etc/GMT'+((i >= 0)?'+':'-')+((Math.abs(i) < 10)?'0':'')+Math.abs(i)+':00)'});//.str_pad(abs($i), 2, '0', STR_PAD_LEFT).':00)';
				}
			},
			
			updateData(part) {
				this.isUpdating = true;
				this.$api.post('settings/common/set', Object.assign({part: part}, this.values), this).then((data) => {
					this.errors = (data.result == 'fail')?data.errors:{};
					if (data.result == 'success') {
						this.fetchData();
						this.$auth.refresh();
						this.isUpdating = false;
					}
				});
			}
		}, template: `<div class='has-mb-4 has-mt-4 has-xs-mb-3 has-xs-mt-3'> <div class="container"> <div class="row has-mb-2-mobile"> <div class="col-xs-12 col-sm-4"> <h3 class="has-mb-1">{{'Настройки страницы'|gettext}}</h3> <div class="has-text-grey has-mb-2 is-hidden-mobile">{{'Настройка интерфейса и локализация страницы'|gettext}}</div> </div> <div class="col-xs-12 col-sm-8"> <div class="panel panel-default"> <div class="has-p-2"> <div class="row"> <div class="col-xs-12 col-sm-6 has-mb-3"> <b-field :label="'Текущее время'|gettext"> <b-select v-model="values.utc_timezone" :disabled="isUpdating" expanded> <option v-for="v in variants.time_zones" :value="v.key">{{ v.title }}</option> </b-select> </b-field> </div> <div class="col-xs-12 col-sm-6 has-mb-3"> <b-field :label="'Язык страницы'|gettext"> <b-select v-model="values.language_id" :disabled="isUpdating" expanded> <option v-for="(v, k) in variants.languages" :value="k">{{ v }}</option> </b-select> </b-field> </div> </div> <div class="row"> <div class="col-xs-12 col-sm-6"> <div class="label-pro-container"> <div v-if="!$auth.isAllowTariff('pro')" class="tag is-pro" data-toggle="tooltip" data-placement="top" :data-original-title="'Эта возможность доступна<br>на pro тарифе'|gettext">pro</div> <b-field :label="'Facebook Pixel ID'|gettext" class="has-mb-3" :class="{disabled: !$auth.isAllowTariff('pro')}"> <b-input type="number" v-model="values.facebook_pixel" :disabled="isUpdating"></b-input> </b-field> </div> </div> <div class="col-xs-12 col-sm-6"> <div class="label-pro-container"> <div v-if="!$auth.isAllowTariff('business')" class="tag is-business" data-toggle="tooltip" data-placement="top" :data-original-title="'Эта возможность доступна на Business тарифе'|gettext">biz</div> <b-field :label="'Валюта'|gettext" class="has-mb-3" :class="{disabled: !$auth.isAllowTariff('business')}" :type="((is_active_onlinekassa && (values.currency_code != 'RUB')) || (errors.currency_code != undefined))?'is-danger':''" :message="(is_active_onlinekassa && (values.currency_code != 'RUB'))?'Онлайн касса отправляет чеки только с продаж в рублях':((errors.currency_code != undefined)?errors.currency_code:'')"> <b-autocomplete v-model="values.currency_code" field="currency_code" open-on-focus="true" :data="variants.currencies" class="select is-fullwidth" :disabled="isUpdating"> <template slot-scope="props"> {{props.option.title}} </template> <template slot="empty">{{'Ничего не найдено'|gettext}}</template> </b-autocomplete> </b-field> </div> </div> <div class="col-xs-12 col-sm-6 has-mb-2-mobile last-sm" :class="{disabled: !$auth.isAllowTariff('business')}"> <label class="checkbox" :disabled="isUpdating"> <input v-model="fractional_prices" type="checkbox">{{'Дробные цены'|gettext}} </label> </div> <div class="col-xs-12 col-sm-6"> <div> <div class="label-pro-container"> <div v-if="tariff != 'business'" class="tag is-business is-middle" data-toggle="tooltip" data-placement="top" :data-original-title="'Эта возможность доступна на Business тарифе'|gettext">biz</div> <div :class="{disabled: tariff != 'business'}"> <label class="checkbox" :disabled="isUpdating"> <input v-model="values.is_hidelink" type="checkbox">{{'Скрыть логотип Taplink на странице'|gettext}} </label> </div> </div> </div> </div> </div> </div> <b-loading :is-full-page="false" :active.sync="isFetching"></b-loading> </div> </div> </div> <div v-if="$auth.hasFeature('products')"> <hr class="is-hidden-mobile"> <div class="row has-mb-2-mobile"> <div class="col-xs-12 col-sm-4"> <div class="label-pro-container"> <div v-if="!$auth.isAllowTariff('business')" class="tag is-business is-middle" data-toggle="tooltip" data-placement="top" :data-original-title="'Эта возможность доступна на Business тарифе'|gettext">biz</div> <h3 class="has-mb-1">{{'Стандарты и форматы'|gettext}}</h3> </div> <div class="has-text-grey has-mb-2 is-hidden-mobile">{{'Стандарты и форматы используются для веса товаров'|gettext}}</div> </div> <div class="col-xs-12 col-sm-8"> <div class="panel panel-default has-p-2"> <div class="row"> <div class="col-xs-12 col-sm-6 has-xs-mb-3"> <b-field :label="'Система единиц'|gettext" :class="{disabled: tariff != 'business'}"> <b-select v-model="values.options.unit_system" :disabled="isUpdating" expanded> <option v-for="(v, i) in variants.unit_systems" :value="i">{{v|gettext}}</option> </b-select> </b-field> </div> <div class="col-xs-12 col-sm-6"> <b-field :label="'Единица измерения веса'|gettext" :class="{disabled: tariff != 'business'}"> <b-select v-model="values.options.weight.unit" :disabled="isUpdating" expanded> <option v-for="(v, i) in variants.weight_units[values.options.unit_system]" :value="i">{{v|gettext}}</option> </b-select> </b-field> </div> </div> <b-loading :is-full-page="false" :active.sync="isFetching"></b-loading> </div> </div> </div> </div> <hr class="is-hidden-mobile"> <div class="row has-mb-2-mobile"> <div class="col-xs-12 col-sm-4"> <div class="label-pro-container"> <div v-if="!$auth.isAllowTariff('business')" class="tag is-business is-middle" data-toggle="tooltip" data-placement="top" :data-original-title="'Эта возможность доступна на Business тарифе'|gettext">biz</div> <h3 class="has-mb-1">{{'Доменное имя'|gettext}}</h3> </div> <div class="has-text-grey has-mb-2 is-hidden-mobile">{{'Вы можете подключить свой домен к странице'|gettext}}</div> </div> <div class="col-xs-12 col-sm-8"> <div class="panel panel-default has-p-2"> <label class="label">{{'Укажите имя домена'|gettext}}</label> <vue-component-domain-attach></vue-component-domain-attach> </div> </div> </div> <hr class="is-hidden-mobile"> <div class="row has-mb-2-mobile"> <div class="col-xs-12 col-sm-4"> <div class="label-pro-container"> <div v-if="!$auth.isAllowTariff('pro')" class="tag is-pro is-middle" data-toggle="tooltip" data-placement="top" :data-original-title="'Вставка HTML кода<br>доступна на PRO тарифе'|gettext">pro</div> <h3 class="has-mb-1">{{'Вставка HTML кода'|gettext}}</h3> </div> <div class="has-text-grey has-mb-2 is-hidden-mobile">{{'Обычно HTML код используется для вставки виджетов и интеграций других сервисов'|gettext}}</div> </div> <div class="col-xs-12 col-sm-8"> <div class="panel panel-default"> <vue-component-codemirror v-model="values.options.html" :disabled="!$auth.isAllowTariff('pro')"></vue-component-codemirror> <b-loading :is-full-page="false" :active.sync="isFetching"></b-loading> </div> </div> </div> <hr class="is-hidden-mobile"> <div class="has-text-right"> <button type="button" class="button is-primary is-fullwidth-mobile" :class="{'is-loading': isUpdating}" @click="updateData('common')" :disabled="isUpdating">{{'Сохранить изменения'|gettext}}</button> </div> </div> </div>`});

window.$app.defineComponent("settings", "vue-settings-design", {data() {
			return {
				isUpdating: false,
				isSetting: false,
				isFetching: false,
				isDeleting: false,
				isAllowPro: false,
				group_id: 1,
				groups: [{group_id: 1, groupname: this.$gettext('Стандартные темы')}, {group_id:0, groupname: this.$gettext('Мои темы')}],
				themes: {1: []},
				select_theme_id: null,
				current_theme_id: null,
				current_theme: null,
				current_style: null,
				select_theme: null,
//				opacity: {0:"0", .3:"30", .5:"50", .7:"70", .8:"80", .85:"85", .9:"90", .95:"95", .98:"98"},
// 				background_types: {'solid': this.$gettext('Сплошной цвет'), 'gradient': this.$gettext('Градиент')}
			}
		},

		created() {
			this.isAllowPro = this.$auth.isAllowTariff('pro');
			this.fetchData(true);
		},
		
		computed: {
			current() {
// 				let t = this.themes[this.$account.theme_id];
				return this.select_theme?this.buildStyles(this.select_theme, true):{screen: null};
			}
		},
		
		mixins: [FormModel],

		beforeRouteLeave(to, from, next) {
			if (this.current_theme_id == this.$account.theme_id) {
				this.$account.theme = this.current_theme;
				this.$account.styles = this.current_style;
				this.$events.fire('theme:refresh');
			}
			next();
		},
		
		watch: {
			select_theme: {
				handler: function (val, oldVal) {
					this.$account.theme = this.select_theme.options;
					this.$auth.refreshStyles();
				},
				deep: true
			}
		},

		methods: {
			fetchData(withLoading) {
				this.isFetching = withLoading;
				this.$api.get('settings/design/list').then((data) => {
					this.isFetching = false;
					let d = data.response.settings.design;
					let themes = d.themes;
					this.groups = d.groups;
					this.select_theme = null;
					this.select_theme_id = this.$account.theme_id;
					this.current_theme_id = this.$account.theme_id;
					
					this.current_theme = this.$account.theme;
					this.current_style = this.$account.styles;
					
					_.each(themes, (g, i) => {
						g = _.map(g, (v) => {
							
							if (v.options.bg.opacity == undefined) {
								v.options.bg.opacity = "0.95";
							} else {
								v.options.bg.opacity = v.options.bg.opacity.toString();
							}
							
							//v.options.link.round = v.options.link.radius?true:false;
							
							v.styles = this.buildStyles(v);
							
							if (v.theme_id == this.current_theme_id) {
								this.selectTheme(v);
								this.group_id = i;
							}
							
							return v;
						});
					});
					
					this.themes = themes;
					
					this.$nextTick(() => {
						if (this.$refs.tabs != undefined) this.$refs.tabs.resize();
					});
				});

			},
			
			buildStyles(v, view) {
				let o = this.$clone(v.options);
				if (o.link.transparent) {
					o.link.border = o.link.bg;
					o.link.bg = null;
				}
				
				//o.link.radius = o.link.round?'40px':'';
				let opacity = view?1:1.1;
				let background_size = view?'':'background-size: 50%;';
				
				switch (o.bg.size) {
					case 'width':
						background_size = 'background-size: 100% auto';
						break;
					case 'cover':
						background_size = 'background-size: cover';
						break;
				}
/*
				if (o.screen.bgcover) { background_size = 'background-size: cover'; } else
				if (o.screen.cover) background_size = 'background-size: 100%;';
*/
				
				return {
//					screen: ((o.bg.picture && o.bg.picture.link)?('background-position: '+o.bg.position+';background-repeat: repeat, '+o.bg.repeat+';background-image: linear-gradient(rgba('+hexToRgb(o.screen.bg)+', '+(o.screen.bg_opacity/opacity)+'), rgba('+hexToRgb((o.bg.type == 'gradient')?o.screen.gradient:o.screen.bg)+', '+(o.screen.bg_opacity/opacity)+')), url('+o.bg.picture.link+');'+background_size):(o.screen.gradient?('background: linear-gradient('+o.screen.bg+','+((o.bg.type == 'gradient')?o.screen.gradient:o.screen.bg)+')'):('background: '+o.screen.bg)))+';color: '+o.screen.color,
// 					html: buildStylesBackground(o, 'html', 'design'),
// 					body: buildStylesBackground(o, 'body', 'design')+';color: '+o.screen.color,

					html_thumb: buildStylesBackground(o, 'html', 'thumb'),
					body_thumb: buildStylesBackground(o, 'body', 'thumb')+';color: '+o.screen.color+(v.thumb?(';background:url('+v.thumb+')'):''),
					
					link: 'background: '+(o.link.bg?o.link.bg:'transparent')+';border-color:'+(o.link.border?o.link.border:o.link.bg)+';color: '+o.link.color+(o.link.radius?(';border-radius:'+o.link.radius):''),
					link_class: (o.link.align == 'left')?'btn-link-align-left':'',
// 					avatar: 'color: '+o.avatar.color
				};
			},
			
			setGroup(id) {
				this.group_id = id;
				this.$nextTick(() => {
					this.$refs.scroll.scrollTo(0, 0);
					if (id == 0) this.$refs.tabs.scrollTo(0, 0);
				});
			},
			
			selectTheme(t) {
				this.select_theme = (t.group_id == 0)?t:this.$clone(t);
				this.select_theme_id = t.theme_id;
				
				let o = this.select_theme;
				if (o.extended_id && (o.options.css == undefined)) {
					this.$api.post('settings/design/get', {theme_id: t.theme_id}, this).then((data) => {
						o.options = t.options = data.response.theme;
						this.$account.theme = o.options;
						this.$auth.refreshStyles();
					});
				} else {
					this.$account.theme = o.options;
					this.$auth.refreshStyles();
				}
			},
			
			setTheme(t) {
				if (t) this.selectTheme(t);
				if (t.is_pro && !this.isAllowPro) return;
				this.isSetting = true;
				this.$api.post('settings/design/set', {theme_id: this.select_theme_id}, this).then((data) => {
					if (data.result == 'success') {
						this.$account.theme_id = this.current_theme_id = this.select_theme_id;
						this.$account.theme = data.response.theme;
						this.$auth.refreshStyles();

						this.current_theme = this.$account.theme;
						this.current_style = this.$account.styles;
					}
					this.isSetting = false;
				}).catch((error) => {
					this.isSetting = false;
				})
			},
			
			newTheme() {
				if (!this.isAllowPro) {
					this.$alert(this.$gettext('Своя тема доступна в pro-тарифе').replace('<br>', ' '), 'is-danger');
					return;
				}
				
				this.$confirm(this.$gettext('Вы хотите создать новую тему?'), 'is-warning', {yes: 'Да', no: 'Нет'}).then(() => {
					this.select_theme = this.themes[1][0];
					this.editThemeInternal();
				});
			},
			
			editTheme() {
				if (!this.isAllowPro) return;
				this.$confirm(this.$gettext('Вы хотите создать новую тему на основе этой?'), 'is-warning', {yes: 'Да', no: 'Нет'}).then(this.editThemeInternal);
			},
			
			editThemeInternal() {
				this.isUpdating = true;
				if (this.select_theme.group_id != 0) {
					this.$api.post('settings/design/create', {options: this.select_theme.options, extended_id: this.select_theme.extended_id}, this).then((data) => {
						if (data.result == 'success') {
							let theme_id = data.response.theme_id;
							if (this.themes[0] == undefined) this.$set(this.themes, 0, []);
							this.select_theme.group_id = 0;
							this.select_theme.theme_id = this.select_theme_id = theme_id;
							this.setGroup(0);
							this.themes[0].unshift(this.select_theme);
						}
						this.isUpdating = false;
					}).catch((error) => {
						this.isUpdating = false;
					})
				}
			},
			
			deleteTheme(theme_id, index) {
				this.$confirm(this.$gettext('Вы уверены что хотите удалить эту тему?'), 'is-danger').then(() => {
					this.isDeleting = true;
					
					this.$api.post('settings/design/delete', {theme_id: theme_id}, this).then((data) => {
						if (data.result == 'success') {
							let themes = this.themes[this.group_id];
							themes.splice(index, 1);

							if (this.select_theme.group_id == this.group_id) {
								index = Math.min(index, themes.length - 1);
								this.selectTheme((index == -1)?this.themes[1][0]:themes[index]);
							}
						}

						this.isDeleting = false;
					});
				});
			},
			
			updateTheme() {
				this.isUpdating = true;
				this.$api.post('settings/design/update', {theme_id: this.select_theme_id, options: this.select_theme.options}, this).then((data) => {
					if (data.result == 'success') {
						this.select_theme.styles = this.buildStyles(this.select_theme);
						if (this.select_theme_id == this.current_theme_id) {
							this.$auth.refreshStyles();
	
							this.current_theme = this.$account.theme;
							this.current_style = this.$account.styles;
						}
					}
					this.isUpdating = false;
				}).catch((error) => {
					this.isUpdating = false;
				})
			},
			
			selectMove(i) {
				let t = this.themes[this.group_id];
				if (!t || !t.length) return;
				let idx = _.findIndex(t, (o) => this.select_theme.theme_id == o.theme_id);
				idx = Math.max(Math.min(idx + i, t.length-1), 0);
				this.select_theme = t[idx]
				this.select_theme_id = this.select_theme.theme_id;
			},
			
			selectNext() {
				this.selectMove(1);
			},
						
			selectPrev() {
				this.selectMove(-1);
			},
			
/*
			checkBackgroundTile(y, x) {
				let s = ['0%', '50%', '100%'];
				let o = this.select_theme.options.bg.position.split(' ');

				switch (this.select_theme.options.bg.repeat) {
					case 'repeat':
						return true;
						break;
					case 'repeat-x':
						return o[1] == s[y];
						break;
					case 'repeat-y':
						return o[0] == s[x];
						break;
					case 'no-repeat':
						return (o[1] == s[y]) && (o[0] == s[x]);
						break;
				}
			},
			
			checkBackgroundWidthPosition() {
				let o = this.select_theme.options.bg.position.split(' ');
				let s = {'0%': '-60px', '50%': '-38px', '100%': '-16px'};
				return s[o[1]];
			}
*/
		}, template: `<div> <div class="theme-panel"> <div style="padding:0 1rem"> <vue-component-vbar class="theme-panel-scroller" ref='scroll' shadow="horizontal" shadow-color="var(--design-shadow-color)" shadow-color-transparent="var(--design-shadow-color-transparent)"> <div class="theme-list" tabindex="0" @keydown.left.prevent.stop="selectPrev" @keydown.right.prevent.stop="selectNext"> <div class="theme-item" v-if="group_id == 0"> <div class="theme-block" @click="newTheme"> <span class="tag is-pro" data-toggle="tooltip" data-placement="top" :data-original-title="'Своя тема доступна в pro-тарифе'|gettext" v-if="!isAllowPro">pro</span> <div style="border: 1px dashed #aaa;box-shadow: none;"><div> <div class="theme-block-btn" style="border:1px dashed #aaa;border-radius: 40px">{{'Новая тема'|gettext}}</div> </div> </div> </div> </div> <div class="theme-item" v-for="(t, index) in themes[group_id]"> <div class="theme-block" :class="{in: t.theme_id == select_theme_id, current: t.theme_id == current_theme_id}" @click="selectTheme(t)" @dblclick="setTheme(t)"> <span class="tag is-pro" data-toggle="tooltip" data-placement="top" :data-original-title="'Эта тема доступна в pro-тарифе'|gettext" v-if="t.is_pro && !isAllowPro">pro</span> <div :style="t.styles.html_thumb"><div :style="t.styles.body_thumb"> {{'Текст'|gettext}} <div class="theme-block-btn" :class="t.styles.link_class" :style="t.styles.link">{{'Ссылка'|gettext}}</div> </div> </div> </div> <button type="button" class="button is-danger is-small" v-if="group_id == 0" :disabled="(current_theme_id == t.theme_id) || isDeleting" @click="deleteTheme(t.theme_id, index)"><i class="fa fa-trash-alt"></i></button> </div> </div> </vue-component-vbar> </div> </div> <div class="theme-panel-tabs"> <div class="container"> <div class="row"> <div class="col-xs-12"> <vue-component-vbar class="theme-panel-scroller" ref="tabs" shadow="horizontal" shadow-color="var(--design-shadow-toolbar-color)" shadow-color-transparent="var(--design-shadow-toolbar-color-transparent)" hBar="is-hidden"> <div class="theme-list"> <label :class="{in: group_id== g.group_id}" v-for="g in groups" @click="setGroup(g.group_id)">{{g.groupname}}</label> </div> </vue-component-vbar> </div> </div> </div> </div> <div class="container has-mb-6 has-mt-6 has-mt-3-mobile" v-if="select_theme"> <div class="is-hidden-tablet has-mb-3"> <div class="field row row-small"> <div class="col-md-4 col-xs-6"><button class="button is-success is-fullwidth" :disabled="(select_theme_id == current_theme_id) || (select_theme.is_pro == 1 && !isAllowPro)" @click="setTheme(select_theme)" :class="{'is-loading': isSetting}">{{'Выбрать эту тему'|gettext}}</button></div> <div class="col-md-5 col-xs-6" v-if="select_theme.group_id == 0"><button class="button is-primary is-fullwidth" :class="{'is-loading': isUpdating}" @click="updateTheme">{{'Сохранить'|gettext}}</button></div> <div class="col-md-4 col-xs-6" v-else><button class="button is-dark is-fullwidth" @click="editTheme" :class="{'is-loading': isUpdating}" :disabled="!isAllowPro">{{'Редактировать тему'|gettext}}</button></div> </div> <div class="message is-info" v-if="select_theme.is_pro == 0 && !isAllowPro"><div class="message-body">{{'Редактирование доступно на pro-тарифе'|gettext}}</div></div> <div class="message is-danger" v-if="select_theme.is_pro == 1 && !isAllowPro"><div class="message-body">{{'Доступно на pro-тарифе'|gettext}} <a href='/tariffs/' target="_blank" class='is-pulled-right'>{{'Подробнее'|gettext}} <i class="fa fa-angle-right" style="margin-left: 5px"></i></a></div></div> </div> <div class="row"> <div class="col-md-6"> <center> <div class="device is-large has-padding-top has-padding-bottom has-shadow is-hide-mobile is-preview-mobile has-mb-4"> <div class="screen page"> <div class="theme-main"> <div v-html="$account.theme.html"></div> <div class="blocks-list has-pt-2 has-pb-2"> <div class="blocks-item has-pb-1 has-pt-1"> <div class="block-avatar container"> <div class="has-text-centered"><img :src="$account.avatar.url" class="profile-avatar profile-avatar-65"></div> <div class="has-text-centered text-avatar" v-if="$account.nickname">@{{$account.nickname}}</div> <div class="has-text-centered text-avatar" v-else>@nickname</div> </div> </div> <div class="blocks-item has-pb-1 has-pt-1"> <div class="block-text container"> Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. </div> </div> <div class="blocks-item has-pb-1 has-pt-1"> <div class="block-link block-item container"> <a class="button btn-link btn-link-styled">{{'Ссылка'|gettext}} 1</a> </div> </div> <div class="blocks-item has-pb-1 has-pt-1"> <div class="block-link block-item container"> <a class="button btn-link btn-link-styled">{{'Ссылка'|gettext}} 2</a> </div> </div> <div class="blocks-item has-pb-1 has-pt-1"> <div class="block-link block-item container"> <a class="button btn-link btn-link-styled">{{'Ссылка'|gettext}} 3</a> </div> </div> </div> </div> </div> </div> </center> </div> <div class="col-xs-12 col-md-6"> <div class="is-hidden-mobile has-mb-3"> <div class="field row row-small"> <div class="col-md-4 col-xs-6"><button class="button is-success is-fullwidth" :disabled="(select_theme_id == current_theme_id) || (select_theme.is_pro == 1 && !isAllowPro)" @click="setTheme(select_theme)" :class="{'is-loading': isSetting}">{{'Выбрать эту тему'|gettext}}</button></div> <div class="col-md-5 col-xs-6" v-if="select_theme.group_id == 0 && isAllowPro"><button class="button is-primary is-fullwidth" :class="{'is-loading': isUpdating}" @click="updateTheme">{{'Сохранить изменения'|gettext}}</button></div> <div class="col-md-4 col-xs-6" v-else><button class="button is-dark is-fullwidth" @click="editTheme" :class="{'is-loading': isUpdating}" :disabled="!isAllowPro">{{'Редактировать тему'|gettext}}</button></div> </div> <div class="message is-info" v-if="select_theme.is_pro == 0 && !isAllowPro"><div class="message-body">{{'Редактирование доступно на pro-тарифе'|gettext}} <a href='/tariffs/' target="_blank" class='is-pulled-right'>{{'Подробнее'|gettext}} <i class="fa fa-angle-right" style="margin-left: 5px"></i></a></div></div> <div class="message is-danger" v-if="select_theme.is_pro == 1 && !isAllowPro"><div class="message-body">{{'Доступно на pro-тарифе'|gettext}} <a href='/tariffs/' target="_blank" class='is-pulled-right'>{{'Подробнее'|gettext}} <i class="fa fa-angle-right" style="margin-left: 5px"></i></a></div></div> </div> <div :class="{disabled: select_theme.group_id != 0 || !isAllowPro}"> <h3 class="has-text-grey has-mb-1 has-text-centered-mobile">{{'Текст'|gettext}}</h3> <div class="has-mb-6"> <div class="has-mb-2"> <vue-component-colorpicker v-model="select_theme.options.screen.color" :label="'Цвет текста'|gettext" :disabled="select_theme.group_id != 0"></vue-component-colorpicker> </div> <div class="has-mb-2"> <vue-component-colorpicker v-model="select_theme.options.avatar.color" :label="'Цвет названия профиля'|gettext" :disabled="select_theme.group_id != 0"></vue-component-colorpicker> </div> <div class="has-mb-2 link-styles-container"> <label class="form-control-static">{{'Шрифт'|gettext}}</label> <vue-component-font-chooser v-model="select_theme.options.screen.font" view="name"></vue-component-font-chooser> </div> </div> <h3 class="has-text-grey has-mb-1 has-mt-3 has-text-centered-mobile">{{'Ссылки'|gettext}}</h3> <div class="has-mb-6"> <div class="has-mb-2"> <vue-component-colorpicker v-model="select_theme.options.link.color" :label="'Цвет текста ссылки'|gettext" v-on:input="select_theme.options.link.color = $event" :disabled="select_theme.group_id != 0"></vue-component-colorpicker> </div> <div class="has-mb-2"> <vue-component-colorpicker v-model="select_theme.options.link.bg" :label="'Цвет фона ссылки'|gettext" :disabled="select_theme.group_id != 0"></vue-component-colorpicker> </div> <div class="has-mb-2"><mx-toggle v-model="select_theme.options.link.transparent" :space-between="true" :title="'Прозрачная ссылка'|gettext" :disabled="select_theme.group_id != 0"></mx-toggle></div> <div class="has-mb-2 link-styles-container"> <label class="form-control-static">{{'Эффект при наведении'|gettext}}</label> <div class="select"> <select v-model="select_theme.options.link.hover" :disabled="select_theme.group_id != 0"> <option value="0">{{'Нет'|gettext}}</option> <option value="1">{{'Прозрачность'|gettext}}</option> <option value="2">{{'Увеличение'|gettext}}</option> </select> </div> </div> <div class="has-mb-2 link-styles-container"> <label class="form-control-static">{{'Закругленная ссылка'|gettext}}</label> <ul class="link-styles is-radius-style"> <li class="link-styles-center" :class="{in: select_theme.options.link.radius == '40px'}" @click="select_theme.options.link.radius = '40px'" style="border-radius:40px"><dd></dd></li> <li class="link-styles-center" :class="{in: select_theme.options.link.radius == '12px'}" @click="select_theme.options.link.radius = '12px'" style="border-radius:8px"><dd></dd></li> <li class="link-styles-center" :class="{in: select_theme.options.link.radius == ''}" @click="select_theme.options.link.radius = ''"><dd></dd></li> </ul> </div> <div class="link-styles-container"> <label class="form-control-static">{{'Стиль ссылки'|gettext}}</label> <ul class="link-styles"> <li class="link-styles-center" :class="{in: select_theme.options.link.align == 'center'}" @click="select_theme.options.link.align = 'center'"><dd></dd></li> <li class="link-styles-left fa" :class="{in: select_theme.options.link.align == 'left'}" @click="select_theme.options.link.align = 'left'"><dd></dd></li> </ul> </div> </div> <div v-if="!select_theme.extended_id"> <h3 class="has-text-grey has-mb-1 has-mt-3 has-text-centered-mobile">{{'Фон'|gettext}}</h3> <vue-component-background-editor v-model="select_theme.options.bg"></vue-component-background-editor> <div class="has-mb-2"><mx-toggle v-model="select_theme.options.bg.fixed" :space-between="true" :title="'Фиксировать при прокрутке'|gettext"></mx-toggle></div> </div> </div> </div> </div> </div> </div> </div>`});

window.$app.defineComponent("settings", "vue-settings-domain-certificate-form", {data() {
			return {
				isFetching: false,
				isUpdating: false,
				cert: '',
				key: '',
				expires_at: null
			}
		},
		
		mixins: [FormModel],
		
		created() {
			this.isFetching = true;
			this.$api.get('settings/domain/certificate/get').then((data) => {
				this.cert = data.response.values.cert;
				this.key = data.response.values.key;
				this.expires_at = data.response.values.expires_at;
				this.isFetching = false;
			});	
		},
		
		methods: {
			update() {
				this.isUpdating = true;
				this.$api.post('settings/domain/certificate/upload', {cert: this.cert, key: this.key}, this).then((data) => {
					this.isUpdating = false;
					if (data.result == 'success') this.$parent.close();
				});				
			}
		}, template: `<div class="modal-card"> <header class="modal-card-head"> <p class="modal-card-title">{{'SSL сертификат'|gettext}}</p> <button class="modal-close is-large" @click="$parent.close()"></button> </header> <section class="message is-warning" v-if="expires_at"> <div class="message-body">{{'Сертификат истекает: {1}'|gettext|format($date(expires_at))}}</div> </section> <section class="modal-card-body"> <div class="field"> <label class="label">{{'Сертификат'|gettext}}</label> <textarea class="input" rows="10" v-model="cert"></textarea> </div> <div class="field"> <label class="label">{{'Приватный ключ'|gettext}}</label> <textarea class="input" rows="7" v-model="key"></textarea> </div> </section> <footer class="modal-card-foot"> <button class="button is-primary" :class="{'is-loading': isUpdating}" @click="update"><span v-if="expires_at">{{'Обновить сертификат'|gettext}}</span><span v-else>{{'Загрузить сертификат'|gettext}}</span></button> </footer> <b-loading :is-full-page="false" :active.sync="isFetching"></b-loading> </div>`});

window.$app.defineComponent("settings", "vue-settings-domain-zonemanager-form", {data: function() {
			return {
				isFetching: false,
				isUpdating: false,
				current: -1,
				priority: {0: '0 - High', 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, 20: '20 - Low'},
				records: []
			}
		},

		mixins: [FormModel],

		created: function () {
			this.fetchData();
		},

		methods: {
			deleteZone(i) {
				let z = this.records[i];
				this.$confirm(this.$format(this.$gettext('Вы уверены, что хотите удалить запись "{1}" для поддомена "{2}"?'), z.type, z.subdomain?z.subdomain:'subdomain'), 'is-danger').then(() => {
                    this.records.splice(i, 1);
				});
			},
			
			getError(index, name) {
				return ((this.errors[index] != undefined) && (this.errors[index][name] != undefined))?this.errors[index][name]:null;
			},
			
			onAction(v) {
				this.records.push({type: v, subdomain: '', content: '', priority: 0});

/*
				switch (v) {
					case 'A':
						this.fields.push({type: 'A', subdomain: '', content: ''});
						break;
					case 'CNAME':
						this.fields.push({type: 'CNAME', subdomain: '', content: ''});
						break;
					case 'MX':
						this.fields.push({type: 'MX', subdomain: '', content: '', priority: 0});
						break;
					case 'TXT':
						this.fields.push({type: 'TXT', subdomain: '', content: ''});
						break;
				}
*/

				this.current = this.records.length - 1;
			},
			
			openBlock(index) {
				this.current = (this.current == index)?-1:index;
				this.$emit('update:current', this.current);
			},
			
			update() {
				this.isUpdating = true;

				this.$api.get('settings/domain/zonemanager/update', {records: this.records}, this).then((data) => {
					this.isUpdating = false;
					if ((_.size(this.errors) > 0) && (this.errors[this.current] == undefined)) this.current = Object.keys(this.errors)[0];
					
					if (data.result == 'success') this.$parent.close();
				});				
			},
			
			fetchData(force) {
				this.isFetching = true;
				
				this.$api.get('settings/domain/zonemanager/list').then((data) => {
					this.isFetching = false;
					this.records = data.response.records;
				});
			}
		}, template: `<div class="modal-card"> <header class="modal-card-head"> <p class="modal-card-title">{{'Управление зоной'|gettext}}</p> <button class="modal-close is-large" @click="$parent.close()"></button> </header> <section class="modal-card-body"> <div class="form-fields-item-list" :class="{'has-mb-2': records.length, disabled: isUpdating}"> <div class="form-fields-item" v-for="(f, index) in records" :class="{in: current== index}"> <div class="form-fields-item-title" @click="openBlock(index)"> <div class="form-fields-item-handle block-handle-link-caret"></div> <a class="has-text-danger is-pulled-right" @click.stop="deleteZone(index)"><i class="fa fa-trash-alt"></i></a> <span><span style="margin: 0 .5rem;width:3.5rem" class="tag is-dark">{{f.type}}</span> <span v-if="f.type == 'A'"><span v-if="f.subdomain">{{f.subdomain}}</span><span class="has-text-grey-light" v-else>subdomain</span><span class="is-hidden-mobile"><i class="fal fa-long-arrow-right" style="margin: 0 1rem"></i><span v-if="f.content">{{f.content}}</span><span class="has-text-grey-light" v-else>0.0.0.0</span></span></span> <span v-if="f.type == 'CNAME'"><span v-if="f.subdomain">{{f.subdomain}}</span><span class="has-text-grey-light" v-else>subdomain</span><span class="is-hidden-mobile"><i class="fal fa-long-arrow-right" style="margin: 0 1rem"></i><span v-if="f.content">{{f.content}}</span><span class="has-text-grey-light" v-else>Canonical name</span></span></span> <span v-if="f.type == 'TXT'"><span v-if="f.subdomain">{{f.subdomain}}</span><span class="has-text-grey-light" v-else>subdomain</span><span class="is-hidden-mobile"><i class="fal fa-long-arrow-right" style="margin: 0 1rem"></i><span v-if="f.content">"{{f.content}}"</span><span class="has-text-grey-light" v-else>Text</span></span></span> <span v-if="f.type == 'MX'"><span v-if="f.subdomain">{{f.subdomain}}</span><span class="has-text-grey-light" v-else>subdomain</span><span class="is-hidden-mobile"><i class="fal fa-long-arrow-right" style="margin: 0 1rem"></i><span v-if="f.content">{{f.content}} {{f.priority}}</span><span class="has-text-grey-light" v-else>Mail server</span></span></span> </span> </div> <div class="form-fields-item-options"> <div v-if="f.type == 'A'" class="row row-small"> <div class="col-xs-12 col-sm-8 has-mb-2-mobile"> <vue-component-subdomain-field v-model="f.subdomain" :domain="$account.custom_domain" :error="getError(index, 'subdomain')"></vue-component-subdomain-field> </div> <div class="col-xs-12 col-sm-4"> <b-field :message="getError(index, 'content')" :class="{'has-error': getError(index, 'content')}"> <b-input type="input" v-model="f.content" expanded placeholder="IP address"></b-input> </b-field> </div> </div> <div v-if="f.type == 'CNAME'" class="row row-small"> <div class="col-xs-12 col-sm-8 has-mb-2-mobile"> <vue-component-subdomain-field v-model="f.subdomain" :domain="$account.custom_domain" :error="getError(index, 'subdomain')"></vue-component-subdomain-field> </div> <div class="col-xs-12 col-sm-4"> <b-field :message="getError(index, 'content')" :class="{'has-error': getError(index, 'content')}"> <input type="input" v-model="f.content" class="input is-expanded" placeholder="Canonical name"> </b-field> </div> </div> <div v-if="f.type == 'MX'" class="row row-small"> <div class="col-xs-12 col-sm-6 has-mb-2-mobile"> <vue-component-subdomain-field v-model="f.subdomain" :domain="$account.custom_domain" :error="getError(index, 'subdomain')"></vue-component-subdomain-field> </div> <div class="col-xs-5 col-sm-2"> <div class="select is-fullwidth"> <select v-model="f.priority"> <option v-for="(v, i) in priority" :value="i">{{v}}</option> </select> </div> </div> <div class="col-xs-7 col-sm-4"> <b-field :message="getError(index, 'content')" :class="{'has-error': getError(index, 'content')}"> <input type="input" v-model="f.content" class="input is-expanded" placeholder="Mail server"> </b-field> </div> </div> <div v-if="f.type == 'TXT'" class="row row-small"> <div class="col-xs-12 col-sm-8 has-mb-2-mobile"> <vue-component-subdomain-field v-model="f.subdomain" :domain="$account.custom_domain" :error="getError(index, 'subdomain')"></vue-component-subdomain-field> </div> <div class="col-xs-12 col-sm-4"> <input type="input" v-model="f.content" class="input is-expanded" placeholder="text"> </div> </div> </div> </div> </div> <vue-component-action-button @action="onAction" :title="'Добавить запись'|gettext" classname="button is-success" icon='fa fa-plus'> <template slot="actions"> <b-dropdown-item value="A">A</b-dropdown-item> <b-dropdown-item value="CNAME">CNAME</b-dropdown-item> <b-dropdown-item value="MX">MX</b-dropdown-item> <b-dropdown-item value="TXT">TXT</b-dropdown-item> </template> </vue-component-action-button> <div class="block-arrow-left-top has-mt-2" style="opacity:0.5" v-if="records.length == 0"> {{'Для добавления записей в DNS сервер нажмите тут'|gettext}} </div> </section> <footer class="modal-card-foot"> <button class="button is-primary" :class="{'is-loading': isUpdating}" @click="update">{{'Сохранить'|gettext}}</button> </footer> <b-loading :is-full-page="false" :active.sync="isFetching"></b-loading> </div>`});

window.$app.defineComponent("settings", "vue-settings-payments-index", {created() {
		}, template: `<div class='has-mb-4 has-mt-4 has-xs-mb-3 has-xs-mt-3'> <div class="container"> <vue-settings-payments-providers class="has-mb-4"></vue-settings-payments-providers> <hr class="is-hidden-mobile" v-if="$auth.hasFeature('onlinekassa')"> <vue-settings-payments-onlinekassa v-if="$auth.hasFeature('onlinekassa')"></vue-settings-payments-onlinekassa> </div> </div>`});

window.$app.defineComponent("settings", "vue-settings-payments-onlinekassa-errors", {data() {
			return {
				isFetching: false,
				fields: [],
				variants: {
					type: {
						sell: 'Приход',
						sell_refund: 'Возврат прихода'
					}
				},
				total: 0,
				perPage: 30,
				page: 1,
			}
		},

		created() {
			this.fetchData(true);
			this.$io.on('events:settings.payments.onlinekassa.errors.list:refresh', this.refresh);
		},
		
		destroyed() {
			this.$io.off('events:settings.payments.onlinekassa.errors.list:refresh', this.refresh);
		},

		methods: {
			refresh() {
				this.fetchData(false);
			},
			
			fetchData(withLoading) {
				this.isFetching = withLoading;
				this.$api.get('settings/payments/onlinekassa/errors/list', {page: this.page, count: this.perPage}).then((data) => {
					this.fields = data.response.settings.payments.onlinekassa.errors.fields
					this.total = data.response.settings.payments.onlinekassa.errors.total;
					this.isFetching = false;
				}).catch((error) => {
                    this.fields = []
                    this.total = 0
                    this.isFetching = false
                    throw error
                })

			},
			
			onPageChange(page) {
                this.page = page
                this.fetchData()
            },
            
            onRepeat(row) {
	            this.$confirm('Вы уверены что хотите отправить чек №%s в онлайн кассу повторно?'.replace('%s', row.order_number), 'is-warning').then(() => {
		            this.$api.get('settings/payments/onlinekassa/errors/repeat', {order_id: row.order_id, order_version: row.order_version});
	            });
            }
		}, template: `<div class="has-mb-4 has-mt-4"> <div class="container"> <router-link :to="{name: 'settings.payments'}" class="button is-light has-mb-2 is-fullwidth-mobile"><i class="fa fa-angle-left" style="margin-right:5px"></i> Вернуться к настройкам</router-link> <b-table paginated backend-pagination :data="fields" :loading="isFetching" :per-page="perPage" :total="total" @page-change="onPageChange" bordered> <template slot-scope="props"> <b-table-column field="name" label="Счет" class="has-width-10">№{{ props.row.order_number }}</b-table-column> <b-table-column field="name" label="Тип" class="has-width-20">{{ variants.type[props.row.type] }}</b-table-column> <b-table-column field="name" label="Ошибка" class="has-text-danger"> {{ props.row.error }} <a v-if="props.row.error" @click="onRepeat(props.row)" class="button is-small is-default is-pulled-right"><i class="fa fa-repeat" style="margin-right: 5px"></i> <span v-if="props.row.uuid">Отправить новый запрос</span><span v-else>Отправить повторно</span></a> </b-table-column> </template> <template slot="empty"> <section class="has-mb-4 has-mt-4 content has-text-grey has-text-centered" v-if="!isFetching"> <p><b-icon icon="smile" size="is-large"></b-icon></p> <p>{{'Пока ничего нет'|gettext}}</p> </section> <section class="has-mb-4 has-mt-4 content has-text-grey has-text-centered" v-if="isFetching"> <p>{{'Загрузка данных'|gettext}}</p> </section> </template> </b-table> </div> </div>`});

window.$app.defineComponent("settings", "vue-settings-payments-onlinekassa", {data() {
			return {
				isUpdating: false,
				isFetching: false,
				values: {is_active: false, receipt_errors: 0},
				variants: {},
				errors: {group: '', }
			}
		},

		created() {
			this.fetchData(true);
		},
		
		computed: {
			currentOnlinekassa() {
				return this.values.onlinekassa_provider_id?('vue-settings-payments-onlinekassa-'+this.variants.onlinekassa_provider_id[this.values.onlinekassa_provider_id].onlinekassa_provider_name):null;
			},

			isAllow() {
				return this.$auth.isAllowTariff('business');
			}
		},

		mixins: [FormModel],

		methods: {
			fetchData(withLoading) {
				this.isFetching = withLoading;
				this.$api.get(['settings/payments/onlinekassa/get', 'settings/payments/onlinekassa/info']).then((data) => {
					this.isFetching = false;
					this.values = data.response.settings.payments.onlinekassa.values;
					this.variants = data.response.settings.payments.onlinekassa.variants;
					this.$account.hits.settings.payments.onlinekassa.errors = this.values.receipt_errors;
				});

			},
			
			updateData() {
				this.isUpdating = true;
				this.$api.post('settings/payments/onlinekassa/set', this.values, this).then((data) => {
					this.isUpdating = false;
					if (data.result == 'success') {
						this.values = data.response.values;
// 						this.$account.hits.settings.payments.onlinekassa.errors = this.values.receipt_errors;
// 						this.values.receipt_errors = data.values.receipt_errors;
					}
				}).catch((error) => {
					this.isUpdating = false;
				})
			}
		}, template: `<div class="row"> <div class="col-xs-12 col-sm-4"> <div class="label-pro-container"> <div v-if="!$auth.isAllowTariff('business')" class="tag is-business is-middle" data-toggle="tooltip" data-placement="top" :data-original-title="'Эта возможность доступна на Business тарифе'|gettext">biz</div> <h3 class="has-mb-1">Онлайн касса</h3> </div> <div class="has-text-grey has-mb-2"> Подключите онлайн-кассу для уведомления налоговой инспекции о продажах и отправки электронных чеков клиентам</div> </div> <div class="col-xs-12 col-sm-8"> <div class="message is-danger" v-if="values.receipt_errors"><div class="message-body"><router-link :to="{name: 'settings.payments.onlinekassa.errors'}" class="button is-small is-danger is-pulled-right is-hidden-mobile" type="submit" name="action" value="update">Посмотреть ошибки</router-link>Обнаружены ошибки в работе с онлайн кассой<router-link :to="{name: 'settings.payments.onlinekassa.errors'}" class="button is-fullwidth is-danger is-visible-mobile" type="submit" name="action" value="update" style="margin-top:10px">Посмотреть ошибки</router-link></div></div> <div class="panel panel-default" :class="{disabled: !isAllow}"> <div class="card-content"> <div class="field"> <mx-toggle title="Активировать поддержку онлайн касс" v-model="values.is_active"></mx-toggle> </div> <div class="row" :class="{disabled: !values.is_active}"> <div class="col-xs-12 col-sm-6"> <b-field label="Ставка НДС" :message="errors.tax_id" :class="{'has-error': errors.tax_id}"> <b-select placeholder="-- Не выбрано --" v-model="values.tax_id" :disabled="!values.is_active" expanded> <option v-for="(v, k) in variants.tax_id" :value="k">{{v}}</option> </b-select> </b-field> <b-field label="Система налогообложения" class="has-mb-2" :message="errors.sno_id" :class="{'has-error': errors.sno_id}"> <b-select placeholder="-- Не выбрано --" v-model="values.sno_id" :disabled="!values.is_active" expanded> <option v-for="(v, k) in variants.sno_id" :value="k">{{v}}</option> </b-select> </b-field> </div> <div class="col-xs-12 col-sm-6"> <b-field label="Онлайн касса" :message="errors.onlinekassa_provider_id" :class="{'has-error': errors.onlinekassa_provider_id}"> <b-select placeholder="-- Только через платежные системы --" v-model="values.onlinekassa_provider_id" :disabled="!values.is_active" expanded> <option :value="null">-- Только через платежные системы --</option> <option v-for="v in variants.onlinekassa_provider_id" :value="v.onlinekassa_provider_id">{{v.onlinekassa_provider_title}}</option> </b-select> </b-field> <b-field label="ИНН" :message="errors.inn" :class="{'has-error': errors.inn}"> <b-input v-model="values.inn" type="number" :disabled="!values.is_active"> </b-field> </div> </div> </div> <div class="card-content" :class="{disabled: !values.is_active}" v-if="values.onlinekassa_provider_id"> <h2 class="has-mb-4 has-text-grey-light">Настройки онлайн кассы</h2> <component v-bind:is="currentOnlinekassa" v-model="values.options[values.onlinekassa_provider_id]" :variants="variants" :is_active="values.is_active" :errors="errors" v-if="values.onlinekassa_provider_id"></component> </div> <footer class="mx-item-footer"> <button type="button" class="button is-primary is-fullwidth-mobile" :class="{'is-loading': isUpdating}" @click="updateData">Сохранить изменения</button> </footer> <b-loading :is-full-page="false" :active.sync="isFetching"></b-loading> </div> </div> </div>`});

window.$app.defineComponent("settings", "vue-settings-payments-onlinekassa-atolonline", {data() {
			return {
			}
		},

		created() {
			if (this.value.version == undefined) this.value.version = 3;
		},

		props: ['value', 'errors', 'is_active'],
		mixins: [FormModel],

		methods: {
			
		}, template: `<div> <b-field label="Код группы касс" :message="errors.group" :class="{'has-error': errors.group}"> <b-input type='text' v-model='value.group' :disabled="!is_active"></b-input> </b-field> <b-field label="Адрес места расчетов" :message="errors.payment_address" :class="{'has-error': errors.payment_address}"> <b-input type='text' v-model='value.payment_address' maxlength="256" :has-counter="false" :disabled="!is_active"></b-input> </b-field> <b-field label="Логин для токена" :message="errors.login" :class="{'has-error': errors.login}"> <b-input type='text' v-model='value.login' :disabled="!is_active"></b-input> </b-field> <b-field label="Пароль для токена" :message="errors.password" :class="{'has-error': errors.password}"> <b-input type='text' v-model='value.password' :disabled="!is_active"></b-input> </b-field> <b-field label="Версия API"> <b-select placeholder="-- Не выбрано --" v-model="value.version" :disabled="!is_active" expanded> <option value="3">v3</option> <option value="4">v4</option> </b-select> </b-field> <b-field label="Электронная почта отправителя чека" :message="errors.email" :class="{'has-error': errors.email}"> <b-input type='text' v-model='value.email' :disabled="!is_active"></b-input> </b-field> </div>`});

window.$app.defineComponent("settings", "vue-settings-payments-onlinekassa-cloudkassir", {data() {
			return {
				receiptLink: 'http://taplink.cc/payments/cloudkassir/receipt.html'
			}
		},

		created() {
		},

		props: ['value', 'errors', 'is_active'],
		mixins: [FormModel],

		methods: {
			
		}, template: `<div> <b-field label="Public ID" :message="errors.login" :class="{'has-error': errors.login}"> <b-input type='text' v-model='value.login' :disabled="!is_active"></b-input> </b-field> <b-field label="Пароль для API" :message="errors.password" :class="{'has-error': errors.password}"> <b-input type='text' v-model='value.password' :disabled="!is_active"></b-input> </b-field> <b-field label="Установите уведомление Receipt в настройках CloudKassir"> <div class="has-feedback"> <b-input type='text' :value='receiptLink' onfocus="this.focus();this.select()" readonly="on"></b-input> <a class="form-control-feedback has-text-grey-light"><vue-component-clipboard :text="receiptLink" :success-message="'URL скопирован'|gettext"></vue-component-clipboard></a> </div> </b-field> </div>`});

window.$app.defineComponent("settings", "vue-settings-payments-onlinekassa-modulkassa", {data() {
			return {
			}
		},

		computed: {
			isAuth() {
				return this.value && (this.value.auth != '');
			}
		},

		props: ['value', 'errors', 'is_active'],
		mixins: [FormModel],

		methods: {
			disconnect() {
				this.value.username = '';
				this.value.password = '';
				this.value.auth = false;
			}
		}, template: `<div> <b-field label="Идентификатор" :message="errors.point" :class="{'has-error': errors.point}"> <b-input type='text' v-model='value.point' :disabled="!is_active || isAuth"></b-input> </b-field> <div v-if="isAuth"> <button class="button is-warning" @click="disconnect"><i class="fal fa-exchange"></i> Указать другой идентификатор</button> </div> <div v-else> <b-field label="Логин" :message="errors.username" :class="{'has-error': errors.username}"> <b-input type='text' v-model='value.username' :disabled="!is_active"></b-input> </b-field> <b-field label="Пароль" :message="errors.password" :class="{'has-error': errors.password}"> <b-input type='password' v-model='value.password' :disabled="!is_active" password-reveal icon-pack="fa"></b-input> </b-field> </div> </div>`});

window.$app.defineComponent("settings", "vue-settings-payments-onlinekassa-orangedata", {data() {
			return {
			}
		},

		created() {
		},

		props: ['value', 'errors', 'is_active'],
		mixins: [FormModel],

		methods: {
			
		}, template: `<div> <b-field label="Код группы касс" :message="errors.group" :class="{'has-error': errors.group}"> <b-input type='text' v-model='value.group' :disabled="!is_active"></b-input> </b-field> <b-field label="Приватный ключ организации для подписи запросов" :message="errors.priv" :class="{'has-error': errors.priv}"> <b-input type='textarea' v-model='value.priv' :disabled="!is_active"></b-input> </b-field> <b-field label="Содержимое файла client.crt" :message="errors.cert" :class="{'has-error': errors.cert}"> <b-input type='textarea' v-model='value.cert' :disabled="!is_active"></b-input> </b-field> <b-field label="Содержимое файла client.key" :message="errors.key" :class="{'has-error': errors.key}"> <b-input type='textarea' v-model='value.key' :disabled="!is_active"></b-input> </b-field> <b-field label="Пароль" :message="errors.password" :class="{'has-error': errors.password}"> <b-input type='text' v-model='value.password' :disabled="!is_active"></b-input> </b-field> <div class="field"> <label class="label">Имя ключа</label> <p class="control"> <b-field> <b-input type='text' v-model='value.keyname' :disabled="!is_active"></b-input> </b-field> <p class="has-text-grey has-mt-1">Если имя ключа не указано для проверки подписи будет использован ключ, заданный по умолчанию.</p> </p> </div> </div>`});

window.$app.defineComponent("settings", "vue-settings-payments-provider-form", {data() {
			return {
				isUpdating: false,
				isFetching: false,
				currentProvider: null,
				payment_provider_id: null,
				is_new: false,
				providers: null,
				values: {},
				variants: {},
				title: null
			}
		},

		created() {
			if (this.payment_provider_id) {
				this.fetchData(true);
			} else {
				this.providers = {general: []};
				for (var i = 0; i < 8; i++) this.providers.general.push({classname: 'payments-button payments-button-blank'});
				this.isFetching = true;
				this.$api.get('settings/payments/providers/info').then((data) => {
					this.isFetching = false;
					let providers = _.map(data.response.settings.payments.provider.providers, (v) => {
						v.classname = 'payments-button';
						v.style = 'background:url(/s/i/payments/'+v.payment_provider_id+'.png) no-repeat;background-size: 100%';
						return v;
					});
					
					this.providers = {
						best: _.compact(_.map(providers, (v) => {
							return (v.language_best.length && v.language_best.indexOf(i18n.locale) != -1)?v:null;
						})),
						general: _.compact(_.map(providers, (v) => {
							return (v.language_best.length && v.language_best.indexOf(i18n.locale) != -1)?null:v;
						}))
					};
				});
			}
		},

		props: ['payment_provider_id'],

		mixins: [FormModel],

		methods: {
			fetchData(withLoading) {
				this.isFetching = withLoading;
				this.$api.get('settings/payments/providers/get', {payment_provider_id: this.payment_provider_id}).then((data) => {
					let provider = data.response.settings.payments.provider;
					
					this.is_new = provider.is_new;
					this.values = provider.values;
					this.variants = provider.variants;
					this.currentProvider = 'vue-settings-payments-providers-'+provider.payment_provider.name;
					this.title = provider.payment_provider.title;
					this.isAllowCurrency = provider.payment_provider.allow_currency;
					
					if (this.is_new) {
						this.values.payments_methods = _.filter(_.map(this.variants.payments_methods, (v) => {
							return v.is_main_method?v.payment_method_id:null;
						}));
					}
					
					window.i18n.extend(provider.phrases);
					this.isFetching = false;
				});
			},
			
			chooseProvider(v) {
				this.payment_provider_id = v;
				this.fetchData(true);
			},
			
			close() {
				this.$parent.close()
			},
			
			popupCenter(url, title, w, aspect_ratio, min_width, min_height) {
			    var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : window.screenX;
			    var dualScreenTop = window.screenTop != undefined ? window.screenTop : window.screenY;
			    
			    var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
			    var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
			    
			    w = Math.max(min_width, width / 100 * w);
			    h = Math.max(min_height, w * aspect_ratio);
			
			    var systemZoom = width / window.screen.availWidth;
				var left = (width - w) / 2 / systemZoom + dualScreenLeft
				var top = (height - h) / 2 / systemZoom + dualScreenTop
			    var newWindow = window.open(url, title, 'location=no,status=no,scrollbars=yes, width=' + w / systemZoom + ', height=' + h / systemZoom + ', top=' + top + ', left=' + left);
			
			    // Puts focus on the newWindow
			    if (window.focus) newWindow.focus();
			},
			
			deleteProvider() {
				this.$confirm(this.$gettext('Вы уверены что хотите удалить эту платежную систему?'), 'is-danger').then((v) => {
					this.$api.get('settings/payments/providers/delete', {payment_provider_id: this.payment_provider_id}).then((data) => {
						this.$parent.close();
					});
				});
			},
			
			save(close, isUpdating) {
				this.isUpdating = (isUpdating == undefined || isUpdating)?true:false;
				this.$api.post('settings/payments/providers/set', this.values, this.$refs.model).then((response) => {
					this.isUpdating = false;
					if (response.result == 'success' && (close != undefined && close)) this.$parent.close();
				}).catch((error) => {
					this.isUpdating = false;
				})			
			}
		}, template: `<div class="modal-card modal-card-large"> <header class="modal-card-head"> <p class="modal-card-title" v-if="title">{{title}}</p> <p class="modal-card-title" v-else>{{'Платежные системы'|gettext}}</p> <button class="modal-close is-large" @click="$parent.close()"></button> </header> <section class="modal-card-body" v-if="currentProvider"> <div class='message is-danger' v-if="!isAllowCurrency"><div class="message-body"><i class="fa fa-exclamation-triangle has-mr-1"></i> {{'Ваша валюта не поддерживается данной платежной системой'|gettext}}</div></div> <component v-bind:is="currentProvider" ref='model' :values.async="values" :variants="variants" :payment_provider_id="payment_provider_id" :is_new="is_new"></component> </section> <section class="modal-card-body modal-card-body-blocks" v-else> <section class="payments-best" v-if="providers && providers.best && providers.best.length"> <div class="row row-small" style="margin-bottom: -1rem"> <div class="col-sm col-xs-6 has-mb-2" v-for="f in providers.best"><button @click="chooseProvider(f.payment_provider_id)" class="button is-vertical btn-block is-fullwidth"> <dd class="payments-auto" v-if="f.tags.indexOf('auto') != -1" data-placement="top" data-toggle="tooltip" data-original-title="Быстрая настройка" @click.stop=""></dd> <i :class="f.classname" :style="f.style"></i> <div>{{f.title}}</div> </button></div> </div> </section> <section v-if="providers"> <div class="row row-small" style="margin-bottom: -1rem"> <div class="col-sm-3 col-xs-6 has-mb-2" v-for="f in providers.general"><button @click="chooseProvider(f.payment_provider_id)" class="button is-vertical btn-block is-block-button"> <dd class="payments-auto" v-if="f.tags && f.tags.indexOf('auto') != -1" data-placement="top" data-toggle="tooltip" data-original-title="Быстрая настройка" @click.stop=""></dd> <i :class="f.classname" :style="f.style"></i> <div>{{f.title}}</div> </button></div> </div> </section> </section> <footer class="modal-card-foot level" v-if="currentProvider"> <div class="level-left"> <button v-if="!is_new" class="button has-text-danger" @click="deleteProvider"><i class="fa fa-trash-alt"></i><span class="is-hidden-mobile has-ml-1">{{'Удалить'|gettext}}</span></button> </div> <div class="level-right"> <button class="button is-dark" type="button" @click="$parent.close()">{{'Закрыть'|gettext}}</button> <button class="button is-primary" :class="{'is-loading': isUpdating}" @click="save">{{'Сохранить'|gettext}}</button> </div> </footer> <footer class="modal-card-foot" v-if="!currentProvider"> <button class="button is-dark" type="button" @click="$parent.close()">{{'Закрыть'|gettext}}</button> </footer> <b-loading :is-full-page="false" :active.sync="isFetching"></b-loading> </div>`});

window.$app.defineComponent("settings", "vue-settings-payments-providers", {data() {
			return {
				isFetching: false,
				providers: [],
			}
		},
		
		computed: {
			isAllow() {
				return this.$auth.isAllowTariff('business');
			}
		},

		created() {
			this.$io.on('events:settings.payments.providers:refresh', this.refresh);
			this.fetchData(true);
		},
		
		destroyed() {
			this.$io.off('events:settings.payments.providers:refresh', this.refresh);
		},

		methods: {
			refresh(data) {
				this.fetchData(false);
			},
			
			fetchData(withLoading) {
				this.isFetching = withLoading;
				this.$api.get('settings/payments/list', {page: this.page}).then((data) => {
					this.providers = data.response.settings.payments.providers;
					this.isFetching = false;
				}).catch((error) => {
                    this.providers = []
                    this.isFetching = false
                    throw error
                })

			},
			
			
            openForm(row) {
				this.$form('vue-settings-payments-provider-form', {payment_provider_id: row?row.payment_provider_id:null}, this);
			}
		}, template: `<div class="row"> <div class="col-xs-12 col-sm-4 has-mb-2"> <div class="label-pro-container"> <div v-if="!$auth.isAllowTariff('business')" class="tag is-business is-middle" data-toggle="tooltip" data-placement="top" :data-original-title="'Эта возможность доступна на Business тарифе'|gettext">biz</div> <h3 class="has-mb-1">{{'Платежные системы'|gettext}}</h3> </div> <div class="has-text-grey">{{'Подключите платежные системы чтобы принимать платежи напрямую от своих клиентов за ваши услуги и товары'|gettext}}</div> </div> <div class="col-xs-12 col-sm-8"> <div class="card1" :class="{disabled: !isAllow}"> <b-table :data="providers" :loading="isFetching" :mobile-cards="false" hoverable bordered class="table-header-hide" @click="openForm"> <template slot-scope="props" slot="header" style="color:red" class="is-hidden"> <div class="has-text-center">{{ props.column.label }}</div> </template> <template slot-scope="props"> <b-table-column field="name" :label="'Платежная система'|gettext" style="vertical-align:middle"> <div class="has-sm-p-1"> <div v-if="props.row.allow_currency == 0" class="is-pulled-right has-text-danger"><i class="fa fa-exclamation-triangle"></i> <span class="is-hidden-mobile">{{'Валюта не поддерживается'|gettext}}</span></div> <div v-else> <div class="is-pulled-right has-text-warning" v-if="props.row.mode == 'test'"><i class="fa fa-exclamation-triangle"></i> <span class="is-hidden-mobile">{{'Тестовый режим'|gettext}}</span></div> </div> <h3 class="has-mb-1">{{ props.row.title }}</h3> <div class="tags" v-if="props.row.methods"> <i v-for="v in props.row.methods" class="tag is-default" style="padding: 5px 30px;border-radius: 3px;zoom:.5"> <img v-if="v.picture" :src="v.picture" style="width:80px;height:80px"> <span :class="'payments-button payments-button-{1}'|format(v.payment_method)" v-else></span> </i> </div> <div class="has-text-grey" v-else>{{'Варианты оплаты не выбраны'|gettext}}</div> </div> </b-table-column> </template> <template slot="empty"> <section class="has-mb-4 has-mt-4 content has-text-grey has-text-centered" v-if="isFetching"> <p>{{'Загрузка данных'|gettext}}</p> </section> <section class="has-mb-4 has-mt-4 content has-text-grey has-text-centered" v-else> <p>{{'Настроенных платежных систем пока нет'|gettext}}</p> </section> </template> <template slot="footer"> <a class='mx-link mx-tap' @click="openForm(null)" class="button is-text is-fullwidth" style="text-decoration:none"><i class="fa fa-plus-circle"></i> {{'Добавить платежную систему'|gettext}}</a> </template> </b-table> </div> </div> </div>`});

window.$app.defineComponent("settings", "vue-settings-payments-providers-alfabank", {data() {
			return {
				
			}
		},
		props: ['values', 'variants', 'payment_provider_id', 'is_new'],
		mixins: [FormModel], template: `<div> <div class="media"> <div class="media-left"><span class='tag is-dark'>1</span></div> <div class="media-content"> <p><a href="https://alfabank.ru/sme/rko/internet-acquiring/" target="_blank">Зарегистрируйтесь</a> на сайте эквайринга от Альфабанка</p> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>2</span></div> <div class="media-content"> <b-field label="Логин магазина, полученный при подключении:" :message="errors.username" :class="{'has-error': errors.username}"> <b-input type="text" v-model="values.username"></b-input> </b-field> <b-field label="Пароль магазина, полученный при подключении:" :message="errors.password" :class="{'has-error': errors.password}"> <b-input type="text" v-model="values.password"></b-input> </b-field> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>3</span></div> <div class="media-content"> <div class="has-mb-1">{{'Выберите доступные варианты оплаты'|gettext}}</div> <div class="is-block" v-for="v in variants.payments_methods"><b-checkbox :native-value="v.payment_method_id" v-model="values.payments_methods">{{v.payment_method_title|gettext}}</b-checkbox></div> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>4</span></div> <div class="media-content"> <div>Онлайн касса</div> <b-checkbox v-model="values.onlinekassa">Использовать Альфа-банк в качестве онлайн кассы для отправки чеков</b-checkbox> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>5</span></div> <div class="media-content"> <div>Двухстадийная оплата</div> <b-checkbox v-model="values.withaccept">Подтверждать каждую оплату в личном кабинете</b-checkbox> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>6</span></div> <div class="media-content"> <div class="has-mb-1">{{'Режим работы'|gettext}}</div> <div class="row"> <div class="col-xs-12 col-sm-6"><label class="radio"><input type='radio' name='mode' value="test" v-model="values.mode"> {{'Тестовый режим'|gettext}}</label></div> <div class="col-xs-12 col-sm-6"><label class="radio"><input type='radio' name='mode' value="work" v-model="values.mode"> {{'Рабочий режим'|gettext}}</label></div> </div> </div> </div> </div>`});

window.$app.defineComponent("settings", "vue-settings-payments-providers-bepaid", {computed: {
			domain() {
				return this.variants.domain_must+'/';
			},
			signupText() {
				return this.$gettext('<a %s>Зарегистрируйтесь</a> на сайте bepaid.by').replace('%s', 'href="https://bepaid.by" target="_blank"');
			}
		},
		props: ['values', 'variants', 'payment_provider_id', 'is_new'],
		mixins: [FormModel], template: `<div> <div class="media"> <div class="media-left"><span class='tag is-dark'>1</span></div> <div class="media-content"> <p v-html="signupText"></p> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>2</span></div> <div class="media-content"> <div class="has-mb-1">Используйте настройки</div> <div class="field"> <label class="label">URL сайта:</label> <div class="has-feedback"> <input type="text" :value="domain" class="input" onfocus="this.focus();this.select()" readonly="on"> <a class="form-control-feedback has-text-grey-light"><vue-component-clipboard :text="domain" :success-message="'URL скопирован'|gettext"></vue-component-clipboard></a> </div> </div> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>3</span></div> <div class="media-content"> <div class="has-mb-1">Укажите полученные ID и Secret Key</div> <b-field :label="'ID:'|gettext" :message="errors.id" :class="{'has-error': errors.id}"> <b-input type="text" v-model="values.id"></b-input> </b-field> <b-field :label="'Secret Key:'|gettext" :message="errors.secret_key" :class="{'has-error': errors.secret_key}"> <b-input type="text" v-model="values.secret_key"></b-input> </b-field> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>4</span></div> <div class="media-content"> <div class="has-mb-1">{{'Выберите доступные варианты оплаты'|gettext}}</div> <div class="is-block" v-for="v in variants.payments_methods"><b-checkbox :native-value="v.payment_method_id" v-model="values.payments_methods">{{v.payment_method_title|gettext}}</b-checkbox></div> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>5</span></div> <div class="media-content"> <div class="has-mb-1">{{'Режим работы'|gettext}}</div> <div class="row"> <div class="col-xs-12 col-sm-6"><label class="radio"><input type='radio' name='mode' value="test" v-model="values.mode"> {{'Тестовый режим'|gettext}}</label></div> <div class="col-xs-12 col-sm-6"><label class="radio"><input type='radio' name='mode' value="work" v-model="values.mode"> {{'Рабочий режим'|gettext}}</label></div> </div> </div> </div> </div>`});

window.$app.defineComponent("settings", "vue-settings-payments-providers-cash", {props: ['values', 'variants', 'payment_provider_id', 'is_new'],
		mixins: [FormModel],
		
		data() {
			return {
				current: 0,
				isSorting: false
			}
		},
		
		methods: {
			sortStart(e) {
				this.isSorting = true;
			},
			sortEnd(e) {
				this.$nextTick(() => {
					this.isSorting = false;
				})
			},
			onRemove(index) {
				if (this.values.list.length == 1) return;
				this.$confirm(this.$gettext('Вы уверены что хотите удалить этот способ оплаты?'), 'is-danger').then(() => {
					this.values.list.splice(index, 1);
				});
			},
			
			onAdd() {
				this.values.list.push({title: '', message: '', picture: null, custom_picture: 0});
				this.current = this.values.list.length - 1;
				
				this.$nextTick(() => {
					this.$refs.list.querySelector('.in input').focus();
				});
			},

/*
			openBlock(index) {
				this.current = (this.current == index)?null:index;
			},
*/
			
			deletePicture(f) {
				f.custom_picture = 0;
			}			
		}, template: `<div> <div ref="list"> <vue-component-sortable-form-fields v-model="values.list" @sortEnd="sortEnd" @sortStart="sortStart" class="has-mb-2" :current.sync="current"> <template v-slot:title="{ item }"> <span><span v-if="item.title">{{ item.title }}</span><span v-else>{{'Наличными'|gettext}}</span></span> </template> <template v-slot:action="{ index }"> <a class="is-pulled-right has-text-danger" @click.stop="onRemove(index)" v-if="values.list.length> 1"><i class="fa fa-trash-alt"></i></a> </template> <template v-slot:form="{ item, index }"> <div class="has-mb-1"> <b-field :label="'Заголовок'|gettext"> <b-input type="text" v-model="item.title" :placeholder="'Наличными'|gettext" maxlength="80" :has-counter="false"></b-input> </b-field> <b-field :label="'Инструкция для оплаты'|gettext"> <b-input type="textarea" v-model="item.message" maxlength="8192" :has-counter="false"></b-input> </b-field> </div> <p class="has-text-grey">{{'Этот текст будет показан клиенту когда он выберет этот способ оплаты'|gettext}}</p> <label class="label has-mt-2">{{'Картинка'|gettext}}</label> <div class="payments-picture-choose"> <i class="payments-button payments-button-cash" :class="{in: item.custom_picture == 0}" @click="item.custom_picture = 0"></i> <vue-component-pictures class="payments-picture" :class="{in: item.custom_picture == 1}" @click="item.custom_picture = 1" v-model="item.picture" :button-title="'Загрузить'|gettext" button-icon="fa fal fa-cloud-upload" max-size="80" updatable @input="if (!isSorting && current== index) item.custom_picture = (item.picture != null)?1:0"></vue-component-pictures> </div> </template> </vue-component-sortable-form-fields> </div> <a href='#' @click="onAdd">{{'Добавить новый способ оплаты'|gettext}}</a> </div>`});

window.$app.defineComponent("settings", "vue-settings-payments-providers-cloudpayments", {computed: {
/*
			domain() {
				return this.variants.domain_must+'/';
			},
*/
			
			resultUrl() {
				return 'https://taplink.cc/payments/cloudpayments/result.html';
			},

			checkUrl() {
				return 'https://taplink.cc/payments/cloudpayments/check.html';
			}
		},
		props: ['values', 'variants', 'payment_provider_id', 'is_new'],
		mixins: [FormModel], template: `<div> <div class="media"> <div class="media-left"><span class='tag is-dark'>1</span></div> <div class="media-content"> <p><a href="https://cloudpayments.ru" target="_blank">Зарегистрируйтесь</a> на сайте cloudpayments.ru и добавьте сайт<br> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>2</span></div> <div class="media-content"> <div class="has-mb-1">Укажите настройки уведомлений</div> <div class="field"> <label class="label">Check уведомления:</label> <div class="has-feedback"> <input type="text" :value="checkUrl" class="input" onfocus="this.focus();this.select()" readonly="on"> <a class="form-control-feedback has-text-grey-light"><vue-component-clipboard :text="checkUrl" :success-message="'URL скопирован'|gettext"></vue-component-clipboard></a> </div> </div> <div class="field"> <label class="label">Pay уведомления:</label> <div class="has-feedback"> <input type="text" :value="resultUrl" class="input" onfocus="this.focus();this.select()" readonly="on"> <a class="form-control-feedback has-text-grey-light"><vue-component-clipboard :text="resultUrl" :success-message="'URL скопирован'|gettext"></vue-component-clipboard></a> </div> </div> <div class="field"> <p>HTTP метод должен быть указан "POST", кодировка "UTF-8", а формат запросов "CloudPayments"</p> </div> <div class="field"> <b-field label="У меня есть Apple MerchantID"> <div class="control" style="display: flex"> <mx-toggle v-model="values.apple_pay_has_merchant" class="has-mr-2"></mx-toggle> <div style="flex:1"> <b-input type="text" v-model="values.apple_pay_merchant" placeholder="MerchantID" v-show="values.apple_pay_has_merchant"></b-input> </div> </div> </b-field> <b-field label="Содержимое файла верификации для Apple Pay:" :message="errors.apple_pay_code" :class="{'has-error': errors.apple_pay_code}"> <b-input type="text" v-model="values.apple_pay_code"></b-input> </b-field> </div> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>3</span></div> <div class="media-content"> <div class="has-mb-1">Укажите "Public ID" и "Пароль для API":</div> <b-field label="Public ID:" :message="errors.public_id" :class="{'has-error': errors.public_id}"> <b-input type="text" v-model="values.public_id"></b-input> </b-field> <b-field label="Пароль для API:" :message="errors.password" :class="{'has-error': errors.password}"> <b-input type="text" v-model="values.password"></b-input> </b-field> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>4</span></div> <div class="media-content"> <div class="has-mb-1">Выберите доступные варианты оплаты</div> <div class="is-block" v-for="v in variants.payments_methods"><b-checkbox :native-value="v.payment_method_id" v-model="values.payments_methods">{{v.payment_method_title}}</b-checkbox></div> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>5</span></div> <div class="media-content"> <div class="has-mb-1">Режим работы</div> <div class="row"> <div class="col-xs-12 col-sm-6"><label class="radio"><input type='radio' name='mode' value="test" v-model="values.mode"> Тестовый режим</label></div> <div class="col-xs-12 col-sm-6"><label class="radio"><input type='radio' name='mode' value="work" v-model="values.mode"> Рабочий режим</label></div> </div> </div> </div> </div>`});

window.$app.defineComponent("settings", "vue-settings-payments-providers-ecommpay", {data() {
			return {
				resultUrl: 'https://taplink.cc/payments/ecommpay/result.html'
			}
		},
		props: ['values', 'variants', 'payment_provider_id', 'is_new'],
		mixins: [FormModel],
		computed: {
			signupText() {
				return this.$gettext('<a %s>Зарегистрируйтесь</a> на сайте ecommpay.com').replace('%s', 'href="https://ecommpay.com" target="_blank"');
			}
		}, template: `<div> <div class="media"> <div class="media-left"><span class='tag is-dark'>1</span></div> <div class="media-content"> <p v-html="signupText"></p> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>2</span></div> <div class="media-content"> <label class="has-mb-1 is-block">{{'Укажите адрес для Callback'|gettext}}</label> <div class="field"> <div class="has-feedback"> <input type="text" :value="resultUrl" class="input" onfocus="this.select()" readonly="on"> <a class="form-control-feedback has-text-grey-light"><vue-component-clipboard :text="resultUrl" :success-message="'URL скопирован'|gettext"></vue-component-clipboard></a> </div> </div> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>3</span></div> <div class="media-content"> <div class="has-mb-1">{{'Укажите полученные данные от EcommPay'|gettext}}</div> <b-field :label="'project_id:'|gettext" :message="errors.project_id" :class="{'has-error': errors.project_id}"> <b-input type="text" v-model="values.project_id"></b-input> </b-field> <b-field :label="'secret:'|gettext" :message="errors.secret" :class="{'has-error': errors.secret}"> <b-input type="text" v-model="values.secret"></b-input> </b-field> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>4</span></div> <div class="media-content"> <div class="has-mb-1">{{'Выберите доступные варианты оплаты'|gettext}}</div> <div class="is-block" v-for="v in variants.payments_methods"><b-checkbox :native-value="v.payment_method_id" v-model="values.payments_methods">{{v.payment_method_title|gettext}}</b-checkbox></div> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>5</span></div> <div class="media-content"> <div class="has-mb-1">{{'Режим работы'|gettext}}</div> <div class="row"> <div class="col-xs-12 col-sm-6"><label class="radio"><input type='radio' name='mode' value="test" v-model="values.mode"> {{'Тестовый режим'|gettext}}</label></div> <div class="col-xs-12 col-sm-6"><label class="radio"><input type='radio' name='mode' value="work" v-model="values.mode"> {{'Рабочий режим'|gettext}}</label></div> </div> </div> </div> </div>`});

window.$app.defineComponent("settings", "vue-settings-payments-providers-fondy", {data() {
			return {
				
			}
		},
		props: ['values', 'variants', 'payment_provider_id', 'is_new'],
		mixins: [FormModel], template: `<div> <div class="media"> <div class="media-left"><span class='tag is-dark'>1</span></div> <div class="media-content"> <p><a href="https://fondy.ru" target="_blank">Зарегистрируйтесь</a> на сайте fondy.ru</p> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>2</span></div> <div class="media-content"> <b-field label='Укажите ваш "ID мерчанта":' :message="errors.merchant_id" :class="{'has-error': errors.merchant_id}"> <b-input type="text" v-model="values.merchant_id"></b-input> </b-field> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>3</span></div> <div class="media-content"> <b-field label='Укажите ваш "Ключ платежа":' :message="errors.password" :class="{'has-error': errors.password}"> <b-input type="text" v-model="values.password"></b-input> </b-field> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>4</span></div> <div class="media-content"> <div class="has-mb-1">Выберите доступные варианты оплаты</div> <div class="is-block" v-for="v in variants.payments_methods"><b-checkbox :native-value="v.payment_method_id" v-model="values.payments_methods">{{v.payment_method_title}}</b-checkbox></div> </div> </div> </div>`});

window.$app.defineComponent("settings", "vue-settings-payments-providers-freekassa", {data() {
			return {
			}
		},
		
		props: ['values', 'variants', 'payment_provider_id', 'is_new'],
		mixins: [FormModel],

		
		computed: {
			domain() {
				return this.variants.domain_must+'/';
			},
			
			resultUrl() {
				return this.variants.domain_must+'/payments/freekassa/result.html';
			},

			successUrl() {
				return this.variants.domain_must+'/payments/freekassa/success.html';
			},
			
			failUrl() {
				return this.variants.domain_must+'/payments/freekassa/fail.html';
			}
		}, template: `<div> <div class="media"> <div class="media-left"><span class='tag is-dark'>1</span></div> <div class="media-content"> <p><a href="https://www.free-kassa.ru/" target="_blank">Зарегистрируйтесь</a> на сайте free-kassa.ru и добавьте магазин<br> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>2</span></div> <div class="media-content"> <div class="has-mb-1">Укажите настройки </div> <div class="field"> <label class="label">URL сайта:</label> <div class="has-feedback"> <input type="text" :value="domain" class="input" onfocus="this.focus();this.select()" readonly="on"> <a class="form-control-feedback has-text-grey-light"><vue-component-clipboard :text="domain" :success-message="'URL скопирован'|gettext"></vue-component-clipboard></a> </div> </div> <div class="field"> <label class="label">URL оповещения:</label> <div class="has-feedback"> <input type="text" :value="resultUrl" class="input" onfocus="this.focus();this.select()" readonly="on"> <a class="form-control-feedback has-text-grey-light"><vue-component-clipboard :text="resultUrl" :success-message="'URL скопирован'|gettext"></vue-component-clipboard></a> </div> </div> <div class="field"> <label class="label">URL успеха:</label> <div class="has-feedback"> <input type="text" :value="successUrl" class="input" onfocus="this.focus();this.select()" readonly="on"> <a class="form-control-feedback has-text-grey-light"><vue-component-clipboard :text="successUrl" :success-message="'URL скопирован'|gettext"></vue-component-clipboard></a> </div> </div> <div class="field"> <label class="label">URL неудачи:</label> <div class="has-feedback"> <input type="text" :value="failUrl" class="input" onfocus="this.focus();this.select()" readonly="on"> <a class="form-control-feedback has-text-grey-light"><vue-component-clipboard :text="failUrl" :success-message="'URL скопирован'|gettext"></vue-component-clipboard></a> </div> </div> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>3</span></div> <div class="media-content"> <div class="has-mb-1">Укажите Идентификатор магазина, 'Секретное слово #1' и 'Секретное слово #2'</div> <b-field label="Идентификатор магазина:" :message="errors.merchant_id" :class="{'has-error': errors.merchant_id}"> <b-input type="text" v-model="values.merchant_id"></b-input> </b-field> <b-field label="Секретное слово #1:" :message="errors.password_1" :class="{'has-error': errors.password_1}"> <b-input type="text" v-model="values.password_1"></b-input> </b-field> <b-field label="Секретное слово #2:" :message="errors.password_2" :class="{'has-error': errors.password_2}"> <b-input type="text" v-model="values.password_2"></b-input> </b-field> </div> </div> </div>`});

window.$app.defineComponent("settings", "vue-settings-payments-providers-liqpay", {props: ['values', 'variants', 'payment_provider_id', 'is_new'],
		mixins: [FormModel], template: `<div> <div class="media"> <div class="media-left"><span class='tag is-dark'>1</span></div> <div class="media-content"> <p><a href="https://www.liqpay.ua/" target="_blank">Зарегистрируйтесь</a> на сайте www.liqpay.ua<br> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>2</span></div> <div class="media-content"> <div class="has-mb-1">Введите полученные "public_key" и "private_key"</div> <b-field label="public_key:" :message="errors.public_key" :class="{'has-error': errors.public_key}"> <b-input type="text" v-model="values.public_key"></b-input> </b-field> <b-field label="private_key:" :message="errors.private_key" :class="{'has-error': errors.private_key}"> <b-input type="text" v-model="values.private_key"></b-input> </b-field> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>3</span></div> <div class="media-content"> <div class="has-mb-1">Выберите доступные варианты оплаты</div> <div class="is-block" v-for="v in variants.payments_methods"><b-checkbox :native-value="v.payment_method_id" v-model="values.payments_methods">{{v.payment_method_title}}</b-checkbox></div> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>4</span></div> <div class="media-content"> <div class="has-mb-1">Режим работы</div> <div class="row"> <div class="col-xs-12 col-sm-6"><label class="radio"><input type='radio' name='mode' value="test" v-model="values.mode"> Тестовый режим</label></div> <div class="col-xs-12 col-sm-6"><label class="radio"><input type='radio' name='mode' value="work" v-model="values.mode"> Рабочий режим</label></div> </div> </div> </div> </div>`});

window.$app.defineComponent("settings", "vue-settings-payments-providers-modulbank", {computed: {
			domain() {
				return this.$account.custom_domain_verified?this.$account.link:'https://'+this.variants.domain_must;
			}
		},
		props: ['values', 'variants', 'payment_provider_id', 'is_new'],
		mixins: [FormModel], template: `<div> <div class="media"> <div class="media-left"><span class='tag is-dark'>1</span></div> <div class="media-content"> <p><a href="https://modulbank.ru" target="_blank">Зарегистрируйтесь</a> на сайте modulbank.ru и добавьте "Интернет-эквайринг"<br> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>2</span></div> <div class="media-content"> <div class="has-mb-1">Укажите адрес сайта:</div> <div class="field" v-if="$account.custom_domain"> <div class="has-feedback"> <input type="text" :value="domain" class="input" onfocus="this.focus();this.select()" readonly="on"> <a class="form-control-feedback has-text-grey-light"><vue-component-clipboard :text="domain" :success-message="'URL скопирован'|gettext"></vue-component-clipboard></a> </div> </div> <div v-else class="message is-danger"> <div class="message-body">МодульБанк требует наличие своего доменного имени, подробнее о <a href="https://modulbank.ru/fs/files/demands-for-sources.pdf" target="_blank">требованиях</a></div> </div> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>3</span></div> <div class="media-content"> <div class="has-mb-1">Укажите данные полученные из МодульБанка:</div> <b-field label="Идентификатор магазина:" :message="errors.merchant_id" :class="{'has-error': errors.merchant_id}"> <b-input type="text" v-model="values.merchant_id"></b-input> </b-field> <b-field label="Тестовый секретный ключ:" :message="errors.test_key" :class="{'has-error': errors.test_key}"> <b-input type="text" v-model="values.test_key"></b-input> </b-field> <b-field label="Рабочий секретный ключ:" :message="errors.work_key" :class="{'has-error': errors.work_key}"> <b-input type="text" v-model="values.work_key"></b-input> </b-field> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>4</span></div> <div class="media-content"> <div class="has-mb-1">Выберите доступные варианты оплаты</div> <div class="is-block" v-for="v in variants.payments_methods"><b-checkbox :native-value="v.payment_method_id" v-model="values.payments_methods">{{v.payment_method_title}}</b-checkbox></div> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>5</span></div> <div class="media-content"> <div>Онлайн касса</div> <b-checkbox v-model="values.onlinekassa">Использовать Modulbank в качестве онлайн кассы для отправки чеков</b-checkbox> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>6</span></div> <div class="media-content"> <div class="has-mb-1">Режим работы</div> <div class="row"> <div class="col-xs-12 col-sm-6"><label class="radio"><input type='radio' name='mode' value="test" v-model="values.mode"> Тестовый режим</label></div> <div class="col-xs-12 col-sm-6"><label class="radio"><input type='radio' name='mode' value="work" v-model="values.mode"> Рабочий режим</label></div> </div> </div> </div> </div>`});

window.$app.defineComponent("settings", "vue-settings-payments-providers-paddle", {data() {
			return {
				resultUrl: 'http://taplink.cc/payments/paddle/result.html'
			}
		},
		computed: {
			signupText() {
				return this.$gettext('<a %s>Зарегистрируйтесь</a> на сайте paddle.com').replace('%s', 'href="https://www.paddle.com" target="_blank"');
			},
			webhookText() {
				return this.$gettext('<a %s>Установите</a> URL для получения уведомлений и выберите все Webhook события').replace('%s', 'href="https://vendors.paddle.com/account#tabs-alerts" target="_blank"');
			}
		},
		props: ['values', 'variants', 'payment_provider_id', 'is_new'],
		mixins: [FormModel], template: `<div> <div class="media"> <div class="media-left"><span class='tag is-dark'>1</span></div> <div class="media-content"> <p v-html="signupText"></p> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>2</span></div> <div class="media-content"> <b-field :label="'Укажите ваш vendor_id:'|gettext" :message="errors.vendor_id" :class="{'has-error': errors.vendor_id}"> <b-input type="text" v-model="values.vendor_id"></b-input> </b-field> <b-field :label="'Укажите ваш vendor_auth_code:'|gettext" :message="errors.vendor_auth_code" :class="{'has-error': errors.vendor_auth_code}"> <b-input type="text" v-model="values.vendor_auth_code"></b-input> </b-field> <b-field :label="'Укажите ваш public_key:'|gettext" :message="errors.public_key" :class="{'has-error': errors.public_key}"> <b-input type="textarea" v-model="values.public_key"></b-input> </b-field> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>3</span></div> <div class="media-content"> <div class="has-mb-1" v-html="webhookText"></div> <div class="field"> <label class="label">{{'URL для Webhook:'|gettext}}</label> <div class="has-feedback"> <input type="text" :value="resultUrl" class="input" onfocus="this.focus();this.select()" readonly="on"> <a class="form-control-feedback has-text-grey-light"><vue-component-clipboard :text="resultUrl" :success-message="'URL скопирован'|gettext"></vue-component-clipboard></a> </div> </div> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>4</span></div> <div class="media-content"> <div class="has-mb-1">{{'Выберите доступные варианты оплаты'|gettext}}</div> <div class="is-block" v-for="v in variants.payments_methods"><b-checkbox :native-value="v.payment_method_id" v-model="values.payments_methods">{{v.payment_method_title|gettext}}</b-checkbox></div> </div> </div> </div>`});

window.$app.defineComponent("settings", "vue-settings-payments-providers-payanyway", {props: ['values', 'variants', 'payment_provider_id', 'is_new'],
		mixins: [FormModel],
		
		computed: {
			checkUrl() {
				return 'https://taplink.cc/payments/payanyway/check.html';
			},

			payUrl() {
				return 'https://taplink.cc/payments/payanyway/result.html';
			},

			comebackUrl() {
				return this.variants.domain_base+'/payments/payanyway/comeback.html';
			},
			
			processingUrl() {
				return this.variants.domain_base+'/payments/payanyway/processing.html';
			}
		}, template: `<div> <div class="media"> <div class="media-left"><span class='tag is-dark'>1</span></div> <div class="media-content"> <p><a href="https://payanyway.ru" target="_blank">Зарегистрируйтесь</a> на сайте payanyway.ru</p> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>2</span></div> <div class="media-content"> <div class="row row-small"> <div class="col-xs-12 col-sm-6 has-xs-mb-2"> <b-field label="Номер счета, полученный при подключении:" :message="errors.mnt_id" :class="{'has-error': errors.mnt_id}"> <b-input type="text" v-model="values.mnt_id"></b-input> </b-field> </div> <div class="col-xs-12 col-sm-6"> <b-field label="Код проверки целостности данных:" :message="errors.password" :class="{'has-error': errors.password}"> <b-input type="text" v-model="values.password"></b-input> </b-field> </div> </div> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>3</span></div> <div class="media-content"> <div class="has-mb-1">Укажите настройки уведомлений об оплате </div> <div class="field"> <label class="label">Check URL:</label> <div class="has-feedback"> <input type="text" :value="checkUrl" class="input" onfocus="this.focus();this.select()" readonly="on"> <a class="form-control-feedback has-text-grey-light"><vue-component-clipboard :text="checkUrl" :success-message="'URL скопирован'|gettext"></vue-component-clipboard></a> </div> </div> <div class="field"> <label class="label">Pay URL:</label> <div class="has-feedback"> <input type="text" :value="payUrl" class="input" onfocus="this.focus();this.select()" readonly="on"> <a class="form-control-feedback has-text-grey-light"><vue-component-clipboard :text="payUrl" :success-message="'URL скопирован'|gettext"></vue-component-clipboard></a> </div> </div> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>4</span></div> <div class="media-content"> <div class="has-mb-1">Укажите настройки возврата в магазин</div> <div class="field"> <label class="label">Success URL, Fail URL, Return URL:</label> <div class="has-feedback"> <input type="text" :value="comebackUrl" class="input" onfocus="this.focus();this.select()" readonly="on"> <a class="form-control-feedback has-text-grey-light"><vue-component-clipboard :text="comebackUrl" :success-message="'URL скопирован'|gettext"></vue-component-clipboard></a> </div> </div> <div class="field"> <label class="label">InProgress URL:</label> <div class="has-feedback"> <input type="text" :value="processingUrl" class="input" onfocus="this.focus();this.select()" readonly="on"> <a class="form-control-feedback has-text-grey-light"><vue-component-clipboard :text="processingUrl" :success-message="'URL скопирован'|gettext"></vue-component-clipboard></a> </div> </div> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>5</span></div> <div class="media-content"> <div class="has-mb-1">{{'Выберите доступные варианты оплаты'|gettext}}</div> <div class="is-block" v-for="v in variants.payments_methods"><b-checkbox :native-value="v.payment_method_id" v-model="values.payments_methods">{{v.payment_method_title|gettext}}</b-checkbox></div> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>6</span></div> <div class="media-content"> <div>Онлайн касса</div> <b-checkbox v-model="values.onlinekassa">Использовать Payanyway в качестве онлайн кассы для отправки чеков</b-checkbox> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>7</span></div> <div class="media-content"> <div class="has-mb-1">{{'Режим работы'|gettext}}</div> <div class="row"> <div class="col-xs-12 col-sm-6"><label class="radio"><input type='radio' name='mode' value="test" v-model="values.mode"> {{'Тестовый режим'|gettext}}</label></div> <div class="col-xs-12 col-sm-6"><label class="radio"><input type='radio' name='mode' value="work" v-model="values.mode"> {{'Рабочий режим'|gettext}}</label></div> </div> </div> </div> </div>`});

window.$app.defineComponent("settings", "vue-settings-payments-providers-paybox", {props: ['values', 'variants', 'payment_provider_id', 'is_new'],
		mixins: [FormModel], template: `<div> <div class="media"> <div class="media-left"><span class='tag is-dark'>1</span></div> <div class="media-content"> <p><a href="https://paybox.money" target="_blank">Зарегистрируйтесь</a> на сайте paybox.money</p> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>2</span></div> <div class="media-content"> <b-field label='Укажите ваш "merchant_id"' :message="errors.merchant_id" :class="{'has-error': errors.merchant_id}"> <b-input type="text" v-model="values.merchant_id"></b-input> </b-field> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>3</span></div> <div class="media-content"> <b-field label='Укажите ваш "secret_key"' :message="errors.secret_key" :class="{'has-error': errors.secret_key}"> <b-input type="text" v-model="values.secret_key"></b-input> </b-field> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>4</span></div> <div class="media-content"> <div class="has-mb-1">Выберите доступные варианты оплаты</div> <div class="is-block" v-for="v in variants.payments_methods"><b-checkbox :native-value="v.payment_method_id" v-model="values.payments_methods">{{v.payment_method_title}}</b-checkbox></div> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>5</span></div> <div class="media-content"> <div class="has-mb-1">Режим работы</div> <div class="row"> <div class="col-xs-12 col-sm-6"><label class="radio"><input type='radio' name='mode' value="test" v-model="values.mode"> Тестовый режим</label></div> <div class="col-xs-12 col-sm-6"><label class="radio"><input type='radio' name='mode' value="work" v-model="values.mode"> Рабочий режим</label></div> </div> </div> </div> </div>`});

window.$app.defineComponent("settings", "vue-settings-payments-providers-payeer", {computed: {
			domain() {
				return this.$account.custom_domain_verified?this.$account.link:'https://'+this.variants.domain_must;
			},
			
			comebackUrl() {
				return this.$account.custom_domain_verified?(this.variants.domain_must+'/payments/payeer/comeback.html'):'';
			},

			resultUrl() {
				return this.$account.custom_domain_verified?(this.variants.domain_must+'/payments/payeer/result.html'):'';
			}
		},
		props: ['values', 'variants', 'payment_provider_id', 'is_new'],
		mixins: [FormModel], template: `<div> <div class="media"> <div class="media-left"><span class='tag is-dark'>1</span></div> <div class="media-content"> <p><a href="https://www.peyeer.com/" target="_blank">Зарегистрируйтесь</a> на сайте www.peyeer.com<br> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>2</span></div> <div class="media-content"> <div class="has-mb-1">Укажите адрес сайта:</div> <div class="field" v-if="$account.custom_domain"> <div class="has-feedback"> <input type="text" :value="domain" class="input" onfocus="this.focus();this.select()" readonly="on"> <a class="form-control-feedback has-text-grey-light"><vue-component-clipboard :text="domain" :success-message="'URL скопирован'|gettext"></vue-component-clipboard></a> </div> </div> <div v-else class="message is-danger"> <div class="message-body">Payeer требует наличие своего доменного имени</div> </div> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>3</span></div> <div class="media-content"> <b-field label="Укажите содержимое проверочного файла:"> <b-input type="text" v-model="values.verifycode"></b-input> </b-field> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>4</span></div> <div class="media-content"> <div class="has-mb-1">Введите полученные "ID" и "Секретный ключ"</div> <b-field label="ID:" :message="errors.id" :class="{'has-error': errors.id}"> <b-input type="text" v-model="values.id"></b-input> </b-field> <b-field label="Секретный ключ:" :message="errors.secret" :class="{'has-error': errors.secret}"> <b-input type="text" v-model="values.secret"></b-input> </b-field> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>5</span></div> <div class="media-content"> <div class="has-mb-1">Укажите настройки</div> <div class="field"> <label class="label">URL успешной оплаты:</label> <div class="has-feedback"> <input type="text" :value="comebackUrl" class="input" onfocus="this.focus();this.select()" readonly="on"> <a class="form-control-feedback has-text-grey-light"><vue-component-clipboard :text="comebackUrl" :success-message="'URL скопирован'|gettext"></vue-component-clipboard></a> </div> </div> <div class="field"> <label class="label">URL неуспешной оплаты:</label> <div class="has-feedback"> <input type="text" :value="comebackUrl" class="input" onfocus="this.focus();this.select()" readonly="on"> <a class="form-control-feedback has-text-grey-light"><vue-component-clipboard :text="comebackUrl" :success-message="'URL скопирован'|gettext"></vue-component-clipboard></a> </div> </div> <div class="field"> <label class="label">URL обработчика:</label> <div class="has-feedback"> <input type="text" :value="resultUrl" class="input" onfocus="this.focus();this.select()" readonly="on"> <a class="form-control-feedback has-text-grey-light"><vue-component-clipboard :text="resultUrl" :success-message="'URL скопирован'|gettext"></vue-component-clipboard></a> </div> </div> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>6</span></div> <div class="media-content"> <div class="has-mb-1">Выберите доступные варианты оплаты</div> <div class="is-block" v-for="v in variants.payments_methods"><b-checkbox :native-value="v.payment_method_id" v-model="values.payments_methods">{{v.payment_method_title}}</b-checkbox></div> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>7</span></div> <div class="media-content"> <div class="has-mb-1">Режим работы</div> <div class="row"> <div class="col-xs-12 col-sm-6"><label class="radio"><input type='radio' name='mode' value="test" v-model="values.mode"> Тестовый режим</label></div> <div class="col-xs-12 col-sm-6"><label class="radio"><input type='radio' name='mode' value="work" v-model="values.mode"> Рабочий режим</label></div> </div> </div> </div> </div>`});

window.$app.defineComponent("settings", "vue-settings-payments-providers-paymaster", {computed: {
			domain() {
				return this.variants.domain_base+'/';
			},
			
			notifyUrl() {
				return this.variants.domain_must+'/payments/paymaster/result.html';
			},

			successUrl() {
				return this.variants.domain_must+'/payments/paymaster/success.html';
			},
			
			failUrl() {
				return this.variants.domain_must+'/payments/paymaster/fail.html';
			}
		},

		props: ['values', 'variants', 'payment_provider_id', 'is_new'],
		mixins: [FormModel], template: `<div> <div class="media"> <div class="media-left"><span class='tag is-dark'>1</span></div> <div class="media-content"> <p><a href="https://paymaster.ru" target="_blank">Зарегистрируйтесь</a> на сайте PayMaster.ru</p> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>2</span></div> <div class="media-content"> <div class="has-mb-1">Заполните раздел "Обратные вызовы", везде выберите POST запрос</div> <div class="field"> <label class="label">Payment notification:</label> <div class="has-feedback"> <input type="text" :value="notifyUrl" class="input" onfocus="this.focus();this.select()" readonly="on"> <a class="form-control-feedback has-text-grey-light"><vue-component-clipboard :text="notifyUrl" :success-message="'URL скопирован'|gettext"></vue-component-clipboard></a> </div> </div> <div class="field"> <label class="label">Success redirect и Fail redirect:</label> <div class="has-feedback"> <input type="text" :value="successUrl" class="input" onfocus="this.focus();this.select()" readonly="on"> <a class="form-control-feedback has-text-grey-light"><vue-component-clipboard :text="successUrl" :success-message="'URL скопирован'|gettext"></vue-component-clipboard></a> </div> </div> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>3</span></div> <div class="media-content"> Включите галочку "Повторно отправлять Payment Notification при сбоях" и "Разрешена замена URL" </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>4</span></div> <div class="media-content"> <div class="has-mb-1">Укажите полученные данные от PayMaster</div> <b-field :label="'Идентификатор сайта:'|gettext" :message="errors.merchant_id" :class="{'has-error': errors.merchant_id}"> <b-input type="text" v-model="values.merchant_id"></b-input> </b-field> <b-field :label="'Секретный ключ:'|gettext" :message="errors.secret" :class="{'has-error': errors.secret}"> <b-input type="text" v-model="values.secret"></b-input> </b-field> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>5</span></div> <div class="media-content"> <div class="has-mb-1">{{'Выберите доступные варианты оплаты'|gettext}}</div> <div class="is-block" v-for="v in variants.payments_methods"><b-checkbox :native-value="v.payment_method_id" v-model="values.payments_methods">{{v.payment_method_title|gettext}}</b-checkbox></div> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>6</span></div> <div class="media-content"> <div>Онлайн касса</div> <b-checkbox v-model="values.onlinekassa">Использовать PayMaster в качестве онлайн кассы для отправки чеков</b-checkbox> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>7</span></div> <div class="media-content"> <div class="has-mb-1">{{'Режим работы'|gettext}}</div> <div class="row"> <div class="col-xs-12 col-sm-6"><label class="radio"><input type='radio' name='mode' value="test" v-model="values.mode"> {{'Тестовый режим'|gettext}}</label></div> <div class="col-xs-12 col-sm-6"><label class="radio"><input type='radio' name='mode' value="work" v-model="values.mode"> {{'Рабочий режим'|gettext}}</label></div> </div> </div> </div> </div>`});

window.$app.defineComponent("settings", "vue-settings-payments-providers-paymentwall", {computed: {
			signupText() {
				return this.$gettext('<a %s>Зарегистрируйтесь</a> на сайте paymentwall.com').replace('%s', 'href="https://paymentwall.com" target="_blank"');
			}
			
		},
		props: ['values', 'variants', 'payment_provider_id', 'is_new'],
		mixins: [FormModel], template: `<div> <div class="media"> <div class="media-left"><span class='tag is-dark'>1</span></div> <div class="media-content"> <p v-html="signupText"></p> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>2</span></div> <div class="media-content"> <b-field :label="'Укажите ваш public_key:'|gettext" :message="errors.public_key" :class="{'has-error': errors.public_key}"> <b-input type="text" v-model="values.public_key"></b-input> </b-field> <b-field :label="'Укажите ваш private_key:'|gettext" :message="errors.private_key" :class="{'has-error': errors.private_key}"> <b-input type="text" v-model="values.private_key"></b-input> </b-field> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>3</span></div> <div class="media-content"> <div class="has-mb-1">{{'Выберите доступные варианты оплаты'|gettext}}</div> <div class="is-block" v-for="v in variants.payments_methods"><b-checkbox :native-value="v.payment_method_id" v-model="values.payments_methods">{{v.payment_method_title|gettext}}</b-checkbox></div> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>4</span></div> <div class="media-content"> <div class="has-mb-1">{{'Режим работы'|gettext}}</div> <div class="row"> <div class="col-xs-12 col-sm-6"><label class="radio"><input type='radio' name='mode' value="test" v-model="values.mode"> {{'Тестовый режим'|gettext}}</label></div> <div class="col-xs-12 col-sm-6"><label class="radio"><input type='radio' name='mode' value="work" v-model="values.mode"> {{'Рабочий режим'|gettext}}</label></div> </div> </div> </div> </div>`});

window.$app.defineComponent("settings", "vue-settings-payments-providers-paypal", {data() {
			return {
				resultUrl: 'https://taplink.cc/payments/paypal/result.html'
			}
		},
		computed: {
			signupText() {
				return this.$gettext('<a %s>Зарегистрируйтесь</a> на сайте paypal.com').replace('%s', 'href="https://www.paypal.com" target="_blank"');
			}
		},
		props: ['values', 'variants', 'payment_provider_id', 'is_new'],
		mixins: [FormModel], template: `<div> <div class="media"> <div class="media-left"><span class='tag is-dark'>1</span></div> <div class="media-content"> <p v-html="signupText"></p> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>2</span></div> <div class="media-content"> <label class="has-mb-1 is-block">{{'Укажите адрес для "Профиль" > "Мои инструменты продаж" > "Уведомления о мгновенных платежах" (IPN)'|gettext}}</label> <div class="field"> <div class="has-feedback"> <input type="text" :value="resultUrl" class="input" onfocus="this.select()" readonly="on"> <a class="form-control-feedback has-text-grey-light"><vue-component-clipboard :text="resultUrl" :success-message="'URL скопирован'|gettext"></vue-component-clipboard></a> </div> </div> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>3</span></div> <div class="media-content"> <b-field :label="'Введите ваш business аккаунт:'|gettext" :message="errors.business" :class="{'has-error': errors.business}"> <b-input type="text" v-model="values.business"></b-input> </b-field> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>4</span></div> <div class="media-content"> <div class="has-mb-1">{{'Выберите доступные варианты оплаты'|gettext}}</div> <div class="is-block" v-for="v in variants.payments_methods"><b-checkbox :native-value="v.payment_method_id" v-model="values.payments_methods">{{v.payment_method_title|gettext}}</b-checkbox></div> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>5</span></div> <div class="media-content"> <div class="has-mb-1">{{'Режим работы'|gettext}}</div> <div class="row"> <div class="col-xs-12 col-sm-6"><label class="radio"><input type='radio' name='mode' value="test" v-model="values.mode"> {{'Тестовый режим'|gettext}}</label></div> <div class="col-xs-12 col-sm-6"><label class="radio"><input type='radio' name='mode' value="work" v-model="values.mode"> {{'Рабочий режим'|gettext}}</label></div> </div> </div> </div> </div>`});

window.$app.defineComponent("settings", "vue-settings-payments-providers-paypostkz", {data() {
			return {
				resultUrl: 'https://taplink.cc/payments/paypostkz/result.html'
			}
		},
		computed: {
			signupText() {
				return this.$gettext('<a %s>Зарегистрируйтесь</a> на сайте pay.post.kz').replace('%s', 'href="http://pay.post.kz" target="_blank"');
			}
		},
		props: ['values', 'variants', 'payment_provider_id', 'is_new'],
		mixins: [FormModel], template: `<div> <div class="media"> <div class="media-left"><span class='tag is-dark'>1</span></div> <div class="media-content"> <p v-html="signupText"></p> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>2</span></div> <div class="media-content"> <div class="field"> <div class="has-feedback"> <input type="text" :value="resultUrl" class="input" onfocus="this.select()" readonly="on"> <a class="form-control-feedback has-text-grey-light"><vue-component-clipboard :text="resultUrl" :success-message="'URL скопирован'|gettext"></vue-component-clipboard></a> </div> </div> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>3</span></div> <div class="media-content"> <b-field :label="'Введите ваш token:'|gettext" :message="errors.business" :class="{'has-error': errors.token}"> <b-input type="text" v-model="values.token"></b-input> </b-field> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>4</span></div> <div class="media-content"> <div class="has-mb-1">{{'Выберите доступные варианты оплаты'|gettext}}</div> <div class="is-block" v-for="v in variants.payments_methods"><b-checkbox :native-value="v.payment_method_id" v-model="values.payments_methods">{{v.payment_method_title|gettext}}</b-checkbox></div> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>5</span></div> <div class="media-content"> <div class="has-mb-1">{{'Режим работы'|gettext}}</div> <div class="row"> <div class="col-xs-12 col-sm-6"><label class="radio"><input type='radio' name='mode' value="test" v-model="values.mode"> {{'Тестовый режим'|gettext}}</label></div> <div class="col-xs-12 col-sm-6"><label class="radio"><input type='radio' name='mode' value="work" v-model="values.mode"> {{'Рабочий режим'|gettext}}</label></div> </div> </div> </div> </div>`});

window.$app.defineComponent("settings", "vue-settings-payments-providers-paysera", {computed: {
			signupText() {
				return this.$gettext('<a %s>Зарегистрируйтесь</a> на сайте paysera.com').replace('%s', 'href="https://paysera.com" target="_blank"');
			}
			
		},
		props: ['values', 'variants', 'payment_provider_id', 'is_new'],
		mixins: [FormModel], template: `<div> <div class="media"> <div class="media-left"><span class='tag is-dark'>1</span></div> <div class="media-content"> <p v-html="signupText"></p> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>2</span></div> <div class="media-content"> <b-field :label="'Укажите ваш projectid:'|gettext" :message="errors.projectid" :class="{'has-error': errors.projectid}"> <b-input type="text" v-model="values.projectid"></b-input> </b-field> <b-field :label="'Укажите ваш password:'|gettext" :message="errors.password" :class="{'has-error': errors.password}"> <b-input type="text" v-model="values.password"></b-input> </b-field> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>3</span></div> <div class="media-content"> <div class="has-mb-1">{{'Выберите доступные варианты оплаты'|gettext}}</div> <div class="is-block" v-for="v in variants.payments_methods"><b-checkbox :native-value="v.payment_method_id" v-model="values.payments_methods">{{v.payment_method_title|gettext}}</b-checkbox></div> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>4</span></div> <div class="media-content"> <div class="has-mb-1">{{'Режим работы'|gettext}}</div> <div class="row"> <div class="col-xs-12 col-sm-6"><label class="radio"><input type='radio' name='mode' value="test" v-model="values.mode"> {{'Тестовый режим'|gettext}}</label></div> <div class="col-xs-12 col-sm-6"><label class="radio"><input type='radio' name='mode' value="work" v-model="values.mode"> {{'Рабочий режим'|gettext}}</label></div> </div> </div> </div> </div>`});

window.$app.defineComponent("settings", "vue-settings-payments-providers-paystack", {data() {
			return {
				resultUrl: 'https://taplink.cc/payments/paystack/result.html',
				comebackUrl: 'https://taplink.cc/payments/paystack/comeback.html'
			}
		},
		computed: {
			signupText() {
				return this.$gettext('<a %s>Зарегистрируйтесь</a> на сайте paystack.com').replace('%s', 'href="https://paystack.com" target="_blank"');
			},
			webhookText() {
				return this.$gettext('<a %s>Установите</a> Callback URL и Webhook URL').replace('%s', 'href="https://dashboard.paystack.com/#/settings/developer" target="_blank"');
			}
			
		},
		props: ['values', 'variants', 'payment_provider_id', 'is_new'],
		mixins: [FormModel], template: `<div> <div class="media"> <div class="media-left"><span class='tag is-dark'>1</span></div> <div class="media-content"> <p v-html="signupText"></p> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>2</span></div> <div class="media-content"> <b-field :label="'Укажите ваш Secret Key:'|gettext" :message="errors.secret_key" :class="{'has-error': errors.secret_key}"> <b-input type="text" v-model="values.secret_key"></b-input> </b-field> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>3</span></div> <div class="media-content"> <div class="has-mb-1" v-html="webhookText"></div> <div class="field"> <label class="label">{{'Callback URL:'|gettext}}</label> <div class="has-feedback"> <input type="text" :value="comebackUrl" class="input" onfocus="this.focus();this.select()" readonly="on"> <a class="form-control-feedback has-text-grey-light"><vue-component-clipboard :text="comebackUrl" :success-message="'URL скопирован'|gettext"></vue-component-clipboard></a> </div> </div> <div class="field"> <label class="label">{{'Webhook URL:'|gettext}}</label> <div class="has-feedback"> <input type="text" :value="resultUrl" class="input" onfocus="this.focus();this.select()" readonly="on"> <a class="form-control-feedback has-text-grey-light"><vue-component-clipboard :text="resultUrl" :success-message="'URL скопирован'|gettext"></vue-component-clipboard></a> </div> </div> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>4</span></div> <div class="media-content"> <div class="has-mb-1">{{'Выберите доступные варианты оплаты'|gettext}}</div> <div class="is-block" v-for="v in variants.payments_methods"><b-checkbox :native-value="v.payment_method_id" v-model="values.payments_methods">{{v.payment_method_title|gettext}}</b-checkbox></div> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>5</span></div> <div class="media-content"> <div class="has-mb-1">{{'Режим работы'|gettext}}</div> <div class="row"> <div class="col-xs-12 col-sm-6"><label class="radio"><input type='radio' name='mode' value="test" v-model="values.mode"> {{'Тестовый режим'|gettext}}</label></div> <div class="col-xs-12 col-sm-6"><label class="radio"><input type='radio' name='mode' value="work" v-model="values.mode"> {{'Рабочий режим'|gettext}}</label></div> </div> </div> </div> </div>`});

window.$app.defineComponent("settings", "vue-settings-payments-providers-payu", {data() {
			return {
				versions: {lu: 'Live Update', rest21: 'REST API 2.1'}
			}
		},
		
		computed: {
			titles() {
				let titles = {
					lu: {'merchant': 'Merchant', 'secret_key': 'Secret key'},
					rest21: {'merchant': 'POS ID', 'secret_key': 'Second key'}
				}
				
				return titles[this.values.version];
			}
		},
		
		props: ['values', 'variants', 'payment_provider_id', 'is_new'],
		mixins: [FormModel], template: `<div> <div class="media"> <div class="media-left"><span class='tag is-dark'>1</span></div> <div class="media-content"> <p><a href="https://payu.ru" target="_blank">Зарегистрируйтесь</a> на сайте payu.ru</p> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>2</span></div> <div class="media-content"> <div class="has-mb-1">Выберите метод подключения</div> <b-select type="text" v-model="values.version"> <option v-for="(v, id) in versions" :value="id">{{v}}</option> </b-select> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>3</span></div> <div class="media-content"> <div class="has-mb-1">Укажите полученные данные от PayU</div> <b-field :label="titles.merchant" :message="errors.merchant" :class="{'has-error': errors.merchant}"> <b-input type="text" v-model="values.merchant"></b-input> </b-field> <b-field :label="titles.secret_key" :message="errors.secret_key" :class="{'has-error': errors.secret_key}"> <b-input type="text" v-model="values.secret_key"></b-input> </b-field> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>4</span></div> <div class="media-content"> <div class="has-mb-1">{{'Выберите доступные варианты оплаты'|gettext}}</div> <div class="is-block" v-for="v in variants.payments_methods"><b-checkbox :native-value="v.payment_method_id" v-model="values.payments_methods">{{v.payment_method_title|gettext}}</b-checkbox></div> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>5</span></div> <div class="media-content"> <div class="has-mb-1">{{'Режим работы'|gettext}}</div> <div class="row"> <div class="col-xs-12 col-sm-6"><label class="radio"><input type='radio' name='mode' value="test" v-model="values.mode"> {{'Тестовый режим'|gettext}}</label></div> <div class="col-xs-12 col-sm-6"><label class="radio"><input type='radio' name='mode' value="work" v-model="values.mode"> {{'Рабочий режим'|gettext}}</label></div> </div> </div> </div> </div>`});

window.$app.defineComponent("settings", "vue-settings-payments-providers-pulpal", {data() {
			return {
				resultUrl: 'https://taplink.cc/payments/pulpal/result.html',
				redirectUrl: 'https://taplink.cc/payments/pulpal/comeback.html'
			}
		},
		props: ['values', 'variants', 'payment_provider_id', 'is_new'],
		mixins: [FormModel],
		
		computed: {
			resultUrl() {
				return this.variants.domain_base+'/payments/pulpal/result.html';
			},

			redirectUrl() {
				return this.variants.domain_base+'/payments/pulpal/comeback.html';
			},
			
			signupText() {
				return this.$gettext('<a %s>Зарегистрируйтесь</a> на сайте pulpal.az').replace('%s', 'href="https://pulpal.az" target="_blank"');
			}
		}, template: `<div> <div class="media"> <div class="media-left"><span class='tag is-dark'>1</span></div> <div class="media-content"> <p v-html="signupText"></p> <div v-if="i18n.locale == 'az'"> <br> <p>Pulpal'da hesabıma ödəniş qəbul etmək üçün nə lazımdır?</p> <p>- Hüquqi şəxslər üçün:</p> <p>1.Cixarış</p> <p>2.VÖEN</p> <p>3.Nizamnamə</p> <p>4.Şəxsiyyət vəsiqəsi direktorun</p> <p>5.Direktorun təyin olunması</p><br> <p>Fərdi sahibkar üçün:</p> <p>1. VÖEN</p> <p>2. Şəxsiyyət vəsiqəsi</p><br> <p>Müqaviləni yükləyirsiniz, tələb olunan məlumatları daxil edirsiniz və <a href='mailto:office@pulpal.az' target="_blank">office@pulpal.az</a> email ünvanına göndərirsiniz. Gün ərzində hesabınız aktivləşdirilir. Daha sonra öz məhslunuzu və ya xidmətinizi müştərilərinizə sata bilərsiniz.</p> </div> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>2</span></div> <div class="media-content"> <label class="has-mb-1 is-block">{{'Укажите адрес для Delivery URL и Redirect URL'|gettext}}</label> <div class="field"> <label class="label">Delivery URL</label> <div class="has-feedback"> <input type="text" :value="resultUrl" class="input" onfocus="this.select()" readonly="on"> <a class="form-control-feedback has-text-grey-light"><vue-component-clipboard :text="resultUrl" :success-message="'URL скопирован'|gettext"></vue-component-clipboard></a> </div> </div> <div class="field"> <label class="label">Redirect URL</label> <div class="has-feedback"> <input type="text" :value="redirectUrl" class="input" onfocus="this.select()" readonly="on"> <a class="form-control-feedback has-text-grey-light"><vue-component-clipboard :text="redirectUrl" :success-message="'URL скопирован'|gettext"></vue-component-clipboard></a> </div> </div> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>3</span></div> <div class="media-content"> <div class="has-mb-1">{{'Укажите полученные данные от PulPal'|gettext}}</div> <b-field :label="'merchant_id:'|gettext" :message="errors.merchant_id" :class="{'has-error': errors.merchant_id}"> <b-input type="text" v-model="values.merchant_id"></b-input> </b-field> <b-field :label="'key:'|gettext" :message="errors.key" :class="{'has-error': errors.key}"> <b-input type="text" v-model="values.key"></b-input> </b-field> <b-field :label="'salt:'|gettext" :message="errors.salt" :class="{'has-error': errors.salt}"> <b-input type="text" v-model="values.salt"></b-input> </b-field> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>4</span></div> <div class="media-content"> <div class="has-mb-1">{{'Выберите доступные варианты оплаты'|gettext}}</div> <div class="is-block" v-for="v in variants.payments_methods"><b-checkbox :native-value="v.payment_method_id" v-model="values.payments_methods">{{v.payment_method_title|gettext}}</b-checkbox></div> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>5</span></div> <div class="media-content"> <div class="has-mb-1">{{'Режим работы'|gettext}}</div> <div class="row"> <div class="col-xs-12 col-sm-6"><label class="radio"><input type='radio' name='mode' value="test" v-model="values.mode"> {{'Тестовый режим'|gettext}}</label></div> <div class="col-xs-12 col-sm-6"><label class="radio"><input type='radio' name='mode' value="work" v-model="values.mode"> {{'Рабочий режим'|gettext}}</label></div> </div> </div> </div> </div>`});

window.$app.defineComponent("settings", "vue-settings-payments-providers-robokassa", {props: ['values', 'variants', 'payment_provider_id', 'is_new'],
		computed: {
			domain() {
				return this.variants.domain_must+'/';
			},
			
			resultUrl() {
				return this.variants.domain_must+'/payments/robokassa/result.html';
			},

			successUrl() {
				return this.variants.domain_must+'/payments/robokassa/success.html';
			},
			
			failUrl() {
				return this.variants.domain_must+'/payments/robokassa/fail.html';
			}
		},
		mixins: [FormModel], template: `<div> <div class="message is-success"><div class="message-body">Инструкции по настройке Робокассы <a href="/guide/payments-robokassa.html" target="_blank" class="is-pulled-right">Посмотреть <i class="fa fa-angle-right" style="margin-left: 5px"></i></a></div></div> <div class="media"> <div class="media-left"><span class='tag is-dark'>1</span></div> <div class="media-content"> <p><a href="https://partner.robokassa.ru/Reg/Register" target="_blank">Зарегистрируйтесь</a> на сайте robokassa.ru и добавьте магазин<br> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>2</span></div> <div class="media-content"> <div class="has-mb-1">Укажите настройки </div> <div class="field"> <label class="label">URL сайта:</label> <div class="has-feedback"> <input type="text" :value="domain" class="input" onfocus="this.focus();this.select()" readonly="on"> <a class="form-control-feedback has-text-grey-light"><vue-component-clipboard :text="domain" :success-message="'URL скопирован'|gettext"></vue-component-clipboard></a> </div> </div> <div class="field"> <label class="label">Result URL:</label> <div class="has-feedback"> <input type="text" :value="resultUrl" class="input" onfocus="this.focus();this.select()" readonly="on"> <a class="form-control-feedback has-text-grey-light"><vue-component-clipboard :text="resultUrl" :success-message="'URL скопирован'|gettext"></vue-component-clipboard></a> </div> </div> <div class="field"> <label class="label">Success URL:</label> <div class="has-feedback"> <input type="text" :value="successUrl" class="input" onfocus="this.focus();this.select()" readonly="on"> <a class="form-control-feedback has-text-grey-light"><vue-component-clipboard :text="successUrl" :success-message="'URL скопирован'|gettext"></vue-component-clipboard></a> </div> </div> <div class="field"> <label class="label">Fail URL:</label> <div class="has-feedback"> <input type="text" :value="failUrl" class="input" onfocus="this.focus();this.select()" readonly="on"> <a class="form-control-feedback has-text-grey-light"><vue-component-clipboard :text="failUrl" :success-message="'URL скопирован'|gettext"></vue-component-clipboard></a> </div> </div> <p>Алгоритм расчета хеша необходимо указать MD5, а метод отсылки данных везде указать GET</p> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>3</span></div> <div class="media-content"> <div class="has-mb-1">Укажите Идентификатор магазина, 'Пароль #1' и 'Пароль #2'</div> <b-field label="Идентификатор магазина:" :message="errors.login" :class="{'has-error': errors.login}"> <b-input type="text" v-model="values.login"></b-input> </b-field> <b-field label="Пароль #1:" :message="errors.password_1" :class="{'has-error': errors.password_1}"> <b-input type="text" v-model="values.password_1"></b-input> </b-field> <b-field label="Пароль #2:" :message="errors.password_2" :class="{'has-error': errors.password_2}"> <b-input type="text" v-model="values.password_2"></b-input> </b-field> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>4</span></div> <div class="media-content"> <div class="has-mb-1">Выберите доступные варианты оплаты</div> <div class="is-block" v-for="v in variants.payments_methods"><b-checkbox :native-value="v.payment_method_id" v-model="values.payments_methods">{{v.payment_method_title}}</b-checkbox></div> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>5</span></div> <div class="media-content"> <div>Онлайн касса</div> <b-checkbox v-model="values.onlinekassa">Использовать Робокассу в качестве онлайн кассы для отправки чеков</b-checkbox> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>6</span></div> <div class="media-content"> <div class="has-mb-1">Кто оплачивает комиссию Робокассы?</div> <div class="row"> <div class="col-xs-12 col-sm-6"><label class="radio"><input type='radio' name='commission' value="buyer" v-model="values.commission"> Покупатель</label></div> <div class="col-xs-12 col-sm-6"><label class="radio"><input type='radio' name='commission' value="seller" v-model="values.commission"> Продавец</label></div> </div> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>7</span></div> <div class="media-content"> <div class="has-mb-1">Режим работы</div> <div class="row"> <div class="col-xs-12 col-sm-6"><label class="radio"><input type='radio' name='mode' value="test" v-model="values.mode"> Тестовый режим</label></div> <div class="col-xs-12 col-sm-6"><label class="radio"><input type='radio' name='mode' value="work" v-model="values.mode"> Рабочий режим</label></div> </div> </div> </div> </div>`});

window.$app.defineComponent("settings", "vue-settings-payments-providers-sberbank", {/*
		data() {
			return {
				resultUrl: this.variants.domain_base+'/payments/sberbank/result.html'
			}
		},
*/
		props: ['values', 'variants', 'payment_provider_id', 'is_new'],
		mixins: [FormModel], template: `<div> <div class="media"> <div class="media-left"><span class='tag is-dark'>1</span></div> <div class="media-content"> <p><a href="https://www.sberbank.ru/ru/s_m_business/bankingservice/acquiring_total" target="_blank">Зарегистрируйтесь</a> на сайте эквайринга от Сбербанка</p> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>2</span></div> <div class="media-content"> <div class="row"> <div class="col-xs-12 col-sm-6"> <b-field :label="'Логин служебной учётной записи продавца:'|gettext" :message="errors.username" :class="{'has-error': errors.username}"> <b-input type="text" v-model="values.username"></b-input> </b-field> <b-field :label="'Пароль служебной учётной записи продавца:'|gettext" :message="errors.password" :class="{'has-error': errors.password}"> <b-input type="text" v-model="values.password"></b-input> </b-field> </div> </div> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>3</span></div> <div class="media-content"> <div class="has-mb-1">{{'Выберите доступные варианты оплаты'|gettext}}</div> <div class="is-block" v-for="v in variants.payments_methods"><b-checkbox :native-value="v.payment_method_id" v-model="values.payments_methods">{{v.payment_method_title|gettext}}</b-checkbox></div> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>4</span></div> <div class="media-content"> <div>Двухстадийная оплата</div> <b-checkbox v-model="values.withaccept">Подтверждать каждую оплату в личном кабинете</b-checkbox> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>5</span></div> <div class="media-content"> <div class="has-mb-1">{{'Режим работы'|gettext}}</div> <div class="row"> <div class="col-xs-12 col-sm-6"><label class="radio"><input type='radio' name='mode' value="test" v-model="values.mode"> {{'Тестовый режим'|gettext}}</label></div> <div class="col-xs-12 col-sm-6"><label class="radio"><input type='radio' name='mode' value="work" v-model="values.mode"> {{'Рабочий режим'|gettext}}</label></div> </div> </div> </div> </div>`});

window.$app.defineComponent("settings", "vue-settings-payments-providers-sposkz", {data() {
			return {
				resultUrl: 'https://taplink.cc/payments/ecommpay/result.html'
			}
		},
		props: ['values', 'variants', 'payment_provider_id', 'is_new'],
		mixins: [FormModel],
		computed: {
			signupText() {
				return this.$gettext('<a %s>Зарегистрируйтесь</a> на сайте spos.kz').replace('%s', 'href="https://spos.kz" target="_blank"');
			}
		}, template: `<div> <div class="media"> <div class="media-left"><span class='tag is-dark'>1</span></div> <div class="media-content"> <p v-html="signupText"></p> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>3</span></div> <div class="media-content"> <div class="has-mb-1">{{'Укажите полученные данные от Smart Pay'|gettext}}</div> <b-field :label="'merchant_id:'|gettext" :message="errors.merchant_id" :class="{'has-error': errors.merchant_id}"> <b-input type="text" v-model="values.merchant_id"></b-input> </b-field> <b-field :label="'key:'|gettext" :message="errors.key" :class="{'has-error': errors.key}"> <b-input type="text" v-model="values.key"></b-input> </b-field> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>4</span></div> <div class="media-content"> <div class="has-mb-1">{{'Выберите доступные варианты оплаты'|gettext}}</div> <div class="is-block" v-for="v in variants.payments_methods"><b-checkbox :native-value="v.payment_method_id" v-model="values.payments_methods">{{v.payment_method_title|gettext}}</b-checkbox></div> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>5</span></div> <div class="media-content"> <div class="has-mb-1">{{'Режим работы'|gettext}}</div> <div class="row"> <div class="col-xs-12 col-sm-6"><label class="radio"><input type='radio' name='mode' value="test" v-model="values.mode"> {{'Тестовый режим'|gettext}}</label></div> <div class="col-xs-12 col-sm-6"><label class="radio"><input type='radio' name='mode' value="work" v-model="values.mode"> {{'Рабочий режим'|gettext}}</label></div> </div> </div> </div> </div>`});

window.$app.defineComponent("settings", "vue-settings-payments-providers-square", {data() {
			return {
				resultUrl: 'https://taplink.cc/payments/square/result.html'
			}
		},
		computed: {
			signupText() {
				return this.$gettext('<a %s>Зарегистрируйтесь</a> на сайте squareup.com').replace('%s', 'href="https://squareup.com" target="_blank"');
			}
		},
		props: ['values', 'variants', 'payment_provider_id', 'is_new'],
		mixins: [FormModel],
		
		created() {
			this.$io.on('events:payments.square:connect.resolve', this.connectResolve);
		},
		
		destroyed() {
			this.$io.off('events:payments.square:connect.resolve', this.connectResolve);
		},
				
		methods: {
			connectResolve(values) {
				_.each(values, (v, k) => { this.values[k] = v; });
				this.$parent.save(false, false);
			},

			connect() {
				this.$parent.popupCenter('/payments/square/connect.html', 'square', 70, .6, 800, 400);
			}
		}, template: `<div> <div class="media"> <div class="media-left"><span class='tag is-dark'>1</span></div> <div class="media-content"> <p v-html="signupText"></p> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>2</span></div> <div class="media-content"> <div class="has-mb-1">{{'Подключите интеграцию'|gettext}}</div> <b-field :message="errors.access_token" :class="{'has-error': errors.access_token}"> <button class="button is-success" @click="connect"><i class="fas fa-plug has-mr-2"></i> {{'Подключить'|gettext}}</button> <div class="form-control-static has-ml-2 has-text-success" v-if="values.access_token"> <i class="fas fa-check has-mr-1"></i> {{'Готово'|gettext}} </div> </b-field> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>3</span></div> <div class="media-content"> <div class="has-mb-1">{{'Выберите доступные варианты оплаты'|gettext}}</div> <div class="is-block" v-for="v in variants.payments_methods"><b-checkbox :native-value="v.payment_method_id" v-model="values.payments_methods">{{v.payment_method_title|gettext}}</b-checkbox></div> </div> </div> </div>`});

window.$app.defineComponent("settings", "vue-settings-payments-providers-stripe", {data() {
			return {
				resultUrl: 'https://taplink.cc/payments/stripe/result.html'
			}
		},
		computed: {
			signupText() {
				return this.$gettext('<a %s>Зарегистрируйтесь</a> на сайте stripe.com').replace('%s', 'href="https://stripe.com" target="_blank"');
			}
		},
		props: ['values', 'variants', 'payment_provider_id', 'is_new'],
		mixins: [FormModel], template: `<div> <div class="media"> <div class="media-left"><span class='tag is-dark'>1</span></div> <div class="media-content"> <p v-html="signupText"></p> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>2</span></div> <div class="media-content"> <b-field :label="'Укажите ваш Publishable key:'|gettext" :message="errors.pk" :class="{'has-error': errors.pk}"> <b-input type="text" v-model="values.pk"></b-input> </b-field> <b-field :label="'Укажите ваш Secret key:'|gettext" :message="errors.sk" :class="{'has-error': errors.sk}"> <b-input type="text" v-model="values.sk"></b-input> </b-field> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>3</span></div> <div class="media-content"> <div class="has-mb-1">{{'Выберите доступные варианты оплаты'|gettext}}</div> <div class="is-block" v-for="v in variants.payments_methods"><b-checkbox :native-value="v.payment_method_id" v-model="values.payments_methods">{{v.payment_method_title|gettext}}</b-checkbox></div> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>4</span></div> <div class="media-content"> <div class="has-mb-1">{{'Режим работы'|gettext}}</div> <div class="row"> <div class="col-xs-12 col-sm-6"><label class="radio"><input type='radio' name='mode' value="test" v-model="values.mode"> {{'Тестовый режим'|gettext}}</label></div> <div class="col-xs-12 col-sm-6"><label class="radio"><input type='radio' name='mode' value="work" v-model="values.mode"> {{'Рабочий режим'|gettext}}</label></div> </div> </div> </div> </div>`});

window.$app.defineComponent("settings", "vue-settings-payments-providers-tinkoff", {/*
		data() {
			return {
				resultUrl: "http://taplink.cc/payments/tinkoff/result.html",
				successUrl: "http://taplink.cc/payments/tinkoff/success.html",
				failUrl: "http://taplink.cc/payments/tinkoff/fail.html"
			}
		},
*/
		props: ['values', 'variants', 'payment_provider_id', 'is_new'],
		mixins: [FormModel], template: `<div> <div class="media"> <div class="media-left"><span class='tag is-dark'>1</span></div> <div class="media-content"> <p><a href="https://oplata.tinkoff.ru" target="_blank">Зарегистрируйтесь</a> на сайте oplata.tinkoff.ru</p> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>2</span></div> <div class="media-content"> <label>Укажите тип нотификации "HTTP"</label> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>3</span></div> <div class="media-content"> <b-field label='Укажите ваш "Терминал":' :message="errors.terminalkey" :class="{'has-error': errors.terminalkey}"> <b-input type="text" v-model="values.terminalkey"></b-input> </b-field> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>4</span></div> <div class="media-content"> <b-field label='Укажите ваш "Пароль":' :message="errors.password" :class="{'has-error': errors.password}"> <b-input type="text" v-model="values.password"></b-input> </b-field> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>5</span></div> <div class="media-content"> <div class="has-mb-1">Выберите доступные варианты оплаты</div> <div class="is-block" v-for="v in variants.payments_methods"><b-checkbox :native-value="v.payment_method_id" v-model="values.payments_methods">{{v.payment_method_title}}</b-checkbox></div> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>6</span></div> <div class="media-content"> <div>Онлайн касса</div> <b-checkbox v-model="values.onlinekassa">Использовать Тинькофф в качестве онлайн кассы для отправки чеков</b-checkbox> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>7</span></div> <div class="media-content"> <div>Двухстадийная оплата</div> <b-checkbox v-model="values.withaccept">Подтверждать каждую оплату в личном кабинете</b-checkbox> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>8</span></div> <div class="media-content"> <div class="has-mb-1">Режим работы</div> <div class="row"> <div class="col-xs-12 col-sm-6"><label class="radio"><input type='radio' name='mode' value="test" v-model="values.mode"> Тестовый режим</label></div> <div class="col-xs-12 col-sm-6"><label class="radio"><input type='radio' name='mode' value="work" v-model="values.mode"> Рабочий режим</label></div> </div> </div> </div> </div>`});

window.$app.defineComponent("settings", "vue-settings-payments-providers-unitpay", {computed: {
			resultUrl() {
				return 'https://taplink.cc/payments/unitpay/result.html';
			},
			signupText() {
				return this.$gettext('<a %s>Зарегистрируйтесь</a> на сайте unitpay.ru').replace('%s', 'href="https://unitpay.ru" target="_blank"');
			},
			domain() {
				return this.$account.custom_domain_verified?this.$account.link:'https://'+this.variants.domain_must;
			}			
		},
		props: ['values', 'variants', 'payment_provider_id', 'is_new'],
		mixins: [FormModel], template: `<div> <div class="media"> <div class="media-left"><span class='tag is-dark'>1</span></div> <div class="media-content"> <p v-html="signupText"></p> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>2</span></div> <div class="media-content"> <div class="has-mb-1">Добавьте проект и укажите настройки настройки </div> <div class="field" v-if="$account.custom_domain"> <label class="label">URL проекта:</label> <div class="has-feedback"> <input type="text" :value="domain" class="input" onfocus="this.focus();this.select()" readonly="on"> <a class="form-control-feedback has-text-grey-light"><vue-component-clipboard :text="domain" :success-message="'URL скопирован'|gettext"></vue-component-clipboard></a> <p class="has-mt-1">Для подтверждения сайта используйте Мета-тег который следует разместить в HTML коде (Настройки -> Общие -> Вставка HTML кода) </div> </div> <div v-else class="message is-danger"> <div class="message-body">Unitpay требует наличие своего доменного имени</div> </div> <div class="field"> <label class="label">Обработчик платежей:</label> <div class="has-feedback"> <input type="text" :value="resultUrl" class="input" onfocus="this.focus();this.select()" readonly="on"> <a class="form-control-feedback has-text-grey-light"><vue-component-clipboard :text="resultUrl" :success-message="'URL скопирован'|gettext"></vue-component-clipboard></a> </div> </div> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>3</span></div> <div class="media-content"> <b-field :label="'Укажите ID вашего проекта:'|gettext" :message="errors.project_id" :class="{'has-error': errors.project_id}"> <b-input type="text" v-model="values.project_id"></b-input> </b-field> <b-field :label="'Укажите ваш секретный ключ:'|gettext" :message="errors.secret_key" :class="{'has-error': errors.secret_key}"> <b-input type="text" v-model="values.secret_key"></b-input> </b-field> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>4</span></div> <div class="media-content"> <div class="has-mb-1">{{'Выберите доступные варианты оплаты'|gettext}}</div> <div class="is-block" v-for="v in variants.payments_methods"><b-checkbox :native-value="v.payment_method_id" v-model="values.payments_methods">{{v.payment_method_title|gettext}}</b-checkbox></div> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>5</span></div> <div class="media-content"> <div>Онлайн касса</div> <b-checkbox v-model="values.onlinekassa">Использовать Unitpay в качестве онлайн кассы для отправки чеков</b-checkbox> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>6</span></div> <div class="media-content"> <div>Двухстадийная оплата</div> <b-checkbox v-model="values.withaccept">Подтверждать каждую оплату в личном кабинете</b-checkbox> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>7</span></div> <div class="media-content"> <div class="has-mb-1">{{'Режим работы'|gettext}}</div> <div class="row"> <div class="col-xs-12 col-sm-6"><label class="radio"><input type='radio' name='mode' value="test" v-model="values.mode"> {{'Тестовый режим'|gettext}}</label></div> <div class="col-xs-12 col-sm-6"><label class="radio"><input type='radio' name='mode' value="work" v-model="values.mode"> {{'Рабочий режим'|gettext}}</label></div> </div> </div> </div> </div>`});

window.$app.defineComponent("settings", "vue-settings-payments-providers-yandexkassa", {data() {
			return {
				resultUrl: 'https://taplink.cc/payments/yandexkassa/result.html'
			}
		},
		props: ['values', 'variants', 'payment_provider_id', 'is_new'],
		mixins: [FormModel], template: `<div> <div v-if="values.method == 'api'"> <div class="media"> <div class="media-left"><span class='tag is-dark'>1</span></div> <div class="media-content"> <p><a href="https://money.yandex.ru/joinups" target="_blank">Зарегистрируйтесь</a> на сайте kassa.yandex.ru<br> В настройках выберите способ подключения: API</p> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>2</span></div> <div class="media-content"> <div class="has-mb-1">Укажите URL для уведомлений о платежах</div> <div class="has-feedback"> <input type="text" :value="resultUrl" class="input" onfocus="this.focus();this.select()" readonly="on"> <a class="form-control-feedback has-text-grey-light"><vue-component-clipboard :text="resultUrl" :success-message="'URL скопирован'|gettext"></vue-component-clipboard></a> </div> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>3</span></div> <div class="media-content"> <div class="has-mb-1">Введите полученные "shopId" и "секретный ключ"</div> <b-field label="shopId:" :message="errors.shop_id" :class="{'has-error': errors.shop_id}"> <b-input type="text" v-model="values.shop_id"></b-input> </b-field> <b-field label="Секретный ключ:" :message="errors.password" :class="{'has-error': errors.password}"> <b-input type="text" v-model="values.password"></b-input> </b-field> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>4</span></div> <div class="media-content"> <div class="has-mb-1">Выберите доступные варианты оплаты</div> <div class="is-block" v-for="v in variants.payments_methods"><b-checkbox :native-value="v.payment_method_id" v-model="values.payments_methods">{{v.payment_method_title}}</b-checkbox></div> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>5</span></div> <div class="media-content"> <div>Онлайн касса</div> <b-checkbox v-model="values.onlinekassa">Использовать Яндекс.Кассу в качестве онлайн кассы для отправки чеков</b-checkbox> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>6</span></div> <div class="media-content"> <div>Двухстадийная оплата</div> <b-checkbox v-model="values.withaccept">Подтверждать каждую оплату в личном кабинете</b-checkbox> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>7</span></div> <div class="media-content"> <div class="has-mb-1">После проведения тестового платежа, сообщите менеджеру Яндекс.Кассы об успешном окончании тестирования и включите рабочий режим.</div> <div class="row"> <div class="col-xs-12 col-sm-6"><label class="radio"><input type='radio' name='mode' value="test" v-model="values.mode"> Тестовый режим</label></div> <div class="col-xs-12 col-sm-6"><label class="radio"><input type='radio' name='mode' value="work" v-model="values.mode"> Рабочий режим</label></div> </div> </div> </div> </div> <div v-else> <div class="media"> <div class="media-left"><span class='tag is-dark'>1</span></div> <div class="media-content"> <p><a href="https://money.yandex.ru/joinups" target="_blank">Зарегистрируйтесь</a> на сайте kassa.yandex.ru<br> В настройках выберите HTTP-протокол</p> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>2</span></div> <div class="media-content"> <div class="has-mb-1">Укажите целевые URL в Яндекс.Кассе </div> <div class="has-mb-2"> <div class="field"> <label class="label">checkUrl:</label> <input type="text" value="https://taplink.cc/payments/yandexkassa/check.html" class="input" onfocus="this.focus();this.select()" readonly="on"> </div> <div class="field"> <label class="label">avisoUrl:</label> <input type="text" value="https://taplink.cc/payments/yandexkassa/result.html" class="input" onfocus="this.focus();this.select()" readonly="on"> </div> </div> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>3</span></div> <div class="media-content"> <label>Включите</label> "Использовать страницы успеха и ошибки с динамическими адресами" </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>4</span></div> <div class="media-content"> <div class="has-mb-1">Введите полученные shopId, scid витрины и пароль к магазину</div> <div class="form-horizontal"> <b-field label="shopId:" :message="errors.shop_id" :class="{'has-error': errors.shop_id}"> <b-input type="text" v-model="values.shop_id"></b-input> </b-field> <b-field label="scid:" :message="errors.id" :class="{'has-error': errors.id}"> <b-input type="text" v-model="values.id"></b-input> </b-field> <b-field label="shopPassword:" :message="errors.password" :class="{'has-error': errors.password}"> <b-input type="text" v-model="values.password"></b-input> </b-field> </div> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>5</span></div> <div class="media-content"> <div class="has-mb-1">Выберите доступные варианты оплаты</div> <div class="is-block" v-for="v in variants.payments_methods"><b-checkbox :native-value="v.payment_method_id" v-model="values.payments_methods">{{v.payment_method_title}}</b-checkbox></div> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>6</span></div> <div class="media-content"> <div class="has-mb-1">Совершите тестовый платёж (<a href='https://tech.yandex.ru/money/doc/payment-solution/shop-config/intro-docpage/' target="_blank">Подробнее о тестировании</a>)</div> <div class="has-mb-1">Настройте форму на странице. Заполните ее и перейдите к оплате. Выберите способ «Visa». Укажите специальные <a target="_blank" href="https://tech.yandex.ru/money/doc/payment-solution/examples/examples-test-data-docpage/">тестовые данные</a></div> <blockquote class='has-text-grey-light has-mb-1'> Номер карты: 4444 4444 4444 4448<br> Действует до: любой год и месяц в будущем<br> Код CVV: 000 </blockquote> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>7</span></div> <div class="media-content"> <div class="has-mb-1">После проведения тестового платежа, сообщите менеджеру Яндекс.Кассы об успешном окончании тестирования и включите рабочий режим.</div> <div class="row"> <div class="col-xs-12 col-sm-6"><label class="radio"><input type='radio' name='mode' value="test" v-model="values.mode"> Тестовый режим</label></div> <div class="col-xs-12 col-sm-6"><label class="radio"><input type='radio' name='mode' value="work" v-model="values.mode"> Рабочий режим</label></div> </div> </div> </div> </div> </div>`});

window.$app.defineComponent("settings", "vue-settings-payments-providers-yandexmoney", {data() {
			return {
				resultUrl: 'https://taplink.cc/payments/yandexmoney/result.html',
				isAutoMode: true
			}
		},
		props: ['values', 'variants', 'payment_provider_id', 'is_new'],
		mixins: [FormModel],
		
		created() {
			this.$io.on('events:payments.yandexmoney:connect.resolve', this.connectResolve);
		},
		
		destroyed() {
			this.$io.off('events:payments.yandexmoney:connect.resolve', this.connectResolve);
		},
		
		methods: {
			connectResolve(values) {
				_.each(values, (v, k) => { this.values[k] = v; });
				this.$parent.save(false, false);
			},
			
			connect() {
				this.$parent.popupCenter('/payments/yandexmoney/connect.html', 'yandexmoney', 70, .6, 800, 400);
			}
		}, template: `<div> <div class="media"> <div class="media-left"><span class='tag is-dark'>1</span></div> <div class="media-content"> <p><a href="https://money.yandex.ru/reg" target="_blank">Зарегистрируйтесь</a> на сайте money.yandex.ru</p> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>2</span></div> <div class="media-content"> <div class="has-mb-1"> Привяжите ваш кошелек</div> <label class="checkbox has-mb-2"><input type="checkbox" v-model="isAutoMode"> Автоматическая настройка</label> <div class="row row-small" v-if="isAutoMode"> <div class="col-xs-12 col-sm col-sm-shrink"> <button class="button is-success is-fullwidth" @click="connect"><i class="fas fa-plug has-mr-2"></i> Привязать кошелек</button> </div> <div class="col-xs-12 col-sm" :class="{'has-text-warning': !values.receiver}" style="align-self: center"> <span v-if="values.receiver">Номер кошелька: {{values.receiver}}</span> <span v-else><i class="fa fa-exclamation-triangle has-mr-1"></i>Кошелек не привязан</span> </div> </div> <div v-if="!isAutoMode"> <b-field label="Введите ваш номер кошелька Яндекс.Деньги:" :message="errors.receiver" :class="{'has-error': errors.receiver}"> <b-input type="text" v-model="values.receiver"></b-input> </b-field> <div class="has-mb-1">Чтобы заказы помечались оплаченными при оплате через Яндекс.Деньги, необходимо <a href='https://sp-money.yandex.ru/myservices/online.xml' target="_blank">подключить HTTP-уведомления для кошелька</a> и указать адрес для HTTP-уведомлений:</div> <div class="has-feedback has-mb-3"> <input type="text" :value="resultUrl" class="input" onfocus="this.select()" readonly="on"> <a class="form-control-feedback has-text-grey-light"><vue-component-clipboard :text="resultUrl" :success-message="'URL скопирован'|gettext"></vue-component-clipboard></a> </div> <b-field label="Введите секрет полученный в настройках HTTP-уведомления" :message="errors.secret" :class="{'has-error': errors.secret}"> <b-input type="text" v-model="values.secret"></b-input> </b-field> </div> </div> </div> <div class="media"> <div class="media-left"><span class='tag is-dark'>3</span></div> <div class="media-content"> <div class="has-mb-1">Выберите доступные варианты оплаты</div> <div class="is-block" v-for="v in variants.payments_methods"><b-checkbox :native-value="v.payment_method_id" v-model="values.payments_methods">{{v.payment_method_title}}</b-checkbox></div> </div> </div> </div>`});

window.$app.defineComponent("settings", "vue-settings-products", {data() {
			return {
				isFetching: false,
				configured: {checkout:false, products:false, channels:false, payments: false, shipping:false, legal:false, addons:false}
			}
		},

		created() {
			this.$io.on('events:settings.products:refresh', this.refresh);
			this.fetchData(true);
		},
		
		destroyed() {
			this.$io.off('events:settings.products:refresh', this.refresh);
		},

		methods: {
			refresh() {
				this.fetchData(true);
			},
			
			fetchData(withLoading) {
				this.isFetching = withLoading;
				this.$api.get('settings/products/configured').then((data) => {
					this.isFetching = false;
					this.configured = data.response.settings.products.configured;
				});

			},
			
			openForm(name) {
				this.$form('vue-settings-products-'+name+'-form', null, this);
			}
		}, template: `<div class='has-mb-2 has-mt-4'> <div class="container"> <div v-if="!isFetching"> <div v-if="$account.tariff == 'business'"> </div> <div v-else> <div class="message is-info"><div class="message-body">Здесь вы можете настроить свой интернет магазин</div></div> <div class="message is-danger has-mb-3"><div class="message-body">Доступно на business-тарифе <a href='/tariffs/' class='is-pulled-right'>Подробнее <i class="fa fa-angle-right" style="margin-left: 5px"></i></a></div></div> </div> </div> <div class="label-pro-container" :class="{disabled: $account.tariff != 'business'}"> <div class="row"> <div class="col-xs-12 col-sm-6 col-md-4" style="display: flex"> <div class="panel panel-default product-settings-item"> <div class="media-checkitem has-alert" :class="{in: configured.products, 'is-loading': isFetching}"><i class="fa fal fa-cube"></i></div> <h4 class="media-heading"> Добавление товаров</h4> <p class="has-mb-2 has-text-grey">Загрузите фото ваших товаров и добавьте описание</p> <router-link :to="{name: 'products'}" class="button is-default is-fullwidth">Добавить товары</router-link> <b-loading :is-full-page="false" :active.sync="isFetching"></b-loading> </div> </div> <div class="col-xs-12 col-sm-6 col-md-4" style="display: flex"> <div class="panel panel-default product-settings-item"> <div class="media-checkitem has-alert" :class="{in: configured.checkout, 'is-loading': isFetching}"><i class="fa fal fa-file-alt"></i></div> <h4 class="media-heading"></i> Страница оформления заказа</h4> <p class="has-mb-2 has-text-grey">Настройте страницу с контактными данными для отправки заказа</p> <button type="button" @click="openForm('checkout')" class="button is-default is-fullwidth">Настроить страницу</button> <b-loading :is-full-page="false" :active.sync="isFetching"></b-loading> </div> </div> <div class="col-xs-12 col-sm-6 col-md-4" style="display: flex"> <div class="panel panel-default product-settings-item"> <div class="media-checkitem has-alert" :class="{in: configured.shipping, 'is-loading': isFetching}"><i class="fa fal fa-truck"></i></div> <h4 class="media-heading"> Настройка стоимости доставки</h4> <p class="has-mb-2 has-text-grey">Укажите стоимость и условия доставки</p> <button type="button" @click="openForm('shipping')" class="button is-default is-fullwidth">Настроить параметры доставки</button> <b-loading :is-full-page="false" :active.sync="isFetching"></b-loading> </div> </div> <div class="col-xs-12 col-sm-6 col-md-4" style="display: flex"> <div class="panel panel-default product-settings-item"> <div class="media-checkitem has-alert" :class="{in: configured.legal, 'is-loading': isFetching}"><i class="fa fal fa-file-alt"></i></div> <h4 class="media-heading"> Юридическая информация</h4> <p class="has-mb-2 has-text-grey">Добавьте договор-оферту</p> <button type="button" @click="openForm('legal')" class="button is-default is-fullwidth">Настроить юридическую информацию</button> <b-loading :is-full-page="false" :active.sync="isFetching"></b-loading> </div> </div> <div class="col-xs-12 col-sm-6 col-md-4" style="display: flex"> <div class="panel panel-default product-settings-item"> <div class="media-checkitem has-alert" :class="{in: configured.payments, 'is-loading': isFetching}"><i class="fa fal fa-credit-card-blank"></i></div> <h4 class="media-heading"> Прием оплат</h4> <p class="has-mb-2 has-text-grey">Настройте способы приема платежей</p> <router-link :to="{name: 'settings.payments'}" class="button is-default is-fullwidth">Настроить прием платежей</router-link> <b-loading :is-full-page="false" :active.sync="isFetching"></b-loading> </div> </div> <div class="col-xs-12 col-sm-6 col-md-4" style="display: flex"> <div class="panel panel-default product-settings-item"> <div class="media-checkitem has-alert in"><i class="fa fal fa-pencil-ruler"></i></div> <h4 class="media-heading"> Оформление каталога</h4> <p class="has-mb-2 has-text-grey">Настройте внешнее оформление вашего магазина</p> <button type="button" @click="openForm('common')" class="button is-default is-fullwidth">Настроить оформление</button> <b-loading :is-full-page="false" :active.sync="isFetching"></b-loading> </div> </div> <div class="col-xs-12 col-sm-6 col-md-4" style="display: flex"> <div class="panel panel-default product-settings-item"> <div class="media-checkitem has-alert" :class="{in: configured.addons, 'is-loading': isFetching}"><i class="fa fal fa-cog"></i></div> <h4 class="media-heading">Модули</h4> <p class="has-mb-2 has-text-grey">Настройте модули, которые будут работать с интернет магазином</p> <button type="button" @click="openForm('addons')" class="button is-default is-fullwidth">Настроить модули</button> <b-loading :is-full-page="false" :active.sync="isFetching"></b-loading> </div> </div> <div class="col-xs-12 col-sm-6 col-md-4" style="display: flex"> <div class="panel panel-default product-settings-item"> <div class="media-checkitem"><i class="fa fab fa-ig"></i></div> <h4 class="media-heading">Интеграция магазина с Instagram</h4> <p class="has-mb-2 has-text-grey">Подключите магазин к вашему instagram аккаунту</p> <button type="button" @click="openForm('facebook')" class="button is-default is-fullwidth">Настроить интеграцию</button> <b-loading :is-full-page="false" :active.sync="isFetching"></b-loading> </div> </div> </div> </div> </div>`});

window.$app.defineComponent("settings", "vue-settings-products-addons-form", {data() {
			return {
				isUpdating: false,
				isFetching: false,
				variants: {},
				addons: {},
				addons_values: {},
				values: {fields: [
					{idx: 'a', title: this.$gettext('Номер заявки')},
					{idx: 'b', title: this.$gettext('Контактные данные')},
					{idx: 'c', title: this.$gettext('Состав корзины')},
					{idx: 'd', title: this.$gettext('Стоимость')},
					{idx: 'e', title: this.$gettext('Данные доставки')},
					{idx: 'f', title: this.$gettext('Стоимость доставки')},
					{idx: 'g', title: this.$gettext('Ссылка на оплату')},
					{idx: 'h', title: this.$gettext('Общий вес')},
					{idx: 'i', title: this.$gettext('Номер счета')},
					{idx: 'j', title: this.$gettext('Ссылка на счет')}
				]},
				errors: {}
			}
		},

		created() {
			this.fetchData(true);
		},

		mixins: [FormModel],

		methods: {
			fetchData(withLoading) {
				this.isFetching = withLoading;
				this.$api.get('settings/products/addons/get').then((data) => {
					this.isFetching = false;
					this.variants = data.response.settings.products.addons.variants;
					this.addons = data.response.settings.products.addons.addons;
					this.addons_values = data.response.settings.products.addons.values.addons;
				});
			},
			
			updateData() {
				this.isUpdating = true;
				this.$api.post('settings/products/addons/set', {addons: this.addons_values}, this).then((data) => {
					if (data.result == 'success') {
						this.$parent.close()
					}
					this.isUpdating = false;
				}).catch((error) => {
					this.isUpdating = false;
				})
			}
		}, template: `<div class="modal-card"> <header class="modal-card-head"> <p class="modal-card-title">{{'Модули'|gettext}}</p> <button class="modal-close is-large" @click="$parent.close()"></button> </header> <section class="modal-card-body"> <vue-pages-blocks-form-addons :values="values" :addons="addons" :addons_values="addons_values" :variants="variants" :loading="isFetching" :parent="$parent"> <template slot="message">{{'Вы можете выбрать модули которые будут срабатывать для магазина'|gettext}}</template> <template slot="empty">{{'В настоящий момент ни одного модуля не подключено'|gettext}}</template> </vue-pages-blocks-form-addons> </section> <footer class="modal-card-foot"> <button class="button is-dark" type="button" @click="$parent.close()">{{'Закрыть'|gettext}}</button> <button class="button is-primary" :class="{'is-loading': isUpdating}" @click="updateData">{{'Сохранить'|gettext}}</button> </footer> </div>`});

window.$app.defineComponent("settings", "vue-settings-products-checkout-form", {data() {
			return {
				isUpdating: false,
				isFetching: false,
				activeTab: 'contacts',
				values: {fields: [], link_page_id: null, buttons: {pay: {type: null}}},
				action: null,
				variants: {fields_types: [], buttons: {pay: []}},
			}
		},

		created() {
			this.fetchData(true);
		},

		mixins: [FormModel],

		methods: {
			fetchData(withLoading) {
				this.isFetching = withLoading;
				this.$api.get(['settings/products/checkout/get', 'settings/products/checkout/info']).then((data) => {
					this.isFetching = false;
					this.values = data.response.settings.products.checkout.values;
					this.variants = data.response.settings.products.checkout.variants;
				});
			},
			
			updateData() {
				this.isUpdating = true;
				this.$api.post('settings/products/checkout/set', this.values, this).then((data) => {
					if (data.result == 'success') {
						this.$parent.close()
					}
					this.isUpdating = false;
				}).catch((error) => {
					this.isUpdating = false;
				})
			},
			
			onAction(v) {
				if (!v) return;
				
				this.values.fields_idx.toString(16);
				this.values.fields.push({title: this.variants.fields_types[v], text: '', type_id: v, required: false, default: 0, variants: '', opened: true, idx: this.values.fields_idx.toString(16)});
				this.values.fields_idx++;
				
				Vue.nextTick(() => {
		            this.action = null;
	            });
			}
		}, template: `<div class="modal-card"> <header class="modal-card-head"> <p class="modal-card-title">{{'Страница оформления заказа'|gettext}}</p> <button class="modal-close is-large" @click="$parent.close()"></button> </header> <ul class="nav nav-tabs has-text-left"> <li :class="{active: activeTab== 'contacts'}"><a href="#" @click="activeTab = 'contacts'">{{'Контакты'|gettext}}</a></li> <li :class="{active: activeTab== 'confirm'}"><a href="#" @click="activeTab = 'confirm'">{{'Подтверждение'|gettext}}</a></li> </ul> <section class="modal-card-body modal-card-body-blocks" v-if="activeTab == 'contacts'"> <section> <b-select :placeholder="'-- Добавить поле --'|gettext" v-model="action" @input="onAction" expanded> <option v-for="(f, i) in variants.fields_types" :value="i">{{ f }}</option> </b-select> </section> <section> <label class="label">{{'Укажите необходимые поля при оформлении заказа'|gettext}}</label> <vue-component-form-blocks v-model="values.fields" :variants="variants"></vue-component-form-blocks> </section> </section> <section class="modal-card-body modal-card-body-blocks" v-if="activeTab == 'confirm'"> <section> <b-field :label="'Кнопка завершения'|gettext"> <div class="row"> <div class="col-xs-12 col-sm"> <b-select v-model="values.buttons.pay.type" class="has-xs-mb-2" expanded> <option value="custom">-- {{'Свой текст'|gettext}} --</option> <option v-for="(v, i) in variants.buttons.pay" :value="i">{{ v }}</option> </b-select> </div> <div class="col-xs-12 col-sm-6" v-if="values.buttons.pay.type == 'custom'"> <b-input v-model="values.buttons.pay.title" :placeholder="'Укажите заголовок кнопки'|gettext"> </div> </div> </b-field> </section> <section> <b-field :label="'Какую страницу открыть после заказа'|gettext"> <b-select v-model="values.link_page_id" expanded> <option :value="null">-- {{'Главная'|gettext}} --</option> <option v-for="(v, i) in variants.page_id" :value="i">{{ v }}</option> </b-select> </b-field> </section> </section> <footer class="modal-card-foot"> <button class="button is-dark" type="button" @click="$parent.close()">{{'Закрыть'|gettext}}</button> <button class="button is-primary" :class="{'is-loading': isUpdating}" @click="updateData">{{'Сохранить'|gettext}}</button> </footer> <b-loading :is-full-page="false" :active.sync="isFetching"></b-loading> </div>`});

window.$app.defineComponent("settings", "vue-settings-products-common-form", {data() {
			return {
				activeTab: 'common',
				isUpdating: false,
				isFetching: false,
				values: {products_avatar: 0},
				variants: []
			}
		},

		created() {
			this.fetchData(true);
		},

		mixins: [FormModel],

		methods: {
			fetchData(withLoading) {
				this.isFetching = withLoading;
				this.$api.get(['settings/products/common/get', 'settings/products/common/info']).then((data) => {
					this.isFetching = false;
					this.values = data.response.settings.products.common.values;
					this.variants = data.response.settings.products.common.variants;
				});

			},
			
			updateData() {
				this.isUpdating = true;
				this.$api.post('settings/products/common/set', this.values, this).then((data) => {
					if (data.result == 'success') {
						this.$parent.close()
					}
					this.isUpdating = false;
				}).catch((error) => {
					this.isUpdating = false;
				})
			}
		}, template: `<div class="modal-card"> <header class="modal-card-head"> <p class="modal-card-title">{{'Оформление каталога'|gettext}}</p> <button class="modal-close is-large" @click="$parent.close()"></button> </header> <ul class="nav nav-tabs has-text-left"> <li :class="{active: activeTab== 'common'}"><a href="#" @click="activeTab = 'common'">{{'Лента'|gettext}}</a></li> <li :class="{active: activeTab== 'product'}"><a href="#" @click="activeTab = 'product'">{{'Товар'|gettext}}</a></li> </ul> <section class="modal-card-body modal-card-body-blocks" v-if="activeTab == 'common'"> <section> <b-field :label="'Аватар'|gettext"> <b-select v-model="values.products_avatar" class="has-xs-mb-2" expanded> <option v-for="(v, i) in variants.products_avatar" :value="i">{{v|gettext}}</option> </b-select> </b-field> <b-field :label="'Картинки'|gettext"> <b-select v-model="values.products_pictures_placement" class="has-xs-mb-2" expanded> <option v-for="(v, i) in variants.products_pictures_placement" :value="i">{{v|gettext}}</option> </b-select> </b-field> <div class="row has-mb-2"> <div class="col-xs-12 col-sm-6"> <b-field :label="'Коллекции'|gettext"> <b-select v-model="values.products_collections_view" class="has-xs-mb-2" expanded> <option v-for="(v, i) in variants.products_collections_view" :value="i">{{v|gettext}}</option> </b-select> </b-field> </div> <div class="col-xs-12 col-sm-6"> <b-field :label="'Варианты'|gettext"> <b-select v-model="values.products_variants_view" class="has-xs-mb-2" expanded> <option v-for="(v, i) in variants.products_variants_view" :value="i">{{v|gettext}}</option> </b-select> </b-field> </div> </div> <div class="field"> <label class="label">{{'Цвет фона'|gettext}}</label> <vue-component-colorpicker v-model="values.products_pictures_background"></vue-component-colorpicker> </div> </section> <section> <mx-toggle v-model="values.products_show_filter" :title="'Показывать фильтр по коллекциям'|gettext" class="has-mb-2"></mx-toggle> <mx-toggle v-model="values.products_show_search" :title="'Показывать поиск по каталогу'|gettext" class="has-mb-2"></mx-toggle> <mx-toggle v-model="values.products_show_snippet_overlay" :title="'Название и цена товара отображается поверх изображения'|gettext" class="has-mb-2"></mx-toggle> <mx-toggle v-model="values.products_show_snippet_title" :title="'Показывать название товара в каталоге'|gettext" class="has-mb-2"></mx-toggle> <mx-toggle v-model="values.products_show_snippet_price" :title="'Показывать цену товара в каталоге'|gettext" class="has-mb-2"></mx-toggle> <mx-toggle v-model="values.products_show_snippet_compare_price" :title="'Показывать старую цену товара в каталоге'|gettext" class="has-mb-2"></mx-toggle> <mx-toggle v-model="values.products_hide_checkout" :title="'Скрыть кнопку Добавить в корзину'|gettext"></mx-toggle> </section> </section> <section class="modal-card-body modal-card-body-blocks" v-if="activeTab == 'product'"> <section> <b-field :label="'Добавочный текст в описании товара'|gettext"> <div class="control"> <b-input type="textarea" v-model="values.products_description_footer" class="has-mb-1" style="min-height: 100px"></b-input> <p class="has-text-grey">{{'Этот текст будет добавлен к описанию каждого товара'|gettext}}</p> </div> </b-field> <b-field :label="'Добавочный текст в перед опциями товара'|gettext"> <div class="control"> <b-input type="textarea" v-model="values.products_description_before_options" class="has-mb-1" style="min-height: 100px"></b-input> <p class="has-text-grey">{{'Этот текст будет вставлен перед опциями в каждом товаре'|gettext}}</p> </div> </b-field> </section> </section> <footer class="modal-card-foot"> <button class="button is-dark" type="button" @click="$parent.close()">{{'Закрыть'|gettext}}</button> <button class="button is-primary" :class="{'is-loading': isUpdating}" @click="updateData">{{'Сохранить'|gettext}}</button> </footer> <b-loading :is-full-page="false" :active.sync="isFetching"></b-loading> </div>`});

window.$app.defineComponent("settings", "vue-settings-products-facebook-form", {data() {
			return {
				
			}
		},

		created() {
			this.fetchData();
		},

		methods: {
			fetchData() {
			}
		}, template: `<div class="modal-card"> <header class="modal-card-head"> <p class="modal-card-title">{{'Интеграция магазина с Instagram'|gettext}}</p> <button class="modal-close is-large" @click="$parent.close()"></button> </header> <section class="message is-warning"><div class="message-body">России в списке доступных стран нет. Но выборочно Facebook открывает аккаунтам Shoppable Tag.</div></section> <section class="modal-card-body"> <h4 class="has-mb-1">Условия подключения Shoppable Tags:</h4> <ul class="has-mb-2"> <li>— Вы ведете бизнес в одной из <a href="https://help.instagram.com/321000045119159" target="_blank">доступных стран</a></li> <li>— Продаете физические товары</li> <li>— Не продаете <a href="https://www.facebook.com/policies/commerce" target="_blank">запрещенные товары</a></li> <li>— У вас бизнес аккаунт Instagram</li> </ul> <h4 class="has-mb-1">Процесс подключения Shoppable Tags:</h4> <ul> <li>— <a href="https://www.facebook.com/products/" target="_blank">Создать каталог</a> в Facebook</li> <li>— А для загрузки товаров используйте <a :href="'{1}/m/catalog.csv'|format($account.link)" target="_blank">специальную ссылку</a></li> <li>— Как только Facebook одобрит магазин — товары из Taplink появятся в Instagram</li> </ul> </section> <footer class="modal-card-foot"> <button class="button is-dark" type="button" @click="$parent.close()">{{'Закрыть'|gettext}}</button> </footer> </div>`});

window.$app.defineComponent("settings", "vue-settings-products-legal-form", {data() {
			return {
				isUpdating: false,
				isFetching: false,
				values: {body: '', text: ''},
				errors: {text: ''}
			}
		},

		created() {
			this.fetchData(true);
		},

		mixins: [FormModel],

		methods: {
			fetchData(withLoading) {
				this.isFetching = withLoading;
				this.$api.get('settings/products/legal/get').then((data) => {
					this.isFetching = false;
					this.values = data.response.settings.products.legal.values;
				});

			},
			
			updateData() {
				this.isUpdating = true;
				this.$api.post('settings/products/legal/set', this.values, this).then((data) => {
					if (data.result == 'success') {
						this.$parent.close()
					}
					this.isUpdating = false;
				}).catch((error) => {
					this.isUpdating = false;
				})
			}
		}, template: `<div class="modal-card"> <header class="modal-card-head"> <p class="modal-card-title">{{'Юридическая информация'|gettext}}</p> <button class="modal-close is-large" @click="$parent.close()"></button> </header> <section class="modal-card-body modal-card-body-blocks"> <section> <b-field :label="'Надпись'|gettext" :message="errors.text" :class="{'has-error': errors.text}"> <b-input v-model="values.text"></b-input> </b-field> </section> <section> <label class="label">{{'Текст'|gettext}}</label> <vue-component-editor v-model="values.body"></vue-component-editor> </section> </section> <footer class="modal-card-foot"> <button class="button is-dark" type="button" @click="$parent.close()">{{'Закрыть'|gettext}}</button> <button class="button is-primary" :class="{'is-loading': isUpdating}" @click="updateData">{{'Сохранить'|gettext}}</button> </footer> <b-loading :is-full-page="false" :active.sync="isFetching"></b-loading> </div>`});

window.$app.defineComponent("settings", "vue-settings-products-shipping-form", {data() {
			return {
				isUpdating: false,
				isFetching: false,
				activeTab: 'address',
				values: {use_selfservice: true, use_zones: true, custom: [], fields_zones: []},
				variants: [],
				precisions: {budget: this.$account.currency.precision, weight: this.$account.weight.precision},
				types: {budget: 'По цене', weight: 'По весу'},
				fields: {country: this.$gettext('Страна'), state: this.$gettext('Область или край'), city: this.$gettext('Город'), addr1: this.$gettext('Адрес'), zip: this.$gettext('Индекс')},
				countries: [],
			}
		},

		created() {
			this.fetchData(true);
		},

		mixins: [FormModel],

		methods: {
			fetchData(withLoading) {
				this.isFetching = withLoading;
				this.$api.get(['settings/products/shipping/get', 'settings/products/shipping/info']).then((data) => {
					this.isFetching = false;
					let values = data.response.settings.products.shipping.values;
					this.variants = data.response.settings.products.shipping.variants;
					this.variants.units = {budget: this.$account.currency.title, weight: this.$account.weight.unit_title};

					_.each(values.types, (t) => {
						t.zones = _.map(t.zones, (z) => {
							z.countries = _.filter(this.variants.countries, (v) => {
								return z.countries.indexOf(v.country_id) != -1;
							});
							
							return z;
						});
					});
					
					this.values = values;
				});
			},
			
			updateData() {
				this.isUpdating = true;
				
				let values = this.$clone(this.values);
				
				_.each(values.types, (t) => {
					t.zones = _.map(t.zones, (z) => {
						z.countries = _.map(z.countries, (v) => {
							return v.country_id;
						})
						
						return z;
					});
				});
				
				this.$api.post('settings/products/shipping/set', values, this).then((data) => {
					if (data.result == 'success') {
						this.$parent.close()
					}
					this.isUpdating = false;
				}).catch((error) => {
					this.isUpdating = false;
				})
			},
			
			onRemoveAdress(index) {
				this.$confirm(this.$gettext('Вы уверены что хотите удалить эту опцию?'), 'is-danger').then(() => {
					this.values.custom.splice(index, 1);
				});
			},
			
			onAction(v) {
				if (!v) return;
				
				this.values.fields.push({title: this.variants.fields_types[v], text: '', type_id: v, required: false, default: 0, variants: '', opened: true});
				
				Vue.nextTick(() => {
		            this.action = null;
	            });
			},
			
			onAddAddress() {
				this.values.custom.push({on: true, title: '', price: 0, fields: ['addr1']});
			},
			
			onRemoveShipping(index) {
				this.$confirm(this.$gettext('Вы уверены что хотите удалить этот склад?'), 'is-danger').then(() => {
					this.values.shipping.splice(index, 1);
				});
			},
			
			onAddShipping() {
				this.values.shipping.push({country: null, state: '', city: '', addr1: '', zip: ''});
			},
			
			onAddZone(k) {
				this.values.types[k].zones.push({countries: [], rules: [{price: 0}]});
			},
			
			onRemoveZone(k, zi) {
				if (!zi) return;
				this.$confirm(this.$gettext('Вы уверены что хотите удалить эту зону?'), 'is-danger').then(() => {
					this.values.types[k].zones.splice(zi, 1);
				});
			},
			
			onDeleteRule(k, zi, i) {
				this.$confirm(this.$gettext('Вы уверены что хотите удалить это условие?'), 'is-danger').then(() => {
					this.values.types[k].zones[zi].rules.splice(i, 1);
				});
			},
			
			onAddRule(k, zi) {
				let rules = this.values.types[k].zones[zi].rules;
				let tmp = rules.pop();
				rules.push({max: 0, price: 0});
				rules.push(tmp);
			},
			
			getFilteredCountries(text) {
				this.countries = _.filter(this.variants.countries, (v) => {
					return v.country.toLowerCase().indexOf(text.toLowerCase()) != -1;
				});
			}
		}, template: `<div class="modal-card"> <header class="modal-card-head"> <p class="modal-card-title">{{'Настройка стоимости доставки'|gettext}}</p> <button class="modal-close is-large" @click="$parent.close()"></button> </header> <ul class="nav nav-tabs has-text-left"> <li :class="{active: activeTab== 'address'}"><a href="#" @click="activeTab = 'address'">{{'Адрес'|gettext}}</a></li> <li :class="{active: activeTab== 'warehouses'}"><a href="#" @click="activeTab = 'warehouses'">{{'Склады'|gettext}}</a></li> <li :class="{active: activeTab== k}" v-for="(t, k) in values.types" v-if="values.use_zones"><a href="#" @click="activeTab = k">{{types[k]|gettext}}</a></li> </ul> <section class="modal-card-body modal-card-body-blocks" v-if="activeTab == 'address'"> <section> <div class="has-mb-2"> <div class="has-text-grey-light">{{'Укажите опции доставки'|gettext}}</div> </div> <div class="has-mb-2"> <mx-item class="mx-item-header is-hidden-mobile"> <div class="item-row row"> <div class="col-sm col-shrink block-xs first-xs" style="line-height: 0"><div style="visibility: hidden;height: 5px"><mx-toggle v-model="values.use_selfservice"></div></div> <div class="col-sm">Название</div> <div class="col-sm-3">Стоимость</div> <div class="col-xs col-shrink"> <div style="visibility: hidden;height: 5px"><button type="button" class="button is-danger"><i class="fa fa-trash-alt"></i></button></div> </div> </div> </mx-item> <mx-item> <div class="item-row row"> <div class="col-sm col-shrink block-xs first-xs" style="line-height: 0"><mx-toggle v-model="values.use_selfservice"></mx-toggle></div> <div class="col-sm block-xs"><input type="text" value="Самовывоз" class="input" disabled="on"></div> <div class="col-sm-3 block-xs"><input type="text" class="input" value="Бесплатно" disabled="on"></div> <div class="col-xs col-sm-shrink first-xs last-sm text-xs-right"> <button type="button" class="button is-danger disabled" disabled="on"><i class="fa fa-trash-alt"></i></button> </div> </div> </mx-item> <mx-item v-for="(v, i) in values.custom"> <div class="item-row row"> <div class="col-sm col-shrink block-xs first-xs" style="line-height: 0"><mx-toggle v-model="v.on"></mx-toggle></div> <div class="col-sm block-xs" style="overflow: visible"> <div class="has-feedback"> <b-input type="text" v-model="v.title" :placeholder="'Например: Центр Москвы'|gettext" :disabled="!v.on"></b-input> <a class="form-control-feedback has-text-grey-light has-mr-2" :class="{disabled: !v.on}"><vue-component-dropdown-list v-model="v.fields" :list="fields" :title="'Поля'|gettext" :exclude="['country']"></vue-component-dropdown-list></a> </div> </div> <div class="col-sm-3 block-xs"><div class="has-feedback"><number type="text" v-model="v.price" :precision="$account.currency.precision" class="input" :disabled="!v.on"></number><span class="form-control-feedback has-text-grey-light">{{ $account.currency.title }}</span></div></div> <div class="col-xs col-sm-shrink first-xs last-sm text-xs-right"> <button type="button" class="button is-danger" @click="onRemoveAdress(i)"><i class="fa fa-trash-alt"></i></button> </div> </div> </mx-item> <mx-item> <div class="item-row row"> <div class="col-sm col-shrink block-xs first-xs" style="line-height: 0"><mx-toggle v-model="values.use_zones"></mx-toggle></div> <div class="col-sm block-xs" style="overflow: visible"> <div class="has-feedback"><input type="text" placeholder="Другие страны" class="input" v-model="values.title_zones" :disabled="!values.use_zones"><a class="form-control-feedback has-text-grey-light has-mr-2" :class="{disabled: !values.use_zones}"><vue-component-dropdown-list v-model="values.fields_zones" :list="fields" :title="'Поля'|gettext" :frozen="['country']"></vue-component-dropdown-list></a></div> </div> <div class="col-xs col-sm-shrink first-xs last-sm text-xs-right"> <button type="button" class="button is-danger disabled" disabled="on"><i class="fa fa-trash-alt"></i></button> </div> </div> </mx-item> </div> <a href="#" @click="onAddAddress" style="text-decoration: underline">Добавить опцию</a> </section> </section> <section class="modal-card-body modal-card-body-blocks" v-if="activeTab == 'warehouses'"> <section v-for="(f, i) in values.shipping"> <div class="has-mb-2" v-if="i == 0"> <div class="has-text-grey-light">{{'Укажите адрес, с которого клиент может забрать свой заказ'|gettext}}</div> </div> <div class="row row-small"> <div class="col-xs-12 col-sm-6"> <div class="field has-mb-2"> <b-select :placeholder="'-- Выберите страну --'|gettext" v-model='f.country' expanded> <optgroup :label="'-- Выберите страну --'|gettext"> <option v-for="(c, k) in variants.countries" :value="c.country_id">{{c.country}}</option> </optgroup> </b-select> </div> </div> </div> <div class="has-mb-2"> <div class="row row-small"> <div class="col-xs-12 col-sm-6"> <div class="field has-mb-2"> <b-input v-model='f.state' :placeholder="'Область или край'|gettext"></b-input> </div> </div> <div class="col-xs-12 col-sm-6"> <div class="field has-mb-2"> <b-input v-model='f.city' :placeholder="'Город'|gettext"></b-input> </div> </div> <div class="col-xs-12 col-sm-6"> <div class="block-xs"> <b-input v-model='f.addr1' :placeholder="'Адрес'|gettext"></b-input> </div> </div> <div class="col-xs-12 col-sm-6"> <div class="block-xs"> <b-input v-model="f.zip" :placeholder="'Индекс'|gettext"> </div> </div> </div> </div> <a href='#' @click="onRemoveShipping(i)" class='has-text-danger' style="text-decoration: underline" v-if="i"> {{'Удалить склад'|gettext}}</a> <a href='#' @click="onAddShipping" style="text-decoration: underline" v-else>{{'Добавить дополнительный склад'|gettext}}</a> </section> </section> <section v-for="(t, k) in values.types" class="modal-card-body modal-card-body-blocks" v-if="activeTab == k"> <section v-for="(zone, zi) in t.zones"> <div class="has-mb-2"> <div class="has-text-grey-light">{{'Укажите условия формирования цены для других стран'|gettext}}</div> </div> <div class="row row-small has-mb-2"> <div class="col-xs"> <b-taginput v-model="zone.countries" :data="countries" @typing="getFilteredCountries" field="country" allow-new="false" confirm-key-codes='[13]' autocomplete :placeholder="'Весь мир'|gettext" attached> <template slot-scope="props"> <strong>{{props.option.country}}</strong> </template> <template slot="empty"> <div>{{'Ничего не найдено'|gettext}}</div> </template> </b-taginput> </div> <div class="col-xs col-shrink"> <button type="button" class="button is-danger" :class="{disabled: !zi}" @click="onRemoveZone(k, zi)" :disabled="!zi"><i class="fa fa-trash-alt"></i></button> </div> </div> <div class="has-mb-2"> <mx-item class='mx-item-header is-hidden-mobile'> <div class="item-row row"> <div class="col-sm-4">{{'От'|gettext}}</div> <div class="col-sm-4">{{'До'|gettext}}</div> <div class="col-sm-4">{{'Цена доставки'|gettext}}</div> </div> </mx-item> <mx-item v-for="(f, i) in zone.rules"> <div class="item-row row"> <div class="col-sm-4 block-xs"><label class="label is-visible-mobile">{{'От'|gettext}}</label> <div class="has-feedback"> <number type='text' class="input" v-model="zone.rules[i-1].max" disabled="on" v-if="i" :precision="precisions[k]"></number> <number type='text' class="input" value="0" disabled="on" :precision="precisions[k]" v-else></number> <span class="form-control-feedback has-text-grey-light">{{ variants.units[k] }}</span></div> </div> <div class="col-sm-4 block-xs"><label class="label is-visible-mobile">{{'До'|gettext}}</label> <div class="has-feedback"> <number v-model="f.max" :class="{'is-danger': f.max < 0 || (i && f.max < zone.rules[i-1].max)}" type='text' class="input" v-if="i < zone.rules.length-1" :precision="precisions[k]"></number> <input type='text' class="input" value="∞" disabled="on" v-else> <span class="form-control-feedback has-text-grey-light">{{ variants.units[k] }}</span> </div> </div> <div class="col-sm-4 block-xs"> <label class="label is-visible-mobile">Цена доставки</label> <div class="media"> <div class="media-content"> <div class="has-feedback"><number type='text' class="input" :class="{'is-danger': f.price < 0}" v-model="f.price" :precision="$account.currency.precision"></number><span class="form-control-feedback has-text-grey-light">{{ $account.currency.title }}</span></div> </div> <div class="media-right"><a class="button has-text-danger" :class="{disabled: zone.rules.length-1 == i}" :disabled="zone.rules.length-1 == i" @click='onDeleteRule(k, zi, i)'><i class="fa fa-trash-alt"></i></a></div> </div> </div> </div> </mx-item> </div> <a href='#' @click='onAddRule(k, zi)' style="text-decoration: underline">{{'Добавить условие'|gettext}}</a> </section> <section> <button type="button" class="button is-success" @click='onAddZone(k)'><i class="fa fa-plus-circle has-mr-1"></i>{{'Добавить новую зону'|gettext}}</button> </section> </section> <footer class="modal-card-foot"> <button class="button is-dark" type="button" @click="$parent.close()">{{'Закрыть'|gettext}}</button> <button class="button is-primary" :class="{'is-loading': isUpdating}" @click="updateData">{{'Сохранить'|gettext}}</button> </footer> <b-loading :is-full-page="false" :active.sync="isFetching"></b-loading> </div>`});
window.$app.defineModule("settings", [{ path: '/:page_id/settings/design/', component: 'vue-settings-design', meta: {title: 'Дизайн'}, props: true, name: 'settings.design'},
{ path: '/:page_id/settings/common/', component: 'vue-settings-common', meta: {title: 'Общие'}, props: true, name: 'settings.common'},
{ path: '/:page_id/settings/payments/', redirect: '/:page_id/settings/payments/index/', meta: {title: 'Платежи', feature: 'payments'}, props: true, name: 'settings.payments', children: [
	{ path: '/:page_id/settings/payments/index/', component: 'vue-settings-payments-index', props: true, alias: '/:page_id/settings/payments/', name: 'settings.payments.index'},
	{ path: '/:page_id/settings/payments/errors/', component: 'vue-settings-payments-onlinekassa-errors', props: true, name: 'settings.payments.onlinekassa.errors'}
]},
{ path: '/:page_id/settings/products/', component: 'vue-settings-products', meta: {title: 'Товары', feature: 'products'}, props: true, name: 'settings.products' }]);