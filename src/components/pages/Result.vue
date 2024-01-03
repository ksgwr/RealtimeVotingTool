<template>
    <v-expansion-panels v-model="panel">
        <v-expansion-panel
            v-for="result in results"
            :key="result.id"
            @click="changeUrl(result.id)"
            >
            <v-expansion-panel-title>{{result.id}}</v-expansion-panel-title>
            <v-expansion-panel-text>
                <div v-if="viewType == 0">
                    <ul id="cards">
                        <li
                        v-for="item in result.items"
                        :key="item.index"
                        class="card"
                        >
                        <div class="card-contents">
                            <p>{{item.text}}</p>
                        </div>
                        <div class="clickable-badge" @click="item.detail && openDialog(item)" v-if="item.detail && item.point > 1"
                            >{{item.point}}
                        </div>
                        <div class="icon-badge" v-else-if="item.detail && item.results.length == 1"
                            ><UserIcon :user="item.results[0]" :tooltip="true" />
                        </div>
                        <div class="badge" v-else-if="item.point > 0"
                            >{{item.point}}
                        </div>
                        </li>
                    </ul>
                </div>
            </v-expansion-panel-text>
        </v-expansion-panel>
    </v-expansion-panels>
    <v-dialog
        v-model="dialog"
        scrollable
        width="auto">
        <v-card>
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col v-for="result in dialogItem.results"
                            :key="result.userId"
                        >
                            <UserIcon :user="result" nameView="true" />
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-btn color="primary" block @click="dialog = false">Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>

    import UserIcon from '@/components/modules/UserIcon.vue';

    export default {
        name: 'Result',
        props: ['id', 'history'],
        components: {
            UserIcon
        },
        data() {
            return {
                results : [],
                panel: [0],
                viewType: 0,
                dailogItem : null,
                dialog : false,
                toolTipShow : false
            }
        },
        created() {
            //window.location
            this.axios.get(`/result?roomId=${this.id}`)
                .then((res) => {
                    this.results = res.data.slice().reverse();
                    
                    // check focus history
                    for (let i=0;i<this.results.length;i++) {
                        if (this.results[i].id == this.history) {
                            this.panel = [i];
                            break;
                        }
                    }

                    // calc points
                    // TODO: think rank rule if needed
                    for (let i=0;i<this.results.length;i++) {
                        let items = this.results[i].items;
                        for (let j=0;j<items.length;j++) {
                            let item = items[j];
                            let point = item.results == undefined ? 0 : item.results.length;
                            this.results[i].items[j].point = point;

                            this.results[i].items[j].detail = item.results != undefined &&
                                    item.results.length > 0 &&
                                    item.results[0].userId != undefined;
                        }
                    }


                    console.log(this.results);
                });
        },
        methods: {

            changeUrl(history) {
                this.$router.push(`/room/${this.id}/results/${history}`);
            },

            openDialog(item) {
                console.log(item.detail);
                this.dialogItem = item;
                this.dialog = true;
            }
        }
    }
</script>

<style scoped>
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
    
}

.card-contents {
    width: 100%;
    height: 100%;
    display: table
}

.card-contents p {
    display: table-cell;
    vertical-align: middle;
    width: 100px;
}

.badge {
    position: relative;
    display: block;
    top: -40px;
    left: -10px;
    width: 50px;
    height: 50px;
    line-height: 50px;
    box-shadow: 0 0 5px #888;
    border-radius: 50%;
    background: #888;
    color: white;
    font-size: 1.2rem;
    text-align: center;
}

.clickable-badge {
    position: relative;
    display: block;
    cursor: pointer;
    top: -40px;
    left: -10px;
    width: 50px;
    height: 50px;
    line-height: 50px;
    box-shadow: 0 0 5px #333;
    border-radius: 50%;
    background: #333;
    color: white;
    font-size: 1.2rem;
    text-align: center;
}

.icon-badge {
    position: relative;
    display: block;
    top: -40px;
    left: -40px;
}

.hand-cursor {
  cursor: pointer;
}
</style>