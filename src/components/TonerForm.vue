<!-- src/components/TonerForm.vue -->
<template>
    <div>
        <h2>{{ isEdit ? 'Editar Toner' : 'Adicionar Toner' }}</h2>
        <form @submit.prevent="saveToner">
            <div>
                <label for="name">Nome do Toner:</label>
                <input type="text" v-model="toner.name" required />
            </div>
            <div>
                <label for="compatible">Marca/Modelo Compatível:</label>
                <input type="text" v-model="toner.compatible" required />
            </div>
            <div>
                <label for="code">Código:</label>
                <input type="text" v-model="toner.code" required />
            </div>
            <div>
                <label for="minLevel">Nível Mínimo de Estoque:</label>
                <input type="number" v-model.number="toner.minLevel" min="0" required />
            </div>
            <button type="submit">{{ isEdit ? 'Atualizar' : 'Adicionar' }}</button>
            <router-link to="/toners">Cancelar</router-link>
            <div>
                <label for="currentStock">Estoque Atual:</label>
                <input type="number" v-model.number="toner.currentStock" min="0" required />
            </div>
        </form>
    </div>
</template>

<script>
import StorageService from '../services/StorageService';

export default {
    name: 'TonerForm',
    props: ['id'],
    data() {
        return {
            toners: [],
            toner: {
                id: null,
                name: '',
                compatible: '',
                code: '',
                minLevel: 0,
                currentStock: 0,
            },

            isEdit: false,
        };
    },
    created() {
        this.toners = StorageService.getData('toners');
        if (this.id) {
            const existingToner = this.toners.find(t => t.id === parseInt(this.id));
            if (existingToner) {
                this.toner = { ...existingToner };
                this.isEdit = true;
            }
        }
    },
    methods: {
        saveToner() {
            if (this.isEdit) {
                const index = this.toners.findIndex(t => t.id === this.toner.id);
                if (index !== -1) {
                    this.toners.splice(index, 1, this.toner);
                }
            } else {
                this.toner.id = StorageService.generateId(this.toners);
                this.toners.push(this.toner);
            }
            StorageService.setData('toners', this.toners);
            this.$router.push('/toners');
        },
    },
};
</script>

<style scoped>
form div {
    margin-bottom: 10px;
}

label {
    display: inline-block;
    width: 200px;
}

input {
    padding: 5px;
    width: 300px;
}

button {
    margin-right: 10px;
}
</style>