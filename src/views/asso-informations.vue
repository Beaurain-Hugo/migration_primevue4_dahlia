<template>
    <main>
         <Tabs value="0">
            <TabList>
                <Tab value="0">Annonces</Tab>
                <Tab value="1">Informations internes</Tab>
            </TabList>
            <TabPanels :pt="{root:'bg-transparent'}">
            <TabPanel value="0" >
                <div class="flex justify-between items-baseline">
                    <h3>Annonces</h3>
                    <PButton label="Créer" icon="pi pi-plus" :pt="{root:'text-white !bg-[#451d94] border-none'}"/>
                </div>
                <ul>
                    <li>
                        <Card>
                            <template #title>
                                <div>
                                    <div class="flex justify-between items-baseline">
                                        <h4 class="text-main">Ceci est un titre d'annonce</h4>
                                        <div>
                                            <PButton :pt="{root:'hover:!bg-second hover:!text-white'}" severity="contrast" icon="pi pi-pencil text-main" variant="text" rounded class="mr-2" @click="" />
                                            <PButton :pt="{root:'hover:!bg-second'}" icon="pi pi-trash" variant="text" rounded severity="danger" @click="" />
                                        </div>
                                    </div>
                                    <span class="text-lg">Publié le DATE par PERSONNE</span>
                                </div>
                            </template>
                            <template #content>
                                <span>L'assemblée générale annuelle se tiendra le 15 mars 2025 à 18h00 dans la salle principale. Présence de tous les membres souhaitée.</span>
                            </template>
                        </Card>
                    </li>
                </ul>
            </TabPanel>
            <TabPanel value="1">
                   <div class="flex justify-between items-baseline">
                    <h3>Informations internes</h3>
                    <PButton label="Créer" icon="pi pi-plus" :pt="{root:'text-white !bg-[#451d94] border-none'}"/>
                </div>
                <ul>
                    <li>
                        <Card>
                            <template #title>
                                <div>
                                    <div class="flex justify-between items-baseline">
                                        <h4 class="text-main">Ceci est un titre d'annonce</h4>
                                        <div>
                                            <PButton :pt="{root:'hover:!bg-second hover:!text-white'}" severity="contrast" icon="pi pi-pencil text-main" variant="text" rounded class="mr-2" @click="" />
                                            <PButton :pt="{root:'hover:!bg-second'}" icon="pi pi-trash" variant="text" rounded severity="danger" @click="" />
                                        </div>
                                    </div>
                                    <span class="text-lg">Publié le DATE par PERSONNE</span>
                                </div>
                            </template>
                            <template #content>
                                <span>L'assemblée générale annuelle se tiendra le 15 mars 2025 à 18h00 dans la salle principale. Présence de tous les membres souhaitée.</span>
                            </template>
                        </Card>
                    </li>
                </ul>
            </TabPanel>
            </TabPanels>
        </Tabs>
    </main>
</template>