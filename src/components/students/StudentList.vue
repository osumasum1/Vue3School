<template>
    <div class="student-list-view-container">
        <h2 style="text-align: left;">Lista de Estudiantes</h2>
        <label for="filterText" style="font-weight: bold;">Buscar Estudiante:</label>
        <input
            type="text"
            v-model="filterText"
            class="form-control mb-3"
            placeholder="Buscar por nombre o apellidos"
        />
        <table class="base-table student-list-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Apellido Paterno</th>
                    <th>Apellido Materno</th>
                    <th>Fecha de Nacimiento</th>
                    <th>Edad</th>
                    <th>Grado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="student in filteredStudents" :key="student.id">
                    <td>{{ student.id }}</td>
                    <td>{{ student.name }}</td>
                    <td>{{ student.lastName }}</td>
                    <td>{{ student.motherLastName }}</td>
                    <td>{{ student.birthDate }}</td>
                    <td>{{ calculateAge(student.birthDate) }}</td>
                    <td>{{ student.grade }}</td>
                    <td>
                        <button class="btn btn-info" @click="$emit('edit', student)">Editar</button>
                        <button class="btn btn-danger" @click="deleteStudent(student.id)">Eliminar</button>
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
    name: 'StudentList',
    data(){
        return {
            students: [],
            loading: false,
            error: null,
            filterText: ''
        }
    },
    async mounted(){
        await this.getStudents();
    },
    computed: {
        filteredStudents() {
            return this.students.filter(student => 
                student.name.toLowerCase().includes(this.filterText.toLowerCase()) ||
                student.lastName.toLowerCase().includes(this.filterText.toLowerCase()) ||
                student.motherLastName.toLowerCase().includes(this.filterText.toLowerCase())
            );
        }
    },
    methods:{
        calculateAge,
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
        async deleteStudent(id) {
            if (confirm('¿Estás seguro de que deseas eliminar este estudiante?')) {
                try {
                    try {
                        if(await ScoreService.getScore(id) && confirm('El estudiante tiene calificaciones asociadas. Esta seguro de eliminarlo?'))  {
                            await StudentService.deleteStudent(id);
                            this.getStudents()
                            return;
                        }
                    } catch (error) {
                        await StudentService.deleteStudent(id);
                        this.getStudents()
                    }
                } catch (error) {
                    console.error('Error deleting student:', error);
                    alert('Error al eliminar el estudiante. Por favor, inténtalo de nuevo.');
                }
            }
        }
    }
};
</script>
<style src="@/assets/styles/_table_list.css"></style>