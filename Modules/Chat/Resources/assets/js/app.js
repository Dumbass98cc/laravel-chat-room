import $ from "jquery"
import VueResource from "vue-resource"
import Echo from "laravel-echo"
import Pusher from "pusher-js"
import Vue from "vue"

Vue.use(VueResource);
window.Echo = new Echo({
    broadcaster: 'pusher',
    key: 'process.env.MIX_PUSHER_APP_KEY',
    cluster: 'process.env.MIX_PUSHER_APP_CLUSTER'
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
        window.Echo.channel('chat-message' + window.userid)
            .listen('ChatMessage', (e) => {
                console.log(e.user);
                this.userId = e.user.sourceuserid;
                if (this.chats[this.userId]) {
                    this.show = 1;
                    this.$set(app.chats[this.userId], this.chatCount[this.userId], e.user);
                    this.chatCount[this.userId]++;
                    console.log("pusher");
                    console.log(this.chats[this.userId]);
                } else {
                    this.createChatWindow(e.user.sourceuserid, e.user.name)
                    this.$set(app.chats[this.userId], this.chatCount[this.userId], e.user);
                    this.chatCount[this.userId]++;
                }
            });
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
                'message': message
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
        createChatWindow(userid, username) {
            if (!this.chatWindowStatus[userid]) {
                this.chatWindowStatus[userid] = 1;
                this.chatMessage[userid] = '';
                this.$set(app.chats, userid, {});
                this.$set(app.chatCount, userid, 0);
                this.chatWindows.push({"senderid": userid, "name": username});
            }
        }
    }
});