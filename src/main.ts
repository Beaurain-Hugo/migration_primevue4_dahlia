import { createApp } from 'vue';
import AppWrapper from './AppWrapper.vue';
import router from './router';

import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';

import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';

// Composants PrimeVue
import Button from 'primevue/button';
import Card from 'primevue/card';
import Avatar from 'primevue/avatar';
import Badge from 'primevue/badge';
import Dialog from 'primevue/dialog';
import Toast from 'primevue/toast';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import TabMenu from 'primevue/tabmenu';
import Menubar from 'primevue/menubar';
import Dropdown from 'primevue/dropdown';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ProgressBar from 'primevue/progressbar';
import Steps from 'primevue/steps';
import Menu from 'primevue/menu';
import Breadcrumb from 'primevue/breadcrumb';
import DatePicker from 'primevue/datepicker';
import AutoComplete from 'primevue/autocomplete';
import ConfirmDialog from 'primevue/confirmdialog';
import RadioButton from 'primevue/radiobutton';
import OverlayPanel from 'primevue/overlaypanel';
import Chip from 'primevue/chip';
import FileUpload from 'primevue/fileupload';
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import Select from 'primevue/select';
import AccordionContent from 'primevue/accordioncontent';
import Checkbox from 'primevue/checkbox';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Textarea from 'primevue/textarea';
import Toolbar from 'primevue/toolbar';
import ToggleButton from 'primevue/togglebutton';
import Tag from 'primevue/tag';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import Stepper from 'primevue/stepper';
import StepList from 'primevue/steplist';
import StepPanels from 'primevue/steppanels';
import StepItem from 'primevue/stepitem';
import Step from 'primevue/step';
import StepPanel from 'primevue/steppanel';
import SelectButton from 'primevue/selectbutton';

import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';

import './assets/styles/layout.scss';
import '@/assets/styles/global.scss';
import '@fortawesome/fontawesome-free/css/all.min.css';

import Default from '@/components/layouts/default.vue';
import NoSidebar from '@/components/layouts/no-sidebar.vue';

const app = createApp(AppWrapper);

// PrimeVue 4 INITIALISATION
app.use(PrimeVue, {
  theme: {
    preset: Aura
  }
});

app.use(ConfirmationService);
app.use(ToastService);
app.use(router);

// Enregistrements globaux
app.component('PButton', Button);
app.component('Card', Card);
app.component('Avatar', Avatar);
app.component('Badge', Badge);
app.component('PDialog', Dialog);
app.component('Toast', Toast);
app.component('InputText', InputText);
app.component('InputNumber', InputNumber);
app.component('TabMenu', TabMenu);
app.component('Menubar', Menubar);
app.component('Dropdown', Dropdown);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('ProgressBar', ProgressBar);
app.component('Steps', Steps);
app.component('PMenu', Menu);
app.component('Breadcrumb', Breadcrumb);
app.component('AutoComplete', AutoComplete);
app.component('ConfirmDialog', ConfirmDialog);
app.component('RadioButton', RadioButton);
app.component('OverlayPanel', OverlayPanel);
app.component('Chip', Chip);
app.component('FileUpload', FileUpload);
app.component('Accordion', Accordion);
app.component('AccordionPanel', AccordionPanel);
app.component('AccordionHeader', AccordionHeader);
app.component('AccordionContent', AccordionContent);
app.component('Checkbox', Checkbox);
app.component('Tabs', Tabs);
app.component('TabList', TabList);
app.component('Tab', Tab);
app.component('TabPanels', TabPanels);
app.component('TabPanel', TabPanel);
app.component('PTextarea', Textarea);
app.component('Toolbar', Toolbar);
app.component('ToggleButton', ToggleButton);
app.component('Tag', Tag);
app.component('DatePicker', DatePicker );
app.component('Stepper', Stepper );
app.component('StepList', StepList );
app.component('StepPanels', StepPanels );
app.component('StepItem', StepItem );
app.component('Step', Step );
app.component('StepPanel', StepPanel );
app.component('Select', Select );
app.component('SelectButton', SelectButton );

// Layouts
app.component('default-layout', Default);
app.component('no-sidebar-layout', NoSidebar);

app.mount('#app');
