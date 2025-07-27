<template>
    <div class="add-score-view-container">
        <h2 style="text-align: left;">Agregar Nota</h2>

        <table class="add-score-form">
            <thead>
                <tr>
                    <th>Estudiante</th>
                    <th>Materia</th>
                    <th>Nota</th>
                    <th>Fecha</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="position: relative;">
                        <input
                        type="text"
                        placeholder="Seleccionar estudiante"
                        :value="selectedStudentDisplay"
                        @click="showDropdown = !showDropdown"
                        readonly
                        tabindex="0"
                        style="width: 180px;"
                        />
                        <div
                        v-if="showDropdown"
                        class="table"
                        style="position: absolute; z-index: 10; background: #fff; border: 1px solid #ccc; max-height: 200px; overflow-y: auto;"
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
                    </td>
                    <td><input type="text" v-model="score.subject" placeholder="Materia"></td>
                    <td><input type="text" v-model="score.note" placeholder="Nota"></td>
                    <td>
                        <input type="date" v-model="score.date">
                    </td>
                    <td>
                        <button @click="saveScore" class="btn btn-primary">Guardar</button>
                        <button @click="resetForm" class="btn btn-danger">Limpiar</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
import { calculateAge } from '@/utils/dateUtils';
import StudentService from '@/services/StudentService';
import ScoreService from '@/services/ScoreService';
export default {
    name: 'StudentAddForm',
    data() {
        return {
            students: [],
            score: {
                id: null,
                studentId: '',
                subject: '',
                note: '',
                date: ''
            },
            showDropdown: false
        };
    },
    async mounted(){
        document.addEventListener('click', this.handleClickOutside);
        await this.getStudents();
    },
    beforeUnmount() {
        document.removeEventListener('click', this.handleClickOutside);
    },
    computed: {
        selectedStudent() {
            return this.students.find(s => s.id === this.score.studentId) || null;
        },
        selectedStudentDisplay() {
            return this.selectedStudent
            ? `${this.selectedStudent.name} ${this.selectedStudent.lastName}`
            : '';
        }
    },   
    methods: {
        calculateAge,
        selectStudent(student) {
            this.score.studentId = student.id;
            this.showDropdown = false;
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
        
        handleClickOutside(event) {
            setTimeout(() => {
                // Si el clic NO fue en el input NI en el dropdown, ciérralo
                const input = this.$el.querySelector('input[placeholder="Seleccionar estudiante"]');
                const dropdown = this.$el.querySelector('.dropdown-table');
                if (
                    this.showDropdown &&
                    !input.contains(event.target) &&
                    (!dropdown || !dropdown.contains(event.target))
                ) {
                    this.showDropdown = false;
                }
            }, 0);
        },
        saveScore() {
            console.log("Guardando nota:", this.score);
            if (!this.score.studentId || !this.score.subject 
                || !this.score.note || !this.score.date) {
                alert('Por favor, complete todos los campos.');
                return;
            }
            if (this.score.id) {
                delete this.score.student; // Evitar enviar el objeto completo del estudiante
                // Actualizar la nota existente
                this.score.note = parseFloat(this.score.note);
                ScoreService.putScore(this.score.id,this.score).then(() => {
                    this.$emit('saved');
                });
                this.resetForm();
                return;
            }
            ScoreService.postScore(this.score).then(() => {
              this.$emit('saved')  
            })
            return;
        },
        fillScoreFormToEdit(score) {
            this.score = { ...score };
        },
        resetForm(){
            this.score= {
                id: null,
                studentId: '',
                subject: '',
                note: '',
                date: ''
            }
        }
    }
};
</script>
<style src="@/assets/styles/_forms.css"></style>
<style src="@/assets/styles/_table_dropdown.css"></style>
