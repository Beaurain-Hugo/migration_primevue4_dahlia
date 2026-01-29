<template>
  <div class="flex gap-3 mb-4">
      <div class="card p-4 flex bg-gradient-to-br from-blue-50 to-white items-center gap-4 flex-1">
        <span class="pi bg-blue-100 rounded-xl p-2.5 pi-info-circle text-blue-500 text-3xl"></span>
        <div>
        <p class="text-xl font-bold m-0">{{ actions.TODO?.length }}</p>
        <h5 class="m-0">Tâche à faire</h5>
        </div>
      </div>
      <div class="card p-4 flex bg-gradient-to-br from-orange-50 to-white items-center gap-4 flex-1">
        <span class="pi p-2.5 bg-orange-100 rounded-xl pi-clock text-orange-500 text-3xl"></span>
        <div>
            <p class="text-xl font-bold m-0">{{ actions.DOING?.length }}</p>
            <h5 class="m-0">Tâche en cours</h5>
        </div>
      </div>
      <div class="card p-4 flex bg-gradient-to-br from-green-50 to-white items-center gap-4 flex-1">
        <span class="pi p-2.5 bg-green-100 rounded-xl pi-check-circle text-green-500 text-3xl"></span>
        <div>
            <p class="text-xl font-bold m-0">{{ actions.DONE?.length }}</p>
            <h5 class="m-0">Tâches terminées</h5>
        </div>
      </div>
    </div>
    <PButton icon="pi pi-plus" label="Créer une tâche" @click="VISIBLE = true" :pt="{root:'text-white !bg-[#451d94] border-none'}"/>
    <div v-for="(action, index) in actions" :key="index" class="mt-2">
        <h5 v-if="actions[index].length > 0" class="text-black text-2xl"><span :class="[
            'pi', 
            {'pi-info-circle text-blue-500 text-xl': etat(index) === 'À faire', 'pi-clock text-orange-500 text-xl': etat(index) === 'En cours','pi-check-circle text-green-500 text-xl': etat(index) === 'Terminé'}]">
            </span>
            {{ etat(index) }}</h5>
        <div >
            <Card :class="['border flex flex-col gap-2 rounded-xl shadow',{'opacity-75' : index.toString() === 'DONE'}]"v-for="(a, i) in action" :key="i">
                <template #title>
                <div class="flex justify-between items-baseline">
                    <div class="text-xl flex gap-2 items-baseline">
                        <span :class="[{'line-through opacity-75' : index.toString() === 'DONE'}]">{{ a.title }}</span>
                        <Tag v-if="index.toString() != 'DONE'" :value="prio(a.priority)" :class="['text-white !rounded-full',
                                                prio(a.priority) === 'Faible' ? 'bg-blue-500' : '',
                                                prio(a.priority) === 'Moyenne' ? 'bg-orange-400' : '',
                                                prio(a.priority) === 'Forte' ? 'bg-red-500 ' : '']"/>
                        <Tag v-else value="Terminé" class="!rounded-full"/>
                    </div>
                    <div v-if="index.toString() != 'DONE'">
                        <PButton :pt="{root:'text-white !bg-[#451d94] border-none'}" :label="index.toString() == 'TODO' ? 'Commencer' : 'Terminer'" @click="index.toString() == 'TODO' ? editAction(a.id, 'DOING') : editAction(a.id, 'DONE')" />
                        <PButton severity="danger" variant="text" icon="pi pi-trash" @click="deleteAction(a.id)"  />
                    </div>
                </div>
                </template>
                <template #content>
                    <div class="flex flex-col gap-2">
                        <span class="text-lg">{{ a.description }}</span>
                    <div class="flex gap-3">
                        <div class="flex gap-1">
                            <span class="pi pi-calendar"></span>
                            <span>{{ new Date(a.deadline).toLocaleDateString()}}</span>
                        </div>
                        <div class="flex gap-1">
                            <span class="pi pi-tag"></span>
                            <span>{{ a.category }}</span>
                        </div>
                        <div class="flex gap-1">
                            <span class="pi pi-user"></span>
                            <span>{{ usersNames[a.user[0]] }}</span>
                        </div>
                    </div>
                    </div>

                </template>
            </Card>
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
		<div class="flex flex-col gap-2">
            <div>
                <label for="titre">Titre du action *</label>
                <InputText fluid v-model="action.title" id="titre" placeholder="Ex: Validation du budget" />
            </div>
            <div>
                <label for="description">Description du action *</label>
                <InputText fluid v-model="action.description" id="description" placeholder="Ex: Validation du budget" />
            </div>
            <div class="flex align-center gap-2">
                <div class="w-1/2 flex flex-col">
                    <label for="categorie">Categorie de l'action *</label>
                    <InputText v-model="action.category" id="categorie" placeholder="Budgétaire" />
                </div>
                <div class="w-1/2 flex flex-col">
                    <label for="date">Date d'échéance *</label>
                    <DatePicker showIcon inputId="date" v-model="action.deadline" dateFormat="dd/mm/yy" placeholder="Sélectionner une date" />
                </div>
            </div>
            <div class="flex align-center gap-2">
                <div class="w-1/3 flex flex-col">
                    <label for="resp">Assigné à *</label>
                    <Select v-model="action.user" id="resp" :options="membres" :optionLabel="m => `${m.firstname} ${m.lastName}`" :optionValue="m => [`/api/users/${m.id}`]" placeholder="Sélectionner le responsable" :pt="{option:'p-0',root:'focus:!border-main'}">
                        <template #option="{ option, selected, index }">
                            <div :class="['px-3 w-full h-full py-2 rounded-lg transition-colors cursor-pointer',
                                    selected ? 'bg-second text-white' : 'text-black',
                                    'hover:bg-second hover:text-white'
                            ]">
                                {{ option.firstname + ' ' + option.lastName }}
                            </div>
                        </template>
                    </Select>
                </div>
                <div class="w-1/3 flex flex-col">
                    <label for="prio">Priorité *</label>
                    <Select
                      v-model="action.priority"
                      :options="priorite"
                      optionLabel="name"
                      optionValue="code"
                      placeholder="Sélectionner le responsable"
                      :pt="{option:'p-0',root:'focus:!border-main'}"
                    >
                        <template #option="{ option, selected, index }">
                            <div :class="['px-3 w-full h-full py-2 rounded-lg transition-colors cursor-pointer',
                                    selected ? 'bg-second text-white' : 'text-black',
                                    'hover:bg-second hover:text-white'
                            ]">
                                {{ option.name }}
                            </div>
                        </template>
                    </Select>
                </div>
                <div class="w-1/3 flex flex-col">
                    <label for="etat">État *</label>
                    <Select defaultValue="TODO" v-model="action.status" id="etat" :options="statut" optionLabel="name" optionValue="code" placeholder="Sélectionner le responsable" :pt="{option:'p-0',root:'focus:!border-main'}">
                        <template #option="{ option, selected, index }">
                            <div :class="['px-3 w-full h-full py-2 rounded-lg transition-colors cursor-pointer',
                                    selected ? 'bg-second text-white' : 'text-black',
                                    'hover:bg-second hover:text-white'
                            ]">
                                {{ option.name }}
                            </div>
                        </template>
                    </Select>
                </div>
            </div>
            
        </div>
		<template #footer>
			<PButton label="Créer la tâche" :pt="{root:'text-white bg-purple-900 border-purple-900'}" @click="addAction"/>
			</template>
	</PDialog>
    
</template>
<script setup lang="ts">
import {ref, onMounted, reactive} from 'vue';
import { useToast } from 'primevue/usetoast';
// import { useAssoService } from '@/composables/asso/AssoService';
import { useAssoService } from '@/composable/asso/AssoService';
import { useMemberService } from '@/composable/member/MemberService';
import { useTaskService } from '@/composable/task/TaskService';
import { useUserService } from '@/composable/user/UserService';
import Membre from '@/models/MembreModel';
import { group } from 'console';

const assoService = useAssoService();
const memberService = useMemberService();
const taskService = useTaskService();
const userService = useUserService();
const newActions = ref([])
const actions = ref([])
const action = ref({})
const membres = ref<Membre[]>([]);
const toast = useToast();
const VISIBLE=ref(false);
const usersNames = reactive<Record<string, string>>({})

const priorite = ref([
    {name:"Faible", code:"low"},
    {name:"Moyenne", code:"mid"},
    {name:"Forte", code:"high"},
])

const prio = (label) => {
        // console.log(label)
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
function groupByStatus(items, order) {
  // Commence par grouper
  const grouped = items.reduce((acc, item) => {
    (acc[item.status] ||= []).push(item)
    return acc
  }, {})

  // Puis reconstruire dans l'ordre demandé
  const orderedGrouped = {}
  order.forEach(status => {
    if (grouped[status]) {
      orderedGrouped[status] = grouped[status]
    }
  })

  return orderedGrouped
}

onMounted(async () => {
    const asso = await assoService.getAssociationById(Number(sessionStorage.getItem('idAsso')));
    asso.associationUsers.forEach(async (element) => {
        const member = await memberService.getMember(element);
        membres.value.push(await userService.getUser(member.user))
    });
    // membres.value = await assoService.getMembersByAssoId(Number(sessionStorage.getItem('idAsso')));
    const response = await taskService.getTasksByAssoId(Number(sessionStorage.getItem('idAsso')));
    actions.value = groupByStatus(response, ['TODO', 'DOING', 'DONE']);
    response.forEach(a => {
    a.user.forEach(async iri => {
      if (!usersNames[iri]) {
        const res = await userService.getUser(iri)
        usersNames[iri] = res.firstname + ' ' + res.lastName
      }
    })
  })
})

const addAction = async () => {
    action.value.association = `/api/associations/${sessionStorage.getItem('idAsso')}`;
     try {
        newActions.value.push(action.value)
        await taskService.addTask(action.value);
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
    const updateValue = {"status": etat}
     try {
        await taskService.patchTask(Number(id), updateValue);
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
        await taskService.deleteTask(Number(id));
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

const getUserName = async (url:string) => {
    const res = await userService.getUser(url)
    return res.data.firstname + ' ' + res.data.lastname
}


</script>