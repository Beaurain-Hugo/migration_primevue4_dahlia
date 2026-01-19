<template>
  <Tabs value="0">
    <TabList>
      <Tab value="0">Profil</Tab>
      <Tab value="1">Association</Tab>
      <Tab value="2">Sécurité</Tab>
    </TabList>
    <TabPanels>
      <TabPanel value="0">
        <Card>
          <template #header>
            <span class="pi pi-user"></span>
            <span>Informations personnelles</span>
            <PButton :label="editProfile ? `Modifier` : `Enregistrer`" :icon="editProfile ? 'pi pi-pencil' : 'pi pi-save'" @click="editProfile = !editProfile"/>
          </template>
           <template #content>
             <div v-if="user">
               <Avatar v-if="user?.photo" size="large" shape="circle" :image="'data:image/png;base64,' + user.photo"  @click="toggleReglage">
            </Avatar>
            <Avatar size="large" shape="circle" v-else @click="toggleReglage">
              <div>
                {{ user?.prenom?.charAt(0).toUpperCase() + '' + user?.nom.charAt(0).toUpperCase() }}
              </div>
            </Avatar>
            <div>
              <div>{{ user?.prenom + " " + user?.nom}}test</div>
              <div>{{ user?.email }}</div>
            </div>
            <div>
              <label for="prenom">Prénom</label>
              <InputText id="prenom" v-model="user.prenom" :disabled="editProfile" />
              <label for="nom">Nom</label>
              <InputText id="nom" v-model="user.nom" :disabled="editProfile" />
            </div>
            <div>
               <label for="email">Adresse mail</label>
              <InputText id="email" v-model="user.email" :disabled="editProfile" />
               <label for="date_naissance">Date de naissance</label>
              <DatePicker  showIcon inputId="date_naissance" :disabled="editProfile" v-model="user.date_naissance" dateFormat="dd/mm/yy" placeholder="Sélectionner une date" />
              <!-- <DataPicker id="date_naissance" v-model="user.date_naissance" :disabled="true" /> -->
            </div>
            </div>
          </template>
        </Card>
      </TabPanel>
      <TabPanel value="1">
      </TabPanel>
      <TabPanel value="2">
      </TabPanel>
    </TabPanels>
  </Tabs>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import UserModel from '@/models/UserModel';
import { useUserService } from '@/composables/user/UserService';

const user = ref<UserModel | null>(null);
const jwt = ref(false);
const userService = useUserService();
const editProfile = ref(true);

onMounted(async () => {
  jwt.value = !!sessionStorage.getItem('jwt');
  await fetchData();
});

async function fetchData() {
  if (jwt.value) {
    try {
      const userData = await userService.getUserById(Number(sessionStorage.getItem('jwt')));
      user.value = userData;
    //   photo.value = user.value.photo;
      console.log('User connected:', user.value);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  } else {
    user.value = null;
  }
}
</script>