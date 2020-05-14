
window.$app.defineComponent("inbox", "vue-inbox-index", {data() {
			return {
				isFetchingDialogs: true,
				isFetchingMessages: false,
				isSending: false,
				dialogs: [],
				details: [],
				dialogTarget: 'all',
				dialog_id: null,
				dialog: null,
				messages: [],
				text: ''
			}
		},
		
		created() {
			this.$io.on('events:inbox:message', this.receivedMessage);
			this.fetchData()
		},
		
		destroyed: function() {
			this.$io.off('events:inbox:message', this.receivedMessage);
		},
		
		watch: {
			dialog_id(newVal, oldVal) {
				this.messages = [];
				this.fetchMessages();

				if (this.$refs.infiniteLoading) this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
			}
		},
		
		beforeRouteEnter (to, from, next) {
			$mx('body').addClass('has-hidden-footer');
			next();
		},
		
		beforeRouteLeave (to, from, next) {
			$mx('body').removeClass('has-hidden-footer');
			next();
		},
		
		methods: {
			showPhoto(photo) {
				this.$buefy.modal.open({content: '<p class="image"><img src="'+photo+'"></p>', canCancel: ['escape', 'outside']});
			},
			
			textKeydown(e) {
				if (e.metaKey && (e.keyCode == 13)) {
					this.sendMessage();
				}
			},
			receivedMessage(data) {
				if (this.dialog_id && data.channel_id == this.dialog.channel_id && data.id == this.dialog.id) {
					try {
						data.data.message = JSON.parse(data.data.message);
						this.messages.push(data.data);
						this.messages.sort((a, b) => {
							return a.tms - b.tms;
						});
						
						this.scrollEnd();
						
						for(i = 0; i < this.dialogs.length; i++) {
							if (data.channel_id == this.dialogs[i].channel_id && data.id == this.dialogs[i].id) {
								this.dialogs[i].message = data.data.message;
								this.dialogs[i].tms_updated = data.data.tms;
								
								this.dialogs.sort((a, b) => {
									return b.tms_updated - a.tms_updated;
								})
								
								break;
							}
						}
					} catch(e) { }
				}
			},
			
			infinite(state) {
				let container = this.$el.querySelector(".inbox-messages-scroll");
				let h = container.scrollHeight;
				this.fetchMessages().then((messages) => {
					messages.length?state.loaded():state.complete();
					container.scrollTop += (container.scrollHeight - h);
				});
			},
			scrollEnd() {
				this.$nextTick(() => {
					var container = this.$el.querySelector(".inbox-messages-scroll");
					container.scrollTop = container.scrollHeight - container.clientHeight;
				});
			},			
			sendMessage() {
				if (this.text.trim() != '') {
					this.isSending = true;
					this.$api.post('inbox/dialogs/send', {dialog_id: this.dialog_id, message: {text: this.text}}).then((response) => {
						this.text = '';
						this.isSending = false;
					});
				}
			},
			fetchMessages() {
				return new Promise((resolve, reject) => {
					if (this.messages.length) {
						
						this.$api.get('inbox/dialogs/messages', {dialog_id: this.dialog_id, limit: 20, offset: this.messages[0].message_id}).then(data => {
							let first = this.messages.length;
							let m = data.response.messages;
							this.messages = m.reverse().concat(this.messages);
							if (!first) this.scrollEnd();
							resolve(m);
						});

					} else {
						
						this.$api.get('inbox/dialogs/get', {dialog_id: this.dialog_id}).then(data => {
							this.dialog = data.response.dialog;
							this.details = data.response.details;
							this.messages = m = data.response.messages.reverse();
							this.scrollEnd();
							resolve(m);
						});
						
					}
				});
			},
			fetchData() {
				this.isFetchingDialogs = true;
				this.$api.get('inbox/dialogs/list').then((data) => {
					this.dialogs = data.response.dialogs;
					this.isFetchingDialogs = false;
					
					this.dialog_id = this.dialogs[0].dialog_id;
					
// 					if (this.lessons.length) this.$router.push('/courses/'+this.course_id+'/lessons/'+this.lessons[0].lesson_id+'/');
				});	
			}
		}, template: `<div class="inbox-main"> <div class="inbox-dialogs"> <div class="inbox-header"> <b-field class="has-tabs-style" style="width:100%"> <b-radio-button v-model="dialogTarget" type="active" class="is-expanded" native-value="all">Все</b-radio-button> <b-radio-button v-model="dialogTarget" type="active" class="is-expanded" native-value="my">Мои</b-radio-button> </b-field> </div> <div class="inbox-dialogs-scroll"> <div v-for="f in dialogs" :class="{in: f.dialog_id == dialog_id}" @click="dialog_id = f.dialog_id"> <img :src="f.avatar?('//'+$account.storage_domain+f.avatar):'/s/i/empty-avatar.jpg'" class="profile-avatar image is-48x48"> <div class="is-title"> <div>{{f.full_name}}</div> <div class="has-text-grey" v-if="f.message && f.message.text" v-html="f.message.text"></div> </div> </div> </div> <b-loading :is-full-page="false" :active.sync="isFetchingDialogs"></b-loading> </div> <div class="inbox-messages" :class="{'is-empty': !dialog_id && !isFetchingMessages}"> <div class="inbox-header" v-if="dialog && dialog_id"> <img class="profile-avatar image is-32x32 has-mr-2" :src="'//'+$account.storage_domain+dialog.avatar"> <div>{{dialog.full_name}}</div> </div> <div style="flex-grow: 1" v-if="isFetchingMessages || !dialog_id"></div> <div class="inbox-messages-scroll" v-else> <infinite-loading @infinite="infinite" direction="top" spinner="spiral" ref="infiniteLoading"> <span slot="no-results">Нет сообщений</span> <span slot="no-more"></span> </infinite-loading> <div v-for="m in messages" class="inbox-message inbox-message"> <div class="inbox-message-content" :class="{received: m.who == 'u', sent: m.who == 'b'}"> <div class="inbox-message-avatar" :style="{backgroundImage: 'url('+((m.who == 'u')?('//'+$account.storage_domain+dialog.avatar):(m.avatar?m.avatar:'/s/i/taplink-logo.jpg'))+')'}"></div> <div class="inbox-message-body"> <a href='#' class="inbox-photo" v-if="m.message.pictures" @click.prevent="showPhoto(photo)" v-for="photo in m.message.pictures"><img :src='photo'></a> <div v-if="m.message.document"> <b>{{m.message.document.file_name}}</b><br>{{m.message.document.file_size}} </div> <div v-if="m.message && m.message.text" v-html="m.message.text" class="inbox-message-text"></div> </div> </div> </div> </div> <div class="inbox-messages-footer"> <textarea v-model="text" class="input" placeholder="Написать сообщение ..." @keydown="textKeydown"></textarea> <div class="level"> <div class="level-left"></div> <div class="level-right"><button class="button is-primary" :class="{'is-loading': isSending}" @click="sendMessage">Отправить</button></div> </div> </div> <b-loading :is-full-page="false" :active.sync="isFetchingMessages"></b-loading> </div> <div class="inbox-sidebar"> <div class="inbox-header">Детали</div> <div v-for="d in details" class="inbox-details-block"> <div class="row has-mb-1" v-for="r in d.rows"><div class="col-xs-5 has-text-grey">{{r.title}}:</div> <div class="col-xs-7">{{r.value}}</div></div> </div> </div> </div>`});
window.$app.defineModule("inbox", []);