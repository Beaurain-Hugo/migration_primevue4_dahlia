<template>
  <div class="p-4">
    <!-- Cartes de résumé -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
      <div class="card p-4 flex items-center justify-between" style="flex: 1 1 22%;">
        <i class="pi pi-calendar text-blue-500 text-3xl"></i>
        <div>
          <h5>Total Transactions</h5>
          <p class="text-xl font-bold">{{ transactions.length }}</p>
        </div>
      </div>
      <div class="card p-4 flex items-center justify-between" style="flex: 1 1 22%;">
        <i class="pi pi-wallet text-green-500 text-3xl"></i>
        <div>
          <h5>Total Crédit</h5>
          <p class="text-xl font-bold">{{ totalCredit }} €</p>
        </div>
      </div>
      <div class="card p-4 flex items-center justify-between" style="flex: 1 1 22%;">
        <i class="pi pi-minus text-red-500 text-3xl"></i>
        <div>
          <h5>Total Débit</h5>
          <p class="text-xl font-bold">{{ totalDebit }} €</p>
        </div>
      </div>
      <div class="card p-4 flex items-center justify-between" style="flex: 1 1 22%;">
        <i class="pi pi-dollar text-yellow-500 text-3xl"></i>
        <div>
          <h5>Budget total</h5>
          <p class="text-xl font-bold">{{ netBalance }} €</p>
        </div>
      </div>
    </div>
    <Tabs value="0">
      <TabList>
        <Tab value="0">Vue générale</Tab>
        <Tab value="1">Budget détaillé</Tab>
        <Tab value="2">Conseils IA</Tab>
      </TabList>
      <TabPanels>
      <TabPanel value="0">
        <!-- Graphique en courbes -->
    <div class="mb-4">
      <DatePicker v-model="periods" placeholder="Sélectionner deux dates" selectionMode="range" :manualInput="false" @update:modelValue="updateChartData" />
      <div class="flex justify-around">
        <div class="shadow card">
        <Chart type="line" :data="lineChartData" :options="lineChartOptions" class="h-[28rem]" />
        </div>
        <div class="card shadow">
        <Chart type="pie" :data="pieChartData" :options="chartOptions" class="h-[28rem]" />
        </div>
      </div>
    </div>
      </TabPanel>
        <TabPanel value="1" class="fle flex-col gap-4">
          <Card class="!bg-gradient-to-br !from-[#451D94]/5 !to-white shadow-2xl">
            <template #header>
              <div class="p-4 flex justify-between items-center">
                <div>
                  <h4 class="flex gap-2 items-baseline">
                    <span class="fa fa-bullseye text-purple-800"></span>
                    <span>Sélection du budget</span>
                  </h4>
                    <span>Gérez plusieurs budgets avec des périodes et montants différents</span>
                  </div>
                  <PButton :pt="{root:'text-white bg-purple-900 border-purple-900'}" label="Créer un nouveau budget" @click="showDialogBudget = true" icon="pi pi-plus"  />
              </div>
            </template>
            <template #content>
              <div class="flex flex-wrap justify-around gap-2 flex-1">
                <Card class="min-w-80 hover:shadow-purple-800 hover:shadow-sm" v-for="bdgt in budgets" :key="bdgt.id">
                  <template #title>
                    <div>
                      <h5>
                        {{ bdgt.Title }}
                      </h5>
                    </div>
                  </template>
                  <template #content>
                    <div>
                      <div class="flex justify-between">
                      <span>Montant total</span>
                      <span class="text-purple-800 font-bold">{{ bdgt.totalAmount }}€</span>
                      </div>
                      <div class="flex justify-between">
                      <span>Période</span>
                      <span class="text-sm">{{ new Date(bdgt.startDate).toLocaleDateString() }} - {{ new Date(bdgt.endDate).toLocaleDateString() }}</span>
                      </div>
                    </div>
                  </template>
                  <template #footer>
                    <PButton :pt="{root:'text-white bg-purple-900 border-purple-900'}" label="Suivre ce budget" @click="getBudgetSuivi(bdgt.id)"/>
                  </template>
                </Card>
              </div>
            </template>
          </Card>
          
          <Card v-if="budget && budget.id">
            <template #header>
              <div class="pt-4 px-4 text-lg">
                Suivi budgétaire par catégorie
              </div>
            </template>
            <template #content>
             <div
                  class="flex mt-2 flex-col gap-1"
                  v-for="(budg, index) in entriesWithTotals"
                  :key="index"
                >
                  <div class="flex justify-between">
                    <span class="text-lg font-semibold">
                      {{ budg.type }}
                    </span>
                  
                    <span>
                      {{ budg.montant_reel }}€ / {{ budg.amount }}€
                    </span>
                  </div>
                
                  <ProgressBar
                    :value="budg.taux_utilisation"
                    :pt="{ root: 'bg-purple-200', value: '!bg-[#451d94]' }"
                  />
                
                  <div class="flex justify-between">
                    <span
                      :class="{
                        'text-green-500': budg.amount - budg.montant_reel > 0,
                        'text-red-500': budg.amount - budg.montant_reel < 0,
                        'text-orange-600': budg.taux_utilisation > 90
                      }"
                    >
                      {{ budg.amount - budg.montant_reel }}€ restants
                    </span>
                  
                    <span>
                      {{ budg.taux_utilisation }} % utilisé
                    </span>
                  </div>
                </div>

            </template>
          </Card>
        </TabPanel>
        <TabPanel value="2">
          <div id="messages">

          </div>
          <div v-html="msg.html" v-for="(msg, index) in parsedMessages" :key="index"></div>
          <input type="text" id="userInput" v-model="userMessage" @keyup.enter="sendMessage">
        </TabPanel>
      </TabPanels>
    </Tabs>
     
     <!-- Table des transactions -->
      <DataTable 
      :pt="{
        root:'rounded-xl p-2',
        header:'rounded-t-xl bg-white border-none',
        pcPaginator:{
          paginatorContainer:{class:'rounded-b-xl border-none'},
        },
        bodyrow:'hover:bg-orange-50'

      }"
      class="shadow-lg"
      v-model:filters="filters"
      :value="transactions"
      paginator
      :rows="5"
      dataKey="id"
      size="small"
      filterDisplay="menu"
      :loading="loading"
      :globalFilterFields="['name', 'thirdParty', 'amount', 'date']"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rowsPerPageOptions="[5, 15, 25]"
      currentPageReportTemplate="Affiche {first} à {last} de {totalRecords} transactions"
    >
        <template #header>
          <div class="flex justify-between items-baseline">
            <div>
            <span class="pi pi-file"></span>
            <span class="text-xl">Historique des transactions</span>
            </div>
            <div class="flex gap-2 items-baseline">
            <PButton :pt="{root:'text-white bg-purple-900 border-purple-900'}" label="Ajouter une transaction" icon="pi pi-plus" @click="showDialogNewTransactions = true" class="mb-3" />
            <InputText v-model="filters['global'].value" placeholder="Rechercher" />
            </div>
          </div>
        </template>
        <template #empty>Aucune transaction trouvée</template>
        <template #loading>Chargement des transactions. Veuillez patienter.</template>
   <Column :pt="{
          headerCell:'bg-white'
        }" field="date" dataType="date" header="Date" style="min-width: 12rem">
          <template #body="{ data }">
            <span class="pi pi-calendar"></span>
            {{ formatDate(data.date) }}
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <DatePicker v-model="filterModel.value" dateFormat="dd/mm/yy" @change="filterCallback()" placeholder="Filtrer par date" />
          </template>
        </Column>
         <Column :pt="{
          headerCell:'bg-white'
        }" field="transactionType" header="transactionType" :showFilterMatchModes="false" style="min-width: 12rem">
          <template #body="{ data }">
            <Tag :pt="{root:'!bg-rose-300 text-white !rounded-full'}" :value="data.transactionType"/>
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" @input="filterCallback()" placeholder="Filtrer par transactionType" />
          </template>
        </Column>
        <Column :pt="{
          headerCell:'bg-white'
        }" field="name" header="Description" :showFilterMatchModes="false" style="min-width: 12rem">
          <template #body="{ data }">
            <span class="font-bold">{{ data.name }}</span>
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" @input="filterCallback()" placeholder="Filtrer par nom de transaction" />
          </template>
        </Column>
  
        <Column :pt="{
          headerCell:'bg-white'
        }" field="amount" header="Montant" :showFilterMatchModes="false" style="min-width: 10rem">
          <template #body="{ data }">
            <span :class="['font-semibold', {'text-green-500':data.amount > 0, 'text-red-500':data.amount < 0}]">{{ data.amount }}€</span>
          </template>
          <template #filter="{ filterModel }">
            
            <Slider :min="minValue" :max="maxValue" v-model="filterModel.value" range class="m-4"></Slider>
            <div class="flex items-center justify-between px-2">
                <span>{{ filterModel.value ? filterModel.value[0] : minValue }}</span>
                /
                <span>{{ filterModel.value ? filterModel.value[1] : maxValue }}</span>
            </div>
          </template>
          
        </Column>
  
       
  
        <Column :pt="{
          headerCell:'bg-white'
        }" field="thirdParty" header="thirdParty" :showFilterMatchModes="false" style="min-width: 12rem">
          <template #body="{ data }">
            {{ data.thirdParty }}
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" @input="filterCallback()" placeholder="Filtrer par tier" />
          </template>
        </Column>
       
    </DataTable>
     <!-- Dialogue pour ajouter une transaction -->
    <PDialog header="Ajouter une transaction" v-model:visible="showDialogNewTransactions" :modal="true" :style="{ width: '50vw' }">
      <div class="flex flex-col gap-2">
			  <span>Entrez les détails de la transaction pour la sauvegarder.</span>
        <div class="flex items-baseline gap-2">
          <div class="flex flex-col">
            <label for="date">Date</label>
            <DatePicker class="shadow-none p-0" id="date" v-model="newTransaction.date" placeholder="Sélectionnez une date" dateFormat="dd/mm/yy" />
          </div>
          <div class="flex flex-col">
            <label for="thirdParty">Tiers</label>
            <InputText id="thirdParty" v-model="newTransaction.thirdParty" />
          </div>
        </div>
        <div class="flex gap-2">
			    <div class="flex flex-col">
				    <label for="transactionType">Catégorie</label>
				    <Select v-model="selectedCat" :options="categories.member" optionLabel="name" optionValue="id" placeholder="Sélectionner la catégorie" class="w-full md:w-56" />
			    </div>
          <div class="flex flex-col">
            <label for="amount">Montant</label>
            <InputNumber id="amount" v-model="newTransaction.amount" />
          </div>
        </div>
        <div>
				<label for="name">Nom de la transaction</label>
        <InputText fluid id="name" v-model="newTransaction.name" />
			</div>
      </div>
      <template #footer>
        <PButton label="Ajouter la transaction" @click="addTransaction" :pt="{root:'text-white bg-purple-900 border-purple-900'}"  />
      </template>
    </PDialog>
    <PDialog header="Définition du budget" v-model:visible="showDialogBudget" :modal="true">
      <template #header>
        <div class="p-fluid">
          <h3>Créer un nouveau budget</h3>
          <span>Définissez la période et la répartition de votre budget par catégories</span>
        </div>
      </template>
      <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <div>
          <label for="name">Nom du budget</label>
          <InputText fluid id="name" v-model="titre_budget" />
        </div>
        <div>
          <label for="dates">Période de définition du budget</label>
          <DatePicker fluid inputId="dates" v-model="dates_budget" placeholder="Sélectionner deux dates" selectionMode="range" :manualInput="false" />
        </div>
      </div>
      <div class="flex justify-between">
        <div>
          <span class="fa fa-bullseye text-purple-800"></span>
          <span class="text-lg"> Répartition du budget</span>
        </div>
        <div>
          <span>Total : </span>
          <span class="text-purple-800">{{ allBudgetUsed }}€ </span>
        </div>
      </div>
      <Card>
        <template #title>
           <div class="flex justify-between">
            <div class="flex flex-col">
            <span class="font-semibold">Administratif</span>
            <span class="text-gray-600 text-sm font-light">{{percetBudgetAdmin}}% du budget total</span>
            </div>
              <span>{{budgetAdmin}}€</span>
          </div>
        
        </template>
        <template #content>
          <div class="flex flex-col gap-2">
            <div>
              <label for="budgetAdmin">Montant </label>
              <InputNumber showButtons :min="0" v-model="budgetAdmin" inputId="budgetAdmin" mode="currency" currency="EUR" locale="fr-FR" />
            </div>
            <ProgressBar :value="Number(percetBudgetAdmin)" :pt="{root:'bg-purple-200', value:'!bg-[#451d94]'}" ></ProgressBar>
          </div>
        </template>
      </Card>
      <Card>
        <template #title>
           <div class="flex justify-between">
            <div class="flex flex-col">
            <span class="font-semibold">Déplacement</span>
            <span class="text-gray-600 text-sm font-light">{{percetBudgetDeplacement}}% du budget total</span>
            </div>
              <span>{{budgetDeplacement}}€</span>
          </div>
        
        </template>
        <template #content>
          <div class="flex flex-col gap-2">
            <div>
              <label for="budgetDeplacement">Montant </label>
              <InputNumber showButtons :min="0" v-model="budgetDeplacement" inputId="budgetDeplacement" mode="currency" currency="EUR" locale="fr-FR" />
            </div>
            <ProgressBar :value="Number(percetBudgetDeplacement)" :pt="{root:'bg-purple-200', value:'!bg-[#451d94]'}" ></ProgressBar>
          </div>
        </template>
      </Card>
      <Card>
        <template #title>
           <div class="flex justify-between">
            <div class="flex flex-col">
            <span class="font-semibold">Ressources Humaines</span>
            <span class="text-gray-600 text-sm font-light">{{percetBudgetRH}}% du budget total</span>
            </div>
              <span>{{budgetRH}}€</span>
          </div>
        
        </template>
        <template #content>
          <div class="flex flex-col gap-2">
            <div>
              <label for="budgetRH">Montant </label>
              <InputNumber showButtons :min="0" v-model="budgetRH" inputId="budgetRH" mode="currency" currency="EUR" locale="fr-FR" />
            </div>
            <ProgressBar :value="Number(percetBudgetRH)" :pt="{root:'bg-purple-200', value:'!bg-[#451d94]'}" ></ProgressBar>
          </div>
        </template>
      </Card>
      <Card>
        <template #title>
           <div class="flex justify-between">
            <div class="flex flex-col">
            <span class="font-semibold">Evènements</span>
            <span class="text-gray-600 text-sm font-light">{{percetBudgetEvent}}% du budget total</span>
            </div>
              <span>{{budgetEvent}}€</span>
          </div>
        
        </template>
        <template #content>
          <div class="flex flex-col gap-2">
            <div>
              <label for="budgetEvent">Montant </label>
              <InputNumber showButtons :min="0" v-model="budgetEvent" inputId="budgetEvent" mode="currency" currency="EUR" locale="fr-FR" />
            </div>
            <ProgressBar :value="Number(percetBudgetEvent)" :pt="{root:'bg-purple-200', value:'!bg-[#451d94]'}" ></ProgressBar>
          </div>


        </template>
      </Card>
      <Card>
        <template #title>
          <div class="flex justify-between">
          <div class="flex flex-col">
            <span class="font-semibold">Communication</span>
            <span class="text-gray-600 text-sm font-light">{{percetBudgetCom}}% du budget total</span>
          </div>
          <span>{{budgetCom}}€</span>
          </div>
        </template>
        <template #content>
          <div lass="flex flex-col gap-2">
            <div>
              <label for="budgetCom">Montant </label>
              <InputNumber showButtons :min="0" v-model="budgetCom" inputId="budgetCom" mode="currency" currency="EUR" locale="fr-FR" />
            </div>
            <ProgressBar :value="Number(percetBudgetCom)" :pt="{root:'bg-purple-200', value:'!bg-[#451d94]'}"></ProgressBar>
          </div>
        </template>
      </Card>
       <Card>
        <template #title>
          <div class="flex justify-between">
          <div class="flex flex-col">
            <span class="font-semibold">Matériel</span>
            <span  class="text-gray-600 text-sm font-light">{{percetBudgetMat}}% du budget total</span>
          </div>
          <span>{{budgetMat}}€</span>
          </div>
        </template>
        <template #content>
          <div class="flex flex-col gap-2">
            <div>
              <label for="budgetMat">Montant </label>
              <InputNumber showButtons :min="0" v-model="budgetMat" inputId="budgetMat" mode="currency" currency="EUR" locale="fr-FR" />
            </div>
            <ProgressBar :value="Number(percetBudgetMat)" :pt="{root:'bg-purple-200', value:'!bg-[#451d94]'}"></ProgressBar>
          </div>
        </template>
      </Card>
     </div>
      <template #footer>
        <PButton  :pt="{root:'text-white bg-purple-900 border-purple-900'}" label="Enregistrer le budget" @click="addBuget" />
      </template>
    </PDialog>
  </div>
</template>
  
<script setup lang="ts">
  import { ref, onMounted, computed, watch } from 'vue';
  import {useRoute} from 'vue-router';
  import { useAssoService } from '@/composable/asso/AssoService';
  import { useTransactionService } from '@/composable/transactions/TransactionService';
  import { useBudgetService } from '@/composable/budget/BudgetService';
  import { useLinesService } from '@/composable/line/LinesService';
  import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
    import { useToast } from 'primevue/usetoast';

  const minValue = computed(() => {
  if (!transactions.value.length) return null;
  return Math.min(...transactions.value.map(t => t.amount));
});

const maxValue = computed(() => {
  if (!transactions.value.length) return null;
  return Math.max(...transactions.value.map(t => t.amount));
});

const budgetEvent = ref(0)
const budgetAdmin = ref(0)
const budgetRH = ref(0)
const budgetDeplacement = ref(0)
const budgetCom = ref(0)
const budgetMat = ref(0)
const dates_budget = ref();
const budget = ref();
const budgets = ref();
const categories = ref();

const allBudgetUsed = computed(() => {
  return budgetEvent.value + budgetCom.value + budgetMat.value  + budgetAdmin.value + budgetDeplacement.value + budgetRH.value
  })

const percetBudgetEvent = computed(() => {
  return ((budgetEvent.value / allBudgetUsed.value)*100).toFixed(2)
})

const percetBudgetMat = computed(() => {
  return ((budgetMat.value / allBudgetUsed.value)*100).toFixed(2)
})

const percetBudgetCom = computed(() => {
  return ((budgetCom.value /  allBudgetUsed.value)*100).toFixed(2)
})

const percetBudgetRH = computed(() => {
  return ((budgetRH.value /  allBudgetUsed.value)*100).toFixed(2)
})

const percetBudgetAdmin = computed(() => {
  return ((budgetAdmin.value /  allBudgetUsed.value)*100).toFixed(2)
})

const percetBudgetDeplacement = computed(() => {
  return ((budgetDeplacement.value /  allBudgetUsed.value)*100).toFixed(2)
})

  const titre_budget = ref();
  const route = useRoute();
  const assoService = useAssoService();
  const transactionService = useTransactionService();
  const linesService = useLinesService();
  const budgetService = useBudgetService();
  const transactions = ref([]);
  const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    amount: { value: null, matchMode: FilterMatchMode.BETWEEN },
    date:{ operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_BEFORE }]},
    thirdParty: { value: null, matchMode: FilterMatchMode.STARTS_WITH }
  });
  const newTransaction = ref({
    association: `/api/associations/${sessionStorage.getItem("idAsso")}`,
    name: "",
    amount: "",
    cancelled: false,
    date: null,
    thirdParty: "",
    transactionType: '',
  });
  const newBudget = computed(() => {
    const startDate = ref()
    const endDate = ref()
    if(dates_budget.value.length == 2)
    { [startDate.value, endDate.value] = dates_budget.value}
    return {
    Title: titre_budget.value,
    startDate:startDate.value,
    endDate:endDate.value,

  }});
  const showDialogNewTransactions = ref(false);
  const showDialogBudget = ref(false);
  const loading = ref(true);
  const toast = useToast();
  // const lineChartData = ref(null);
  // const pieChartData = ref(null);
  const lineChartOptions = ref(null);
  const periods = ref()

// CHANGER LES VALEURS DANS LES PAGES QUAND CHANGEMENT D'ASSO
watch(() => route.params.id, async (newId) => {
    const id = newId ? Number(newId) : null;
    const idAsso = sessionStorage.getItem('idAsso'); // Récupérer l'ID de l'association actuelle
    if (id == Number(idAsso)) {
      const res = await assoService.getAllTresorieByAssociations(Number(idAsso)); // Récupérer les membres de l'association par son ID
      transactions.value = res.map(transaction => ({
        ...transaction,
        date: new Date(transaction.date)
      }));
    }
});

 async function sumBudgetEntries(entries: string[]) {
  const responses = await Promise.all(
    entries.map(async (iri) => {
      try {
        const res = await linesService.getLine(iri);
        return res;
      } catch (e) {
        console.warn('Impossible de charger', iri);
        return null;
      }
    })
  );
  return responses.reduce((sum, line) => {
    if (!line || typeof Number(line.amount) !== 'number') return sum;
    return sum + Number(line.amount);
  }, 0);
}

const transactionsTotalByType = computed(() => {
  const map = {}

  budget.value.transactionsTotal.forEach(t => {
    map[t.type] = t.total
  })

  return map
})

const entriesWithTotals = computed(() => {
  return budget.value.entries.map(entry => {
    const montantReel =
      transactionsTotalByType.value[entry.type] ?? 0

    const montantPrevu = Number(entry.amount)

    const tauxUtilisation =
      montantPrevu > 0
        ? Math.round((montantReel / montantPrevu) * 100)
        : 0

    return {
      ...entry,
      montant_reel: montantReel,
      taux_utilisation: tauxUtilisation
    }
  })
})


  onMounted(async () => {
    try {
      const asso = await assoService.getAssociationById(Number(sessionStorage.getItem("idAsso")))
      console.log(asso.objec)
      getResponse(asso.objec)
      categories.value = await transactionService.getTypes();
      const response = await budgetService.getBudgetsByIdAsso(Number(sessionStorage.getItem("idAsso")));
      budgets.value = await Promise.all(
        response.map(async (budget) => {
        const total = await sumBudgetEntries(budget.entries);   
          return {
            ...budget,
            totalAmount: total
          };
        })
      );
      const res = await transactionService.getTransactionsByAssoId(Number(sessionStorage.getItem("idAsso")))
      transactions.value = await Promise.all(res.map(async transaction => {
        const transactionType = await transactionService.getType(transaction.transactionType)
        return {
          ...transaction,
          transactionType:transactionType.name,
          date: new Date(transaction.date)
        }
      }));
      console.log(transactions.value)
      loading.value = false;
      updateChartData();
    } catch (error) {
      console.error('Error fetching transactions', error);
    }
  });
  
  const getBudgetSuivi = async (id) => {
  const response = await budgetService.getBudgetById(id);

  // Récupération des lignes
  const lines = await Promise.all(
    response.entries.map(async (lineUrl) => {
      const line = await linesService.getLine(lineUrl);
      const type = await transactionService.getType(line.type);

      return {
        amount: line.amount,
        type: type.name
      };
    })
  );

  const budgetStart = new Date(response.startDate);
  const budgetEnd = new Date(response.endDate);

  const allowedTypes = [
    "Évènement",
    "Communication",
    "Administratif",
    "Matériel",
    "Déplacement",
    "Ressources humaines"
  ];

  // Filtrage transactions
  const filteredTransactions = transactions.value.filter(tx => {
    const txDate = new Date(tx.date);
    return (
      txDate >= budgetStart &&
      txDate <= budgetEnd &&
      tx.cancelled === false &&
      allowedTypes.includes(tx.transactionType)
    );
  });

  // Calcul des totaux
  const totalsByType = {};

  filteredTransactions.forEach(tx => {
    const type = tx.transactionType;
    const amount = Math.abs(parseFloat(tx.amount));

    if (!totalsByType[type]) {
      totalsByType[type] = 0;
    }
    totalsByType[type] += amount;
  });

  // 👉 Transformation en tableau JSON
  const transactionsTotal = Object.entries(totalsByType).map(
    ([type, total]) => ({
      type,
      total
    })
  );

  // Budget final
  budget.value = {
    ...response,
    entries: lines,
    transactionsTotal
  };

  console.log(budget.value);
};

 
  const totalCredit = computed(() => {
    return transactions.value.reduce((acc, transaction) => (Number(transaction.amount) > 0 ? acc + Number(transaction.amount) : acc), 0).toFixed(2);
  });
  
  const totalDebit = computed(() => {
    return transactions.value.reduce((acc, transaction) => (Number(transaction.amount) < 0 ? acc - Number(transaction.amount) : acc), 0).toFixed(2);
  });
  
  const netBalance = computed(() => {
    return (totalCredit.value - totalDebit.value).toFixed(2);
  });
  
  const formatDate = (date) => {
    if (!date) return '';
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Intl.DateTimeFormat('fr-FR', options).format(date);
  };
  
const groupedByDate = computed(() => {
  return transactions.value
    .filter(transaction => {
      if (!periods.value) return true;

      const [start, end] = periods.value;
      if (!start || !end) return true;

      const endOfDay = new Date(end);
      endOfDay.setHours(23, 59, 59, 999);

      return (
        transaction.date >= start &&
        transaction.date <= endOfDay
      );
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    // .sort((a, b) => new Date(a.date) - new Date(b.date))
    .reduce((acc, transaction) => {
      const date = transaction.date;  
      const day = String(date.getDate()).padStart(2, '0'); // Jour sur 2 chiffres
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Mois sur 2 chiffres (0-indexé)
      const year = date.getFullYear(); // Année sur 4 chiffres
      const formattedDate = `${day}-${month}-${year}`;
    
    // Initialiser la date si elle n'existe pas dans `acc`
    if (!acc[formattedDate]) {
      acc[formattedDate] = { total: 0, credit: 0, debit: 0 };
    }
    
    // Ajouter l'opération au crédit, débit et total
    acc[formattedDate].total += Number(transaction.amount);
    // if(minValue.value > transaction.amount){
    //   minValue.value = transaction.amount
    // }
    // if(maxValue.value < transaction.amount){
    //   maxValue.value = transaction.amount
    // }
    if (Number(transaction.amount) > 0) {
      acc[formattedDate].credit += Number(transaction.amount);
    } else {
      acc[formattedDate].debit += Number(transaction.amount);
    }
    
    // Si ce n'est pas la première date, ajouter le total cumulatif de la date précédente
    const dates = Object.keys(acc); // Obtenir les clés triées
    const previousDate = dates[dates.length - 2]; // Date précédente (si elle existe)
    if (previousDate) {
      acc[formattedDate].total += acc[previousDate].total; // Ajouter le total cumulatif précédent
    }
      return acc;
    }, {});
});

const lineChartData = computed(() => ({
      labels: Object.keys(groupedByDate.value),
      datasets: [
        {
          label: 'Total',
          type:'line',
          data: Object.values(groupedByDate.value).map(item => item.total),
          borderColor: '#42A5F5',
          backgroundColor: 'rgba(66, 165, 245, 0.3)',
          fill: false,
          tension: 0.4
        },
        {
          label: 'Crédit',
          type:'bar',
          data: Object.values(groupedByDate.value).map(item => item.credit),
          borderColor: '#66BB6A',
          backgroundColor: 'rgba(102, 187, 106, 0.3)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Débit',
          type:'bar',
          data: Object.values(groupedByDate.value).map(item => item.debit),
          borderColor: '#EF5350',
          backgroundColor: 'rgba(239, 83, 80, 0.3)',
          fill: true,
          tension: 0.4
        }
      ]
    }));

  const updateChartData = async () => {
    const res = await transactionService.getTransactionsByAssoId(Number(sessionStorage.getItem("idAsso")))
      transactions.value = await Promise.all(res.map(async transaction => {
        const transactionType = await transactionService.getType(transaction.transactionType)
        return {
          ...transaction,
          transactionType:transactionType.name,
          date: new Date(transaction.date)
        }
      }));
  
  };

  const transactionsByCategoryAmount = computed(() => {
  const txs = (transactions.value ?? []).filter(tx => tx.amount < 0);

  if (!txs.length) return [];

  const totalAmount = txs.reduce(
    (sum, tx) => sum + Math.abs(tx.amount),
    0
  );

  const sums = txs.reduce((acc, tx) => {
    const category = tx.transactionType ?? "Non catégorisée";
    acc[category] = (acc[category] || 0) + Math.abs(tx.amount);
    return acc;
  }, {});

  return Object.entries(sums).map(([transactionType, amount]) => ({
    transactionType,
    amount,
    percentage: Number(((amount / totalAmount) * 100).toFixed(2))
  }));
});

const pieChartData = computed(() => ({
  labels: transactionsByCategoryAmount.value.map(
    item => `${item.transactionType} (${item.percentage} %)`
  ),
  datasets: [
    {
      data: transactionsByCategoryAmount.value.map(
        item => item.amount
      )
    }
  ]
}));
const chartOptions = {
  plugins: {
    title:{
      align:'start',
      display:true,
      text:"Répartition des dépenses"
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          const value = context.raw ?? 0;
          return `Montant : ${value} €`;
        }
      }
    },
  }
};
 
  const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');
  
    lineChartOptions.value = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        title:{
          align:'start',
          display:true,
          text:"Évolution de la trésorerie"
        },
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder
          }
        }
      }
    };

  const addTransaction = async () => {
    newTransaction.value.credit = newTransaction.value.amount > 0 ? true : false;
    newTransaction.value.transactionType = `/api/transaction_types/${selectedCat.value}`
    newTransaction.value.amount = newTransaction.value.amount.toString(); 
     try {
     console.log(newTransaction.value);
      await transactionService.addTransactions(newTransaction.value);
      toast.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'Les membres ont été ajoutés avec succès.',
        life: 5000,
      });
      showDialogNewTransactions.value = false;
      updateChartData();
    } catch (error) {
      // Handle error if needed
      console.error('Error adding members:', error);
  }
  };

  const addBuget = async () => {
     try {
      newBudget.value.association = `/api/associations/${Number(sessionStorage.getItem("idAsso"))}`;
      const response = await budgetService.addBudget(newBudget.value);
      console.log(response)
      const lines = [
        {
          amount:`${budgetAdmin.value}`,
          budget:`/api/budgets/${response}`,
          type:`/api/transaction_types/7`,
        },
        {
          amount:`${budgetRH.value}`,
          budget:`/api/budgets/${response}`,
          type:`/api/transaction_types/8`,
        },
        {
          amount:`${budgetMat.value}`,
          budget:`/api/budgets/${response}`,
          type:`/api/transaction_types/9`,
        },
        {
          amount:`${budgetCom.value}`,
          budget:`/api/budgets/${response}`,
          type:`/api/transaction_types/10`,
        },
        {
          amount:`${budgetDeplacement.value}`,
          budget:`/api/budgets/${response}`,
          type:`/api/transaction_types/11`,
        },
        {
          amount:`${budgetEvent.value}`,
          budget:`/api/budgets/${response}`,
          type:`/api/transaction_types/4`,
        },
      ]
      // const res = await linesService.addLines(lines)
      const res = await Promise.all(lines.map(async line => {
        await linesService.addLines(line)
      }));
      toast.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'Le budget a été ajouté avec succès.',
        life: 5000,
      });
      showDialogBudget.value = false;
    } catch (error) {
      console.error('Error adding members:', error);
  }
  }

  const selectedCat=ref()
  const transactionType = [
    {
      label:"Communication",
      value:"communication"
    },
    {
      label:"Évènement",
      value:"evenement"
    }
  ]

// ########################################################################################################
// IA GENERATIVE

import {marked} from 'marked';
// import { start } from 'repl';
const aiMessage = ref([])
const userMessage = ref('')

const parsedMessages = computed(() =>
  aiMessage.value.map(m => ({
    ...m,
    html: marked(m)
  }))
)

function sendMessage() {
  if (!userMessage.value.trim()) return

  displayMessage('User: ' + userMessage.value)
  getResponse(userMessage.value)
  userMessage.value = ''
}

function displayMessage(messag){
  const messageDisplay = document.getElementById('messages')
  const message = document.createElement('div')
  message.textContent = messag
  messageDisplay.appendChild(message);
}

function getResponse(data){
  var test = transactions.value.map(function(transaction){return transactions[transaction]})
  console.log(JSON.stringify(transactions.value))
  let jsonData = {messages:[
    {role:"system", content:`Tu es une IA spécialisée en analyse financière et gestion de trésorerie pour les associations. Tu es intégré dans un logiciel de gestion de trésorerie, tu ne dois pas en conseiller d'autres.
    Tu analyses des données transactionnelles structurées et fournis des prévisions chiffrées ainsi que des recommandations opérationnelles.`},
    {role:"user", content:`Voici les données de la trésorerie d'une association : ${JSON.stringify(transactions.value)}

    CONTEXTE (objet) DE L'ASSOCIATION (doit être utilisé dans la conception des conseils)
Cette association à pour but :
${data}

    Analyse les données financières fournies afin d’aider à la prise de décision
et à la gestion de la trésorerie d’une association.

OBJECTIFS
- Évaluer la situation financière actuelle
- Identifier les tendances et les risques réels
- Mettre en évidence des leviers d’amélioration concrets

INSTRUCTIONS GÉNÉRALES
- Analyse uniquement à partir des données fournies
- N’invente aucune information
- Si les données sont insuffisantes, indique-le clairement
- Utilise un langage clair, non technique
- Évite les généralités évidentes ou triviales

CRITÈRE DE PERTINENCE (IMPORTANT)
Pour chaque point, le champ "pertinent" doit être évalué selon la règle suivante :

Un point est "pertinent = true" UNIQUEMENT s’il respecte AU MOINS UN de ces critères :
- il apporte une information actionnable pour la gestion de trésorerie
- il met en évidence un risque ou un levier non évident
- il justifie une décision ou une action concrète
- il apporte une valeur durable s’il est stocké en base de données

Un point doit être "pertinent = false" si :
- il est trop générique ou évident
- il reformule simplement les données sans analyse
- il n’apporte pas de valeur décisionnelle
- il dépend d’informations absentes ou incertaines

⚠️ Il est normal et attendu que PLUSIEURS points aient "pertinent": false.
Si aucun point ne respecte les critères de pertinence, retourne une liste vide ou uniquement des éléments avec "pertinent": false.

MODÈLE DE RÉPONSE OBLIGATOIRE
Réponds UNIQUEMENT en JSON valide.
Aucun texte en dehors du JSON.
Pas de balise markdown, pas d'espace
Respecte STRICTEMENT la structure suivante :

{"points_positifs":[{"texte":"string","pertinent":boolean}],"points_faibles":[{"texte":"string","pertinent":boolean}],"opportunites":[{"texte":"string","pertinent":boolean}],"recommandations":[{"texte":"string","pertinent":boolean}],}`,
}],
    model_params:{temperature:0.3, top_p:1, max_new_tokens:2048, stream:false},
    model:"mistralai/ministral-3-3b"
  }
  let requestOptions = {
  method:"POST",
  headers:{
    "Content-Type":"application/json"
  },
  body: JSON.stringify(jsonData)
};

const apiUrl = "http://127.0.0.1:1234/v1/chat/completions";
fetch(apiUrl, requestOptions).then(res => res.json()).then(apiData => {
  let theResponse = apiData.choices[0].message.content;
  aiMessage.value.push(theResponse);
  console.log(JSON.stringify(aiMessage.value))
  const botResponse = "Chatbot:" + theResponse;
  let clean = theResponse
  .trim()
  .replace(/^```json\s*/, '')
  .replace(/```$/, ''); 
  // clean = clean.replace(/\r?\n/g, '\\n');
clean = clean.replace(/"([^"]*?)"/g, (_, match) => `"${match.replace(/"/g, '\\"')}"`);
// const cleanString = theResponse.replace(/```json|```/g, "").trim();
theResponse = theResponse.replace(/```json|```/g, "").trim();

// 2. On traite les caractères de contrôle (retours à la ligne, tabulations)
// Cette regex remplace les sauts de ligne réels par des \n lisibles par JSON.parse
const cleanString = theResponse.replace(/[\n\r\t]/g, " ");
  console.log(JSON.parse(cleanString))
  forEachAnalysisItem(JSON.parse(clean), ({ category, item }) => {
  if (item.pertinent) {
    console.log(`[${category}]`, item.texte);
  }
});
  // displayMessage(botResponse);
}).catch((error) => {
  console.log("Error:", error)
})
};

function forEachAnalysisItem(data, callback) {
  Object.entries(data).forEach(([category, items]) => {
    if (!Array.isArray(items)) return;

    items.forEach((item, index) => {
      callback({
        category,   // ex: "recommandations"
        item,       // l'objet courant
        index       // index dans le tableau
      });
    });
  });
}



</script>
  
<style scoped>
/* Ajoutez ici vos styles spécifiques si nécessaire */
</style>
  