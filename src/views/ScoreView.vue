<template>
  <div class="Score">
    <h1>Gestión de Notas</h1>
    <ScoreAddForm @saved="refreshList" ref="scoreForm"/>
    <ScoreList @edit="edit" ref="scoreList"/>
  </div>
</template>
<script>
    import ScoreAddForm from '@/components/scores/ScoreAddForm.vue';
    import ScoreList from '@/components/scores/ScoreList.vue';
    export default {
    name: 'ScoreView',
    components: {
        ScoreAddForm,
        ScoreList
    },
    methods: {
        refreshList() {
            this.$refs.scoreList.getScores()
        },
        edit(score) {
            this.$refs.scoreForm.fillScoreFormToEdit(score)
        }
    }
};
</script>
