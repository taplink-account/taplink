
window.$app.defineComponent("addons", "vue-addons-addon-agreement", {props: ['values', 'variants', 'addon_id', 'isInstalling', 'currentTab'],
		mixins: [FormModel], template: `<section class="modal-card-body modal-card-body-blocks"> <section class="content" v-if="currentTab == 'description'"> <slot name="allow"></slot> <div class="field">{{'С помощью модуля "Юридическая Информация" вы можете добавить блок с юридической информацией к каждой форме при сборе контактных данных'|gettext}}</div> </section> <section class="content" v-if="currentTab == 'options'"> <b-field :label="'Сообщение'|gettext" :message="errors.text" :class="{'has-error': errors.text}"> <input type="text" class="input" v-model="values.options.text"> </b-field> <b-field :label="'Текст документа'|gettext" :message="errors.body" :class="{'has-error': errors.body}"> <vue-component-editor v-model="values.options.body"></vue-component-editor> </b-field> </section> </section>`});

window.$app.defineComponent("addons", "vue-addons-addon-amocrm-entry", {props: ['addons', 'addon', 'options', 'variants'],
		mixins: [FormModel], template: `<div> <b-field :label="'Добавить метки'|gettext"> <b-taginput v-model="options.tags" attached confirm-key-codes='[13]'></b-taginput> </b-field> </div>`});

window.$app.defineComponent("addons", "vue-addons-addon-amocrm", {props: ['values', 'variants', 'addon_id', 'isInstalling', 'currentTab', 'isStep'],
		mixins: [FormModel],
		
		data() {
			return {
				domains: ['amocrm.ru', 'amocrm.com']
			}
		},
		
		created() {
			this.$parent.setStep(true);
		},
		
		watch: {
			values() {
				this.$parent.setStep(this.values.options.pipeline?false:true);
			}
		},
			
		methods: {
			isSuccess() {
				console.log(2);
				console.log(this.values.external_id);
				this.$parent.setStep(this.values.external_id);
				return this.values.options.pipeline;
			}
		}, template: `<section class="modal-card-body modal-card-body-blocks"> <section class="content" v-if="currentTab == 'description'"> <slot name="allow"></slot> <p>amoCRM – Система учета клиентов и сделок для отдела продаж.</p> <p>Данные с форм и магазина попадают в раздел "Заявки" вашего личного кабинета. Этот модуль поможет вести новых клиентов также и в сервисе amoCRM.</p> <p>Нет аккаунта? <a href='http://amocrm.ru/' target="_blank">Зарегистрировать</a></p> </section> <section v-if="currentTab == 'options'"> <div class="has-mb-2" v-if="!values.is_installed"> <div v-if="variants.pipelines"> <div class="message is-success" v-if="values.options.pipeline"><div class="message-body">Шаг 3 из 3. Выберите соответствие этапов сделок Taplink и amoCRM</div></div> <div class="message is-success" v-else><div class="message-body">Шаг 2 из 3. Укажите воронку</div></div> </div> <div class="message is-success" v-else><div class="message-body">Шаг 1 из 3. Укажите данные авторизации</div></div> </div> <div class="row"> <div class="col-xs-12 col-sm-6 has-xs-mb-3"> <vue-component-subdomain-field label="Адрес аккаунта" v-model="values.options.subdomain" :domain.sync="values.options.domain" :domains="domains" :error="errors.subdomain" :disabled="variants.pipelines"></vue-component-subdomain-field> <b-field label="Логин пользователя" :message="errors.login" :class="{'has-error': errors.login}"> <input type="text" class="input" v-model="values.options.login" placeholder="name@mail.ru" :disabled="variants.pipelines"> </b-field> <b-field label="API ключ пользователя" :message="errors.key" :class="{'has-error': errors.key}"> <input type="text" class="input" v-model="values.options.key" :disabled="variants.pipelines"> </b-field> <b-field label="Воронка" :message="errors.pipeline" :class="{'has-error': errors.pipeline}" v-if="variants.pipelines"> <b-select v-model="values.options.pipeline" expanded> <option :value="null">-- Не выбрано --</option> <option v-for="(p, pipeline_id) in variants.pipelines" :value="pipeline_id">{{ p.name }}</option> </b-select> </b-field> </div> <div class="col-xs-12 col-sm-6" v-if="variants.pipelines"> <b-field label="Уровень синхронизации"> <b-select v-model="values.options.mode" expanded> <option v-for="(m, k) in variants.mode" :value="k">{{ m }}</option> </b-select> </b-field> <b-field label="Новая заявка попадает"> <b-select v-model="values.options.target" expanded> <option v-for="(t, k) in variants.target" :value="k">{{ t }}</option> </b-select> </b-field> <div class="field"> <label class="label">Ответственный</label> <b-select v-model="values.options.responsible_user" expanded> <option :value="null">-- Не выбрано --</option> <option v-for="(user, id) in variants.users" :value="id">{{user}}</option> </b-select> </div> <b-field label="Добавить метки"> <b-taginput v-model="values.options.tags" attached confirm-key-codes='[13]'></b-taginput> </b-field> </div> </div> </section> <section v-if="(currentTab == 'options') && (variants.pipelines && values.options.pipeline)"> <div class="row"> <div class="col-xs-12 col-sm-6 has-mb-2"> <div class="field"> <label class="label">Этапы продаж</label> </div> <div class="field"> <div class="row"> <div class="col-xs-5 form-control-static">Новая</div> <div class="col-xs-7"> <div class="select is-fullwidth block-xs"> <b-select v-model="values.options.status[1]" expanded> <option :value="null">-- Не выбрано --</option> <option v-for="p in variants.pipelines[values.options.pipeline].statuses" :value="p.id">{{ p.name }}</option> </b-select> </div> </div> </div> </div> <div class="field"> <div class="row"> <div class="col-xs-5 form-control-static">В работе</div> <div class="col-xs-7"> <div class="select is-fullwidth block-xs"> <b-select v-model="values.options.status[2]" expanded> <option :value="null">-- Не выбрано --</option> <option v-for="p in variants.pipelines[values.options.pipeline].statuses" :value="p.id">{{ p.name }}</option> </b-select> </div> </div> </div> </div> <div class="field"> <div class="row"> <div class="col-xs-5 form-control-static">Выполнена</div> <div class="col-xs-7"> <div class="select is-fullwidth block-xs"> <b-select v-model="values.options.status[3]" expanded> <option :value="null">-- Не выбрано --</option> <option v-for="p in variants.pipelines[values.options.pipeline].statuses" :value="p.id">{{ p.name }}</option> </b-select> </div> </div> </div> </div> <div class="field"> <div class="row"> <div class="col-xs-5 form-control-static">Отменена</div> <div class="col-xs-7"> <div class="select is-fullwidth block-xs"> <b-select v-model="values.options.status[4]" expanded> <option :value="null">-- Не выбрано --</option> <option v-for="p in variants.pipelines[values.options.pipeline].statuses" :value="p.id">{{ p.name }}</option> </b-select> </div> </div> </div> </div> </div> <div class="col-xs-12 col-sm-6"> <div class="field"> <label class="label">Поля формы</label> </div> <div class="field"> <div class="row"> <div class="col-xs-5 form-control-static">Телефон</div> <div class="col-xs-7"> <div class="select is-fullwidth block-xs"> <b-select v-model="values.options.fields.phone" expanded> <option :value="null">-- Не выбрано --</option> <option v-for="(name, field_id) in variants.fields" :value="field_id">{{ name }}</option> </b-select> </div> </div> </div> </div> <div class="field"> <div class="row"> <div class="col-xs-5 form-control-static">Email</div> <div class="col-xs-7"> <div class="select is-fullwidth block-xs"> <b-select v-model="values.options.fields.email" expanded> <option :value="null">-- Не выбрано --</option> <option v-for="(name, field_id) in variants.fields" :value="field_id">{{ name }}</option> </b-select> </div> </div> </div> </div> </div> </div> </section> </section>`});

window.$app.defineComponent("addons", "vue-addons-addon-autoweboffice-entry", {props: ['addons', 'addon', 'options', 'variants'],
		mixins: [FormModel], template: `<div> <b-field :label="'Укажите товар'|gettext"> <b-select :placeholder="'-- Добавить поле --'|gettext" v-model="options.goods" expanded> <option value="">-- {{'Товар не выбран'|gettext}} --</option> <option v-for="(f, i) in variants.list" :value="i">{{ f }}</option> </b-select> </b-field> </div>`});

window.$app.defineComponent("addons", "vue-addons-addon-autoweboffice", {props: ['values', 'variants', 'addon_id', 'isInstalling', 'currentTab'],
		mixins: [FormModel], template: `<section class="modal-card-body modal-card-body-blocks"> <section class="content" v-if="currentTab == 'description'"> <slot name="allow"></slot> <p>АвтоВебОфис – Платформа для создания онлайн-школ и образовательных проектов. После подключения модуля откройте настройки необходимой формы и укажите товар в системе АвтоВебОфис.</p> <p>Нет аккаунта? <a href='http://autoweboffice.ru/' target="_blank">Зарегистрировать</a></p> </section> <section v-if="currentTab == 'options'"> <div class="row row-small has-mb-3"> <div class="col-xs-12 col-sm-6 has-mb-2-mobile"> <vue-component-subdomain-field label="Адрес аккаунта" v-model="values.options.subdomain" domain="autoweboffice.ru" :error="errors.subdomain"></vue-component-subdomain-field> </div> <div class="col-xs-12 col-sm-6"> <label class="label is-hidden-mobile">&nbsp;</label> <a target="_blank" :href="'https://{1}.autoweboffice.ru/shop/api'|format(values.options.subdomain)" class="button is-dark is-fullwidth-mobile" :disabled="values.options.subdomain.trim().length == 0"><i class="fa fa-external-link has-mr-1"></i> Получить API KEY</a> </div> </div> <div class="row"> <div class="col-xs-12 col-sm-6 has-xs-mb-3"> <b-field label="API KEY GET" :message="errors.key_get" :class="{'has-error': errors.key_get}"> <input type="text" class="input" v-model="values.options.key_get"> </b-field> <b-field label="API KEY SET для TAPLINK" :message="errors.key_set" :class="{'has-error': errors.key_set}"> <input type="text" class="input" v-model="values.options.key_set"> </b-field> </div> </div> </section> </section>`});

window.$app.defineComponent("addons", "vue-addons-addon-bitrix24", {props: ['values', 'variants', 'addon_id', 'isInstalling', 'currentTab'],
		mixins: [FormModel], template: `<section class="modal-card-body modal-card-body-blocks"> <section class="content" v-if="currentTab == 'description'"> <slot name="allow"></slot> <div class="field">Битрикс24 – Система учета клиентов и сделок.</div> <a href='https://bitrix24.ru/' target="_blank">Открыть веб-сайт</a> </section> <section class="content" v-if="currentTab == 'options'"> <div class="row"> <div class="col-xs-12 col-sm-6"> <b-field label="Адрес портала" :message="errors.domain" :class="{'has-error': errors.domain}"> <input type="text" class="input" v-model="values.options.domain"> </b-field> <b-field label="Уровень синхронизации"> <b-select v-model="values.options.mode" expanded> <option v-for="(m, k) in variants.mode" :value="k">{{ m }}</option> </b-select> </b-field> </div> </div> </section> </section>`});

window.$app.defineComponent("addons", "vue-addons-addon-cookiepolicy", {props: ['values', 'variants', 'addon_id', 'isInstalling', 'currentTab'],
		mixins: [FormModel], template: `<section class="modal-card-body modal-card-body-blocks"> <section class="content" v-if="currentTab == 'description'"> <slot name="allow"></slot> <div class="field">{{'С помощью модуля "Политика файлов cookie" вы можете добавить pop-up сообщение с уведомлением пользователей об использовании файлов cookie'|gettext}}</div> </section> <section class="content" v-if="currentTab == 'options'"> <b-field :label="'Сообщение'|gettext" :message="errors.text" :class="{'has-error': errors.text}"> <input type="text" class="input" v-model="values.options.text"> </b-field> <b-field :label="'Заголовок формы'|gettext" :message="errors.text" :class="{'has-error': errors.text}"> <input type="text" class="input" v-model="values.options.title"> </b-field> <b-field :label="'Текст документа'|gettext" :message="errors.body" :class="{'has-error': errors.body}"> <vue-component-editor v-model="values.options.body"></vue-component-editor> </b-field> </section> </section>`});

window.$app.defineComponent("addons", "vue-addons-addon-getcourse-entry", {props: ['addons', 'addon', 'options', 'variants'],
		mixins: [FormModel], template: `<div> <b-field :label="'Уникальный код предложения (В настройках предложения)'|gettext"> <input type='text' class="input" v-model='options.offer_code' placeholder="Код"> </b-field> <b-field :label="'Добавление пользователей в группы'|gettext"> <b-taginput v-model="options.groups" confirm-key-codes='[13]' placeholder="Укажите названия групп через запятую"attached></b-taginput> </b-field> </div>`});

window.$app.defineComponent("addons", "vue-addons-addon-getcourse", {props: ['values', 'variants', 'addon_id', 'isInstalling', 'currentTab'],
		mixins: [FormModel], template: `<section class="modal-card-body modal-card-body-blocks"> <section class="content" v-if="currentTab == 'description'"> <slot name="allow"></slot> <div class="field">GetCourse – это платформа для продажи и проведения обучения</div> <a href='https://getcourse.ru/' target="_blank">Открыть веб-сайт</a> </section> <section class="content" v-if="currentTab == 'options'"> <div class="row"> <div class="col-xs-12 col-sm-6 has-mb-2"> <vue-component-subdomain-field label="Адрес аккаунта" v-model="values.options.account_name" domain="getcourse.ru" :error="errors.account_name"></vue-component-subdomain-field> </div> <div class="col-xs-12 col-sm-6"> <b-field label="Секретный ключ для API" :message="errors.key" :class="{'has-error': errors.key}"> <b-field grouped> <p class="control is-expanded is-clearfix"> <input type="text" class="input" v-model="values.options.key"> </p> <p class="control"> <a target="_blank" :href="'https://{1}.getcourse.ru/saas/account/api'|format(values.options.account_name)" class="button is-dark" :disabled="values.options.account_name.trim().length == 0"><i class="fa fa-external-link has-mr-1"></i> Получить</a> </p> </b-field> </b-field> </div> </div> </section> </section>`});

window.$app.defineComponent("addons", "vue-addons-addon-getresponse-entry", {props: ['addons', 'addon', 'options', 'variants'],
		mixins: [FormModel], template: `<div> <div class="field"> <p>{{'Укажите списки рассылок для добавления контактов'|gettext}}</p> </div> <b-field :label="'Новая заявка'|gettext"> <b-select :placeholder="'-- Добавить поле --'|gettext" v-model="options.created" expanded> <option value="">{{'-- Рассылка не выбрана --'|gettext}}</option> <option v-for="(f, i) in variants.list" :value="i">{{ f }}</option> </b-select> </b-field> <b-field :label="'Успешная оплата'|gettext"> <b-select :placeholder="'-- Добавить поле --'|gettext" v-model="options.paid" expanded> <option value="">{{'-- Рассылка не выбрана --'|gettext}}</option> <option v-for="(f, i) in variants.list" :value="i">{{ f }}</option> </b-select> </b-field> </div>`});

window.$app.defineComponent("addons", "vue-addons-addon-getresponse", {data() {
			return {
				apis: ['https://api3.getresponse360.pl/v3', 'https://api3.getresponse360.com/v3']
			}
		},
		props: ['values', 'variants', 'addon_id', 'isInstalling', 'currentTab'],
		mixins: [FormModel],
		computed: {
			message() {
				return this.$gettext('Сформировать ключ доступа к API вы можете в разделе "<a %s>Интеграция и API</a>". Укажите полученный "Ключ доступа к API" в поле ввода выше и нажмите "Сохранить". После этого укажите списки рассылок в "Формах".').replace('%s', "href='https://app.getresponse.com/api' target='_blank'");
			}
		}, template: `<section class="modal-card-body modal-card-body-blocks"> <section class="content" v-if="currentTab == 'description'"> <slot name="allow"></slot> <div class="field">{{'GetResponse – сервис автоматизации email маркетинга. Подключив этот модуль контактные данные клиентов будут передаваться в сервис рассылок GetResponse, где затем по этим контактам можно настраивать автоматические email рассылки вашим клиентам.'|gettext}}</div> <a href='http://getresponse.com/' target="_blank">{{'Открыть сайт'|gettext}}</a> </section> <section class="content" v-if="currentTab == 'options'"> <b-field :label="'Ключ доступа к API'|gettext" :message="errors.key" :class="['has-mb-1', {'has-error': errors.key}]"> <input type="text" class="input" v-model="values.options.key"> </b-field> <div class="field" v-html="message"></div> <mx-toggle v-model="values.options.is360" :title="'Мы используем GetResponse360'|gettext"></mx-toggle> <div v-if="values.options.is360" class="row has-mt-2"> <div class="col-xs-12 col-sm-6"> <b-field label="API" :message="errors.api" :class="['has-mb-1', {'has-error': errors.api}]"> <b-select v-model="values.options.api" expanded :placeholder="'-- Не выбрано --'|gettext"> <option v-for="api in apis" :value="api">{{api}}</option> </b-select> </b-field> </div> <div class="col-xs-12 has-mb-2"> {{'Если вы используете GetResponse360 с особым адресом — выберите его из списка.'|gettext}} </div> <div class="col-xs-12 col-sm-6"> <b-field :label="'Домен'|gettext" :message="errors.domain" :class="['has-mb-1', {'has-error': errors.domain}]"> <input type="text" class="input" v-model="values.options.domain"> </b-field> </div> <div class="col-xs-12 has-mb-2"> {{'Укажите домен привязанный к GetResponse360 без www и http'|gettext}} </div> </div> </div> </section> </section>`});

window.$app.defineComponent("addons", "vue-addons-addon-googleanalytics-entry", {props: ['addons', 'addon', 'options'],
		mixins: [FormModel], template: `<div> <div class="field" v-for="(v, k) in options.slots"> <label class="label">{{addon.titles[k]|gettext}}</label> <div class="row"> <div class="col-xs-12 col-sm-6 has-xs-mb-3"><input type='text' class="input" v-model="options.slots[k].c" :placeholder="'Категория'|gettext"></div> <div class="col-xs-12 col-sm-6"><input type='text' class="input" v-model="options.slots[k].a" :placeholder="'Действие'|gettext"></div> </div> </div> </div>`});

window.$app.defineComponent("addons", "vue-addons-addon-googleanalytics", {props: ['values', 'variants', 'addon_id', 'isInstalling', 'currentTab'],
		mixins: [FormModel], template: `<section class="modal-card-body modal-card-body-blocks"> <section class="content" v-if="currentTab == 'description'"> <slot name="allow"></slot> <div class="field">{{'Google.Analytics — инструмент для оценки посещаемости сайтов, анализа поведения посетителей. Подключив этот модуль вы также сможете настраивать цели для каждой ссылки.'|gettext}}</div> <a href='https://analytics.google.com/' target="_blank">{{'Открыть сайт'|gettext}}</a> </section> <section class="content" v-if="currentTab == 'options'"> <b-field :label="'Скопируйте полученный код и вставьте в поле ниже'|gettext" :message="errors.code" :class="{'has-error': errors.code}"> <textarea class='input autoresize-init' :placeholder="'Разместите тут код'|gettext" style="min-height: 100px" v-model="values.options.code"></textarea> </b-field> </section> </section>`});

window.$app.defineComponent("addons", "vue-addons-addon-jivosite", {props: ['values', 'variants', 'addon_id', 'isInstalling', 'currentTab'],
		mixins: [FormModel], template: `<section class="modal-card-body modal-card-body-blocks"> <section class="content" v-if="currentTab == 'description'"> <p>JivoSite – это бизнес-мессенджер для общения с вашими клиентами на сайте, в соцсетях и мессенджерах, по телефону и e-mail.</p> <p>Подключите Telegram, ВКонтакте, Facebook Messenger, Viber к JivoSite и добавьте сотрудников чтобы в одном месте обрабатывать все входящие сообщения.</p> <a href='https://www.jivosite.ru/?partner_id=18033&lang=ru&pricelist_id=105' target="_blank">Открыть веб-сайт</a> </section> <section class="content" v-if="currentTab == 'options'"> <p>1. <a href='https://www.jivosite.ru/?partner_id=18033&lang=ru&pricelist_id=105' target="_blank">Зарегистрируйтесь</a> и следуйте инструкции.</p> <p>2. Скопируйте полученный код и вставьте в поле ниже</p> <b-field :message="errors.code" :class="{'has-error': errors.code}"> <textarea class='input autoresize-init' placeholder="Разместите тут код" style="min-height: 100px" v-model="values.options.code"></textarea> </b-field> </section> </section>`});

window.$app.defineComponent("addons", "vue-addons-addon-justclick-entry", {props: ['addons', 'addon', 'options', 'variants'],
		mixins: [FormModel], template: `<div> <div class="field"> <p>{{'Укажите списки рассылок для добавления контактов'|gettext}}</p> </div> <b-field :label="'Новая заявка'|gettext"> <b-select :placeholder="'-- Добавить поле --'|gettext" v-model="options.created" expanded> <option value="">{{'-- Рассылка не выбрана --'|gettext}}</option> <option v-for="(f, i) in variants.list" :value="i">{{ f }}</option> </b-select> </b-field> <b-field :label="'Успешная оплата'|gettext"> <b-select :placeholder="'-- Добавить поле --'|gettext" v-model="options.paid" expanded> <option value="">{{'-- Рассылка не выбрана --'|gettext}}</option> <option v-for="(f, i) in variants.list" :value="i">{{ f }}</option> </b-select> </b-field> </div>`});

window.$app.defineComponent("addons", "vue-addons-addon-justclick", {props: ['values', 'variants', 'addon_id', 'isInstalling', 'currentTab'],
		mixins: [FormModel], template: `<section class="modal-card-body modal-card-body-blocks"> <section class="content" v-if="currentTab == 'description'"> <slot name="allow"></slot> <div class="field">JustClick – Сервис рассылок и CRM система. Подключив этот модуль контактные данные клиентов будут передаваться в сервис JustClick. После настройки укажите списки рассылок в "Формах" или в настройках "Товаров".</div> <a href='http://justclick.ru/?utm_medium=affiliate&utm_source=taplink' target="_blank">Открыть веб-сайт</a> </section> <section class="content" v-if="currentTab == 'options'"> <div class='message is-info'><div class="message-body">Обязательно <a href='http://help.justclick.ru/archives/481' target="_blank">прочтите статью на сайте JustClick-а</a> о подключении API и снятии ограничений</div></div> <div class="row"> <div class="col-xs-12 col-sm-6"> <vue-component-subdomain-field label="Адрес аккаунта" v-model="values.options.subdomain" domain="justclick.ru" :error="errors.subdomain"></vue-component-subdomain-field> <b-field label="Ключ API" :message="errors.key" :class="{'has-error': errors.key}"> <input type="text" class="input" v-model="values.options.key"> </b-field> </div> </div> </section> </section>`});

window.$app.defineComponent("addons", "vue-addons-addon-mailchimp-entry", {props: ['addons', 'addon', 'options', 'variants', 'values'],
		mixins: [FormModel],
		
		computed: {
			placeholderField() {
				return '-- '+this.$gettext('Выберите поле')+' --';
			}
		},
		
		created() {
			this.checkFields();
		},
		
		watch: {
			values: {
				handler() {
					this.checkFields();
				},
				deep: true
			}
		},
		
		methods: {
			checkFields() {
				let idxs = _.map(this.values.fields, (v) => { return v.idx; });
				for (i = 0; i < this.options.fields.length; i++) {
					if (idxs.indexOf(this.options.fields[i].idx) == -1) this.options.fields[i].idx = null;
				}
			},
			
			addCultomField() {
				this.options.fields.push({name: '', idx: null});
			},
			
			removeCustomField(i) {
				this.options.fields.splice(i, 1);
			},
		}, template: `<div> <div class="field"> <p>{{'Укажите списки рассылок для добавления контактов'|gettext}}</p> </div> <b-field :label="'Новая заявка'|gettext"> <b-select v-model="options.created" expanded> <option :value="null">-- {{'Рассылка не выбрана'|gettext}} --</option> <option v-for="(f, i) in variants.list" :value="i">{{ f }}</option> </b-select> </b-field> <b-field :label="'Успешная оплата'|gettext"> <b-select v-model="options.paid" expanded> <option :value="null">-- {{'Рассылка не выбрана'|gettext}} --</option> <option v-for="(f, i) in variants.list" :value="i">{{ f }}</option> </b-select> </b-field> <div v-if="options.fields.length"> <label class="label has-mt-2">{{'Настраиваемые поля'|gettext}}</label> <div v-for="(f, i) in options.fields" class="row row-small has-mb-2"> <div class="col-xs-4"><input type="text" class="input" v-model="f.name" :placeholder="'Имя'|gettext"></div> <div class="col-xs"> <b-select :placeholder="placeholderField" v-model="f.idx" expanded> <option :value="null">{{placeholderField}}</option> <option v-for="v in values.fields" :value="v.idx">{{v.title}}</option> </b-select> </div> <div class="col-xs col-shrink"><button type="button" class="button is-danger" @click="removeCustomField(i)"><i class="fa fa-trash-alt"></i></button></div> </div> </div> <div><a href='#' @click="addCultomField">{{'Добавить настраиваемое поле'|gettext}}</a></div> </div>`});

window.$app.defineComponent("addons", "vue-addons-addon-mailchimp", {props: ['values', 'variants', 'addon_id', 'isInstalling', 'currentTab'],
		mixins: [FormModel], template: `<section class="modal-card-body modal-card-body-blocks"> <section class="content" v-if="currentTab == 'description'"> <slot name="allow"></slot> <div class="field">{{'Mailchimp — платформа автоматизации email маркетинга. Собирайте новых подписчиков электронной почты на своей странице. Свяжите формы с списками в Mailchimp и увеличивайте свою подписную базу. Вы также можете организовать отправку вашего онлайн продукта через Mailchimp.'|gettext}}</div> <a href='https://mailchimp.com/' target="_blank">{{'Открыть сайт'|gettext}}</a> </section> <section class="content" v-if="currentTab == 'options'"> <b-field :label="'Ключ доступа к API'|gettext" :message="errors.key" :class="{'has-error': errors.key}"> <input type="text" class="input" v-model="values.options.key"> </b-field> <div class="field"> {{'Сформировать ключ доступа к API вы можете в разделе "Account -> Extras -> API keys". Укажите полученный "Ключ доступа к API" в поле ввода выше и нажмите "Сохранить". После этого укажите списки рассылок в "Формах" или в настройках "Товаров".'|gettext}} </div> </section> </section>`});

window.$app.defineComponent("addons", "vue-addons-addon-mindbox-entry", {props: ['addons', 'addon', 'options', 'variants'],
		data() {
			return {
				types: {created: this.$gettext('Новая заявка'), paid: this.$gettext('Успешная оплата')}
			}
		},
		mixins: [FormModel],
		
		methods: {
			addCultomField(o) {
				o.customfields.push({k: '', v: ''});
			},
			
			removeCustomField(o, i) {
				o.customfields.splice(i, 1);
			},
			
			addSubscription(o) {
				o.subscriptions.push({brand: '', point: '', topic: ''});
			},
			
			removeCustomSubscription(o, i) {
				o.subscriptions.splice(i, 1);
			}
		}, template: `<div> <div v-for="(o, key) in options"> <mx-toggle :title="types[key]" v-model="o.is_active"></mx-toggle> <div v-if="o.is_active" class="has-mb-3 has-mt-1"> <div class="has-mb-2"> <b-input v-model="o.operation" :placeholder="'Операция'|gettext" expanded></b-input> </div> <div> <label class="label has-mt-2" v-if="o.subscriptions.length">Подписки</label> <div v-for="(f, i) in o.subscriptions" class="row row-small has-mb-2"> <div class="col-xs-4"><input type="text" class="input" v-model="f.brand" placeholder="brand"></div> <div class="col-xs"><input type="text" class="input" v-model="f.point" placeholder="point"></div> <div class="col-xs"><input type="text" class="input" v-model="f.topic" placeholder="topic"></div> <div class="col-xs col-shrink"><button type="button" class="button is-danger" @click="removeCustomSubscription(o, i)"><i class="fa fa-trash-alt"></i></button></div> </div> </div> <div><a href='#' @click="addSubscription(o)">Добавить подписку</a></div> <div v-if="o.customfields.length"> <label class="label has-mt-2">Дополнительные поля</label> <div v-for="(f, i) in o.customfields" class="row row-small has-mb-2"> <div class="col-xs-4"><input type="text" class="input" v-model="f.k" placeholder="Ключ"></div> <div class="col-xs"><input type="text" class="input" v-model="f.v" placeholder="Значение"></div> <div class="col-xs col-shrink"><button type="button" class="button is-danger" @click="removeCustomField(o, i)"><i class="fa fa-trash-alt"></i></button></div> </div> </div> <div><a href='#' @click="addCultomField(o)">Добавить значение</a></div> </div> </div> </div>`});

window.$app.defineComponent("addons", "vue-addons-addon-mindbox", {props: ['values', 'variants', 'addon_id', 'isInstalling', 'currentTab'],
		mixins: [FormModel], template: `<section class="modal-card-body modal-card-body-blocks"> <section class="content" v-if="currentTab == 'description'"> <slot name="allow"></slot> <div class="field">Mindbox — единая платформа автоматизации маркетинга.<br><br> Платформа собирает данные о клиентах: поведение, личные данные, покупки, просмотры, клики, звонки из интернет-магазина, с касс, мобильного приложения или рассылок. На основе этих данных маркетолог персонализирует работу с каждым покупателем: подсказывает подходящие товары на кассе, сайте или в приложении, запускает целевые точечные акции и рассылки, перестает заваливать клиентов спамом и скидками.<br><br> Результат — рост среднего чека, частоты покупок и конверсии, снижение оттока.</div> <a href='https://mindbox.ru/' target="_blank">Открыть веб-сайт</a> </section> <section class="content" v-if="currentTab == 'options'"> <div class="row"> <div class="col-xs-12 col-sm-6"> <b-field label="Точка интеграции (endpointId)" :message="errors.endpoint" :class="{'has-error': errors.endpoint}"> <input type="text" class="input" v-model="values.options.endpoint"> </b-field> <b-field label="Секретный ключ (secretKey)" :message="errors.secret_key" :class="{'has-error': errors.secret_key}"> <input type="text" class="input" v-model="values.options.secret_key"> </b-field> </div> </div> </section> </section>`});

window.$app.defineComponent("addons", "vue-addons-addon-notifier", {props: ['values', 'variants', 'addon_id', 'isInstalling', 'currentTab'],
		mixins: [FormModel],
		
		data() {
			return {
				deletingIndex: -1,
				currentPlatform: null,
				email: '',
				errors: {},
				sendingInvite: false,
				platforms: {'tg': 'Telegram',  'fb': 'Facebook Messenger', 'email': 'Email', 'vk': 'ВКонтакте'}
				
			}
		},
		
		computed: {
			command() {
				return '/start '+this.values.code;
			},
			messageVK() {
				return this.message('href="https://vk.me/taplink" target="_blank"', '@taplink');
			},
			messageFB() {
				return this.message('href="https://m.me/taplink.cc" target="_blank"', '@taplink');
			},
			messageTG() {
				return this.message('href="tg://resolve?domain=taplink_bot" target="_blank"', '@taplink_bot');
			},
			messageTGAuto() {
				return this.$format(this.$gettext('Для автоматической установки просто перейдите по <a {1}>ссылке</a>'), 'href="tg://resolve?domain=taplink_bot&start='+this.values.code+'" target="_blank"');
			}
		},
		
		methods: {
			inviteEmail() {
				this.sendingInvite = true;
				this.$parent.action('invite', {email: this.email.trim()}).then((data) => {
					if (data.result == 'success') {
						this.errors = {};
						this.email = '';
					} else {
						this.errors = data.errors;
					}
					this.sendingInvite = false;
				});
			},
			message(link, name) {
				return this.$format(this.$gettext('Для подключения уведомлений откройте чат <a {1}>{2}</a> и отправьте команду'), link, name);
			},
			deleteAcount(index, notify_provider_id, id) {
				this.$confirm(this.$gettext('Вы уверены что хотите отключить этот аккаунт?'), 'is-danger').then(() => {
					this.deletingIndex = index;
	
					this.$parent.action('delete', {notify_provider_id: notify_provider_id, id: id}).then((data) => {
						if (data.result == 'success') {
							this.values.accounts.splice(index, 1);
						}

						this.deletingIndex = -1;
					});
				});
			}
		}, template: `<section class="modal-card-body modal-card-body-blocks"> <section class="content" v-if="currentTab == 'description'"> <slot name="allow"></slot> <p>{{'Подключите модуль "Уведомления", чтобы подключить моментальные оповещения о новых заявках и принятых оплатах в мессенджеры'|gettext}}</p> </section> <section v-if="currentTab == 'options'"> <p class="has-mb-2">{{'Для того чтобы настроить уведомления выберите платформу и следуйте инструкциям'|gettext}}</p> <b-select v-model="currentPlatform" :placeholder="'-- Выберите платформу --'|gettext"> <option v-for="(p, k) in platforms" :value="k">{{p|gettext}}</option> </b-select> </section> <section v-if="currentTab == 'options' && (currentPlatform == 'vk')"> <div class="media"> <img class="media-left" src="/s/i/messengers/icons/vk.svg" style="width:60px;height:60px;background:#508bce;border-radius: 13px"> <div class="media-content"> <b>{{'ВКонтакте'|gettext}}</b><br> <span v-html="messageVK"></span> <span class='tag is-success'>{{command}}</span> <vue-component-clipboard :text="command" class="has-ml-1" :success-message="'Код скопирован'|gettext"></vue-component-clipboard> </div> </div> </section> <section v-if="currentTab == 'options' && (currentPlatform == 'fb')"> <div class="media"> <img class="media-left" src="/s/i/messengers/icons/fb.svg" style="width:60px;height:60px;background:#fff;border-radius: 13px"> <div class="media-content"> <b>Facebook Messenger</b><br> <span v-html="messageFB"></span> <span class='tag is-success'>{{command}}</span> <vue-component-clipboard :text="command" class="has-ml-1" :success-message="'Код скопирован'|gettext"></vue-component-clipboard> </div> </div> </section> <section v-if="currentTab == 'options' && (currentPlatform == 'tg')"> <div class="media"> <img class="media-left" src="/s/i/messengers/icons/telegram.svg" style="width:60px;height:60px;background:#fff;border-radius: 13px"> <div class="media-content"> <b>Telegram</b><br> <span v-html="messageTG"></span> <span class='tag is-success'>{{command}}</span> <vue-component-clipboard :text="command" class="has-ml-1" :success-message="'Код скопирован'|gettext"></vue-component-clipboard><br> <span v-html="messageTGAuto"></span> </div> </div> </section> <section v-if="currentTab == 'options' && (currentPlatform == 'email')"> <div class="media"> <img class="media-left" src="/s/i/messengers/icons/email.png" style="width:60px;height:60px;background:#fff;border-radius: 13px"> <div class="media-content"> <b-field label="Email" :message="errors.email" :class="{'has-error': errors.email}"> <div class="row row-small"> <div class="col-xs-12 col-sm-4"> <input type="text" v-model="email" class="input has-mb-1" :disabled="sendingInvite" placeholder="name@mail.com"> </div> <div class="col-xs-12 col-sm-3"> <button class="button is-primary is-fullwidth" :class="{'is-loading': sendingInvite}" :disabled="sendingInvite" @click="inviteEmail">{{'Отправить приглашение'|gettext}}</button> </div> </div> </b-field> </div> </div> </div> </section> <section v-if="currentTab == 'options'"> <h3 class="media-heading has-mb-2 has-text-grey-light">{{'Уведомления'|gettext}}</h3> <div> <b-checkbox v-model="values.options.events.lead"> {{'Новая заявка'|gettext}}</b-checkbox> </div> <div> <b-checkbox v-model="values.options.events.paid"> {{'Новая оплата'|gettext}}</b-checkbox> </div> <div> <b-checkbox v-model="values.options.events.notify"> {{'Уведомления об ошибках'|gettext}}</b-checkbox> </div> </section> <section v-if="currentTab == 'accounts'"> <mx-item class="is-hidden-mobile mx-item-header"> <div class="item-row row"> <div class="col-sm">{{'Аккаунты'|gettext}}</div> </div> </mx-item> <mx-item v-for="(f, index) in values.accounts"> <div class="item-row row"> <div class="col-xs text-xs-bold"><p class="form-control-static"><a target="_blank" :href="f.link">{{f.username}}</a><span class="has-text-grey-light"> / {{f.notify_provider_title|gettext}}</span></p></div> <div class="col-xs col-shrink"><button class="button is-danger" @click="deleteAcount(index, f.notify_provider_id, f.id)" :class="{'is-loading': deletingIndex== index, 'disabled': deletingIndex != -1}"><i class="fa fa-trash-alt"></i></button></div> </div> </mx-item> </section> </section>`});

window.$app.defineComponent("addons", "vue-addons-addon-opengraph", {props: ['values', 'variants', 'addon_id', 'isInstalling', 'currentTab'],
		mixins: [FormModel], template: `<section class="modal-card-body modal-card-body-blocks"> <section class="content" v-if="currentTab == 'description'"> <slot name="allow"></slot> <p>{{'Модуль OpenGraph позволяет сменить стандартный текст и картинку при размещении ссылки в социальных сетях'|gettext}}</p> </section> <section class="content" v-if="currentTab == 'options'"> <b-field :label="'Заголовок'|gettext" :message="errors.title" :class="{'has-error': errors.title}"> <input type="text" class="input" v-model="values.options.title"> </b-field> <b-field :label="'Текст описания'|gettext" :message="errors.description" :class="{'has-error': errors.description}"> <textarea class='input autoresize-init' style="min-height: 100px" v-model="values.options.description"></textarea> </b-field> <label class="label">{{'Изображение'|gettext}}</label> <p class="has-text-grey-light">{{'Размер изображения'|gettext}}: 510x228 px</p> <vue-component-pictures v-model="values.options.picture" class="addon-opengraph-picture" :button-title="'Загрузить картинку'|gettext" button-icon="fa fal fa-cloud-upload" updatable></vue-component-pictures> </section> </section>`});

window.$app.defineComponent("addons", "vue-addons-addon-roistat", {props: ['values', 'variants', 'addon_id', 'isInstalling', 'currentTab'],
		mixins: [FormModel], template: `<section class="modal-card-body modal-card-body-blocks"> <section class="content" v-if="currentTab == 'description'"> <slot name="allow"></slot> <div class="field">Roistat — Сервис сквозной аналитики. При создании заказа создаёт заявку в Roistat.</div> <p>Нет аккаунта? <a href='http://roistat.com/r/xofkrznj' target="_blank">Зарегистрировать</a></p> </section> <section class="content" v-if="currentTab == 'options'"> <b-field label="Скопируйте код счетчика Roistat и вставьте в поле ниже" :message="errors.code" :class="{'has-error': errors.code}"> <textarea class='input autoresize-init' :placeholder="'Разместите тут код'|gettext" style="min-height: 100px" v-model="values.options.code"></textarea> </b-field> <b-field label="Укажите ваш Webhook" :message="errors.webhook" :class="{'has-error': errors.webhook}"> <input type="text" class="input" v-model="values.options.webhook"> </b-field> </section> </section>`});

window.$app.defineComponent("addons", "vue-addons-addon-sendpulse-entry", {props: ['addons', 'addon', 'options', 'variants', 'values'],
		mixins: [FormModel],
		
		computed: {
			placeholderField() {
				return '-- '+this.$gettext('Выберите поле')+' --';
			}
		},
		
		created() {
			this.checkFields();
		},
		
		watch: {
			values: {
				handler() {
					this.checkFields();
				},
				deep: true
			}
		},
		
		methods: {
			checkFields() {
				let idxs = _.map(this.values.fields, (v) => { return v.idx; });
				for (i = 0; i < this.options.fields.length; i++) {
					if (idxs.indexOf(this.options.fields[i].idx) == -1) this.options.fields[i].idx = null;
				}
			},
			
			addCultomField() {
				this.options.fields.push({name: '', idx: null});
			},
			
			removeCustomField(i) {
				this.options.fields.splice(i, 1);
			},
		}, template: `<div> <div class="field"> <p>{{'Укажите списки рассылок для добавления контактов'|gettext}}</p> </div> <b-field :label="'Новая заявка'|gettext"> <b-select :placeholder="'-- Добавить поле --'|gettext" v-model="options.created" expanded> <option :value="null">{{'-- Рассылка не выбрана --'|gettext}}</option> <option v-for="(f, i) in variants.list" :value="i">{{ f }}</option> </b-select> </b-field> <b-field :label="'Успешная оплата'|gettext"> <b-select :placeholder="'-- Добавить поле --'|gettext" v-model="options.paid" expanded> <option :value="null">{{'-- Рассылка не выбрана --'|gettext}}</option> <option v-for="(f, i) in variants.list" :value="i">{{ f }}</option> </b-select> </b-field> <div v-if="options.fields.length"> <label class="label has-mt-2">{{'Настраиваемые поля'|gettext}}</label> <div v-for="(f, i) in options.fields" class="row row-small has-mb-2"> <div class="col-xs-4"><input type="text" class="input" v-model="f.name" :placeholder="'Имя'|gettext"></div> <div class="col-xs"> <b-select :placeholder="placeholderField" v-model="f.idx" expanded> <option :value="null">{{placeholderField}}</option> <option v-for="v in values.fields" :value="v.idx">{{v.title}}</option> </b-select> </div> <div class="col-xs col-shrink"><button type="button" class="button is-danger" @click="removeCustomField(i)"><i class="fa fa-trash-alt"></i></button></div> </div> </div> <div><a href='#' @click="addCultomField">{{'Добавить настраиваемое поле'|gettext}}</a></div> </div>`});

window.$app.defineComponent("addons", "vue-addons-addon-sendpulse", {props: ['values', 'variants', 'addon_id', 'isInstalling', 'currentTab'],
		mixins: [FormModel], template: `<section class="modal-card-body modal-card-body-blocks"> <section class="content" v-if="currentTab == 'description'"> <slot name="allow"></slot> <div class="field">SendPulse – сервис автоматизации email маркетинга. Подключив этот модуль контактные данные клиентов будут передаваться в сервис рассылок SendPulse, где затем по этим контактам можно настроить Email рассылки.</div> <a href='https://sendpulse.com/ru/?ref=6666627' target="_blank">Открыть веб-сайт</a> </section> <section class="content" v-if="currentTab == 'options'"> <div class="field"> Откройте раздел <a href='https://login.sendpulse.com/settings/#api' target="_blank">API</a> в настройках SendPulse. Активируйте REST API, скопируйте "ID" и "Secret". Укажите полученные данные ниже и нажмите "Сохранить". После этого укажите списки рассылок в "Формах" или в настройках "Товаров". </div> <div class="row"> <div class="col-xs-12 col-sm-6"> <b-field label="API ID" :message="errors.client_id" :class="{'has-error': errors.client_id}"> <input type="text" class="input" v-model="values.options.client_id"> </b-field> <b-field label="Secret" :message="errors.client_secret" :class="{'has-error': errors.client_secret}"> <input type="text" class="input" v-model="values.options.client_secret"> </b-field> <div class="field"> <b-checkbox v-model="values.options.confirmation">Добавление подписчиков методом double-opt-in</b-checkbox> </div> <b-field label="Ваш адрес отправителя" :message="errors.sender_email" :class="{'has-error': errors.sender_email}"> <input type="text" class="input" v-model="values.options.sender_email" :disabled="!values.options.confirmation"> </b-field> </div> </div> </section> </section>`});

window.$app.defineComponent("addons", "vue-addons-addon-unisender-entry", {props: ['addons', 'addon', 'options', 'variants'],
		mixins: [FormModel], template: `<div> <div class="field"> <p>{{'Укажите списки рассылок для добавления контактов'|gettext}}</p> </div> <b-field :label="'Новая заявка'|gettext"> <b-select :placeholder="'-- Добавить поле --'|gettext" v-model="options.created" expanded> <option value="">{{'-- Рассылка не выбрана --'|gettext}}</option> <option v-for="(f, i) in variants.list" :value="i">{{ f }}</option> </b-select> </b-field> <b-field :label="'Успешная оплата'|gettext"> <b-select :placeholder="'-- Добавить поле --'|gettext" v-model="options.paid" expanded> <option value="">{{'-- Рассылка не выбрана --'|gettext}}</option> <option v-for="(f, i) in variants.list" :value="i">{{ f }}</option> </b-select> </b-field> </div>`});

window.$app.defineComponent("addons", "vue-addons-addon-unisender", {props: ['values', 'variants', 'addon_id', 'isInstalling', 'currentTab'],
		mixins: [FormModel], template: `<section class="modal-card-body modal-card-body-blocks"> <section class="content" v-if="currentTab == 'description'"> <slot name="allow"></slot> <div class="field">UniSender – сервис массовых Email и SMS рассылок. Подключив этот модуль контактные данные клиентов будут передаваться в сервис рассылок UniSender, где затем по этим контактам можно настроить Email и SMS рассылки.</div> <a href='http://unisender.com' target="_blank">Открыть веб-сайт</a> </section> <section class="content" v-if="currentTab == 'options'"> <b-field label="Ключ доступа к API" :message="errors.key" :class="{'has-error': errors.key}"> <input type="text" class="input" v-model="values.options.key"> </b-field> <div class="field"> <b-checkbox v-model="values.options.confirmation">Добавление подписчиков методом double-opt-in</b-checkbox> </div> <div class="field"> Откройте раздел <a href='https://cp.unisender.ru/ru/v5/user/info/api' target="_blank">Интеграция и API</a> в настройках UniSender. Включите API, скопируйте "Ключ доступа к API", сохраните изменения. Укажите полученный "Ключ доступа к API" в поле ввода выше и нажмите "Сохранить". После этого укажите списки рассылок в "Формах" или в настройках "Товаров". </div> </section> </section>`});

window.$app.defineComponent("addons", "vue-addons-addon-webhooks", {props: ['values', 'variants', 'addon_id', 'isInstalling', 'currentTab'],
		mixins: [FormModel],
		
		data() {
			return {
				sending: {}
			}
		},
		
		methods: {
			test(action_id) {
				this.$set(this.sending, action_id, true);
				this.$parent.action('test', {action_id: action_id, endpoint: this.values.options.webhooks[action_id].endpoint, secret: this.values.options.secret}).then((data) => {
					this.$set(this.sending, action_id, false);
				});
			}
		}, template: `<section class="modal-card-body modal-card-body-blocks"> <section class="content" v-if="currentTab == 'description'"> <slot name="allow"></slot> <p>WebHooks – это уведомление сторонних приложений посредством отправки уведомлений о событиях, произошедших в Taplink.</p> <p><a href='/dev/webhooks.html' class='no-ajax' target="_blank">Документация для разработчиков</a></p> </section> <section v-if="currentTab == 'options'"> <h3 class="media-heading has-mb-2 has-text-grey-light">Уведомления</h3> <mx-item class="is-hidden-mobile mx-item-header"> <div class="item-row row"> <div class="col-sm-4">Событие</div> <div class="col-sm-8">Ссылка</div> </div> </mx-item> <mx-item v-for="(w, action_id) in values.options.webhooks"> <div class="item-row row"> <div class="col-sm-4"> <b-checkbox v-model="w.active">{{ variants.actions[action_id] }}</b-checkbox> </div> <div class="col-sm-6" :class="{disabled: !w.active}"> <b-field> <b-input v-model="w.endpoint" :disabled="!w.active"></b-input> </b-field> </div> <div class="col-sm-2" :class="{disabled: !w.active}"> <button type="submit" class="button is-fullwidth is-success" @click="test(action_id)" :disabled="!w.active" :class="{'is-loading': sending[action_id]}">Тест</button> </div> </div> </mx-item> </section> <section v-if="currentTab == 'options'"> <h3 class="media-heading has-mb-2 has-text-grey-light">Секретная фраза</h3> <div class="row"> <div class="col-xs-12 col-sm-4 block-xs"> <b-input type="text" v-model="values.options.secret"></b-input> </div> </div> </section> </section>`});

window.$app.defineComponent("addons", "vue-addons-addon-yandexmetrika-entry", {props: ['addons', 'addon', 'options'],
		mixins: [FormModel], template: `<div> <div class="field" v-for="(v, k) in options.slots"> <label class="label">{{addon.titles[k]}}</label> <input type='text' class="input" v-model='options.slots[k]' placeholder="Идентификатор цели"> </div> </div>`});

window.$app.defineComponent("addons", "vue-addons-addon-yandexmetrika", {props: ['values', 'variants', 'addon_id', 'isInstalling', 'currentTab'],
		mixins: [FormModel], template: `<section class="modal-card-body modal-card-body-blocks"> <section class="content" v-if="currentTab == 'description'"> <slot name="allow"></slot> <div class="field">Яндекс.Метрика — инструмент для оценки посещаемости сайтов, анализа поведения посетителей. Подключив этот модуль вы также сможете настраивать цели для каждой ссылки.</div> <a href='http://metrika.yandex.ru' target="_blank">Открыть веб-сайт</a> </section> <section class="content" v-if="currentTab == 'options'"> <b-field label="Скопируйте полученный код и вставьте в поле ниже" :message="errors.code" :class="{'has-error': errors.code}"> <textarea class='input autoresize-init' placeholder="Разместите тут код" style="min-height: 100px" v-model="values.options.code"></textarea> </b-field> </section> </section>`});

window.$app.defineComponent("addons", "vue-addons-form", {data() {
			return {
				isUpdating: false,
				isFetching: false,
				isStep: false,
				currentAddon: null,
				addon_id: null,
				isInstalling: false,
				options: {},
				values: {is_installed: false, is_active: false, addon_title: null, external_id: null, tariff: 'basic'},
				variants: {},
				currentTab: 'description',
				tabs: []
			}
		},

		created() {
			this.fetchData(true);
		},
		
		computed: {
			buttonTitle() {
				return this.isStep?this.$gettext('Далее'):this.$gettext('Активировать');
			},
			
			ratePlanLink() {
				return window.base_path_prefix+'/tariffs/';
			},
			
			allowText() {
				return (this.values.tariff == 'pro')?this.$gettext('Этот модуль доступен на PRO-тарифе'):this.$gettext('Этот модуль доступен на BUSINESS-тарифе');
			},
			
			isAllow() {
				return this.$auth.isAllowTariff(this.values.tariff);
/*
				let r = (this.values.tariff == null);
				if (this.values.tariff == 'business' && this.$account.tariff == 'business') r = true;
				if (this.values.tariff == 'pro' && (this.$account.tariff == 'pro' || this.$account.tariff == 'business')) r = true;
				return r;
*/
			}
		},

		props: ['addon_id'],

		mixins: [FormModel],

		methods: {
			fetchData(withLoading) {
				this.isFetching = withLoading;
				this.$api.get('addons/addon/get', {addon_id: this.addon_id}).then((data) => {
					this.isFetching = false;
					let addon = data.response.addons.addon;
					this.values = addon.values;
					this.variants = addon.variants;
					this.currentAddon = 'vue-addons-addon-'+addon.values.addon_name;
					
					window.i18n.extend(addon.phrases);
					
					this.tabs = addon.tabs;
					this.currentTab = addon.current_tab;
				});
			},
			
			setStep(v) {
				this.isStep = v;
			},
			
			close() {
				this.$parent.close()
			},
			
			uninstallAddon() {
				this.$confirm(this.$gettext('Вы уверены что хотите отключить этот модуль?'), 'is-danger').then((v) => {
					this.$api.get('addons/addon/delete', {addon_id: this.addon_id}).then((data) => {
						this.$parent.close();
					});
				});
			},
			
			install() {
				this.isInstalling = true;
				this.values.is_active = true;
				this.currentTab = 'options';
			},
			
			action(name, params) {
				return this.$api.get('addons/addon/action', {addon_id: this.addon_id, name: name, params: params}, this);
			},
			
			save() {
				this.isUpdating = true;
				
				this.$api.post('addons/addon/set', this.values, this.$refs.model).then((data) => {
					this.isUpdating = false;
					if (data.result == 'success') {
						if (this.$refs.model.isSuccess == undefined || this.$refs.model.isSuccess()) {
							this.$parent.close();
						} else {
							this.values.external_id = data.response.values.external_id;
							this.values.options = data.response.values.options;
							this.variants = data.response.variants;
						}
					}
				}).catch((error) => {
					this.isUpdating = false;
				})			
			}
		}, template: `<div class="modal-card modal-card-large"> <header class="modal-card-head"> <p class="modal-card-title" v-if="values.addon_title">{{values.addon_title}}</p> <p class="modal-card-title" v-else>{{'Загрузка модуля'|gettext}}</p> <button class="modal-close is-large" @click="$parent.close()"></button> </header> <ul class="nav nav-tabs has-text-left"> <li :class="{active: currentTab== 'description'}"><a href="#" @click="currentTab = 'description'">{{'Описание'|gettext}}</a></li> <li :class="{active: currentTab== 'options'}" v-if="values.is_installed || isInstalling"><a href="#" @click="currentTab = 'options'">{{'Настройки'|gettext}}</a></li> <li v-for="(t, k) in tabs" :class="{active: currentTab== k}" v-if="values.is_installed || isInstalling"><a href="#" @click="currentTab = k">{{t}}</a></li> </ul> <component v-bind:is="currentAddon" ref='model' :values="values" :variants="variants" :is-installing="isInstalling" :is-step="isStep" :addon_id="addon_id" :current-tab="currentTab" v-if="currentAddon"> <template slot="allow"> <div v-if="!isAllow" class='message is-danger'> <div class="message-body">{{allowText}} <a :href='ratePlanLink' class='is-pulled-right'>{{'Подробнее'|gettext}} <i class="fa fa-angle-right has-ml-1"></i></a></div> </div> </template> </component> <section class="modal-card-body" v-if="!currentAddon"></section> <footer class="modal-card-foot level" v-if="currentAddon"> <div class="level-left"> <button v-if="values.is_installed" class="button is-default" @click="uninstallAddon" style="margin-right:15px"><i class="fa fa-trash-alt"></i><span class="is-hidden-mobile"> {{'Отключить'|gettext}}</span></button> <b-checkbox v-if="values.is_installed" v-model="values.is_active">{{'Активный'|gettext}}</b-checkbox> </div> <div class="level-right"> <button class="button is-primary" v-if="values.is_installed" :class="{'is-loading': isUpdating}" @click="save">{{'Сохранить'|gettext}}</button> <button class="button is-primary" v-if="!values.is_installed && isInstalling" :class="{'is-loading': isUpdating}" @click="save">{{buttonTitle}}</button> <button class="button is-primary" v-if="!values.is_installed && !isInstalling" :class="{'is-loading': isUpdating}" @click="install" :disabled="!isAllow">{{'Установить'|gettext}}</button> </div> </footer> <footer class="modal-card-foot" v-if="!currentAddon"> <button class="button is-dark" type="button" @click="$parent.close()">{{'Закрыть'|gettext}}</button> </footer> <b-loading :is-full-page="false" :active.sync="isFetching"></b-loading> </div>`});

window.$app.defineComponent("addons", "vue-addons-list", {data() {
			return {
				isFetching: false,
				variants: {tariff: [], target: []},
				variantsLoaded: false,
				fields: [],
				filter: {query: '', tariff: '', target: ''},
			}
		},
		
		props: ['type'],
		
		watch: {
			type() {
				this.fetchData(true);
			}
		},

		created() {
			this.fetchData(true);
			this.$io.on('events:addons.list:refresh', this.fetchData);
		},
		
		destroyed: function() {
			this.$io.off('events:addons.list:refresh', this.fetchData);
		},

		methods: {
			statusTitle(f) {
				return f.is_active?this.$gettext('Вкл'):this.$gettext('Выкл');
			},
			
			fetchData(withLoading) {
				this.isFetching = withLoading;
				this.$api.get(this.variantsLoaded?'addons/list':['addons/list', 'addons/info'], {filter: this.filter, type: this.type}).then((data) => {
					this.fields = _.map(data.response.addons.list.fields, (v) => {
						v.style = "background-color:#"+v.cover_background+";background-image:url(/s/i/addons/covers/"+v.addon_id+".png)";
						return v;
					});
					
					if (!this.variantsLoaded) {
						this.variants = data.response.addons.info.variants;
						this.variantsLoaded = true;
					}
					
					this.isFetching = false;
				}).catch((error) => {
                    this.fields = []
                    this.isFetching = false
                    throw error
                })

			},
			
			checkPath(route) {
				let m = route.path.split('/');
				return window.location.pathname.indexOf(m[1]) != -1;
			},
			
			onFilter: _.debounce(function() {
	            this.fetchData(true);
            }, 500),
			
			openForm(addon_id) {
				this.$form('vue-addons-form', {addon_id: addon_id}, this);
			}
		}, template: `<div> <div class="top-panel" style="position: relative"> <div class="container has-pt-5 has-pb-4"> <h1 class="has-text-instagram" style="line-height: 1.2">{{'Каждый бизнес уникален'|gettext}}</h1> <h3>{{'Найдите модуль, который подходит именно вам'|gettext}}</h3> </div> <vue-component-filterbox :placeholder="'Поиск по названию'|gettext" @filter="onFilter" v-model="filter" :disabled="isFetching" mode="standalone"></vue-component-filterbox> <div class="container has-pt-3"> <div class="menu menu-tiny"> <router-link :to="m.path|sprintf('../%s')" v-for="m in this.$router.getRoute({name: 'addons'}).children">{{m.title|gettext}}</router-link> </div> </div> </div> <div class="container has-mt-5 has-mb-5"> <div class="row" v-if="fields.length"> <div class="col-sm-6 col-md-4" v-for="(f, i) in fields"> <a class="addon-card" @click="openForm(f.addon_id)"> <div class="addon-card-cover" :style="f.style"> <div v-if="f.tariff == 'pro'" class="tag is-pro" data-toggle="tooltip" data-placement="top" :data-original-title="'Этот модуль доступен на PRO-тарифе'|gettext">pro</div> <div v-if="f.tariff == 'business'" class="tag is-business" data-toggle="tooltip" data-placement="top" :data-original-title="'Этот модуль доступен на BUSINESS-тарифе'|gettext">biz</div> </div> <div class="addon-card-body"> <div class="addon-card-title"><div :class="{'addon-card-on': f.is_active, 'addon-card-off': !f.is_active}" :data-title="statusTitle(f)"></div>{{f.addon_title}}</div> <div class="addon-card-snippet">{{f.addon_snippet}}</div> </div> </a> </div> </div> <div class="row" v-else> <div class="col-xs-12 has-text-centered" v-if="variantsLoaded"> <i class="fal fa-search fa-5x has-text-grey-light"></i> <h3>{{'Поиск'|gettext}}</h3> <div class="has-mb-2">{{'Не найдено ни одного модуля'|gettext}}</div> </div> </div> <b-loading :is-full-page="false" :active.sync="isFetching"></b-loading> </div> </div>`});
window.$app.defineModule("addons", [{ path: 'all/', component: 'vue-addons-list', title: 'Все', props: {type: 'all'}, meta: {title: 'Все'}, name: 'addons.all'},
{ path: 'active/', component: 'vue-addons-list', title: 'Активные', props: {type: 'active'}, meta: {title: 'Активные'}, name: 'addons.active'},
]);