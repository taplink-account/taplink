
window.$app.defineComponent("auth", "vue-auth-attach", {data() {
			return {
				state: ''
			}
		}, template: `<section class="hero is-fullheight is-fullscreen is-auth-hero has-background-white"> <div class="signin-header"> <a :href="'{1}/'|format(window.base_path_prefix)" class="signin-header-logo"></a> <router-link class="button" :to="{name: 'signin'}">{{'Авторизация'|gettext}}</router-link> </div> <div class="hero-body has-p-1"> <div style="width: 550px;margin: 0 auto" class="has-p-3"> <div> <h1 class="has-mb-6 has-xs-mb-4 has-text-centered" style="font-size: 2.5rem;font-weight: bold;letter-spacing:-.06rem;">{{'Подключить Instagram профиль'|gettext}}</h1> <div class="message is-success"> <div class="message-body"> {{'Для подключения Instagram профиля вам необходимо авторизоваться через Instagram'|gettext}} </div> </div> <a type="button"class="button is-medium is-fullwidth is-light" :class="{'disabled': state== 'logging', 'is-loading': state== 'instagram'}" :href="'{1}/login/instagrambasic/'|format(window.base_path_prefix)" @click="state = 'instagram'"><i class="fab fa-ig"></i><span class="is-hidden-mobile has-ml-1">{{'Подключить через Instagram'|gettext}}</span></a> </div> <div class="row has-mt-3"> <div class="col-xs-12 col-sm"><div class="has-text-left has-text-grey has-text-centered-mobile has-xs-mb-2">{{'Вернуться на'|gettext}} <router-link :to="{name: 'signin'}">{{'страницу входа'|gettext}}</router-link></div></div> <div class="col-xs col-sm-shrink has-text-right has-text-centered-mobile"> <vue-component-locale-change></vue-component-locale-change> </div> </div> </div> </div> </section>`});

window.$app.defineComponent("auth", "vue-auth-email", {data() {
			return {
				isLoading: false,
				state: '',
				email: '',
				code: ''
			}
		},
		
		mixins: [FormModel],
		
		computed: {
			terms() {
				return this.$gettext('Нажимая на кнопку "Продолжить" я подтверждаю что ознакомлен и согласен с условиями <a %s>договора-оферты</a>').replace('%s', 'href="'+window.base_path_prefix+'/about/terms.html" target="_blank"');
			}
		},

		created() {
			this.toPage();
			
			if (this.profile_id == undefined) {
				window.$events.one('account:refresh', this.toPage);
			}
		},

		methods: {
			submit() {
				this.isLoading = true;
				
				switch (this.state) {
					case '':
						this.$api.post('auth/email/set', {email: this.email}, this).then((data) => {
							switch (data.result) {
								case 'found':
									this.state = 'found';
									break;
								case 'success':
									return this.updateProfile(data.response.account);
									break;
								default:
									break;
							}
							
							this.isLoading = false;
						});
						break;
					case 'found':
						this.$api.post('auth/email/send', {email: this.email}, this).then((data) => {
							if (data.result == 'success') {
								this.state = 'sent';
								this.$nextTick(() => {
									this.$refs.verify_input.focus();
								})
							}
							this.isLoading = false;
						});
						break;
					case 'sent':
						this.$api.post('auth/email/check', {email: this.email, code: this.code}, this).then((data) => {
							if (data.result == 'success') {
								this.updateProfile(data.response.account);
							} else {
								this.isLoading = false;
							}
						});
						break;
				}
			},
			
			toPage() {
				if (this.$account.profile_id && this.$account.user.email) {
					this.$router.replace({name: 'pages', params: {page_id: this.$account.page_id}});
				}
			},
			
			updateProfile(account) {
				this.$auth.refresh(account, () => {
					this.toPage();
				});
			}
		}, template: `<section class="hero is-fullheight is-fullscreen is-auth-hero"> <div class="hero-body has-p-1"> <div class="col-xs-12 col-sm-8 col-sm-offset-2 col-lg-4 col-lg-offset-4 has-text-centered"> <a :href="'{1}/'|format(window.base_path_prefix)"><img src="/s/i/logo/title-logo-grey.png?2" style="width:150px;height:36px;margin-bottom: 2rem" alt="Taplink"></a> <div style="background:#fff;background: var(--background-white-color);border-radius: 4px;border-top: 1px solid #0383de;border-color: var(--link-color);"> <div class="has-p-3"> <h4 class="has-mb-3">{{'Пожалуйста укажите вашу электронную почту'|gettext}}</h4> <div class="message is-warning" v-if="state == 'found'"> <div class="message-body"> {{'Ранее вы уже создали аккаунт с данной электронной почтой. Подтвердите владение аккаунтом введя проверочный код, отправленный на вашу почту'|gettext}} </div> </div> <div class="message is-success" v-if="state == 'sent'"> <div class="message-body"> {{'Мы отправили проверочный код на вашу электронную почту. Введите его и нажмите кнопку "Продолжить"'|gettext}} </div> </div> <form @submit.prevent="submit"> <b-field :class="{'has-error': errors.email}" :message="errors.email"> <input :placeholder="'Электронная почта'|gettext" type="email" v-model="email" class="input is-medium" :class="{'disabled': isLoading || state != ''}" autofocus="on"></input> </b-field> <b-field :class="{'has-error': errors.code}" :message="errors.code" v-if="state == 'sent'"> <input :placeholder="'Проверочный код'|gettext" type="text" maxlength="6" v-model="code" class="input is-medium" :class="{'disabled': isLoading}" autofocus="on" ref="verify_input"></input> </b-field> <div class="row row-small" v-if="state == 'found' || state== 'sent'"> <div class="col-xs-12 col-sm-5 last-xs"> <button type="button" class="button is-medium is-fullwidth is-text has-text-no-underline" :class="{'disabled': isLoading}" @click="state = ''">{{'Другая почта'|gettext}}</button> </div> <div class="col-xs-12 col-sm-7 last-sm has-xs-mb-2"> <button type="submit" class="button is-medium is-primary is-fullwidth" :class="{'is-loading': isLoading}"><span v-if="state == 'found'">{{'Отправить проверочный код'|gettext}}</span><span v-else>{{'Продолжить'|gettext}}</span></button> </div> </div> <button v-else type="submit" class="button is-primary is-medium is-fullwidth" :class="{'is-loading': isLoading}">{{'Продолжить'|gettext}}</button> </form> <div class="has-text-grey-light has-mt-3" v-if="state == ''"> <span v-html="terms"></span> </div> </div> </div> <div class="level has-mt-2"> <div class="level-left"></div> <div class="level-right"> <vue-component-locale-change></vue-component-locale-change> </div> </div> </div> </div> </section>`});

window.$app.defineComponent("auth", "vue-auth-restore", {data() {
			return {
				isLoading: false,
				username: '',
				email: '',
				code: '',
				password1: '',
				password2: '',
				state: 0,
				message: ''
			}
		},
		
		mixins: [FormModel],

		methods: {
			submit() {
				this.isLoading = true;
				
				this.$api.post('auth/email/restore', {username: this.username, email: this.email, code: this.code, password1: this.password1, password2: this.password2, state: this.state}, this).then((data) => {
					if (data.result == 'success') {
						if (data.response.values != undefined) {
							this.state = data.response.values.state;
							this.email = data.response.values.email;
							this.message = data.response.values.message;
						}
						
						switch (this.state) {
							case 2:
								this.state = 3;
								this.$nextTick(() => {
									this.$refs.verify_input.focus();
								});
								break;
							case 3:
								this.state = 4;
								this.$nextTick(() => {
									this.$refs.password.focus();
								});
								break;
							case 4:
								return this.$auth.refresh(data.response.account, () => {
									this.$router.replace({name: 'pages', params: {page_id: this.$account.page_id}});
								});
								break;
						}
						
					}
					this.isLoading = false;
				});
			}
		}, template: `<section class="hero is-fullheight is-fullscreen is-auth-hero has-background-white"> <div class="signin-header"> <a :href="'{1}/'|format(window.base_path_prefix)" class="signin-header-logo"></a> <router-link class="button" :to="{name: 'signin'}">{{'Авторизация'|gettext}}</router-link> </div> <div class="hero-body has-p-1"> <div style="width: 550px;margin: 0 auto" class="has-p-3"> <div> <h1 class="has-mb-6 has-xs-mb-4 has-text-centered" style="font-size: 2.5rem;font-weight: bold;letter-spacing:-.06rem;">{{'Восстановление доступа'|gettext}}</h1> <div class="message is-success" v-if="state == 1"> <div class="message-body" v-html="message"></div> </div> <div class="message is-success" v-if="state == 3"> <div class="message-body"> {{'Мы отправили проверочный код на вашу электронную почту. Введите его и нажмите кнопку "Продолжить"'|gettext}} </div> </div> <form @submit.prevent="submit" class="has-mb-2"> <b-field :class="{'has-error': errors.username}" :message="errors.username" v-if="state == 0 || state== 1"> <input :placeholder="'Электронная почта или имя профиля Instagram'|gettext" type="text" v-model="username" class="input is-medium" :class="{'disabled': isLoading || state> 0}" autofocus="on"></input> </b-field> <b-field :class="{'has-error': errors.email}" :message="errors.email" v-if="state> 0"> <input :placeholder="'Электронная почта'|gettext" type="text" v-model="email" class="input is-medium" :class="{'disabled': isLoading || state> 1}" autofocus="on"></input> </b-field> <b-field :class="{'has-error': errors.code}" :message="errors.code" v-if="state> 2"> <input :placeholder="'Проверочный код'|gettext" type="text" maxlength="6" v-model="code" class="input is-medium" :class="{'disabled': isLoading || state> 3}" autofocus="on" ref="verify_input"></input> </b-field> <b-field :class="{'has-error': errors.code}" :message="errors.code" v-if="state> 3"> <input :placeholder="'Новый пароль'|gettext" type="password" minlength="6" maxlength="40" v-model="password1" class="input is-medium" :class="{'disabled': isLoading}" autofocus="on" ref="password"></input> </b-field> <b-field :class="{'has-error': errors.code}" :message="errors.code" v-if="state> 3"> <input :placeholder="'Повторите новый пароль'|gettext" type="password" minlength="6" maxlength="40" v-model="password2" class="input is-medium" :class="{'disabled': isLoading}"></input> </b-field> <button type="submit" class="button is-primary is-medium is-fullwidth" :class="{'is-loading': isLoading}">{{'Продолжить'|gettext}}</button> </form> </div> <div class="row has-mt-3"> <div class="col-xs-12 col-sm"><div class="has-text-left has-text-grey has-text-centered-mobile has-xs-mb-2">{{'Вернуться на'|gettext}} <router-link :to="{name: 'signin'}">{{'страницу входа'|gettext}}</router-link></div></div> <div class="col-xs col-sm-shrink has-text-right has-text-centered-mobile"> <vue-component-locale-change></vue-component-locale-change> </div> </div> </div> </div> </section>`});

window.$app.defineComponent("auth", "vue-auth-signin", {data() {
			return {
				email: '',
				password: '',
				state: '',
				tab: 'login',
				confirm: true,
				code: '',
				alert: false
			}
		},
		
		mixins: [FormModel],

		created() {
			this.toPage();
			
/*
			if (this.profile_id == undefined) {
				window.$events.one('account:refresh', this.toPage);
			}
*/
		},

		computed: {
			terms() {
				return this.$gettext('Нажимая на кнопку "Продолжить" я подтверждаю что ознакомлен и согласен с условиями <a %s>договора-оферты</a>').replace('%s', 'href="'+window.base_path_prefix+'/about/terms.html" target="_blank"');
			},
			localeRu() {
				return window.i18n.locale == 'ru';
			}	
		},
		
		methods: {
			changeTab(v) {
				this.tab = v;
				this.state = '';
				this.code = '';
				this.alert = false;
			},
			
			chooseState(v) {
				this.state = v;
				setTimeout(() => {
					this.state = '';
				}, 1250);
			},
			
			toPage() {
				if (this.$account.profile_id) {
					if (this.$account.user.email) {
						let location = Cookies.get('auth-redirect');
						if (location) {
							document.location = location;
							Cookies.remove('auth-redirect');
						} else {
							this.$router.replace({name: 'pages', params: {page_id: this.$account.page_id}});
						}
					} else {
						this.$router.replace({name: 'email'});
					}
				}
			},
			
			signup() {
				this.state = (['check', 'sent'].indexOf(this.state) != -1)?'check':'signup';
				this.$api.post('auth/signup', {email: this.email, password: this.password, code: this.code, state: this.state}, this).then((data) => {
					if (data.result == 'success') {
						if (data.response.account != undefined) {
							this.$auth.refresh(data.response.account);
							this.toPage();
						} else {
							this.state = data.response.values.state;
							this.$nextTick(() => {
								this.$refs.verify_input.focus();
							})
						}
					} else {
						this.state = (['check', 'sent'].indexOf(this.state) != -1)?'sent':'';
					}
				});
			},
			
			login() {
				this.state = 'signin';

				this.$api.post('auth/login', {email: this.email, password: this.password}, this).then((data) => {
					if (data.result == 'success') {
						this.$auth.refresh(data.response.account);
						this.toPage();
					} else {
						this.state = '';
					}
				}).catch(() => {
					this.state = '';
				});
			}
		}, template: `<section class="hero is-fullheight is-fullscreen is-auth-hero has-background-white"> <div class="signin-header"> <a :href="'{1}/'|format(window.base_path_prefix)" class="signin-header-logo"></a> <a class="button" @click="changeTab('signin')" v-if="tab == 'login'">{{'Регистрация'|gettext}}</a> <a class="button" @click="changeTab('login')" v-if="tab == 'signin'">{{'Авторизация'|gettext}}</a> </div> <div class="hero-body has-p-1"> <div style="width: 550px;margin: 0 auto" class="has-p-3"> <div v-if="tab == 'login'"> <h1 class="has-mb-6 has-xs-mb-4 has-text-centered" style="font-size: 2.5rem;font-weight: bold;letter-spacing:-.06rem;">{{'Авторизация'|gettext}}</h1> </div> <div v-if="tab == 'signin'"> <h1 class="has-mb-6 has-xs-mb-4 has-text-centered" style="font-size: 2.5rem;font-weight: bold;letter-spacing:-.06rem;">{{'Регистрация'|gettext}}</h1> </div> <div v-if="alert"> <div class="message is-warning"> <div class="message-body"> <h4 style="font-weight: 600">{{'Внимание'|gettext}}</h4> {{'С 31 марта 2020 года авторизация через Instagram больше не доступна. Вам нужно будет использовать другую социальную сеть для авторизации. После этого вы сможете подключить свой профиль Instagram к своей странице'|gettext}} </div> </div> <div class="row row-small has-mb-4" v-if="state != 'sent' && state != 'check'"> <div class="col-xs"> <a type="button" class="button is-medium is-fullwidth is-light" :class="{'disabled': state && state != 'facebook', 'is-loading': state== 'facebook'}" :href="'{1}/login/facebook/'|format(window.base_path_prefix)" @click="chooseState('facebook')"><i class="fab fa-fb-o"></i><span class="is-hidden-mobile has-ml-1">Facebook</span></a> </div> <div class="col-xs"> <a type="button" class="button is-medium is-fullwidth is-light" :class="{'disabled': state && state != 'google', 'is-loading': state== 'google'}" :href="'{1}/login/google/'|format(window.base_path_prefix)" @click="chooseState('google')"><i class="fab fa-g"></i><span class="is-hidden-mobile has-ml-1">Google</span></a> </div> <div class="col-xs" v-if="localeRu"> <a type="button" class="button is-medium is-fullwidth is-light" :class="{'disabled': state && state != 'vkontakte', 'is-loading': state== 'vkontakte'}" :href="'{1}/login/vkontakte/'|format(window.base_path_prefix)" @click="chooseState('vkontakte')"><i class="fab fa-vk" style="font-size: 1.9rem"></i><span class="is-hidden-mobile has-ml-1">ВКонтакте</span></a> </div> </div> <a class="has-text-black" @click="alert = false"><h4 class="has-text-centered"><i class="fal fa-long-arrow-left has-mr-2"></i> {{'Назад'|gettext}}</h4></a> </div> <div v-if="!alert"> <div class="row row-small" v-if="state != 'sent' && state != 'check'"> <div class="col-xs col-sm-4"> <a type="button" class="button is-medium is-fullwidth is-light" :class="{'disabled': state && state != 'instagram', 'is-loading': state== 'instagram'}" :href="'{1}/login/instagram/'|format(window.base_path_prefix)" @click="chooseState('instagram')"><i class="fab fa-ig"></i><span class="is-hidden-mobile has-ml-1">instagram</span></a> </div> <div class="col-xs"> <a type="button" class="button is-medium is-fullwidth is-light" :class="{'disabled': state && state != 'facebook', 'is-loading': state== 'facebook'}" :href="'{1}/login/facebook/'|format(window.base_path_prefix)" @click="chooseState('facebook')"><i class="fab fa-fb-o"></i></a> </div> <div class="col-xs"> <a type="button" class="button is-medium is-fullwidth is-light" :class="{'disabled': state && state != 'google', 'is-loading': state== 'google'}" :href="'{1}/login/google/'|format(window.base_path_prefix)" @click="chooseState('google')"><i class="fab fa-g"></i></a> </div> <div class="col-xs" v-if="localeRu"> <a type="button" class="button is-medium is-fullwidth is-light" :class="{'disabled': state && state != 'vkontakte', 'is-loading': state== 'vkontakte'}" :href="'{1}/login/vkontakte/'|format(window.base_path_prefix)" @click="chooseState('vkontakte')"><i class="fab fa-vk" style="font-size: 1.9rem"></i></a> </div> </div> <div v-if="state != 'sent' && state != 'check'" class="hr has-mb-5 has-mt-6 has-xs-mt-4 has-xs-mb-3 has-text-centered" :data-title="'Или'|gettext"></div> <form @submit.prevent="login" v-if="tab == 'login'"> <b-field :label="'Электронная почта'|gettext"> <b-input type="email" v-model="email" size="is-medium" :class="{'disabled': state != ''}" autofocus="on" tabindex="1"></b-input> </b-field> <div class="has-mb-4"> <div class="row has-mb-1"> <div class="col-xs"><label class="label">{{'Пароль'|gettext}}</label></div> <div class="col-xs has-text-right"><router-link :to="{name: 'restore'}" :class="{'disabled': state != ''}">{{'Восстановить доступ'|gettext}}</router-link></div> </div> <b-input type="password" v-model="password" size="is-medium" :class="{'disabled': state != ''}" tabindex="2"></b-input> </div> <button type="submit" class="button is-primary is-medium is-fullwidth" :class="{'is-loading': state== 'signin', 'disabled': state== 'instagram'}">{{'Войти'|gettext}}</button> </form> <div v-if="tab == 'signin'"> <form @submit.prevent="signup"> <div class="message is-success" v-if="state == 'sent' || state== 'check'"> <div class="message-body"> {{'Мы отправили проверочный код на вашу электронную почту. Введите его и нажмите кнопку "Продолжить"'|gettext}} </div> </div> <b-field :label="'Электронная почта'|gettext" :class="{'has-error': errors.email}" :message="errors.email"> <b-input type="email" v-model="email" size="is-medium" :class="{'disabled': state != ''}" autofocus="on"></b-input> </b-field> <b-field :class="{'has-error': errors.code}" :message="errors.code" v-if="state == 'sent' || state== 'check'"> <input :placeholder="'Проверочный код'|gettext" type="text" maxlength="6" v-model="code" class="input is-medium" :class="{'disabled': state== 'check'}" autofocus="on" ref="verify_input"></input> </b-field> <div class="field" v-if="state != 'sent' && state != 'check'"> <label class="checkbox"><input type="checkbox" v-model="confirm"><span v-html="terms"></span></label> </div> <button type="submit" class="button is-primary is-medium is-fullwidth" :class="{'is-loading': state== 'signup' || state== 'check', 'disabled': state== 'instagram'}" :disabled="!confirm">{{'Продолжить'|gettext}}</button> </form> </div> <div class="row has-mt-3"> <div class="col-xs is-hidden-mobile" v-if="tab == 'login'">{{'Нет аккаунта?'|gettext}} <a @click="changeTab('signin')">{{'Регистрация'|gettext}}</a></div> <div class="col-xs is-hidden-mobile" v-if="tab == 'signin'">{{'Есть аккаунт?'|gettext}} <a @click="changeTab('login')">{{'Авторизация'|gettext}}</a></div> <div class="col-xs col-sm-shrink has-text-centered"> <vue-component-locale-change></vue-component-locale-change> </div> </div> </div> </div> </div> </section>`});
window.$app.defineModule("auth", []);