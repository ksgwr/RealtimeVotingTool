const socket = io();
const app = new Vue({
  el: '#app',
  data: {
    users: [
      { name: "aaa" }
    ],
    items: [
      { index: 0, text:'1' },
      { index: 1, text:'2' },
      { index: 2, text:'3' }
    ]
  },
  methods: {
    
  },
  mounted() {
    socket.on('update_users', (users) => {
      console.log(users);
      this.users = users;
    });

    socket.on('connect', () => {
      socket.emit('update_user', {name:"aaa"});
    
      console.log(socket.connected);
    });
    
  }
});