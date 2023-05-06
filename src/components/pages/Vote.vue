<template>
    <EditButton v-model="edit" />
    <CardControlButtons v-model="cardControl" v-if="mode == MODE.EDIT" />
    <VoteControlButton v-model:voteStart="voteStart" v-model:openResults="openResults"
       v-if="MODE.BEFORE_VOTE <= mode && mode <= MODE.OPENABLE_WAITING" />
    <div id="users">
        <p><span v-if="MODE.VOTE_START <= mode && mode <= MODE.OPENABLE_WAITING">{{ votes.size }} Voted /</span>
         {{ users.length }} Users
         &nbsp;
        <v-btn icon="mdi-cog" :color="showRule > 0 ? 'grey': null" @click="toggleRule"></v-btn>
         </p>
    </div>
    <transition name="rule"><div id="rule" v-show="showRule > 0">
      <h3>ルール</h3>
      <v-radio-group v-model="ruleVotingRule" label="投票モード" :disabled="mode != MODE.EDIT" @click="changeRuleVotingRule">
        <v-radio label="完全匿名" :value="VOTING_RULE.ANONYMOUS"></v-radio>
          <div v-if="ruleVotingRule==VOTING_RULE.ANONYMOUS">投票中も投票状態は見えません。投票数のみが開示されます。</div>
        <v-radio label="結果公開のみ" :value="VOTING_RULE.REALTIME_ANONYMOUS"></v-radio>
          <div v-if="ruleVotingRule==VOTING_RULE.REALTIME_ANONYMOUS">投票中も投票状態は見えません。投票結果はユーザー毎の内訳が確認できます</div>
        <v-radio label="リアルタイム票数のみ・結果匿名" :value="VOTING_RULE.OPEN"></v-radio>
        <v-radio label="リアルタイム票数のみ・結果公開" :value="VOTING_RULE.REALTIME_ANONYMOUS_RESULT_OPEN"></v-radio>
        <v-radio label="完全公開" :value="VOTING_RULE.REALTIME_FULL_OPEN"></v-radio>
      </v-radio-group>
      <p>
        <v-text-field label="投票最大数" v-model="ruleVoteMax" inputmode="numeric" suffix="票/人" :disabled="mode != MODE.EDIT" @change="changeRuleVoteMax"></v-text-field>
      </p>
      <v-switch label="集計可能最低人数" v-model="ruleMinOpenableEnable" :disabled="mode != MODE.EDIT" @click="changeRuleMinOpenableEnable" color="green-darken-3"></v-switch>
        <div v-if="ruleMinOpenableEnable">
          <v-text-field label="集計可能最低人数" v-model="ruleMinOpenable" inputmode="numeric" suffix="人" :disabled="mode != MODE.EDIT" @change="changeRuleMinOpenable"></v-text-field>
          以上が投票を完了すると開票できます。
        </div>
      <!--v-switch label="投票制限時間" v-model="ruleRemainTimeEnable" :disabled="mode != MODE.EDIT"></v-switch-->
    </div></transition>
    <ul id="cards">
        <li
          v-for="item in items"
          :key="item.index"
          class="card"
          :contenteditable="edit > 0"
          v-on:input="onChangeItem($event, item)"
          @click="clickItem($event, item)">
            <p>{{ item.text }}</p>
        </li>
    </ul>
    <div id="select-box">
      <VoteButton v-model="voteStatus" />
    </div>
    <div id="history">
      <v-btn @click="openHistory"><v-icon left>mdi-history</v-icon>History</v-btn>
    </div>
    <v-dialog
      v-model="warningDialog"
      width="300px"
      >
      <v-card>
        <v-card-text>
          {{warningText}}
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" block @click="warningDialog = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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

  const VOTING_RULE = {
    ANONYMOUS: 1,
    REALTIME_ANONYMOUS: 2,
    OPEN: 3,
    REALTIME_ANONYMOUS_RESULT_OPEN: 4,
    REALTIME_FULL_OPEN : 5
  }

  export default {
    name: 'Vote',
    props: ['id'],
    components: {
      EditButton,
      CardControlButtons,
      VoteButton,
      VoteControlButton
    },
    data() {
      return {
            socket: io({
              query : {
                userId : localStorage.uid
              }
            }),
            users: [],
            items: [],
            edit : BOOL.TRUE,
            cardControl : BOOL.NEUTRAL,
            voteStart : BOOL.NEUTRAL,
            openResults : BOOL.NEUTRAL,
            //activeItem : null,
            activeItems : [],
            voteStatus : BOOL.NEUTRAL,
            mode: MODE.EDIT,
            showRule: BOOL.FALSE,
            ruleVotingRule : VOTING_RULE.OPEN,
            ruleVotingRuleClicked : false,
            ruleVoteMax : 1,
            ruleMinOpenableEnable : false,
            ruleMinOpenableEnableClicked : false,
            ruleMinOpenable : 1,
            ruleRemainTimeEnable : false,
            ruleRemainTime : 0,
            votes : [],
            voteId : 1,
            warningDialog: false,
            warningText: ''
      }
    },
    created() {
      this.VOTING_RULE = VOTING_RULE;
      this.MODE = MODE;
    },
    methods: {
      openHistory() {
        this.$router.push(`/room/${this.id}/results/0`);
      },
      onChangeItem(e, item) {
        console.log(e.target);
        item.text = e.target.innerText;
        console.log(item);
        this.socket.emit('edit_card_text', item);
      },
      clickItem(e, item) {
        if (this.mode < MODE.VOTE_START || MODE.OPENABLE < this.mode
          || (this.voteStatus != BOOL.NEUTRAL && this.voteStatus != BOOL.FALSE)) {
          return false;
        }

        // if clicked item, remove selected
        for (let i=0;i<this.activeItems.length;i++) {
          if (this.activeItems[i].node == e.target) {
            this.activeItems[i].node.classList.remove('selected');
            this.activeItems.splice(i, 1);
            if (this.activeItems.length == 0) {
              this.voteStatus = BOOL.NEUTRAL;
            }
            return true;
          }
        }
        if (this.activeItems.length >= this.ruleVoteMax) {
          this.activeItems[0].node.classList.remove('selected');
          this.activeItems.splice(0, 1);  
        }
        e.target.classList.add('selected');
        this.activeItems.push({node: e.target, key: item.index});
        this.voteStatus = BOOL.FALSE;
      },
      changeRuleMinOpenable() {
        console.log('changeRuleMinOpenable');
        const parsedRuleMinOpenable = parseInt(this.ruleMinOpenable);
        if (isNaN(parsedRuleMinOpenable)) {
          this.warningDialog = true;
          this.warningText = '整数を入力してください';
        } else {
          this.socket.emit('update_rule_min_openable_c2s', parsedRuleMinOpenable);
        }
      },
      changeRuleMinOpenableEnable() {
        this.ruleMinOpenableEnableClicked = true;
      },
      changeRuleVoteMax() {
        console.log(`changeRuleVoteMax ${this.ruleVoteMax}`);
        const parsedRuleVoteMax = parseInt(this.ruleVoteMax);
        if (isNaN(parsedRuleVoteMax)) {
          this.warningDialog = true;
          this.warningText = '整数を入力してください';
        } else {
          this.socket.emit('update_rule_vote_max_c2s', parsedRuleVoteMax);
        }
      },
      changeRuleVotingRule() {
        this.ruleVotingRuleClicked = true;
      },
      toggleRule() {
        this.showRule = this.showRule == BOOL.TRUE ? BOOL.FALSE : BOOL.TRUE;
      },
      updateMode(mode) {
        this.mode = mode;
        switch(mode) {
          case MODE.EDIT:
            this.edit = BOOL.TRUE;
            this.showRule = BOOL.TRUE;
            break;
          case MODE.BEFORE_VOTE:
            this.edit = BOOL.FALSE;
            this.voteStart = BOOL.FALSE;
            this.openResults = BOOL.NEUTRAL;
            this.showRule = BOOL.FALSE;
            break;
          case MODE.VOTE_START:
            this.edit = BOOL.NEUTRAL;
            this.voteStart = BOOL.TRUE;
            break;
          case MODE.VOTING:
            this.edit = BOOL.NEUTRAL;
            this.voteStart = BOOL.DISABLE_TRUE;
            this.openResults = BOOL.NEUTRAL;
            break;
          case MODE.OPENABLE:
            this.voteStart = BOOL.NEUTRAL;
            this.openResults = BOOL.FALSE;
            break;
          case MODE.RESULT:
            this.edit = BOOL.FALSE;
            this.voteStart = BOOL.FALSE;
            this.openResults = BOOL.NEUTRAL;
            this.voteStatus = BOOL.NEUTRAL;
            for (let i=0;i<this.activeItems.length;i++) {
              this.activeItems[i].node.classList.remove('selected');
            }
            this.activeItems.splice(0);
            this.$router.push(`/room/${this.id}/results/${this.voteId++}`);
            break;
          default:
        }
      }
    },
    watch: {
      cardControl() {
        console.log(`card control click $cardControl`);
        if (Math.abs(this.cardControl) == 1) {
          this.socket.emit('click_card_control', this.cardControl > 0);
        }
      },
      edit() {
        console.log(`edit changed $edit`);
        if (Math.abs(this.edit) == 2) {
          this.socket.emit('update_mode_c2s', this.edit > 0 ? MODE.BEFORE_VOTE : MODE.EDIT);
          //setTimeout(() => (this.edit = this.edit / 2 * -1), 3000);
        }
      },
      openResults() {
        if (Math.abs(this.openResults) == 2) {
          this.socket.emit('update_mode_c2s', MODE.RESULT);
        }
      },
      ruleMinOpenableEnable() {
        if (this.ruleMinOpenableEnableClicked) {
          const ruleMinOpenable = this.ruleMinOpenableEnable ? this.ruleMinOpenable : this.ruleMinOpenable * -1;
          this.socket.emit('update_rule_min_openable_c2s', ruleMinOpenable);
          this.ruleMinOpenableEnableClicked = false;
        }
      },
      ruleVotingRule() {
        console.log(`change ruleVotingRule ${this.ruleVotingRule}`);
        if (this.ruleVotingRuleClicked) {
          this.socket.emit('click_rule_voting_rule_c2s', this.ruleVotingRule);
          this.ruleVotingRuleClicked = false;
        }
      },
      voteStart() {
        console.log('clicked vote start', this.voteStart);
        if (Math.abs(this.voteStart) == 2) {
          this.socket.emit('update_mode_c2s', this.voteStart > 0 ? MODE.BEFORE_VOTE : MODE.VOTE_START);
        }
      },
      voteStatus() {
        if (this.voteStatus == 2) {
          // cancel vote
          this.socket.emit('update_vote_c2s', null);
        } else if (this.voteStatus == -2) {
          // ready vote
          console.log(this.activeItems.map(x => x.key));
          this.socket.emit('update_vote_c2s', this.activeItems.map(x => x.key));
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
      });

      this.socket.on('update_votes', (votes) => {
        console.log('update_vote');
        console.log(votes);
        this.votes = votes;
        this.updateMode(votes.mode);
        if (Math.abs(this.voteStatus) == 2) {
          this.voteStatus = this.voteStatus * -1 / 2;
        }
      });

      this.socket.on('update_rule_voting_rule', (votingRule) => {
        this.ruleVotingRule = votingRule;
        console.log(`socket receive update_rule_voting_rule ${votingRule}`);
      });

      this.socket.on('update_rule_vote_max', (voteMax) => {
        this.ruleVoteMax = voteMax;
      });

      this.socket.on('update_rule_min_openable', (minOpenable) => {
        this.ruleMinOpenable = Math.abs(minOpenable);
        this.ruleMinOpenableEnable = minOpenable > 0;
      });

      this.socket.on('load_data', (data) => {
        console.log(`load_data mode ${data.mode}`);
        this.users = data.users;
        this.items = data.items;
        this.updateMode(data.mode);
        this.votes = data.votes;
        this.ruleVotingRule = data.rules.votingRule;
        this.ruleVoteMax = data.rules.voteMax;
        this.ruleMinOpenable = Math.abs(data.rules.minOpenable);
        this.ruleMinOpenableEnable = data.rules.minOpenable > 0;
        //this.ruleRemainTime = data.rules.remainTime;
        this.voteId = data.voteId;
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

#rule {
  border: 1px solid;
  width: 50%;
  float: right;
}

.rule-enter-to {
  transition: transform 1.3s ease-out;
  transform: translateX(0px);
}
.rule-enter-from {
  transform: translateX(600px);
}

.rule-leave-to {
  transition: transform 1.3s ease-out;
  transform: translateX(600px);
}
.rule-leave-from {
  transform: translateX(0px);
}

#select-box {
    text-align: center;
}

#history {
    text-align: right;
    margin-right: 20px;
}
</style>