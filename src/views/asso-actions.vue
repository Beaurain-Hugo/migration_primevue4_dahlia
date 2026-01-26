<template>
  <div class="flex gap-3 mb-4">
      <div class="card p-4 flex items-center gap-4 flex-1">
        <i class="pi pi-info-circle text-blue-500 text-3xl"></i>
        <div>
        <p class="text-xl font-bold m-0">{{ actions.TODO?.length }}</p>
        <h5 class="m-0">Tâche à faire</h5>
        </div>
      </div>
      <div class="card p-4 flex items-center gap-4 flex-1">
        <i class="pi pi-clock text-orange-500 text-3xl"></i>
        <div>
            <p class="text-xl font-bold m-0">{{ actions.DOING?.length }}</p>
            <h5 class="m-0">Tâche en cours</h5>
        </div>
      </div>
      <div class="card p-4 flex items-center gap-4 flex-1">
        <i class="pi pi-check-circle text-green-500 text-3xl"></i>
        <div>
            <p class="text-xl font-bold m-0">{{ actions.DONE?.length }}</p>
            <h5 class="m-0">Tâches terminées</h5>
        </div>
      </div>
    </div>
    <PButton icon="pi pi-plus" label="Créer une tâche" @click="VISIBLE = true" :pt="{root:'text-white bg-purple-900 border-purple-900'}"/>
    <div v-for="(action, index) in actions" :key="index">
        <h5>{{ etat(index) }}</h5>
        <div >
            <div class="border flex flex-col gap-2 rounded-xl shadow p-4" v-for="(a, i) in action" :key="i">
                <div class="flex justify-between">
                    <div class="text-xl flex gap-2 items-baseline">
                        <span>{{ a.titre }}</span>
                        <Tag :value="prio(a.priorite)" :class="['text-white !rounded-full',
                                                prio(a.priorite) === 'Faible' ? 'bg-blue-500' : '',
                                                prio(a.priorite) === 'Moyenne' ? 'bg-orange-400' : '',
                                                prio(a.priorite) === 'Forte' ? 'bg-red-500 ' : '']"/>
                    </div>
                    <div>
                        <PButton :label="index.toString() == 'TODO' ? 'Commencer' : 'Terminer'" @click="index.toString() == 'TODO' ? editAction(a.id, 'DOING') : editAction(a.id, 'DONE')" />
                        <PButton severity="danger" variant="text" icon="pi pi-trash" @click="deleteAction(a.id)"  />
                    </div>
                </div>
                <div>
                    <span>{{ a.description }}</span>
                </div>
                <div class="flex gap-2">
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
                </div>
            </div>
            <!-- <Card>
                <template #header>
                    <div class="flex justify-between p-4">
                        <div class="text-xl flex gap-2 items-baseline">
                            <span>{{ a.titre }}</span>
                            <Tag :value="prio(a.priorite)" :class="['text-white !rounded-full',
                                                    prio(a.priorite) === 'Faible' ? 'bg-blue-500' : '',
                                                    prio(a.priorite) === 'Moyenne' ? 'bg-orange-400' : '',
                                                    prio(a.priorite) === 'Forte' ? 'bg-red-500 ' : '']"/>
                        </div>
                        <div>
                            <PButton :label="index.toString() == 'TODO' ? 'Commencer' : 'Terminer'" @click="index.toString() == 'TODO' ? editAction(a.id, 'DOING') : editAction(a.id, 'DONE')" />
                            <PButton severity="danger" variant="text" icon="pi pi-trash" @click="deleteAction(a.id)"  />
                        </div>
                    </div>
                </template>
                <template #content class="p-0">
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
            </Card> -->
        </div>
    </div>
    <PDialog modal header="Créer une nouvelle tâche" v-model:visible="VISIBLE">
		<div>
            <div>
                <label for="titre">Titre du action *</label>
                <InputText fluid v-model="action.titre" id="titre" placeholder="Ex: Validation du budget" />
            </div>
            <div>
                <label for="description">Description du action *</label>
                <InputText fluid v-model="action.description" id="description" placeholder="Ex: Validation du budget" />
            </div>
            <div class="flex">
                <div>
                <label for="categorie">Categorie du action *</label>
                <InputText v-model="action.categorie" id="categorie" placeholder="Budgétaire" />
                </div>
                <div>
                <label for="date">Date d'échéance *</label>
                <DatePicker updateModelType="string" showIcon inputId="date" v-model="action.deadline" dateFormat="dd/mm/yy" placeholder="Sélectionner une date" />
                </div>
            </div>
            <div class="flex">
                <div>
                    <label for="resp">Assigné à *</label>
                    <Select v-model="action.responsable_id" id="resp" :options="membres" optionLabel="username" optionValue="user_id" placeholder="Sélectionner le responsable" />
                </div>
                <div>
                    <label for="prio">Priorité *</label>
                    <Select defaultValue="mid" v-model="action.priorite" id="prio" :options="priorite" optionLabel="name" optionValue="code" placeholder="Sélectionner le responsable" />
                </div>
                <div>
                    <label for="etat">État *</label>
                    <Select defaultValue="TODO" v-model="action.etat" id="etat" :options="statut" optionLabel="name" optionValue="code" placeholder="Sélectionner le responsable" />
                </div>
            </div>
            
        </div>
		<template #footer>
			<PButton label="Créer la tâche" :pt="{root:'text-white bg-purple-900 border-purple-900'}" @click="addAction"/>
			</template>
	</PDialog>
    
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
const VISIBLE=ref(false);

const priorite = ref([
    {name:"Faible", code:"low"},
    {name:"Moyenne", code:"mid"},
    {name:"Forte", code:"high"},
])

const prio = (label) => {
        console.log(label)
        switch(label){
            case label = "low":
                return "Faible"
            case label = "mid":
                return "Moyenne"
            case label = "high":
                return "Forte"
        } 
    };

    const etat = (label) => {
        console.log(label)
        switch(label){
            case label = "TODO":
                return "À faire"
            case label = "DOING":
                return "En cours"
            case label = "DONE":
                return "Terminé"
        } 
    };

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