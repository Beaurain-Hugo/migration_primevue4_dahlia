<template>
  <div class="cv-header custom-calendar-header">
    <!-- Navigation -->
    <div class="cv-header-nav">
      <button
        class="previousYear"
        :disabled="!headerProps.previousYear"
        @click="emitDate(headerProps.previousYear)"
      >
        «
      </button>

      <button
        class="previousPeriod"
        :disabled="!headerProps.previousPeriod"
        @click="emitDate(headerProps.previousPeriod)"
      >
        ‹
      </button>

      <button
        class="nextPeriod"
        :disabled="!headerProps.nextPeriod"
        @click="emitDate(headerProps.nextPeriod)"
      >
        ›
      </button>

      <button
        class="nextYear"
        :disabled="!headerProps.nextYear"
        @click="emitDate(headerProps.nextYear)"
      >
        »
      </button>
      <button
        class="currentPeriod"
        :disabled="!headerProps.currentPeriod"
        @click="emitDate(headerProps.currentPeriod)"
      >
        {{ headerProps.currentPeriodLabel }}
      </button>
    </div>

    <!-- Libellé de période -->
    <div class="periodLabel">
      <span class="startMonth">{{ startMonth }}</span>
      <span class="startYear">{{ startYear }}</span>
    </div>

    <!-- 🔽 EXTENSION PERSONNALISÉE -->
    <div class="custom-actions">
        <SelectButton v-model="value" @update:modelValue="$emit('period', value)" :options="options" />
        <PButton @click="$emit('add-event')" label="Créer un évènement" icon="pi pi-plus" />
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
