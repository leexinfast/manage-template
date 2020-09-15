<template>
    <div class="app-container" style="background:#f6f6f6">
        <component :is="currentRole"/>
    </div>
</template>

<script>
    import adminDashboard from './admin'
    import editorDashboard from './editor'

    export default {
        name: 'dashboard',
        components: {adminDashboard, editorDashboard},
        data() {
            return {
                currentRole: 'editorDashboard'
            }
        },
        created() {
            this.currentRole = 'editorDashboard'
        }
    }
</script>
