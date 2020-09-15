<template>
    <div class="hello">
        你好，{{userName}}
    </div>
</template>

<script>
    export default {
        data() {
            return {
                userName: 'admin',
            }
        },
    }
</script>

<style scoped>
    .hello {
        text-align: center;
        font-size: 28px;
        padding-top: 50px
    }
</style>
