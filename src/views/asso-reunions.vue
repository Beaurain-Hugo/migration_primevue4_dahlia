<template>
    <main>
        <Tabs value="0">
            <TabList>
                <Tab value="0">Mes réunions</Tab>
                <Tab value="1">Nouveau CR</Tab>
                <Tab value="2">Rappels</Tab>
            </TabList>
            <TabPanels>
            <TabPanel value="0">
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
                                            <i class="pi pi-file" />
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
                                            <i class="pi pi-calendar" />
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
                                            <i class="pi pi-users" />
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
                                            <i class="pi pi-check-circle" />
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
                                            <i class="pi pi-send" />
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
                                        <InputText v-model="title" id="title" placeholder="CR CA - 14/09/2025" />
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
                                        <InputText v-model="lieu" id="place" placeholder="Salle de réunion / Visioconférence" />
                                    </div>
                                    <div>
                                        <label for="type">Type de réunion *</label>
                                        <Dropdown v-model="selectedType" id="type" :options="types" optionLabel="name" placeholder="Sélectionner le type" />
                                    </div>
                                    <!-- <fieldset>
                                        <legend>Participants</legend> -->
                                    <CheckboxGroup name="participant" v-model="selectedPart" >
                                     <div v-for="participant of participants" :key="participant.code" class="flex align-items-center">
                                        <Checkbox :inputId="participant.code"  :value="{ code: participant.code, name: participant.name }" />
                                        <label :for="participant.code">{{ participant.name }}</label>
                                    </div>
                                </CheckboxGroup>
                                    <!-- </fieldset> -->
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
                                        <InputText v-model="pointsOrdreJour[index].title" :id="'salle-'+point.id" placeholder="Ex: Validation du budget" />
                                        <label :for="'duree-'+point.id">Durée *</label>
                                        <InputNumber  showButtons v-model="pointsOrdreJour[index].duree" :inputId="'duree-'+point.id" suffix=" min" :min="1" placeholder="Indiquez une durée en minute" />
                                          <label :for="'resp'+point.id">Responsable *</label>
                                        <Dropdown v-model="pointsOrdreJour[index].responsable" :id="'resp'+point.id" :options="selectedPart" placeholder="Sélectionner le responsable" />
                                        <PButton  icon="pi pi-trash" @click="removePoint(index)"  />
                                    </div>
                                </div>
                                <div class="flex pt-6 justify-between">
                                    <PButton label="Back" severity="secondary" icon="pi pi-arrow-left" @click="activateCallback(1)" />
                                    <PButton label="Next" icon="pi pi-arrow-right" iconPos="right" @click="activateCallback(3)" />
                                </div>
                            </StepPanel>
                            <StepPanel v-slot="{ activateCallback }" :value="3">
                                <div>
                                    <span>Discussions et décisions.</span>
                                    <div v-if="pointsOrdreJour.length == 0">
                                        <span>Discussions et décisions.</span>
                                        <span>Ajoutez des points à l'ordre du jour.</span>
                                    </div>
                                    <div v-else  v-for="(point, index) in pointsOrdreJour" :key="point.id">
                                        <Card>
                                            <template #header>
                                                <Chip :label="point.title" />({{ point.duree }} min - {{ point.responsable }})
                                            </template>
                                            <template #content>
                                                <label :for="'discussions-'+point.id">Discussions et échanges</label>
                                                <PTextarea :id="'discussions-'+point.id" v-model="point.discussions" rows="5" cols="30" placeholder="Détaillez les échanges, arguments et points de vue exprimés"/>
                                                <div>
                                                    <Checkbox :inputId="'decision-'+point.id" v-model="point.decision" @click="console.log(point)" binary @update:modelValue="val => { if (!val) point.synthese = '' }" />
                                                    <label :for="'decision-'+point.id">Une décision a été prise ?</label>
                                                </div>
                                                <div v-if="point.decision">
                                                    <span>Synthèse de la décision</span>
                                                    <PTextarea v-model="point.synthese" rows="5" cols="30" placeholder="Résumé concis des décisions (3 à 5 points)"/>
                                                </div>
                                            </template>
                                        </Card>
                                    </div>
                                </div>
                                <div class="flex pt-6 justify-between">
                                    <PButton label="Back" severity="secondary" icon="pi pi-arrow-left" @click="activateCallback(2)" />
                                    <PButton label="Next" icon="pi pi-arrow-right" iconPos="right" @click="activateCallback(4)" />
                                </div>
                            </StepPanel>
                             <StepPanel v-slot="{ activateCallback }" :value="4">
                             <div class="flex flex-col gap-2 mx-auto" style="min-height: 16rem; max-width: 24rem">
                                    <div class="text-center mt-4 mb-4 text-xl font-semibold">Points à l'ordre du jour</div>
                                    <PButton label="Ajouter un point" icon="pi pi-plus" @click="addAction" />
                                </div>
                                <div>
                                    <div v-if="actions.length == 0">
                                        <span>Aucun action définie</span>
                                        <span>Ajoutez votre premier point pour commencer</span>
                                    </div>
                                    <div v-else v-for="(point, index) in actions" :key="point.id">
                                        <label :for="'titre-'+point.id">Titre du point *</label>
                                        <Chip v-if="point.responsable" :label="valueToLabel(point.responsable, participants)" icon="pi pi-user" />
                                        <Chip v-if="point.date" :label="point.date" icon="pi pi-calendar" />
                                        <Chip :label="valueToLabel(point.prio, priorite)" />
                                        <Chip :label="valueToLabel(point.statut, statut)" />
                                        <InputText v-model="actions[index].title" :id="'titre-'+point.id" placeholder="Ex: Validation du budget" />
                                        <ToggleButton @click="console.log(actions)" :modelValue="isOpen(point.id)" @update:modelValue="() => toggleAction(point.id)" onLabel="Réduire" offLabel="Modifier" />
                                        <div v-if="isOpen(point.id)">
                                            <label for="date">Date d'échéance *</label>
                                            <DatePicker updateModelType="string" showIcon inputId="date" v-model="point.date" dateFormat="dd/mm/yy" placeholder="Sélectionner une date" />
                                            <label :for="'resp'+point.id">Assigné à *</label>
                                            <Dropdown v-model="actions[index].responsable" :id="'resp'+point.id" :options="participants" optionLabel="name" optionValue="code" placeholder="Sélectionner le responsable" />
                                            <label :for="'prio-'+point.id">Priorité *</label>
                                            <Select defaultValue="mid" v-model="actions[index].prio" :id="'prio-'+point.id" :options="priorite" optionLabel="name" optionValue="code" placeholder="Sélectionner le responsable" />
                                            <label :for="'statut-'+point.id">Statut *</label>
                                            <Select defaultValue="TODO" v-model="actions[index].statut" :id="'statut-'+point.id" :options="statut" optionLabel="name" optionValue="code" placeholder="Sélectionner le responsable" />
                                        </div>
                                        <div v-else>
                                            <span>Cliquez sur "Modifier" pour plus d'options</span>
                                        </div>
                                        <PButton  icon="pi pi-trash" @click="removeAction(index)"  />
                                    </div>
                                </div>
                                 <div class="flex pt-6 justify-between">
                                    <PButton label="Back" severity="secondary" icon="pi pi-arrow-left" @click="activateCallback(3)" />
                                    <PButton label="Next" icon="pi pi-arrow-right" iconPos="right" @click="activateCallback(5)" />
                                </div>
                            </StepPanel>
                             <StepPanel v-slot="{ activateCallback }" :value="5">
                                <div>
                                    Récapitulatif et finalisation
                                    <Card>
                                        <template #header>
                                            <span class="pi pi-users"></span>
                                            Participants
                                        </template>
                                        <template #content>
                                            <span>{{ selectedPart.length }} <br> personnes conviées</span>
                                        </template>
                                    </Card>
                                     <Card>
                                        <template #header>
                                            <span class="pi pi-check-circle"></span>
                                            Décisions
                                        </template>
                                        <template #content>
                                            <span>{{ pointsOrdreJour.length }} <br> décisions prises</span>
                                        </template>
                                    </Card>
                                    <Card>
                                        <template #header>
                                            <span class="pi pi-file"></span>
                                            Actions
                                        </template>
                                        <template #content>
                                            <span>{{ actions.length }} <br> à suivre</span>
                                        </template>
                                    </Card>
                                     <div id="pdf-content" >
                                        <div>
                                            <h1>Compte-rendu</h1>
                                            <h2>{{ title }}</h2>
                                        </div>
                                        <div>
                                            <Chip label="Personne en charge"/> Euh faut mettre quoi là ?
                                            <span>Date {{ date }}</span>
                                            <span>Heure de début {{ time }}</span>
                                            <span>Lieu {{ lieu }}</span>
                                        </div>
                                        <Chip label="Participants"/>
                                        <DataTable :value="selectedPart" showGridlines tableStyle="min-width: 50rem">
                                            <Column field="name" header="Présents"></Column>
                                            <Column field="" header="Excusés"></Column>
                                        </DataTable>
                                        <div>
                                            <Chip label="Type de réunion"/>
                                            {{ selectedType.name }}
                                        </div>
                                        <div>
                                            <Chip label="Ordres du jour"/>
                                            <div v-for="(point,index) in pointsOrdreJour" :key="index">
                                                {{point.title}}
                                                <!-- {{ point }} -->
                                            </div>
                                        </div>
                                        <div>
                                            <Chip label="Discussions et décisions"/>
                                            <div v-for="(point, index) in pointsOrdreJour">
                                                <h3>{{ point.title }} par {{ point.responsable.name }}</h3>
                                                {{ point.discussions }}
                                                <div v-if="point.synthese">
                                                Décision :
                                                <span>{{ point.synthese }}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Chip label="Actions à prendre"/>
                                        <DataTable :value="actions" showGridlines tableStyle="min-width: 50rem">
                                            <Column field="title" header="Actions"></Column>
                                            <Column field="statut" header="Etat"></Column>
                                            <Column field="prio" header="Priorité"></Column>
                                            <Column field="date" header="Deadline"></Column>
                                            <Column field="responsable" header="Personne en charge"></Column>
                                        </DataTable>
                                    </div>
                                    <button @click="generatePdf">Télécharger PDF</button>
                                    <div class="flex pt-6 justify-between">
                                    <PButton label="Back" severity="secondary" icon="pi pi-arrow-left" @click="activateCallback(4)" />
                                    </div>
                                </div>
                            </StepPanel>
                        </StepPanels>
                    </Stepper>
                </PDialog>
            </TabPanel>
            <TabPanel value="1">

            </TabPanel>
            <TabPanel value="2">

            </TabPanel>
            </TabPanels>
        </Tabs>
    </main>
</template>

<script setup lang="ts">
    import Reunion from '@/models/ReunionModel';
    import domToPdf from 'dom-to-pdf'
    const generatePdf = () => {
        const element = document.getElementById('pdf-content');
        domToPdf(element, {
            filename: 'mon-document.pdf',
            margin: 10,
            scale: 2
        });
    };
    import { ref } from 'vue';
    const test = ref(false)
    const title = ref()
    const lieu = ref()
    const date = ref()
    const time = ref()
    const selectedType = ref();
    const selectedPart = ref([]);
    const activeStep = ref(1);
    const pointsOrdreJour = ref([]);
    const actions = ref([]);
    const types = ref([
        {name:"Conseil d'administration", code: "CA"},
        {name:"Assemblée générale", code: "AG"},
        {name:"Réunion de projet", code: "RP"},
        {name:"Réunion d'équipe", code: "RE"},
        {name:"Comité de direction", code: "CD"},
        {name:"Bureau exécutif", code: "BE"},
    ])
    const participants = ref([
        {name:"Corentin Beuchat", code:"0"},
        {name:"Elora Perrin", code:"1"},
        {name:"Hugo Beaurain", code:"2"},
    ])
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

    const valueToLabel = (value, array) => {
        return array.find(val => val.code === value).name
    }

const addPoint = () => {
  pointsOrdreJour.value.push({
    id: Date.now(),
    title: '',
    duree: '',
    responsable:'',
    decision:false
  })
}

const addAction = () => {
  actions.value.push({
    id: Date.now(),
    // title: '',
    // deadline: '',
    // responsable:'',
    prio:'mid',
    statut:'TODO'
  })
}

const removePoint = (index) => {
  pointsOrdreJour.value.splice(index, 1)
}

const removeAction = (index) => {
  actions.value.splice(index, 1)
}

import { reactive } from 'vue';

const openedActions = reactive(new Set());

const toggleAction = (id) => {
    if (openedActions.has(id)) {
        openedActions.delete(id);
    } else {
        openedActions.add(id);
    }
};

const isOpen = (id) => openedActions.has(id);

</script>