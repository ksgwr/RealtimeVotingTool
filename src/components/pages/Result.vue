<template>
    Result
</template>

<script>

    export default {
        name: 'Result',
        data() {
            return {
            }
        },
        mounted() {
            //window.location
            this.axios.get('/results?roomId=abc')
                .then((res) => {
                    console.log(res);
                });
        }
    }
</script>

<style scoped>

</style>