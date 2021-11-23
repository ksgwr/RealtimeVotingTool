<template>
    <div id="users">
        <p>{{ users.length }} Users</p>
    </div>
    <ul id="cards">
        <li v-for="item in items" :key="item.index" class="card">
            <p>{{ item.text }}</p>
        </li>
    </ul>
    <div id="select-box">
        <button id="select" >Select</button>
    </div>
</template>

<script>
  import io from 'socket.io-client';

  export default {
    name: 'Vote',
    data() {
      return {
            socket: io(),
            users: [
                { name: "aaa" }
            ],
            items: [
                { index: 0, text:'1' },
                { index: 1, text:'2' },
                { index: 2, text:'3' }
            ]
      }
    },
    mounted() {
      this.socket.on('update_users', (users) => {
        console.log(users);
        this.users = users;
      });

      this.socket.on('connect', () => {
        this.socket.emit('update_user', {name:"aaa"});
        console.log(this.socket.connected);
      });
    }
  }
</script>

<style scoped>
#users {
    text-align: right;
    margin-right: 20px;
}

#cards {
    display: flex;
    flex-wrap: wrap;
    list-style: none;
    justify-content: center;
}

.card {
    border: 1px solid;
    width: 100px;
    height: 150px;
    text-align: center;
    margin: 10px;
    display: table
}

.card p {
    display: table-cell;
    vertical-align: middle;
}

#select-box {
    text-align: center;
}
</style>