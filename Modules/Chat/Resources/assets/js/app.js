import $ from "jquery"
import VueResource from "vue-resource"
import Echo from "laravel-echo"
import Pusher from "pusher-js"
import Vue from "vue"

Vue.use(VueResource);
window.Echo = new Echo({
    broadcaster: 'pusher',
    key: process.env.MIX_PUSHER_APP_KEY,
    cluster: process.env.MIX_PUSHER_APP_CLUSTER,
});
const app = new Vue({
    el: '#chat-app',
    data: {
        chatMessage: [],
        userId: null,
        chats: [],
        chatWindows: [],
        chatStatus: 0,
        chatWindowStatus: [],
        chatCount: []
    },
    created() {
        window.Echo.channel('chat-message-' + window.user_id)
            .listen('.ChatMessage', (e) => {
                console.log(e);
                this.userId = e.message.source_user_id;
                if (this.chats[this.userId]) {
                    this.show = 1;
                    this.$set(app.chats[this.userId], this.chatCount[this.userId], e.message);
                    this.chatCount[this.userId]++;
                    console.log("pusher");
                    console.log(this.chats[this.userId]);
                } else {
                    this.createChatWindow(e.message.source_user_id, e.message.name)
                    this.$set(app.chats[this.userId], this.chatCount[this.userId], e.message);
                    this.chatCount[this.userId]++;
                }
            })
    },
    http: {
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    },
    methods: {
        sendMessage(event) {
            this.userId = event.target.id;
            var message = this.chatMessage[this.userId];

            this.$http.post('chat/send', {
                'user_id': this.userId,
                'message': message,
                'socket_id': window.Echo.socketId()
            }).then(response => {
                this.chatMessage[this.userId] = '';
                this.$set(app.chats[this.userId], this.chatCount[this.userId], {
                    "message": message,
                    "name": window.username
                });
                this.chatCount[this.userId]++;
                console.log("send");
            }, response => {
                this.error = 1;
                console.log("error");
                console.log(response);
            });
        },
        getUserId(event) {
            this.userId = event.target.id;
            this.createChatWindow(this.userId, event.target.innerHTML);
            console.log(this.userId);
        },
        createChatWindow(user_id, username) {
            if (!this.chatWindowStatus[user_id]) {
                this.chatWindowStatus[user_id] = 1;
                this.chatMessage[user_id] = '';
                this.$set(app.chats, user_id, {});
                this.$set(app.chatCount, user_id, 0);
                this.chatWindows.push({"senderid": user_id, "name": username});
            }
        }
    }
});