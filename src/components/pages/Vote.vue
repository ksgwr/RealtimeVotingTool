<template>
    <EditButton v-model="edit" />
    <CardControlButtons v-model="cardControl" :edit="edit" />
    <div id="users">
        <p>{{ users.length }} Users</p>
    </div>
    <ul id="cards">
        <li
          v-for="item in items"
          :key="item.index"
          class="card"
          :contenteditable="edit > 0"
          v-on:input="onChangeItem"
          @click="edit < 0 && clickItem($event)">
            <p>{{ item.text }}</p>
        </li>
    </ul>
    <div id="select-box">
      <VoteButton v-model="voteStatus" />
    </div>
</template>

<script>
  import io from 'socket.io-client';

  import CardControlButtons from '@/components/modules/CardControlButtons.vue';
  import EditButton from '@/components/modules/EditButton.vue';
  import VoteButton from '@/components/modules/VoteButton.vue'

  const BOOL = {
    LOADING_TRUE: 2,
    TRUE: 1,
    NEUTRAL: 0,
    FALSE: -1,
    LOADING_FALSE: -2
  }

  export default {
    name: 'Vote',
    components: {
      EditButton,
      CardControlButtons,
      VoteButton
    },
    data() {
      return {
            socket: io(),
            users: [],
            items: [],
            edit : BOOL.TRUE,
            cardControl : BOOL.NEUTRAL,
            activeItem : null,
            voteStatus : BOOL.NEUTRAL
      }
    },
    methods: {
      onChangeItem(e) {
        console.log(e.target);
      },
      clickItem(e) {
        if (this.activeItem) {
          this.activeItem.classList.remove('selected');
        }
        if (this.activeItem != e.target) {
          this.activeItem = e.target;
          this.activeItem.classList.add('selected');
          this.voteStatus = BOOL.FALSE;
        } else {
          this.activeItem = null;
          this.voteStatus = BOOL.NEUTRAL;
        }
      }
    },
    watch: {
      edit() {
        console.log(`edit changed $edit`);
        if (Math.abs(this.edit) == 2) {
          this.socket.emit('update_edit_mode_c2s', this.edit * -1 > 0);
          //setTimeout(() => (this.edit = this.edit / 2 * -1), 3000);
        }
      },
      cardControl() {
        console.log(`card control click $cardControl`);
        if (Math.abs(this.cardControl) == 1) {
          this.socket.emit('click_card_control', this.cardControl > 0);
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

      this.socket.on('update_items', (items) => {
        this.cardControl = BOOL.NEUTRAL;
        this.items = items;
      })

      this.socket.on('load_data', (data) => {
        this.users = data.users;
        this.items = data.items;
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

.selected {
  background-color: yellow;
}

#select-box {
    text-align: center;
}
</style>