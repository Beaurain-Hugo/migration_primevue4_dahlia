<template>
  <div>
    <DialogErreur v-model:afficherDialogErreur="afficherDialogErreur" v-model:libelleErreur="libelleErreur" />
    <Toast />
    <ConfirmPopup />
    <component :is="layout">
      <router-view />
    </component>
  </div>
</template>


<script>
const default_layout = "default";

export default {
  computed:{
    layout(){
      return (this.$route.meta.layout || default_layout) + '-layout';
    }
  }
}
</script>
