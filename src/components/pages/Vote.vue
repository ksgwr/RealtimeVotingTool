<template>
    <EditButton v-model="edit" />
    <CardControlButtons v-model="cardControl" v-if="mode == MODE.EDIT" />
    <VoteControlButton v-model:voteStart="voteStart" v-model:openResults="openResults"
       v-if="MODE.BEFORE_VOTE <= mode && mode <= MODE.VOTING" />
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
          @click="clickItem($event)">
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
  import VoteButton from '@/components/modules/VoteButton.vue';
  import VoteControlButton from '@/components/modules/VoteControlButton.vue';

  const BOOL = {
    DISABLE_TRUE: 3,
    LOADING_TRUE: 2,
    TRUE: 1,
    NEUTRAL: 0, // display:off
    FALSE: -1,
    LOADING_FALSE: -2,
    DISABLE_FALSE: -3
  };
  const MODE = {
    EDIT: 0,
    BEFORE_VOTE: 1,
    VOTE_START: 2,
    VOTING: 3,
    OPENABLE: 4,
    OPENABLE_WAITING: 5,
    RESULT: 6
  };

  export default {
    name: 'Vote',
    components: {
      EditButton,
      CardControlButtons,
      VoteButton,
      VoteControlButton
    },
    data() {
      return {
            socket: io(),
            users: [],
            items: [],
            edit : BOOL.TRUE,
            cardControl : BOOL.NEUTRAL,
            voteStart : BOOL.NEUTRAL,
            openResults : BOOL.NEUTRAL,
            activeItem : null,
            voteStatus : BOOL.NEUTRAL,
            mode: MODE.EDIT,
            votes: {
              size : 0
            }
      }
    },
    created() {
      this.MODE = MODE;
    },
    methods: {
      onChangeItem(e) {
        console.log(e.target);
      },
      clickItem(e) {
        if (this.mode < MODE.VOTE_START || MODE.OPENABLE < this.mode) {
          return false;
        }
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
      },
      updateMode(mode) {
        this.mode = mode;
        switch(mode) {
          case MODE.EDIT:
            this.edit = BOOL.TRUE;
            break;
          case MODE.BEFORE_VOTE:
            this.edit = BOOL.FALSE;
            this.voteStart = BOOL.FALSE;
            this.openResults = BOOL.NEUTRAL;
            break;
          case MODE.VOTE_START:
            this.edit = BOOL.NEUTRAL;
            this.voteStart = BOOL.TRUE;
            break;
          case MODE.VOTING:
            this.edit = BOOL.NEUTRAL;
            this.voteStart = BOOL.FALSE;
            this.openResults = BOOL.NEUTRAL;
            break;
          default:
        }
      }
    },
    watch: {
      edit() {
        console.log(`edit changed $edit`);
        if (Math.abs(this.edit) == 2) {
          this.socket.emit('update_mode_c2s', this.edit > 0 ? MODE.BEFORE_VOTE : MODE.EDIT);
          //setTimeout(() => (this.edit = this.edit / 2 * -1), 3000);
        }
      },
      cardControl() {
        console.log(`card control click $cardControl`);
        if (Math.abs(this.cardControl) == 2) {
          this.socket.emit('click_card_control', this.cardControl > 0);
        }
      },
      voteStart() {
        console.log('clicked vote start', this.voteStart);
        if (Math.abs(this.voteStart) == 2) {
          this.socket.emit('update_mode_c2s', this.voteStart > 0 ? MODE.BEFORE_VOTE : MODE.VOTE_START);
        }
      },
      openResults() {
        if (Math.abs(this.openResults) == 2) {
          this.socket.emit('update_mode_c2s', MODE.RESULT);
        }
      }
    },
    mounted() {
      this.socket.on('update_users', (users) => {
        console.log(users);
        this.users = users;
      });

      this.socket.on('update_mode', (mode) => {
        console.log('update_mode');
        this.updateMode(mode);
      });

      this.socket.on('update_items', (items) => {
        this.cardControl = BOOL.NEUTRAL;
        this.items = items;
      })

      this.socket.on('load_data', (data) => {
        this.users = data.users;
        this.items = data.items;
        this.updateMode(data.mode);
        this.votes = data.votes;
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