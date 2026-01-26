<template>
	<div id="example-full" class="flex gap-2 mt-2">
		<div class="calendar-parent">
			<CalendarView
				:items="state.items"
				:show-date="state.showDate"
				:time-format-options="{ hour: 'numeric', minute: '2-digit' }"
				:enable-drag-drop="true"
				:disable-past="state.disablePast"
				:disable-future="state.disableFuture"
				:show-times="state.showTimes"
				:date-classes="myDateClasses()"
				:display-period-uom="state.displayPeriodUom"
				:display-period-count="state.displayPeriodCount"
				:starting-day-of-week="state.startingDayOfWeek"
				:class="themeClasses"
				:period-changed-callback="periodChanged"
				:current-period-label="state.useTodayIcons ? 'icons' : ''"
				:displayWeekNumbers="state.displayWeekNumbers"
				:enable-date-selection="true"
				:selection-start="state.selectionStart"
				:selection-end="state.selectionEnd"
				@date-selection-start="setSelection"
				@date-selection="setSelection"
				@date-selection-finish="finishSelection"
				@drop-on-date="onDrop"
				@click-date="onClickDay"
				@click-item="onClickItem"
			>
				<template #header="{ headerProps }">
						 <MyCalendarViewHeader
      						:header-props="headerProps"
     				 		@input="setShowDate"
      						@add-event="openCreateModal"
      						@filter="applyFilter"
							@period="changePeriod"
    					/>
				</template>
			</CalendarView>
		</div>
		<div>
			<Card class="p-4">
				<template #header>
					<span class="pi pi-clock"></span>
					<span class="text-xl">Prochains évènements : {{ comingEvents.length }} à venir</span>
				</template>
				<template #content>
					<div v-if="comingEvents && comingEvents.length == 0">
						<span class="pi pi-clock"></span>
						<span>Aucun évènement à venir</span>
					</div>
					<div v-else class="flex flex-col gap-4 ">
							<Card  v-for="event in comingEvents" :key="event.id">
								<template #header>
									<div class="flex p-2 justify-between items-baseline">
										<span class="text-black">{{ event.title }}</span>
										<Tag class="bg-transparent border !text-black" :value="event.startDate.toLocaleDateString()" />
									</div>
								</template>
								<template #content>
									<div class="flex flex-col gap-2">
									<div class="flex">
										<span class="pi pi-clock"></span>
										<span>{{ formatDate(event.startDate) }} - {{ formatDate(event.endDate) }}</span>
									</div>
									<div>
										<span class="pi pi-map-marker"></span>
										<span>{{ event.lieu}}</span>
									</div>
									<div>
										<span>{{ event.description}}</span>
									</div>
									</div>
								</template>
							</Card>
					</div>
				</template>
			</Card>
		</div>
	</div>
	<PDialog modal header="Créer un évènement" v-model:visible="VISIBLE">
		<template #header>
			<h5>Créer un évènement</h5>
		</template>
		<div class="flex flex-col gap-2">
			<span>Organisez une réunion ou un évènement avec vos membres.</span>
			<div>
				<label for="title">Titre de l'évènement</label>
            	<InputText fluid id="title" v-model="titre" placeholder="Réunion du CA" />
			</div>
			<div>
				<label for="description">Description</label>
				<PTextarea fluid id="description" v-model="description" rows="5" cols="30" placeholder="Objectifs / Notes"/>
			</div>
			<div class="flex gap-4">
				<div class="flex flex-col">
 					<label for="dateD">Date {{ multiDay ? 'de début' : '' }}</label>
	            	<DatePicker showIcon inputId="dateD" v-model="date_debut" dateFormat="dd/mm/yy" placeholder="Sélectionner une date" />
				</div>
				<div class="flex flex-col">
					<label for="hourD">Heure de début</label>
					<DatePicker timeOnly showIcon inputId="hourD" v-model="hour_debut" placeholder="Heure de début" />
				</div>
				
			</div>
			<div class="flex gap-2">
					<label for="multiDay">Votre évènement dure plusieurs jours ?</label>
					<Checkbox :disabled="!date_debut" inputId="multiDay" v-model="multiDay" binary @update:modelValue="val => { if (!val) date_fin = '' }"/>
				</div>
			<div v-if="multiDay">
				<div class="flex gap-4">
				<div class="flex flex-col">
 					<label for="dateF">Date de fin</label>
            		<DatePicker showIcon :minDate="minDateFin" inputId="dateF" v-model="date_fin" dateFormat="dd/mm/yy" placeholder="Sélectionner une date" />
				</div>
				<div class="flex flex-col">
					<label for="hour">Heure de fin</label>
					<DatePicker timeOnly showIcon inputId="hour" v-model="hour_fin" placeholder="Heure de fin" />
				</div>			
			</div>
			</div>
			<Select v-if="!multiDay" v-model="selectedDuree" :options="duree" optionLabel="name" optionValue="code" placeholder="Sélectionner une durée" class="w-full md:w-56" />
			<Select v-model="selectedType" :options="type" optionLabel="name" optionValue="code" placeholder="Sélectionner un type d'évènement" class="w-full md:w-56" />
			<label for="lieu">Lieu</label>
            <InputText v-model="lieu" id="lieu" placeholder="Adresse du lieu" />
			    <CheckboxGroup class="flex flex-col gap-2" name="participant" v-model="selectedPart" >
                    <span>Participants</span>
                    <VirtualScroller :items="membres" :itemSize="30" style="width: 300px; height: 200px">
                        <template v-slot:item="{ item, options }">
                            <div :class="['flex items-center p-2', { 'bg-surface-100 dark:bg-surface-700': options.odd }]" style="height: 30px">
                                <div class="flex align-items-center gap-1">
                                    <Checkbox :inputId="item.id"  :value="{ code: item.user_id, name: item.username }" />
                                    <label :for="item.id">{{ item.username }}</label>
                                </div>
                            </div>
                        </template>
                    </VirtualScroller>
                </CheckboxGroup>
		</div>
		<template #footer>
			<PButton v-if="editEvent" severity='danger' label="Supprimer" @click="deleteEvent(id)"/>
			<PButton :label="editEvent ? 'Enregistrer' : 'Inviter et Ajouter'" :pt="{root:'text-white bg-purple-900 border-purple-900'}" @click="addEvent"/>
			</template>
	</PDialog>
</template>
<style>
    /* @import "https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.2/css/bulma.min.css"; */

    #example-full {
	display: flex;
	flex-direction: row;
	font-family: Calibri, sans-serif;
	/* width: 96vw; */
	/* min-width: 30rem;
	max-width: 100rem; */
	min-height: 40rem;
	margin-left: auto;
	margin-right: auto;
}

#example-full .calendar-controls {
	margin-right: 1rem;
	/*min-width: 14rem;
	max-width: 14rem; */
}

#example-full .calendar-parent {
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	overflow-x: hidden;
	overflow-y: hidden;
	max-height: 80vh;
	background-color: white;
}

/* For long calendars, ensure each week gets sufficient height. The body of the calendar will scroll if needed */
#example-full .cv-wrapper.period-month.periodCount-2 .cv-week,
#example-full .cv-wrapper.period-month.periodCount-3 .cv-week,
#example-full .cv-wrapper.period-year .cv-week {
	min-height: 6rem;
}

/* These styles are optional, to illustrate the flexbility of styling the calendar purely with CSS. */

/* Add some styling for items tagged with the "birthday" class */
#example-full .theme-default .cv-item.birthday {
	background-color: #e0f0e0;
	border-color: #d7e7d7;
}

#example-full .theme-default .cv-item.birthday::before {
	content: "\1F382"; /* Birthday cake */
	margin-right: 0.5em;
}

/* The following classes style the classes computed in myDateClasses and passed to the component's dateClasses prop. */
#example-full .theme-default .cv-day.ides {
	background-color: #ffe0e0;
}

#example-full .ides .cv-day-number::before {
	content: "\271D";
}

#example-full .cv-day.do-you-remember.the-21st .cv-day-number::after {
	content: "\1F30D\1F32C\1F525";
}
</style>
<script setup lang="ts">
// Using the publish version, you would do this instead:
import { CalendarView, CalendarViewHeader, CalendarMath } from "vue-simple-calendar"
import 'vue-simple-calendar/dist/vue-simple-calendar.css';
import 'vue-simple-calendar/dist/css/default.css';
import 'vue-simple-calendar/dist/css/gcal.css';

// import CalendarView from "vue-simple-calendar/src/CalendarView.vue"
// import CalendarViewHeader from "vue-simple-calendar/src/CalendarViewHeader.vue"
// import CalendarMath from "vue-simple-calendar/src/CalendarMath"
import { ICalendarItem, INormalizedCalendarItem } from "vue-simple-calendar";
import { ref, onMounted, reactive, computed } from "vue";
import MyCalendarViewHeader from "@/components/MyCalendarViewHeader.vue";
import Event from '@/models/EventModel';
import Membre from '@/models/MembreModel';
import {useEventService} from '@/composables/event/EventService';
import {useAssoService} from '@/composables/asso/AssoService';

const VISIBLE=ref(false);
const events = ref<Event[]>([]);
const membres = ref<Membre[]>([]);
const EventService = useEventService();
const AssoService = useAssoService();
const minDateFin = computed(() => {
	return new Date(date_debut.value.getTime() + 86400 *1000)
})
const titre = ref<string>()
const id = ref()
const description = ref()
const multiDay = ref(false);
const editEvent = ref(false);
const date_debut = ref();
const hour_debut = ref()
const hour_fin = ref()
const date_fin = ref()
const lieu = ref()
const selectedDuree = ref()
const selectedType = ref()
const selectedPart = ref()
const duree = ref([
	{name:'15 min', code:"15"},
	{name:'30 min', code:"30"},
	{name:'45 min', code:"45"},
	{name:'1h', code:"60"},
	{name:'2h', code:"120"},
])
const type = ref([
	{name:'Réunion', code:"reunion"},
	{name:'Je sais pas', code:"jsp"},
])
const thisMonth = (d: number, h?: number, m?: number): Date => {
	const t = new Date()
	return new Date(t.getFullYear(), t.getMonth(), d, h || 0, m || 0)
}

interface IExampleState {
	showDate: Date
	message: string
	startingDayOfWeek: number
	disablePast: boolean
	disableFuture: boolean
	displayPeriodUom: string
	displayPeriodCount: number
	displayWeekNumbers: boolean
	showTimes: boolean
	selectionStart?: Date
	selectionEnd?: Date
	newItemTitle: string
	newItemStartDate: string
	newItemEndDate: string
	useDefaultTheme: boolean
	useHolidayTheme: boolean
	useTodayIcons: boolean
	items: ICalendarItem[]
}

const state = reactive({
	/* Show the current month, and give it some fake items to show */
	showDate: thisMonth(1),
	message: "",
	startingDayOfWeek: 1,
	disablePast: false,
	disableFuture: false,
	displayPeriodUom: "month",
	displayPeriodCount: 1,
	displayWeekNumbers: false,
	showTimes: true,
	selectionStart: undefined,
	selectionEnd: undefined,
	newItemTitle: "",
	newItemStartDate: "",
	newItemEndDate: "",
	useDefaultTheme: true,
	useHolidayTheme: true,
	useTodayIcons: false,
	items: [],
} as IExampleState)

const comingEvents = computed(() => {
	return state.items.filter((event) => event.startDate > Date.now())
})

const userLocale = computed((): string => CalendarMath.getDefaultBrowserLocale())

const dayNames = computed((): string[] => CalendarMath.getFormattedWeekdayNames(userLocale.value, "long", 0))

const themeClasses = computed(() => ({
	"theme-default": state.useDefaultTheme,
	"holiday-us-traditional": state.useHolidayTheme,
	"holiday-us-official": state.useHolidayTheme,
}))

type DateClasses = { [key: string]: string | string[] }

const myDateClasses = (): DateClasses => {
	// This was added to demonstrate the dateClasses prop. Note in particular that the
	// keys of the object are `yyyy-mm-dd` ISO date strings (not dates), and the values
	// for those keys are strings or string arrays. Keep in mind that your CSS to style these
	// may need to be fairly specific to make it override your theme's styles. See the
	// CSS at the bottom of this component to see how these are styled.
	const o = {} as DateClasses
	const theFirst = thisMonth(1)
	const ides = [2, 4, 6, 9].includes(theFirst.getMonth()) ? 15 : 13
	const idesDate = thisMonth(ides)
	o[CalendarMath.isoYearMonthDay(idesDate)] = ["ides"]
	o[CalendarMath.isoYearMonthDay(thisMonth(21))] = ["do-you-remember", "the-21st"]
	return o
}

onMounted(async() => {
	state.newItemStartDate = CalendarMath.isoYearMonthDay(CalendarMath.today())
	state.newItemEndDate = CalendarMath.isoYearMonthDay(CalendarMath.today())
	events.value = await EventService.getEventsByAssoId(Number(sessionStorage.getItem('idAsso')))
	membres.value = await AssoService.getMembersByAssoId(Number(sessionStorage.getItem('idAsso')))
	// state.items = events.value
	state.items = events.value.map(event => ({
       id:event.id,
		title: event.titre,
		description: event.description,
		type: event.type,
		startDate: new Date(event.date_debut),
		lieu: event.lieu,
		participants:JSON.parse(event.participants),
		...(event.date_fin && {endDate: new Date(event.date_fin)})
      }));
})

const addEvent = async() => {
	const endDate = ref();
	if (hour_debut.value){
		const h = hour_debut.value.getHours()
		const m = hour_debut.value.getMinutes()
		date_debut.value.setMinutes(m)
		date_debut.value.setHours(h)
	}
	if(multiDay.value && hour_fin.value){
		const h = hour_fin.value.getHours()
		const m = hour_fin.value.getMinutes()
		date_fin.value.setMinutes(m)
		date_fin.value.setHours(h)
		endDate.value = date_fin.value
	} else if (multiDay.value){
		endDate.value = date_fin.value
	} else {
		endDate.value = new Date(date_debut.value.getTime() + selectedDuree.value *60000)
	}
	const data = {
		association_id: sessionStorage.getItem('idAsso'),
		titre: titre.value,
		description: description.value,
		date_debut: date_debut.value,
		lieu: lieu.value,
		type: selectedType.value,
		date_fin: endDate.value
	}

	try {
		const res = await EventService.addEvent(data);
		if (selectedPart.value && selectedPart.value.length > 0){
			await EventService.addParticipantsToEvent(res.id, selectedPart.value)
		}
	} catch (error){
		console.error('Erreur :', error)
	}
}

const deleteEvent = async (idEvent: number) => {
	try {
		const res = await EventService.deleteEvent(idEvent);
		id.value = ''
		VISIBLE.value = false
		events.value = await EventService.getEventsByAssoId(Number(sessionStorage.getItem('idAsso')))
	} catch (error){
		console.error('Erreur :', error)
	}
}

const formatDate = (date: Date | string | number | null | undefined): string => {
        if (!date) return '';
        const parsedDate = new Date(date); 
        if (isNaN(parsedDate.getTime())) return '';
        const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Intl.DateTimeFormat('fr-FR', options).format(parsedDate);
    };

const periodChanged = (): void => {
	// range, eventSource) {
	// Demo does nothing with this information, just including the method to demonstrate how
	// you can listen for changes to the displayed range and react to them (by loading items, etc.)
	// console.log(eventSource)
	// console.log(range)
}

const onClickDay = (d: Date): void => {
	state.selectionStart = undefined
	state.selectionEnd = undefined
	state.message = `You clicked: ${d.toLocaleDateString()}`
	VISIBLE.value=true
	date_debut.value = d
	  multiDay.value=false
  date_fin.value = ""
  titre.value = ""
  description.value = ""
  lieu.value = ""
  selectedDuree.value = ""
  selectedType.value = ""
  editEvent.value = false
  selectedPart.value = ""
}

const onClickItem = (item: INormalizedCalendarItem): void => {
	state.message = `You clicked: ${item.title}`
	VISIBLE.value=true
	titre.value = item.title
	id.value = item.id
	editEvent.value = true
	date_debut.value = item.startDate
	description.value = item.originalItem.description
	lieu.value = item.originalItem.lieu
	selectedType.value = item.originalItem.type
	selectedPart.value = item.originalItem.participants.map(participant => ({user_id:participant.user_id}))
	if(date_debut.value.getDay() != item.endDate.getDay())
	{
		multiDay.value = true
	} else {
		multiDay.value = false
		selectedDuree.value = new Date(Math.abs(item.endDate - date_debut.value)).getMinutes().toString()
	}
	date_fin.value = item.endDate
}

const setShowDate = (d: Date): void => {
	state.message = `Changing calendar view to ${d.toLocaleDateString()}`
	state.showDate = d
}

const setSelection = (dateRange: Date[]): void => {
	state.selectionEnd = dateRange[1]
	state.selectionStart = dateRange[0]
}

const finishSelection = (dateRange: Date[]): void => {
	setSelection(dateRange)
	state.message = `You selected: ${state.selectionStart?.toLocaleDateString() ?? "n/a"} - ${state.selectionEnd?.toLocaleDateString() ?? "n/a"}`
	VISIBLE.value=true
	date_debut.value = dateRange[0]
	multiDay.value = true
	date_fin.value = dateRange[1]
  titre.value = ""
  description.value = ""
  lieu.value = ""
  selectedDuree.value = ""
  selectedType.value = ""
  selectedPart.value = ""
	editEvent.value = false
}

const onDrop = (item: INormalizedCalendarItem, date: Date): void => {
	state.message = `You dropped ${item.id} on ${date.toLocaleDateString()}`
	// Determine the delta between the old start date and the date chosen,
	// and apply that delta to both the start and end date to move the item.
	const eLength = CalendarMath.dayDiff(item.startDate, date)
	item.originalItem.startDate = CalendarMath.addDays(item.startDate, eLength)
	item.originalItem.endDate = CalendarMath.addDays(item.endDate, eLength)
}

const clickTestAddItem = (): void => {
	state.items.push({
		startDate: CalendarMath.fromIsoStringToLocalDate(state.newItemStartDate),
		endDate: CalendarMath.fromIsoStringToLocalDate(state.newItemEndDate),
		title: state.newItemTitle,
		id: "e" + Math.random().toString(36).substring(2, 11),
	})
	state.message = "You added a calendar item!"
}

const items = ref([]);

const openCreateModal = () => {
  VISIBLE.value=true
  date_debut.value = ""
  date_fin.value = ""
  titre.value = ""
  multiDay.value = false
  description.value = ""
  lieu.value = ""
  selectedDuree.value = ""
  selectedType.value = ""
  selectedPart.value = ""
  editEvent.value = false
};

const applyFilter = (value) => {
  console.log("Filtre :", value);
};

const changePeriod = (value) => {
  state.displayPeriodUom = value
};
</script>