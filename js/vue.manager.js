
window.$app.defineComponent("manager", "vue-manager-blog-form", {data() {
			return {
				currentTab: 'text',
				isUpdating: false,
				isFetching: false,
				values: {post_id: null, seo_title: '', filename: '', body: '', seo_description: '', is_draft: true, picture: null},
				html: '',
				editorToolbar: '#blogToolbar'
/*
					controls: [
						[{ 'header': [1, 2, 3, false] }],
						['bold', 'italic'],      
						[{ 'list': 'ordered'}, { 'list': 'bullet' }],
						[{ 'indent': '-1'}, { 'indent': '+1' }],
						[{ 'align': [] }],
						['link', 'image'],
						['clean']  
					]
*/
				}
		},

		created() {
			if (this.post_id) this.fetchData(true);
		},
		

		props: ['post_id'],
		mixins: [FormModel],
		
		computed: {
			link() {
				return '//taplink.ru/blog/'+this.values.filename+'.html';
			}
		},

		methods: {
			filenameFilter(e) {
				let charCode = (e.which) ? e.which : e.keyCode;
				var txt = String.fromCharCode(charCode);
				if(!txt.match(/[A-Za-z0-9\-_]/)) e.preventDefault();
			},
			
			filenameFilterAfter(e) {
				e.target.value = e.target.value.toLowerCase().replace(/[^a-z0-9\-_ ]/g, '').trim().replace(/ /g, '_');
			},
			
			setTab(t) {
				if (this.currentTab == t) return;
				
				switch(t) {
					case 'text':
						this.values.body = this.html;
						break;
					default:
						this.html = this.values.body;
						break;
				}

				this.currentTab = t;
			},
			
			fetchData(withLoading) {
				this.isFetching = withLoading;
				this.$api.get('manager/blog/get', {post_id: this.post_id}).then((data) => {
					this.isFetching = false;
					this.values = data.response.blog.post;
					this.html = this.values.body;
				});
			},
			
			updateData() {
				this.isUpdating = true;
				if (this.currentTab == 'html') this.values.body = this.html;
				this.$api.post('manager/blog/set', this.values, this).then((data) => {
					if (data.result == 'success') {
						this.$parent.close()
					}
					this.isUpdating = false;
				}).catch((error) => {
					this.isUpdating = false;
				})
			}
		}, template: `<div class="modal-card modal-card-large is-fullscreen"> <header class="modal-card-head"> <p class="modal-card-title"><input v-model="values.title" placeholder="Заголовок" class="title is-2" style="display: block;width: 100%;border: 0"></p> <button class="modal-close is-large" @click="$parent.close()"></button> </header> <ul class="nav nav-tabs has-text-left"> <li :class="{active: currentTab== 'text'}"><a @click="setTab('text')">Текст</a></li> <li :class="{active: currentTab== 'html'}"><a @click="setTab('html')">HTML</a></li> <li :class="{active: currentTab== 'common'}"><a @click="setTab('common')">Настройки</a></li> </ul> <div id="blogToolbar" style="background: #fff" v-show="currentTab == 'text'"> <div id="toolbar"> <select class="ql-header"><option value="1"></option><option value="2"></option><option value="3"></option><option selected="selected"></option></select> <span class="ql-formats"> <button class="ql-bold"></button> <button class="ql-italic"></button> </span> <span class="ql-formats"> <button class="ql-list" value="ordered"></button> <button class="ql-list" value="bullet"></button> </span> <span class="ql-formats"> <button class="ql-indent" value="-1"></button> <button class="ql-indent" value="+1"></button> </span> <span class="ql-formats"> <button class="ql-blockquote"></button> </span> <span class="ql-formats"> <button class="ql-align" value=""></button> <button class="ql-align" value="center"></button> <button class="ql-align" value="right"></button> <button class="ql-align" value="justify"></button> </span> <span class="ql-formats"> <button class="ql-link"></button> <button class="ql-image"></button> </span> <span class="ql-formats"> <button class="ql-clean"></button> </span> </div> </div> <section class="modal-card-body" v-show="currentTab == 'text'"> <vue-component-editor :editor-toolbar="editorToolbar" v-model="values.body" classname="hero-block blog-post" style="max-width: 800px;margin: 0 auto"></vue-component-editor> </section> <section class="modal-card-body" v-show="currentTab == 'html'"> <textarea v-model="html" class="input" style="height: 100%"></textarea> </section> <section class="modal-card-body" v-if="currentTab == 'common'"> <b-field label="Имя файла" :message="errors.filename" :class="{'has-error': errors.filename}"> <p class="control"> <b-field> <div class="control is-expanded"><input class="input" v-model="values.filename" @keypress="filenameFilter" @change="filenameFilterAfter" @keyup="filenameFilterAfter"></input></div> <div class="control"><a :href="link" target="_blank" class="button is-dark" :class="{disabled: !values.post_id}">Открыть</a></div> </b-field> </p> </b-field> <div class="row"> <div class="col-xs-12 col-md-6"> <label class="label">{{'Изображение'|gettext}}</label> <p class="has-text-grey-light">{{'Размер изображения'|gettext}}: 600x400 px</p> <vue-component-pictures v-model="values.picture" class="blog-picture" :button-title="'Загрузить картинку'|gettext" button-icon="fa fal fa-cloud-upload" updatable></vue-component-pictures> </div> <div class="col-xs-12 col-md-6"> <b-field label="SEO Title"> <b-input maxlength="4096" type="text" v-model="values.seo_title"></b-input> </b-field> <b-field label="SEO Description"> <b-input maxlength="4096" type="textarea" v-model="values.seo_description"></b-input> </b-field> </div> </div> </section> <footer class="modal-card-foot level"> <div class="level-left"> <mx-toggle v-model="values.is_draft" :title="'Черновик'|gettext"></mx-toggle> </div> <div class="level-right"> <button class="button is-dark" type="button" @click="$parent.close()">{{'Закрыть'|gettext}}</button> <button class="button is-primary" :class="{'is-loading': isUpdating}" @click="updateData">{{'Сохранить'|gettext}}</button> </div> </footer> <b-loading :is-full-page="false" :active.sync="isFetching"></b-loading> </div>`});

window.$app.defineComponent("manager", "vue-manager-blog-list", {data() {
			return {
				isFetching: false,
				filter: {query: ''},
				perPage: 20,
			}
		},

		mixins: [ListModel],

		created() {
			this.$io.on('events:manager.blog.list:refresh', this.refresh);
			this.fetchData(true);
		},
		
		destroyed() {
			this.$io.off('events:manager.blog.list:refresh', this.refresh);
		},		

		methods: {
			onFilter() {
				this.clearPages();
				this.fetchData(true);
			},
			
			refresh() {
				this.fetchData(false, true);
			},
			
			fetchData(withLoading, force) {
				if (force || !this.checkCache()) {
					this.isFetching = withLoading;
					this.$api.get('manager/blog/list', {next: this.next, count: this.perPage, filter: this.filter}).then((data) => {
						this.cachePage(data.response.blog);
						this.isFetching = false;
					}).catch((error) => {
	                    this.fields = []
	                    this.total = 0
	                    this.isFetching = false
	                    throw error
	                })
                }

			},
			
			onPageChange(page) {
                this.page = page
                this.fetchData()
            },
            
            clickRow(row) {
				this.$form('vue-manager-blog-form', {post_id: row.post_id}, this);
            },
		}, template: `<div> <vue-component-filterbox @filter="onFilter" v-model="filter" :disabled="isFetching" :with-buttons="true"> <template slot="buttons"> <a @click="$form('vue-manager-blog-form')" class="button is-primary is-fullwidth"><i class="fa fa-plus-circle"></i> Добавить пост</a> </template> </vue-component-filterbox> <div class="container"> <div class="has-mb-2"> <b-table paginated backend-pagination pagination-simple :data="fields" :loading="isFetching" :per-page="perPage" :total="total" @page-change="onPageChange" @click="clickRow" hoverable bordered> <template slot-scope="props"> <b-table-column field="post_id" label="" class="has-width-5" :class="{'has-text-grey-light': props.row.is_draft}">{{ props.row.post_id }}</b-table-column> <b-table-column field="title" label="Загаловок" :class="{'has-text-grey-light': props.row.is_draft}"> {{ props.row.title }} <div class="has-text-danger is-pulled-right" v-if="props.row.is_draft"><i class="fas fa-eye-slash has-ml-1"></i></div> </b-table-column> <b-table-column field="tms_created" label="Дата" numeric :class="{'has-text-grey-light': props.row.is_draft}"> {{ props.row.tms_created|date }} </b-table-column> </template> <template slot="empty"> <section class="has-mb-4 has-mt-4 content has-text-grey has-text-centered" v-if="!isFetching"> <p><b-icon icon="frown" size="is-large"></b-icon></p> <p>{{'Пока ничего нет'|gettext}}</p> </section> <section class="has-mb-4 has-mt-4 content has-text-grey has-text-centered" v-if="isFetching"> <p>{{'Загрузка данных'|gettext}}</p> </section> </template> </b-table> </div> </div> </div>`});

window.$app.defineComponent("manager", "vue-manager-currency", {data() {
			return {
				providers: {},
				currency: {},
				data: {}
			}
		},

		created() {
			this.fetchData();
		},

		methods: {
			 fetchData() {
				this.isFetching = true;
				this.$api.get('manager/currency/get').then((data) => {
					
					let d = data.response.currency;
					
					this.providers = d.providers;
					this.currency = d.currency;
					this.data = d.data;
					this.isFetching = false;
				}).catch((error) => {
                    this.locales = [];
                    throw error
                })
			},
			
			changeValue(v, i, j) {
				let o = v.target
				o.disabled = true;
				this.$api.get('manager/currency/set', {payment_provider_id: i, currency_id: j, value: o.checked}).then((data) => {
					o.disabled = false;
				})
			}
		}, template: `<div class="container has-mb-4 has-mt-4"> <div class="row row-small"> <div class="col-sm-2"> <table class="table" style="width: 100%"> <thead> <tr> <td>Провайдер</td> </tr> </thead> <tbody> <tr v-for="(p, i) in providers"> <td>{{p}}</td> </tr> </tbody> </table> </div> <div class="col-sm-10"> <div style="overflow: scroll"> <table class="table"> <thead> <tr> <td v-for="c in currency">{{c}}</td> </tr> </thead> <tbody> <tr v-for="(p, i) in providers"> <td v-for="(c, j) in currency"> <input type="checkbox" :checked="data[i] != undefined && data[i].indexOf(parseInt(j)) != -1" @change="changeValue(event, i, j)"> </td> </tr> </tbody> </table> </div> </div> </div> </div>`});

window.$app.defineComponent("manager", "vue-manager-guides-form", {data() {
			return {
				currentTab: 'text',
				isUpdating: false,
				isFetching: false,
				values: {filename: '', locales: {}},
				variants: {language_id: []},
				language_id:  null,
				html: '',
				editorToolbar: '#blogToolbar'
			}
		},

		created() {
			if (this.guide_id) this.fetchData(true);
		},

		props: ['guide_id'],
		mixins: [FormModel],
		
		computed: {
			hasLocale() {
				return this.values.locales[this.language_id] != undefined;
			},
			link() {
				return '//taplink.ru/blog/'+this.values.filename+'.html';
			}
		},
		
		watch: {
			language_id(id, old) {
				if (this.currentTab != 'text') {
					if (old) this.values.locales[old].body = this.html;
					this.html = (this.values.locales[id] != undefined)?this.values.locales[id].body:'';
				}
			}	
		},

		methods: {
			filenametFilter(e) {
				let charCode = (e.which) ? e.which : e.keyCode;
				var txt = String.fromCharCode(charCode);
				if(!txt.match(/[A-Za-z0-9\-_]/)) e.preventDefault();
			},
			
			activateLocale() {
				this.$set(this.values.locales, this.language_id, {body: '', video_link: null, title: '', is_draft: true, language_id: this.language_id});
				this.html = '';
				this.setTab('text');
			},
			
			filenametFilterAfter(e) {
				e.target.value = e.target.value.toLowerCase().replace(/[^a-z0-9\-_ ]/g, '').trim().replace(/ /g, '_');
			},
			
			setTab(t) {
				if (this.currentTab == t) return;
				
				switch(t) {
					case 'text':
						this.values.locales[this.language_id].body = this.html;
						break;
					default:
						this.html = this.values.locales[this.language_id].body;
						break;
				}

				this.currentTab = t;
			},
			
			fetchData(withLoading) {
				this.isFetching = withLoading;
				this.$api.get('manager/guides/get', {guide_id: this.guide_id}).then((data) => {
					this.isFetching = false;
					this.values = data.response.guides.values;
					this.language_id = _.keys(this.values.locales)[0];
					this.variants = data.response.guides.variants;
					this.html = this.values.locales[this.language_id].body;
				});

			},
			
			updateData() {
				this.isUpdating = true;
				
				if (this.currentTab == 'html') this.values.locales[this.language_id].body = this.html;
				
				this.$api.post('manager/guides/set', this.values, this).then((data) => {
					if (data.result == 'success') {
						this.$parent.close()
					}
					this.isUpdating = false;
				}).catch((error) => {
					this.isUpdating = false;
				})
			}
		}, template: `<div class="modal-card modal-card-large is-fullscreen"> <header class="modal-card-head"> <p class="modal-card-title">Инструкция</p> <button class="modal-close is-large" @click="$parent.close()"></button> </header> <ul class="nav nav-tabs has-text-left" v-show="hasLocale"> <li :class="{active: currentTab== 'text'}"><a @click="setTab('text')">Текст</a></li> <li :class="{active: currentTab== 'html'}"><a @click="setTab('html')">HTML</a></li> <li :class="{active: currentTab== 'common'}"><a @click="setTab('common')">Настройки</a></li> </ul> <div id="blogToolbar" style="background: #fff" v-show="currentTab == 'text' && hasLocale"> <div id="toolbar"> <select class="ql-header"><option value="1"></option><option value="2"></option><option value="3"></option><option selected="selected"></option></select> <span class="ql-formats"> <button class="ql-bold"></button> <button class="ql-italic"></button> </span> <span class="ql-formats"> <button class="ql-list" value="ordered"></button> <button class="ql-list" value="bullet"></button> </span> <span class="ql-formats"> <button class="ql-indent" value="-1"></button> <button class="ql-indent" value="+1"></button> </span> <span class="ql-formats"> <button class="ql-blockquote"></button> </span> <span class="ql-formats"> <button class="ql-align" value=""></button> <button class="ql-align" value="center"></button> <button class="ql-align" value="right"></button> <button class="ql-align" value="justify"></button> </span> <span class="ql-formats"> <button class="ql-link"></button> <button class="ql-image"></button> </span> <span class="ql-formats"> <button class="ql-clean"></button> </span> </div> </div> <section class="modal-card-body" v-show="!hasLocale"> <button class="button" @click="activateLocale">Добавить язык</button> </section> <section class="modal-card-body" v-show="currentTab == 'text' && hasLocale"> <vue-component-editor :editor-toolbar="editorToolbar" v-model="values.locales[language_id].body" classname="hero-block blog-post" style="max-width: 800px;margin: 0 auto" v-if="values.locales[language_id]"></vue-component-editor> </section> <section class="modal-card-body" v-show="currentTab == 'html' && hasLocale"> <textarea v-model="html" class="input" style="height: 100%"></textarea> </section> <section class="modal-card-body" v-if="currentTab == 'common' && hasLocale"> <b-field label="Имя файла" :message="errors.filename" :class="{'has-error': errors.filename}"> <p class="control"> <b-field> <div class="control is-expanded"><input class="input" v-model="values.filename" @keypress="filenametFilter" @change="filenametFilterAfter" @keyup="filenametFilterAfter"></input></div> </b-field> </p> </b-field> <b-field label="Заголовок"> <input class="input" v-model="values.locales[language_id].title"></input> </b-field> <b-field label="Видео"> <input class="input" v-model="values.locales[language_id].video_link"></input> </b-field> </section> <footer class="modal-card-foot level"> <div class="level-left"> <div class="level-item"> <div class="select"> <select class="input" v-model="language_id"> <option v-for="v in variants.language_id" :value="v.language_id">{{v.language_title}}</option> </select> </div> </div> <div class="level-item"> <mx-toggle v-model="values.locales[language_id].is_draft" :title="'Черновик'|gettext" v-if="hasLocale"></mx-toggle> </div> </div> <div class="level-right"> <div class="level-item"> <button class="button is-dark" type="button" @click="$parent.close()">{{'Закрыть'|gettext}}</button> <button class="button is-primary" :class="{'is-loading': isUpdating}" @click="updateData">{{'Сохранить'|gettext}}</button> </div> </div> </footer> <b-loading :is-full-page="false" :active.sync="isFetching"></b-loading> </div>`});

window.$app.defineComponent("manager", "vue-manager-guides-list", {data() {
			return {
				isFetching: false,
				filter: {query: ''},
				perPage: 20,
			}
		},

		mixins: [ListModel],

		created() {
			this.$io.on('events:manager.guides.list:refresh', this.refresh);
			this.fetchData(true);
		},
		
		destroyed() {
			this.$io.off('events:manager.guides.list:refresh', this.refresh);
		},		

		methods: {
			implode(list) {
				return _.map(list, (v) => {
					return '<div style="display:flex;align-items:center" '+(v.is_draft?'class="has-text-grey-light"':'')+'><span title="ru" class="iti-flag '+v.language_code+' has-mr-1" style="display: inline-block;"></span>'+v.title+'</div>'
				}).join('');
			},		
			onFilter() {
				this.clearPages();
				this.fetchData(true);
			},
			
			refresh(data) {
				if (data.guide_ids != undefined) {
					this.merge(this.fields, 'guide_id', data.guide_ids, (ids, merge) => {
						this.$api.get('manager/guides/list', {filter: {guide_ids: ids}}).then((data) => {
							this.fields = merge(data.response.guides.fields);
						});
					});
				} else {
					this.fetchData(false, true);
				}
			},
			
			fetchData(withLoading, force) {
				if (force || !this.checkCache()) {
					this.isFetching = withLoading;
					this.$api.get('manager/guides/list', {next: this.next, count: this.perPage, filter: this.filter}).then((data) => {
						this.cachePage(data.response.guides);
						this.isFetching = false;
					}).catch((error) => {
	                    this.fields = []
	                    this.total = 0
	                    this.isFetching = false
	                    throw error
	                })
                }

			},
			
			onPageChange(page) {
                this.page = page
                this.fetchData()
            },
            
            clickRow(row) {
				this.$form('vue-manager-guides-form', {guide_id: row.guide_id}, this);
            },
		}, template: `<div> <vue-component-filterbox @filter="onFilter" v-model="filter" :disabled="isFetching" :with-buttons="true"> <template slot="buttons"> <a @click="$form('vue-manager-guides-form')" class="button is-primary is-fullwidth"><i class="fa fa-plus-circle"></i> Добавить инструкцию</a> </template> </vue-component-filterbox> <div class="container"> <div class="has-mb-2"> <b-table paginated backend-pagination pagination-simple :data="fields" :loading="isFetching" :per-page="perPage" :total="total" @page-change="onPageChange" @click="clickRow" hoverable bordered> <template slot-scope="props"> <b-table-column field="title" label="Группа" class="has-width-20"> {{props.row.guide_group_title}} </b-table-column> <b-table-column field="title" label="Загаловок"> <div v-html="implode(props.row.titles)"></div> </b-table-column> </template> <template slot="empty"> <section class="has-mb-4 has-mt-4 content has-text-grey has-text-centered" v-if="!isFetching"> <p><b-icon icon="frown" size="is-large"></b-icon></p> <p>{{'Пока ничего нет'|gettext}}</p> </section> <section class="has-mb-4 has-mt-4 content has-text-grey has-text-centered" v-if="isFetching"> <p>{{'Загрузка данных'|gettext}}</p> </section> </template> </b-table> </div> </div> </div>`});

window.$app.defineComponent("manager", "vue-manager-locales-index", {props: ['current'],
		created() {
			if (this.current) return;
			
			this.$api.get('manager/locales/current').then((data) => {
				this.$router.replace({name: 'manager.locales', params: {'current': data.response.current}});
			});
		}, template: `<router-view></router-view>`});

window.$app.defineComponent("manager", "vue-manager-locales", {data: function() {
			return {
				search: '',
				locales: null,
				phrases: null,
				phrases_base: null,
				base: [],
				languages: [],
				currentNode: null,
				addons: null,
				payments: null,
				amount_need: 0, 
				isFetching: false,
				isUpdating: false,
				filter: '',
				filters: null,
				baseLanguage: false
			}
		},
		
		mixins: [FormModel],
		props: ['current'],
		
		watch: {
			current(v) {
				this.currentNode = null;
				this.fetchData();
			}
		},

		created: function () {
			this.fetchData();
		},
		
		computed: {
			currentNodePhrases() {
				if (this.search) {
					return _.filter(this.phrases, (o) => {
						if (this.baseLanguage && this.current != 'en' && this.base[o.k] != undefined) {
							return (this.base[o.k].toLowerCase().indexOf(this.search.toLowerCase()) != -1);
						} else {
							return (o.k.toLowerCase().indexOf(this.search.toLowerCase()) != -1);
						}
					})
/*
					return this.phrases_.filter(this.phrases, (o) => {
						return ((this.currentNode.messages[o.k] != undefined) && (o.k.toLowerCase().indexOf(this.search.toLowerCase()) != -1));
					})
*/
				} else {
					if (this.currentNode == null) return null;
					
					if (this.currentNode.messages == undefined) {
						return this.currentNode.phrases;
					} else {
						return _.filter(this.phrases, (o) => {
							return (this.currentNode.messages[o.k] != undefined);
						})
					}
				}
			},
			
			filteredNodes() {
				return this.locales;
			}
		},

		methods: {
			filterNodes(n) {
				return n;
			},
			onPageChange(page) {
                this.page = page
                this.fetchData()
            },
            
            onSort(field, order) {
                this.sortField = field;
                this.sortOrder = order;
                this.fetchData()
            },
            
            fetchData() {
				this.isFetching = true;
				this.$api.get('manager/locales/get', {language: this.current}).then((data) => {
					
					this.baseLanguage = data.response.locales.language_base;
					this.phrases = data.response.locales.phrases;
					this.phrases_base = data.response.locales.phrases_base;
					this.locales = data.response.locales.locales;
					this.languages = data.response.locales.languages;
					
					this.addons = data.response.locales.addons;
					this.payments = data.response.locales.payments;
					
					this.selectNode(this.locales.nodes[Object.keys(this.locales.nodes)[0]], this.phrases_base);
					
					this.isFetching = false;
				}).catch((error) => {
                    this.locales = [];
                    throw error
                })
			},
			
			selectNode(node, phrases_base) {
				if (node != null && node.messages != undefined) while (node.messages.length == 0) node = node.nodes[Object.keys(node.nodes)[0]];
				this.currentNode = node;
				this.base = phrases_base;
			},
			
			updateData() {
				this.isUpdating = true;
				
/*
				var phrases = []; 
				var ru = [];
				var __ = [];
				
				_.each(this.locales, (v) => {
					ru.push(v.ru);
					__.push(v.__);
				});
				
				phrases = {ru: ru, __: __};
*/

				this.$api.post('manager/locales/set', {phrases: this.phrases, language: this.current, addons: this.addons, payments: this.payments}, this).then((data) => {
					

/*
					var i = 0;
					_.each(this.locales, (v, k) => {
						this.locales[k].type = (v.__.length?'':'is-danger');
						i += v.__.length?0:1;
					});
					
					this.amount_need = i;
*/

					this.isUpdating = false;
				});
			},
			
			hits(o) {
				var n = 0;

				if (o.messages == undefined) {
					for (i in o.phrases) {
						n += (o.phrases[i].v == '')?1:0;
					}
				} else {
					for (i in o.messages) {
						n += (this.phrases[i].v == '')?1:0;
					}
				}
				
				return n;
			},
			
			getInputType(row) {
				return (row.v == '')?'is-danger':'';
			},
			
			changeLanguage() {
				this.$router.replace({name: 'manager.locales', params: {'current': this.current}});
			},
			
			changeFilter() {
				
			},
			
			openExportForm() {
				// {filter: _.clone(this.filter)}
				this.$form('vue-manager-locales-export-form', {current: this.current}, this);
			},
			
			openImportForm() {
				this.$form('vue-manager-locales-import-form', {phrases: this.phrases, languages: this.languages}, this);
			}
		}, template: `<div class="has-p-2 has-mb-2 has-mt-1"> <div class="container is-mb-4" v-if="amount_need"> <b-notification type="is-danger has-mb-2" :closable="false"> Messages without translate: {{ amount_need }} </b-notification> </div> <div class="row row-small"> <div class="col-sm-3"> <div class="media"> <div class="media-content"> <b-select v-model="current" expanded @input="changeLanguage"> <option :value="k" v-for="(v, k) in languages">{{v}}</option> </b-select> </div> <mx-toggle v-model="baseLanguage" trueValue="EN" falseValue="RU" class="is-pulled-right has-ml-2" :disabled="current == 'en'"></mx-toggle> </div> </div> <div class="col-xs"> <input type="text" v-model="search" class="input is-fullwidth" :placeholder="'Поиск'|gettext"> </div> <div class="col-sm-2"> <button class="button is-primary is-fullwidth" @click="updateData" :class="{'is-loading': isUpdating}" :disabled="isFetching">{{'Сохранить изменения'|gettext}}</button> </div> </div> <hr class="is-hidden-mobile"> <div class="row"> <div class="col-sm-3"> <aside class="menu-locales" style="padding-bottom: 2rem" v-if="locales" :class="{disabled: search}" :style="{opacity: search?'.1 !important':1}"> <ul class="menu-list"> <li v-for="(v, i) in this.filteredNodes.nodes"> <a class="is-block" @click="selectNode(v, phrases_base)" :class="{'is-active': currentNode== v}">{{i}} <span class="tag is-rounded is-danger" v-if="hits(v)">{{hits(v)}}</span></a> <ul v-if="v.nodes"> <li v-for="(w, j) in v.nodes"><a class="is-block" @click="selectNode(w, phrases_base)" :class="{'is-active': currentNode== w}">{{j}} <span class="tag is-rounded is-danger" v-if="hits(w)">{{hits(w)}}</span></a> <ul v-if="w.nodes"> <li v-for="(ww, jj) in w.nodes"><a class="is-block" @click="selectNode(ww, phrases_base)" :class="{'is-active': currentNode== ww}">{{jj}} <span class="tag is-rounded is-danger" v-if="hits(ww)">{{hits(ww)}}</span></a> </li> </ul> </li> </ul> </li> <li><a class="is-block" @click="selectNode(payments[0], payments[0].phrases_base)">Payments</a> <ul> <li v-for="p in payments"> <a class="is-block" @click="selectNode(p, p.phrases_base)" :class="{'is-active': currentNode== p}">{{p.title}} <span class="tag is-rounded is-danger" v-if="hits(p)">{{hits(p)}}</span></a></li> </ul> </li> <li><a class="is-block" @click="selectNode(addons[0], addons[0].phrases_base)">Addons</a> <ul> <li v-for="p in addons"><a class="is-block" @click="selectNode(p, p.phrases_base)" :class="{'is-active': currentNode== p}">{{p.title}} <span class="tag is-rounded is-danger" v-if="hits(p)">{{hits(p)}}</span></a></li> </ul> </li> </ul> </aside> </div> <div class="col-sm-9"> <div v-if="currentNode && currentNode.type == 'addon'"> <div class="field"> <label class="label">Title</label> <input type="text" class="input" v-model="currentNode.addon_title"> </div> <div class="field"> <label class="label">Snippet</label> <textarea type="text" class="input" v-model="currentNode.addon_snippet"></textarea> </div> <hr class="is-hidden-mobile"> </div> <b-table :data="currentNodePhrases" :loading="isFetching" bordered v-if="currentNode"> <template slot-scope="props"> <b-table-column field="k" width="200" label="Phrase"> <div class="control is-fullwidth"><input :value="(baseLanguage && current != 'en' && (base[props.row.k] != undefined))?base[props.row.k]:props.row.k" class="input" disabled></div> </b-table-column> <b-table-column field="v" width="200" label="Translate"> <b-field :type="getInputType(props.row)"><b-input v-model="props.row.v" class="is-fullwidth"></b-input></b-field> </b-table-column> </template> </b-table> </div> </div> <b-loading :is-full-page="false" :active.sync="isFetching"></b-loading> </div>`});

window.$app.defineComponent("manager", "vue-manager-locales-export-form", {data() {
			return {
				isUpdating: false,
				isRefreshing: false,
				isFetching: false,
				amount: 0,
				charset: 'utf-8',
				filter: '*',
				variants: {}
			}
		},
		
		props: ['current'],

		created() {
			this.fetchData(true);
		},
		
		computed: {
			downloadUrl() {
				return '/api/manager/locales/export/download.csv?filter='+this.filter+'&charset='+this.charset+'&current='+this.current;
			}	
		},

		mixins: [FormModel],

		methods: {
			fetchData(withLoading) {
				this.isRefreshing =  this.isFetching = withLoading;
				
				this.$api.get('manager/locales/export/info').then((data) => {
					this.isFetching = this.isRefreshing = false;
					this.variants = data.response.export.info.variants;
				});
			}
		}, template: `<div class="modal-card"> <header class="modal-card-head"> <p class="modal-card-title">{{'Экспорт фраз'|gettext}}</p> <button class="modal-close is-large" @click="$parent.close()"></button> </header> <section class="modal-card-body"> <b-field :label="'Фильтр'|gettext"> <b-select v-model="filter" expanded> <option value="*">Выгрузить все</option> <option :value="k" v-for="(v, k) in variants.filters">Исключая "{{k}}"</option> </b-select> </b-field> <b-field :label="'Кодировка'|gettext"> <b-select v-model="charset" expanded> <option v-for="(v, k) in variants.charset" :value="k">{{ v }}</option> </b-select> </b-field> </section> <footer class="modal-card-foot"> <a :href="downloadUrl" target="frame" class="button is-success is-pulled-right no-ajax" :class="{'is-loading': isRefreshing}"><span class="is-hidden-mobile">{{'Скачать CSV-файл'|gettext}}</span><span class="is-hidden-tablet">{{'Скачать'|gettext}}</span></a> <button class="button is-dark" type="button" @click="$parent.close()">{{'Закрыть'|gettext}}</button> </footer> <b-loading :is-full-page="false" :active.sync="isFetching"></b-loading> </div>`});

window.$app.defineComponent("manager", "vue-manager-locales-import-form", {data() {
			return {
				grid: null,
				data: null,
				isUpdating: false,
				isFetching: true,
				selects: [],
				columnSelect: null,
				values: {},
				is_done: false,
				amount_updated: 0,
				amount_notfound: 0,
				current_language: 'ru'
			}
		},
		
		props: ['phrases', 'languages'],

		mounted() {
			$mx.lazy('grid.js', 'grid.css', () => {
				var d = {cols: 2, rows: 5, name: 'data', clearPaste: 'yes', autofocus: 'yes'}

				let o = $mx(this.$refs.grid);
			
				var input = null;
				var columns = [];
				var data = [];
				

				if (this.data && (this.data.cells != undefined) && this.data.cells.length) {
					data = d.data.cells;
					d.cols = Object.keys(data[0]).length;
				} else {
					for (i=1; i <= d.rows; i++) data.push({});
				}
			
				for (i=1; i <= d.cols; i++) columns.push({name: this.intToLetters(i), type: "string"})
				
				this.grid = o.grid(data, columns);
				this.grid.registerEditor(BasicEditor);
				this.grid.render();
				

				if (this.columns) {
					this.columnSelect = '<div class="select is-fullwidth"><select>'+_.map(this.columns, (v) => { return '<option value="'+v.key+'">'+v.title+'</option>' })+'</select></div>';
					$mx('thead th div', o).html(this.columnSelect);
				}
				
				if ($mx.isset(d.data) && $mx.isset(d.data.selects) && d.data.selects.length) {
					$mx('thead th select', o).each(function(i, v) {
						$mx(this).val(d.data.selects[i]);
					});
				}
				
				if (d.name) {
					input = $mx('<input type="hidden" name="'+d.name+'">').appendTo(o);
				}
				
				this.grid.events.on("editor:save", (e) => {
					if (input) {
						this.data = {'cells': this.grid.getGridData(), 'selects': $mx.makeArray($mx('select', o).map(function() { return this.value; }))};
					}
				});
				
				this.grid.$el.on('change', 'select', () => {
					this.grid.events.trigger("editor:save");
				});
				
				this.grid.events.trigger("editor:save");
				
				this.grid.setActiveCell(cell = $mx("tbody tr:first td:first", this.grid.$el));
				this.grid.$el.focus();
				
				$mx(document).on('paste', this.paste);
				
				this.isFetching = false;
			});
		},
		
		destroyed() {
			$mx(document).off('paste', this.paste);
			this.grid.destroy();
		},

		mixins: [FormModel],

		methods: {
			updateData() {
				
				if (this.current_language == 'ru') {
					_.each(this.data.cells, (v) => {
						v.A = v.A.trim();
						v.B = v.B.trim();
	
						if (this.phrases[v.A] == undefined) {
							this.amount_notfound++
							console.log(v.A);
						} else {
							this.amount_updated++;
							this.phrases[v.A].v = v.B;
						}
					});
					
					this.is_done = true;
				} else {
					this.$api.get('manager/locales/get', {language: this.current_language}).then((data) => {
						let phrases = {};
						_.each(data.response.locales.phrases, (v) => {
							if (v.v) phrases[v.v] = v.k;
						});
						
						_.each(this.data.cells, (v) => {
							v.A = v.A.trim();
							v.B = v.B.trim();
	
							if (phrases[v.A] != undefined && this.phrases[phrases[v.A]] != undefined) {
								this.amount_updated++;
								this.phrases[phrases[v.A]].v = v.B;
							} else {
								this.amount_notfound++
								console.log(v.A);
							}
						});

						this.is_done = true;
					});
				}
/*
				
				this.isUpdating = true;
				this.$api.post('manager/locales/import', {data: this.data}, this).then((data) => {
					if (data.result == 'success') {
						this.amount_inserted = data.response.amount_inserted;
						this.amount_products = data.response.amount_products;
						this.is_done = data.response.is_done;
					}
					this.isUpdating = false;
				}).catch((error) => {
					this.isUpdating = false;
				})
*/
				//this.$parent.close();
			},
			
			intToLetters(value) {
			    result = '';
			    while (--value >= 0) {
			        result = String.fromCharCode('A'.charCodeAt(0) + value % 26 ) + result;
			        value /= 26;
			    }
			    
			    return result;
			},			
			
			paste(e) {
				if (!this.grid.is(':focus')) return;
				let o = this.$refs.grid;
				
				oe = e.originalEvent;
				
				if (true) {
					
					if (true) {
						this.grid.setActiveCell(cell = $mx("tbody tr:first td:first", o));
						$mx("tbody tr td:gt(0), thead tr th:gt(0)", o).remove();
						$mx("tbody tr:gt(0)", o).remove();
					} else {
						cell = this.grid.getActiveCell();
					}
					
					function getClipboardData() {
						var cd = (window.clipboardData)?window.clipboardData:oe.clipboardData;
						var types = [];
						
						for (var _t = 0; _t < cd.types.length; _t++) types.push(cd.types[_t]);
						
						if (types.indexOf('text/html') != -1) {
							var clipText = $mx(oe.clipboardData.getData('text/html'));
							if (clipText.is('table')) {
								var table = $mx('tr', clipText).map(function() {
									return [$mx("td",this).map(function() { 
								      return this.innerText;     
								    }).get()];
								}).get();
								
								return table;
							}
						}
										
						if (types.indexOf('text/plain') != -1) {
							var clipText = oe.clipboardData.getData('text/plain');
							var rows = clipText.split(/\r\n|\n|\r/);
							var table = [];
							for (i = 0; i < rows.length; i++) table.push(rows[i].split('\t'));
							return table;
						}
						
						return [];
					}
					
					var colNum = cell.index();
					
					var rows = getClipboardData();
					
					for (i = 0; i < rows.length; i++) {
						var cols = rows[i];
						if (cols.length) {
							for (j = 0; j < cols.length; j++) {
		 						$mx('div', cell).text(cols[j]);
		 						if (j < cols.length-1) {
			 						next = cell.next();
			 						
			 						if (next.length == 0) {
				 						var tr = cell.closest('tr');
				 						var tridx = tr.index();
				 						var t = tr.closest('table');
				 						var trh = $mx('thead tr', t);
				 						var col = this.intToLetters($mx('th', trh).length+1);
				 						
				 						var idx = 0;
				 						$mx('tbody tr', t).each(function() {
					 						var c = $mx('<td><div></div></td>').appendTo(this).data(cell.data()).data("column", col);
					 						if (idx == tridx) next = c;
					 						idx++;
				 						});
				 						
				 						$mx('<th><div>'+((this.columnSelect != undefined)?this.columnSelect:col)+'</div></th>').appendTo(trh);
			 						}
			 						
			 						cell = next;
		 						}
		 					}
		 					
		 					if (i < rows.length-1) {
			 					tr = cell.closest('tr');
			 					next = tr.next();
			 					if (next.length == 0) {
				 					next = $mx(tr[0].outerHTML);
				 					tdnext = $mx('td', next);
				 					var idx = 0;
				 					$mx('td', tr).each(function() {
					 					var ct = $mx(this);
					 					$mx(tdnext[idx]).data(ct.data());
					 					idx++;
				 					});
				 					
				 					next.appendTo(tr.parent()).removeClass('activeRow');
				 					tdnext.removeClass("activeCell").find('div').empty();
			 					}
			 					
			 					cell = $mx(next.find('td')[colNum]);
		 					}
							}
					}
					
					e.preventDefault();
					
					this.grid.events.trigger("editor:save");
				}
			}
		}, template: `<div class="modal-card modal-card-large"> <header class="modal-card-head"> <p class="modal-card-title">{{'Загрузка языка из Excel'|gettext}}</p> <button class="modal-close is-large" @click="$parent.close()"></button> </header> <section class="modal-card-body"> <div class="message is-success" v-if="is_done && amount_updated"><div class="message-body">Обновлено фраз: {{amount_updated|number}}</div></div> <div class="message is-danger" v-if="is_done && amount_notfound"><div class="message-body">Не найдено фраз: {{amount_notfound|number}}</div></div> <div v-else> <b-field label="Базовый язык"> <b-select v-model="current_language"> <option value="ru">Русский</option> <option :value="k" v-for="(v, k) in languages">{{v}}</option> </b-select> </b-field> <div ref="grid" class="has-mb-4"></div> <div class="block-arrow-left-top" style="margin-top: -15px;opacity:0.5"> Скопируйте нужные ячейки из Excel и вставьте в эту таблицу </div> </div> </section> <footer class="modal-card-foot"> <button class="button is-dark" type="button" @click="$parent.close()">{{'Закрыть'|gettext}}</button> <button v-if="!is_done" class="button is-primary" :class="{'is-loading': isUpdating}" @click="updateData">{{'Загрузить'|gettext}}</button> </footer> <b-loading :is-full-page="false" :active.sync="isFetching"></b-loading> </div>`});

window.$app.defineComponent("manager", "vue-manager-locking-list", {data() {
			return {
				isFetching: false,
				filter: {query: '', tags: []},
				perPage: 100
			}
		},

		mixins: [ListModel],

		created() {
			this.fetchData(true);
		},

		methods: {
			refresh() {
				this.fetchData(false, true);
			},
			
			fetchData(withLoading, force) {
				if (force || !this.checkCache()) {
					this.isFetching = withLoading;
					this.$api.get('manager/locking/list', {next: this.next, count: this.perPage, filter: this.filter}).then((data) => {
						this.cachePage(data.response.locking);
						this.isFetching = false;
					}).catch((error) => {
	                    this.fields = []
	                    this.total = 0
	                    this.isFetching = false
	                    throw error
	                })
                }

			},

			onPageChange(page) {
                this.page = page
                this.fetchData()
            },
            
            clickRow(row) {
	            //this.$form('vue-manager-logs-form', {message_id: row.message_id}, this);
            },
		}, template: `<div> <div class="container has-mt-3"> <div class="has-mb-2"> <b-table :data="fields" :loading="isFetching" :per-page="perPage" :total="total" @page-change="onPageChange" @click="clickRow" hoverable bordered> <template slot-scope="props"> <b-table-column field="username" label="Профиль"> <span class="iti__flag iti__flag-box" :class="'iti__'+props.row.country" style="display: inline-block" :title="props.row.country"></span> <span class="tag is-default" v-html="props.row.lang" style="width: 24px;margin: 0 .5rem"></span> <a @click="openForm(props.row.profile_id)">{{ props.row.username }}</a> </b-table-column> <b-table-column field="hits" label="Посетители" numeric>{{ props.row.hits|number }}</b-table-column> <b-table-column field="Followers" label="Followers" numeric>{{ props.row.followers|number }}</b-table-column> <b-table-column field="hf" label="Hits / Followers" numeric> {{ props.row.hf|number }} </b-table-column> </template> <template slot="empty"> <section class="has-mb-4 has-mt-4 content has-text-grey has-text-centered" v-if="!isFetching"> <p><b-icon icon="frown" size="is-large"></b-icon></p> <p>{{'Пока ничего нет'|gettext}}</p> </section> <section class="has-mb-4 has-mt-4 content has-text-grey has-text-centered" v-if="isFetching"> <p>{{'Загрузка данных'|gettext}}</p> </section> </template> </b-table> </div> </div> </div>`});

window.$app.defineComponent("manager", "vue-manager-logs-form", {data() {
			return {
				isUpdating: false,
				isFetching: false,
				values: {}
			}
		},

		created() {
			this.fetchData(true);
		},

		props: ['message_id'],
		mixins: [FormModel],

		methods: {
			fetchData(withLoading) {
				this.isFetching = withLoading;
				this.$api.get('manager/logs/get', {message_id: this.message_id}).then((data) => {
					this.isFetching = false;
					this.values = data.response.logs.message;
					
					this.values.message = JSON.stringify(this.values.message, null, "\t");
				});

			}
		}, template: `<div class="modal-card modal-card-large"> <header class="modal-card-head"> <p class="modal-card-title">Событие</p> <button class="modal-close is-large" @click="$parent.close()"></button> </header> <section class="modal-card-body"> <vue-component-codemirror v-model="values.message" mode="application/json" readonly="true"></vue-component-codemirror> </section> <footer class="modal-card-foot"> <button class="button is-dark" type="button" @click="$parent.close()">{{'Закрыть'|gettext}}</button> </footer> <b-loading :is-full-page="false" :active.sync="isFetching"></b-loading> </div>`});

window.$app.defineComponent("manager", "vue-manager-logs-list", {data() {
			return {
				isFetching: false,
				filter: {query: '', tags: []},
				perPage: 100,
				filterTags: ['owner_id', 'service_name'],
			}
		},

		mixins: [ListModel],

		created() {
			this.fetchData(true);
		},

		methods: {
			onFilter() {
				this.clearPages();
				this.fetchData(true);
			},
			
			refresh() {
				this.fetchData(false, true);
			},
			
			fetchData(withLoading, force) {
				if (force || !this.checkCache()) {
					this.isFetching = withLoading;
					this.$api.get('manager/logs/list', {next: this.next, count: this.perPage, filter: this.filter}).then((data) => {
						this.cachePage(data.response.logs);
						this.isFetching = false;
					}).catch((error) => {
	                    this.fields = []
	                    this.total = 0
	                    this.isFetching = false
	                    throw error
	                })
                }

			},
			
			tagsFetch(name, query, cb) {
				if (['owner_id'].indexOf(name) >= 0) {
		            cb([]);
	            } else {
	                this.$api.get('manager/logs/filters', {query: query, name: name}).then((data) => {
		                cb((data.result == 'success')?data.response.variants:[]);
					});
				}
			},
			
			onPageChange(page) {
                this.page = page
                this.fetchData()
            },
            
            clickRow(row) {
	            this.$form('vue-manager-logs-form', {message_id: row.message_id}, this);
            },
		}, template: `<div> <vue-component-filterbox @filter="onFilter" :tags-fetch="tagsFetch" :allow-tags="filterTags" v-model="filter" :disabled="isFetching"></vue-component-filterbox> <div class="container"> <div class="has-mb-2"> <b-table paginated backend-pagination pagination-simple :data="fields" :loading="isFetching" :per-page="perPage" :total="total" @page-change="onPageChange" @click="clickRow" hoverable bordered> <template slot-scope="props"> <b-table-column field="post_id" label="" class="has-width-5 has-text-grey">{{ props.row.message_id }}</b-table-column> <b-table-column field="service_name" label="Сервис"> {{ props.row.service_name }} </b-table-column> <b-table-column field="code" label="HTTP Code" class="has-width-5"> <span :class="{'has-text-success': props.row.code>= 200 && props.row.code < 300, 'has-text-danger': props.row.code>= 400}">{{ props.row.code }}</span> </b-table-column> <b-table-column field="owner" label="Профиль"> <span v-if="props.row.owner">{{ props.row.owner }}</span> </b-table-column> <b-table-column field="tms_created" label="Дата" numeric> {{ props.row.tms|datetime }} </b-table-column> </template> <template slot="empty"> <section class="has-mb-4 has-mt-4 content has-text-grey has-text-centered" v-if="!isFetching"> <p><b-icon icon="frown" size="is-large"></b-icon></p> <p>{{'Пока ничего нет'|gettext}}</p> </section> <section class="has-mb-4 has-mt-4 content has-text-grey has-text-centered" v-if="isFetching"> <p>{{'Загрузка данных'|gettext}}</p> </section> </template> </b-table> </div> </div> </div>`});

window.$app.defineComponent("manager", "vue-manager-partners-history", {data() {
			return {
				isFetching: false,
				isUpdating: false,
				history: [],
                percents: [0, 5, 10, 15, 20, 25, 30, 35],
                percent: 0,
                max_percent: 5
			}
		},
		
		props: ['profile_id', 'partner_id'],
		
		created() {
			this.isFetching = true;
			this.$api.get('manager/partners/get', {partner_id: this.partner_id}).then((r) => {
				if (r.result == 'success') {
					this.history = r.response.history;
					this.max_percent = r.response.max_percent;
					this.percent = r.response.percent;
				}
				
				this.isFetching = false;
			});			
		},
		
		methods: {
			change() {
				this.isUpdating = true;
				this.$api.get('manager/partners/set', {partner_id: this.partner_id, percent: this.percent}).then((r) => {
					if (r.result == 'success') {
						this.history = r.response.history;
						this.$parent.$parent.fetchData();
					}

					this.isUpdating = false;
				});
			}
		}, template: `<div class="modal-card modal-card-large"> <header class="modal-card-head"> <p class="modal-card-title">{{'Партнерская программа'|gettext}}</p> <button class="modal-close is-large" @click="$parent.close()"></button> </header> <section class="modal-card-body modal-card-body-blocks"> <section> <div class="row row-small"> <div class="col-sm-3 has-mb-2-mobile"> <b-select v-model="percent" expanded> <option value="">-- {{'Процент отчислений'|gettext}} --</option> <option :value="p" v-for="p in percents" v-if="p <= max_percent">{{p}}%</option> </b-select> </div> <div class="col-sm-2"> <button class='button is-primary is-fullwidth' :class="{'is-loading': isUpdating}" @click="change" expanded>{{'Изменить'|gettext}}</button> </div> </div> </section> <section> <b-table :data="history" :paginated="false"> <template slot-scope="props"> <b-table-column :label="'Дата'|gettext">{{ props.row.tms|datetime }}</b-table-column> <b-table-column :label="'Процент'|gettext">{{ props.row.percent }}%</b-table-column> <b-table-column :label="'Кто добавил'|gettext">{{ props.row.email }}</b-table-column> </template> </b-table> </section> </section> <footer class="modal-card-foot"> <button class="button is-dark" type="button" @click="$parent.close()">{{'Закрыть'|gettext}}</button> </footer> <b-loading :is-full-page="false" :active.sync="isFetching"></b-loading> </div>`});

window.$app.defineComponent("manager", "vue-manager-partners-list", {data: function() {
			return {
				partners: [],
				permissions: {},
                page: 1,
                perPage: 100,
                total: 0,
                isUpdating: false,
                percents: [0, 5, 10, 15, 20, 25, 30, 35],
                
                form: {nickname: '', percent: '', period: ''},
                max_percent: 5,
				
				isFeaching: false
			}
		},
		
		mixins: [FormModel, ListModel],
		
		created: function () {
			this.$io.on('events:manager.partners:refresh', this.refresh);
			this.permissions = {
				profile: this.$auth.isAllowEndpoint('manager/profiles/get'),
				add: this.$auth.isAllowEndpoint('manager/partners/add')
			}
			this.fetchData();
		},
		
		destroyed() {
			this.$io.off('events:manager.partners:refresh', this.refresh);
		},

		methods: {
			onPageChange(page) {
                this.page = page
                this.fetchData()
            },
            
            onSort(field, order) {
                this.sortField = field;
                this.sortOrder = order;
                this.fetchData()
            },
            
            fetchData(force) {
				this.isFeaching = true;

				let resolve = (data) => {
					this.partners = data.fields;
					this.max_percent = data.max_percent;
					this.isFeaching = false;
				}
				
				if (force || !this.checkCache(resolve)) {
					this.$api.post('manager/partners/list', {next: this.next, sort_field: this.sortField, sort_order: this.sortOrder}).then((data) => {
						this.cachePage(data.response.partners, resolve);
					}).catch((error) => {
	                    this.payments = []
	                    this.total = 0
	                    this.isFeaching = false
	                    throw error
	                })
                }
			},
			
			openForm(profile_id) {
				this.$form('vue-manager-profiles-form', {profile_id: profile_id}, this);
			},
			
			addPartner() {
				console.log('---');
				this.isUpdating = true;
				this.$api.post('manager/partners/add', this.form, this).then((data) => {
					if (data.result == 'success') {
						_.each(this.form, (v, k) => { this.form[k] = ''; })
						console.log('====');
					}
					this.isUpdating = false;
				}).catch(() => {
					this.isUpdating = false;
				})
			}
		}, template: `<div class="container"> <div class="has-mt-2 has-mb-2" v-if="permissions.add"> <div class="row row-small"> <div class="col-sm has-mb-2-mobile"> <b-input type="text" :placeholder="'Email или имя профиля партнера'|gettext" v-model="form.nickname" expanded></b-input> </div> <div class="col-sm-3 has-mb-2-mobile"> <b-select v-model="form.percent" expanded> <option value="">-- {{'Процент отчислений'|gettext}} --</option> <option :value="p" v-for="p in percents" v-if="p <= max_percent">{{p}}%</option> </b-select> </div> <div class="col-sm-2"> <button class='button is-primary is-fullwidth' :class="{'is-loading': isUpdating}" @click="addPartner" expanded>{{'Добавить'|gettext}}</button> </div> </div> </div> <b-table paginated backend-pagination pagination-simple :data="partners" :loading="isFeaching" class="has-mb-4" :per-page="perPage" :total="total" @page-change="onPageChange"> <template slot-scope="props"> <b-table-column field="nickname" :label="'Профиль'|gettext"> {{ props.row.email }}<br> <a v-for="profile in props.row.profiles" class="is-block" @click="openForm(profile.profile_id)" v-if="permissions.profile">{{ profile.nickname }}</a> <div v-else>{{ profile.nickname }}</div> </b-table-column> <b-table-column field="manager" :label="'Кто добавил'|gettext" class="has-text-grey">{{ props.row.manager }}</b-table-column> <b-table-column field="percent" :label="'Процент'|gettext">{{ props.row.percent }} %</b-table-column> <b-table-column field="profiles" :label="'Промокоды'|gettext"> <div class="tags" v-if="props.row.promos"><div v-for="promocode in props.row.promos" class="tag is-success">{{ promocode.code }}</div></div> <div v-else class="has-text-danger">{{'Нет'|gettext}}</div> </b-table-column> <b-table-column field="profiles" :label="'Статистика'|gettext" numeric> <div v-if="props.row.invited_amount">{{'Регистрации'|gettext}}: {{ props.row.invited_amount }}</div> <div v-if="props.row.invited_amount_installed">{{'Установки'|gettext}}: {{ props.row.invited_amount_installed }}</div> <div v-if="props.row.invited_orders">{{'Оплаты'|gettext}}: {{ props.row.invited_orders }}</div> <div v-if="props.row.invited_budget">{{'Сумма'|gettext}}: {{ props.row.invited_budget|currency('RUB') }}</div> </b-table-column> </template> </b-table> </div>`});

window.$app.defineComponent("manager", "vue-manager-payments-form", {data() {
			return {
				isUpdating: false,
				isFetching: false,
				values: {},
				currentTab: 'common',
				refund: {marketing: false, time: false},
				isRefunding: false
			}
		},

		created() {
			if (this.order_id) this.fetchData(true);
		},

		props: ['order_id'],
		mixins: [FormModel],
		
		computed: {
			progress() {
				return 100 - ((this.values.period_days - this.values.period_days_left) / this.values.period_days * 100);
			},
			
			total_refund() {
				return this.values.price - (this.refund.marketing?(this.values.price*0.3):0) - (this.refund.time?(this.values.price*((this.values.period_days - this.values.period_days_left) / this.values.period_days)):0);
			},
			
			isAllowRefund() {
				return this.$auth.isAllowEndpoint('manager/payments/refund');
			},
			
			isAllowPaid() {
				return this.$auth.isAllowEndpoint('manager/payments/paid');
			}
		},

		methods: {
			fetchData(withLoading) {
				this.isFetching = withLoading;
				this.$api.get('manager/payments/get', {order_id: this.order_id}).then((data) => {
					this.isFetching = false;
					this.values = data.response.payments.values;
				});
			},
			
			setTab(n) {
				this.currentTab = n;
			},
			
			doRefund() {
				this.$confirm(this.values.receipt?this.$gettext('Для того, чтобы отменить операцию вам необходимо сделать возврат денежных средств клиенту. После нажатия кнопки "Ок" данные о возврате уйдут в ФНС. Вы уже сделали возврат?'):this.$gettext('Аннулировать оплату?'), 'is-warning').then(() => {
					this.isRefunding = true;
                    this.$api.post('manager/payments/refund', {order_id: this.order_id, receipt: this.values.receipt, budget: this.total_refund}, this).then((data) => {
	                   	if (data.result == 'success') {
					   		this.isRefunding = false;
					   		this.$parent.$parent.fetchData();
							this.currentTab = 'common';
							this.fetchData(true);
						}
					});
				});
			},
			
			doPaid() {
				this.$confirm('Клиент оплатил?', 'is-warning').then(() => {
                    this.$api.post('manager/payments/paid', {order_id: this.order_id}, this).then((data) => {
	                   	if (data.result == 'success') {
							this.currentTab = 'common';
							this.fetchData(true);
						}
					});
				});
			},
			
			updateData() {
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
		}, template: `<div class="modal-card modal-card-large"> <header class="modal-card-head"> <p class="modal-card-title">{{'Оплата'|gettext}}</p> <button class="modal-close is-large" @click="$parent.close()"></button> </header> <ul class="nav nav-tabs has-text-left"> <li :class="{active: currentTab== 'common'}"><a @click="setTab('common')">{{'Общие'|gettext}}</a></li> <li :class="{active: currentTab== 'refund'}" v-if="values.period_days_left && isAllowRefund"><a @click="setTab('refund')">{{'Возврат'|gettext}}</a></li> </ul> <section class="modal-card-body" v-if="currentTab == 'common'"> <div class="has-mb-4"> <label class="label is-pulled-left">{{'Тариф'|gettext}}: {{values.tariff}}</label> <div class="is-pulled-right has-text-grey" v-if="values.period_days_left">{{'Осталось {1} из {2}'|gettext|format(values.period_days_left, values.period_days)}}</div> <progress v-if="(values.order_status_id == 2) && values.period_days_left" class="progress is-success is-small" :value="progress" max="100"></progress> <progress v-else class="progress is-success is-small" value="0" max="100"></progress> </div> <div class="row"> <div class="col-xs-12 col-sm-8"> <div class="field"> <div class="row"> <div class="col-xs-3 has-text-weight-bold">{{'Цена'|gettext}}:</div> <div class="col-xs-9"> {{values.price|currency(values.currency_title)}} </div> </div> </div> <div class="field"> <div class="row"> <div class="col-xs-3 has-text-weight-bold">{{'Статус'|gettext}}:</div> <div class="col-xs-9"> {{values.order_status|gettext}} <a href="#" v-if="values.order_status != 2 && isAllowPaid" @click="doPaid">{{'Провести оплату'|gettext}}</a> </div> </div> </div> <div class="field"> <div class="row"> <div class="col-xs-3 has-text-weight-bold">{{'Метод оплаты'|gettext}}:</div> <div class="col-xs-9"> {{values.payment_method_title}} </div> </div> </div> <div class="field"> <div class="row"> <div class="col-xs-3 has-text-weight-bold">{{'От'|gettext}}:</div> <div class="col-xs-9"> {{values.tms_modify|datetime}} </div> </div> </div> <div class="field"> <div class="row"> <div class="col-xs-3 has-text-weight-bold">{{'До'|gettext}}:</div> <div class="col-xs-9"> <span v-if="values.tariff_tms_until">{{values.tariff_tms_until|datetime}}</span> <span v-else class="has-text-grey">—</span> </div> </div> </div> </div> </div> </section> <section class="modal-card-body" v-if="currentTab == 'refund'"> <div class="has-mb-2"> <div class="has-mb-1">Цена: {{values.price|currency(values.currency_title)}}</div> <div><b-checkbox v-model="refund.time" :disabled="isRefunding">Вычесть использованное время</b-checkbox></div> <div class="has-mb-1"><b-checkbox v-model="refund.marketing" :disabled="isRefunding">Вычесть 30%</b-checkbox></div> <div class="has-mb-1">Итого: {{total_refund|currency(values.currency_title)}}</div> <div v-if="total_refund"> <button class="button is-danger" @click="doRefund" :disabled="isRefunding">Оформить возврат</button> </div> </div> </section> <footer class="modal-card-foot"> <button class="button is-dark" type="button" @click="$parent.close()">{{'Закрыть'|gettext}}</button> </footer> <b-loading :is-full-page="false" :active.sync="isFetching"></b-loading> </div>`});

window.$app.defineComponent("manager", "vue-manager-payments-list", {data: function() {
			return {
				payments: [],
				statisticsGroup: null,
				statistics: null,
				isFetching: false,
				filter: {query: '',date_from: null, date_until: null},				
				statisticsGroups: {payment_provider: this.$gettext('Платежная система'), payment_method: this.$gettext('Метод оплаты')},
				perPage: 100,
                balance: 0,
                total: 0,
                sortField: 'tms_modify',
                sortOrder: 'desc',
                
				weekdays: this.$getDaysNames(),
				months: this.$getMonthsNames(),
				first_day_week: this.$getFirstDayWeek(),
			}
		},

		mixins: [ListModel],

		watch: {
			statisticsGroup() {
				this.fetchStatistics();
			}
		},
		
		created: function () {
			this.fetchData();
			this.fetchStatistics();
		},
		
		computed: {
			totalPayments() {
				return _.sumBy(this.balance, (v) => v.amount );
			}
		},

		methods: {
			onFilter() {
				this.statisticsGroup = null;
				this.fetchStatistics();
				this.clearPages();
				this.fetchData();
			},
			
			openProfileForm(profile_id) {
				this.$form('vue-manager-profiles-form', {profile_id: profile_id}, this);
			},

			onPageChange(page) {
                this.page = page
                this.fetchData(true, false);
            },
            
            onSort(field, order) {
                this.sortField = field;
                this.sortOrder = order;
                this.fetchData()
            },
            
            openForm(order_id) {
	            this.$form('vue-manager-payments-form', {order_id: order_id}, this);
            },
            
            fetchStatistics() {
				this.statistics = null;
				let params = {filter: this.filter};
                this.$api.post('manager/payments/statistics', this.statisticsGroup?Object.assign(params, {group: this.statisticsGroup}):params).then((data) => {
	                this.statistics = data.response.statistics;
                });
			},
			
            fetchData(withFetching = true, first = false, force = false) {
				this.isFetching = withFetching;
				
				let resolve = (data) => {
					this.payments = _.map(data.fields, (v) => { 
						v.link = '//instagram.com/'+v.nickname;
						return v;
					});
					this.isFetching = false;
				}
				
				if (force || !this.checkCache(resolve)) {
					this.$api.post('manager/payments/list', {next: this.next, sort_field: this.sortField, sort_order: this.sortOrder, filter: this.filter}).then((data) => {
						let d = data.response.payments;
						this.cachePage(d, resolve);
						if (d.balance.length) this.balance = d.balance;
					}).catch((error) => {
	                    this.payments = []
	                    this.total = 0
	                    this.isFetching = false
	                    throw error
	                })
                }
			}
		}, template: `<div> <div class="container has-mb-2 has-mt-2"> <div class="has-mb-2" v-if="statistics"> <div v-if="statisticsGroup"> <div style="display: flex;flex-direction: row"> <div class="has-background-grey-light profiles-conversion-bar" style="flex-grow: 1"></div> <b-dropdown v-model="statisticsGroup" class="statistics-group-button" aria-role="list" position="is-bottom-left"> <div data-stage="0" style="width: 1.5rem;height: 1rem;position: absolute;top: 0;" slot="trigger" aria-role="listitem"></div> <b-dropdown-item value="">{{'Без групировки'|gettext}}</b-dropdown-item> <hr class="dropdown-divider"> <b-dropdown-item v-for="(t, k) in statisticsGroups" :value="k">{{t}}</b-dropdown-item> </b-dropdown> </div> </div> <div v-for="(s, k) in statistics" class="has-mb-2"> <div v-if="statisticsGroup"><span v-if="k">{{k}}</span><span class="has-text-grey" v-else>{{'Пустой список'|gettext}}</span></div> <div style="display: flex;flex-direction: row"> <div class="has-background-grey-light profiles-conversion-bar" style="flex-grow: 1"> <div data-stage="2" :style="{width: s.bars.nopaid}" data-toggle="tooltip" data-placement="top" :data-original-title="'Не оплатили: {1} из {2}'|gettext|format($number(s.values.nopaid), $number(s.values.total))"><span>{{s.bars.nopaid}}</span></div> <div data-stage="5" :style="{width: s.bars.paid}" data-toggle="tooltip" data-placement="top" :data-original-title="'Оплатили: {1} из {2}'|gettext|format($number(s.values.paid), $number(s.values.total))"><span>{{s.bars.paid}}</span></div> </div> <b-dropdown v-model="statisticsGroup" class="statistics-group-button" aria-role="list" position="is-bottom-left" v-if="!statisticsGroup"> <div data-stage="0" style="width: 1.5rem;height: 1rem;position: absolute;top: 0;" slot="trigger" aria-role="listitem"></div> <b-dropdown-item value="">{{'Без групировки'|gettext}}</b-dropdown-item> <hr class="dropdown-divider"> <b-dropdown-item v-for="(t, k) in statisticsGroups" :value="k">{{t}}</b-dropdown-item> </b-dropdown> </div> </div> </div> <div class="has-mt-2 has-mb-2 has-background-grey-light profiles-conversion-bar" v-else></div> <mx-item class="mx-item-header"> <div class="item-row row"> <div class="col-xs-12"> <span class="has-text-grey has-mr-2">{{'Всего оплат'|gettext}}: {{ totalPayments|number }}</span> {{'Итого'|gettext}}: <span v-for="(b, i) in balance" class="has-mr-1" :style="{opacity: 1-i*0.3}">{{b.balance | number}} {{b.currency_title}}<span v-if="i < balance.length-1">,</span> </span> </div> </div> </mx-item> </div> <vue-component-filterbox @filter="onFilter" v-model="filter" :with-filters="true" :disabled="isFetching"> <template slot="filters"> <div class="row row-small"> <div class="col-xs-6 col-sm-3 has-mb-2"> <div class="has-feedback"> <b-datepicker :placeholder="'От'|gettext" v-model="filter.date_from" icon="calendar-alt" :day-names="weekdays" :month-names="months" :first-day-of-week="first_day_week"></b-datepicker> <a class="form-control-feedback has-text-grey-light" @click="filter.date_from = null"><i class="fal fa-times"></i></a> </div> </div> <div class="col-xs-6 col-sm-3 has-mb-2"> <div class="has-feedback"> <b-datepicker :placeholder="'До'|gettext" v-model="filter.date_until" icon="calendar-alt" :day-names="weekdays" :month-names="months" :first-day-of-week="first_day_week"></b-datepicker> <a class="form-control-feedback has-text-grey-light" @click="filter.date_until = null"><i class="fal fa-times"></i></a> </div> </div> </div> </template> </vue-component-filterbox> <div class="container"> <b-table paginated backend-pagination backend-sorting pagination-simple :data="payments" :loading="isFetching" class="has-mb-4" :per-page="perPage" :total="total" :default-sort="[sortField, sortOrder]" @page-change="onPageChange" @sort="onSort"> <template slot-scope="props"> <b-table-column field="order_id" :label="'Счет'|gettext" sortable><div><span class="has-text-grey-light">№</span> <a href='#' @click="openForm(props.row.order_id)">{{ props.row.order_id }}</a></div></b-table-column> <b-table-column field="order_status_id" :label="'Оплата'|gettext" width="10%" sortable><span :class="{'has-text-success': props.row.order_status_id == 2, 'has-text-danger': props.row.order_status_id != 2}"><span v-if="props.row.order_status_id == 2">{{'Оплачен'|gettext}}</span><span v-else>{{'Не оплачен'|gettext}}</span></span></b-table-column> <b-table-column field="nickname" :label="'Система'|gettext" sortable><span v-if="props.row.payment_provider">{{ props.row.payment_provider }}</span><span v-else class="has-text-grey-light">—</span></b-table-column> <b-table-column field="nickname" :label="'Профиль'|gettext" sortable><a @click="openProfileForm(props.row.profile_id)">{{ props.row.nickname }}</a></b-table-column> <b-table-column field="fiscal_attribute" :label="'Чек'|gettext" sortable><span v-if="props.row.onlinekassa_error" class="has-text-danger"><i class="fa fa-exclamation-triangle" data-toggle="tooltip" data-placement="top" :data-original-title="props.row.onlinekassa_error"></i> Ошибка</span><span v-else><span v-if="props.row.fiscal_attribute">ФП: {{ props.row.fiscal_attribute }}</span><span v-else class="has-text-grey-light">—</span></span></b-table-column> <b-table-column field="tms_modify" :label="'Дата'|gettext" class="has-text-nowrap" sortable>{{ props.row.tms_modify|datetime }}</b-table-column> <b-table-column field="price" :label="'Бюджет'|gettext" numeric sortable><div><span v-if="props.row.budget != props.row.price" class="has-text-success" style="opacity: .5">{{ props.row.budget|number }} {{props.row.currency_title}}</span> {{ props.row.price|number }}<span class="has-text-grey-light"> {{props.row.currency_title}}</span></div></b-table-column> </template> </b-table> </div> </div>`});

window.$app.defineComponent("manager", "vue-manager-profiles-export-form", {data() {
			return {
				isUpdating: false,
				isRefreshing: false,
				isFetching: false,
				amount: 0,
				charset: 'utf-8',
				export_products: false,
				variants: {}
			}
		},

		created() {
			this.fetchData(true);
		},
		
		props: ['filters', 'query', 'tags', 'date_from', 'date_until'],
		
		computed: {
			downloadUrl() {
				return '/api/manager/profiles/export/download.csv?filters='+this.filters.join(',')+'&query='+this.query+'&charset='+this.charset+'&tags='+this.tags.join(',')+'&date_from='+(this.date_from?date_format('Y-m-d', this.date_from):'')+'&date_until='+(this.date_until?date_format('Y-m-d', this.date_until):'');
				
//				filter[status_id]='+this.filter.status_id+'&filter[page_id]='+this.filter.page_id+'&export_products='+(this.export_products?1:0)+'&charset='+this.charset;
			}	
		},

		mixins: [FormModel],

		methods: {
			fetchData(withLoading) {
				this.isRefreshing =  this.isFetching = withLoading;
				
				this.$api.get('manager/profiles/export/info', {filters: this.filters, query: this.query, tags: this.tags, date_from: this.date_from?date_format('Y-m-d', this.date_from):null, date_until: this.date_until?date_format('Y-m-d', this.date_until):null, charset: this.charset}).then((data) => {
					this.isFetching = this.isRefreshing = false;
					this.variants = data.response.export.info.variants;
					this.amount = data.response.export.info.amount;
				});
				
			},
			
			onChanged() {
				this.isRefreshing = true;
				this.$api.get('manager/profiles/export/calc', {filters: this.filters, query: this.query, charset: this.charset}).then((data) => {
					this.isRefreshing = false;
					this.amount = data.response.export.calc;
				});
			}
		}, template: `<div class="modal-card"> <header class="modal-card-head"> <p class="modal-card-title">{{'Экспорт профилей'|gettext}}</p> <button class="modal-close is-large" @click="$parent.close()"></button> </header> <section class="modal-card-body"> <div class="message is-success"> <div class="message-body"> {{'Найдено профилей'|gettext}}: {{ amount|number }} <a :href="downloadUrl" target="frame" class="button is-small is-success is-pulled-right no-ajax" :class="{'is-loading': isRefreshing}"><span class="is-hidden-mobile">{{'Скачать CSV-файл'|gettext}}</span><span class="is-hidden-tablet">{{'Скачать'|gettext}}</span></a> </div> </div> <b-field :label="'Кодировка'|gettext"> <b-select v-model="charset" expanded> <option v-for="(v, k) in variants.charset" :value="k">{{ v }}</option> </b-select> </b-field> </section> <footer class="modal-card-foot"> <button class="button is-dark" type="button" @click="$parent.close()">{{'Закрыть'|gettext}}</button> </footer> <b-loading :is-full-page="false" :active.sync="isFetching"></b-loading> </div>`});

window.$app.defineComponent("manager", "vue-manager-profiles-form", {data: function() {
			return {
				currentTab: 'common',
				profile: {nickname: '', tariff_current: '', avatar_url: '', tags: []},
				is_allow_signin: false,
				profiles: [],
				payments: [],
				transfers: [],
				errors: {},
				variants: {domain_id: null},
				lock: {message: '', profiles: []},
				similar_profiles: null,
				history: null,
				isFetchingSimilarsProfiles: false,
				isFetching: false,
				isUpdating: false,
				isLockUpdating: false
			}
		},
		created() {
			this.fetchData();
		},
		computed: {
			link() {
				return {page: 'https://taplink.cc/'+this.profile.nickname, instagram: 'https://instagram.com/'+this.profile.nickname};
			}	
		},
		props: ['profile_id'],
		methods: {
			openTrialForm() {
				this.$form('vue-manager-profiles-trial-form', {profile_id: this.profile_id, profileForm: this});
			},
			setTab(n) {
				this.currentTab = n;
				
				if (n == 'lock' && this.similar_profiles == null) {
					this.isFetchingSimilarsProfiles = true;
					this.$api.get('manager/profiles/lock/similar', {profile_id: this.profile_id}).then((data) => {
						this.lock.profiles = [this.profile_id];
						this.similar_profiles = data.response.profiles;
						this.isFetchingSimilarsProfiles = false;
					});
				}
				
				if (n == 'history' && this.history == null) {
					this.isFetchingHistory = true;
					this.$api.get('manager/statistics/history/list', {profile_id: this.profile_id}).then((data) => {
						this.history = data.response.history.fields;
						this.isFetchingHistory = false;
					});
				}
			},
			
			fetchData() {
				this.isFetching = true;
				this.$api.get('manager/profiles/get', {profile_id: this.profile_id}).then((data) => {
					this.isFetching = false;
					this.profile = data.response.profile;
					this.profiles = data.response.profiles;
					this.payments = data.response.payments;
					this.transfers = data.response.transfers; 
					this.variants = data.response.variants;
					this.is_allow_signin = data.response.is_allow_signin;
				});
			},
			
			openPartnerForm() {
	            this.$form('vue-manager-partners-history', {partner_id: this.profile.partner_id, profile_id: this.profile.profile_id}, this);
			},
			
			openPaymentForm(order_id) {
	            this.$form('vue-manager-payments-form', {order_id: order_id}, this);
            },
			
			lockProfiles() {
				this.$confirm('Заблокировать эти профили?', 'is-danger').then(() => {
					this.isLockUpdating = true;
					
					this.$api.post('manager/profiles/lock/lock', this.lock).then((data) => {
						this.$parent.close();
					});
				});
			},
/*
			updateData() {
				this.isUpdating = true;
				this.$api.post('manager/profiles/set', this.profile).then((data) => {
					if (data.result == 'fail') {
						this.errors = data.errors;
					} else {
						this.$parent.close()
					}
					this.isUpdating = false;
				}).catch(({ data }) => {
					this.isUpdating = false;
				})
			}
*/
		}, template: `<div class="modal-card modal-card-large"> <header class="modal-card-head"> <p class="modal-card-title"><img :src="'//{1}/a/{2}'|format($account.storage_domain, profile.avatar_url)" style="width: 3rem;height:3rem;border-radius:100%;margin: -1rem .5rem -1rem 0"> {{'Профиль'|gettext}} {{profile.nickname}}</p> <button class="modal-close is-large" @click="$parent.close()"></button> </header> <ul class="nav nav-tabs has-text-left"> <li :class="{active: currentTab== 'common'}"><a @click="setTab('common')">{{'Общие'|gettext}}</a></li> <li :class="{active: currentTab== 'payments'}"><a @click="setTab('payments')">{{'Оплаты'|gettext}}</a></li> <li :class="{active: currentTab== 'profiles'}"><a @click="setTab('profiles')">{{'Профили'|gettext}}</a></li> <li :class="{active: currentTab== 'lock'}" v-if="$auth.isAllowEndpoint('manager/profiles/lock/similar')"><a @click="setTab('lock')">{{'Блокировка'|gettext}}</a></li> <li :class="{active: currentTab== 'transfers'}"><a @click="setTab('transfers')">{{'Переносы'|gettext}}</a></li> <li :class="{active: currentTab== 'history'}"><a @click="setTab('history')">{{'История установок'|gettext}}</a></li> </ul> <section class="modal-card-body" v-if="currentTab == 'common'"> <div class="row"> <div class="col-xs-12 col-sm-6"> <div class="field"> <div class="row"> <div class="col-xs-3 has-text-weight-bold">{{'Страница'|gettext}}:</div> <div class="col-xs-9"> <a target="_blank" :href="link.page">{{profile.nickname}}</a> </div> </div> </div> <div class="field"> <div class="row"> <div class="col-xs-3 has-text-weight-bold">ID:</div> <div class="col-xs-9"> {{profile.profile_id}} </div> </div> </div> <div class="field"> <div class="row"> <div class="col-xs-3 has-text-weight-bold">{{'Тариф'|gettext}}:</div> <div class="col-xs-9"> <vue-component-tariff-badge v-model="profile.tariff_current" theme="dark"/> <span v-if="profile.tariff_current != 'basic'" class="control has-text-grey has-ml-1">до {{profile.tms_tariff_until|date}}</span> </div> </div> </div> <div class="field"> <div class="row"> <div class="col-xs-3 has-text-weight-bold">{{'Триал'|gettext}}:</div> <div class="col-xs-9 level"> <div class="level-left"> <p class="control" v-if="profile.trial_tariff"> <vue-component-tariff-badge v-model="profile.trial_tariff" theme="dark"/> <span class="control has-text-grey has-ml-1">до {{profile.trial_tms_until|date}}</span> </p> <p class="control has-text-grey" v-else>-- {{'Нет'|gettext}} --</p> </div> <div class="level-right"> <a @click="openTrialForm" class="is-pulled-right has-text-success" v-if="$auth.isAllowEndpoint('manager/profiles/trial/set')">{{'Активировать'|gettext}}</a> </div> </div> </div> </div> <div class="field"> <div class="row"> <div class="col-xs-3 has-text-weight-bold">{{'Домен'|gettext}}:</div> <div class="col-xs-9"> <span v-for="(domain, domain_id) in variants.domain_id" v-if="domain_id == profile.domain_id">{{ domain }}</span> </div> </div> </div> <div class="field"> <div class="row"> <div class="col-xs-3 has-text-weight-bold">Referer:</div> <div class="col-xs-9"> <a v-if="profile.referer" target="_blank" rel="noreferrer" :href="profile.referer">{{profile.referer_domain}}</a> <p class="control has-text-grey" v-else>-- {{'Нет'|gettext}} --</p> </div> </div> </div> <div class="field"> <div class="row"> <div class="col-xs-3 has-text-weight-bold">{{'Метки'|gettext}}:</div> <div class="col-xs-9"> <span class="tags" v-if="profile.tags.length> 0"> <span v-for="tag in profile.tags" class="tag is-warning">{{ tag }}</span> </span> <p class="control has-text-grey" v-else>-- {{'Нет'|gettext}} --</p> </div> </div> </div> </div> <div class="col-xs-12 col-sm-6"> <div class="field"> <div class="row"> <div class="col-xs-3 has-text-weight-bold">{{'Профиль'|gettext}}:</div> <div class="col-xs-9"> <a target="_blank" :href="link.instagram" v-if="profile.has_nickname">@{{profile.nickname}}</a> <p class="control has-text-grey" v-else>-- {{'Нет'|gettext}} --</p> </div> </div> </div> <div class="field"> <div class="row"> <div class="col-xs-3 has-text-weight-bold">{{'Подписчиков'|gettext}}:</div> <div class="col-xs-9"> {{profile.followers|number}} </div> </div> </div> <div class="field"> <div class="row"> <div class="col-xs-3 has-text-weight-bold">{{'Био'|gettext}}:</div> <div class="col-xs-9"> {{profile.biography}} </div> </div> </div> <div class="field"> <div class="row"> <div class="col-xs-3 has-text-weight-bold">{{'Ссылка'|gettext}}:</div> <div class="col-xs-9"> <a :href="profile.website_link" target="_blank" v-if="profile.website_domain">{{profile.website_domain}}</a> <p class="control has-text-grey" v-else>-- {{'Нет'|gettext}} --</p> </div> </div> </div> <div class="field"> <div class="row"> <div class="col-xs-3 has-text-weight-bold">Email:</div> <div class="col-xs-9"> <a :href="'mailto:{1}'|format(profile.email)" target="_blank" v-if="profile.email">{{profile.email}}</a> <p class="control has-text-grey" v-else>-- {{'Нет'|gettext}} --</p> </div> </div> </div> <div class="field"> <div class="row"> <div class="col-xs-3 has-text-weight-bold">{{'Кто привел'|gettext}}:</div> <div class="col-xs-9"> <p v-if="profile.invite_partner_id">{{profile.invite_partner_email}}</p> <p class="control has-text-grey" v-else>-- {{'Нет'|gettext}} --</p> </div> </div> </div> <div class="field"> <div class="row"> <div class="col-xs-3 has-text-weight-bold">{{'Партнерская программа'|gettext}}:</div> <div class="col-xs-9 level"> <div class="level-left"> <p v-if="profile.partner_id">ID: {{profile.partner_id}} <span class="has-text-grey">{{profile.partner_percent}}%</span></p> <p class="control has-text-grey" v-else>-- {{'Нет'|gettext}} --</p> </div> <div class="level-right" v-if="profile.partner_id"> <a @click="openPartnerForm" class="is-pulled-right has-text-success" v-if="$auth.isAllowEndpoint('manager/partners/set')">{{'Изменить'|gettext}}</a> </div> </div> </div> </div> </div> </div> </section> <section class="modal-card-body" v-if="currentTab == 'payments'"> <b-table :data="payments" :paginated="false"> <template slot-scope="props"> <b-table-column field="order_id" :label="'Счет'|gettext" sortable><span class="has-text-grey-light">№</span> <a href='#' @click="openPaymentForm(props.row.order_id)">{{ props.row.order_id }}</a></b-table-column> <b-table-column field="order_status_id" :label="'Оплата'|gettext" width="10%" sortable><span :class="{'has-text-success': props.row.order_status_id == 2, 'has-text-danger': props.row.order_status_id != 2}"><span v-if="props.row.order_status_id == 2">{{'Оплачен'|gettext}}</span><span v-else>{{'Не оплачен'|gettext}}</span></span></b-table-column> <b-table-column field="fiscal_attribute" :label="'Чек'|gettext" sortable><span v-if="props.row.onlinekassa_error" class="has-text-danger"><i class="fa fa-exclamation-triangle" data-toggle="tooltip" data-placement="top" :data-original-title="props.row.onlinekassa_error"></i> Ошибка</span><span v-else><span v-if="props.row.fiscal_attribute">ФП: {{ props.row.fiscal_attribute }}</span><span v-else class="has-text-grey-light">—</span></span></b-table-column> <b-table-column field="tms_modify" :label="'Дата'|gettext" sortable>{{ props.row.tms_modify|datetime }}</b-table-column> <b-table-column field="price" :label="'Бюджет'|gettext" numeric sortable><span v-if="props.row.budget != props.row.price" class="has-text-success" style="opacity: .5">{{ props.row.budget|number }} {{props.row.currency_title}}</span> {{ props.row.price|number }}<span class="has-text-grey-light"> {{props.row.currency_title}}</span></b-table-column> </template> <template slot="empty"> <div class="has-text-grey-light has-text-centered">{{'Оплат нет'|gettext}}</div> </template> </b-table> </section> <section class="modal-card-body" v-if="currentTab == 'lock'"> <div class="manager-profiles has-mb-2"> <div class="media"> <div class="media-left"> <img :src="'//{1}/a/{2}'|format($account.storage_domain, profile.avatar_url)"> </div> <div class="media-content"> <b-checkbox v-model="lock.profiles" :native-value="profile_id" disabled>{{profile.nickname}}</b-checkbox><br> </div> </div> <div v-for="p in similar_profiles" class="media"> <div class="media-left"> <img :src="p.avatar_url"> </div> <div class="media-content"> <b-checkbox v-model="lock.profiles" :native-value="p.profile_id" :disabled="isLockUpdating">{{p.nickname}}</b-checkbox><br> </div> <div class="media-left"> <a target="_blank" :href="'https://taplink.cc/{1}'|format(p.nickname)">Открыть</a> </div> </div> </div> <b-field label="Сообщение"> <b-input type="textarea" v-model="lock.message" :disabled="isLockUpdating"></b-input> </b-field> <button class="button is-danger" @click="lockProfiles" :disabled="isLockUpdating">Заблокировать профиль</button> <b-loading :is-full-page="false" :active.sync="isFetchingSimilarsProfiles"></b-loading> </section> <section class="modal-card-body" v-if="currentTab == 'profiles'"> <p class="has-text-grey">{{'Список других профилей в данном личном кабинете'|gettext}}</p> <b-table :data="profiles" class="has-mt-2" :paginated="false"> <template slot-scope="props"> <b-table-column field="nickname" label="Имя пользователя"><a @click="$form('vue-manager-profiles-form', {profile_id: props.row.profile_id});">{{ props.row.nickname }}</a></b-table-column> <b-table-column field="nickname" label="Тариф" class="has-width-20"><vue-component-tariff-badge v-model="props.row.tariff_current" v-if="props.row.has_tariff"/><span class="tag is-default" v-else>basic</span></b-table-column> <b-table-column field="nickname" numeric label="Действителен до" class="has-text-right has-width-20"><span v-if="props.row.has_tariff">{{ props.row.tms_tariff_until|datetime }}</b-table-column> </template> <template slot="empty"> <div class="has-text-grey-light has-text-centered">{{'Других профилей нет'|gettext}}</div> </template> </b-table> </section> <section class="modal-card-body" v-if="currentTab == 'transfers'"> <b-table :data="transfers" :paginated="false"> <template slot-scope="props"> <b-table-column field="username_from" :label="'От кого'|gettext">{{props.row.username_from}}</b-table-column> <b-table-column field="username_to" :label="'Кому'|gettext">{{props.row.username_to}}</b-table-column> <b-table-column field="tms_transfer" :label="'Дата'|gettext" width="10%">{{ props.row.tms_transfer|datetime }}</b-table-column> </template> <template slot="empty"> <div class="has-text-grey-light has-text-centered">{{'Пока ничего нет'|gettext}}</div> </template> </b-table> </section> <section class="modal-card-body" v-if="currentTab == 'history'"> <b-table :data="history" v-if="history"> <template slot-scope="props"> <b-table-column :label="'Дата'|gettext">{{ props.row.tms|date }}</b-table-column> <b-table-column :label="'Домен'|gettext"><span v-if="props.row.website_domain_history">{{ props.row.website_domain_history }}</span><span class="has-text-grey" v-else>{{'Пока ничего нет'|gettext}}</span></b-table-column> </template> <template slot="empty"> <div class="has-text-grey-light has-text-centered">{{'Пока ничего нет'|gettext}}</div> </template> </b-table> <b-loading :is-full-page="false" :active.sync="isFetchingHistory"></b-loading> </section> <footer class="modal-card-foot level"> <div class="level-left"> <button @click="$auth.changeProfile(profile_id, () => {$parent.close()})" target="_blank" class="button" v-if="is_allow_signin">Войти в аккаунт</button> </div> <div class="level-right"> <button class="button is-dark" type="button" @click="$parent.close()">{{'Закрыть'|gettext}}</button> </div> </footer> <b-loading :is-full-page="false" :active.sync="isFetching"></b-loading> </div>`});

window.$app.defineComponent("manager", "vue-manager-profiles-list", {data: function() {
			return {
				isFetching: false,
				profiles: [],
				statistics: null,
				permissions: {},
				filter: {query: '', tags: []},
                perPage: 100,
                sortField: 'tms_created',
                sortOrder: 'desc',
                date_from: null,
                date_until: null,
                statisticsGroup: '',
                
				weekdays: this.$getDaysNames(),
				months: this.$getMonthsNames(),
				first_day_week: this.$getFirstDayWeek(),
				
				filterTags: ['utm_source', 'utm_medium', 'utm_campaign', 'lang', 'country', 'domain'],
				statisticsGroups: {lang: this.$gettext('Язык'), country: this.$gettext('Страна'), tag: this.$gettext('Метка')},
                
				dropdown_items: [
					{label: this.$gettext('Тарифы'), items: {'tariff:*': this.$gettext('Все тарифы'), 'tariff:pro': 'pro', 'tariff:business': 'business'}},
					{label: this.$gettext('Ссылка'), items: {'is_installed:true': this.$gettext('Cсылка стоит'), 'is_installed:false': this.$gettext('Cсылка не стоит'), 'is_installed_once:true': this.$gettext('Cсылка стояла')}},
					{label: this.$gettext('Блокировка'), items: {'is_locked:true': this.$gettext('Профиль заблокирован'), 'is_locked:false': this.$gettext('Профиль не заблокирован')}},
// 					{label: 'Instagram', items: {'is_deleted:true': 'Профиль удален', 'is_deleted:false': 'Профиль не удален'}},
				],
				filter_values: ['tariff:*', 'is_locked:false'],
			}
		},
		
		mixins: [ListModel],
		
		watch: {
			filter_type: function() {
				this.statisticsGroup = null;
				this.clearPages();
				this.fetchData();
			},
			statisticsGroup() {
				let params = this.getFetchParams();				
				this.fetchStatistics(params);
			}
		},
		
		beforeRouteUpdate(to, from, next) {
			let $auth = Vue.prototype.$auth;
			
			if ($auth.isAllowEndpoint('manager/profiles/list')) {
				next();
			} else {
				console.log(1);
				let submenu = $auth.prepareMenu($auth.getMenu('manager'));
				next(submenu[0]);
			}
		},

		created: function () {
			if (!this.$auth.isAllowEndpoint('manager/profiles/list')) return;
			
			this.fetchData(true, true);
			this.$io.on('events:manager.profiles.list:refresh', this.refresh);
			
			this.permissions = {
				form: this.$auth.isAllowEndpoint('manager/profiles/get'),
				statistics: this.$auth.isAllowEndpoint('manager/profiles/statistics'),
			}
		},
		
		destroyed() {
			this.$io.off('events:manager.profiles.list:refresh', this.refresh);
		},	

		methods: {
			fetchStatistics(params) {
				this.statistics = null;
                this.$api.get('manager/profiles/statistics', this.statisticsGroup?Object.assign(params, {group: this.statisticsGroup}):params).then((data) => {
	                this.statistics = data.response.profiles.statistics;
                });
			},
			onFilter() {
				this.statisticsGroup = null;
				this.fetchStatistics();
				this.clearPages();
				this.fetchData();
			},
			refresh() {
				this.clearPages();
				this.fetchData(true, false, true);
			},
			stageTitle(stage) {
				let stages = {
					1: 'Авторизовался',
					2: 'Указал Email',
					3: 'Добавил блоки',
					4: 'Поставил ссылку',
					5: 'Оплатил тариф'
				}
				
				return stages[stage];
			},
			
			onPageChange(page) {
                this.page = page;
                this.fetchData(true, false);
            },
            
        	getFetchParams() {
            	return {next: this.next, sort_field: this.sortField, sort_order: this.sortOrder, query: this.filter.query, tags: this.filter.tags, filters: this.filter_values, date_from: this.date_from?date_format('Y-m-d', this.date_from):null, date_until: this.date_until?date_format('Y-m-d', this.date_until):null};;
        	},
            
            fetchData(withFetching = true, first = false, force = false) {
				this.isFetching = withFetching;
				
				let params = this.getFetchParams();
				
				let resolve = (data) => {
					//if (!this.next) this.statistics = data.statistics;
					this.profiles = _.map(data.fields, (v) => { 
						v.instagram_link = '//instagram.com/'+v.nickname;
						v.taplink_link = '//taplink.cc/'+v.nickname;
						v.lang = v.lang?v.lang:'&nbsp;&nbsp;';
						v.website_title = decodeURI(v.website_domain).replace(/\?.*/g, '?...').replace(/https?\:\/\//, '').replace(/^www\./, '');//.substr(0, 100);
						if (v.website_domain.indexOf('taplink.') != -1) {
							v.website_class = 'has-text-primary';
						} else if (!v.is_installed && v.is_installed_once) {
							v.website_class = 'has-text-danger';
						} else {
							v.website_class = 'has-text-black';
						}
						return v;
					});
					
					//this.next = data.response.profiles.next;
					
					
					this.isFetching = false;
				}
				
				if (force || !this.checkCache(resolve)) {
					this.$nextTick(() => {
						this.$api.post(first?['manager/profiles/list', 'manager/info']:'manager/profiles/list', params).then((data) => {
							this.cachePage(data.response.profiles, resolve);
							
							if (first) {
								if (!data.response.manager.info.domain_id) {
									let items = {'domain:*': 'Все домены'};
									this.filter_values.push('domain:*');
									
									_.each(data.response.manager.domains, (v, k) => {
										items['domain:'+k] = 'taplink.'+v;
									});
									
									this.dropdown_items.push({label: 'Домены', items: items});
								}
							}
						}).catch((error) => {
		                    this.payments = []
		                    this.total = 0
		                    this.isFetching = false
		                    throw error
		                });
		                
		                
		                if (this.permissions.statistics && !this.statistics) {
			                this.fetchStatistics(params);
		                }
	                });
                }
			},
			
			doFilter() {
				this.statisticsGroup = null;
				this.fetchStatistics();
                this.clearPages();
				this.fetchData(true, false);
			},
			
			openForm(profile_id) {
				this.$form('vue-manager-profiles-form', {profile_id: profile_id}, this);
			},
			
			rowClass(row, index) {
				return row.is_locked?'tr-lock-account':'';
			},
			
            openExportForm() {
	            this.$form('vue-manager-profiles-export-form', {query: this.filter.query, tags: this.filter.tags, filters: _.clone(this.filter_values), date_from: this.date_from, date_until: this.date_until}, this);
            },
            
            tagsFetch(name, query, cb) {
	            if (['lang', 'country'].indexOf(name) >= 0) {
		            cb([]);
	            } else {
	                this.$api.get('manager/profiles/filters', {query: query, name: name}).then((data) => {
		                cb((data.result == 'success')?data.response.variants:[]);
					});
				}
            },
            
			onInputDates() {
				this.statisticsGroup = null;
				this.fetchStatistics();
				this.clearPages();
				this.fetchData();
			}            
		}, template: `<div> <div class="container" v-if="permissions.statistics"> <div> <div class="has-mt-2 has-mb-2" v-if="statistics"> <div v-if="statisticsGroup"> <div style="display: flex;flex-direction: row"> <div class="has-background-grey-light profiles-conversion-bar" style="flex-grow: 1"></div> <b-dropdown v-model="statisticsGroup" class="statistics-group-button" aria-role="list" position="is-bottom-left"> <div data-stage="0" style="width: 1.5rem;height: 1rem;position: absolute;top: 0;" slot="trigger" aria-role="listitem"></div> <b-dropdown-item value="">Без групировки</b-dropdown-item> <hr class="dropdown-divider"> <b-dropdown-item v-for="(t, k) in statisticsGroups" :value="k">{{t}}</b-dropdown-item> </b-dropdown> </div> </div> <div v-for="(s, k) in statistics"> <div v-if="statisticsGroup"><span v-if="k">{{k}}</span><span class="has-text-grey" v-else>Пусто</span></div> <div style="display: flex;flex-direction: row"> <div class="has-background-grey-light profiles-conversion-bar" style="flex-grow: 1"> <div data-stage="2" :style="{width: s.bars.signup}" data-toggle="tooltip" data-placement="top" :data-original-title="'Регистраций: {1}'|format($number(s.values.total))"><span>{{s.conversions.signup}}</span></div> <div data-stage="3" :style="{width: s.bars.blocks}" data-toggle="tooltip" data-placement="top" :data-original-title="'Добавили блоки: {1} из {2}'|format($number(s.values.blocks), $number(s.values.total))"><span>{{s.conversions.blocks}}</span></div> <div data-stage="1" :style="{width: s.bars.installed_remove}" data-toggle="tooltip" data-placement="top" :data-original-title="'Убрали ссылку: {1} из {2} ({3})'|format($number(s.values.installed_remove), $number(s.values.installed_once), s.conversions.installed_remove_local)"><span>{{s.conversions.installed_remove}}</span></div> <div data-stage="4" :style="{width: s.bars.installed}" data-toggle="tooltip" data-placement="top" :data-original-title="'Установлено ссылок: {1} из {2} ({3})'|format($number(s.values.installed), $number(s.values.installed_once), s.conversions.installed_local)"><span>{{s.conversions.installed}}</span></div> <div data-stage="5" :style="{width: s.bars.paid}" data-toggle="tooltip" data-placement="top" :data-original-title="'Оплатили: {1} из {2}'|format($number(s.values.paid), $number(s.values.total))"><span>{{s.conversions.paid}}</span></div> </div> <b-dropdown v-model="statisticsGroup" class="statistics-group-button" aria-role="list" position="is-bottom-left" v-if="!statisticsGroup"> <div data-stage="0" style="width: 1.5rem;height: 1rem;position: absolute;top: 0;" slot="trigger" aria-role="listitem"></div> <b-dropdown-item value="">{{'Без групировки'|gettext}}</b-dropdown-item> <hr class="dropdown-divider"> <b-dropdown-item v-for="(t, k) in statisticsGroups" :value="k">{{t}}</b-dropdown-item> </b-dropdown> </div> </div> </div> <div class="has-mt-2 has-mb-2 has-background-grey-light profiles-conversion-bar" v-else></div> </div> </div> <vue-component-filterbox @filter="onFilter" v-model="filter" :tags-fetch="tagsFetch" :disabled="isFetching" :allow-tags="filterTags" :with-filters="true" :with-buttons="true"> <template slot="buttons"> <a @click="openExportForm" class="button is-light is-fullwidth" data-toggle="tooltip" data-placement="top" :data-original-title="'Скачать CSV-файл'|gettext"><i class="fa fas fa-download"></i></a> </template> <template slot="filters"> <div class="row row-small"> <div class="col-sm-3 has-mb-2"> <vue-component-dropdown-checklist :list="dropdown_items" v-model="filter_values" @input="doFilter"></vue-component-dropdown-checklist> </div> <div class="col-xs-6 col-sm-3 has-mb-2"> <div class="has-feedback"> <b-datepicker :placeholder="'От'|gettext" v-model="date_from" icon="calendar-alt" :day-names="weekdays" :month-names="months" :first-day-of-week="first_day_week" @input="onInputDates"></b-datepicker> <a class="form-control-feedback has-text-grey-light" @click="date_from = null"><i class="fal fa-times"></i></a> </div> </div> <div class="col-xs-6 col-sm-3 has-mb-2"> <div class="has-feedback"> <b-datepicker :placeholder="'До'|gettext" v-model="date_until" icon="calendar-alt" :day-names="weekdays" :month-names="months" :first-day-of-week="first_day_week" @input="onInputDates"></b-datepicker> <a class="form-control-feedback has-text-grey-light" @click="date_until = null"><i class="fal fa-times"></i></a> </div> </div> </div> </template> </vue-component-filterbox> <div class="container has-mb-3"> <b-table paginated backend-pagination backend-sorting pagination-simple :data="profiles" :loading="isFetching" :per-page="perPage" :current-page="page" :total="total" :default-sort="[sortField, sortOrder]" @page-change="onPageChange" @sort="onSort" :row-class="rowClass" bordered> <template slot-scope="props"> <b-table-column field="nickname" :label="'Профиль'|gettext" sortable> <div v-if="props.row.utm_source" class="has-text-warning is-pulled-right"><span class="">UTM: {{props.row.utm_source}}</span><span v-if="props.row.utm_medium || props.row.utm_campaign" class=""> / {{props.row.utm_medium}}</span><span v-if="props.row.utm_campaign" class=""> / {{props.row.utm_campaign}}</span></div> <span style="display: flex;align-items: center"> <span class="iti__flag iti__flag-box" :class="'iti__'+props.row.country" style="display: inline-block" :title="props.row.country"></span> <span class="tag is-default" v-html="props.row.lang" style="width: 24px;margin: 0 .5rem"></span> <a @click="openForm(props.row.profile_id)" v-if="permissions.form" style="flex:1">{{ props.row.nickname }}</a> <span v-else>{{ props.row.nickname }}</span> <span class="tags has-ml-1" v-if="props.row.tags.length"><span v-for="tag in props.row.tags" class="tag">{{tag}}</span></span> </span> </b-table-column> <b-table-column field="weight" :label="'Вес'|gettext" class="has-width-5" numeric> <span :class="{'has-text-grey-light': props.row.weight == 0}">{{ props.row.weight|number }}</span> </b-table-column> <b-table-column field="website_link" :label="'Ссылка'|gettext" class="has-width-30"> <div> <span class="profile-stage" :data-stage="props.row.stage" data-toggle="tooltip" data-placement="top" :data-original-title="stageTitle(props.row.stage)">{{props.row.stage}}</span> <a :href='props.row.website_link' target="_blank" :class="props.row.website_class" v-if="props.row.website_domain">{{ props.row.website_domain }}</a> <div class="tags is-pulled-right is-hidden-mobile"> <span v-if="props.row.is_deleted" class="is-pulled-right tag is-warning" data-toggle="tooltip" data-placement="top" :data-original-title="'Этот Instagram отключен'|gettext">&nbsp;<i class="fas fa-times"></i>&nbsp;</span> <span v-if="props.row.is_locked" class="is-pulled-right tag is-danger" data-toggle="tooltip" data-placement="top" :data-original-title="'Этот профиль заблокирован'|gettext">&nbsp;<i class="fas fa-lock"></i>&nbsp;</span> <span v-if="!props.row.is_installed && props.row.is_installed_once" class="tag is-danger">remove</span> <a :href='props.row.taplink_link' target="_blank"> <span class="tag is-warning" v-if="props.row.trial_tariff">trial</span> <vue-component-tariff-badge v-else v-model="props.row.tariff_current"/> </a> </div> </div> </b-table-column> <b-table-column field="followers" :label="'Подписчиков'|gettext" numeric sortable> <div class="tags is-pulled-left is-hidden-mobile"> <a :href='props.row.instagram_link' target="_blank"><span class="tag is-dark">Instagram</span></a> </div> {{ props.row.followers|number }} </b-table-column> <b-table-column field="tms_created" :label="'Дата'|gettext" numeric sortable> {{ props.row.tms_created|date }} </b-table-column> </template> </b-table> </div> </div>`});

window.$app.defineComponent("manager", "vue-manager-profiles-trial-form", {data() {
			return {
				isUpdating: false,
				isFetching: false,
				tariff: '', 
				period: ''
			}
		},

		props: ['profile_id', 'profileForm'],
		mixins: [FormModel],

		mounted() {
		},
		

		methods: {
			updateData() {
				this.isUpdating = true;
				this.$api.post('manager/profiles/trial/set', {profile_id: this.profile_id, tariff: this.tariff, period: this.period}, this).then((data) => {
					if (data.result == 'success') {
						this.profileForm.fetchData();
						this.$parent.close()
					}
					this.isUpdating = false;
				}).catch((error) => {
					this.isUpdating = false;
				})
			}
		}, template: `<div class="modal-card"> <header class="modal-card-head"> <p class="modal-card-title">{{'Активация пробного периода'|gettext}}</p> <button class="modal-close is-large" @click="$parent.close()"></button> </header> <section class="modal-card-body"> <b-field :label="'Тариф'|gettext" :message="errors.tariff" :class="{'has-error': errors.tariff}"> <b-select v-model="tariff" expanded> <option value="">-- {{'Выберите тариф'|gettext}} --</option> <option value="pro">PRO</option> <option value="business">BUSINESS</option> </b-select> </b-field> <b-field :label="'Период'|gettext" :message="errors.tariff" :class="{'has-error': errors.tariff}"> <b-select v-model="period" expanded> <option value="">-- {{'Выберите период'|gettext}} --</option> <option value="3">3 days</option> <option value="7">7 days</option> <option value="7">14 days</option> <option value="30">1 months</option> <option value="90">3 months</option> <option value="180">6 months</option> <option value="365">1 year</option> <option value="1825">5 years</option> <option value="3650">10 years</option> </b-select> </b-field> </section> <footer class="modal-card-foot"> <button class="button is-dark" type="button" @click="$parent.close()">{{'Закрыть'|gettext}}</button> <button class="button is-primary" :class="{'is-loading': isUpdating}" @click="updateData">{{'Сохранить'|gettext}}</button> </footer> <b-loading :is-full-page="false" :active.sync="isFetching"></b-loading> </div>`});

window.$app.defineComponent("manager", "vue-manager-questions-form", {data() {
			return {
				isUpdating: false,
				isFetching: false,
				currentLanguage: null,
				variants: {languages: {}},
				values: {questions: {}, questions_group_id: null},
				editorToolbar: [
					[{ 'header': [1, 2, 3, false] }],
					['bold', 'italic'],      
					[{ 'list': 'ordered'}, { 'list': 'bullet' }],
					[{ 'indent': '-1'}, { 'indent': '+1' }],
					[{ 'align': [] }],
					['link', 'image'],
					['clean']  
				]
			}
		},

		created() {
			this.fetchData(true);
		},

		props: ['question_id'],
		mixins: [FormModel],
		
		computed: {
			question() {
				return this.values.questions[this.currentLanguage];
			}
		},

		methods: {
			fetchData(withLoading) {
				this.isFetching = withLoading;
				this.$api.get(this.question_id?['manager/questions/get', 'manager/questions/info']:'manager/questions/info', {question_id: this.question_id}).then((data) => {
					this.isFetching = false;
					let q = data.response.questions;
					
					this.variants = q.variants;
					if (this.question_id) this.values = q.values;
					
					_.each(q.variants.languages, (l) => {
						if (this.values.questions[l.language_id] == undefined) this.$set(this.values.questions, l.language_id, {question_id: this.question_id, question: '', answer: '', language_id: l.language_id, is_visible: false});
					});
					
					this.currentLanguage = 1;
				});

			},
			
			updateData() {
				this.isUpdating = true;
				this.$api.post('manager/questions/set', this.values, this).then((data) => {
					if (data.result == 'success') {
						this.$parent.close()
					}
					this.isUpdating = false;
				}).catch((error) => {
					this.isUpdating = false;
				})
			}
		}, template: `<div class="modal-card modal-card-large"> <header class="modal-card-head"> <p class="modal-card-title">Вопрос</p> <button class="modal-close is-large" @click="$parent.close()"></button> </header> <ul class="nav nav-tabs has-text-left"> <li :class="{active: currentLanguage== l.language_id}" v-for="l in variants.languages"><a @click="currentLanguage = l.language_id">{{l.language_title}}</a></li> </ul> <section class="modal-card-body" v-if="currentLanguage"> <b-field label="Вопрос"> <b-input v-model="question.question"></b-input> </b-field> <b-field :label="'Ответ'|gettext" :message="errors.body" :class="{'has-error': errors.body}"> <vue-component-editor :editor-toolbar="editorToolbar" v-model="question.answer" classname="hero-text"></vue-component-editor> </b-field> <mx-toggle v-model="question.is_visible" :title="'Показывать'|gettext"></mx-toggle> </section> <section class="modal-card-body"> <span class="select"> <select v-model="values.questions_group_id"> <optgroup :label="p.questions_part_title" v-for="p in variants.groups"> <option :value="g.questions_group_id" v-for="g in p.groups">{{g.questions_group_title}}</option> </optgroup> </select> </span> </section> <footer class="modal-card-foot"> <button class="button is-dark" type="button" @click="$parent.close()">{{'Закрыть'|gettext}}</button> <button class="button is-primary" :class="{'is-loading': isUpdating}" @click="updateData">{{'Сохранить'|gettext}}</button> </footer> <b-loading :is-full-page="false" :active.sync="isFetching"></b-loading> </div>`});

window.$app.defineComponent("manager", "vue-manager-questions-groups-form", {data() {
			return {
				currentLanguage: 'ru',
				languages: {},
				parts: {},
				currentTab: null,
				isUpdating: false,
				isFetching: false,
			}
		},

		created() {
			this.fetchData(true);
		},

		methods: {
			fetchData(withLoading) {
				this.isFetching = withLoading;
				this.$api.get('manager/questions/groups/get').then((data) => {
					this.isFetching = false;
					this.parts = data.response.questions.parts;
					this.languages = data.response.questions.languages;
				});
			},
			
			updateData() {
				this.isUpdating = true;
				this.$api.get('manager/questions/groups/set', {parts: this.parts}).then((data) => {
					this.isUpdating = false;
					this.$parent.close();
				});
			},
			
			doAddGroup(p) {
				let titles = {};
				_.each(this.languages, (l) => { titles[l.language_code] = ''; });
				
				p.groups.push({questions_group_title: titles});
			},
			
			doAddPart() {
				let titles = {};
				_.each(this.languages, (l) => { titles[l.language_code] = ''; });

				this.parts.push({questions_part_name: '', questions_part_title: titles, groups: []});
			}
		}, template: `<div class="modal-card"> <header class="modal-card-head"> <p class="modal-card-title">Группы</p> <button class="modal-close is-large" @click="$parent.close()"></button> </header> <ul class="nav nav-tabs has-text-left"> <li :class="{active: currentLanguage== l.language_code}" v-for="l in languages"><a @click="currentLanguage = l.language_code">{{l.language_title}}</a></li> </ul> <section class="modal-card-body"> <sortable-list class="form-fields-item-list" lockAxis="y" v-model="parts" use-drag-handle> <sortable-item v-for="(p, i) in parts" class="form-fields-item is-narrow" :index="i" :key="i" :item="p"> <div class="form-fields-item-title has-background-white"> <div v-sortable-handle class="form-fields-item-handle"></div> <span class="row"> <div class="col-xs"> <input type="text" class="input" v-model="p.questions_part_title[currentLanguage]"> </div> <div class="col-xs col-sm-5"> <input type="text" class="input" v-model="p.questions_part_name" placeholder="Имя папки" :disabled="currentLanguage != 'ru'"> </div> </span> <div style="margin-left: 3rem"> <sortable-list class="form-fields-item-list" lockAxis="y" v-model="p.groups" use-drag-handle> <sortable-item v-for="(g, j) in p.groups" class="form-fields-item is-narrow" :index="j" :key="j" :item="g"> <div class="form-fields-item-title has-background-white"> <div v-sortable-handle class="form-fields-item-handle"></div> <span class="row"> <div class="col-xs"> <input type="text" class="input" v-model="g.questions_group_title[currentLanguage]"> </div> <div class="col-xs col-sm-5"> <input type="text" class="input" v-model="g.questions_group_name" placeholder="Имя подпапки" :disabled="currentLanguage != 'ru'"> </div> </span> </div> </sortable-item> </sortable-list> <a @click="doAddGroup(p)" class="button is-default is-small has-mb-1 has-mt-1">Добавить группу</a> </div> </div> </sortable-item> </sortable-list> <a @click="doAddPart" class="button is-default is-small has-mb-1 has-mt-1">Добавить раздел</a> </section> <footer class="modal-card-foot"> <button class="button is-dark" type="button" @click="$parent.close()">{{'Закрыть'|gettext}}</button> <button class="button is-primary" :class="{'is-loading': isUpdating}" @click="updateData">{{'Сохранить'|gettext}}</button> </footer> <b-loading :is-full-page="false" :active.sync="isFetching"></b-loading> </div>`});

window.$app.defineComponent("manager", "vue-manager-questions-list", {data() {
			return {
				isFetching: false,
				isSortable: false,
				variants: {groups: [], languages: {}},
				filter: {query: ''},
				filter_questions_group_id: '',
				perPage: 100,
				action: null
			}
		},
		
		mixins: [ListModel, SortableTable],
		
		created() {
			this.$io.on('events:manager.questions.list:refresh', this.refresh);
			
			this.fetchData(true, true);
		},
		
		destroyed() {
			this.$io.off('events:manager.questions.list:refresh', this.refresh);
		},
		
		methods: {
			onDropdown(v) {
				switch (v) {
					case 'newgroup': 
						this.$form('vue-manager-questions-groups-form');
						break;
					case 'resort':
						this.isSortable = true;
						break;
				}
			},
			
			refresh() {
				this.clearPages();
				this.fetchData(false, false, true);
			},
			
			openForm(question_id) {
	            this.$form('vue-manager-questions-form', {question_id: question_id}, this);
            },
            
			fetchData(withLoading, firstLoading, force) {
				if (force || !this.checkCache()) {
					this.isFetching = withLoading;
					this.$api.get(firstLoading?['manager/questions/list', 'manager/questions/info']:'manager/questions/list', {next: this.next, count: this.perPage, filter: {questions_group_id: this.filter_questions_group_id, query: this.filter.query}}).then((data) => {
						this.cachePage(data.response.questions);
						if (firstLoading) this.variants = data.response.questions.variants;
						this.isFetching = false;
					}).catch((error) => {
	                    this.fields = []
	                    this.total = 0
	                    this.isFetching = false
	                    throw error
	                })
                }
			},
			
			onReSort(oldIndex, newIndex, oldItem, newItem) {
	            this.isFetching = true;
				this.$api.get('manager/questions/sort', {question_id: oldItem.question_id, index_question_id: newItem.question_id, questions_group_id: this.filter_questions_group_id}, this).then((data) => {
		            this.isFetching = false;
				});
			},
			
			onPageChange(page) {
                this.page = page
                this.fetchData()
            }
		}, template: `<div> <vue-component-filterbox :showToolbar="isSortable" @dropdown="onDropdown" v-model="filter" @filter="refresh" :disabled="isFetching" :with-dropdown="true" :with-buttons="true"> <template slot="toolbar"> <a @click="isSortable = false" class="button is-dark"><i class="fal fa-check has-mr-2"></i> Завершить сортировку</a> </template> <template slot="dropdown"> <b-dropdown-item value="newgroup"><i class="fal fa-layer-group has-text-centered has-mr-1"></i> Настроить группы</b-dropdown-item> <b-dropdown-item value="resort" :disabled="filter.query != '' || filter_questions_group_id== ''"><i class="fal fa-arrows has-text-centered has-mr-1"></i> Сортировать</b-dropdown-item> </template> <template slot="buttons"> <div class="row row-small"> <div class="col-xs"> <span class="select is-fullwidth"> <select v-model="filter_questions_group_id" @change="refresh"> <option value="">-- Все группы --</option> <optgroup :label="p.questions_part_title" v-for="p in variants.groups"> <option :value="g.questions_group_id" v-for="g in p.groups">{{g.questions_group_title}}</option> </optgroup> </select> </span> </div> <div class="col-xs"> <a @click="$form('vue-manager-questions-form')" class="button is-primary is-fullwidth"><i class="fa fa-plus-circle"></i> Добавить вопрос</a> </div> </div> </template> </vue-component-filterbox> <div class="container"> <div class="has-mb-2"> <b-table paginated backend-pagination pagination-simple :data="fields" :loading="isFetching" :per-page="perPage" :total="total" @page-change="onPageChange" :class="{'is-sortable': isSortable}" bordered :draggable="isSortable" @dragstart="rowDragStart" @drop="rowDrop" @dragover="rowDragOver" @dragleave="rowDragLeave"> <template slot-scope="props"> <b-table-column field="question" label="Вопрос"> <span class="is-pulled-right tags"><span class="tag is-default" v-for="lg in props.row.languages">{{variants.languages[lg].language_code}}</span></span> <a href="#" @click="openForm(props.row.question_id)">{{ props.row.question }}</a><br><span class="has-text-grey">{{props.row.groupname}}</span> </b-table-column> </template> <template slot="empty"> <section class="has-mb-4 has-mt-4 content has-text-grey has-text-centered" v-if="!isFetching"> <p><b-icon icon="frown" size="is-large"></b-icon></p> <p>{{'Пока ничего нет'|gettext}}</p> </section> <section class="has-mb-4 has-mt-4 content has-text-grey has-text-centered" v-if="isFetching"> <p>{{'Загрузка данных'|gettext}}</p> </section> </template> </b-table> </div> </div> </div>`});

window.$app.defineComponent("manager", "vue-manager-rangings", {data() {
			return {
				isFetching: false,
				isFetchingCollections: false,
				autocompleteCollections: [],
				profile: null,
				maybeTags: [],
				info: null,
			}
		},

		mixins: [FormModel],

		created() {
			this.fetchData(true);
		},

		methods: {
			updateMaybeTags() {
				this.$http.get('/rangings/check.ai?profile_id='+this.profile.profile_id).then((r) => {
					this.maybeTags = r.data.response.tags;
				})
			},
			
			fetchData(withLoading) {
				this.isFetching = withLoading;
				this.$api.get(['manager/rangings/get', 'manager/rangings/info'], {}).then((data) => {
					this.profile = data.response.profile;
					this.info = data.response.info;
					this.updateMaybeTags();
					
					this.isFetching = false;
				}).catch((error) => {
                    this.profile = []
                    this.isFetching = false
                    throw error
                })
			},
			
			onAddingCollection(v) {
				return !_.find(this.profile.collections, ['collection_id', v.collection_id]);
			},
			
			onAddedCollection(v) {
				if (typeof v == 'string') {
					this.profile.collections.pop();
					this.profile.collections.push({collection_id: null, collection: v});
				}
			},
			
			onRemoveOption(index) {
				this.$confirm(this.$gettext('Вы уверены, что хотите удалить эту опцию?'), 'is-danger').then(() => {
					this.values.options.splice(index, 1);
				});
			},
			
			onAddOption() {
				this.values.options.push({option_id: null, title: '', price: 0});
			},

			asyncAutocompleteCollection: _.debounce(function(query) {
				this.data = [];
                
                if (query.trim() == '') {
	                this.autocompleteCollections = [];
	                return;
                }
                
                this.isFetchingCollections = true;
                this.$api.get('manager/rangings/collections/search', {query: query}).then((data) => {
	                this.autocompleteCollections = _.differenceWith(data.response.collections.search, this.profile.collections, (a, b) => a.collection_id == b.collection_id);
	                this.isFetchingCollections = false;
				});
			}, 300),
			
			result(status) {
				let profile = this.$clone(this.profile);
				profile.collections = _.map(profile.collections, 'collection');
				
				this.$api.post('manager/rangings/set', {profile: profile, status: status}).then((data) => {
					this.profile = data.response.profile;
					this.updateMaybeTags();
				});
			}
		}, template: `<div class="container has-mb-4 has-mt-4" v-if="profile"> <div class="row"> <div class="col-sm-6"> <div class="marvel-device iphone6 silver device-xs-hide page-blocks"> <div class="top-bar"></div> <div class="sleep"></div> <div class="volume"></div> <div class="camera"></div> <div class="sensor"></div> <div class="speaker"></div> <iframe :src="profile.link" class="screen page marvel-device-iframe" style="padding: 0"></iframe> <div class="home"></div> <div class="bottom-bar"></div> </div> </div> <div class="col-sm-6"> <div class="content"> <h3 class="title">Описание</h3> <p style="white-space:pre">{{profile.biography}}</p> </div> <div class="has-mb-5"> <b-field :label="'Метки'|gettext"> <b-taginput v-model="profile.collections" :data="autocompleteCollections" :before-adding="onAddingCollection" @add="onAddedCollection" allow-new="true" autocomplete field="collection" @typing="asyncAutocompleteCollection" confirm-key-codes='[13]' :placeholder="'Начните вводить название коллекции'|gettext" :loading="isFetchingCollections" attached> <template slot-scope="props"> <strong>{{props.option.collection}}</strong> </template> <template slot="empty"> <div v-if="isFetchingCollections">{{'Идет загрузка'|gettext}}</div> <div v-else>{{'Ничего не найдено'|gettext}}</div> </template> </b-taginput> </b-field> <div class="tags"> <span class="tag is-dark" v-for="s in maybeTags">{{s}}</span> </div> </div> <div class="level"> <div class="level-left"> <div class="level-item"><button class="button is-large is-warning" @click="result('good')"><i class="fas fa-thumbs-up"></i> Хорошо</button></div> <div class="level-item"><button class="button is-large is-danger" @click="result('bad')"><i class="fas fa-thumbs-down"></i> Плохо</button></div> <div class="level-item"><button class="button is-large is-dark" @click="result('skip')">Пропустить</button></div> </div> <div class="level-right"> <div class="level-item"><button class="button is-large is-success" @click="result('great')"><i class="fas fa-star"></i> Супер страница</button></div> </div> </div> </div> </div> </div>`});

window.$app.defineComponent("manager", "vue-manager-statistics-history", {data() {
			return {
				isUpdating: false,
				perPage: 100,
				statistics: null,
				currentTab: 'list'
			}
		},

		mixins: [ListModel],

		created() {
			this.fetchData(true);
		},

		props: ['date', 'target'],
		mixins: [ListModel],

		methods: {
			setTab(n) {
				this.currentTab = n;
			},
			
			onPageChange(page) {
                this.page = page;
                this.fetchData(false);
            },
            
			fetchData(withLoading, force) {
				this.isFetching = withLoading;
				
				let resolve = (data) => {
					if (data.statistics != undefined) {
						this.statistics = data.statistics;
					}
					
					this.fields = data.fields;
					this.isFetching = false;
				}
				
				if (force || !this.checkCache(resolve)) {
					this.$api.get('manager/statistics/history/list', {date: this.date, target: this.target, next: this.next}).then((data) => {
						this.isFetching = false;
						this.cachePage(data.response.history, resolve);
					});
				}

			}
		}, template: `<div class="modal-card modal-card-large"> <header class="modal-card-head"> <p class="modal-card-title" v-if="target == 'install'">{{'История установок'|gettext}} {{date}}</p> <p class="modal-card-title" v-else>{{'История удалений'|gettext}} {{date}}</p> <button class="modal-close is-large" @click="$parent.close()"></button> </header> <ul class="nav nav-tabs has-text-left"> <li :class="{active: currentTab== 'list'}"><a @click="setTab('list')">{{'Список'|gettext}}</a></li> <li :class="{active: currentTab== 'statistics'}"><a @click="setTab('statistics')">{{'Статистика'|gettext}}</a></li> </ul> <section class="modal-card-body" v-if="currentTab == 'list'"> <b-table :data="fields" paginated backend-pagination pagination-simple :per-page="perPage" :current-page="page" :total="total" @page-change="onPageChange"> <template slot-scope="props"> <b-table-column :label="'Имя пользователя'|gettext"><a @click="$form('vue-manager-profiles-form', {profile_id: props.row.profile_id});">{{ props.row.username }}</a></b-table-column> <b-table-column :label="'Домен'|gettext"><span v-if="props.row.website_domain_history">{{ props.row.website_domain_history }}</span><span class="has-text-grey" v-else>{{'Пусто'|gettext}}</span></b-table-column> <b-table-column :label="'Домен сейчас'|gettext"><span v-if="props.row.website_domain" class="has-text-grey-light">{{ props.row.website_domain }}</span><span class="has-text-grey-light" v-else>{{'Пусто'|gettext}}</span></b-table-column> <b-table-column :label="'Подписчиков'|gettext" numeric>{{ props.row.followers|number }}</b-table-column> </template> <template slot="empty"> <div class="has-text-grey-light has-text-centered">{{'Список пуст'|gettext}}</div> </template> </b-table> </section> <section class="modal-card-body" v-if="currentTab == 'statistics'"> <b-table :data="statistics"> <template slot-scope="props"> <b-table-column :label="'Изменение'|gettext"><span v-if="props.row.website_domain">{{ props.row.website_domain }}</span><span class="has-text-grey" v-else>{{'Пусто'|gettext}}</span></b-table-column> <b-table-column :label="'Количество'|gettext" numeric>{{ props.row.amount|number }}</b-table-column> </template> <template slot="empty"> <div class="has-text-grey-light has-text-centered">{{'Список пуст'|gettext}}</div> </template> </b-table> </section> <footer class="modal-card-foot"> <button class="button is-dark" type="button" @click="$parent.close()">{{'Закрыть'|gettext}}</button> </footer> <b-loading :is-full-page="false" :active.sync="isFetching"></b-loading> </div>`});

window.$app.defineComponent("manager", "vue-manager-statistics-list", {data() {
			return {
				isFetching: false,
				perPage: 50,
				period: 'month',
				segment: 'day',
				is_allow_payments: false
			}
		},
		
		mixins: [ListModel],

		created() {
			this.fetchData(true);
		},
		
		watch: {
			period() {
				this.clearPages();
				this.fetchData(true, true);
			},
			
			segment() {
				this.clearPages();
				this.fetchData(true, true);
			}
		},

		methods: {
			showInstalled(date) {
				this.$form('vue-manager-statistics-history', {date: date, target: 'install'}, this);
			},
			
			showUninstalled(date) {
				this.$form('vue-manager-statistics-history', {date: date, target: 'uninstall'}, this);
			},
			
			fetchData(withLoading, force) {
				let resolve = (data) => {
					this.fields = data.fields
					this.is_allow_payments = data.is_allow_payments;
					this.isFetching = false;
				}

				if (force || !this.checkCache(resolve)) {				
					this.isFetching = withLoading;
					
					this.$api.post('manager/statistics/list', {next: this.next, count: this.perPage, period: this.period, segment: this.segment}).then((data) => {
						this.cachePage(data.response.statistics, resolve);
					}).catch((error) => {
	                    this.fields = []
	                    this.total = 0
	                    this.isFetching = false
	                    throw error
	                })
				}
			}
		}, template: `<div> <div class="container has-mb-2 has-mt-2"> <div class="row"> <div class="col-sm-5 col-md-4 col-xs-12 has-xs-mb-2"> <b-field class="has-tabs-style"> <b-radio-button v-model="period" type="active" class="is-expanded" native-value="month">{{'Месяц'|gettext}}</b-radio-button> <b-radio-button v-model="period" type="active" class="is-expanded" native-value="quarter">{{'Квартал'|gettext}}</b-radio-button> <b-radio-button v-model="period" type="active" class="is-expanded" native-value="year">{{'Год'|gettext}}</b-radio-button> <b-radio-button v-model="period" type="active" class="is-expanded" native-value="all">{{'Все'|gettext}}</b-radio-button> </b-field> </div> <div class="col-sm-5 col-sm-offset-2 col-md-offset-3 col-lg-3 col-lg-offset-5 has-mb-2 col-xs-12"> <b-field class="has-tabs-style"> <b-radio-button v-model="segment" type="active" class="is-expanded" native-value="day">{{'По дням'|gettext}}</b-radio-button> <b-radio-button v-model="segment" type="active" class="is-expanded" native-value="month">{{'По месяцам'|gettext}}</b-radio-button> <b-radio-button v-model="segment" type="active" class="is-expanded" native-value="year">{{'По годам'|gettext}}</b-radio-button> </b-field> </div> </div> <b-table paginated backend-pagination pagination-simple bordered :data="fields" :loading="isFetching" :per-page="perPage" :total="total" @page-change="onPageChange"> <template slot-scope="props"> <b-table-column :label="'Дата'|gettext" class="has-width-10">{{ props.row.tms }}</b-table-column> <b-table-column :label="'Регистрации'|gettext" class="has-width-5" numeric>{{ props.row.amount|number }}</b-table-column> <b-table-column :label="'Установили'|gettext" class="has-width-10" numeric><div><span class="is-pulled-left has-text-grey-light has-mr-1">{{ props.row.amount_install_once/props.row.amount*100|decimal }}%</span> {{ props.row.amount_install_once|number }}</div></b-table-column> <b-table-column :label="'Убрали'|gettext" class="has-width-10" numeric><div><span class="is-pulled-left has-text-grey-light has-mr-1">{{ (props.row.amount_install_once - props.row.amount_install)/props.row.amount_install_once*100|decimal }}%</span>{{ props.row.amount_install_once - props.row.amount_install|number }}</div></b-table-column> <b-table-column :label="'Установки всего'|gettext" class="has-width-15" numeric><div><span class="is-pulled-left has-text-grey has-mr-2-mobile">{{ props.row.is_installed_followers|number }}</span><a @click="showInstalled(props.row.tms)" v-if="segment == 'day'">{{ props.row.is_installed|number }}</a><span v-else>{{ props.row.is_installed|number }}</span></div></b-table-column> <b-table-column :label="'Удаления всего'|gettext" class="has-width-15" numeric><div><span class="is-pulled-left has-text-grey has-mr-2-mobile">{{ props.row.is_uninstalled_followers|number }}</span><a @click="showUninstalled(props.row.tms)" v-if="segment == 'day'">{{ props.row.is_uninstalled|number }}</a><span v-else>{{ props.row.is_uninstalled|number }}</span></div></b-table-column> <b-table-column :label="'Рост'|gettext" numeric class="has-width-15" :class="{'has-text-success': props.row.is_installed - props.row.is_uninstalled> 0, 'has-text-danger': props.row.is_installed - props.row.is_uninstalled < 0}"><div><span class="is-pulled-left has-mr-2-mobile" :class="{'has-text-danger': props.row.is_installed_followers < props.row.is_uninstalled_followers, 'has-text-grey': props.row.is_installed_followers>= props.row.is_uninstalled_followers}">{{ props.row.is_installed_followers - props.row.is_uninstalled_followers|number }}</span>{{ props.row.is_installed - props.row.is_uninstalled|number }}</div></b-table-column> <b-table-column :label="'Оплаты'|gettext" numeric v-if="is_allow_payments"> <span> <span v-for="v in props.row.budget" class='table-price'> {{ v.budget|number }}<span class="has-text-grey-light"> {{v.currency_title}}</span> </span> </span> </b-table-column> </template> <template slot="empty"> <section class="has-mb-4 has-mt-4 content has-text-grey has-text-centered" v-if="!isFetching"> <p><b-icon icon="frown" size="is-large"></b-icon></p> <p>{{'Пока ничего нет'|gettext}}</p> </section> <section class="has-mb-4 has-mt-4 content has-text-grey has-text-centered" v-if="isFetching"> <p>{{'Загрузка данных'|gettext}}</p> </section> </template> </b-table> </div> </div>`});

window.$app.defineComponent("manager", "vue-manager-withdrawal-form", {data() {
			return {
				isUpdating: false,
				isFetching: false,
				values: {},
			}
		},

		created() {
			if (this.withdrawal_id) this.fetchData(true);
		},

		props: ['withdrawal_id'],
		mixins: [FormModel],

		methods: {
			fetchData(withLoading) {
				this.isFetching = withLoading;
				this.$api.get('manager/withdrawal/get', {withdrawal_id: this.withdrawal_id}).then((data) => {
					this.isFetching = false;
					this.values = data.response.withdrawal.values;
				});
			},
			
			send() {
				this.isUpdating = true;
				this.$api.get('manager/withdrawal/send', {withdrawal_id: this.withdrawal_id}, this).then((data) => {
					this.isUpdating = false;
					
					if (data.result == 'success') {
						this.$parent.close();
					}
				});
			}
			
/*
			doRefund() {
				this.$confirm(this.values.receipt?this.$gettext('Для того, чтобы отменить операцию вам необходимо сделать возврат денежных средств клиенту. После нажатия кнопки "Ок" данные о возврате уйдут в ФНС. Вы уже сделали возврат?'):this.$gettext('Аннулировать оплату?'), 'is-warning').then(() => {
					this.isRefunding = true;
                    this.$api.post('manager/payments/refund', {order_id: this.order_id, receipt: this.values.receipt, budget: this.total_refund}, this).then((data) => {
	                   	if (data.result == 'success') {
					   		this.isRefunding = false;
							this.currentTab = 'common';
							this.fetchData(true);
						}
					});
				});
			}
*/
		}, template: `<div class="modal-card"> <header class="modal-card-head"> <p class="modal-card-title">Вывод</p> <button class="modal-close is-large" @click="$parent.close()"></button> </header> <section class="modal-card-body"> <label class="label">Сумма:</label> <div class="field has-addons"> <div class="control is-expanded"> <number type="text" class="input" disabled="on" :value="values.total" :precision="$account.currency.precision"></number> </div> <p class="control"><span class="button is-static">{{values.currency_title}}</span></p> </div> <div class="hr has-mb-3" v-if="!values.is_completed && values.payouts.length> 1"></div> <div class="field has-addons" v-for="f in values.payouts" v-if="!values.is_completed && values.payouts.length> 1"> <div class="control is-expanded"> <number type="text" class="input" disabled="on" :value="f.budget" :precision="$account.currency.precision"></number> </div> <p class="control"><span class="button is-static">{{values.currency_title}}</span></p> </div> <div class="field"> <label class="label">{{values.method}}</label> <input type="text" class="input" disabled="on" :value="values.purpose"> </div> <button class="button is-primary" @click="send" :class="{'is-loading': isUpdating}" :disabled="values.is_completed == 1">Отправить</button> </section> <footer class="modal-card-foot"> <button class="button is-dark" type="button" @click="$parent.close()">{{'Закрыть'|gettext}}</button> </footer> <b-loading :is-full-page="false" :active.sync="isFetching"></b-loading> </div>`});

window.$app.defineComponent("manager", "vue-manager-withdrawal-list", {data: () => {
			return {
				list: [],
				permissions: {},
                total: 0,
                perPage: 100,
				isFetching: false
			}
		},
		
		mixins: [ListModel],
		
		created: function () {
			this.$io.on('events:manager.withdrawal:refresh', this.refresh);
			this.fetchData();
		},
		
		destroyed() {
			this.$io.off('events:manager.withdrawal:refresh', this.refresh);
		},

		methods: {
			refresh() {
				this.next = null;
				this.fetchData(true);
			},
			
			onPageChange(page) {
                this.page = page
                this.fetchData(true, false);
            },
            
            fetchData(force) {
				this.isFeaching = true;
				
				let resolve = (data) => {
					this.list = data.fields;
				}
				
				if (force || !this.checkCache(resolve)) {
					this.$api.get('manager/withdrawal/list', {next: this.next}).then((data) => {
						this.cachePage(data.response.withdrawal, resolve);						
						this.isFeaching = false;
					}).catch((error) => {
	                    this.list = []
	                    this.total = 0
	                    this.isFeaching = false
	                    throw error
	                })
                };
			},
			
            clickRow(row) {
	            this.$form('vue-manager-withdrawal-form', {withdrawal_id: row.withdrawal_id}, this);
            }
		}, template: `<div class="container"> <div class="has-mb-2 has-mt-3"> <b-table paginated backend-pagination pagination-simple :data="list" :loading="isFetching" class="has-mb-4" :per-page="perPage" :total="total" @page-change="onPageChange" @click="clickRow" hoverable> <template slot-scope="props"> <b-table-column field="email" label="Аккаунт">{{props.row.email}}</b-table-column> <b-table-column field="is_complete" label="Статус"><div class="tag" v-if="props.row.is_complete" style="color: #ffffff;background: #5cb85c;">Выполнена</div><div class="tag" v-else style="color: #ffffff;background: #337ab7;">Новая</div></b-table-column> <b-table-column label="Метод">{{props.row.method}}</b-table-column> <b-table-column field="budget" label="Бюджет" numeric>{{props.row.budget|currency(props.row.currency_title)}}</b-table-column> </template> </b-table> </div> </div>`});
window.$app.defineModule("manager", [{ path: 'profiles/', component: 'vue-manager-profiles-list', meta: {title: 'Профили', endpoint: 'manager/profiles/list'}, props: true, name: 'manager.profiles'},
{ path: 'statistics/', component: 'vue-manager-statistics-list', meta: {title: 'Статистика', endpoint: 'manager/statistics/list'}, props: true, name: 'manager.statistics'},
{ path: 'payments/', component: 'vue-manager-payments-list', meta: {title: 'Оплаты', endpoint: 'manager/payments/list'}, props: true, name: 'manager.payments'},
{ path: 'partners/', component: 'vue-manager-partners-list', meta: {title: 'Партнеры', endpoint: 'manager/partners/list'}, props: true, name: 'manager.partners'},
{ path: 'withdrawal/', component: 'vue-manager-withdrawal-list', meta: {title: 'Выплаты', endpoint: 'manager/withdrawal/list'}, props: true, name: 'manager.withdrawal'},
{ path: 'locales/', component: 'vue-manager-locales-index', meta: {title: 'Языки', endpoint: 'manager/locales/get'}, props: true, name: 'manager.locales.index', children: [
	{ path: ':current/', component: 'vue-manager-locales', name: 'manager.locales', props: true}
]},
{ path: 'currency/', component: 'vue-manager-currency', meta: {title: 'Валюта', endpoint: 'manager/currency/get'}, props: true, name: 'manager.currency'},
{ path: 'locking/', component: 'vue-manager-locking-list', meta: {title: 'Блокировка', endpoint: 'manager/locking/list'}, props: true, name: 'manager.locking'},
{ path: 'rangings/', component: 'vue-manager-rangings', meta: {title: 'Классификация', endpoint: 'manager/rangings/get'}, props: true, name: 'manager.rangings'},
{ path: 'questions/', component: 'vue-manager-questions-list', meta: {title: 'FAQ', endpoint: 'manager/questions/list'}, props: true, name: 'manager.questions'},
{ path: 'blog/', component: 'vue-manager-blog-list', meta: {title: 'Блог', endpoint: 'manager/blog/list'}, props: true, name: 'manager.blog'},
{ path: 'guides/', component: 'vue-manager-guides-list', meta: {title: 'Инструкции', endpoint: 'manager/guides/list'}, props: true, name: 'manager.guides'},
{ path: 'logs/', component: 'vue-manager-logs-list', meta: {title: 'Логи', endpoint: 'manager/logs/list'}, props: true, name: 'manager.logs'}]);