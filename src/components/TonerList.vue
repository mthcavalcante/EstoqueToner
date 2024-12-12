<!-- src/components/TonerList.vue -->
<template>
    <div>
        <h2>Lista de Toners</h2>
        <router-link to="/toners/add">Adicionar Novo Toner</router-link>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nome do Toner</th>
                    <th>Marca/Modelo Compatível</th>
                    <th>Código</th>
                    <th>Nível Mínimo</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="toner in toners" :key="toner.id">
                    <td>{{ toner.id }}</td>
                    <td>{{ toner.name }}</td>
                    <td>{{ toner.compatible }}</td>
                    <td>{{ toner.code }}</td>
                    <td>{{ toner.minLevel }}</td>
                    <td>
                        <router-link :to="`/toners/edit/${toner.id}`">Editar</router-link>
                        <button @click="deleteToner(toner.id)">Excluir</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import StorageService from '../services/StorageService';

export default {
    name: 'TonerList',
    data() {
        return {
            toners: [],
        };
    },
    created() {
        this.loadToners();
    },
    methods: {
        loadToners() {
            this.toners = StorageService.getData('toners');
        },
        deleteToner(id) {
            if (confirm('Tem certeza que deseja excluir este toner?')) {
                this.toners = this.toners.filter(toner => toner.id !== id);
                StorageService.setData('toners', this.toners);
            }
        },
    },
};
</script>

<style scoped>
table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    padding: 8px;
    border: 1px solid #ccc;
}

button {
    margin-left: 5px;
}
</style>