<template>
    <div class="bg-gradient-to-r from-[#FFEDE2] to-[#FFFFFF]  flex justify-between p-2 rounded-xl border shadow-sm">
        <div v-if="nom">
            <p class="text-black text-lg">Bonjour {{ nom }}, <span v-if="selectedAsso"> {{selectedAsso.role}} de {{selectedAsso.name}}</span></p>
            <p>Que souhaitez-vous accomplir aujourd'hui ?</p>
        </div>
        <div>
            <Select :pt="{option:'p-0'}" @change="changeAsso(selectedAsso.id)" v-model="selectedAsso" :options="associationData" optionLabel="name" placeholder="Sélectionnez une association" class="w-full md:w-56">
                <template #value="slotProps">
                    <div v-if="slotProps.value" class="flex items-center">
                        <img v-if="slotProps.value.logo" :alt="slotProps.value.label" :src="'data:image/png;base64,' + slotProps.value.logo" :class="`mr-2 flag`" style="width: 18px" />
                        <div>{{ slotProps.value.name }}<Chip :label="slotProps.value.role"/></div>
                    </div>
                    <span v-else>
                        {{ slotProps.placeholder }}
                    </span>
                </template>
                <template #option="slotProps">
                    <div class="flex items-center gap-2" :class="['px-3 w-full h-full py-2 rounded-lg transition-colors cursor-pointer',
                                    slotProps.selected ? 'bg-[#FFEDE2] text-main' : 'text-black',
                                    'hover:bg-second hover:text-white'
                            ]">
                        <img v-if="slotProps.option.logo" :alt="'Logo ' + slotProps.option.name" :src="'data:image/png;base64,' + slotProps.option.logo" :class="`mr-2 flag`" style="width: 18px" />
                        <div class="flex flex-col">
                            <span>{{ slotProps.option.name }}</span>
                            <Chip :class="['text-xs py-0 px-1.5', slotProps.selected ? '!bg-main text-white' : '!bg-[#FFEDE2] text-main']" :label="slotProps.option.role"/>
                        </div>
                    </div>
                </template>
     
                <template #header>
                    <div class="font-medium p-3">Changer d'association</div>
                </template>
            </Select>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useAssoService } from '@/composables/asso/AssoService';
import { useUserService } from '@/composable/user/UserService';
import { useRoute } from 'vue-router';
import Association from '@/models/AssociationModel';
import { useToast } from 'primevue/usetoast';

const associationService = useAssoService();
const userService = useUserService();
const associationData = ref<Association[]>([]);
const isLoading = ref<boolean>();
const toast = useToast();
const selectedAsso = ref();
// const selectedAsso = computed();

const nom = ref();
const route = useRoute();
const association = ref<Association | null>(null);
const assoId = ref<number | null>(sessionStorage.getItem("idAsso") ? Number(sessionStorage.getItem("idAsso")) : null);
console.log(assoId);
const emit = defineEmits(["update:modelValue"]);
watch(assoId, (val) => {
    emit('update:modelValue', val);
});

onMounted(async () => {
  const user_id = localStorage.getItem('id_user');
  isLoading.value = true;
//   associationData.value = await userService.getUserById(Number(user_id));
  const me = await userService.getMe();
 associationData.value = me.data.associations
    nom.value = me.data.firstname + ' ' + me.data.lastname
 if(assoId.value !== null){
    const index = findIndexById(assoId.value, associationData.value)
    selectedAsso.value = associationData.value[index];
  }
  isLoading.value = false;
});

const findIndexById = (id, array) => {
  let index = 0;
//   console.log("findbyindex", id, array);
  for (let i = 0; i < array.length; i++) {
    if (array[i].id === id) {
      index = i;
      console.log(index)
      break;
    }
  }
  return index;
};

function changeAsso (id) {
      selectedAsso.value = id;

        emit('update:modelValue', id);
}

async function fetchAssociation() {
    if (assoId.value) {
        try {
            association.value = await associationService.getAssociationById(assoId.value);
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'association:', error);
        }
    } else {
        console.error('ID de l\'association non trouvé dans l\'URL');
    }
}

// Surveille les changements de `assoId` et refait l'appel de l'API si nécessaire
watch(assoId, (newId, oldId) => {
    if (newId !== oldId) {
        fetchAssociation();
    }
});

// Mise à jour de `assoId` lorsque la route change (utile si vous utilisez des paramètres de route dynamique)
watch(() => route.params.id, (newId) => {
    const id = newId ? Number(newId) : null;
    if (id !== assoId.value) {
        assoId.value = id;
    }})

</script>