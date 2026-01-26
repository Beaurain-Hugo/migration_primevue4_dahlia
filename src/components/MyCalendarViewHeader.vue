<template>
  <div class="cv-header custom-calendar-header bg-white p-4 py-6 rounded-t-2xl">
    <!-- Navigation -->
    <div class="cv-header-nav flex gap-2">
      <PButton class="text-black bg-gray-200" icon="pi pi-angle-double-left" :disabled="!headerProps.previousYear" @click="emitDate(headerProps.previousYear)" />
      <PButton class="text-black bg-gray-200" icon="pi pi-chevron-left" :disabled="!headerProps.previousPeriod" @click="emitDate(headerProps.previousPeriod)"/>
      <PButton class="text-black bg-gray-200" icon="pi pi-chevron-right" :disabled="!headerProps.nextPeriod" @click="emitDate(headerProps.nextPeriod)" />
      <PButton class="text-black bg-gray-200" icon="pi pi-angle-double-right" :disabled="!headerProps.nextYear" @click="emitDate(headerProps.nextYear)"/>
      <PButton class="text-black bg-gray-200" :label="headerProps.currentPeriodLabel" :disabled="!headerProps.currentPeriod" @click="emitDate(headerProps.currentPeriod)"/>
    </div>

    <!-- Libellé de période -->
    <div class="periodLabel">
      <span class="startMonth">{{ startMonth }}</span>
      <span class="startYear">{{ startYear }}</span>
    </div>

    <!-- 🔽 EXTENSION PERSONNALISÉE -->
    <div class="custom-actios flex gap-2">
        <SelectButton v-model="value" @update:modelValue="$emit('period', value)" :options="options"  />
        <PButton @click="$emit('add-event')" label="Créer un évènement" icon="pi pi-plus" :pt="{root:'text-white bg-purple-900 border-purple-900'}" />
        <!-- <select @change="$emit('filter', $event.target.value)">
            <option value="all">Tous</option>
            <option value="meeting">Réunions</option>
            <option value="event">Événements</option>
        </select> -->
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
const value = ref('month');
const options = ref(["week", "month", "year"])
/* Props */
const props = defineProps({
  headerProps: {
    type: Object,
    required: true,
  },
});
console.log(props.headerProps)
/* Emits */
const emit = defineEmits(["input", "add-event", "filter", "period"]);

/* Méthodes */
const emitDate = (date) => {
  emit("input", date);
};

/* Computed */
const startMonth = computed(() =>
  props.headerProps.periodStart.toLocaleDateString(
    props.headerProps.displayLocale,
    { month: "long" }
  )
);

const startYear = computed(
  () => props.headerProps.periodStart.getFullYear()
);
</script>
