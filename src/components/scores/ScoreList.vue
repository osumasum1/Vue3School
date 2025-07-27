<template>
    <div class="score-list-view-container">
        <h2 style="text-align: left;">Lista de Notas</h2>
            <input
                type="text"
                placeholder="Seleccionar estudiante"
                :value="selectedStudentDisplay"
                @click="showDropdownFilter = !showDropdownFilter"
                readonly
                tabindex="0"
                style="width: 180px; float: left; margin-bottom: 10px;"
            />
            <button class="btn btn" style="float: left; margin-left: 10px;" @click="removeFilter">Remover Filtro</button>
            <div
                v-if="showDropdownFilter"
                class="table"
                style="margin-top: 35px; position: absolute; z-index: 10; background: #fff; border: 1px solid #ccc; max-height: 200px; overflow-y: auto;"
            >
                <table class="dropdown-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Apellido Paterno</th>
                            <th>Apellido Materno</th>
                            <th>Fecha Nacimiento</th>
                            <th>Edad</th>
                            <th>Grado</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="student in students"
                            :key="student.id"
                            @mousedown.prevent="selectStudent(student)"
                            style="cursor: pointer;"
                        >
                            <td>{{ student.name }}</td>
                            <td>{{ student.lastName }}</td>
                            <td>{{ student.motherLastName }}</td>
                            <td>{{ student.birthDate }}</td>
                            <td>{{ calculateAge(student.birthDate) }}</td>
                            <td>{{ student.grade }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

        <table class="base-table score-list-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Estudiante</th>
                    <th>Grado</th>
                    <th>Materia</th>
                    <th>Nota</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="score in filteredNotes" :key="score.id">
                    <td>{{ score.id }}</td>
                    <td>{{ score.student.name }} {{ score.student.lastName }}</td>
                    <td>{{ score.student.grade }}</td>
                    <td>{{ score.subject }}</td>
                    <td>{{ score.note }}</td>
                    <td>{{ score.date }}</td>
                    <td>
                        <button class="btn btn-info" @click="$emit('edit', score)">Editar</button>
                        <button class="btn btn-danger" @click="deleteScore(score.id)">Eliminar</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
import { calculateAge } from '@/utils/dateUtils';
import ScoreService from '@/services/ScoreService';
import StudentService from '@/services/StudentService';
export default {
    name: 'ScoreList',
    data(){
        return {
            scores: [],
            students: [],
            loading: false,
            error: null,
            showDropdownFilter: false,
            studentId: '',
        };
    },
    computed: {
        selectedStudent() {
            return this.students.find(s => s.id === this.studentId) || null;
        },
        selectedStudentDisplay() {
            return this.selectedStudent
            ? `${this.selectedStudent.name} ${this.selectedStudent.lastName}`
            : '';
        },
        filteredNotes() {
            if (!this.studentId) return this.scores;
            // Filtrar las notas por el estudiante seleccionado
            return this.scores.filter(score => 
                score.studentId === this.studentId
            );
        }
    },
    async mounted(){
        await this.getScores();
        document.addEventListener('click', this.handleClickOutside);
        await this.getStudents();
    },
    methods:{
        calculateAge,
        removeFilter() {
            this.studentId = '';
        },
        selectStudent(student) {
            this.studentId = student.id;
            this.showDropdownFilter = false;
        },
        async getScores(){
            this.loading = true;
            this.error = null;
            try {
                this.scores = await ScoreService.getScores();
            } catch(error) {
                this.error = error;
                console.error("Error to get all scores:", error);
            } finally{
                this.loading = false;
            }
        },
        async getStudents(){
            this.loading = true;
            this.error = null;
            try {
                this.students = await StudentService.getStudents();
            } catch(error) {
                this.error = error;
                console.error("Error to get all students:", error);
            } finally{
                this.loading = false;
            }
        },
        async deleteScore(id) {
            if (confirm('¿Estás seguro de que deseas eliminar esta calificación?')) {
                try {
                    await ScoreService.deleteScore(id);
                    this.getScores();
                } catch (error) {
                    console.error('Error deleting score:', error);
                    alert('Error al eliminar la calificación. Por favor, inténtalo de nuevo.');
                }
            }
        },
        handleClickOutside(event) {
            setTimeout(() => {
                // Si el clic NO fue en el input NI en el dropdown, ciérralo
                const input = this.$el.querySelector('input[placeholder="Seleccionar estudiante"]');
                const dropdown = this.$el.querySelector('.dropdown-table');
                if (
                    this.showDropdownFilter &&
                    !input.contains(event.target) &&
                    (!dropdown || !dropdown.contains(event.target))
                ) {
                    this.showDropdownFilter = false;
                }
            }, 0);
        }
    }
};
</script>
<style src="@/assets/styles/_table_list.css"></style>