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
      <div class="card">
        <Chart type="line" :data="lineChartData" :options="lineChartOptions" class="h-[28rem]" />
      </div>
      <div class="card">
        <Chart type="pie" :data="pieChartData" :options="lineChartOptions" class="h-[28rem]" />
      </div>
    </div>
      </TabPanel>
        <TabPanel value="1">
          <Card>
            <template #header>
              <div>
                <span class="pi pi-calendar"></span>
                <span>Période budgétaire</span>
              </div>
            </template>
            <template #content>
              <PButton label="Définir le budget" @click="showDialogBudget = true" icon="pi pi-cog"  />
            </template>
          </Card>
          <Card>
            <template #header>
              Suivi budgétaire par catégorie
            </template>
            <template #content>
              <div>
                <div>
                  <span>Evènements</span>
                  <span>X / {{budgetEvent}}€</span>
                </div>
                <ProgressBar />
                <div>
                  <span>restant</span>
                  <span>% utilisé</span>
                </div>
              </div>
              <div>
                <div>
                  <span>Communication</span>
                  <span>X / {{budgetCom}}€</span>
                </div>
                <ProgressBar />
                <div>
                  <span>restant</span>
                  <span>% utilisé</span>
                </div>
              </div>
              <div>
                <div>
                  <span>Matériel</span>
                  <span>X / {{budgetMat}}€</span>
                </div>
                <ProgressBar />
                <div>
                  <span>restant</span>
                  <span>% utilisé</span>
                </div>
              </div>
            </template>
          </Card>
        </TabPanel>
        <TabPanel value="2">
        <p class="m">
            At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui
            officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.
        </p>
        </TabPanel>
      </TabPanels>
    </Tabs>
     
     <!-- Table des transactions -->
      <DataTable 
      v-model:filters="filters"
      :value="transactions"
      paginator
      :rows="5"
      dataKey="id"
      filterDisplay="menu"
      :loading="loading"
      :globalFilterFields="['nom_transaction', 'tiers', 'operation', 'date_operation']"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rowsPerPageOptions="[5, 15, 25]"
      currentPageReportTemplate="Affiche {first} à {last} de {totalRecords} transactions"
    >
        <template #header>
          <div class="flex" style="justify-content:space-between; align-items:baseline">
            <PButton label="Ajouter une transaction" icon="pi pi-plus" @click="showDialogNewTransactions = true" class="mb-3" />
            <InputText v-model="filters['global'].value" placeholder="Rechercher" />
          </div>
        </template>
        <template #empty>Aucune transaction trouvée</template>
        <template #loading>Chargement des transactions. Veuillez patienter.</template>
  
        <Column field="nom_transaction" header="Nom de transaction" :showFilterMatchModes="false" style="min-width: 12rem">
          <template #body="{ data }">
            {{ data.nom_transaction }}
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" @input="filterCallback()" placeholder="Filtrer par nom de transaction" />
          </template>
        </Column>
  
        <Column field="operation" header="Transaction" :showFilterMatchModes="false" style="min-width: 10rem">
          <template #body="{ data }">
            {{ data.operation }}€
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
  
        <Column field="date_operation" dataType="date" header="Date" style="min-width: 12rem">
          <template #body="{ data }">
            {{ formatDate(data.date_operation) }}
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <DatePicker v-model="filterModel.value" dateFormat="dd/mm/yy" @change="filterCallback()" placeholder="Filtrer par date" />
          </template>
        </Column>
  
        <Column field="tiers" header="Tiers" :showFilterMatchModes="false" style="min-width: 12rem">
          <template #body="{ data }">
            {{ data.tiers }}
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" @input="filterCallback()" placeholder="Filtrer par tier" />
          </template>
        </Column>
        <Column field="categorie" header="Categorie" :showFilterMatchModes="false" style="min-width: 12rem">
          <template #body="{ data }">
            {{ data.categorie }}
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" @input="filterCallback()" placeholder="Filtrer par categorie" />
          </template>
        </Column>
    </DataTable>
     <!-- Dialogue pour ajouter une transaction -->
    <PDialog header="Ajouter une transaction" v-model:visible="showDialogNewTransactions" :modal="true" :closable="false" :style="{ width: '50vw' }">
      <div class="p-fluid">
        <div class="field">
          <label for="nom_transaction">Nom de la transaction</label>
          <InputText id="nom_transaction" v-model="newTransaction.nom_transaction" />
        </div>
        <div class="field">
          <label for="operation">Montant</label>
          <InputNumber id="operation" v-model="newTransaction.operation" />
        </div>
        <div class="field">
          <label for="date_operation">Date</label>
          <DatePicker id="date_operation" v-model="newTransaction.date_operation" dateFormat="dd/mm/yy" />
        </div>
        <div class="field">
          <label for="tiers">Tiers</label>
          <InputText id="tiers" v-model="newTransaction.tiers" />
        </div>
        <div class="field">
          <label for="categorie">Categorie</label>
          <InputText id="categorie" v-model="newTransaction.categorie" />
        </div>
      </div>
      <template #footer>
        <PButton label="Annuler" icon="pi pi-times" class="p-button-text" @click="showDialogNewTransactions = false" />
        <PButton label="Ajouter" icon="pi pi-check" @click="addTransaction" />
      </template>
    </PDialog>
    <PDialog header="Définition du budget" v-model:visible="showDialogBudget" :modal="true" :closable="false" :style="{ width: '50vw' }">
      <div class="p-fluid">
        <h3>Répartition du budget</h3>
        <span>Utilisé : {{allBudgetUsed}}</span>
        <span>Total : {{netBalance}}</span>
      </div>
      <Card>
        <template #header>
          <div>
            <span>Evènements</span>
            <span>{{percetBudgetEvent}}% du budget total</span>
          </div>
          <div>{{budgetEvent}}</div>
        </template>
        <template #content>
          <label for="budgetEvent">Montant</label>
          <InputNumber showButtons :min="0" v-model="budgetEvent" :max="budgetEvent + budgetRestant" inputId="budgetEvent" mode="currency" currency="EUR" locale="fr-FR" />
          <ProgressBar :value="percetBudgetEvent"></ProgressBar>

        </template>
      </Card>
      <Card>
        <template #header>
          <div>
            <span>Communication</span>
            <span>{{percetBudgetCom}}% du budget total</span>
          </div>
          <div>{{budgetCom}}</div>
        </template>
        <template #content>
          <label for="budgetCom">Montant</label>
          <InputNumber showButtons :min="0" :max="budgetCom + budgetRestant" v-model="budgetCom" inputId="budgetCom" mode="currency" currency="EUR" locale="fr-FR" />
          <ProgressBar :value="percetBudgetCom"></ProgressBar>
        </template>
      </Card>
       <Card>
        <template #header>
          <div>
            <span>Matériel</span>
            <span>{{percetBudgetMat}}% du budget total</span>
          </div>
          <div>{{budgetMat}}</div>
        </template>
        <template #content>
          <label for="budgetMat">Montant</label>
          <InputNumber showButtons :min="0" :max="budgetMat + budgetRestant" v-model="budgetMat" inputId="budgetMat" mode="currency" currency="EUR" locale="fr-FR" />
          <ProgressBar :value="percetBudgetMat"></ProgressBar>
        </template>
      </Card>
      <template #footer>
        <PButton label="Annuler" icon="pi pi-times" class="p-button-text" @click="showDialogBudget = false" />
        <PButton label="Ajouter" icon="pi pi-check" @click="addTransaction" />
      </template>
    </PDialog>
  </div>
  {{transactions}}
</template>
  
<script setup>
  import { ref, onMounted, computed, watch } from 'vue';
  import {useRoute} from 'vue-router';
  import { useAssoService } from '@/composables/asso/AssoService';
  import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
    import { useToast } from 'primevue/usetoast';

  const minValue = computed(() => {
  if (!transactions.value.length) return null;
  return Math.min(...transactions.value.map(t => t.operation));
});

const maxValue = computed(() => {
  if (!transactions.value.length) return null;
  return Math.max(...transactions.value.map(t => t.operation));
});

const budgetEvent = ref(0)
const budgetCom = ref(0)
const budgetMat = ref(0)

const allBudgetUsed = computed(() => {
  return budgetEvent.value + budgetCom.value + budgetMat.value
  })

const percetBudgetEvent = computed(() => {
  return ((budgetEvent.value / netBalance.value)*100).toFixed(2)
})

const percetBudgetMat = computed(() => {
  return ((budgetMat.value / netBalance.value)*100).toFixed(2)
})

const percetBudgetCom = computed(() => {
  return ((budgetCom.value / netBalance.value)*100).toFixed(2)
})

const budgetRestant = computed(() => {
  return netBalance.value - allBudgetUsed.value
})

const route = useRoute();
  const assoService = useAssoService();
  const transactions = ref([]);
  const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    nom_transaction: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    operation: { value: null, matchMode: FilterMatchMode.BETWEEN },
    date_operation:{ operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_BEFORE }]},
    tiers: { value: null, matchMode: FilterMatchMode.STARTS_WITH }
  });
  console.log(filters.value.date_operation)
  const newTransaction = ref({
    association_id: Number(sessionStorage.getItem("idAsso")),
    nom_transaction: "",
    operation: null,
    date_operation: null,
    tiers: "",
    categorie: "",
  });
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
        date_operation: new Date(transaction.date_operation)
      }));
    }
});
  
  onMounted(async () => {
    try {
      const res = await assoService.getAllTresorieByAssociations(Number(sessionStorage.getItem("idAsso")));
      transactions.value = res.map(transaction => ({
        ...transaction,
        date_operation: new Date(transaction.date_operation)
      }));
      loading.value = false;
      updateChartData();
    } catch (error) {
      console.error('Error fetching transactions', error);
    }
  });
  
  const totalCredit = computed(() => {
    return transactions.value.reduce((acc, transaction) => (transaction.operation > 0 ? acc + transaction.operation : acc), 0).toFixed(2);
  });
  
  const totalDebit = computed(() => {
    return transactions.value.reduce((acc, transaction) => (transaction.operation < 0 ? acc - transaction.operation : acc), 0).toFixed(2);
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
        transaction.date_operation >= start &&
        transaction.date_operation <= endOfDay
      );
    })
    .sort((a, b) => a.date_operation.getTime() - b.date_operation.getTime())
    // .sort((a, b) => new Date(a.date_operation) - new Date(b.date_operation))
    .reduce((acc, transaction) => {
      const date = transaction.date_operation;  
      const day = String(date.getDate()).padStart(2, '0'); // Jour sur 2 chiffres
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Mois sur 2 chiffres (0-indexé)
      const year = date.getFullYear(); // Année sur 4 chiffres
      const formattedDate = `${day}-${month}-${year}`;
    
    // Initialiser la date si elle n'existe pas dans `acc`
    if (!acc[formattedDate]) {
      acc[formattedDate] = { total: 0, credit: 0, debit: 0 };
    }
    
    // Ajouter l'opération au crédit, débit et total
    acc[formattedDate].total += transaction.operation;
    // if(minValue.value > transaction.operation){
    //   minValue.value = transaction.operation
    // }
    // if(maxValue.value < transaction.operation){
    //   maxValue.value = transaction.operation
    // }
    if (transaction.operation > 0) {
      acc[formattedDate].credit += transaction.operation;
    } else {
      acc[formattedDate].debit += transaction.operation;
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
    const res = await assoService.getAllTresorieByAssociations(Number(sessionStorage.getItem("idAsso")));
      transactions.value = res.map(transaction => ({
        ...transaction,
        date_operation: new Date(transaction.date_operation)
      }));
  
  };

  const transactionsByCategoryAmount = computed(() => {
  const txs = transactions.value ?? [];

  if (!txs.length) return [];

  const totalAmount = txs.reduce(
    (sum, tx) => sum + Math.abs(tx.operation),
    0
  );

  const sums = txs.reduce((acc, tx) => {
    const category = tx.categorie ?? "Non catégorisée";
    acc[category] = (acc[category] || 0) + Math.abs(tx.operation);
    return acc;
  }, {});

  return Object.entries(sums).map(([categorie, amount]) => ({
    categorie,
    amount,
    percentage: Number(((amount / totalAmount) * 100).toFixed(2))
  }));
});

const pieChartData = computed(() => ({
  labels: transactionsByCategoryAmount.value.map(r => r.categorie),
  datasets: [
    {
      data: transactionsByCategoryAmount.value.map(r => r.percentage)
    }
  ]
}));
  
  const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');
  
    lineChartOptions.value = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
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
     try {
      await assoService.saveTresorieAsso(newTransaction.value);
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
</script>
  
<style scoped>
/* Ajoutez ici vos styles spécifiques si nécessaire */
</style>
  