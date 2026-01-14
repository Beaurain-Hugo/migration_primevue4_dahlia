<template>
    <main>
        <TabView>
            <TabPanel header="Mes réunions">
                <h3>Historique des réunions</h3>
                <div>
                <Card v-for="(reunion, index) in REUNIONS" :key="index">
                    <template #header>
                        <div>
                            <h4>{{ reunion.nom }}</h4>
                            <Tag :value="reunion.statut" rounded />
                        </div>
                    </template>
                    <template #content>
                        <div>
                        <span class="pi pi-calendar"></span>
                        <span>{{ reunion.date }}</span>
                        </div>
                        <div>
                        <span class="pi pi-users"></span>
                        <span>Participants</span>
                        </div>
                    </template>
                    <template #footer>
                        <div v-if="reunion.compte_rendu">
                            <PButton label="Voir" icon="pi pi-eye" />
                            <PButton label="PDF" icon="pi pi-download" />
                        </div>
                        <div v-else>
                            <PButton label="Créer le compte-rendu" icon="pi pi-file-pdf" @click="VISIBLE=true" />
                        </div>
                    </template>
                </Card>
                </div>
                <PDialog modal header="Nouveau compte-rendu" v-model:visible="VISIBLE">
                    <template #header>
                        <h5>Nouveau compte rendu</h5>
                       <span>Étape {{ activeStep }} sur 5</span>
                    </template>
                    <Stepper v-model:value="activeStep" linear class="basis-[40rem]">
                        <StepList>
                            <Step v-slot="{ activateCallback, value, a11yAttrs }" asChild :value="1">
                                <div class="flex flex-row flex-auto gap-2" v-bind="a11yAttrs.root">
                                    <PButton class="bg-transparent border-0 inline-flex flex-col gap-2" @click="activateCallback" v-bind="a11yAttrs.header">
                                        <span
                                            :class="[
                                                'rounded-full border-2 w-12 h-12 inline-flex items-center justify-center',
                                                { 'bg-primary text-primary-contrast border-primary': value <= activeStep, 'border-surface-200 dark:border-surface-700': value > activeStep }
                                            ]"
                                        >
                                            <i class="pi pi-user" />
                                        </span>
                                        <span style="color:black">
                                            Informations
                                        </span>
                                    </PButton>
                                    <Divider />
                                </div>
                            </Step>
                            <Step v-slot="{ activateCallback, value, a11yAttrs }" asChild :value="2">
                                <div class="flex flex-row flex-auto gap-2 pl-2" v-bind="a11yAttrs.root">
                                    <PButton class="bg-transparent border-0 inline-flex flex-col gap-2" @click="activateCallback" v-bind="a11yAttrs.header">
                                        <span
                                            :class="[
                                                'rounded-full border-2 w-12 h-12 inline-flex items-center justify-center',
                                                { 'bg-primary text-primary-contrast border-primary': value <= activeStep, 'border-surface-200 dark:border-surface-700': value > activeStep }
                                            ]"
                                        >
                                            <i class="pi pi-star" />
                                        </span>
                                        <span style="color:black">
                                            Agenda
                                        </span>
                                    </PButton>
                                    <Divider />
                                </div>
                            </Step>
                            <Step v-slot="{ activateCallback, value, a11yAttrs }" asChild :value="3">
                                <div class="flex flex-row pl-2" v-bind="a11yAttrs.root">
                                    <PButton class="bg-transparent border-0 inline-flex flex-col gap-2" @click="activateCallback" v-bind="a11yAttrs.header">
                                        <span
                                            :class="[
                                                'rounded-full border-2 w-12 h-12 inline-flex items-center justify-center',
                                                { 'bg-primary text-primary-contrast border-primary': value <= activeStep, 'border-surface-200 dark:border-surface-700': value > activeStep }
                                            ]"
                                        >
                                            <i class="pi pi-id-card" />
                                        </span>
                                        <span style="color:black">
                                            Discussions
                                        </span>
                                    </PButton>
                                </div>
                            </Step>
                             <Step v-slot="{ activateCallback, value, a11yAttrs }" asChild :value="4">
                                <div class="flex flex-row pl-2" v-bind="a11yAttrs.root">
                                    <PButton class="bg-transparent border-0 inline-flex flex-col gap-2" @click="activateCallback" v-bind="a11yAttrs.header">
                                        <span
                                            :class="[
                                                'rounded-full border-2 w-12 h-12 inline-flex items-center justify-center',
                                                { 'bg-primary text-primary-contrast border-primary': value <= activeStep, 'border-surface-200 dark:border-surface-700': value > activeStep }
                                            ]"
                                        >
                                            <i class="pi pi-id-card" />
                                        </span>
                                        <span style="color:black">
                                            Actions
                                        </span>
                                    </PButton>
                                </div>
                            </Step>
                            <Step v-slot="{ activateCallback, value, a11yAttrs }" asChild :value="5">
                                <div class="flex flex-row pl-2" v-bind="a11yAttrs.root">
                                    <PButton class="bg-transparent border-0 inline-flex flex-col gap-2" @click="activateCallback" v-bind="a11yAttrs.header">
                                        <span
                                            :class="[
                                                'rounded-full border-2 w-12 h-12 inline-flex items-center justify-center',
                                                { 'bg-primary text-primary-contrast border-primary': value <= activeStep, 'border-surface-200 dark:border-surface-700': value > activeStep }
                                            ]"
                                        >
                                            <i class="pi pi-id-card" />
                                        </span>
                                        <span style="color:black">
                                            Finaliser
                                        </span>
                                    </PButton>
                                </div>
                            </Step>
                        </StepList>
                        <StepPanels>
                            <StepPanel v-slot="{ activateCallback }" :value="1">
                                <div class="flex flex-col gap-2 mx-auto" style="min-height: 16rem; max-width: 90vw; flex-direction:column">
                                     <div>
                                        <label for="title">Titre du compte-rendu *</label>
                                        <InputText id="title" placeholder="CR CA - 14/09/2025" />
                                    </div>
                                    <div>
                                        <label for="date">Date *</label>
                                        <DatePicker  showIcon inputId="date" v-model="date" dateFormat="dd/mm/yy" placeholder="Sélectionner une date" />
                                        <!-- <DatePicker v-model="date" /> -->
                                    </div>
                                    <div>
                                        <label for="hour">Heure</label>
                                        <DatePicker v-model="time" showIcon fluid iconDisplay="input" timeOnly inputId="hour">
                                            <template #inputicon="slotProps">
                                                <i class="pi pi-clock" @click="slotProps.clickCallback" />
                                            </template>
                                        </DatePicker>
                                    </div>
                                    <div>
                                        <label for="place">Lieu</label>
                                        <InputText id="place" placeholder="Salle de réunion / Visioconférence" />
                                    </div>
                                    <div>
                                        <label for="type">Type de réunion *</label>
                                        <Dropdown v-model="selectedType" id="type" :options="types" optionLabel="name" placeholder="Sélectionner le type" />
                                    </div>
                                    <fieldset>
                                        <legend>Participants</legend>
                                     <div v-for="participant of participants" :key="participant.key" class="flex align-items-center">
                                        <Checkbox v-model="selectedPart" :inputId="participant.key" name="participant" :value="participant.name" />
                                        <label :for="participant.key">{{ participant.name }}</label>
                                    </div>
                                    </fieldset>
                                </div>
                                <div class="flex pt-6 justify-end">
                                    <PButton label="Next" icon="pi pi-arrow-right" iconPos="right" @click="activateCallback(2)" />
                                </div>
                            </StepPanel>
                            <StepPanel v-slot="{ activateCallback }" :value="2">
                                <div class="flex flex-col gap-2 mx-auto" style="min-height: 16rem; max-width: 24rem">
                                    <div class="text-center mt-4 mb-4 text-xl font-semibold">Points à l'ordre du jour</div>
                                    <PButton label="Ajouter un point" icon="pi pi-plus" @click="addPoint" />
                                </div>
                                <div>
                                    <div v-if="pointsOrdreJour.length == 0">
                                        <span>Aucun point à l'ordre du jour</span>
                                        <span>Aujoutez votre premier point pour commencer</span>
                                    </div>
                                    <div v-else v-for="(point, index) in pointsOrdreJour" :key="point.id">
                                        <label :for="'salle-'+point.id">Titre du point *</label>
                                        <InputText :id="'salle-'+point.id" placeholder="Ex: Validation du budget" />
                                        <label :for="'duree-'+point.id">Durée *</label>
                                        <InputNumber :inputId="'duree-'+point.id" suffix=" min" :min="1" placeholder="Indiquez une durée en minute" />
                                          <label :for="'resp'+point.id">Type de réunion *</label>
                                        <Dropdown v-model="selectedPart" :id="'resp'+point.id" :options="selectedPart" placeholder="Sélectionner le responsable" />
                                        <PButton  icon="pi pi-trash" @click="removePoint(index)"  />
                                    </div>
                                </div>
                                <div class="flex pt-6 justify-between">
                                    <PButton label="Back" severity="secondary" icon="pi pi-arrow-left" @click="activateCallback(1)" />
                                    <PButton label="Next" icon="pi pi-arrow-right" iconPos="right" @click="activateCallback(3)" />
                                </div>
                            </StepPanel>
                            <StepPanel v-slot="{ activateCallback }" :value="3">
                                <div class="flex flex-col gap-2 mx-auto" style="min-height: 16rem; max-width: 24rem">
                                    <div class="text-center mt-4 mb-4 text-xl font-semibold">Account created successfully</div>
                                    <div class="flex justify-center">
                                        <img alt="logo" src="https://primefaces.org/cdn/primevue/images/stepper/content.svg" />
                                    </div>
                                </div>
                                <div class="flex pt-6 justify-start">
                                    <PButton label="Back" severity="secondary" icon="pi pi-arrow-left" @click="activateCallback(2)" />
                                    <PButton label="Next" icon="pi pi-arrow-right" iconPos="right" @click="activateCallback(4)" />
                                </div>
                            </StepPanel>
                             <StepPanel v-slot="{ activateCallback }" :value="4">
                                <div class="flex flex-col gap-2 mx-auto" style="min-height: 16rem; max-width: 24rem">
                                    <div class="text-center mt-4 mb-4 text-xl font-semibold">Account created successfully</div>
                                    <div class="flex justify-center">
                                        <img alt="logo" src="https://primefaces.org/cdn/primevue/images/stepper/content.svg" />
                                    </div>
                                </div>
                                <div class="flex pt-6 justify-start">
                                    <PButton label="Back" severity="secondary" icon="pi pi-arrow-left" @click="activateCallback(3)" />
                                    <PButton label="Next" icon="pi pi-arrow-right" iconPos="right" @click="activateCallback(5)" />
                                </div>
                            </StepPanel>
                             <StepPanel v-slot="{ activateCallback }" :value="5">
                                <div class="flex flex-col gap-2 mx-auto" style="min-height: 16rem; max-width: 24rem">
                                    <div class="text-center mt-4 mb-4 text-xl font-semibold">Account created successfully</div>
                                    <div class="flex justify-center">
                                        <img alt="logo" src="https://primefaces.org/cdn/primevue/images/stepper/content.svg" />
                                    </div>
                                </div>
                                <div class="flex pt-6 justify-start">
                                    <PButton label="Back" severity="secondary" icon="pi pi-arrow-left" @click="activateCallback(4)" />
                                </div>
                            </StepPanel>
                        </StepPanels>
                    </Stepper>
                </PDialog>
            </TabPanel>
            <TabPanel header="Nouveau CR">

            </TabPanel>
            <TabPanel header="Rappels">

            </TabPanel>
        </TabView>
    </main>
</template>

<script setup lang="ts">
    import Reunion from '@/models/ReunionModel';

    import { ref } from 'vue';

    const date = ref()
    const time = ref()
    const selectedType = ref();
    const selectedPart = ref();
    const activeStep = ref(1);
    const pointsOrdreJour = ref([]);
    const types = ref([
        {name:"Conseil d'administration", code: "CA"},
        {name:"Assemblée générale", code: "AG"},
        {name:"Réunion de projet", code: "RP"},
        {name:"Réunion d'équipe", code: "RE"},
        {name:"Comité de direction", code: "CD"},
        {name:"Bureau exécutif", code: "BE"},
    ])
    const participants = ref([
        {name:"Corentin Beuchat", key:"0"},
        {name:"Elora Perrin", key:"1"},
        {name:"Hugo Beaurain", key:"2"},
    ])
    const VISIBLE=ref(false);
    const REUNIONS = ref<Reunion>([])
    REUNIONS.value = [
        {
            id:1,
            nom:"Test",
            statut:"Terminé",
            date:"15/02/20205",
            compte_rendu:true
        },
         {
            id:2,
            nom:"Test",
            statut:"Terminé",
            date:"15/02/20205",
            compte_rendu:true
        },
         {
            id:3,
            nom:"Test",
            statut:"Terminé",
            date:"15/02/20205",
            compte_rendu:false
        },
    ]
    const ITEMS = ref([])
    ITEMS.value = [
        {
            label:"Informations",
            icon:"pi-file-pdf"
        },
        {
            label:"Agenda",
            icon:"pi-calendar"
        },
        {
            label:"Discussions",
            icon:"pi-users"
        },
        {
            label:"Actions",
            icon:"pi-check-circle"
        },
        {
            label:"Finaliser",
            icon:"pi-send"
        }
    ]

const addPoint = () => {
  pointsOrdreJour.value.push({
    id: Date.now(),
    title: '',
    description: ''
  })
}

const removePoint = (index) => {
  pointsOrdreJour.value.splice(index, 1)
}
</script>