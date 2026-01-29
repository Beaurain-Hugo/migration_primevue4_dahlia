<template>
    <main>
        <Tabs value="0">
            <TabList>
                <Tab value="0">Mes réunions</Tab>
                <Tab value="1">Nouveau CR</Tab>
                <Tab value="2">Rappels</Tab>
            </TabList>
            <TabPanels :pt="{root:'bg-transparent'}">
            <TabPanel value="0" >
                <h3 class="text-black">Historique des réunions</h3>
                <div class="flex gap-4 flex-wrap">
                <Card class="p-3" v-for="(reunion, index) in reunions" :key="index">
                    <template #header>
                        
                        <div class="flex justify-between items-baseline">
                            <h4 class="text-black ">{{ reunion.name }}</h4>
                            <Tag  
                                :class="[' !rounded-full',
                                    statutReunion(reunion.startDate, reunion.document) === 'Terminé' ? 'text-white !bg-main' : '',
                                    statutReunion(reunion.startDate, reunion.document) === 'En attente' ? 'text-white !bg-second' : '',
                                    statutReunion(reunion.startDate, reunion.document) === 'À venir' ? 'bg-white border !border-blue-300 !text-blue-300' : '']"
                                :value="statutReunion(reunion.startDate, reunion.document)" rounded
                            />
                        </div>
                    </template>
                    <template #content>
                        <div class="flex gap-3 flex-col">                            
                            <div class="flex gap-2">
                                <span class="pi pi-calendar"></span>
                                <span>{{ formatDate(reunion.startDate) }}</span>
                            </div>
                            <div class="flex gap-2">
                                <span class="pi pi-users"></span>
                                <span>{{reunion.participants?.length}} Participants</span>
                            </div>
                        </div>
                    </template>
                    <template #footer>
                        
                        <div v-if="reunion.document && reunion.document[0]?.title" class="flex gap-2">
                            <PButton rounded label="Voir" icon="pi pi-eye" @click="openPdf(reunion.document[0].filePath)" />
                            <PButton rounded label="Télécharger le PDF" icon="pi pi-download" @click="downloadPdf(reunion.document[0].filePath)" />
                        </div>
                        <div v-else>
                            <PButton :pt="{root:'text-white !bg-[#451d94] border-none'}" label="Créer le compte-rendu" icon="pi pi-file-pdf" @click="createCR(reunion)" />
                        </div>
                    </template>
                </Card>
                </div>
                <PDialog modal header="Nouveau compte-rendu" v-model:visible="VISIBLE" 
                :pt="{
                    header:'bg-purple-50',
                    content:'p-0'
                }">
                    <template #header>
                        <div>
                            <h5>Nouveau compte-rendu</h5>
                            <span>Étape {{ activeStep }} sur 5</span>
                       </div>
                    </template>
                    <Stepper v-model:value="activeStep" linear class="basis-[40rem]"
                    >
                        <StepList
                        :pt="{
                            root:'bg-[#ffede2]/30'
                        }">
                            <Step v-slot="{ activateCallback, value, a11yAttrs }" asChild :value="1">
                                <div class="flex flex-row flex-auto gap-2" v-bind="a11yAttrs.root">
                                    <PButton :pt="{root:'border-none'}" class="bg-transparent inline-flex gap-2" @click="activateCallback" v-bind="a11yAttrs.header">
                                         <span :class="[
                                                'pi pi-file p-2 rounded-full text-2xl inline-flex items-center justify-center',
                                                {'bg-white text-black': Number(value) > activeStep, 'bg-green-500 text-white': Number(value) < activeStep, 'text-white bg-purple-800': Number(value) == activeStep }
                                            ]"
                                            ></span>
                                        <span :class="[
                                                { ' text-black': Number(value) > activeStep,'text-green-500': Number(value) < activeStep, 'text-purple-800': Number(value) == activeStep }
                                            ]">
                                            Informations
                                        </span>
                                    </PButton>
                                    <Divider :pt="{
                                        root:'w-3'
                                    }"/>
                                </div>
                            </Step>
                            <Step v-slot="{ activateCallback, value, a11yAttrs }" asChild :value="2">
                                <div class="flex flex-row flex-auto gap-2 pl-2" v-bind="a11yAttrs.root">
                                    <PButton :pt="{root:'border-none'}" class="bg-transparent inline-flex gap-2" @click="activateCallback" v-bind="a11yAttrs.header">
                                            <span :class="[
                                                'pi pi-calendar p-2 rounded-full text-2xl inline-flex items-center justify-center',
                                                {'bg-white text-black': Number(value) > activeStep, 'bg-green-500 text-white': Number(value) < activeStep, 'text-white bg-purple-800': Number(value) == activeStep }
                                            ]"
                                            ></span>
                                        <span :class="[
                                                { ' text-black': Number(value) > activeStep,'text-green-500': Number(value) < activeStep, 'text-purple-800': Number(value) == activeStep }
                                            ]">
                                            Agenda{{ value }}
                                        </span>
                                    </PButton>
                                    <Divider :pt="{
                                        root:'w-3'
                                    }"/>
                                </div>
                            </Step>
                            <Step v-slot="{ activateCallback, value, a11yAttrs }" asChild :value="3">
                              <div class="flex flex-row flex-auto gap-2 pl-2" v-bind="a11yAttrs.root">
                                    <PButton :pt="{root:'border-none'}" class="bg-transparent inline-flex gap-2" @click="activateCallback" v-bind="a11yAttrs.header">
                                            <span :class="[
                                                'pi pi-users p-2 rounded-full text-2xl inline-flex items-center justify-center',
                                                {'bg-white text-black': Number(value) > activeStep, 'bg-green-500 text-white': Number(value) < activeStep, 'text-white bg-purple-800': Number(value) == activeStep }
                                            ]"
                                            ></span>
                                        <span :class="[
                                                { ' text-black': Number(value) > activeStep,'text-green-500': Number(value) < activeStep, 'text-purple-800': Number(value) == activeStep }
                                            ]">
                                            Agenda{{ value }}
                                        </span>
                                    </PButton>
                                    <Divider :pt="{
                                        root:'w-3'
                                    }"/>
                                </div>
                            </Step>
                             <Step v-slot="{ activateCallback, value, a11yAttrs }" asChild :value="4">
                                <div class="flex flex-row flex-auto gap-2 pl-2" v-bind="a11yAttrs.root">
                                    <PButton :pt="{root:'border-none'}" class="bg-transparent inline-flex gap-2" @click="activateCallback" v-bind="a11yAttrs.header">
                                            <span :class="[
                                                'pi pi-check-circle p-2 rounded-full text-2xl inline-flex items-center justify-center',
                                                {'bg-white text-black': Number(value) > activeStep, 'bg-green-500 text-white': Number(value) < activeStep, 'text-white bg-purple-800': Number(value) == activeStep }
                                            ]"
                                            ></span>
                                        <span class="font-semibold" :class="[
                                                { ' text-black': Number(value) > activeStep,'text-green-500': Number(value) < activeStep, 'text-purple-800': Number(value) == activeStep }
                                            ]">
                                            Actions
                                        </span>
                                    </PButton>
                                    <Divider :pt="{
                                        root:'w-3'
                                    }"/>
                                </div>
                            </Step>
                            <Step v-slot="{ activateCallback, value, a11yAttrs }" asChild :value="5">
                              <div class="flex flex-row flex-auto gap-2 pl-2" v-bind="a11yAttrs.root">
                                    <PButton :pt="{root:'border-none'}" class="bg-transparent inline-flex gap-2" @click="activateCallback" v-bind="a11yAttrs.header">
                                            <span :class="[
                                                'pi pi-send p-2 rounded-full text-2xl inline-flex items-center justify-center',
                                                {'bg-white text-black': Number(value) > activeStep, 'bg-green-500 text-white': Number(value) < activeStep, 'text-white bg-purple-800': Number(value) == activeStep }
                                            ]"
                                            ></span>
                                        <span :class="[
                                                { ' text-black': Number(value) > activeStep,'text-green-500': Number(value) < activeStep, 'text-purple-800': Number(value) == activeStep }
                                            ]">
                                            Finaliser
                                        </span>
                                    </PButton>
                                </div>
                            </Step>
                        </StepList>
                        <StepPanels class="p-0">
                            <StepPanel v-slot="{ activateCallback }" :value="1">
                                <div class="flex p-4 gap-4 mx-auto max-w-[90vw]">
                                    <div>
                                        <div>
                                            <label for="title">Titre du compte-rendu *</label>
                                            <InputText v-model="compte_rendu.titre" fluid id="title" placeholder="CR CA - 14/09/2025" />
                                        </div>
                                        <div class="flex gap-2">
                                            <div>
                                                <label for="date">Date *</label>
                                                <DatePicker  showIcon inputId="date" v-model="date" dateFormat="dd/mm/yy" placeholder="Sélectionner une date" />
                                            </div>
                                            <div>
                                                <label for="hour">Heure</label>
                                                <DatePicker v-model="time" showIcon iconDisplay="input" timeOnly inputId="hour" placeholder="Heure de début">
                                                    <template #inputicon="slotProps">
                                                        <i class="pi pi-clock" @click="slotProps.clickCallback" />
                                                    </template>
                                                </DatePicker>
                                            </div>
                                        </div>
                                        <div>
                                            <label for="place">Lieu</label>
                                            <InputText v-model="compte_rendu.lieu" fluid id="place" placeholder="Salle de réunion / Visioconférence" />
                                        </div>
                                    </div>
                                    <div class="w-1/2">
                                        <div>
                                            <label for="type">Type de réunion *</label>
                                            <Dropdown fluid v-model="selectedType" id="type" :options="types" optionLabel="name" placeholder="Sélectionner le type" />
                                        </div>
                                        <CheckboxGroup class="flex flex-col gap-2" name="participant" v-model="selectedPart" >
                                            <span>Participants</span>
                                            <VirtualScroller :items="compte_rendu.participants" :itemSize="30" style="width: 300px; height: 200px">
                                                <template v-slot:item="{ item, options }">
                                                    <div :class="['flex items-center p-2', { 'bg-surface-100 dark:bg-surface-700': options.odd }]" style="height: 30px">
                                                        <div class="flex align-items-center gap-1">
                                                            <Checkbox :inputId="item.id"  :value="{ code: item.id, name: item.firstname + ' ' + item.lastName }" />
                                                            <label :for="item.id">{{ item.firstname + ' ' + item.lastName }}</label>
                                                        </div>
                                                    </div>
                                                </template>
                                            </VirtualScroller>
                                        </CheckboxGroup>
                                    </div>
                                </div>
                                <div class="flex bg-[#ffede2]/30 py-3 pr-3 justify-end align-middle">
                                    <PButton label="Suivant" icon="pi pi-arrow-right" :pt="{root:'bg-purple-900 border-purple-900'}" iconPos="right" @click="activateCallback(2)" />
                                </div>
                            </StepPanel>
                            <StepPanel class="" v-slot="{ activateCallback }" :value="2">
                                <div class="p-4 gap-4 mx-auto max-w-[90vw]">
                                    <div class="flex gap-2 items-baseline justify-between">
                                    <div class="text-center mt-4 mb-4 text-xl font-semibold">Points à l'ordre du jour</div>
                                    <PButton label="Ajouter un point" icon="pi pi-plus" @click="addPoint" :pt="{root:'bg-purple-900 border-purple-900'}" />
                                    </div>
                                    <div class="flex flex-col gap-4">
                                    <div class="flex flex-col items-center border rounded-xl shadow p-6" v-if="pointsOrdreJour.length == 0">
                                        <span class=" pi pi-calendar !text-7xl"></span>
                                        <span class="text-xl mt-2">Aucun point à l'ordre du jour</span>
                                        <span>Ajoutez votre premier point pour commencer</span>
                                    </div>
                                    <div class="border shadow rounded-xl justify-between flex px-2 py-4" v-else v-for="(point, index) in pointsOrdreJour" :key="point.id">
                                        <div class="flex flex-col">
                                            <label :for="'salle-'+point.id">Titre du point *</label>
                                            <InputText v-model="pointsOrdreJour[index].title" :id="'salle-'+point.id" placeholder="Ex: Validation du budget" />
                                        </div>
                                        <div class="flex flex-col">
                                            <label :for="'duree-'+point.id">Durée *</label>
                                            <InputNumber  showButtons v-model="pointsOrdreJour[index].duree" :inputId="'duree-'+point.id" suffix=" min" :min="1" placeholder="Indiquez une durée en minute" />
                                        </div>
                                        <div class="flex flex-col"> 
                                            <label :for="'resp'+point.id">Responsable *</label>
                                            <Dropdown v-model="pointsOrdreJour[index].responsable" :id="'resp'+point.id" optionLabel="name" :optionValue="option => option" :options="selectedPart" placeholder="Sélectionner le responsable" />
                                        </div>
                                        <PButton severity="danger" variant="text" icon="pi pi-trash" @click="removePoint(index)" aria-label="Supprimer le point" />
                                    </div>
                                    </div>
                                </div>
                                <div class="flex py-3 px-3 justify-between bg-[#ffede2]/30">
                                    <PButton :pt="{root:'hover:text-white hover:!bg-second border-none !bg-[#f0f0f0] !text-black'}" label="Précédent" severity="secondary" icon="pi pi-arrow-left" @click="activateCallback(1)" />
                                    <PButton label="Suivant" icon="pi pi-arrow-right" :pt="{root:'bg-purple-900 border-purple-900'}" iconPos="right" @click="activateCallback(3)" />
                                </div>
                            </StepPanel>
                            <StepPanel class="" v-slot="{ activateCallback }" :value="3">
                                <div class="p-4 gap-4 mx-auto max-w-[90vw]">
                                    <span class="text-center mt-4 mb-4 text-xl font-semibold">Discussions et décisions.</span>
                                    <div class="flex flex-col items-center border rounded-xl shadow p-6" v-if="pointsOrdreJour.length == 0">
                                        <span class=" pi pi-users !text-7xl"></span>
                                        <span class="text-xl mt-2">Aucun point à l'ordre du jour</span>
                                        <span>Ajoutez votre premier point pour commencer</span>
                                    </div>
                                    <div v-else  v-for="(point, index) in pointsOrdreJour" :key="point.id">
                                        <Card class="p-3">
                                            <template #header>
                                                <Chip :pt="{root:'bg-white border'}" :label="point.title" />
                                                <span class="ml-1">({{ point.duree }} min - {{ point.responsable.name }})</span>
                                            </template>
                                            <template #content>
                                                <label class="font-semibold" :for="'discussions-'+point.id">Discussions et échanges</label>
                                                <PTextarea fluid :id="'discussions-'+point.id" v-model="point.discussions" rows="5" cols="30" placeholder="Détaillez les échanges, arguments et points de vue exprimés"/>
                                                <div>
                                                    <Checkbox :inputId="'decision-'+point.id" v-model="point.decision" @click="console.log(point)" binary @update:modelValue="val => { if (!val) point.synthese = '' }" />
                                                    <label :for="'decision-'+point.id">Une décision a été prise ?</label>
                                                </div>
                                                <div class="mt-3" v-if="point.decision">
                                                    <label class="font-semibold" :for="'synthese-'+point.id">Synthèse de la décision</label>
                                                    <PTextarea fluid :id="'synthese-'+point.id" v-model="point.synthese" rows="5" cols="30" placeholder="Résumé concis des décisions (3 à 5 points)"/>
                                                </div>
                                            </template>
                                        </Card>
                                    </div>
                                </div>
                                <div class="flex p-3 justify-between bg-[#ffede2]/30">
                                    <PButton :pt="{root:'hover:text-white hover:!bg-second border-none !bg-[#f0f0f0] !text-black'}" label="Précédent" severity="secondary" icon="pi pi-arrow-left" @click="activateCallback(2)" />
                                    <PButton label="Suivant" icon="pi pi-arrow-right" :pt="{root:'bg-purple-900 border-purple-900'}" iconPos="right" @click="activateCallback(4)" />
                                </div>
                            </StepPanel>
                             <StepPanel class="" v-slot="{ activateCallback }" :value="4">
                                <div class="p-4 gap-4 mx-auto max-w-[90vw]">
                                <div class="flex gap-2 items-baseline justify-between">
                                    <div class="text-center mt-4 mb-4 text-xl font-semibold">Actions et suivi</div>
                                    <PButton label="Ajouter une action" icon="pi pi-plus" @click="addAction" :pt="{root:'bg-purple-900 border-purple-900'}" />
                                </div>
                                <div class="flex flex-col gap-4">
                                    <div class="flex flex-col items-center border rounded-xl shadow p-6" v-if="actions.length == 0">
                                        <span class="pi pi-check-circle !text-7xl"></span>
                                        <span class="text-xl mt-2">Aucune action définie</span>
                                        <span>Ajoutez des actions pour assurer le suivi des décisions</span>
                                    </div>
                                    <div class="border shadow rounded-xl justify-between flex flex-col px-2 py-4" v-else v-for="(point, index) in actions" :key="point.id">
                                        <div class="flex gap-2 justify-between items-baseline">
                                            <FloatLabel variant="in">
                                                <label :for="'titre-'+point.id">Titre du point *</label>
                                                <InputText fluid v-model="actions[index].title" :id="'titre-'+point.id" placeholder="Ex: Validation du budget" />
                                            </FloatLabel>
                                            <div>                             
                                            <ToggleButton @click="console.log(actions)" :modelValue="isOpen(point.id)" @update:modelValue="() => toggleAction(point.id)" onLabel="Réduire" offLabel="Modifier" />
                                            <PButton severity="danger" variant="text" icon="pi pi-trash" @click="removeAction(index)"  />
                                                </div>
                                        </div>
                                        <div class="flex gap-1 items-baseline">
                                            <Chip v-if="point.responsable" class="bg-transparent" :label="point.responsable.firstname + ' ' + point.responsable.lastName" icon="pi pi-user" />
                                            <Chip v-if="point.date"  class="bg-transparent" :label="point.date" icon="pi pi-calendar" />
                                            <Tag :class="['text-white !rounded-full',
                                                    valueToLabel(point.prio, priorite, 'code')?.name === 'Faible' ? 'bg-gray-500' : '',
                                                    valueToLabel(point.prio, priorite, 'code')?.name === 'Moyenne' ? 'bg-orange-400' : '',
                                                    valueToLabel(point.prio, priorite, 'code')?.name === 'Forte' ? 'bg-red-500 ' : '']"
                                                :icon="'pi ' + prio(valueToLabel(point.prio, priorite, 'code').name)" :value="valueToLabel(point.prio, priorite, 'code').name" />
                                            <Tag :class="['text-white !rounded-full',
                                                    valueToLabel(point.statut, statut, 'code')?.name === 'À faire' ? 'bg-orange-200 tet-black' : '',
                                                    valueToLabel(point.statut, statut, 'code')?.name === 'En cours' ? 'bg-purple-900' : '',
                                                    valueToLabel(point.statut, statut, 'code')?.name === 'Terminé' ? 'bg-green-500 ' : '']"
                                                    :icon="'pi ' + state(valueToLabel(point.statut, statut, 'code').name)" :value="valueToLabel(point.statut, statut, 'code').name" />
                                        </div>
                                        <div class="flex items-baseline gap-3" v-if="isOpen(point.id)">
                                           <div>
                                                <label :for="'resp'+point.id">Assigné à *</label>
                                                <Select v-model="actions[index].responsable" :id="'resp'+point.id" :options="membres" :optionLabel="m => `${m.firstname} ${m.lastName}`" :optionValue="option => option" placeholder="Sélectionner le responsable" />
                                            </div>
                                            <div>
                                                <label for="date">Date d'échéance *</label>
                                                <DatePicker updateModelType="string" showIcon inputId="date" v-model="point.date" dateFormat="dd/mm/yy" placeholder="Sélectionner une date" />
                                            </div>
                                            <div>
                                                <label :for="'prio-'+point.id">Priorité *</label>
                                                <Select defaultValue="mid" v-model="actions[index].prio" :id="'prio-'+point.id" :options="priorite" optionLabel="name" optionValue="code" placeholder="Sélectionner le responsable" />
                                            </div>
                                            <div>
                                                <label :for="'statut-'+point.id">Statut *</label>
                                                <Select defaultValue="TODO" v-model="actions[index].statut" :id="'statut-'+point.id" :options="statut" optionLabel="name" optionValue="code" placeholder="Sélectionner le responsable" />
                                            </div>
                                        </div>
                                        <div class="flex justify-end" v-else>
                                            <span>Cliquez sur "Modifier" pour plus d'options</span>
                                        </div>
                                    </div>
                                </div>
                                </div>
                                <div class="flex p-3 justify-between bg-[#ffede2]/30">
                                    <PButton :pt="{root:'hover:text-white hover:!bg-second border-none !bg-[#f0f0f0] !text-black'}" label="Précédent" severity="secondary" icon="pi pi-arrow-left" @click="activateCallback(3)" />
                                    <PButton label="Suivant" icon="pi pi-arrow-right" :pt="{root:'bg-purple-900 border-purple-900'}" iconPos="right" @click="activateCallback(5)" />
                                </div>
                            </StepPanel>
                             <StepPanel class="" v-slot="{ activateCallback }" :value="5">
                                <div class="p-4 gap-4 mx-auto max-w-[90vw]">
                                    <div class="mt-4 mb-4 text-xl font-semibold">Récapitulatif et finalisation</div>
                                    <div class="flex gap-2 items-baseline justify-between">
                                        <Card>
                                        <template #header>
                                            <div class="p-3 flex gap-3 items-baseline">
                                                <span class="pi text-purple-800 text-xl pi-users"></span>
                                                <span class="text-xl">Participants</span>
                                            </div>
                                        </template>
                                        <template #content>
                                            <div class="flex flex-col">
                                                <span class="text-3xl">{{ selectedPart.length }}</span>
                                                <span>personnes présentes</span>
                                            </div>
                                        </template>
                                    </Card>
                                     <Card>
                                        <template #header>
                                            <div class="p-3 flex gap-3 items-baseline">
                                                <span class="pi pi-check-circle text-xl text-green-500"></span>
                                                <span class="text-xl">Décisions </span>
                                            </div>
                                        </template>
                                        <template #content>
                                             <div class="flex flex-col">
                                                <span class="text-3xl">{{ pointsOrdreJour.length }}</span>
                                                <span>décisions prises</span>
                                            </div>
                                        </template>
                                    </Card>
                                    <Card>
                                        <template #header>
                                            <div class="p-3 flex gap-3 items-baseline">
                                                <span class="pi pi-file text-xl text-yellow-500"></span>
                                                <span class="text-xl">Actions</span>
                                            </div>
                                        </template>
                                        <template #content>
                                            <div class="flex flex-col">
                                                <span class="text-3xl">{{ actions.length }}</span>
                                                <span> à suivre</span>
                                            </div >
                                        </template>
                                    </Card>
                                    </div>
                                    
                                    
                                     <div id="pdf-content" class="flex flex-col gap-4 m-4">
                                        <div>
                                            <h1>Compte-rendu</h1>
                                            <h2>{{ compte_rendu.titre }}</h2>
                                        </div>
                                        <DataTable :value="[{}]" showGridlines class="p-datatable-sm">
                                          <Column header="Date">
                                            <template #body>
                                              {{ date?.toLocaleDateString("fr-FR", { timeZone: "UTC" }) }}
                                            </template>
                                          </Column>
                                          <Column header="Horaires">
                                            <template #body>
                                               {{ time?.toLocaleTimeString("fr-FR", { timeZone: "UTC" }) }}
                                            </template>
                                          </Column>
                                           <Column header="Lieu">
                                            <template #body>
                                              {{ compte_rendu.lieu }}
                                            </template>
                                          </Column>
                                          <Column v-if="selectedType" header="Type de réunion">
                                            <template #body>
                                              {{ selectedType.name }}
                                            </template>
                                          </Column>
                                        </DataTable>
                                        <div>
                                        <Chip><span>Participants</span></Chip>
                                        <DataTable :value="[{}]" showGridlines class="p-datatable-sm pt-2">
                                          <Column header="Présents">
                                            <template #body>
                                              <ul>
                                                <li v-for="p in presentMembers" :key="p.user_id">
                                                  {{ p.firstname + ' ' + p.lastName }}              
                                                </li>
                                              </ul>
                                            </template>
                                          </Column>
                                          <Column header="Absents">
                                            <template #body>
                                              <ul>
                                                <li v-for="p in absentMembers" :key="p.user_id">
                                                  {{ p.firstname + ' ' + p.lastName }}
                                                </li>
                                              </ul>
                                            </template>
                                          </Column>
                                        </DataTable>
                                        </div>
                                        <div>
                                            <Chip><span>Ordres du jour</span></Chip>
                                            <ul>
                                            <li class="list-disc ml-4 mt-2" v-for="(point,index) in pointsOrdreJour" :key="index">
                                                {{point.title}}
                                            </li>
                                            </ul>
                                        </div>
                                        <div>
                                            <Chip><span>Discussions et décisions</span></Chip>
                                            <div v-for="(point, index) in pointsOrdreJour" :key="index">
                                                <h3>{{ point.title }} par {{ point.responsable.name }}</h3>
                                                {{ point.discussions }}
                                                <div v-if="point.synthese">
                                                <span class="font-bold">Décision :</span>
                                                <span>{{ point.synthese }}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="flex flex-col gap-2" v-if="actions.length > 0">
                                            <Chip><span>Actions à prendre</span></Chip>
                                            <DataTable :value="actions" showGridlines tableStyle="min-width: 50rem">
                                                <Column field="title" header="Actions">
                                                </Column>
                                                <Column field="statut" header="Etat"><template #body="{ data }">
                                                   <Tag :class="['text-white !rounded-full',
                                                    valueToLabel(data.statut, statut, 'code')?.name === 'À faire' ? 'bg-orange-200 !text-black' : '',
                                                    valueToLabel(data.statut, statut, 'code')?.name === 'En cours' ? 'bg-purple-900' : '',
                                                    valueToLabel(data.statut, statut, 'code')?.name === 'Terminé' ? 'bg-green-500 ' : '']"
                                                    :icon="'pi ' + state(valueToLabel(data.statut, statut, 'code').name)" :value="valueToLabel(data.statut, statut, 'code').name" />
                                                </template></Column>
                                                <Column field="prio" header="Priorité"><template #body="{ data }">
                                                    <Tag :class="['text-white !rounded-full',
                                                    valueToLabel(data.prio, priorite, 'code')?.name === 'Faible' ? 'bg-gray-500' : '',
                                                    valueToLabel(data.prio, priorite, 'code')?.name === 'Moyenne' ? 'bg-orange-400' : '',
                                                    valueToLabel(data.prio, priorite, 'code')?.name === 'Forte' ? 'bg-red-500 ' : '']"
                                                :icon="'pi ' + prio(valueToLabel(data.prio, priorite, 'code').name)" :value="valueToLabel(data.prio, priorite, 'code').name" />
                                                </template></Column>
                                                <Column field="date" header="Deadline"></Column>
                                                <Column  field="responsable.username" header="Personne en charge">
                                                    <template #body="{ data }">
                                                    {{ data.responsable?.firstname +' '+ data.responsable?.lastName}}
                                                </template></Column>
                                            </DataTable>
                                          
                                        </div>
                                    </div>
                                    </div>

                                    <div class="flex p-3 justify-between bg-[#ffede2]/30">
                                    <PButton :pt="{root:'hover:text-white hover:!bg-second border-none !bg-[#f0f0f0] !text-black'}" label="Précédent" severity="secondary" icon="pi pi-arrow-left" @click="activateCallback(4)" />
                                    <PButton :pt="{root:'bg-purple-900 border-purple-900'}" label="Publier et envoyer" severity="secondary" icon="pi pi-send" @click="generatePdf" />
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
    import Event from '@/models/EventModel';
    import Membre from '@/models/MembreModel';
    import {useEventService} from '@/composable/event/EventService';
    import {useEvent} from '@/composables/event/EventService';
    import {useUserService} from '@/composable/user/UserService';
    import {useDocumentService} from '@/composable/document/DocumentService';
    import {useAssoService} from '@/composable/asso/AssoService';
    import {useMemberService} from '@/composable/member/MemberService';
    import { ref, onMounted, computed } from 'vue';
    import html2canvas from 'html2canvas';
    import jsPDF from 'jspdf';
    const generatePdfBlob = async (element) => {
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true
        });

        const imgData = canvas.toDataURL('image/png');

        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        console.log(pdf.output('blob'))
        return pdf.output('blob'); // ✅ PROMISE RESOLUE
    };
    const generatePdf = async () => {
        const element = document.getElementById('pdf-content');

        const blob = await generatePdfBlob(element); // ✅ fonctionne

        const formData = new FormData();
        formData.append('contenu', blob, 'compte_rendu.pdf');
        formData.append('association_id', '1');
        formData.append('titre', `compte_rendu_${compte_rendu.value.titre}`);
        const id = await AssoService.addDocuments(formData);
        console.log(id)
        const data = {
             "title": `compte_rendu_${compte_rendu.value.titre}`,
            "filePath": `${id.id}`,
            "createDate": `${new Date().toISOString()}`,
            "updateDate": `${new Date().toISOString()}`,
            "archived": false,
            "readRoles": "",
            "association":`/api/associations/${sessionStorage.getItem('idAsso')}`,
            "downloadRoles": "",
            "documentType": "/api/document_types/1",
            "user": `/api/users/${localStorage.getItem('id_user')}`,
            "event": `/api/events/${compte_rendu.value.id}`
        }
        await DocumentService.addDocument(data);
        // await uEvent.updateEvent(compte_rendu.value.id, {
        //     document_id: id.id
        // });
    };
    const openPdf = async (id) => {
        const { blob } = await AssoService.getDocumentById(id);
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
    };
    const downloadPdf = async (id) => {
        const { blob, filename } = await AssoService.getDocumentById(id);
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename; // nom correct
        a.click();
        URL.revokeObjectURL(url);
    };
    const formatDate = (date: Date | string | number | null | undefined): string => {
        if (!date) return '';
        const parsedDate = new Date(date); 
        if (isNaN(parsedDate.getTime())) return '';
        const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Intl.DateTimeFormat('fr-FR', options).format(parsedDate);
    };
    const statutReunion = (date: Date | string | number | null | undefined, hasCR:any): string => {
        if (!date) return '';
        const parsedDate = new Date(date);
        console.log(hasCR)
        if(Date.now() > parsedDate && hasCR.length > 0){
            return 'Terminé';
        }else if (Date.now() > parsedDate && hasCR.length == 0) {
            return 'En attente'
        } else {
            return 'À venir'
        }
    };

    const test = ref(false)
    const reunions = ref<Event[]>([]);
    const membres = ref<Membre[]>([]);
    const compte_rendu = ref({});
    const EventService = useEventService();
    const uEvent = useEvent();
    const AssoService = useAssoService();
    const DocumentService = useDocumentService();
    const UserService = useUserService();
    const MemberService = useMemberService();
    const title = ref()
    const lieu = ref()
    const date = ref()
    const time = ref()
    const selectedType = ref();
    const selectedPart = ref([]);
    const absentPart = computed(() => {
  const participants = compte_rendu.value.participants ?? [];
  const selected = selectedPart.value ?? [];

  const selectedCodes = new Set(
    selected.map(s => s.code)
  );

  return participants.filter(
    p => !selectedCodes.has(p.user_id)
  );
});

const participantsWithStatus = computed(() => {
  const participants = compte_rendu.value?.participants ?? []

  // On normalise les IDs présents (number)
  const presentIds = new Set(
    (selectedPart.value ?? []).map(p => Number(p.code))
  )

  return participants.map(user => ({
    id: user.id,
    firstname: user.firstname,
    lastName: user.lastName,
    email: user.email,
    isPresent: presentIds.has(user.id)
  }))
})

const presentMembers = computed(() =>
  participantsWithStatus.value.filter(p => p.isPresent)
);

const absentMembers = computed(() =>
  participantsWithStatus.value.filter(p => !p.isPresent)
);


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
    const createCR = (data) => {
        compte_rendu.value = {...data}
        console.log(compte_rendu.value)
        VISIBLE.value = true
    }

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
const getUsersFromParticipants = async (participants) => {
  if (!participants || !participants.length) return []

  return await Promise.all(
    participants.map(async (userIri) => {
      const response = await UserService.getUser(userIri)
      return await response
    })
  )
}
const geDocumentsFromEvents = async (documents) => {
  if (!documents || !documents.length) return []

  return await Promise.all(
    documents.map(async (userIri) => {
      const response = await DocumentService.getDocument(userIri)
      return await response
    })
  )
}
    onMounted(async () => {
        const response = await AssoService.getAssociationById(Number(sessionStorage.getItem('idAsso')));
        console.log(response)
        membres.value = await Promise.all(
          response.associationUsers.map(async element => {
        	      const member = await MemberService.getMember(element)
            const user = await UserService.getUser(member.user)
            return { ...user }
          })
        )
        console.log(membres.value)
        const res = await EventService.getEventsByTypeByAssoId(Number(sessionStorage.getItem('idAsso')), "test")
        reunions.value = await Promise.all(
    res.map(async (event) => {
      const participantsDetails = await getUsersFromParticipants(event.participants)
        const document = await geDocumentsFromEvents(event.documents)
      return {
        ...event,
        participants:participantsDetails,
        document
      }
    })
  )
        console.log(reunions.value)
    })

    const valueToLabel = (value, array, label) => {
        return array.find(val => val[label] === value)
    }
    const prio = (label) => {
        console.log(label)
        switch(label){
            case label = "Faible":
                return "pi-clock"
            case label = "Moyenne":
                return "pi-exclamation-triangle"
            case label = "Forte":
                return "pi-exclamation-triangle"
        } 
    };
    const state = (label) => {
        console.log(label)
        switch(label){
            case label = "À faire":
                return "pi-clock"
            case label = "En cours":
                return "pi-clock"
            case label = "Terminé":
                return "pi-check-circle"
        }
            
    };
    const findIndexById = (id, array) => {
        let index = 0;
        console.log("findbyindex", id, array);
        for (let i = 0; i < array.length; i++) {
            if (array[i].id === id) {
                index = i;
                console.log(index)
                break;
            }
        }
        return index;
    };

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
import User from '@/components/User.vue';

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