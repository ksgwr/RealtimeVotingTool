<template>
    <EditButton v-model="edit" @change="onChangeEdit" />
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

  import EditButton from '@/components/modules/EditButton.vue'

  const BOOL = {
    LOADING_TRUE: 2,
    TRUE: 1,
    FALSE: -1,
    LOADING_FALSE: -2
  }

  export default {
    name: 'Vote',
    components: {
      EditButton
    },
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
            ],
            edit : BOOL.FALSE,
            editLoading : false
      }
    },
    methods: {
      onChangeEdit(v) {
        console.log(v);
        console.log(`onChange $v`);
      }
    },
    watch: {
      edit() {
        console.log(`edit changed $edit`);
        if (Math.abs(this.edit) == 2) {
          this.socket.emit('update_edit_mode_c2s', this.edit * -1 > 0);
          //setTimeout(() => (this.edit = this.edit / 2 * -1), 3000);
        }
      }
    },
    mounted() {
      this.socket.on('update_users', (users) => {
        console.log(users);
        this.users = users;
      });

      this.socket.on('update_edit_mode', (edit) => {
        console.log('update_edit_mode');
        console.log(edit);
        this.edit = edit ? BOOL.TRUE : BOOL.FALSE;
      });

      this.socket.on('load_data', (data) => {
        this.users = data.users;
        this.edit = data.edit ? BOOL.TRUE : BOOL.FALSE;
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