<template>
    Result
    <ul>
        <li
            v-for="result in results"
            :key="result.id">
            <ul>
                <li
                v-for="item in result.items"
                :key="item.index">
                <p>{{item.text}}</p>
                </li>
            </ul>
        </li>
    </ul>
</template>

<script>

    export default {
        name: 'Result',
        data() {
            return {
                results : []
            }
        },
        created() {
            //window.location
            this.axios.get('/result?roomId=abc')
                .then((res) => {
                    this.results = res.data;
                    console.log(res);
                });
        }
    }
</script>

<style scoped>

</style>