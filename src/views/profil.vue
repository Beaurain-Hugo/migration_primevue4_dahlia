<template>
  <Tabs v-if="user" value="0">
    <TabList>
      <Tab value="0">Profil</Tab>
      <Tab value="1">Association</Tab>
      <Tab value="2">Sécurité</Tab>
    </TabList>
    <TabPanels>
      <TabPanel value="0">
        <Card>
          <template #title>
            <div class="flex justify-between">
            <div>
              <span class="pi pi-user font-medium"></span>
              <span class="font-semibold"> Informations personnelles</span>
            </div>
            <PButton  :pt="{root:'text-white bg-purple-900 border-purple-900'}" :label="editProfile ? `Modifier` : `Enregistrer`" :icon="editProfile ? 'pi pi-pencil' : 'pi pi-save'" @click="editProfile = !editProfile"/>
            </div>
          </template>
          <template #content>
            <div v-if="user" class="flex flex-col gap-4">
              <div class="flex gap-4 items-center">
                <Avatar v-if="user?.photo" size="large" shape="circle" :image="'data:image/png;base64,' + user.photo" />
                <Avatar size="large" shape="circle" v-else>
                  <div>{{ user?.firstname?.charAt(0).toUpperCase() + '' + user?.lastname.charAt(0).toUpperCase() }}</div>
                </Avatar>
                <div class="flex flex-col">
                  <span class="font-bold">{{ user?.firstname + " " + user?.lastname}}</span>
                  <span>{{ user?.email }}</span>
                </div>
              </div>
              <div class="flex gap-4">
                <div class="flex flex-col gap-2 w-1/2">
                  <label for="prenom">Prénom</label>
                  <InputText id="prenom" v-model="user.firstname" :disabled="editProfile" />
                </div>
                <div class="flex flex-col gap-2 w-1/2">
                  <label for="nom">Nom</label>
                  <InputText id="nom" v-model="user.lastname" :disabled="editProfile" />
                </div>
              </div>
              <div class="flex flex-col gap-2">
                <label for="email">Email</label>
                <div class="flex gap-1 items-center">
                  <span class="pi pi-envelope"></span>
                  <InputText fluid id="email" v-model="user.email" :disabled="editProfile" />
                </div>
              </div>
            </div>
          </template>
        </Card>
      </TabPanel>
      <TabPanel value="1">
         <Card>
          <template #title>
            <div class="flex items-baseline gap-1">
              <span class="pi pi-building font-medium"></span>
              <span class="font-semibold">Moi dans l'association</span>
            </div>
          </template>
          <template #content>
            <div class="flex flex-col gap-4">
              <!-- <div class="flex gap-4 items-center">
                <Avatar v-if="user?.photo" size="large" shape="circle" :image="'data:image/png;base64,' + user.photo" />
                <Avatar size="large" shape="circle" v-else>
                  <div>{{ user?.prenom?.charAt(0).toUpperCase() + '' + user?.nom.charAt(0).toUpperCase() }}</div>
                </Avatar>
                <div class="flex flex-col">
                  <span class="font-bold">{{ user?.prenom + " " + user?.nom}}</span>
                  <span>{{ user?.email }}</span>
                </div>
              </div> -->
              <div class="flex gap-4">
                <div class="flex flex-col gap-2 w-1/2">
                  <span class="font-medium">Association</span>
                  <div>
                    <span class="pi pi-building"></span>
                    <span class="font-bold">{{ Association.name }}</span>
                  </div>
                </div>
                <div class="flex flex-col gap-2 w-1/2">
                  <span>Rôle</span>
                  <Tag :value="user?.role"/>
                </div>
              </div>
            </div>
          </template>
        </Card>
      </TabPanel>
      <TabPanel value="2">
      </TabPanel>
    </TabPanels>
  </Tabs>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import UserModel from '@/models/UserModel';
import AssociationModel from '@/models/AssociationModel';
import MembreModel from '@/models/MembreModel';
import { useUserService } from '@/composable/user/UserService';
import { useMemberService } from '@/composable/member/MemberService';
import { useAssoService } from '@/composable/asso/AssoService';

const user = ref<UserModel | null>(null);
const jwt = ref(false);
const Association = ref<AssociationModel>();
const Membre = ref<MembreModel>();
const userService = useUserService();
const membreService = useMemberService();
const assoService = useAssoService();
const editProfile = ref(true);

onMounted(async () => {
  jwt.value = !!localStorage.getItem('id_user');
  Association.value = await assoService.getAssociationById(Number(sessionStorage.getItem('idAsso')))
  console.log(Association.value)
  await fetchUserData();
  // Membre.value = await membreService.getMemberInfoByAssoId(Number(user.value.id), Number(sessionStorage.getItem('idAsso')))
});

async function fetchUserData() {
  if (jwt.value) {
    try {
      const userData = await userService.getMe();
      user.value = userData.data;
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