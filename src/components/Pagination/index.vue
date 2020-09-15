<template>
    <div class="app-pager">
        <el-pagination
            background
            :current-page.sync="currentPage"
            :page-size="15"
            :total="total"
            layout="total,prev, pager, next, jumper"
            @current-change="handleCurrentChange"/>
    </div>
</template>

<script>
import { scrollTo } from '@/utils/scrollTo'
    export default {
        props:{
            total:{
                type:Number,
                default:null
            },
            page: {
                type: Number,
                default: 0
            },
            autoScroll: {
                type: Boolean,
                default: true
            },
        },
        computed: {
            currentPage: {
                get() {
                    return this.page;
                },
                set(val) {
                    this.$emit('update:page', val);
                }
            }
        },
        methods: {
            handleCurrentChange(val) {
                this.$emit('pagination', { page: val});
                if (this.autoScroll) {
                    scrollTo(0, 800)
                }
            }
        },
    }
</script>