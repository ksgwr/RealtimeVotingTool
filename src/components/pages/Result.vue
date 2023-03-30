<template>
    Result
    <v-expansion-panels v-model="panel">
        <v-expansion-panel
            v-for="result in results"
            :key="result.id"
            @click="changeUrl(result.id)"
            >
            <v-expansion-panel-title>{{result.id}}</v-expansion-panel-title>
            <v-expansion-panel-text>
                <ul>
                <li
                v-for="item in result.items"
                :key="item.index">
                <p>{{item.text}}</p>
                </li>
                </ul>
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
                panel: [0]
            }
        },
        created() {
            //window.location
            this.axios.get(`/result?roomId=${this.id}`)
                .then((res) => {
                    this.results = res.data.slice().reverse();
                    for (let i=0;i<this.results.length;i++) {
                        if (this.results[i].id == this.history) {
                            this.panel = [i];
                            break;
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

</style>