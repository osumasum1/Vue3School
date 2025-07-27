<template>
  <div class="student">
    <h1>Gestión de Estudiantes</h1>
    <StudentAddForm @saved="refreshList" ref="studentForm"/>
    <StudentList @edit="edit" ref="studentsTable"/>
  </div>
</template>
<script>
    import StudentAddForm from '@/components/students/StudentAddForm.vue';
    import StudentList from '@/components/students/StudentList.vue';
    export default {
    name: 'StudentView',
    components: {
        StudentAddForm,
        StudentList
    },
    methods: {
        refreshList() {
            this.$refs.studentsTable.getStudents()
        },
        edit(student) {
            this.$refs.studentForm.fillStudentFormToEdit(student)
        }
    }
};
</script>
