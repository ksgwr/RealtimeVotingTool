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
                        <div class="badge" v-if="item.point > 0">{{item.point}}</div>
                        </li>
                    </ul>
                </div>
            </v-expansion-panel-text>
        </v-expansion-panel>
    </v-expansion-panels>
</template>

<script>

    export default {
        name: 'Result',
        props: ['id', 'history'],
        data() {
            return {
                results : [],
                panel: [0],
                viewType: 0
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
                    for (let i=0;i<this.results.length;i++) {
                        let items = this.results[i].items;
                        for (let j=0;j<items.length;j++) {
                            let item = items[j];
                            let point = item.results == undefined ? 0 : item.results.length;
                            this.results[i].items[j].point = point;
                        }
                    }


                    console.log(this.results);
                });
        },
        methods: {
            changeUrl(history) {
                this.$router.push(`/room/${this.id}/results/${history}`);
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
    box-shadow: 0 0 5px #333;
    border-radius: 50%;
    background: #333;
    color: white;
    font-size: 1.2rem;
    text-align: center;
}
</style>