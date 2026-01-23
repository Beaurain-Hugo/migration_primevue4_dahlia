<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
      <div class="card p-4 flex items-center justify-between" style="flex: 1 1 22%;">
        <i class="pi pi-calendar text-blue-500 text-3xl"></i>
        <div>
          <h5>Tâche à faire</h5>
          <p class="text-xl font-bold">{{ actions.TODO?.length }}</p>
        </div>
      </div>
      <div class="card p-4 flex items-center justify-between" style="flex: 1 1 22%;">
        <i class="pi pi-wallet text-green-500 text-3xl"></i>
        <div>
          <h5>Tâche en cours</h5>
          <p class="text-xl font-bold">{{ actions.DOING?.length }} €</p>
        </div>
      </div>
      <div class="card p-4 flex items-center justify-between" style="flex: 1 1 22%;">
        <i class="pi pi-minus text-red-500 text-3xl"></i>
        <div>
          <h5>Tâches terminées</h5>
          <p class="text-xl font-bold">{{ actions.DONE?.length }} €</p>
        </div>
      </div>
    </div>
    <div v-for="(action, index) in actions" :key="index">
        {{ index }}
        <div v-for="(a, i) in action" :key="i">
            <Card>
                <template #header>
                    <span>{{ a.titre }}</span>
                    <span>{{ a.priorite }}</span>
                    <PButton :label="index.toString() == 'TODO' ? 'Commencer' : 'Terminer'" @click="index.toString() == 'TODO' ? editAction(a.id, 'DOING') : editAction(a.id, 'DONE')" />
                    <PButton severity="danger" variant="text" icon="pi pi-trash" @click="deleteAction(a.id)"  />
                </template>
                <template #content>
                    <span>{{ a.description }}</span>
                </template>
                <template #footer>
                    <div>
                        <span class="pi pi-calendar"></span>
                        <span>{{ a.deadline }}</span>
                    </div>
                    <div>
                        <span class="pi pi-tag"></span>
                        <span>{{ a.categorie }}</span>
                    </div>
                    <div>
                        <span class="pi pi-user"></span>
                        <span>{{ a.responsable_name }}</span>
                    </div>
                </template>
            </Card>

        </div>
    </div>
       <div >
            <label for="titre">Titre du action *</label>
            <InputText v-model="action.titre" id="titre" placeholder="Ex: Validation du budget" />
            <label for="description">Description du action *</label>
            <InputText v-model="action.description" id="description" placeholder="Ex: Validation du budget" />
             <label for="categorie">Categorie du action *</label>
            <InputText v-model="action.categorie" id="categorie" placeholder="Budgétaire" />
            <label for="date">Date d'échéance *</label>
            <DatePicker updateModelType="string" showIcon inputId="date" v-model="action.deadline" dateFormat="dd/mm/yy" placeholder="Sélectionner une date" />
            <label for="resp">Assigné à *</label>
            <Select v-model="action.responsable_id" id="resp" :options="membres" optionLabel="username" optionValue="user_id" placeholder="Sélectionner le responsable" />
            <label for="prio">Priorité *</label>
            <Select defaultValue="mid" v-model="action.priorite" id="prio" :options="priorite" optionLabel="name" optionValue="code" placeholder="Sélectionner le responsable" />
            <label for="etat">État *</label>
            <Select defaultValue="TODO" v-model="action.etat" id="etat" :options="statut" optionLabel="name" optionValue="code" placeholder="Sélectionner le responsable" />
            <PButton label="Ajouter" @click="addAction"/>
        </div>
</template>
<script setup lang="ts">
import {ref, onMounted, computed} from 'vue';
import { useToast } from 'primevue/usetoast';
import { useAssoService } from '@/composables/asso/AssoService';
import Membre from '@/models/MembreModel';

const assoService = useAssoService();
const newActions = ref([])
const actions = ref([])
const action = ref({})
const membres = ref<Membre[]>([]);
const toast = useToast();

const priorite = ref([
    {name:"Faible", code:"low"},
    {name:"Moyenne", code:"mid"},
    {name:"Forte", code:"high"},
])
const statut = ref([
    {name:"À faire", code:"TODO"},
    {name:"En cours", code:"DOING"},
    {name:"Terminé", code:"DONE"},
])

onMounted(async () => {
    membres.value = await assoService.getMembersByAssoId(Number(sessionStorage.getItem('idAsso')));
    actions.value = await assoService.getActionsByAssoId(Number(sessionStorage.getItem('idAsso')));
    console.log(actions.value)
})

const addAction = async () => {
    console.log(action.value)
     try {
        newActions.value.push(action.value)
        await assoService.addActions(Number(sessionStorage.getItem("idAsso")), newActions.value);
        toast.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Les membres ont été ajoutés avec succès.',
            life: 5000,
        });
        newActions.value=[]
    //   showDialogNewTransactions.value = false;
    //   updateChartData();
    } catch (error) {
      // Handle error if needed
      console.error('Error adding members:', error);
  }
}

const editAction = async(id:number, etat:string) => {
    const updateValue = {"etat": etat}
     try {
        await assoService.updateAction(Number(id), updateValue);
        toast.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'L\'action a été modifiée avec succès.',
            life: 5000,
        });
    //   showDialogNewTransactions.value = false;
    //   updateChartData();
    } catch (error) {
      // Handle error if needed
      console.error('Error adding members:', error);
  }
}

const deleteAction = async (id) => {
     try {
        await assoService.deleteActionById(Number(id));
        toast.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'L\'action a été supprimé avec succès.',
            life: 5000,
        });
    //   showDialogNewTransactions.value = false;
    //   updateChartData();
    } catch (error) {
      // Handle error if needed
      console.error('Error adding members:', error);
  }
}

</script>