<template>
    <div class="add-student-view-container">
        <h2 style="text-align: left;">Agregar Estudiante</h2>

        <table class="add-student-form">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Apellido Paterno</th>
                    <th>Apellido Materno</th>
                    <th>Fecha de Nacimiento</th>
                    <th>Grado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><input type="text" v-model="student.name" placeholder="Nombre"></td>
                    <td><input type="text" v-model="student.lastName" placeholder="Apellido Paterno"></td>
                    <td><input type="text" v-model="student.motherLastName" placeholder="Apellido Materno"></td>
                    <td>
                        <input type="date" v-model="student.birthDate">
                        <div v-if="student.birthDate" style="position: absolute; font-size: 0.9em; color: gray; font-style: italic; font-size: smaller;">
                            Edad: {{ calculateAge(student.birthDate) }} años
                        </div>
                    </td>
                    <td><input type="text" v-model="student.grade" placeholder="Grado"></td>
                    <td>
                        <button @click="saveStudent" class="btn btn-primary">Guardar</button>
                        <button @click="resetForm" class="btn btn-danger">Cancelar</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
import { calculateAge } from '@/utils/dateUtils';
import StudentService from '@/services/StudentService';
export default {
    name: 'StudentAddForm',
    data() {
        return {
            student: {
                id: null,
                name: '',
                lastName: '',
                motherLastName: '',
                birthDate: '',
                grade: ''
            }
        };
    },
    methods: {
        calculateAge,
        saveStudent() {
            if (!this.student.name || !this.student.lastName 
                || !this.student.motherLastName || !this.student.birthDate 
                || !this.student.grade) {
                alert('Por favor, complete todos los campos.');
                return;
            }
            if (this.student.id) {
                StudentService.putStudent(this.student.id,this.student).then(() => {
                    this.$emit('saved');
                    this.resetForm();
                });
                return;
            }
            StudentService.postStudent(this.student).then(() => {
              this.$emit('saved')  
              this.resetForm()
            })
            return;
        },
        fillStudentFormToEdit(student) {
            this.student = { ...student };
        },
        resetForm(){
            this.student= {
                name: '',
                lastName: '',
                motherLastName: '',
                birthDate: '',
                grade: ''
            }
        }
    }
};
</script>
<style src="@/assets/styles/_forms.css"></style>