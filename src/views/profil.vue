<template>
    {{user}}
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import UserModel from '@/models/UserModel';
import { useUserService } from '@/composables/user/UserService';

const user = ref<UserModel | null>(null);
const jwt = ref(false);
const userService = useUserService();

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