
window.$app.defineComponent("pages", "vue-pages-blocks-form-addons", {props: {disabled: {type: Boolean, default: false}, values: Object, variants: {type: Object, default: []}, block_id: Number, block_type_id: Number, loading: {type: Boolean, default: false}, addons: {type: Object, default: null}, addonsLoadingEndpoint: {type: String, default: "pages/blocks/addons"}, addons_values: Object, parent: Object},
		
		created() {
			if (this.addonsLoadingEndpoint && (this.addons == null)) {
				this.loading = true;
				this.$api.get(this.addonsLoadingEndpoint, {block_id: this.block_id, block_type_id: this.block_type_id}).then((data) => {
					if (data.result == 'success') {
						let b = data.response.pages.block;
						this.addons = b.addons;
						this.addons_values = b.addons_values;
						this.variants = b.variants;
						
						if (b.addons.phrases) window.i18n.extend(b.addons.phrases);
						
						this.$emit('update:addons_values', this.addons_values);
					}
					this.loading = false;
				}).catch(() => {
					this.loading = false;
				})
			}
		},
		
		computed: {
			link() {
				return '/'+this.$router.currentRoute.params.page_id+'/addons/all/';
			}
		},
		
		methods: {
			loadEntry(name) {
				name = 'vue-addons-addon-'+name+'-entry';
				window.$app.loadComponent(name);
				return name;
			},
			
			getVariants(addon_name) {
				return (this.variants != undefined && this.variants.addons != undefined && this.variants.addons[addon_name] != undefined)?this.variants.addons[addon_name]:{};
			}
		}, template: `<section> <div v-if="addons && addons.addons_amount"> <div class="message is-info"> <div class="message-body"><slot name="message"></slot></div> </div> <div class="label-pro-container"> <div v-for="(f, addon_id) in addons.addons" v-if="f.addon_id != undefined" class="form-fields-item" :class="{in: (addons_values[addon_id] != undefined) && addons_values[addon_id].on, disabled: f.is_active == 0 || disabled}"> <div class="form-fields-item-title"> <span style="margin-left: 0"> <b-checkbox v-model="addons_values[addon_id].on" :disabled="f.is_active == 0 || disabled"><b>{{f.addon_title}}</b></b-checkbox> </span> </div> <div class="form-fields-item-options" v-if="f.is_has_options && (addons_values[addon_id] != undefined) && addons_values[addon_id].on && f.is_active != 0"> <component v-bind:is="loadEntry(f.addon_name)" :values="values" :addons="addons" :addon="f" :variants="getVariants(f.addon_name)" :options="addons_values[addon_id].options"></component> </div> </div> </div> </div> <div v-else class="has-pt-4 has-pb-4 has-text-centered" :class="{disabled: disabled}"> <div class="has-mb-2"><i class="fa fal fa-cog fa-5x has-text-grey-light" :class="{'is-invisible': loading}"></i></div> <div v-if="loading" class="has-text-grey">{{'Загрузка данных'|gettext}}</div> <div v-else><slot name="empty"></slot></div> <router-link v-if="!loading" :to="{path: link}" @click.native="parent.close()">{{'Посмотреть доступные модули'|gettext}}</router-link> </div> <b-loading :is-full-page="false" :active.sync="loading"></b-loading> </section>`});

window.$app.defineComponent("pages", "vue-pages-blocks-form-background", {props: {value: Object, disabled: Boolean},
		
		watch: {
			value(v) {
				this.checkValue(v);
			}
		},
		
		created() {
			this.checkValue(this.value);
		},
		
		methods: {
			checkValue(v) {
				if (!v.on && _.size(v) == 1) {
					this.value = Object.assign(this.$clone(v), this.getDefault());
					this.$emit('input', this.value);
				}
			},
			
			getDefault() {
				let theme = this.$account.theme;
				return {type: 'solid', color1: theme.bg.color1, color2: '', picture: null, size: 'tile', repeat: 'repeat', position: '0% 0%'};
			},
			
			prepareValues() {
				let v = this.$clone(this.value);
				delete v.on;
				
				if (_.isEqual(v, this.getDefault())) {
					return {on: false};
				} else {
					return this.value;
				}
			}
		}, template: `<div class="label-pro-container"> <div class="tag is-pro" v-if="!$auth.isAllowTariff('pro')" data-toggle="tooltip" data-placement="top" :data-original-title="'Эта возможность доступна<br>на pro тарифе'|gettext">pro</div> <div :class="{disabled: disabled || !$auth.isAllowTariff('pro')}"> <div class="has-mb-2"><mx-toggle v-model='value.on' :title="'Добавить фон к блоку'|gettext" :disabled="disabled"></mx-toggle></div> <vue-component-background-editor v-model="value" :disabled="disabled || !value.on"></vue-component-background-editor> </div> </div>`});

window.$app.defineComponent("pages", "vue-pages-blocks-form-design", {props: ['values', 'info'],
		
		created() {
			let theme = this.$account.theme;
			if (!this.values.text) this.values.text = theme.link.color;
			if (!this.values.bg) this.values.bg = theme.link.bg;
		}, template: `<div class="label-pro-container"> <div class="tag is-pro" v-if="!$auth.isAllowTariff('pro')" data-toggle="tooltip" data-placement="top" :data-original-title="'Эта возможность доступна<br>на pro тарифе'|gettext">pro</div> <div :class="{disabled: !$auth.isAllowTariff('pro')}"> <div class="has-mb-2"><mx-toggle v-model='values.on' :title="'Свои настройки дизайна'|gettext" :disabled="info.is_readonly"></mx-toggle></div> <div v-if="values.on"> <div class="has-mb-2"> <vue-component-colorpicker v-model="values.bg" :label="'Цвет фона кнопки'|gettext" :disabled="info.is_readonly" :colors="[$account.theme.link.bg]"></vue-component-colorpicker> </div> <div class="has-mb-2"> <vue-component-colorpicker v-model="values.text" :label="'Цвет текста кнопки'|gettext" :disabled="info.is_readonly" :colors="[$account.theme.link.color]"></vue-component-colorpicker> </div> <slot></slot> </div> </div> </div>`});

window.$app.defineComponent("pages", "vue-pages-blocks-form-modal", {data() {
			return {
				isUpdating: false,
				isDeleting: false,
				isFetching: false,
				isFetchingBlockType: null,
				canDelete: false,
				tabs: [],
				defaultsTabs: [],
				currentTab: 'common',
				currentBlock: null,
				tariff: null,
				values: {},
				options: {},
				variants: {},
				bg: {on: false},
				block: {title: null},
				permit: {},
				archives: [],
				info: {},
				types: [],
				typesKeys: [],
				isAnimatedTariff: false,
				allowSave: true,
				block_type_id: null
			}
		},

		created() {
			if (this.block_id) {
				this.fetchData(true);
			} else {
				this.isFetching = true;
				for (var i = 0; i < 15; i++) this.types.push({icon: '<svg></svg>'});
				this.$api.get(['pages/blocks/types', 'pages/blocks/archives']).then((data) => {
					this.types = data.response.pages.blocks.types;
					this.archives = data.response.pages.blocks.archives;
					this.isFetching = false;
					this.defaultsTabs = this.tabs = (this.archives.length)?[{name: 'common', title: this.$gettext('Стандартные блоки')},{name: 'archives', title: this.$gettext('Из архива')}]:[];
					
					this.typesKeys = [];
					_.each(this.types, (o) => {
						this.typesKeys[o.block_type_id] = o;
					})
				});
			}
		},
		
		computed: {
			ratePlanLink() {
				return window.base_path_prefix+'/tariffs/';
			},
			
			isAllowTariff() {
				return this.$auth.isAllowTariff(this.tariff);
			}
		},
		
		props: ['block_id', 'page_id'],
		mixins: [FormModel],

		methods: {
			fetchData(withLoading) {
				this.isFetching = withLoading;
				this.$api.get('pages/blocks/get', {block_id: this.block_id}).then((data) => {
					this.isFetching = false;
					let block = data.response.pages.block;
					
					this.permit = block.permit;
					this.values = block.values;
					this.bg = block.bg;
					this.options = block.options;
					
					this.variants = block.variants;
					this.tariff = block.tariff;
					this.info = block.info;
					
					this.page_id = block.page_id;
					this.block_type_id = block.block_type_id;
					
					if (!this.$auth.isAllowTariff(block.tariff))  {
						this.info.is_readonly = true;
						this.canDelete = true;
					}
					
					this.currentBlock = 'vue-pages-blocks-'+block.block_type_name;
				});
			},
			
			close() {
				this.$parent.close()
			},
			
			action(name, params) {
				return this.$api.get('pages/blocks/action', {block_id: this.block_id, name: name, params: params}, this);
			},
			
			chooseType(f) {
				this.isFetchingBlockType = f.block_type_id;
				this.$api.get('pages/blocks/info', {block_type_id: f.block_type_id}).then((data) => {
					this.isFetchingBlockType = null;
					let block = data.response.pages.block;
					
					this.variants = block.variants;
					this.values = block.defaults.values;
					this.bg = {on: false};
					this.options = block.defaults.options;
					this.block_type_id = block.block_type_id;
					
					this.info = block.info;
					this.tariff = block.tariff;
					
					if (!this.$auth.isAllowTariff(block.tariff)) this.info.is_readonly = true;
					
					this.currentBlock = 'vue-pages-blocks-'+block.block_type_name;
				});				
			},
			
			back() {
				this.currentBlock = null;
				this.currentTab = 'common'
				this.tariff = null;
				this.tabs = this.defaultsTabs;
				this.info = [];
				this.values = [];
				this.variants = {};
			},
			
			restoreBlock(block_id) {
				this.isUpdating = true;
				this.$api.get('pages/blocks/restore', {block_id: block_id, page_id: this.page_id}, this).then((response) => {
					this.isUpdating = false;
					if (response.result == 'success') {
						this.$parent.close();
					}
				}).catch(() => {
					this.isUpdating = false;
				})	
			},
			
			onAction(v) {
				switch (v) {
					case 'delete':
						this.deleteBlock('delete');
						break;
					case 'archive':
						this.deleteBlock('archive');
						break;
					case 'clone':
						this.cloneBlock();
						break;
				}
			},
			
			cloneBlock() {
				this.isUpdating = true;
				this.$api.get('pages/blocks/clone', {block_id: this.block_id}, this.$refs.model).then((response) => {
					this.isUpdating = false;
					if (response.result == 'success') {
						this.$parent.close();
					}
				});
			},
			
			deleteBlock(method) {
				this.$confirm((method == 'delete')?this.$gettext('Вы уверены что хотите удалить этот блок?'):this.$gettext('Вы уверены что хотите отправить этот блок в архив?'), (method == 'delete')?'is-danger':'is-warning').then(() => {
					this.isDeleting = true;
					
					this.$api.get('pages/blocks/'+method, {block_id: this.block_id}, this.$refs.model).then((response) => {
						this.isDeleting = false;
						if (response.result == 'success') {
							this.$parent.close();
						}
					}).catch(() => {
						this.isDeleting = false;
					})
				});
			},
			
			save() {
				this.isUpdating = true;
				
				let values = this.$refs.model.prepareValues();
				let addons_values = values.addons_values;
				let bg = this.$refs.bg.prepareValues();
				
				delete values.addons_values;
				
				this.$api.post('pages/blocks/set', {block_id: this.block_id, page_id: this.page_id, block_type_id: this.block_type_id, values: values, options: this.options, addons_values: addons_values, bg: bg}, this.$refs.model).then((response) => {
					this.isUpdating = false;
					if (response.result == 'success') {
						this.$parent.close();
					} else {
						if (this.$refs.model.showErrors != undefined) this.$refs.model.showErrors(response);
					}
				}).catch(() => {
					this.isUpdating = false;
				})	

			},
			
			scrollToTariff() {
				if (!this.isAllowTariff) {
					let m = this.$refs.tariffMessage;
					
					scrollIt(0, 'y', $mx(m).closest('.modal')[0], 400);
					
					this.isAnimatedTariff = true;
					setTimeout(() => {
						this.isAnimatedTariff = false;
					}, 1000);
				}
			}
		}, template: `<div class="modal-card"> <header class="modal-card-head"> <p class="modal-card-title" v-if="block.title">{{block.title}}</p> <p class="modal-card-title" v-else-if="isFetching">{{'Загрузка'|gettext}}</p> <p class="modal-card-title" v-else>{{'Добавить новый блок'|gettext}}</p> <button class="modal-close is-large" @click="$parent.close()"></button> </header> <ul class="nav nav-tabs nav-tabs-scroll has-text-left" v-if="tabs.length"> <li v-for="(tab, index) in tabs" :class="{active: currentTab== tab.name}"><a @click="currentTab = tab.name">{{tab.title|gettext}}</a></li> </ul> <section class="message is-danger" style="flex-shrink: 0;flex-grow: 0" v-if="!isAllowTariff"> <div class="message-body" :class="{'shake animated': isAnimatedTariff}" ref="tariffMessage"><span v-if="tariff == 'pro' || tariff== 'plus'">{{'Доступно на pro-тарифе'|gettext}}</span><span v-if="tariff == 'business'">{{'Доступно на business-тарифе'|gettext}}</span> <a :href='ratePlanLink' target="_blank" class='is-pulled-right'>{{'Подробнее'|gettext}} <i class="fa fa-angle-right" style="margin-left: 5px"></i></a></div> </section> <component v-bind:is="currentBlock" ref='model' :values="values" :options="options" :variants="variants" :info="info" :block_id="block_id" :block_type_id="block_type_id" :block="block" :current-tab="currentTab" :tabs.sync="tabs" v-if="currentBlock" :parent="$parent" :allowSave.sync="allowSave"> <template> <section v-show="currentTab == 'system:background'"> <vue-pages-blocks-form-background v-model="bg" ref="bg" :disabled="info.is_readonly"></vue-pages-blocks-form-background> </section> </template> </component> <section class="modal-card-body" v-if="!currentBlock && currentTab== 'common'"> <div class="row row-small" style="margin-bottom: -1rem"> <div class="col-sm-4 col-xs-6 has-mb-2" v-for="f in types"><button @click="chooseType(f)" class="button is-block-button is-default btn-block" :class="{'is-loading': isFetchingBlockType && isFetchingBlockType== f.block_type_id}" :disabled="isFetching || isFetchingBlockType"> <div v-if="!$auth.isAllowTariff(f.tariff) && (f.tariff == 'pro' || f.tariff == 'plus')" class="tag is-pro" data-toggle="tooltip" data-placement="top" :data-original-title="'Этот блок доступен<br>на pro-тарифе'|gettext">pro</div> <div v-if="!$auth.isAllowTariff(f.tariff) && (f.tariff == 'business')" class="tag is-danger is-business" data-toggle="tooltip" data-placement="top" :data-original-title="'Этот блок доступен<br>на business-тарифе'|gettext">biz</div> <div v-html="f.icon"></div> <div>{{f.block_type_title|gettext}}</div> </button></div> </div> </section> <section class="modal-card-body" v-if="!currentBlock && currentTab== 'archives'"> <button class="button is-light btn-block is-fullwidth has-p-2" :class="{'has-mt-2': i}" style="justify-content: space-between" v-for="(f, i) in archives" @click="restoreBlock(f.block_id)"> <span class="has-mr-1" style="display: flex;align-items: center;overflow:hidden"> <span v-html="typesKeys[f.block_type_id].icon" class="is-block-button is-archive"></span> {{typesKeys[f.block_type_id].block_type_title|gettext}}<span class="has-ml-1" style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;opacity:.4" v-if="f.title">— {{f.title}}</span></span> <span class="has-text-grey">{{f.tms_archived|date}}</span> </button> </section> <footer class="modal-card-foot level" v-if="currentBlock"> <div class="level-left"> <vue-component-action-button v-if="block_id && (!info.is_readonly || canDelete)" @action="onAction" :title="'Действие'|gettext"> <template slot="actions"> <b-dropdown-item value="clone"><i class="fa fa-clone"></i> {{'Дублировать'|gettext}}</b-dropdown-item> <hr class="dropdown-divider" aria-role="menuitem"> <b-dropdown-item value="archive" v-if="info.permit.can_archive && $auth.isAllowTariff('pro')"><i class="fa fa-archive"></i> {{'В архив'|gettext}}</b-dropdown-item> <hr class="dropdown-divider" aria-role="menuitem" v-if="info.permit.can_archive && $auth.isAllowTariff('pro')"> <b-dropdown-item value="delete" class="has-text-danger" :class="{disabled: !info.permit.can_delete}"><i class="fa fa-trash-alt"></i> {{'Удалить'|gettext}}</b-dropdown-item> </template> </vue-component-action-button> <button v-if="currentBlock && !block_id" class="button is-default is-pulled-left" @click="back"><i class="fa fa-angle-left has-mr-2"></i>{{'Назад'|gettext}}</button> </div> <div class="level-right"> <button class="button is-primary" :class="{'is-loading': isUpdating}" @click="save" :disabled="info.is_readonly || !allowSave">{{'Сохранить'|gettext}}</button> </div> </footer> <footer class="modal-card-foot" v-if="!currentBlock"> <button class="button is-dark" type="button" @click="$parent.close()">{{'Закрыть'|gettext}}</button> </footer> <b-loading :is-full-page="false" :active.sync="isFetching"></b-loading> </div>`});

window.$app.defineComponent("pages", "vue-pages-blocks-form-options", {data() {
			return {
				schedule_days: [],
				date_from: null,
				date_until: null,
				time_from: null,
				time_until: null,
				allowPro: false,
				first_day_week: this.$getFirstDayWeek(),
				weekdays: this.$getDaysNames(),
			}
		},
		
		props: ['values', 'info', 'variants'],
		
		computed: {
			weekdays_schedule() {
				let r = [];
				if (!this.first_day_week) r.push({index: 6, weekday: this.weekdays[0]});
				for (var i = 1; i < 7; i++) r.push({index: i-1, weekday: this.weekdays[i]});
				if (this.first_day_week) r.push({index: 6, weekday: this.weekdays[0]});
				
				return r;
			},
			
			daysSummary() {
				let d = this.schedule_days;
				if (d.length == 7) return this.$gettext('Каждый день');
				if (d.length == 5 && (d.indexOf(5) == -1) && (d.indexOf(6) == -1)) return this.$gettext('Будние дни');
				if (d.length == 2 && (d.indexOf(5) != -1) && (d.indexOf(6) != -1)) return this.$gettext('Выходные дни');
				return '';
			}
		},
		
		watch: {
			time_from() {
				this.onInputDates();
			},

			time_until() {
				this.onInputDates();
			}
		},

		created() {
			let parse = (d) => {
				d = d.split('-');
				return new Date(d[0], d[1]-1, d[2]);
			}
			
			this.allowPro = this.$auth.isAllowTariff('pro');
			this.date_from = this.values.date_from?parse(this.values.date_from):null;
			this.date_until = this.values.date_until?parse(this.values.date_until):null;
			
			if (this.values.time_from)
			{
				let dt = this.values.time_from.split(':')
				this.time_from = new Date(0, 0, 0, dt[0], dt[1]);
			}

			if (this.values.time_until)
			{
				let dt = this.values.time_until.split(':')
				this.time_until = new Date(0, 0, 0, dt[0], dt[1]);
			}
			
			for (var i = 0; i < 7; i++) if (this.values.schedule_days & Math.pow(2, i)) this.schedule_days.push(i);
		},
		
		methods: {
			onInputDates() {
				this.values.date_from = this.date_from?date_format('Y-m-d', this.date_from):null;
				this.values.date_until = this.date_until?date_format('Y-m-d', this.date_until):null;
				
				this.values.time_from = this.time_from?date_format('H:i', this.time_from):null;
				this.values.time_until = this.time_until?date_format('H:i', this.time_until):null;
				
				this.values.schedule_days = _.reduce(this.schedule_days, (v, i) => { return v + Math.pow(2, i)}, 0);
			}
		}, template: `<div> <div class="has-mb-2"> <mx-toggle v-model="values.is_visible" :title="'Скрыть блок'|gettext" :disabled="info.is_readonly" :invert="true"></mx-toggle> </div> <div class="label-pro-container"> <div v-if="!allowPro" class="tag is-pro" data-toggle="tooltip" data-placement="top" :data-original-title="'Эта возможность доступна<br>на pro тарифе'|gettext">pro</div> <div :class="{disabled: !values.is_visible}"> <div class="has-mb-2"> <mx-toggle v-model="values.is_schedule" :title="'Показывать по расписанию'|gettext" :disabled="info.is_readonly || !allowPro"></mx-toggle> </div> <div class="has-mb-2" v-if="values.is_schedule"> <div class="row row-small has-mb-1"> <label class="label col-xs-2 col-sm-1"><p class="form-control-static">{{'От'|gettext}}:</p></label> <div class="col-xs-7 col-sm-8"> <vue-component-datepicker v-model="date_from" icon="calendar-alt" @input="onInputDates" :disabled="!values.is_schedule || info.is_readonly"></vue-component-datepicker> </div> <div class="col-xs-3"> <div class="has-feedback"> <b-clockpicker icon="clock" v-model="time_from" :disabled="!values.is_schedule || info.is_readonly" hour-format="24"></b-clockpicker> <a class="form-control-feedback has-text-grey-light" @click="time_from = null" :class="{disabled: info.is_readonly}" v-if="time_from"><i class="fal fa-times"></i></a> </div> </div> </div> <div class="row row-small"> <label class="label col-xs-2 col-sm-1"><p class="form-control-static">{{'До'|gettext}}:</p></label> <div class="col-xs-7 col-sm-8"> <vue-component-datepicker v-model="date_until" @input="onInputDates" :disabled="!values.is_schedule || info.is_readonly"></vue-component-datepicker> </div> <div class="col-xs-3"> <div class="has-feedback"> <b-clockpicker icon="clock" v-model="time_until" :disabled="!values.is_schedule || info.is_readonly" hour-format="24"></b-clockpicker> <a class="form-control-feedback has-text-grey-light" @click="time_until = null" :class="{disabled: info.is_readonly}" v-if="time_until"><i class="fal fa-times"></i></a> </div> </div> </div> </div> <div> <mx-toggle v-model="values.is_schedule_days" :title="'Показывать по дням недели'|gettext" :disabled="info.is_readonly || !allowPro"></mx-toggle> </div> <div class="has-mt-2 form-horizontal" v-if="values.is_schedule_days"> <div class="row row-small"> <label class="label col-xs-2 col-sm-1 is-hidden-mobile"><p class="form-control-static">{{'Дни'|gettext}}:</p></label> <div class="col-xs-12 col-sm is-flex schedule-days-chooser"> <b-field :class="['is-marginless', {disabled: !values.is_schedule_days}]"> <b-checkbox-button v-for="w in weekdays_schedule" v-model="schedule_days" :native-value="w.index" type="is-dark" @input="onInputDates" class="choose-days">{{w.weekday|gettext}}</b-checkbox-button> </b-field> <p class="form-control-static has-text-grey has-sm-ml-1">{{daysSummary}}</p> </div> </div> </div> </div> </div> </div>`});

window.$app.defineComponent("pages", "vue-pages-blocks-form-statistics", {data() {
			return {
				period_title: '',
				clicks: [],
				chart: [],
				isFetching: false,
			}	
		},
		
		props: {page_id: Number, block_id:Number, period: {
			type: String,
			default: 'day'
		}, period_back: {
			type: Number,
			default: 0
		}, disabled: {
			type: Boolean,
			default: false
		}},
		
		watch: {
			period() {
				this.fetchData(['chart', 'clicks']);
				this.period_back = 0;
			},
			period_back() {
				this.fetchData(['clicks']);
			}
		},
		
		created() {
			this.fetchData(['chart', 'clicks']);
		},
		
		methods: {
			fetchData(scope) {
				this.isFetching = true;
				
				this.$api.get('statistics/get', {page_id: this.page_id, block_id: this.block_id, period: this.period, period_back: this.period_back, scope: scope}).then((data) => {
					if (scope.indexOf('chart') != -1) this.chart = _.map(data.response.statistics.chart, (v, k) => {
						return {date: k, hits: v};
					});

					
					this.clicks = data.response.statistics.clicks;
					this.period_title = data.response.statistics.period.title;
					this.isFetching = false;
				});
			}
		}, template: `<section> <b-field class="has-tabs-style" :class="{disabled: disabled}"> <b-radio-button v-model="period" type="active" class="is-expanded" native-value="day">{{'День'|gettext}}</b-radio-button> <b-radio-button v-model="period" type="active" class="is-expanded" native-value="week">{{'Неделя'|gettext}}</b-radio-button> <b-radio-button v-model="period" type="active" class="is-expanded" native-value="month">{{'Месяц'|gettext}}</b-radio-button> </b-field> <vue-component-statistics :data="chart" :period="period" :period_back="period_back" :line-show="true" :padding-top="30" class="has-mb-3 is-small" :disabled="disabled"></vue-component-statistics> <div class="field has-addons" :class="{disabled: disabled}"> <p class="control"><button class="button" @click="period_back++"><i class="fas fa-caret-left"></i></button></p> <p class="control is-expanded"><span class="button is-static has-background-white is-fullwidth">{{ period_title }}</span></p> <p class="control"><button class="button" :disabled="period_back == 0" @click="period_back--"><i class="fas fa-caret-right"></i></button></p> </div> <b-table :data="clicks" :loading="isFetching" :disabled="disabled"> <template slot-scope="props"> <b-table-column field="title" :label="'Заголовок'|gettext"> {{ props.row.type }} </b-table-column> <b-table-column field="clics" :label="'Клики'|gettext" :class='{"has-text-grey-light": props.row.clicks == 0}' numeric>{{ props.row.clicks | number }}</b-table-column> </template> <template slot="empty"> <section class="has-mb-4 has-mt-4 content has-text-grey has-text-centered" v-if="!isFetching"> <p>{{'Недостаточно данных'|gettext}}</p> </section> <section class="has-mb-4 has-mt-4 content has-text-grey has-text-centered" v-if="isFetching"> <p>{{'Загрузка данных'|gettext}}</p> </section> </template> </b-table> </section>`});

window.$app.defineComponent("pages", "vue-pages-blocks-avatar", {data() {
			return {
				isUpdating: false,
				isUploading: false,
				instagramUpdated: false,
				file: null
			}
		},

		props: ['values', 'variants', 'block', 'block_id', 'info', 'tabs', 'currentTab'],
		mixins: [FormModel],
		
		created() {
			this.block.title = this.$gettext('Аватар');
			this.$emit('update:tabs', []);
		},
		
		methods: {
			dropFilesChanged(is_updating) {
				if (/\.(jpe?g|png|gif)$/i.test(this.file.name)) {
					let formData = new FormData();
					formData.append('file', this.file);
					formData.append('picture_id', this.$account.profile_id);
					
					this.isUploading = true;
					
					this.$http.request({url: '/pictures/upload?target=avatar', method: 'post', data: formData}).then((data) => {
						if (data.result == 'success') {
							//this.$account.avatar.url = '//'+this.$account.storage_domain+'/a/'+r.data.response.filename;
						} else if (data.result == 'error') {
							this.$alert(data.error, 'is-danger');
						}
						
						this.isUploading = false;
						this.file = null;
					}).catch(() => {
						this.isUploading = false;
						this.$alert(this.$gettext('Во время загрузки картинки возникла ошибка'));
					});				
				} else {
					this.isUploading = false;
					this.$alert(this.$gettext('Недопустимый формат файла'));
				}
			},
			
			updateAvatar() {
				this.isUpdating = true;
				this.instagramUpdated = true;
				this.$parent.action('update').then((v) => {
					this.isUpdating = false;
				})
			},
			
			prepareValues() {
				return this.values;
			}
		}, template: `<section class="modal-card-body modal-card-body-blocks"> <section v-if="currentTab == 'common'"> <div class="media" style="align-items: center"> <img :src="$account.avatar.url" class="is-pulled-left has-mr-3" :class="$account.avatar.size|sprintf('profile-avatar profile-avatar-%s')"> <div class="media-content"> <div> <b-upload v-model="file" @input="dropFilesChanged(false)"> <a class="button is-fullwidth-mobile is-success" :class="{'is-loading': isUploading}"><span><i class="fa fas fa-arrow-from-top fa-rotate-180 has-mr-2" :disabled="info.is_readonly"></i>{{'Загрузить картинку'|gettext}}</span></a> </b-upload> <button class="button is-fullwidth-mobile is-light has-xs-mt-1" @click="updateAvatar()" :class="{'is-loading': isUpdating}" :disabled="info.is_readonly || instagramUpdated" v-if="info.has_connected_account && block_id">{{'Импортировать из Instagram'|gettext}}</button> </div> </div> </div> </section> <section :class="{disabled: info.is_readonly}"> <label class="label">{{'Размер аватара'|gettext}}</label> <div class="tabs is-toggle is-fullwidth is-avatar-size-chooser has-mb-1"> <ul> <li :class="{'is-active': values.avatar_size == k}" v-for="(v, k) in variants.avatar_size"><a @click="values.avatar_size = k"><em></em></a></li> </ul> </div> <p class="has-text-grey">{{variants.avatar_size[values.avatar_size]}}</p> </section> <section v-if="info.has_connected_account"> <mx-toggle v-model="values.is_avatar_hide_text" :title="'Скрыть имя профиля под аватаром'|gettext" :disabled="info.is_readonly"></mx-toggle> </section> <slot></slot> </section>`});

window.$app.defineComponent("pages", "vue-pages-blocks-banner", {props: ['values', 'options', 'info', 'variants', 'block', 'block_id', 'block_type_id', 'tabs', 'currentTab', 'allowSave'],
		mixins: [FormModel],
		
		data() {
			return {
				addons_values: null
			}
		},
	
		created() {
			this.block.title = this.$gettext('Баннер');
			
			let tabs = [{name: 'common', title: this.$gettext('Картинка')}, {name: 'options', title: this.$gettext('Настройки')}, {name: 'addons', title: this.$gettext('Модули')}];
			
			if (this.block_id && this.info.is_allow_statistics) tabs.push({name: 'statistics', title: this.$gettext('Статистика')});

			this.$emit('update:tabs', tabs);
		},
		
		computed: {
			pictureSizeStyle() {
				return 'padding-top: '+(this.values.p?(this.values.p.height / this.values.p.width * 100):50)+'%';
			},
			styleOuterContainer() {
				return (this.values.is_scale && this.values.width)?('width: '+this.values.width+'px !important;'):'';
			}
		},
		
		methods: {
			prepareValues() {
				console.log(this.values);
				let values = this.$clone(this.values);
				console.log(values);

				values.addons_values = this.addons_values;
				if (values.p) values.p = values.p.picture_id;
				return values;
			},
			
			startUploading() {
				this.allowSave = false;
				//this.$emit('update:allowSave', this.allowSave);
			},
			
			stopUploading() {
				this.allowSave = true;
				//this.$emit('update:allowSave', this.allowSave);
			}
		}, template: `<section class="modal-card-body modal-card-body-blocks"> <section v-if="info.is_readonly && (currentTab == 'common')" class="message is-warning"> <div class="message-body">{{'Добавьте изображение любого размера и укажите действие при клике'|gettext}}</div> </section> <section v-if="currentTab == 'common'" @click="$parent.scrollToTariff"> <div class="device-pictures-form"> <center> <div class="device has-shadow is-large is-hide-mobile" :class="{disabled: info.is_readonly}"> <div class="notch"></div> <div class="screen page-font"> <div class="has-sm-p-1"> <vue-component-pictures v-model="values.p" class="pictures-form-banner" class-container="picture-container picture-container-upload" :button-title="'Загрузить картинку'|gettext" :style-container="pictureSizeStyle" :style-outer-container="styleOuterContainer" button-icon="fa fal fa-cloud-upload" @startUploading="startUploading" @stopUploading="stopUploading" updatable></vue-component-pictures> </div> </div> </div> </center> <div class='form-shadow form-shadow-bottom is-hidden-mobile' style="height: 20px"></div> </div> </section> <section v-if="currentTab == 'common'" @click="$parent.scrollToTariff"> <mx-toggle v-model="values.is_scale" :title="'Установить максимальную ширину'|gettext" :disabled="info.is_readonly || !values.p"></mx-toggle> <div class="row row-small has-mt-2" v-if="values.is_scale && values.p"> <div class="col-xs-12 col-sm-4"> <b-field> <p class="control is-expanded"><number v-model="values.width" precision="0" :disabled="info.is_readonly" class="input has-text-right" :placeholder="values.p?values.p.width:''"/></p> <p class="control"> <a class="button is-static">px</a> </p> </b-field> </div> </div> </section> <section v-if="currentTab == 'common'" @click="$parent.scrollToTariff"> <mx-toggle v-model="values.is_link" :title="'Сделать баннер ссылкой'|gettext" :disabled="info.is_readonly"></mx-toggle> <div v-if="values.is_link"> <vue-component-link-editor :values.sync="values.link" :variants="variants" :info="info" class="has-mt-2"></vue-component-link-editor> </div> </section> <section v-if="currentTab == 'options'" @click="$parent.scrollToTariff"> <vue-pages-blocks-form-options :values.sync="options" :info="info"></vue-pages-blocks-form-options> </section> <keep-alive> <vue-pages-blocks-form-addons :block_id="block_id" :block_type_id="block_type_id" :addons_values.sync="addons_values" :disabled="info.is_readonly" :parent="parent" v-if="currentTab == 'addons'"> <template slot="message">{{'Вы можете выбрать модули которые будут срабатывать для данной ссылки'|gettext}}</template> <template slot="empty">{{'Модули для данного блока еще не подключены'|gettext}}</template> </vue-pages-blocks-form-addons> </keep-alive> <keep-alive> <vue-pages-blocks-form-statistics :page_id="values.page_id" :block_id="block_id" v-if="currentTab == 'statistics'"></vue-pages-blocks-form-statistics> </keep-alive> <slot></slot> </section>`});

window.$app.defineComponent("pages", "vue-pages-blocks-break", {props: ['values', 'options', 'variants', 'info', 'block', 'block_id', 'tabs', 'currentTab'],
		mixins: [FormModel],
		
		data() {
			return {
				icons: [-1,0,1,2,3,4,5,6,7]
			}
		},
		
		created() {
			this.block.title = this.$gettext('Разделитель');

			let theme = this.$account.theme;
			if (!this.values.design.color) this.values.design.color = theme.screen.color;

			this.$emit('update:tabs', [{name: 'common', title: this.$gettext('Разделитель')},{name: 'options', title: this.$gettext('Настройки')}]);
		},
		
		methods: {
			prepareValues() {
				let values = this.$clone(this.values);
				let theme = this.$account.theme;
				
				if (values.design.color == theme.screen.color) values.design.color = '';
				
				if (!values.design.color) values.design = {on: false}

				return values;
			}
		}, template: `<section class="modal-card-body modal-card-body-blocks"> <section v-if="currentTab == 'common'"> <b-field :label="'Размер отступа'|gettext"> <b-select v-model="values.break_size" :disabled="info.is_readonly" expanded> <option v-for="(v, k) in variants.break_size" :value="k">{{v}}</option> </b-select> </b-field> <label class="label">{{'Тип разделителя'|gettext}}</label> <div class="break-form-type-list has-mb-2 row row-small"> <div v-for="i in icons" class="col-xs-4 col-sm-2 col-md-2"> <div class="break-form-type block-break" @click="values.icon = i" :class="{in: values.icon == i}"><div class="block-break-inner" :class="{'has-icon': i, 'is-invisible': i < 0, 'is-fullwidth': values.fullwidth && i== 0, 'has-fading': values.fading}"><span><i :class="['fa fai', 'fa-'+i]" v-if="i> 0"></i></span></div></div> </div> </div> <div :class="{disabled: values.icon < 0}"> <label class="label">{{'Настройки линии'|gettext}}</label> <mx-toggle v-model="values.fullwidth" class="has-mb-2" :title="'Линия на всю ширину'|gettext" :disabled="info.is_readonly"></mx-toggle> <mx-toggle v-model="values.fading" :title="'Линия с полупрозрачными краями'|gettext" :disabled="info.is_readonly"></mx-toggle> </div> </section> <section v-if="currentTab == 'options'" @click="$parent.scrollToTariff"> <div class="label-pro-container"> <div class="tag is-pro" v-if="!$auth.isAllowTariff('pro')" data-toggle="tooltip" data-placement="top" :data-original-title="'Эта возможность доступна<br>на pro тарифе'|gettext">pro</div> <div :class="{disabled: !$auth.isAllowTariff('pro')}"> <div class="has-mb-2"><mx-toggle v-model='values.design.on' :title="'Свои настройки дизайна'|gettext" :disabled="info.is_readonly"></mx-toggle></div> <div v-if="values.design.on"> <div class="has-mb-2"> <vue-component-colorpicker v-model="values.design.color" :label="'Цвет'|gettext" :disabled="info.is_readonly" :colors="[$account.theme.screen.color]"></vue-component-colorpicker> </div> </div> </div> </div> <vue-pages-blocks-form-options :values.sync="options" :info="info"></vue-pages-blocks-form-options> </section> <slot></slot> </section>`});

window.$app.defineComponent("pages", "vue-pages-blocks-collapse", {props: ['values', 'options', 'variants', 'info', 'block', 'block_id', 'tabs', 'currentTab'],
		mixins: [FormModel],
		
		data() {
			return {
				current: 0
			}
		},
		
		created() {
			this.block.title = this.$gettext('Вопросы и ответы');
			let theme = this.$account.theme;

			if (!this.values.design.color) this.values.design.color = theme.screen.color;
			if (!this.values.design.font) this.values.design.font = theme.screen.font;

			this.$emit('update:tabs', [{name: 'common', title: this.block.title},{name: 'options', title: this.$gettext('Настройки')}]);
		},
		
		methods: {
			prepareValues() {
				let values = this.$clone(this.values);
				let theme = this.$account.theme;
				
				if (values.design.color == theme.screen.color) values.design.color = '';
				if (values.design.font == theme.screen.font) values.design.font = '';
				
				if (!values.design.color && !values.design.font) values.design = {on: false}

				return values;
			},
			
			onRemove(index) {
				this.$confirm(this.$gettext('Вы уверены что хотите удалить этот вопрос?'), 'is-danger').then(() => {
					this.values.fields.splice(index, 1);
				});
			},
			
			onAdd() {
				this.values.fields.push({title: '', text: '', opened: true});
				this.current = this.values.fields.length - 1;
				
				this.$nextTick(() => {
					this.$refs.fields.querySelector('.in input').focus();
				});
			}
		}, template: `<section class="modal-card-body modal-card-body-blocks"> <section v-if="currentTab == 'common'"> <div ref="fields"> <vue-component-sortable-form-fields v-model="values.fields" :current.sync="current"> <template v-slot:title="{ item }"> <span><span v-if="item.title">{{ item.title }}</span><span v-else>{{'Заголовок'|gettext}}</span></span> </template> <template v-slot:action="{ index }"> <a class="is-pulled-right has-text-danger" @click.stop="onRemove(index)" :class="{disabled: info.is_readonly}"><i class="fa fa-trash-alt"></i></a> </template> <template v-slot:form="{ item, index }"> <div class="field"> <label>{{'Заголовок'|gettext}}</label> <b-input type="text" v-model="item.title" :disabled="info.is_readonly"></b-input> </div> <div class="field"> <label>{{'Текст'|gettext}}</label> <vue-component-emoji-picker v-model="item.text"> <textarea class="input" v-model="item.text" :disabled="info.is_readonly" v-emoji rows="6"></textarea> </vue-component-emoji-picker> </div> </template> </vue-component-sortable-form-fields> </div> </section> <section v-if="currentTab == 'common'"> <button type="button" @click="onAdd" class="button is-success" :class="{disabled: info.is_readonly}"><i class="fas fa-plus has-mr-1"></i>{{'Добавить новый пункт'|gettext}}</button> </section> <section v-if="currentTab == 'options'"> <div class="label-pro-container"> <div class="tag is-pro" v-if="!$auth.isAllowTariff('pro')" data-toggle="tooltip" data-placement="top" :data-original-title="'Эта возможность доступна<br>на pro тарифе'|gettext">pro</div> <div :class="{disabled: !$auth.isAllowTariff('pro')}"> <div class="has-mb-2"><mx-toggle v-model='values.design.on' :title="'Свои настройки дизайна'|gettext" :disabled="info.is_readonly"></mx-toggle></div> <div v-if="values.design.on"> <div class="has-mb-2"> <vue-component-colorpicker v-model="values.design.color" :label="'Цвет текста'|gettext" :disabled="info.is_readonly" :colors="[$account.theme.screen.color]"></vue-component-colorpicker> </div> <div class="has-mb-2 link-styles-container"> <label class="form-control-static">{{'Шрифт'|gettext}}</label> <vue-component-font-chooser v-model="values.design.font" view="name"></vue-component-font-chooser> </div> </div> </div> </div> <vue-pages-blocks-form-options :values.sync="options" :info="info"></vue-pages-blocks-form-options> </section> <slot></slot> </section>`});

window.$app.defineComponent("pages", "vue-pages-blocks-form", {props: ['values', 'options', 'parent', 'info', 'variants', 'block_type_id', 'info', 'block', 'block_id', 'tabs', 'currentTab'],
		mixins: [FormModel],
		
		data() {
			return {
				addons_values: null,
				action: null
			}
		},
		
		created() {
			this.block.title = this.$gettext('Форма');
			
			let tabs = [
				{name: 'common', title: this.$gettext('Поля')},
				{name: 'options', title: this.$gettext('Настройки')}
			];
				
			if (this.$account.features.indexOf('payments') != -1) tabs.push({name: 'pays', title: this.$gettext('Оплаты')});
			if (this.$account.features.indexOf('addons') != -1) tabs.push({name: 'addons', title: this.$gettext('Модули')});

/*
			let theme = this.$account.theme;
			if (!this.values.link_color) this.values.link_color = theme.link.color;
			if (!this.values.link_bg) this.values.link_bg = theme.link.bg;
*/

			this.$emit('update:tabs', tabs);
		},
		
		computed: {
			currentPaidStatus() {
				let s = '';
				for (let i = 0; i < this.variants.paid_status_id.length; i++) {
					if (this.variants.paid_status_id[i].status_id == this.values.paid_status_id) {
						s = this.variants.paid_status_id[i].status;
						break;
					}
				}
				
				return s;
			}
		},
		
		methods: {
			prepareValues() {
				let values = this.$clone(this.values);
				values.addons_values = this.addons_values;
				
				values.fields = _.map(values.fields, (v) => {
					return _.pick(v, ['default', 'required', 'text', 'title', 'type_id', 'variants', 'idx']);
				});
				
				let theme = this.$account.theme;
				if ((values.design.text == theme.link.color) && (values.design.bg == theme.link.bg)) values.design = {on: false}
				
				return values;
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
		}, template: `<section class="modal-card-body modal-card-body-blocks"> <section v-if="info.is_readonly && (currentTab == 'common')" class="message is-warning"> <div class="message-body">{{'С помощью этого блока, вы сможете создать форму для сбора контактных данных и добавить прием оплаты'|gettext}}</div> </section> <section v-if="currentTab == 'common'" @click="$parent.scrollToTariff"> <b-select :placeholder="'-- Добавить поле --'|gettext" v-model="action" @input="onAction" :disabled="info.is_readonly" expanded> <option v-for="(f, i) in variants.fields_types" :value="i">{{ f }}</option> </b-select> </section> <section v-if="currentTab == 'common'" @click="$parent.scrollToTariff"> <vue-component-form-blocks v-model="values.fields" :variants="variants" :disabled="info.is_readonly"></vue-component-form-blocks> </section> <section v-if="currentTab == 'options'" @click="$parent.scrollToTariff"> <b-field :label="'Текст на кнопке'|gettext"> <input type="text" v-model="values.form_btn" class="input" :disabled="info.is_readonly" :placeholder="'Отправить'|gettext"> </b-field> </section> <section v-if="currentTab == 'options'" @click="$parent.scrollToTariff"> <b-field :label="'Действие после заполнения формы'|gettext"> <b-select v-model="values.form_type" :disabled="info.is_readonly" expanded> <option v-for="(v, k) in variants.form_type" :value="k">{{v}}</option> </b-select> </b-field> <b-field v-if="values.form_type == 'link'" :class="{'has-error': errors.link}" :message="errors.link"> <input type='text' v-model='values.link' class='input' placeholder='http://' autocorrect="off" autocapitalize="none" :disabled="info.is_readonly"> </b-field> <b-field v-if="values.form_type == 'page'" :class="{'has-error': errors.link_page_id}" :message="errors.link_page_id"> <b-select v-model="values.link_page_id" :placeholder="'-- Не выбрано --'|gettext" :disabled="info.is_readonly" expanded> <option v-for="(v, k) in variants.link_page_id" :value="k">{{v}}</option> </b-select> </b-field> <b-field v-if="values.form_type == 'text'" :class="{'has-error': errors.form_text}" :message="errors.form_text"> <textarea v-model='values.form_text' class='input' style="min-height: 100px" :disabled="info.is_readonly" :placeholder="'Спасибо за вашу заявку'|gettext"></textarea> </b-field> </section> <section v-if="currentTab == 'options'" @click="$parent.scrollToTariff"> <vue-pages-blocks-form-design :values.sync="values.design" :info="info"></vue-pages-blocks-form-design> <vue-pages-blocks-form-options :values.sync="options" :info="info"></vue-pages-blocks-form-options> </section> <section v-if="currentTab == 'pays'" @click="$parent.scrollToTariff"> <div v-if="$auth.isAllowTariff('business') && !info.amount_payments_providers" class='message is-danger'><div class="message-body">{{'Чтобы принимать оплату, вам необходимо настроить платежные системы в разделе'|gettext}} "<a href="/profile/settings/payments/" target="_blank">{{'Настройки'|gettext}}</a>".</div></div> <div class="has-mb-2"><mx-toggle v-model='values.is_order' :title="'Принимать оплату'|gettext" :disabled="info.is_readonly"></mx-toggle></div> <div class="row" :class="{disabled: !values.is_order}"> <div class="col-sm-4 col-xs-12 has-mb-2" :class="{'has-error': errors.order_budget}"><label class="label">{{'Цена'|gettext}}</label> <div class="field has-addons"> <div class="control is-expanded"> <number v-model="values.order_budget" :precision="$account.currency.precision" class="input has-text-right" :disabled="info.is_readonly"> </div> <div class="control"><div class="button is-static">{{$account.currency.title}}</div></div> </div> </div> <div class="col-sm-8 col-xs-12" :class="{'has-error': errors.order_purpose}"> <div class="field"> <label class="label">{{'Назначение платежа'|gettext}}</label> <div class="row row-small"> <div class="col-xs-12 col-sm-4 has-mb-2"> <b-select v-model="values.payment_object_id" :disabled="info.is_readonly" expanded> <option v-for="(v, k) in variants.payment_object_id" :value="k">{{v}}</option> </b-select> </div> <div class="col-xs-12 col-sm-8 has-mb-2"><input type='text' v-model='values.order_purpose' class='input' :disabled="info.is_readonly"></div> </div> </div> </div> </div> <div :class="{disabled: !values.is_order}"> <b-checkbox v-model="values.paid_change_status" :disabled="info.is_readonly">{{'После успешной оплаты менять статус'|gettext}}:</b-checkbox> <b-dropdown aria-role="list" position="is-top-right" :disabled="!values.paid_change_status || info.is_readonly"><label :disabled="!values.paid_change_status || info.is_readonly" :class="{'has-text-primary': values.paid_change_status}" class="b-checkbox checkbox is-marginless" slot="trigger" aria-role="listitem">{{currentPaidStatus}}</label> <b-dropdown-item @click="values.paid_status_id = s.status_id;" v-for="s in variants.paid_status_id"><i class="fas fa-circle has-mr-1" :style='"color:#{1}"|format(s.color)'></i> {{s.status}}</b-dropdown-item> </b-dropdown> </div> </section> <keep-alive> <vue-pages-blocks-form-addons :block_id="block_id" :block_type_id="block_type_id" :values="values" :addons_values.sync="addons_values" :disabled="info.is_readonly" :parent="parent" v-if="currentTab == 'addons'" @click="$parent.scrollToTariff"> <template slot="message">{{'Вы можете выбрать модули которые будут срабатывать для данной формы'|gettext}}</template> <template slot="empty">{{'Модули для данного блока еще не подключены'|gettext}}</template> </vue-pages-blocks-form-addons> </keep-alive> <slot></slot> </section>`});

window.$app.defineComponent("pages", "vue-pages-blocks-html", {props: ['values', 'options', 'variants', 'info', 'block', 'block_id', 'tabs', 'currentTab'],
		mixins: [FormModel],
		
		created() {
			this.block.title = this.$gettext('HTML код');
			this.$emit('update:tabs', [{name: 'common', title: this.$gettext('HTML')},{name: 'options', title: this.$gettext('Настройки')}]);
		},
		
		methods: {
			prepareValues() {
				return this.values;
			}
		}, template: `<section class="modal-card-body modal-card-body-block-html modal-card-body-blocks"> <section v-if="currentTab == 'common'" @click="$parent.scrollToTariff"> <div class="panel panel-default"> <vue-component-codemirror v-model="values.html" :disabled="info.is_readonly" style="min-height: 100px"></vue-component-codemirror> </div> </section> <section v-if="currentTab == 'options'" @click="$parent.scrollToTariff"> <vue-pages-blocks-form-options :values.sync="options" :info="info"></vue-pages-blocks-form-options> </section> <slot></slot> </section>`});

window.$app.defineComponent("pages", "vue-pages-blocks-link", {props: ['values', 'options', 'parent', 'variants', 'info', 'block', 'block_id', 'block_type_id', 'tabs', 'currentTab'],
		mixins: [FormModel],
		
		data() {
			return {
				addons_values: null
			}
		},
		
		created() {
			let tabs = [{name: 'common', title: this.$gettext('Ссылка')},{name: 'options', title: this.$gettext('Настройки')},{name: 'addons', title: this.$gettext('Модули')}];
			if (this.block_id && this.info.is_allow_statistics) tabs.push({name: 'statistics', title: this.$gettext('Статистика')});
			
			this.block.title = this.$gettext('Ссылка');
			this.$emit('update:tabs', tabs);
		},
		
		computed: {
			error() {
				return this.errors.link || this.errors.email || this.errors.phone || this.errors.product || this.errors.link_page_id || this.errors.collection;
			}
		},
		
		methods: {
			prepareValues() {
				let values = this.$clone(this.values);
				values.addons_values = this.addons_values;

				let theme = this.$account.theme;
				if ((values.design.text == theme.link.color) && (values.design.bg == theme.link.bg)) values.design = {on: false}
				
				return values;
			}
		}, template: `<section class="modal-card-body modal-card-body-blocks"> <section v-if="currentTab == 'common'"> <b-field :label="'Текст ссылки'|gettext" :class="{'has-error': errors.title}" :message="errors.title"> <div> <input class="input has-mb-1" v-model="values.title" :disabled="info.is_readonly" :placeholder="'Заголовок'|gettext"></input> <input class="input" v-model="values.subtitle" :disabled="info.is_readonly" :placeholder="'Подзаголовок'|gettext"></input> </div> </b-field> <b-field :class="{'has-error': error}" :message="error"> <vue-component-link-editor :values.sync="values" :variants="variants" :info="info"></vue-component-link-editor> </b-field> </section> <section v-if="currentTab == 'options'"> <vue-pages-blocks-form-design :values.sync="values.design" :info="info"></vue-pages-blocks-form-design> <vue-pages-blocks-form-options :values.sync="options" :info="info"></vue-pages-blocks-form-options> </section> <keep-alive> <vue-pages-blocks-form-addons v-if="currentTab == 'addons'" :block_id="block_id" :block_type_id="block_type_id" :addons_values.sync="addons_values" :disabled="info.is_readonly" :parent="parent"> <template slot="message">{{'Вы можете выбрать модули которые будут срабатывать для данной ссылки'|gettext}}</template> <template slot="empty">{{'Модули для данного блока еще не подключены'|gettext}}</template> </vue-pages-blocks-form-addons> </keep-alive> <keep-alive> <vue-pages-blocks-form-statistics v-if="currentTab == 'statistics'" :page_id="values.page_id" :block_id="block_id"></vue-pages-blocks-form-statistics> </keep-alive> <slot></slot> </section>`});

window.$app.defineComponent("pages", "vue-pages-blocks-map", {props: ['values', 'options', 'variants', 'info', 'block', 'block_id', 'tabs', 'currentTab'],
		mixins: [FormModel],
		
		data() {
			return {
				query: '',
				isGeocoding: false,
				current: 0,
				map: null,
				markers: []
			}
		},
		
		created() {
			this.block.title = this.$gettext('Карта');
			let tabs = [
				{name: 'common', title: this.$gettext('Карта и метки')},
				{name: 'extended', title: this.$gettext('Опции карты')},
				{name: 'options', title: this.$gettext('Настройки')}
			];
			
			let theme = this.$account.theme;
			if (!this.values.link_color) this.values.link_color = theme.link.color;
			if (!this.values.link_bg) this.values.link_bg = theme.link.bg;
			
			if (this.block_id) tabs.push({name: 'statistics', title: this.$gettext('Статистика')});
			this.$emit('update:tabs', tabs);
		},
		
		mounted() {
			$mx.lazy('map.js', 'map.css', () => {
				let options = this.$clone(this.values.bounds);
				if (options.length == 0) options = {zoom: 4, center: {lat:55.5807481, lng:36.8251304}};
				
				this.map = L.map(this.$refs.map, {
					attributionControl: false,
				}).setView([options.center.lat, options.center.lng], options.zoom);
				
				L.control.attribution({prefix: ''}).addTo(this.map);
				
				//'https://maps.tilehosting.com/styles/basic/{z}/{x}/{y}.png?key=V8rA6J6w5KhzV2N0rq8g'
				L.tileLayer('/maps/{z}/{x}/{y}.png', {
			        attribution: '',
			        crossOrigin: true
				}).addTo(this.map);
				
				this.icon = L.icon({
				    iconUrl: '/s/i/marker.png',
				    iconSize: [28, 37],
		// 		    iconAnchor: [22, 94],
				    popupAnchor: [0, -10],
				    shadowUrl: '/s/i/marker-shadow.png',
				    shadowSize: [40, 50],
				    shadowAnchor: [12, 31]
				});
				
				let updated = () => {
					let b = this.map.getBounds();
					this.values.bounds = {center: this.map.getCenter(), zoom: this.map.getZoom(), bounds: [[b.getNorth(), b.getEast()], [b.getSouth(), b.getWest()]]};
				}
				
				if (this.values.bounds.length == 0) {
					navigator.geolocation.getCurrentPosition((position) => {
						var pos = {
							lat: position.coords.latitude,
							lng: position.coords.longitude
						};
					
						this.map.setView(pos, 10);
						updated();
					});
				}

				
				
				this.map.on('moveend', updated);
				this.map.on('zoomend', updated);
				
				updated();
				
				_.each(this.values.markers, this.addMarkerInternal);
			});
		},
		
		methods: {
			addMarkerInternal(v) {
				var loc = {lat: parseFloat(v.lat), lng: parseFloat(v.lng)}
				
				var marker = L.marker([loc.lat, loc.lng], {icon: this.icon, draggable: true}).addTo(this.map);
				marker.on('dragend', (e) => {
					
					let ll = marker.getLatLng();
					v.lat = ll.lat;
					v.lng = ll.lng;
				});
				
				this.markers.push(marker);			
			},
			
			addMarker() {
				if (this.query.trim() == '') return;
				this.isGeocoding = true;
				$mx.lazy('//maps.googleapis.com/maps/api/js?key=AIzaSyCsYkpOHG_vddnpHQJ8kamy4RGt81HCfCU&libraries=places', () => {
					var geocoder = new google.maps.Geocoder;
			        geocoder.geocode( { 'address': this.query}, (results, status) => {
						if (status == 'OK' && results.length && results[0].geometry) {
							var loc = results[0].geometry.location;
							 
							let v = {lng: loc.lng(), lat: loc.lat(), text: '', title: this.query};
							this.values.markers.push(v);
							this.current = this.values.markers.length - 1;
							this.addMarkerInternal(v);
							
							
							if (this.markers.length) {
								let group = new L.featureGroup(this.markers);
								this.map.fitBounds(group.getBounds());
							}
							
							this.$nextTick(() => {
								if (this.markers.length == 1) this.$refs.markers.querySelector('.in textarea').focus();
							});
							
							this.query = '';
						}
	
						this.isGeocoding = false;
					});
				});
			},
			
			deleteMarker(index) {
				this.map.removeLayer(this.markers[index]);
				this.markers.splice(index, 1);
				this.values.markers.splice(index, 1);
			},
			
			prepareValues() {
				let values = this.$clone(this.values);
			
				values.markers = _.map(values.markers, (v) => {
					return _.pick(v, ['lng', 'lat', 'title', 'text']);
				});
				
				let theme = this.$account.theme;
				if ((values.design.text == theme.link.color) && (values.design.bg == theme.link.bg)) values.design = {on: false}
				
				return values;
			}
		}, template: `<section class="modal-card-body modal-card-body-blocks"> <section v-if="info.is_readonly && (currentTab == 'common')" class="message is-warning"> <div class="message-body">{{'Здесь вы можете добавить карту и отметить ваши адреса'|gettext}}</div> </section> <section :class="{'is-hidden': currentTab != 'common'}" @click="$parent.scrollToTariff"> <div class="map-container map-view-with-zoom-control" :class="{disabled: info.is_readonly}"> <div class="map-form" ref='map'></div> </div> </section> <section :class="{'is-hidden': currentTab != 'common'}" @click="$parent.scrollToTariff"> <div class="has-mb-2"> <div class="row row-small"> <div class="col-xs"> <b-input v-model="query" autocorrect="off" autocapitalize="off" spellcheck="false" :placeholder="'Введите адрес метки'|gettext" @keyup.native.enter="addMarker" :loading="isGeocoding" :disabled="info.is_readonly"></b-input> </div> <div class="col-xs col-shrink"> <button type='button' class="button is-success" @click="addMarker" :class="{'is-loading': isGeocoding}" :disabled="info.is_readonly">{{'Добавить метку'|gettext}}</button> </div> </div> </div> <div ref='markers'> <vue-component-sortable-form-fields v-model="values.markers" :current.sync="current"> <template v-slot:title="{ item }"> <span v-if="item.title">{{item.title}}</span> <span v-else>{{'Заголовок'|gettext}}</span> </template> <template v-slot:action="{ index }"> <a class="has-text-danger is-pulled-right" @click.stop="deleteMarker(index)" :class="{disabled: info.is_readonly}"><i class="fa fa-trash-alt"></i></a> </template> <template v-slot:form="{ item, index }"> <div class="field"> <input type="text" v-model="item.title" class="input" :placeholder="'Заголовок'|gettext" :disabled="info.is_readonly"> </div> <div class="field"> <textarea class="input" v-model="item.text" :placeholder="'Режим работы, этаж и другая полезная информация'|gettext" :disabled="info.is_readonly"></textarea> </div> </template> </vue-component-sortable-form-fields> </div> </section> <section v-if="currentTab == 'extended'" @click="$parent.scrollToTariff"> <div class="has-mb-2"><mx-toggle v-model="values.is_fixed" :title="'Зафиксировать карту'|gettext" :disabled="info.is_readonly"></mx-toggle></div> <div class="has-mb-2"><mx-toggle v-model="values.show_buttons" :title="'Добавить отдельные ссылки для каждой метки'|gettext" :disabled="info.is_readonly"></mx-toggle></div> <div><mx-toggle v-model="values.show_zoom" :title="'Показывать ползунок масштабирования'|gettext" :disabled="info.is_readonly"></mx-toggle></div> </section> <section v-if="currentTab == 'options'" @click="$parent.scrollToTariff"> <vue-pages-blocks-form-design :values.sync="values.design" :info="info"></vue-pages-blocks-form-design> <vue-pages-blocks-form-options :values.sync="options" :info="info"></vue-pages-blocks-form-options> </section> <keep-alive> <vue-pages-blocks-form-statistics :page_id="values.page_id" :block_id="block_id" v-if="currentTab == 'statistics'" @click="$parent.scrollToTariff"></vue-pages-blocks-form-statistics> </keep-alive> <slot></slot> </section>`});

window.$app.defineComponent("pages", "vue-pages-blocks-messenger", {props: ['values', 'options', 'parent', 'variants', 'info', 'block', 'block_id', 'block_type_id', 'tabs', 'currentTab'],
		mixins: [FormModel],
		
		data() {
			return {
				addons_values: null,
				platforms: {
					telegram: {placeholder: 'Например: Написать в {1}', types: {v: {label: 'Имя пользователя', type: 'input'}}},
					vk: {placeholder: 'Например: Написать в {1}', types: {v: {label: 'Имя пользователя', type: 'input'}}},
					fb: {placeholder: 'Например: Написать в {1}', types: {v: {label: 'Имя пользователя', type: 'input'}}},
					sk: {placeholder: 'Например: Позвонить в {1}', types: {v: {label: 'Имя пользователя', type: 'input'}}},
					whatsapp: {placeholder:'Например: Написать в {1}', types: {v: {label: 'Укажите ваш номер телефона', type: 'phone', check: 'Телефон'}, c: {label: 'Укажите ссылку на чат', type: 'input', check: 'Чат', placeholder: 'https://chat.whatsapp.com/****************'}}, inputs: {text: {label: 'Текст-шаблон сообщения', placeholder: 'Пример: Здравствуйте, как можно сделать заказ?', type: 'textarea'}}},
					viber: {placeholder: 'Например: Написать в {1}', types: {v: {label: 'Укажите ваш номер телефона', type: 'phone', check: 'Телефон'}, c: {label: 'Укажите ссылку на канал', type: 'input', check: 'Канал', placeholder: 'https://viber.com/****************'}}}
				}
			}
		},
				
		created() {
			this.block.title = this.$gettext('Мессенджеры');

			let tabs = [{name: 'common', title: this.$gettext('Ссылки')}, {name: 'options', title: this.$gettext('Настройки')}, {name: 'addons', title: this.$gettext('Модули')}];
			if (this.block_id && this.info.is_allow_statistics) tabs.push({name: 'statistics', title: this.$gettext('Статистика')});

			this.$emit('update:tabs', tabs);
		},
		
		computed: {
			titles() {
				return {'whatsapp': 'WhatsApp', 'telegram': 'Telegram', 'fb': 'Facebook Messenger', 'vk': this.$gettext('ВКонтакте'), 'viber': 'Viber', 'sk': 'Skype', 'ln': 'Line'}
			},
			
			textLine1() {
				return this.$gettext('Откройте Line@ > Выберите аккаунт > Найти новых друзей > Выберите URL-адрес > Копировать');
			},
			
			textLine2() {
				return this.$gettext('Откройте Line > Пригласить друзей > Пригласить > Поделиться > Выберите любой мессенджер или email > Скопируйте ссылку из сообщения');
			}
		},
		
		methods: {
			prepareValues() {
				let values = this.$clone(this.values);
				values.addons_values = this.addons_values;

				return values;
			},
			
			getError(part, val) {
				return this.errors[part]?this.errors[part][val]:null;
			}
		}, template: `<section class="modal-card-body modal-card-body-blocks"> <div slot="trigger"></div> <section v-if="info.is_readonly && (currentTab == 'common')" class="message is-warning"> <div class="message-body">{{'Клиенту больше не нужно будет запоминать ваш номер, сохранять, заходить в месенджер, искать вас и писать сообщение, ведь, чем сложнее с вами связаться, тем больше вероятность, что клиент отвлечется и уже забудет о вас или ему будет просто лень писать вам! Вы можете уже заранее ввести нужный текст-шаблон для клиента, чтобы ему не пришлось ничего писать!'|gettext}}</div> </section> <section v-if="currentTab == 'common'" @click="$parent.scrollToTariff"> <b-select v-model="values.messenger_style" :disabled="info.is_readonly" expanded> <option v-for="(f, i) in variants.messenger_style" :value="i">{{ f }}</option> </b-select> </section> <section v-if="currentTab == 'common'" @click="$parent.scrollToTariff"> <sortable-list class="form-fields-item-list" lockAxis="y" v-model="values.items" use-drag-handle> <sortable-item v-for="(link, index) in values.items" class="form-fields-item" :class="{in: link.a}" :index="index" :key="index" :item="link" :disabled="info.is_readonly"> <div class="form-fields-item-title" @click="link.a = !link.a"> <div v-sortable-handle class="form-fields-item-handle"></div> <span>{{titles[link.n]}}</span> <mx-toggle v-model="link.a" class="pull-right"></mx-toggle> </div> <div class="form-fields-item-options" v-if="link.a"> <div v-if="platforms[link.n] != undefined"> <b-field :label="'Текст ссылки'|gettext"> <input v-model="link.t" class="input" :placeholder="platforms[link.n].placeholder|gettext|format(titles[link.n])" :disabled="info.is_readonly"> </b-field> <div class="form-messengers-switch has-text-grey" v-if="Object.keys(platforms[link.n].types).length> 1"> <a href="#" v-for="(t, k) in platforms[link.n].types" :class="{'has-text-black': link.tp == k, 'has-text-grey': link.tp != k}" @click="link.tp = k">{{t.check|gettext}}</a> </div> <b-field v-for="(t, k) in platforms[link.n].types" v-if="(Object.keys(platforms[link.n].types).length == 1) || (link.tp == k)" :label="t.label|gettext" :message="getError(link.n, k)" :class="{'has-error': getError(link.n, k)}"> <input v-model="link[k]" v-if="t.type == 'input'" class="input" :disabled="info.is_readonly" :placeholder="t.placeholder|gettext"> <mx-phone v-model="link[k]" v-if="t.type == 'phone'" :disabled="info.is_readonly"></mx-phone> </b-field> <b-field v-for="(ipt, inm) in platforms[link.n].inputs" :label="ipt.label|gettext"> <textarea v-if="ipt.type == 'textarea'" v-model="link[inm]" :placeholder="ipt.placeholder|gettext" class="input" :disabled="info.is_readonly" style="min-height: 100px"></textarea> </b-field> </div> <div v-if="link.n == 'ln'"> <b-field :label="'Текст ссылки'|gettext"> <input v-model="link.t" class="input" :placeholder="'Например: Напишите в Line'|gettext" :disabled="info.is_readonly"> </b-field> <b-field :label="'Имя пользователя'|gettext" :message="getError('ln', 'v')" :class="{'has-error': getError('ln', 'v')}" :disabled="info.is_readonly"> <input v-model="link.v" class="input"> </b-field> <div>{{'Как получить ссылку'|gettext}}: <b-tooltip :label="textLine1" position="is-top" animated multilined type="is-black"><span class='has-text-danger'>Line@</span></b-tooltip> / <b-tooltip :label="textLine2" position="is-top" animated multilined type="is-black"><span class='has-text-danger'>Line</span></b-tooltip> </div> </div> </div> </sortable-item> </sortable-list> </section> <section v-if="currentTab == 'options'" @click="$parent.scrollToTariff"> <vue-pages-blocks-form-design :values.sync="values.design" :info="info"></vue-pages-blocks-form-design> <vue-pages-blocks-form-options :values.sync="options" :info="info"></vue-pages-blocks-form-options> </section> <keep-alive> <vue-pages-blocks-form-addons :block_id="block_id" :block_type_id="block_type_id" :addons_values.sync="addons_values" :disabled="info.is_readonly" :parent="parent" v-if="currentTab == 'addons'" @click="$parent.scrollToTariff"> <template slot="message">{{'Вы можете выбрать модули которые будут срабатывать для данной ссылки'|gettext}}</template> <template slot="empty">{{'Модули для данного блока еще не подключены'|gettext}}</template> </vue-pages-blocks-form-addons> </keep-alive> <keep-alive> <vue-pages-blocks-form-statistics :page_id="values.page_id" :block_id="block_id" v-if="currentTab == 'statistics'" @click="$parent.scrollToTariff"></vue-pages-blocks-form-statistics> </keep-alive> <slot></slot> </section>`});

window.$app.defineComponent("pages", "vue-pages-blocks-page", {props: ['values', 'info', 'variants', 'block', 'block_id', 'tabs', 'currentTab'],
		mixins: [FormModel],
		
		created() {
			this.block.title = this.$gettext('Новая страница');
			this.$emit('update:message', this.$gettext('С помощью этого блока, вы сможете создавать множество внутренних страниц с отдельной ссылкой'));
			this.$emit('update:tabs', []);
		},
		
		methods: {
			prepareValues() {
				return this.values;
			}
		}, template: `<section class="modal-card-body modal-card-body-blocks"> <section v-if="currentTab == 'common'" @click="$parent.scrollToTariff"> <b-field :label="'Открыть страницу'|gettext"> <b-select v-model="values.link_page_id" :disabled="info.is_readonly" expanded> <option :value="null">{{'-- Создать новую страницу --'|gettext}}</option> <option v-for="(v, k) in variants.link_page_id" :value="k">{{v}}</option> </b-select> </b-field> <b-field :label="'Название страницы'|gettext" :message="errors.title" :class="{'has-error': errors.title}" v-if="!values.link_page_id"> <input v-model="values.title" class="input" :disabled="info.is_readonly"> </b-field> </section> <slot></slot> </section>`});

window.$app.defineComponent("pages", "vue-pages-blocks-pictures", {data() {
			return {
/*
				isFetchingProduct: false,
				isFetchingCollection: false,
				autocompleteProducts: [],
				autocompleteCollections: [],
*/
				index: 0,
				picturesUpdating: 0,
				resortMode: false,
				deviceStyle: 'margin: 0 auto;display: block;height: auto'
			}
		},
		
		props: ['values', 'options', 'variants', 'info', 'block', 'block_id', 'statistics', 'tabs', 'currentTab'],
		mixins: [FormModel],
		
		created() {
			let tabs = [{name: 'common', title: this.$gettext('Картинки')},{name: 'options', title: this.$gettext('Настройки')}];
			if (this.block_id) tabs.push({name: 'statistics', title: this.$gettext('Статистика')});
			
			let theme = this.$account.theme;
			if (!this.values.design.text) this.values.design.text = '#000000';
			if (!this.values.design.bg) this.values.design.bg = '#ffffff';
			if (!this.values.design.button_text) this.values.design.button_text = '#0383de';
			
			
			this.block.title = this.$gettext('Карусель картинок');
			this.$emit('update:tabs', tabs);
		},
		
		mounted() {
			$mx(this.$refs.device).on('changeindex', (e, idx) => {
				this.index = idx;
			})
		},
		
		destoyed() {
			$mx(this.$refs.device).off('changeindex');
		},
		
		computed: {
			link() {
				return this.values.list[this.index].link;
			},
			
			pictureSizeStyle() {
				let sizes = {
					100: 100,
					70: '70.6',
					50: 50,
					138: '141.4516'
				}
				return 'padding-top:'+sizes[this.values.picture_size]+'%';
			},
			
			stylesheetText() {
				var s = '';
				if (this.values.design.on && (this.values.design.text || this.values.design.bg)) s =  
					(this.values.design.text?('color:'+this.values.design.text+' !important;'):'') + 
					(this.values.design.bg?('background:'+this.values.design.bg+' !important;'):'');

				return s;
			},
			
			stylesheetLink() {
				var s = '';
				if (this.values.design.on && (this.values.design.button_text || this.values.design.bg)) s =
					(this.values.design.button_text?('color:'+this.values.design.button_text+' !important;'):'') + 
					(this.values.design.bg?('background:'+this.values.design.bg+' !important;'):'');
				return s;
			}
		},
		
		methods: {
			switchReorderMode() {
				this.resortMode = !this.resortMode;
				if (this.resortMode) {
					this.$nextTick(() => {
						let o = this.$refs.toolbar;
//						$mx(o).closest(window.matchMedia("(max-width: 767px)").matches?'.modal-card-body':'.modal').scrollTo(o, 400);
						scrollIt(o, 'y', $mx(o).closest(window.matchMedia("(max-width: 767px)").matches?'.modal-card-body':'.modal')[0], 400);
					});
				}
			},
			prepareResortStyle(p) {
				return (p == undefined || p.progress != undefined || p.link == undefined)?'none':('url('+p.link+')');
			},
						
			onDeletePicture(i, e) {
				if (this.values.list.length == 1) {
					if (e.empty) {
						this.$alert(this.$gettext('В карусели должна быть хотя бы одна картинка'), 'is-danger');
					}
					return;
				}
				
				if (this.index == i && i) this.setIndex(this.index - 1);
				this.values.list.splice(i, 1);
				
				if (this.values.list.length == 1) this.resortMode = false;
			},
			
			addSlide() {
				if (this.values.list.length >= 15) {
					this.$alert(this.$gettext('Максимальное количество слайдов')+': 15', 'is-danger');
                } else {
					this.values.list.push({p: null, s: '', t: '', link: {title: '', type: this.values.list[this.index].link.type, link: '', link_page_id: null, product: '', collection: ''}});
					this.setIndex(this.values.list.length - 1);
                }
			},
			
			setIndex(i) {
				this.index = i;
				this.$nextTick(() => {
					let dots = this.$refs.sliders.querySelectorAll('div');
					$mx(dots[i]).trigger('click');
				});
			},
			
			prepareValues() {
				let values = this.$clone(this.values);
				
				values.list = _.map(values.list, (item) => {
					item.p = item.p?item.p.picture_id:null;
					return item;
				});
				
				let theme = this.$account.theme;
				if ((values.design.text == '#000000') && (values.design.bg == '#ffffff') && (values.design.button_text == '#0383de')) values.design = {on: false}
				
				return values;
			},
			
			startUploading() {
				this.picturesUpdating++;
				//this.$emit('update:allowSave', this.picturesUpdating == 0);
			},
			
			stopUploading() {
				this.picturesUpdating--;
				//this.$emit('update:allowSave', this.picturesUpdating == 0);
			},
			
			showErrors(r) {
				if (r.errors['slide:position'] != undefined) {
					this.$refs.sliders.childNodes[r.errors['slide:position']].click();
					setTimeout(() => {
						$mx(this.$refs.linkEditor.$el).find('.link-editor-place input, .link-editor-place select')[0].focus();
					}, 100);
					
				}
			}
		}, template: `<section class="modal-card-body modal-card-body-blocks"> <section v-if="info.is_readonly && (currentTab == 'common')" class="message is-warning"> <div class="message-body">{{'Здесь вы можете загрузить изображения или галерею картинок, добавить к ним описание и ссылки'|gettext}}</div> </section> <section v-if="currentTab == 'common'" @click="$parent.scrollToTariff"> <div class="field"> <div class='device-pictures-form device-pictures-form-pictures'> <center> <div class="device has-shadow is-large is-hide-mobile" :class="{disabled: info.is_readonly}" style="margin:0 auto;min-height:auto"> <div class="notch"></div> <div class="screen page-font"> <div ref='device' class="slider slider-pictures has-pb-2" :class="{'slider-has-text': values.options.text, 'slider-has-link': values.options.link, 'slider-has-border': !values.remove_border}"> <div class="slider-inner"> <div class="slider-slide" v-for="(f, i) in values.list"> <vue-component-pictures v-model="f.p" :button-title="'Загрузить картинку'|gettext" button-icon="fa fal fa-cloud-upload" class="picture-container picture-container-upload" :style="pictureSizeStyle" @delete="onDeletePicture(i, $event)" always-delete-button updatable :disabled="info.is_readonly" @startUploading="startUploading" @stopUploading="stopUploading"></vue-component-pictures> <div class="slider-slide-text" :style="stylesheetText"> <div class="slider-slide-title" v-if="f.t">{{f.t}}</div> <div class="slider-slide-title" v-else>{{'Заголовок'|gettext}}</div> <div class="slider-slide-snippet">{{f.s}}</div> </div> <a class="slider-slide-link" :style="stylesheetLink" v-if="f.link.title">{{f.link.title}}</a> <a class="slider-slide-link" :style="stylesheetLink" v-else>{{'Открыть'|gettext}}</a> </div> </div> <div class="slider-nav" :class="{'is-hidden': values.list.length == 1}" ref='sliders'> <div v-for="(v, i) in values.list" class="slider-dot" :class="{active: index== i}" @click="index = i"></div> </div> </div> </div> </div> </center> <div class='form-shadow form-shadow-bottom is-hidden-mobile' style="height: 20px"></div> </div> <div class="has-pt-2 row row-small" ref='toolbar'> <div class="col-xs-6 col-sm-5 col-sm-offset-1"> <button type="button" class="button is-success is-fullwidth" :disabled="info.is_readonly || resortMode" @click="addSlide"><i class='fas fa-plus has-mr-1'></i>{{'Новый слайд'|gettext}}</button> </div> <div class="col-xs-6 col-sm-5"> <button type="button" :class="['button is-dark is-fullwidth', {'is-active': resortMode}]" @click="switchReorderMode" :disabled="info.is_readonly || values.list.length < 2">{{'Порядок слайдов'|gettext}}</button> </div> </div> </div> </section> <section v-if="currentTab == 'common'" @click="$parent.scrollToTariff"> <div v-if="resortMode"> <sortable-list v-model="values.list" class="pictures-sortable-list pictures-form-resort" axis="xy" use-drag-handle v-if="resortMode"> <sortable-item v-for="(v, i) in values.list" class="upload-picture upload-picture-multiple" :index="i" :key="i" :item="v"> <div v-sortable-handle :class="['picture-container pictures-form-resort-item', {'picture-container-empty': !v.p}]" :style="{'background-image':prepareResortStyle(v.p)}"></div> </sortable-item> </sortable-list> </div> <div v-else> <mx-toggle v-model="values.options.text" :title="'Добавить описание'|gettext" :disabled="info.is_readonly"></mx-toggle> <div style="padding-top: 15px" v-if="values.options.text"> <div class="has-mb-2"> <label class="label">{{'Заголовок'|gettext}}</label> <vue-component-emoji-picker v-model="values.list[index].t"> <input type="text" v-model="values.list[index].t" class="input" maxlength="50" :disabled="info.is_readonly"> </vue-component-emoji-picker> </div> <div> <label class="label">{{'Описание'|gettext}}</label> <vue-component-emoji-picker v-model="values.list[index].s"> <textarea class="input" v-model="values.list[index].s" rows="5" id='sliderTextSnippet' maxlength="400" :disabled="info.is_readonly"></textarea> </vue-component-emoji-picker> </div> </div> </div> </section> <section v-if="currentTab == 'common' && !resortMode" @click="$parent.scrollToTariff"> <mx-toggle v-model="values.options.link" :title="'Добавить ссылку'|gettext" :disabled="info.is_readonly"></mx-toggle> <div style="padding-top: 15px" v-if="values.options.link"> <div class="has-mb-2"> <label class="label">{{'Текст ссылки'|gettext}}</label> <input type='text' class='input' v-model="link.title" :disabled="info.is_readonly"> </div> <vue-component-link-editor :values.sync="link" :variants="variants" :info="info" ref="linkEditor"></vue-component-link-editor> </section> <section v-if="currentTab == 'common' && !resortMode" @click="$parent.scrollToTariff"> <div class="row"> <div class="col-sm-12"> <label class='label'>{{'Размер картинки'|gettext}}</label> <b-select v-model="values.picture_size" :disabled="info.is_readonly" expanded> <option v-for="(v, k) in variants.picture_size" :value="k">{{v}}</option> </b-select> </div> </div> </section> <section v-if="currentTab == 'common' && !resortMode" @click="$parent.scrollToTariff"> <div class="row"> <div class="col-sm-12"> <label class='label'>{{'Автоматическая смена слайдов'|gettext}}</label> <div class="row"> <div class="col-xs-6 col-sm-4"> <div class="field has-addons"> <div class="control is-expanded"><input type='number' v-model='values.carousel_interval' class='input' :disabled="info.is_readonly || !values.carousel_ride"></div> <div class="control"><span class="button is-static">{{'сек'|gettext}}</span></div> </div> </div> <div class="col-xs-6 col-sm-8"> <b-checkbox v-model='values.carousel_ride' :disabled="info.is_readonly">{{'Включить'|gettext}}</b-checkbox> </div> </div> </div> </div> </section> <section v-if="currentTab == 'options'" @click="$parent.scrollToTariff"> <div class="label-pro-container"> <div class="tag is-pro" v-if="$account.tariff != 'pro' && $account.tariff != 'business'" data-toggle="tooltip" data-placement="top" :data-original-title="'Эта возможность доступна<br>на pro тарифе'|gettext">pro</div> <div :class="{disabled: $account.tariff != 'pro' && $account.tariff != 'business'}"> <div class="has-mb-2"><mx-toggle v-model='values.design.on' :title="'Свои настройки дизайна'|gettext" :disabled="info.is_readonly"></mx-toggle></div> <div class="has-mb-4" v-if="values.design.on"> <div class="has-mb-2"> <vue-component-colorpicker v-model="values.design.bg" :disabled="info.is_readonly" :colors="[$account.theme.link.bg]" :label="'Цвет фона кнопки'|gettext"></vue-component-colorpicker> </div> <div class="has-mb-2"> <vue-component-colorpicker v-model="values.design.text" :disabled="info.is_readonly" :colors="[$account.theme.link.color]" :label="'Цвет текста'|gettext"></vue-component-colorpicker> </div> <div class="has-mb-2"> <vue-component-colorpicker v-model="values.design.button_text" :disabled="info.is_readonly" :colors="[$account.theme.link.color]" :label="'Цвет текста кнопки'|gettext"></vue-component-colorpicker> </div> </div> </div> </div> <div class="has-mb-2"><mx-toggle v-model='values.remove_border' :title="'Убрать бордюр'|gettext" :disabled="info.is_readonly"></mx-toggle></div> <div class="has-mb-2"><mx-toggle v-model='values.is_desktop_fullwidth' :title="'Отображать боковые слайды на ПК'|gettext" :disabled="info.is_readonly"></mx-toggle></div> <vue-pages-blocks-form-options :values.sync="options" :info="info"></vue-pages-blocks-form-options> </section> <keep-alive> <vue-pages-blocks-form-statistics :page_id="values.page_id" :block_id="block_id" :disabled="info.is_readonly" v-if="currentTab == 'statistics'" @click="$parent.scrollToTariff"></vue-pages-blocks-form-statistics> </keep-alive> <slot></slot> </section>`});

window.$app.defineComponent("pages", "vue-pages-blocks-socialnetworks", {props: ['values', 'options', 'parent', 'variants', 'info', 'block', 'block_id', 'block_type_id', 'tabs', 'currentTab'],
		mixins: [FormModel],
		
		data() {
			return {
				addons_values: null
			}
		},
		
		created() {
			this.block.title = this.$gettext('Социальные сети');

			let tabs = [{name: 'common', title: this.$gettext('Ссылки')},{name: 'options', title: this.$gettext('Настройки')}, {name: 'addons', title: this.$gettext('Модули')}];
			if (this.block_id && this.info.is_allow_statistics) tabs.push({name: 'statistics', title: this.$gettext('Статистика')});

			this.$emit('update:tabs', tabs);
		},
		
		computed: {
			titles() {
				return {'vk': this.$gettext('ВКонтакте'), 'fb': 'Facebook', 'youtube': 'Youtube', 'twitter': 'Twitter', 'pt': 'Pinterest', 'ig': 'Instagram', 'ok': this.$gettext('Одноклассники'), 'sn': 'Snapchat', 'bh': 'Behance', 'dr': 'Dribbble', 'in': 'LinkedIn', 'tc': 'Twitch', 'tk': 'TikTok'};
			}
		},
		
		methods: {
			prepareValues() {
				let values = this.$clone(this.values);
				values.addons_values = this.addons_values;

				return values;
			},
			
			getError(part, val) {
				return this.errors[part]?this.errors[part][val]:null;
			}
		}, template: `<section class="modal-card-body modal-card-body-blocks"> <section v-if="info.is_readonly && (currentTab == 'common')" class="message is-warning"> <div class="message-body">{{'Добавьте кнопки на другие социальные сети'|gettext}}</div> </section> <section v-if="currentTab == 'common'" @click="$parent.scrollToTariff"> <b-select v-model="values.socials_style" :disabled="info.is_readonly" expanded> <option v-for="(f, i) in variants.socials_style" :value="i">{{ f }}</option> </b-select> </section> <section v-if="currentTab == 'common'" @click="$parent.scrollToTariff"> <sortable-list class="form-fields-item-list" lockAxis="y" v-model="values.items" use-drag-handle> <sortable-item v-for="(item, index) in values.items" class="form-fields-item" :index="index" :key="index" :item="item" :disabled="info.is_readonly"> <div class="form-fields-item" :class="{in: item.a}"> <div class="form-fields-item-title" @click="item.a = !item.a"> <div v-sortable-handle class="form-fields-item-handle"></div> <span>{{titles[item.n]}}</span> <mx-toggle v-model="item.a" class="pull-right"></mx-toggle> </div> <div class="form-fields-item-options"> <div v-if="item.n == 'fb'"> <b-field :label="'Текст ссылки'|gettext"> <input v-model="item.t" class="input" :placeholder="'Например: Моя страница в Facebook'|gettext" :disabled="info.is_readonly"> </b-field> <b-field :label="'Ссылка Facebook'|gettext" :message="getError('fb', 'link')" :class="{'has-error': getError('fb', 'link')}"> <input v-model="item.v" class="input" :disabled="info.is_readonly"> </b-field> </div> <div v-if="item.n == 'youtube'"> <b-field :label="'Текст ссылки'|gettext"> <input v-model="item.t" class="input" :placeholder="'Например: Мой Youtube канал'|gettext" :disabled="info.is_readonly"> </b-field> <b-field :label="'Ссылка на Youtube канал'|gettext" :message="getError('youtube', 'link')" :class="{'has-error': getError('youtube', 'link')}"> <input v-model="item.v" class="input" :disabled="info.is_readonly"> </b-field> <b-checkbox v-model="item.join" :disabled="info.is_readonly">{{'Ссылка ведет на действие подписки'|gettext}}</b-checkbox> </div> <div v-if="item.n == 'vk'"> <b-field :label="'Текст ссылки'|gettext"> <input v-model="item.t" class="input" :placeholder="'Например: Моя страница в ВКонтакте'|gettext" :disabled="info.is_readonly"> </b-field> <b-field :label="'Профиль ВКонтакте'|gettext" :message="getError('vk', 'link')" :class="{'has-error': getError('vk', 'link')}"> <input v-model="item.v" class="input" :disabled="info.is_readonly"> </b-field> </div> <div v-if="item.n == 'ok'"> <b-field :label="'Текст ссылки'|gettext"> <input v-model="item.t" class="input" :placeholder="'Например: Моя страница в Одноклассниках'|gettext" :disabled="info.is_readonly"> </b-field> <b-field :label="'Ссылка в Одноклассники'|gettext" :message="getError('ok', 'link')" :class="{'has-error': getError('ok', 'link')}"> <input v-model="item.v" class="input" :disabled="info.is_readonly"> </b-field> </div> <div v-if="item.n == 'twitter'"> <b-field :label="'Текст ссылки'|gettext"> <input v-model="item.t" class="input" :placeholder="'Например: Моя страница в Twitter'|gettext" :disabled="info.is_readonly"> </b-field> <b-field :label="'Ссылка Twitter'|gettext" :message="getError('twitter', 'link')" :class="{'has-error': getError('twitter', 'link')}"> <input v-model="item.v" class="input" :disabled="info.is_readonly"> </b-field> </div> <div v-if="item.n == 'tc'"> <b-field :label="'Текст ссылки'|gettext"> <input v-model="item.t" class="input" :placeholder="'Например: Моя страница в Twitch'|gettext" :disabled="info.is_readonly"> </b-field> <b-field :label="'Ссылка Twitch'|gettext" :message="getError('tc', 'link')" :class="{'has-error': getError('tc', 'link')}"> <input v-model="item.v" class="input" :disabled="info.is_readonly"> </b-field> </div> <div v-if="item.n == 'ig'"> <b-field :label="'Текст ссылки'|gettext"> <input v-model="item.t" class="input" :placeholder="'Например: Мой Instagram'|gettext" :disabled="info.is_readonly"> </b-field> <b-field :label="'Профиль Instagram'|gettext" :message="getError('ig', 'link')" :class="{'has-error': getError('ig', 'link')}"> <input v-model="item.v" class="input" :disabled="info.is_readonly"> </b-field> </div> <div v-if="item.n == 'pt'"> <b-field :label="'Текст ссылки'|gettext"> <input v-model="item.t" class="input" :placeholder="'Например: Мой Pinterest'|gettext" :disabled="info.is_readonly"> </b-field> <b-field :label="'Профиль Pinterest'|gettext" :message="getError('pt', 'link')" :class="{'has-error': getError('pt', 'link')}"> <input v-model="item.v" class="input" :disabled="info.is_readonly"> </b-field> </div> <div v-if="item.n == 'in'"> <b-field :label="'Текст ссылки'|gettext"> <input v-model="item.t" class="input" :placeholder="'Например: Мой LinkedIn'|gettext" :disabled="info.is_readonly"> </b-field> <b-field :label="'Профиль LinkedIn'|gettext" :message="getError('in', 'link')" :class="{'has-error': getError('in', 'link')}"> <input v-model="item.v" class="input" :disabled="info.is_readonly"> </b-field> </div> <div v-if="item.n == 'sn'"> <b-field :label="'Текст ссылки'|gettext"> <input v-model="item.t" class="input" :placeholder="'Например: Мой Snapchat'|gettext" :disabled="info.is_readonly"> </b-field> <b-field :label="'Профиль Snapchat'|gettext" :message="getError('sn', 'link')" :class="{'has-error': getError('sn', 'link')}"> <input v-model="item.v" class="input" :disabled="info.is_readonly"> </b-field> </div> <div v-if="item.n == 'bh'"> <b-field :label="'Текст ссылки'|gettext"> <input v-model="item.t" class="input" :placeholder="'Например: Мой Behance'|gettext" :disabled="info.is_readonly"> </b-field> <b-field :label="'Профиль Behance'|gettext" :message="getError('bh', 'link')" :class="{'has-error': getError('bh', 'link')}"> <input v-model="item.v" class="input" :disabled="info.is_readonly"> </b-field> </div> <div v-if="item.n == 'dr'"> <b-field :label="'Текст ссылки'|gettext"> <input v-model="item.t" class="input" :placeholder="'Например: Мой Dribbble'|gettext" :disabled="info.is_readonly"> </b-field> <b-field :label="'Профиль Dribbble'|gettext" :message="getError('dr', 'link')" :class="{'has-error': getError('dr', 'link')}"> <input v-model="item.v" class="input" :disabled="info.is_readonly"> </b-field> </div> <div v-if="item.n == 'tk'"> <b-field :label="'Текст ссылки'|gettext"> <input v-model="item.t" class="input" :placeholder="'Например: Мой TikTok'|gettext" :disabled="info.is_readonly"> </b-field> <b-field :label="'Ссылка TikTok'|gettext" :message="getError('tk', 'link')" :class="{'has-error': getError('tk', 'link')}"> <input v-model="item.v" class="input" :disabled="info.is_readonly"> </b-field> </div> </div> </div> </sortable-item> </sortable-list> </section> <section v-if="currentTab == 'options'" @click="$parent.scrollToTariff"> <vue-pages-blocks-form-design :values.sync="values.design" :info="info"></vue-pages-blocks-form-design> <vue-pages-blocks-form-options :values.sync="options" :info="info"></vue-pages-blocks-form-options> </section> <keep-alive> <vue-pages-blocks-form-addons :block_id="block_id" :block_type_id="block_type_id" :addons_values.sync="addons_values" :disabled="info.is_readonly" :parent="parent" v-if="currentTab == 'addons'" @click="$parent.scrollToTariff"> <template slot="message">{{'Вы можете выбрать модули которые будут срабатывать для данной ссылки'|gettext}}</template> <template slot="empty">{{'Модули для данного блока еще не подключены'|gettext}}</template> </vue-pages-blocks-form-addons> </keep-alive> <keep-alive> <vue-pages-blocks-form-statistics :page_id="values.page_id" :block_id="block_id" v-if="currentTab == 'statistics'" @click="$parent.scrollToTariff"></vue-pages-blocks-form-statistics> </keep-alive> <slot></slot> </section>`});

window.$app.defineComponent("pages", "vue-pages-blocks-text", {props: ['values', 'options', 'info', 'variants', 'block', 'block_id', 'tabs', 'currentTab'],
		mixins: [FormModel],
		
		data() {
			return {
				text_sizes: {sm: '1.03', md: '1.26', lg: '1.48', h3: '1.71', h2: '2.2', h1: '3.5'},
				text_aligns: ['left', 'center', 'right', 'justify']
			}
		},
		
		computed: {
			style() {
				//((this.values.text_size[0] == 'h')?'font-weight:bold;':'')+
				//(lightOrDark(this.values.color) == 'light') &&
				let lineHeights = {h2: 1.25, h1: 1.15};
				return {'font-family': this.values.font?(globalFontsFallback[this.values.font]):null, padding: '.5rem 1rem', 'line-height': (lineHeights[this.values.text_size] == undefined)?1.4:lineHeights[this.values.text_size], 'text-align': this.values.text_align+" !important", 'font-size': this.text_sizes[this.values.text_size]+"rem !important", color: this.values.color, background: (this.values.color != this.$account.theme.bg.color1)?this.$account.theme.bg.color1:null};
				
			}
		},
		
		created() {
			this.block.title = this.$gettext('Текст');
			if (!this.values.color) this.values.color = this.$account.theme.screen.color;
			if (this.values.font == '') this.values.font = this.$account.theme.screen.font;
			
			this.$emit('update:tabs', [{name: 'common', title: this.$gettext('Текст')},{name: 'options', title: this.$gettext('Настройки')}]);
		},
		
		methods: {
			prepareValues() {
				let values = this.$clone(this.values);

				let theme = this.$account.theme;
				if (values.color == theme.screen.color) values.color = '';
				if (values.font == theme.screen.font) values.font = '';

				return values;
			}
		}, template: `<section class="modal-card-body modal-card-body-block-text modal-card-body-blocks"> <section v-if="currentTab == 'common'"> <div class="row row-small has-mb-2"> <div class="col-xs-8 col-sm has-xs-mb-2"> <b-field> <b-select v-model="values.text_size" :disabled="info.is_readonly" expanded> <optgroup :label="'Текст'|gettext"> <option value="sm">{{'Маленький текст'|gettext}}</option> <option value="md">{{'Средний текст'|gettext}}</option> <option value="lg">{{'Большой текст'|gettext}}</option> </optgroup> <optgroup :label="'Заголовок'|gettext"> <option value="h3">{{'Маленький заголовок'|gettext}}</option> <option value="h2">{{'Средний заголовок'|gettext}}</option> <option value="h1">{{'Большой заголовок'|gettext}}</option> </optgroup> </b-select> </b-field> </div> <div class="col-xs col-sm-shrink"> <vue-component-font-chooser v-model="values.font" :fullwidth="true"></vue-component-font-chooser> </div> <div class="col-xs col-sm-shrink"> <b-field> <b-radio-button v-model="values.text_align" v-for="v in text_aligns" type="is-dark" class="is-expanded" :native-value="v" :disabled="info.is_readonly"><i :class="'fa fa-align-{1}'|format(v)"></b-radio-button> </b-field> </div> <div class="col-xs col-shrink"> <vue-component-colorpicker v-model="values.color" :disabled="info.is_readonly" :colors="[$account.theme.screen.color]"></vue-component-colorpicker> </div> </div> <vue-component-emoji-picker v-model="values.text"> <textarea class="input" :placeholder="'Текст'|gettext" :style="style" v-emoji v-model="values.text" :disabled="info.is_readonly"></textarea> </vue-component-emoji-picker> </section> <section v-if="currentTab == 'options'"> <vue-pages-blocks-form-options :values.sync="options" :info="info"></vue-pages-blocks-form-options> </section> <slot></slot> </section>`});

window.$app.defineComponent("pages", "vue-pages-blocks-timer", {data() {
			return {
				weekdays: this.$getDaysNames(),
				months: this.$getMonthsNames(),
				first_day_week: this.$getFirstDayWeek()
			}
		},

		props: ['values', 'options', 'variants', 'info', 'block', 'block_id', 'tabs', 'currentTab'],
		mixins: [FormModel],
		
		computed: {
			date: {
				get() {
					return this.values.timer[1].date?(new Date(this.values.timer[1].date)):null;
				},
				
				set(v) {
					this.values.timer[1].date = v?date_format('Y-m-d',v):null;
				}
			},
			
			time: {
				get() {
					if (this.values.timer[1].time)
					{
						let dt = this.values.timer[1].time.split(':')
						return new Date(0, 0, 0, dt[0], dt[1]);
					}
					else
					{
						return null;
					}				
				},
				
				set(v) {
					this.values.timer[1].time = v?date_format('H:i', v):null
				}
			},
			
			timeEveryday: {
				get() {
					if (this.values.timer[3].time)
					{
						let dt = this.values.timer[3].time.split(':')
						return new Date(0, 0, 0, dt[0], dt[1]);
					}
					else
					{
						return null;
					}				
				},
				
				set(v) {
					this.values.timer[3].time = v?date_format('H:i', v):null
				}

			}
		},
		
		created() {
			this.block.title = this.$gettext('Таймер обратного отсчета');
			this.$emit('update:tabs', [{name: 'common', title: this.$gettext('Таймер')},{name: 'options', title: this.$gettext('Настройки')}]);
		},
		
		methods: {
			prepareValues() {
				return this.values;
			}
		}, template: `<section class="modal-card-body modal-card-body-blocks"> <section v-if="info.is_readonly && (currentTab == 'common')" class="message is-warning"> <div class="message-body">{{'Добавьте таймер обратного отсчета для временного ограничения — успеть поучаствовать в акции, записаться на курс и т.д.'|gettext}}</div> </section> <section v-if="currentTab == 'common'" @click="$parent.scrollToTariff"> <b-field :label="'Тип таймера'|gettext"> <b-select v-model="values.type" :disabled="info.is_readonly" expanded> <option v-for="(v, k) in variants.type" :value="k">{{v}}</option> </b-select> </b-field> <div v-if="values.type == 1"> <div class="message is-info" v-if="!info.is_readonly"> <div class="message-body">{{'Укажите дату и время окончания отсчета'|gettext}}</div> </div> <div class="row"> <div class="col-xs-8"> <b-field :label="'Дата'|gettext" :message="errors.tms_1" :class="{'has-error': errors.tms_1}"> <div class="has-feedback"> <b-datepicker v-model="date" icon="calendar-alt" :disabled="info.is_readonly" :day-names="weekdays" :month-names="months" :first-day-of-week="first_day_week"></b-datepicker> <a class="form-control-feedback has-text-grey-light" @click="date = null" :class="{disabled: info.is_readonly}"><i class="fal fa-times"></i></a> </div> </b-field> </div> <div class="col-xs-4"> <label class="label">{{'Время'|gettext}}:</label> <div class="has-feedback"> <b-clockpicker v-model="time" :disabled="info.is_readonly" hour-format="24"></b-clockpicker> <a class="form-control-feedback has-text-grey-light" @click="time = null" :class="{disabled: info.is_readonly}"><i class="fal fa-times"></i></a> </div> </div> </div> </div> <div v-if="values.type == 2"> <div class="message is-info"><div class="message-body">{{'Таймер будет запущен при первом посещении страницы клиентом. Укажите длительность таймера.'|gettext}}</div></div> <b-field :message="errors.tms_2" :class="{'has-error': errors.tms_2}"> <div class="row has-mb-3"> <div class="col-xs-4 col-sm-3"> <label class="label">{{'Дни'|gettext}}:</label> <input type='number' v-model='values.timer[2].days' class='input' placeholder="0" maxlength="3" :disabled="info.is_readonly" min="1" max="99"> </div> <div class="col-xs-4 col-sm-3"> <label class="label">{{'Часы'|gettext}}:</label> <input type='number' v-model='values.timer[2].hours' class='input' placeholder="00" maxlength="2" :disabled="info.is_readonly" min="1" max="24"> </div> <div class="col-xs-4 col-sm-3"> <label class="label">{{'Минуты'|gettext}}:</label> <input type='number' v-model='values.timer[2].minutes' class='input' placeholder="00" maxlength="2" :disabled="info.is_readonly" min="1" max="60"> </div> </div> </b-field> <b-field :label="'Через сколько дней сбрасывать таймер'|gettext" :message="errors.expires_2" :class="{'has-error': errors.expires_2}"> <div class="row"> <div class="col-xs-4 col-sm-3"> <input type='number' v-model='values.timer[2].expires' class='input' placeholder="0" maxlength="3" :disabled="info.is_readonly"> </div> </div> </b-field> </div> <div v-if="values.type == 3"> <div class="message is-info"><div class="message-body">{{'Таймер будет перезапускаться каждый день. Укажите время окончания таймера.'|gettext}}</div></div> <b-field :label="'Время'|gettext" :message="errors.tms_3" :class="{'has-error': errors.tms_3}"> <div class="row"> <div class="col-md-3 col-sm-4 col-xs-6"> <div class="has-feedback"> <b-clockpicker v-model="timeEveryday" :disabled="info.is_readonly" hour-format="24"></b-clockpicker> <a class="form-control-feedback has-text-grey-light" @click="timeEveryday = null" :class="{disabled: info.is_readonly}"><i class="fal fa-times"></i></a> </div> </div> </div> </b-field> </div> </section> <section v-if="currentTab == 'options'" @click="$parent.scrollToTariff"> <vue-pages-blocks-form-options :values.sync="options" :info="info"></vue-pages-blocks-form-options> </section> <slot></slot> </section>`});

window.$app.defineComponent("pages", "vue-pages-blocks-video", {props: ['values', 'options', 'info', 'variants', 'block', 'block_id', 'tabs', 'currentTab'],
		mixins: [FormModel],
		
		created() {
			this.block.title = this.$gettext('Видео');
			this.$emit('update:tabs', [{name: 'common', title: this.block.title},{name: 'options', title: this.$gettext('Настройки')}]);
		},
		
		computed: {
			provider() {
				return VideoHelper.getProviderName(this.values.url);
			}
		},
		
		methods: {
			prepareValues() {
				let values = this.$clone(this.values);
				if (values.poster) values.poster = values.poster.picture_id;
				return values;
			},
		}, template: `<section class="modal-card-body modal-card-body-blocks"> <section v-if="info.is_readonly && (currentTab == 'common')" class="message is-warning"> <div class="message-body">{{'Вставьте видео для быстрого просмотра прямо на вашу страницу, без перехода на другой сайт'|gettext}}</div> </section> <section v-if="currentTab == 'common'" @click="$parent.scrollToTariff"> <b-field :label="'Ссылка на видео'|gettext" :message="errors.url" :class="{'has-error': errors.url}"> <div class="control"> <input type="text" class="input" v-model="values.url" placeholder='http://' autocorrect="off" autocapitalize="none" :disabled="info.is_readonly"></input> <p class="help has-text-grey" v-if="!errors.url">{{'Поддерживается YouTube, Vimeo и видео формата mp4, m3u8 и webm'|gettext}}</p> </div> </b-field> <transition name="fade"> <vue-component-pictures v-model="values.poster" v-if="provider == 'file'" :button-title="'Загрузить обложку'|gettext" button-icon="fa fal fa-cloud-upload" updatable class="addon-opengraph-picture has-mb-2"></vue-component-pictures> </transition> <mx-toggle v-model="values.is_autoplay" :title="'Автовоспроизведение на компьютере'|gettext" class="has-mb-2" :disabled="info.is_readonly"></mx-toggle> <mx-toggle v-model="values.is_autohide" :title="'Скрыть элементы управления'|gettext" :disabled="info.is_readonly"></mx-toggle> </section> <section v-if="currentTab == 'options'" @click="$parent.scrollToTariff"> <vue-pages-blocks-form-options :values.sync="options" :info="info"></vue-pages-blocks-form-options> </section> <slot></slot> </section>`});

window.$app.defineComponent("pages", "vue-pages-choose-form", {data() {
			return {
				mainPage: null,
				isFetching: false,
				isMainpageChanging: false,
				values: {pages: []}
			}
		},
		
		props: ['is_readonly'],

		created() {
			this.fetchData(true);
		},

		methods: {
			onAction(v) {
				switch (v) {
					case 'change':
						this.mainPage = this.$account.page_id;
						this.isMainpageChanging = true;
						break;
				}
			},
			
			saveMainpage() {
				if (this.$account.page_id != this.mainPage) {
					this.$api.get('pages/changemainpage', {page_id: this.mainPage}, this).then((data) => {
						this.$account.page_id = this.mainPage;
						this.isFetching = false;
						this.isMainpageChanging = false;
					});
				} else {
					this.isMainpageChanging = false;
				}
			},
			
			fetchData(withLoading) {
				this.isFetching = withLoading;
				this.$api.get('pages/list').then((data) => {
					this.isFetching = false;
					this.values.pages = data.response.pages;
				});

			},
			
			openPage(page_id) {
				this.$router.replace({name: 'pages', params: {page_id:page_id}});
				this.$parent.close();
			},
			
			newPage() {
				this.$form('vue-pages-page-form', null, this);
				this.$parent.close();
			}
		}, template: `<div class="modal-card"> <header class="modal-card-head"> <p class="modal-card-title" v-if="isMainpageChanging">{{'Смена главной страницы'|gettext}}</p> <p class="modal-card-title" v-else>{{'Страницы'|gettext}}</p> <button class="modal-close is-large" @click="$parent.close()"></button> </header> <section class="modal-card-body modal-card-body-blocks"> <div class="modal-pages-list"> <div v-if="isMainpageChanging"> <label class="item radio" v-for="f in values.pages"> <input type="radio" v-model="mainPage" :value="f.page_id"> <span v-if="f.title">{{f.title}}</span><span v-else class="has-text-grey">{{'Без имени'|gettext}}</span> </label> </div> <div v-else> <a class="item" @click="newPage" v-if="!is_readonly"><i class="fa fal fa-plus"></i> {{'Создать новую страницу'|gettext}}</a> <div class="modal-pages-list-hr" v-if="values.pages.length"></div> <a class="item" @click="openPage(f.page_id)" v-for="f in values.pages"> <i class="fa fal fa-mobile-android"></i> <span v-if="f.title">{{f.title}}</span><span v-else class="has-text-grey">{{'Без имени'|gettext}}</span> <span class="tag is-rounded is-success is-pulled-right" v-if="$account.page_id == f.page_id">{{'Главная страница'|gettext}}</span> </a> </div> </div> </section> <footer class="modal-card-foot level"> <div class="level-left"> <vue-component-action-button @action="onAction" v-if="!isMainpageChanging && !is_readonly" :title="'Действие'|gettext"> <template slot="actions"> <b-dropdown-item value="change"><i class="fa fa-home"></i> {{'Сменить главную страницу'|gettext}}</b-dropdown-item> </template> </vue-component-action-button> </div> <div class="level-right" v-if="isMainpageChanging"> <button class="button is-dark" type="button" @click="isMainpageChanging = false" :disabled="isFetching">{{'Отмена'|gettext}}</button> <button class="button is-primary" type="button" @click="saveMainpage" :disabled="isFetching">{{'Сохранить'|gettext}}</button> </div> <div class="level-right" v-else> <button class="button is-dark" type="button" @click="$parent.close()">{{'Закрыть'|gettext}}</button> </div> </footer> <b-loading :is-full-page="false" :active.sync="isFetching"></b-loading> </div>`});

window.$app.defineComponent("pages", "vue-pages-nickname-changed-form", {data() {
			return {
				isFetching: false,
				isUpdating: false,
				values: {}
			}
		},
		
		created() {
			this.fetchData(true);
		},

		methods: {
			fetchData(withLoading) {
				this.isFetching = withLoading;
				this.$api.get('pages/nicknamechanged/get').then((data) => {
					this.isFetching = false;
					this.values = data.response.pages.nicknamechanged;
				});
			},
			
			updateData() {
				this.isUpdating = true;
				
				this.$api.post('pages/nicknamechanged/set', {}, this).then((data) => {
					if (data.result == 'success') {
						this.$auth.refresh(data.response, () => {
							this.$parent.close();
						});
					}
					this.isUpdating = false;
				}).catch((error) => {
					this.isUpdating = false;
				})

			}
		}, template: `<div class="modal-card"> <header class="modal-card-head"> <p class="modal-card-title">{{'Обновление ссылки'|gettext}}</p> <button class="modal-close is-large" @click="$parent.close()"></button> </header> <section class="modal-card-body"> <div class="message is-danger" v-if="values.is_busy"> <div class="message-body">{{'Вы не можете поменять ссылку, имя уже занято другим аккаунтом.'|gettext}}</div> </div> <div class="field"> {{'Ваш никнейм в Instagram изменился. Вам необходимо обновить ссылку в Instagram, после чего нажмите кнопку "Я обновил ссылку", чтобы зафиксировать изменения.'|gettext}} </div> <div class="field"> <label class="label">{{'Старая ссылка'|gettext}}</label> <input type="text" class="input" readonly="on" :value="values.old|sprintf('https://taplink.cc/%s')"> </div> <div class="field"> <label class="label">{{'Новая ссылка'|gettext}}</label> <div class="field has-addons"> <div class="control is-expanded"><input type="text" class="input" readonly="on" :value="values.new|sprintf('https://taplink.cc/%s')" id='pageLinkNew'></div> <div class="control"> <vue-component-clipboard :text="values.new|sprintf('https://taplink.cc/%s')" class="button is-default" :show-icon="false">{{'Скопировать'|gettext}}</vue-component-clipboard> </div> </div> </div> </section> <footer class="modal-card-foot"> <button class="button is-primary" :class="{'is-loading': isUpdating}" @click="updateData" :disabled="values.is_busy">{{'Я обновил ссылку'|gettext}}</button> <button class="button is-dark" type="button" @click="$parent.close()">{{'Пока не обновил'|gettext}}</button> </footer> <b-loading :is-full-page="false" :active.sync="isFetching"></b-loading> </div>`});

window.$app.defineComponent("pages", "vue-pages-page-form", {data() {
			return {
				activeTab: 'common',
				isFetching: false,
				isUpdating: false,
			}
		},
		
		props: {page_id: Number, values: {
			default: {}	
		}},
		
		mixins: [FormModel],

		created() {
			if (this.page_id) {
				this.fetchData(true);
			}
		},
		
		computed: {
			pageLink() {
				return this.$account.link+'/p/'+parseInt(this.page_id).toString(16)+'/';
			},
			pageSafeLink() {
				return this.$account.link_safe+'/p/'+parseInt(this.page_id).toString(16)+'/';
			}
		},

		methods: {
			fetchData(withLoading) {
				this.isFetching = withLoading;
				this.$api.get('pages/props/get', {page_id: this.page_id}).then((data) => {
					this.isFetching = false;
					this.values = data.response.pages.props.values;
				});
			},
			
			updateData() {
				this.isUpdating = true;
				this.$api.post('pages/props/set', this.values, this).then((data) => {
					if (data.result == 'success') {
						this.$parent.close();
						if (!this.page_id) {
							this.values.title = '';
							this.$router.replace({name:'pages', params: {page_id: data.response.values.page_id}});
						}
						this.values = {}
					}
					this.isUpdating = false;
				}).catch((error) => {
					this.isUpdating = false;
				})
			},
			
			deletePage() {
				this.$confirm(this.$gettext('Вы уверены что хотите удалить эту страницу? Вы не сможете её вернуть!'), 'is-danger').then(() => {
                    this.$api.get('pages/delete', {page_id: this.page_id}, this).then((data) => {
						if (data.result == 'success') {
							this.$parent.close();
							this.$router.replace({name:'pages', params: {page_id: this.$account.page_id}});
						}
					});
				});
			}
		}, template: `<div class="modal-card"> <header class="modal-card-head"> <p class="modal-card-title" v-if="page_id">{{'Страница'|gettext}}</p> <p class="modal-card-title" v-else>{{'Новая страница'|gettext}}</p> <button class="modal-close is-large" @click="$parent.close()"></button> </header> <ul class="nav nav-tabs" v-if="page_id"> <li :class="{active: activeTab== 'common'}"><a href="#" @click="activeTab = 'common'">{{'Ссылка'|gettext}}</a></li> <li :class="{active: activeTab== 'qr'}"><a href="#" @click="activeTab = 'qr'">{{'QR-код'|gettext}}</a></li> </ul> <section class="modal-card-body" v-show="activeTab == 'common'"> <b-field :label="'Название страницы'|gettext" :message="errors.title" :class="{'has-error': errors.title}"> <input type="text" class="input" v-model="values.title"> </b-field> <div class="field" v-if="values.page_id"> <label class="label">{{'Ссылка на страницу'|gettext}}</label> <div class="field has-addons"> <div class="control is-expanded"><input type='text' class='input' readonly='on' id='pageLink' :value="pageLink"></div> <div class="control"> <vue-component-clipboard :text="pageLink" class="button is-default" :show-icon="false">{{'Скопировать'|gettext}}</vue-component-clipboard> </div> </div> </div> </section> <section class="message is-info" v-if="activeTab == 'qr'"><div class="message-body">{{'Вы можете скачать и использовать ваш QR-код на визитках или флайерах'|gettext}}</div></section> <section class="modal-card-body" v-if="activeTab == 'qr'"> <vue-component-qrcode :value="pageSafeLink"></vue-component-qrcode> </section> <footer class="modal-card-foot level"> <div class="level-left"> <button v-if="values.page_id" class="button is-default has-text-danger" @click="deletePage"><i class="fa fa-trash-alt"></i><span class="is-hidden-mobile"> {{'Удалить'|gettext}}</span></button> </div> <div class="level-right"> <button class="button is-dark" type="button" @click="$parent.close()">{{'Закрыть'|gettext}}</button> <button class="button is-primary" :class="{'is-loading': isUpdating}" @click="updateData">{{'Сохранить'|gettext}}</button> </div> </footer> <b-loading :is-full-page="false" :active.sync="isFetching"></b-loading> </div>`});

window.$app.defineComponent("pages", "vue-pages-page", {data() {
			return {
				isFetching: false,
				data: {page: {is_readonly: true}, blocks: {}, blocks_order: []},
				variants: {text_sizes: {sm: '1.03', md: '1.26', lg: '1.48', h3: '1.71', h2: '2.2', h1: '3.5'}},
				tipsInited: false,
				tipsChoose: false,
				
				hasInstallBanner: false,
				hideInstallBanner: false,
				
				styles: {}
			}
		},
		
		props: ['page_id'],

		created() {
			this.fetchData(true);
			
			let s = document.location.search;
			let r = s.match(/[\?|\&]wizard/);
			if (r) {
				s = s.replace(/[\?|\&]wizard/, '');
				this.$form('vue-pages-wizard-form', {page_id: this.page_id}, this);
				this.$router.replace(document.location.pathname.substr(window.base_path.length-1) + s);
			}
		},
		
		watch: {
			page_id() {
				this.fetchData(true);
// 				this.themeChanged();
			}
		},
		
		mounted() {
			this.$io.on('events:page.blocks:refresh', this.eventRefreshBlocks);
			this.$io.on('events:page.blocks:resort', this.eventResortBlocks);
			this.$io.on('events:page.blocks:delete', this.eventDeleteBlock);
			this.$io.on('events:page.sections:update', this.eventSectionsUpdate);
			this.$io.on('events:account.username:changed', this.usernameChanged);

			//this.themeChanged();
		},
		
		computed: {
			tipsChoosePage() {
				return (!this.isFetching && (this.page_id != this.$account.page_id) && this.tipsChoose)?this.$gettext('Вы создали новую страницу, для навигации между вашими страницами нажмите тут'):'';
			},
			
			inited() {
				return (!this.isFetching && this.tipsInited);
			},
			
			linkDomain() {
				let a = this.$account;
				return (a.custom_domain_verified?((a.custom_domain_secured?'https':'http')+'://'+a.custom_domain):'https://taplink.cc');
			},
			
			linkPath() {
				return this.linkDomain+this.$account.link_path+this.data.page.link.path;
			},
			scrollContainer() {
				return window.matchMedia("(max-width: 767px)").matches?$mx('.main-block')[0]:(document.scrollingElement || document.documentElement);
			},
			sections() {
				let last_section_id = null;
				let sections = [];
				let section = {bg: null, bg_layer: null, blocks: []};
				
				for (i = 0; i < this.data.blocks_order.length; i++)  {
					let f = this.data.blocks[this.data.blocks_order[i]];
					
					if (f == undefined) continue;
					
					if (f.section_id != last_section_id) {
						if (section.blocks.length) sections.push(section);
						let bg = (this.data.sections[f.section_id] == undefined)?null:this.data.sections[f.section_id];
						section = {bg: bg?(buildStylesBackground({bg: bg}, 'html')):null, bg_layer: bg?(buildStylesBackground({bg: bg}, 'body')):null,blocks: []};
					}
					
					section.blocks.push({i: i, block_id: f.block_id});
					
					last_section_id = f.section_id;
				}
				
				if (section.blocks.length) sections.push(section);
				
				return sections;
			},

/*
			blocks() {
				let blocks = [];
				for (i = 0; i < this.data.blocks_order.length; i++)  blocks.push(this.data.blocks[this.data.blocks_order[i]]);
			}
*/
		},
		
		destroyed() {
			this.$io.off('events:page.blocks:refresh', this.eventRefreshBlocks);
			this.$io.off('events:page.blocks:resort', this.eventResortBlocks);
			this.$io.off('events:page.blocks:delete', this.deleteBlock);
			this.$io.off('events:page.sections.update', this.eventSectionsUpdate);
			this.$io.off('events:account.username:changed', this.usernameChanged);
		},

		methods: {
			bannerInnerStyle(o) {
				return o.p?('width:'+((o.is_scale && o.width)?o.width:o.p.width)+'px'):'';
			},

			usernameChanged(data) {
				this.$account.nickname_changed = true;
			},
			
			prepareData(data) {
				_.each(data.blocks, (f) => {
					switch (f.block_type_name) {
						case 'link':
							f.stylesheet = '';
							if (f.options.design.on) f.stylesheet += 'background: '+f.options.design.bg+';border-color: '+f.options.design.bg+';color: '+f.options.design.text;
							break;
						case 'banner':
							f.stylesheet_picture = 'padding-top: '+(f.options.p?(f.options.p.height / f.options.p.width * 100):50)+'%'+(f.options.p?(';background: url('+'//'+this.$account.storage_domain+'/p/'+f.options.p.filename+')  0 0 / 100%'):'');
							break;
						case 'pictures':
							let sizes = {
								100: 100,
								70: '70.6',
								50: 50,
								138: '141.4516'
							}
							_.each(f.options.list, (item) => {
								item.stylesheet_picture = ('padding-top: calc('+sizes[f.options.picture_size]+'%)')+(item.p?(';background-image: url('+item.p+')'):'');
								item.stylesheet_text = '';
								item.stylesheet_button = '';
									
								if (f.options.design.on && (f.options.design.text || f.options.design.bg)) item.stylesheet_text = 
									(f.options.design.text?('color:'+f.options.design.text+' !important;'):'') + 
									(f.options.design.bg?('background:'+f.options.design.bg+' !important;'):'');
	
								if (f.options.design.on && (f.options.design.text || f.options.design.bg)) item.stylesheet_button = 
									(f.options.design.button_text?('color:'+f.options.design.button_text+' !important;'):'') + 
									(f.options.design.bg?('background:'+f.options.design.bg+' !important;'):'');
									
									
								if (f.options.link && !item.link.title) item.link.title = this.$gettext('Открыть');
							});
							break;
						case 'socialnetworks':
							_.each(f.options.items, (v) => {
								v.classname = ((f.options.socials_style != 'default')?('btn-socials btn-socials-'+v.n):'') + ((['default', 'block'].indexOf(f.options.socials_style) != -1)?' btn-link-styled':'');
							});

							f.stylesheet = '';
							if (f.options.design.on) f.stylesheet += 'background: '+f.options.design.bg+' !important;border-color: '+f.options.design.bg+' !important;color: '+f.options.design.text+' !important';
							
/*
							if (f.options.socials_style == 'compact') {
								f.options.links = _.chunk(f.options.links, 4);
							} else {
								f.options.links = _.chunk(f.options.links, 1);
							}
*/
// 							f.options.links = [f.options.links];
							break;
						case 'messenger':
							_.each(f.options.items, (v) => {
								v.classname = 'btn-link-'+f.options.messenger_style+' '+((f.options.messenger_style != 'default')?('btn-socials btn-link-'+v.n):'') + ((['default', 'block'].indexOf(f.options.messenger_style) != -1)?' btn-link-styled':'');
							});

							f.stylesheet = '';
							if (f.options.design.on && f.options.messenger_style != 'icon') f.stylesheet += 'background: '+f.options.design.bg+' !important;border-color: '+f.options.design.bg+' !important;color: '+f.options.design.text+' !important';
							
/*
							let types = {compact: 4, circle: 4, icon: 4};
							f.options.links = _.chunk(f.options.links, (types[f.options.messenger_style] == undefined)?1:types[f.options.messenger_style]);
*/
							break;
						case 'map':
							_.each(f.options.markers, (v) => {
								if (!v.title) v.title = this.$gettext('Заголовок');
	
								v.stylesheet = '';
								if (f.options.design.on && (f.options.design.text || f.options.design.bg)) v.stylesheet = 
									(f.options.design.text?('color:'+f.options.design.text+' !important;'):'') + 
									(f.options.design.bg?('background:'+f.options.design.bg+' !important;border-color:'+f.options.design.bg+' !important;'):'');
								
							});
							break;
						case 'form':
							_.each(f.options.fields, (item) => {
								item.stylesheet = '';
								
								if (f.options.design.on && (f.options.design.text || f.options.design.bg)) item.stylesheet = 
									(f.options.design.text?('color:'+f.options.design.text+' !important;'):'') + 
									(f.options.design.bg?('background:'+f.options.design.bg+' !important;border-color:'+f.options.design.bg+' !important;'):'');
									
									
									switch (item.typename) {
										case 'paragraph':
											item.text = item.text.replace(/<a/g, '<span').replace(/<\/a>/g, '</span>');
											break;
										default:
											item.input_type = 'text';
// 											if (item.typename == 'phone') item.input_type = 'tel';
											if (item.typename == 'number') item.input_type = 'number';
											break;
									}
							});
							break;
						case 'collapse':
							f.options.texts = _.map(f.options.texts, this.$nl2br);
							break;
					}
					
					let is_visible = this.$auth.isAllowTariff(f.tariff);
					if (f.is_visible) f.is_visible = is_visible;
					
					StylesFactory.prepareStyles(f.block_id, f.block_type_name, f.options, this.styles);
					
					return f;
				});

				StylesFactory.updateCSSBlock(this.styles, this.$refs.styles);					
				
				return data;
			},
			
			eventSectionsUpdate(data) {
				if (data.page_id == this.page_id) {
					this.data.sections = Object.assign({}, this.data.sections, data.sections); //{} -- reactive official vue hack
				}
			},
			
			eventDeleteBlock(data) {
				if (data.page_id == this.page_id) {
					delete this.data.blocks[data.block_id]; 
					this.data.blocks_order.splice(this.data.blocks_order.indexOf(data.block_id), 1);
				}
			},
			
			eventRefreshBlocks(data) {
				if (data.page_id == this.page_id) {
					if (data.block_id != undefined) {
						this.$api.get('pages/blocks', {page_id: this.page_id, block_ids: [data.block_id]}).then((d) => {
							if (d.result == 'success') {
								let dt = this.prepareData(d.response.page);
								this.data.blocks = Object.assign({}, this.data.blocks, dt.blocks); //{} -- reactive official vue hack
							}
						});
					} else {
						this.fetchData();
					}
				}
			},
			
			eventResortBlocks(data) {
				if (data.page_id == this.page_id) {
					function array_diff(array1, array2) {
						return array1.filter(function(elm) {
							return array2.indexOf(elm) === -1;
						});
					}
					
					let blocks_del = array_diff(this.data.blocks_order, data.blocks_order);
					let blocks_add = array_diff(data.blocks_order, this.data.blocks_order);

					if (blocks_del.length) {
						_.each(blocks_del, (id) => { 
							delete this.data.blocks[id]; 
							this.data.blocks_order.splice(this.data.blocks_order.indexOf(id), 1);
						});
					}
					
					if (blocks_add.length) {
						this.$api.get('pages/blocks', {page_id: this.page_id, block_ids: blocks_add}).then((d) => {
							if (d.result == 'success') {
								let dt = this.prepareData(d.response.page);
								this.data.blocks = Object.assign({}, this.data.blocks, dt.blocks); //{} -- reactive official vue hack
								this.data.blocks_order = data.blocks_order;
							}
						});
					} else {
						// Если нет добавлений - обновляем сразу
						this.data.blocks_order = data.blocks_order;
					}
				}
				
				if (data.sections_changed != undefined) {
					_.each(data.sections_changed, (s, b) => {
						this.data.blocks[b].section_id = s;
					});
				}
			},

			fetchData(withLoading) {
				this.tipsChoose = this.tipsInited = false;
				this.isFetching = withLoading;
				this.$api.get('pages/get', {page_id: this.page_id}).then((data) => {
					this.styles = {};
					this.data = this.prepareData(data.response.page);
					this.isFetching = false;
					
					if ((this.$account.tips_bits & 2) == 0)
					{
						this.checkWelcomePartnerAccess();
						eventStack.push('google', 'startup');
						eventStack.push('metrika', 'startup');
						
						//$mx(document).trigger('startup');
					}
					
					if (((this.$account.tips_bits & 1) == 0) && this.$auth.isAllowTariff('business') && (this.page_id != this.$account.page_id)) //НАДО ТАК
					{
						this.tipsChoose = true;
						this.$account.tips_bits = this.$account.tips_bits | 1;
						//alert(this.$account.tips_bits);
					}
					
					if (m = document.location.hash.match('publish:?([a-z\_]+)?')) {
						this.installPage((m.length > 1)?m[1]:null);
						document.location.hash = '';
					}
				});
			},
			
			showStartupTips(cb) {
				window.initStartup({langNewblock: this.$gettext("Чтобы добавить новый блок,<br>нажмите сюда"), langSort: this.$gettext("Вы можете менять блоки местами,<br>для этого перетащите нужный вам блок"), langEditblock: this.$gettext("Чтобы отредактировать блок,<br>просто нажмите на него")/* , langLink: this.$gettext("Ваша главная ссылка, вставьте ее в Instagram") */}, cb);
			},
			/*
			updateData() {
				this.isUpdating = true;
				this.$api.post('__VALUE__', this.values, this).then((data) => {
					if (data.result == 'success') {
						this.$parent.close()
					}
					this.isUpdating = false;
				}).catch((error) => {
					this.isUpdating = false;
				})
			},
*/
			checkWelcomeWizard() {
				if ((this.$account.tips_bits & 2) == 0)
				{
/*
					if (window.i18n.locale != 'ru') {
						this.tipsInited = true;
						this.$form('vue-pages-wizard-form', {page_id: this.page_id}, this);
					} else {
*/
						this.$nextTick(() => { 
							this.showStartupTips(() => {
								this.$account.tips_bits = this.$account.tips_bits | 2;
							});
						});
// 					}
				}
			},
			
			checkWelcomePartnerAccess(cb) {
				if (this.$account.partner.with_message != undefined && this.$account.partner.with_message) {
					this.$form('vue-pages-partner-access-form', {}, this);
					
					//alert(this.$account.partner.welcome_message);
				} else {
					this.checkWelcomeWizard();
				}
			},
			
			openForm(block_id) {
				this.$form('vue-pages-blocks-form-modal', {block_id: block_id}, this);
			},
			
			newBlock() {
				this.$form('vue-pages-blocks-form-modal', {page_id: this.page_id}, this);
			},

			prepareText(text) {
				return text.trim()?text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;").replace(/\n/g, '<br>'):this.$gettext('Редактировать текст');
			},
			
			prepareTextStyle(options) {
				let lineHeights = {h2: 1.25, h1: 1.15};
				return {'font-family': options.font?(globalFontsFallback[options.font]):null, 'text-align': options.text_align, 'line-height': (lineHeights[options.text_size] == undefined)?1.4:lineHeights[options.text_size], 'font-size': this.variants.text_sizes[options.text_size]+'rem', color: options.color+'!important'};
			},
						
			addLinkPage(block_id, title) {
				this.$form('vue-pages-page-form', {values: {block_id: block_id, title: title}}, this);
			},
			
			installPage(target) {
				this.$form('vue-pages-publish-form', {is_readonly: this.data.page.is_readonly, target: target}, this);
/*
				if (!this.$account.nickname || (document.location.hostname == 'dev.taplink.ru')) {
				} else {
					this.$form('vue-pages-install-form', {is_readonly: this.data.page.is_readonly}, this);
				}
*/
//  				this.$form('vue-pages-welcome-form', {is_readonly: this.data.page.is_readonly}, this);
			},
			
			installPageBanner() {
				this.installPage();
				this.hideInstallBanner = true;
			},
						
			configurePage() {
				this.$form('vue-pages-page-form', {page_id: this.data.page.page_id}, this);
			},
			
			choosePage() {
				this.$form('vue-pages-choose-form', {is_readonly: this.data.page.is_readonly}, this);
			},
			
			changeNickname() {
				this.$form('vue-pages-nickname-changed-form', {}, this);
			},
			
			sortEnd(e) {
				if (e.oldIndex != e.newIndex) {
					let index_after = (e.oldIndex < e.newIndex)?e.newIndex:(e.newIndex?(e.newIndex-1):-1);
					let after = (index_after != -1)?this.data.blocks_order[index_after]:null;
					
					if (_.size(this.data.sections) > 0) {
						let id_last_section = this.data.blocks[this.data.blocks_order[e.oldIndex]].section_id;
						
						let id1_section = (this.data.blocks[after] != undefined)?this.data.blocks[after].section_id:null;
						let id2_section = (this.data.blocks[this.data.blocks_order[index_after+1]] != undefined)?this.data.blocks[this.data.blocks_order[index_after+1]].section_id:null;
						
						if ((id_last_section != id1_section) && (id_last_section != id2_section)) {
							if (id1_section && (id1_section == id2_section)) {
								this.data.blocks[this.data.blocks_order[e.oldIndex]].section_id = id1_section;
							} else {
								//Если в секции один блок - не удаляем
								let tmp = this.data.blocks[this.data.blocks_order[e.oldIndex]].section_id;
								let tmp_amount = 0;
								_.each(this.data.blocks, (b) => { tmp_amount += (tmp == b.section_id)?1:0; }); 
								
								// Если это не последний блок в секции - удаляем
								if (tmp_amount > 1) this.data.blocks[this.data.blocks_order[e.oldIndex]].section_id = null;
							}
						}
					}
					
					this.$api.get('pages/resort', {page_id: this.page_id, id: this.data.blocks_order[e.oldIndex], after:after}, null, 'resort').then((data) => {
						if (data.result == 'fail') this.fetchData(true);
					});
				}
			},
						
			showInstallBanner() {
				this.hasInstallBanner = true;
				this.hideInstallBanner = true;
				setTimeout(() => { this.hideInstallBanner = false; }, 1500);
			}
		}, template: `<div style="flex: 1;display: flex;flex-direction: column"> <div ref='styles'></div> <div class="footer-banner has-background-dark" v-if="hasInstallBanner" :class="{'is-closed': hideInstallBanner}"> <div class="container has-mb-2 has-mt-2"> <div>⚠️ {{'Необходимо установить ссылку в профиль Instagram'|gettext}}</div> <button class="button is-black has-ml-1" @click="installPageBanner">{{'Сделать это'|gettext}}</button> </div> </div> <div class="top-panel hero-block hero-link"> <div class="container"> <div class="row"> <div class="col-xs-12"> <div class="form-control-link is-size-5"> <div class="form-control-link-text has-text-danger" v-if="$account.ban"><i class="fa fa-exclamation-circle has-mr-1"></i>{{'Ваш аккаунт заблокирован'|gettext}}</div> <div class="form-control-link-text" v-else> <a style="margin-right: 5px" v-if="$account.nickname_changed" @click="changeNickname" :data-tips-title="'Никнейм вашего Instagram профиля изменился, нажмите тут чтобы обновить ссылку'|gettext" data-tips-placement='bottom'><i class="fas fa-exclamation-circle has-text-danger"></i></a> <span v-if="$account.nickname || $account.custom_domain_verified"> <span class='is-hidden-mobile'>{{'Моя ссылка'|gettext}}: </span><a :href="linkPath" target="_blank" v-if="!isFetching"><span :class="{'is-hidden-mobile':!$account.custom_domain || data.page.link.path}">{{linkDomain}}</span>{{$account.link_path}}{{data.page.link.path}}</a> </span> <span v-else> <span class="is-hidden-mobile">{{'Для получения ссылки нажмите кнопку "Установить"'|gettext}}</span> <span class="is-hidden-tablet">{{'Получить ссылку'|gettext}}</span> <i class="fa fa-long-arrow-right has-ml-1"></i> </span> </div> <router-link v-if="$account.tariff == 'business' && ($account.page_id != page_id) && (page_id != 0)" :to="{name: 'pages', params: {page_id: $account.page_id}}" class="button is-light link-pages"><i class="fa fa-undo has-text-grey-light"></i><span class="is-hidden-mobile"> {{'На главную'|gettext}}</span></router-link> <button v-if="$auth.isAllowTariff('business') && !tipsChoose" class="button is-success link-pages" @click="choosePage"><i class="fas fa-caret-down"></i></button> <a v-if="$auth.isAllowTariff('business') && tipsChoose" class="button is-success link-pages" @click="choosePage" :data-tips-title="tipsChoosePage" data-tips-bit='1' data-tips-placement='bottom'><i class="fas fa-caret-down"></i></a> <a v-if="$account.page_id == page_id" class="button is-primary" @click="installPage()" style="min-width:100px" :disabled="$account.ban">{{'Установить'|gettext}}</a> <a v-else class="button is-primary" :class="{disabled: data.page.is_readonly}" @click="configurePage"><i class="fa fa-cog is-visible-mobile"></i><span class="is-hidden-mobile">{{'Настройки'|gettext}}</span></a> </div> </div> </div> </div> </div> <div class='main-block1 main-block-xs-clear' style="display: flex;flex-direction: column;flex:1"> <div class="device is-large has-padding-top has-padding-bottom has-shadow is-hide-mobile page-blocks has-mt-5 has-mb-5 is-xs-marginless" style="display: flex"> <div class="screen page" :class="'is-{1}'|format($account.theme.bg.brightness)"> <div class="theme-main"> <div v-html="$account.theme.html"></div> <sortable-list class="blocks-list" style="flex-grow:1" lockAxis="y" v-model="data.blocks_order" use-drag-handle helperClass="page-blocks" @sortEnd="sortEnd" :useWindowAsScrollContainer="true" :scrollContainer="scrollContainer" :contentWindow="scrollContainer"> <div v-for="section in sections" :style="section.bg"> <div :style="section.bg_layer" class="has-pb-2 has-pt-2"> <sortable-item v-for="b in section.blocks" :class="['b-'+b.block_id, 'container block-item has-pb-1 has-pt-1', {'is-readonly': data.page.is_readonly}]" :index="b.i" :key="b.i" :item="data.blocks[b.block_id]"> <div v-if="data.blocks[b.block_id].block_type_name == 'text'" class="block-text" :style="{opacity: data.blocks[b.block_id].is_visible?1:0.4}"> <div v-sortable-handle class="block-handle" v-show="!data.page.is_readonly"></div> <a @click="openForm(b.block_id)" v-html="prepareText(data.blocks[b.block_id].options.text)" :style="prepareTextStyle(data.blocks[b.block_id].options)"></a> </div> <div v-if="data.blocks[b.block_id].block_type_name == 'avatar'" class="block-avatar" :style="{opacity: data.blocks[b.block_id].is_visible?1:0.4}"> <div> <div v-sortable-handle class="block-handle" v-show="!data.page.is_readonly"></div> <a @click="openForm(b.block_id)"> <div class="has-text-centered"><img :src="$account.avatar.url" :class="data.blocks[b.block_id].avatar.size|sprintf('profile-avatar profile-avatar-%s')"></div> <div class="has-text-centered text-avatar" v-if="!data.blocks[b.block_id].avatar.is_hide_text && $account.nickname">@{{$account.nickname}}</div> </a> </div> </div> <div v-if="data.blocks[b.block_id].block_type_name == 'html'" class="block-html" :style="{opacity: data.blocks[b.block_id].is_visible?1:0.4}"> <div> <div v-sortable-handle class="block-handle" v-show="!data.page.is_readonly"></div> <a @click="openForm(b.block_id)"> <vue-component-blocks-html v-model="data.blocks[b.block_id].options.html"></vue-component-blocks-html> </a> </div> </div> <div v-if="data.blocks[b.block_id].block_type_name == 'link'" :class="data.blocks[b.block_id].options.link_type|sprintf('block-link block-link-%s')" :style="{opacity: data.blocks[b.block_id].is_visible?1:0.4}"> <div> <div v-sortable-handle class="block-handle" v-show="!data.page.is_readonly"></div> <router-link v-if="data.blocks[b.block_id].options.link_type == 'page' && data.blocks[b.block_id].options.link_page_id" class="block-handle-link" :to="{name: 'pages', params: {page_id: data.blocks[b.block_id].options.link_page_id}}"></router-link> <a v-if="data.blocks[b.block_id].options.link_type == 'page' && !data.blocks[b.block_id].options.link_page_id" class="block-handle-link block-handle-link-plus" @click="addLinkPage(b.block_id, data.blocks[b.block_id].options.title)"></a> <a @click="openForm(b.block_id)" class="button btn-link btn-link-styled" :style="data.blocks[b.block_id].stylesheet">{{data.blocks[b.block_id].options.title}}<div v-if="data.blocks[b.block_id].options.subtitle" class="btn-link-subtitle">{{data.blocks[b.block_id].options.subtitle}}</div></a> </div> </div> <div v-if="data.blocks[b.block_id].block_type_name == 'timer'" class="block-timer" :style="{opacity: data.blocks[b.block_id].is_visible?1:0.4}"> <div> <div v-sortable-handle class="block-handle" v-show="!data.page.is_readonly"></div> <a @click="openForm(b.block_id)" style="overflow: hidden"> <center> <vue-component-blocks-flipclock v-model="data.blocks[b.block_id].options" :page_id="data.page.page_id"></vue-component-blocks-flipclock> </center> </a> </div> </div> <div v-if="data.blocks[b.block_id].block_type_name == 'break'" class='block-break' :style="{opacity: data.blocks[b.block_id].is_visible?1:0.4}"> <div> <div v-sortable-handle class="block-handle" v-show="!data.page.is_readonly"></div> <a @click="openForm(b.block_id)"> <div class='block-break-inner' :class="{'has-icon': data.blocks[b.block_id].options.icon, 'is-invisible': data.blocks[b.block_id].options.icon < 0, 'is-fullwidth': data.blocks[b.block_id].options.fullwidth, 'has-fading': data.blocks[b.block_id].options.fading}" :style="{'height': data.blocks[b.block_id].options.break_size + 'px'}"><span><i :class="['fa fai', 'fa-'+data.blocks[b.block_id].options.icon]" v-if="data.blocks[b.block_id].options.icon"></i></span></div> </a> </div> </div> <div v-if="data.blocks[b.block_id].block_type_name == 'video'" class="block-video" :style="{opacity: data.blocks[b.block_id].is_visible?1:0.4}"> <div> <div v-sortable-handle class="block-handle" v-show="!data.page.is_readonly"></div> <a @click="openForm(b.block_id)"> <vue-component-video :options="data.blocks[b.block_id].options" style="pointer-events: none"></vue-component-video> </a> </div> </div> <div v-if="data.blocks[b.block_id].block_type_name == 'collapse'" class="block-collapse" :style="{opacity: data.blocks[b.block_id].is_visible?1:0.4}"> <div> <div v-sortable-handle class="block-handle" v-show="!data.page.is_readonly"></div> <a @click="openForm(b.block_id)" class="btn-link-block"> <div class="collapse-list"> <div class="collapse-item" v-for="v in data.blocks[b.block_id].options.fields"> <div class="a"> <span class="collapse-icon"></span> <span class="collapse-title" v-if="v.title">{{v.title}}</span> <span class="collapse-title" v-else>{{'Заголовок'|gettext}}</span> </div> </div> </div> </a> </div> </div> <div v-if="data.blocks[b.block_id].block_type_name == 'pictures'" class="block-slider" :style="{opacity: data.blocks[b.block_id].is_visible?1:0.4}"> <div> <div v-sortable-handle class="block-handle" v-show="!data.page.is_readonly"></div> <a @click="openForm(b.block_id)"> <div class="block-slider-inner"> <div :class="{'slider-has-text': data.blocks[b.block_id].options.options.text, 'slider-has-link': data.blocks[b.block_id].options.options.link, 'slider-has-border': !data.blocks[b.block_id].options.remove_border}" class="slider slider-pictures"> <div class="slider-inner"> <div v-for="(item, i) in data.blocks[b.block_id].options.list" v-if="i < 2" class="slider-slide"><div class="picture-container" :class="{'picture-container-empty': !item.p}" :style="item.stylesheet_picture"><div></div></div> <div v-if="data.blocks[b.block_id].options.options.text" class="slider-slide-text" :style="item.stylesheet_text"><div class="slider-slide-title" v-if="item.t">{{item.t}}</div><div class="slider-slide-title" v-else>{{'Заголовок'|gettext}}</div><div class="slider-slide-snippet">{{item.s}}</div></div> <div v-if="data.blocks[b.block_id].options.options.link && item.link.title" class="slider-slide-link" :style="item.stylesheet_button">{{item.link.title}}</div> <div v-if="data.blocks[b.block_id].options.options.link && !item.link.title" class="slider-slide-link" :style="item.stylesheet_button">{{'Открыть'|gettext}}</div> </div> </div> <div class="slider-nav" v-if="data.blocks[b.block_id].options.list.length> 1"> <div v-for="(item, i) in data.blocks[b.block_id].options.list" class="slider-dot" :class="{'active': !i}"></div> </div> </div> </div> </a> </div> </div> <div v-if="data.blocks[b.block_id].block_type_name == 'form'" class="block-form" :style="{opacity: data.blocks[b.block_id].is_visible?1:0.4}"> <div> <div v-sortable-handle class="block-handle" v-show="!data.page.is_readonly"></div> <a @click="openForm(b.block_id)"> <div v-for="field in data.blocks[b.block_id].options.fields"> <div v-if="field.typename == 'button'" class="form-field"><div class="button btn-link" :style="field.stylesheet">{{field.title}}</div></div> <div v-else-if="field.typename == 'paragraph'" class="form-field" style="font-size:1.9em !important" v-html="field.text"></div> <div v-else class="form-field"> <div v-if="field.typename == 'checkbox'" class="checkbox-list"> <label class="checkbox"> <input type="checkbox" :checked="field.default"> {{field.title}}<sup class="required" v-if="field.required">*</sup> </label> <div class="form-field-desc" v-if="field.text">{{field.text}}</div> </div> <label v-else class="label">{{field.title}}<sup class="required" v-if="field.required">*</sup></label> <div v-if="(field.typename != 'checkbox') && field.text" class="form-field-desc">{{field.text}}</div> <input v-if="['name', 'text', 'email', 'number'].indexOf(field.typename) != -1" :type="field.input_type" value=''> <div v-if="field.typename == 'phone'"><input type="tel" value='' :data-country="$account.client.country"></div> <textarea v-if="field.typename == 'textarea'" rows="4"></textarea> <input v-if="['date', 'time'].indexOf(field.typename) != -1" :type="field.input_type"> <div class="select" v-if="field.typename == 'select' || field.typename == 'country'"><select> <option value="" v-if="field.nulltitle">{{field.nulltitle}}</option> <option v-for="variant in field.variants" :value="variant">{{variant}}</option> </select></div> <div class="radio-list" v-if="field.typename == 'radio'"> <label v-for="variant in field.variants" class="radio is-block"> <input type="radio" :value="variant"> {{variant}} </label> </div> </div> </div> </a> </div> </div> <div v-if="data.blocks[b.block_id].block_type_name == 'socialnetworks'" class="block-socialnetworks" :style="{opacity: data.blocks[b.block_id].is_visible?1:0.4}"> <div> <div v-sortable-handle class="block-handle block-handle-socials" v-show="!data.page.is_readonly"></div> <div class="socials"> <div class="row row-small"> <div :class="{'col-xs': (data.blocks[b.block_id].options.socials_style != 'default' && data.blocks[b.block_id].options.socials_style != 'block'), 'col-xs-12': (data.blocks[b.block_id].options.socials_style == 'default' || data.blocks[b.block_id].options.socials_style == 'block')}" v-for="l in data.blocks[b.block_id].options.items"> <a @click="openForm(b.block_id)" class="button btn-flat btn-link" :class="l.classname" :style="data.blocks[b.block_id].stylesheet"><i v-if="data.blocks[b.block_id].options.socials_style != 'default'" :class="l._icon|sprintf('fa fab fa-%s')"></i> <span v-if="data.blocks[b.block_id].options.socials_style != 'compact'">{{l.t}}</span></a> </div> </div> </div> </div> </div> <div v-if="data.blocks[b.block_id].block_type_name == 'messenger'" class="block-link" :style="{opacity: data.blocks[b.block_id].is_visible?1:0.4}"> <div> <div v-sortable-handle class="block-handle block-handle-socials" v-show="!data.page.is_readonly"></div> <div class="socials"> <div class="row row-small"> <div :class="{'col-xs': (data.blocks[b.block_id].options.messenger_style != 'default' && data.blocks[b.block_id].options.messenger_style != 'block'), 'col-xs-12': (data.blocks[b.block_id].options.messenger_style == 'default' || data.blocks[b.block_id].options.messenger_style == 'block')}" v-for="l in data.blocks[b.block_id].options.items"> <a @click="openForm(b.block_id)" class="button btn-link" :class="l.classname" :style="data.blocks[b.block_id].stylesheet"> <img :src="'/s/i/messengers/icons/{1}.svg'|format(l.n)" v-if="data.blocks[b.block_id].options.messenger_style == 'icon'"> <i :class="'fa fab fa-{1}'|format(l._icon)" v-else v-if="data.blocks[b.block_id].options.messenger_style != 'default' && data.blocks[b.block_id].options.messenger_style != 'icon'"></i> <span v-if="['default', 'block'].indexOf(data.blocks[b.block_id].options.messenger_style) != -1">{{l.t}}</span> </a> </div> </div> </div> </div> </div> <div v-if="data.blocks[b.block_id].block_type_name == 'map'" class="block-form" :style="{opacity: data.blocks[b.block_id].is_visible?1:0.4}"> <div> <div v-sortable-handle class="block-handle" v-show="!data.page.is_readonly"></div> <a @click="openForm(b.block_id)" class="btn-link-block"> <vue-component-blocks-map v-model="data.blocks[b.block_id].options"></vue-component-blocks-map> </a> <a v-if="data.blocks[b.block_id].options.show_buttons" v-for="m in data.blocks[b.block_id].options.markers" @click="openForm(b.block_id)" class="button btn-link btn-link-block btn-map btn-link-styled" :style="m.stylesheet"> <i class="fa fa-map-marker-alt"></i><span>{{ m.title }}</span> </a> </div> </div> <div v-if="data.blocks[b.block_id].block_type_name == 'banner'" class="block-banner" :style="{opacity: data.blocks[b.block_id].is_visible?1:0.4}"> <div> <div v-sortable-handle class="block-handle" v-show="!data.page.is_readonly"></div> <a @click="openForm(b.block_id)" class="btn-link-block"> <div class="block-banner-inner" :style="bannerInnerStyle(data.blocks[b.block_id].options)"><div class="picture-container" :class="{'picture-container-empty': !data.blocks[b.block_id].options.p}" :style="data.blocks[b.block_id].stylesheet_picture"></div></div> </a> </div> </div> </sortable-item> </div> </div> </sortable-list> <div v-if="!data.page.is_readonly" class="has-sm-pl-2 has-sm-pr-2 has-mt-2" :class="{'has-mt-8': data.blocks_order.length == 0}"> <a @click="newBlock" class="button btn-link btn-link-empty"><i class='fa fas fa-plus fa-lg is-visible-mobile'></i> {{'Добавить новый блок'|gettext}}</a> </div> </div> </div></div> </div> </div>`});

window.$app.defineComponent("pages", "vue-pages-partner-access-form", {data() {
			return {
				isUpdating: false,
				isAllow: true
			}
		},

		created() {
			
		},

		mixins: [FormModel],

		methods: {
			update() {
				if (this.isAllow && this.$account.partner.with_access) {
					this.$api.post('access/set', {account_id: this.$account.partner.account_id, part: 'main'}).then((data) => {
						this.close();
						this.isUpdating = false;
					}).catch(({ data }) => {
						this.isUpdating = false;
					})
				} else {
					this.close();
				}
			},
			
			close() {
				this.$parent.close();
				setTimeout(() => {
					this.$parent.$parent.checkWelcomeWizard();
				}, 300)
/*
				this.isUpdating = true;
				this.$api.post('__VALUE__', this.values, this).then((data) => {
					if (data.result == 'success') {
						this.$parent.close()
					}
					this.isUpdating = false;
				}).catch((error) => {
					this.isUpdating = false;
				})
*/
			}
		}, template: `<div class="modal-card"> <header class="modal-card-head"> <p class="modal-card-title">{{'Добро пожаловать'|gettext}}</p> <button class="modal-close is-large" @click="update"></button> </header> <section class="modal-card-body"> <h4 class="has-mb-2">{{$account.partner.welcome_message}}</h4> <mx-toggle v-model='isAllow' v-if="$account.partner.with_access" :title="'Предоставить полный доступ'|gettext"></mx-toggle> </section> <footer class="modal-card-foot"> <button class="button is-primary" :class="{'is-loading': isUpdating}" @click="update" v-if="$account.partner.with_access">{{'Сохранить'|gettext}}</button> <button class="button is-dark" type="button" @click="close()" v-else>{{'Закрыть'|gettext}}</button> </footer> </div>`});

window.$app.defineComponent("pages", "vue-pages-publish-form", {data() {
			return {
				isUnattaching: false,
				isFetching: false,
				isUpdating: false,
				isButtonLoading: '',
				current: null,
				profiles: {},
				widget: {},
				variants: {},
				is_installed: false,
				activeTab: 'instagram',
				prepare: null
			}
		},
		
		props: {is_readonly: Boolean, target: String},

		computed: {
			widgetCode() {
				return '<script src="//taplink.cc/'+(this.$account.nickname?this.$account.nickname:('id:'+this.$account.profile_id))+'/widget/" async></script>';
			},
			
			instagramLink() {
				return 'https://taplink.cc/'+this.$account.nickname;
			}
		},
		
		created() {
			if (this.$account.custom_domain/*  && !this.$account.custom_domain_verified */) this.activeTab = 'domain';
			if (['instagram_business', 'instagram_basic'].indexOf(this.target) != -1) {
				this.activeTab = 'instagram';
			}
			
			this.fetchData(true);
		},
		
		methods: {
			attachAnotherProfile() {
				$mx('<iframe src="https://www.instagram.com/accounts/logout/" width="0" height="0"></iframe>').on('load', function() {
					document.location = '/login/instagrambasic/?method=attach';
				}).appendTo('body');
			},
			
			toggleTab(v) {
				this.activeTab = (this.activeTab == v && (window.matchMedia("(max-width: 767px)").matches))?null:v;
			},
			
			check() {
				this.isUpdating = true;
				this.$api.get('pages/publish/check', {target: this.target}).then((data) => {
					this.$parent.close();
				});
			},
			
			confirmAttach() {
				this.target = 'instagram_basic_confirm';
				this.fetchData(true);
			},
			
			fetchData(withLoading) {
				this.isFetching = withLoading;
				this.$api.get('pages/publish/info', {target: this.target, prepare: this.prepare}).then((data) => {
					this.isFetching = false;
					this.widget = data.response.widget;
					this.profiles = data.response.profiles;
					this.variants = data.response.variants;
					this.is_installed = data.response.is_installed;
					
					switch (this.target) {
						case 'instagram_basic':
							this.prepare = data.response.prepare;
							break;
						case 'instagram_basic_confirm':
							this.prepare = null;
							break;
					}
					
					if (data.response.account) this.$auth.refresh(data.response.account);
					if (data.response.message) this.$alert(data.response.message, 'is-danger');
				});
			},
			
			choose(row) {
				this.isFetching = true;
				this.$api.get('pages/publish/set', {id: row.id, uniq: row.uniq}).then((data) => {
					this.isFetching = false;
					this.$auth.refresh(data.response, () => {
						this.$parent.$parent.installPage();
						this.$parent.close();
					});
				});
			},
			
			unattach() {
				this.$confirm(this.$gettext('Вы уверены что хотите отключить профиль от вашей страницы?'), 'is-danger').then(() => {
					this.isUnattaching = true;
					this.$api.get('pages/publish/unattach', {id: this.current}).then((data) => {
						this.$auth.refresh(data.response);
						this.isUnattaching = true;
					});
				});
			},
			
			onWidgetChanged: _.debounce(function() {
				if (!this.is_readonly) this.$api.get('pages/install/set', {widget: this.widget});
			}, 500)
		}, template: `<div class="modal-card"> <header class="modal-card-head"> <p class="modal-card-title">{{'Установка ссылки'|gettext}}</p> <button class="modal-close is-large" @click="$parent.close()"></button> </header> <section class="modal-card-body modal-card-body-blocks" style="display:flex"> <div class="publish-form-collapse"> <div class="is-title" @click="toggleTab('instagram')" :class="{in: activeTab== 'instagram'}"> <span><i class="fal fa-chevron-right has-mr-2"></i>Instagram</span> </div> <div> <div> <section v-if="$account.nickname"> <label class="label" v-if="is_installed">{{'Ваша ссылка'|gettext}}</label> <div class="media has-mb-2" v-else> <div class="media-left"><span class="tag is-warning">1</span></div> <div class="media-content"> <label class="label">{{'Скопируйте ссылку на страницу'|gettext}}</label> </div> </div> <div class="field has-addons is-marginless"> <div class="control is-expanded"><input type="text" class="input is-mouse-locked has-text-black" readonly="on" disabled="on" :value="instagramLink"></div> <div class="control is-hidden-mobile"> <vue-component-clipboard :text="instagramLink" class="button is-default" :show-icon="false"><i class="fal fa-copy has-mr-1"></i>{{'Скопировать ссылку'|gettext}}</vue-component-clipboard> </div> <div class="control is-hidden-mobile"> <button class="button has-text-danger" @click="unattach" :class="{'is-loading': isUnattaching}" data-toggle="tooltip" data-placement="top" :data-original-title="'Отключить профиль'|gettext"><i class="fal fa-trash-alt"></i></button> </div> </div> <div class="is-hidden-tablet has-mt-2"> <div class="row row-small"> <div class="col-xs-10"> <vue-component-clipboard :text="instagramLink" class="button is-default is-fullwidth" :show-icon="false"><i class="fal fa-copy has-mr-1"></i>{{'Скопировать ссылку'|gettext}}</vue-component-clipboard> </div> <div class="col-xs-2"> <button class="button has-text-danger is-fullwidth" @click="unattach" :class="{'is-loading': isUnattaching}"><i class="fal fa-trash-alt"></i></button> </div> </div> </div> </section> <section v-if="is_installed && $account.nickname"> <div class="field"> <span class='has-text-success'><i class="fa fas fa-check-square"></i> {{'Ссылка установлена в Instagram.'|gettext}}</span> {{'Если вы поменяли никнейм в Instagram, нажмите кнопку "Обновить информацию" для того чтобы получить новую ссылку.'|gettext}} </div> <a @click="check" class="button is-instagram btn-flat" :class="{disabled: is_readonly, 'is-loading': isUpdating}"><i class="fab fa-ig" style="margin-right: 10px"></i> {{'Обновить информацию'|gettext}}</a> </section> <section v-else> <div v-if="!$account.nickname"> <div v-if="target == 'instagram_business'"> <label class="label">{{'Выберите профиль'|gettext}}</label> <b-table :data="profiles" hoverable bordered class="table-header-hide" @click="choose" v-if="_.size(profiles)" disabled="isUpdating"> <template slot-scope="props"> <b-table-column field="name" style="vertical-align:middle"> <div class="media" style="align-items: center"> <img :src="props.row.picture" class="profile-avatar profile-avatar-48 media-left"> <div class="media-content"><b>{{props.row.name}}</b><div class="has-text-grey">@{{props.row.username}}</div></div> </div> </b-table-column> </template> </b-table> </div> <div v-else> <div v-if="prepare"> <div class="has-text-centered has-mb-3"> <img :src="prepare.picture" class="profile-avatar profile-avatar-65"> <h4>{{prepare.username}}</h4> </div> <div class="row row-small"> <div class="col-xs-12 col-sm-5 col-sm-offset-1"> <button @click="confirmAttach" class="button is-primary has-xs-mb-2 is-fullwidth">{{'Подключить этот профиль'|gettext}}</button> </div> <div class="col-xs-12 col-sm-5"> <button @click="attachAnotherProfile" class="button is-danger is-fullwidth">{{'Войти под другим профилем'|gettext}}</button> </div> </div> </div> <div v-else> <label class="label">{{'Подключить Instagram профиль'|gettext}}</label> <div class="has-mb-2"> {{'Для подключения Instagram профиля вам необходимо авторизоваться через Instagram'|gettext}} </div> <div class="has-mb-4"> <a class="button is-instagram" :class="{disabled: is_readonly, 'is-loading': isButtonLoading== 'instagram'}" @click="isButtonLoading = 'instagram'" href="/login/instagrambasic/?method=attach"><i class="fab fa-ig has-mr-2"></i>{{'Подключить через Instagram'|gettext}}</a> </div> </div> </div> </div> <div v-else> <div v-if="!is_installed"> <div class="media"> <div class="media-left"><span class="tag is-warning">2</span></div> <div class="media-content"> <label class="label has-mb-2">{{'Вставьте её в раздел "Веб-Сайт" в настройках профиля Instagram'|gettext}}</label> </div> </div> <div class='has-sm-mb-4 has-sm-pt-4 device-pictures-form marvel-device-install'> <center style="line-height:0"> <div class="device has-shadow is-large is-hide-mobile" style="margin: 0 auto"> <div class="screen page-font" style="overflow: hidden"> <img style="max-width:100%;margin:0 auto;display: block" :src="'/s/i/taplink-install.{1}.png'|format(window.i18n.locale)"> </div> </div> <div class='form-shadow form-shadow-bottom is-hidden-mobile' style="height: 20px"></div> </center> </div> <div><a href='https://www.instagram.com/accounts/edit/' target="_blank" style="display: block;padding-top: 10px;text-align: center">{{'Открыть настройки Instagram'|gettext}}</a></div> </div> </div> </section> <section class="message is-info" v-if="$account.nickname && !is_installed"> <div class="message-body"> <label class="label">{{'Если вы поменяли имя пользователя в Instagram'|gettext}}</label> <div>{{'Нажмите на ссылку'|gettext}} "<a @click="check" :class="{disabled: isUpdating}">{{'Обновить информацию'|gettext}}</a>" {{'для того чтобы обновить информацию из Instagram. Система увидит новое имя пользователя и предложит обновить ссылку.'|gettext}}</div> </div> </section> </div> </div> <div class="is-title" @click="toggleTab('domain')" :class="{in: activeTab== 'domain'}"> <span><i class="fal fa-chevron-right has-mr-2"></i>{{'Доменное имя'|gettext}}</span> </div> <div> <div> <section> <transition name="fade"> <div class="label-pro-container"> <div v-if="!$auth.isAllowTariff('business')" class="tag is-business" data-toggle="tooltip" data-placement="top" :data-original-title="'Эта возможность доступна на Business тарифе'|gettext">biz</div> <label class="label has-mb-2">{{'Вы можете подключить свой домен к странице'|gettext}}</label> <vue-component-domain-attach :disabled="is_readonly"></vue-component-domain-attach> </div> </transition> </section> </div> </div> <div class="is-title" @click="toggleTab('qr')" :class="{in: activeTab== 'qr'}"> <span><i class="fal fa-chevron-right has-mr-2"></i>{{'QR-код'|gettext}}</span> </div> <div> <div> <section class="message is-info"><div class="message-body">{{'Вы можете скачать и использовать ваш QR-код на визитках или флайерах'|gettext}}</div></section> <section> <transition name="fade"> <vue-component-qrcode :value="$account.link_safe"></vue-component-qrcode> </transition> </section> </div> </div> <div class="is-title" @click="toggleTab('widget')" :class="{in: activeTab== 'widget', 'is-last-tab': activeTab != null}"> <span><i class="fal fa-chevron-right has-mr-2"></i>{{'Виджет на сайт'|gettext}}</span> </div> <div> <div> <section> <label class='label'>{{'Скопируйте код и разместите его в HTML-разметке вашего сайта'|gettext}}</label> <div class="field has-addons"> <div class="control is-expanded"><input class="input" onfocus="this.select()" readonly="on" :value="widgetCode"></div> <div class="control"> <vue-component-clipboard :text="widgetCode" class="button is-default" :show-icon="false"><i class="fal fa-copy has-mr-1"></i>{{'Скопировать'|gettext}}</vue-component-clipboard> </div> </div> <div class="field has-mb-4"> <label class='label'>{{'Цвет кнопки'|gettext}}</label> <vue-component-colorpicker colors='#F7464A,#e600a3,#1fb6ff,#1EB363,#4f5a67' v-model="widget.color" @input="onWidgetChanged" position="is-bottom-right" :disabled="is_readonly"></vue-component-colorpicker> </div> <div class="row"> <div class="col-xs-12 col-sm-6"> <div class="field"> <label class='label'>{{'Расположение кнопки'|gettext}}</label> <label class="radio is-block has-mb-1" v-for="(v, k) in variants.widget_button_placement"><input type="radio" name='widget_button_placement' :value="k" v-model="widget.placement" @change="onWidgetChanged" :disabled="is_readonly"> {{v}}</label> </div> </div> <div class="col-xs-12 col-sm-6"> <div class="field"> <label class='label'>{{'Вид окна'|gettext}}</label> <label class="radio is-block has-mb-1" v-for="(v, k) in variants.widget_button_view"><input type="radio" name='widget_button_view' :value="k" v-model="widget.view" @change="onWidgetChanged" :disabled="is_readonly"> {{v}}</label> </div> </div> </div> </section> </div> </div> </div> </section> <footer class="modal-card-foot"> <button class="button is-dark" type="button" @click="$parent.close()">{{'Закрыть'|gettext}}</button> </footer> <b-loading :is-full-page="false" :active.sync="isFetching"></b-loading> </div>`});