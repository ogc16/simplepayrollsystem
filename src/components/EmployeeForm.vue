<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Employee } from '../types/employee';

const positions = ['CEO', 'Office Assistant', 'HR', 'IT Manager', 'Accountant', 'Finance Manager'];
const genders = ['male', 'female'];

const props = defineProps<{
  editingEmployee: Employee | null
}>();

const emit = defineEmits<{
  (e: 'add-employee', employee: Employee): void
  (e: 'update-employee', employee: Employee): void
}>();

const employee = ref<Employee>({
  id: crypto.randomUUID(),
  idNumber: '',
  kraPin: '',
  employeeNumber:'',
  shaNumber:'',
  gender: 'male',
  firstName: '',
  lastName: '',
  email: '',
  position: '',
  salary: '',
  employeeNumber:'',
  
  startDate: new Date().toISOString().split('T')[0],
  imageUrl: ''
});

const imageFile = ref<File | null>(null);

watch(() => props.editingEmployee, (newValue) => {
  if (newValue) {
    employee.value = { ...newValue };
  }
}, { immediate: true });

const handleImageUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    imageFile.value = file;
    employee.value.imageUrl = URL.createObjectURL(file);
  }
};

const submitForm = () => {
  if (props.editingEmployee) {
    emit('update-employee', { ...employee.value });
  } else {
    emit('add-employee', { ...employee.value });
  }
  
  employee.value = {
    id: crypto.randomUUID(),
    idNumber: '',
    kraPin: '',
    gender: 'male',
    firstName: '',
    lastName: '',
    email: '',
    position: '',
    salary: '',
    startDate: new Date().toISOString().split('T')[0],
    imageUrl: ''
  };
  imageFile.value = null;
};
</script>

<template>
  <form @submit.prevent="submitForm" class="bg-white p-6 rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-4">
      {{ editingEmployee ? 'Edit Employee' : 'Add New Employee' }}
    </h2>
    <div class="grid grid-cols-2 gap-4">
      <div class="col-span-2">
        <label class="block text-sm font-medium text-gray-700">Profile Image</label>
        <div class="mt-1 flex items-center space-x-4">
          <img 
            :src="employee.imageUrl || 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg'" 
            alt="Profile preview"
            class="h-20 w-20 rounded-full object-cover"
          />
          <input
            type="file"
            accept="image/*"
            @change="handleImageUpload"
            class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">ID Number</label>
        <input
          v-model="employee.idNumber"
          type="text"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">KRA PIN</label>
        <input
          v-model="employee.kraPin"
          type="text"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Gender</label>
        <select
          v-model="employee.gender"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option v-for="gender in genders" :key="gender" :value="gender">
            {{ gender.charAt(0).toUpperCase() + gender.slice(1) }}
          </option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">First Name</label>
        <input
          v-model="employee.firstName"
          type="text"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Last Name</label>
        <input
          v-model="employee.lastName"
          type="text"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Email</label>
        <input
          v-model="employee.email"
          type="email"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Position</label>
        <select
          v-model="employee.position"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="" disabled>Select a position</option>
          <option v-for="position in positions" :key="position" :value="position">
            {{ position }}
          </option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Salary</label>
        <input
          v-model.number="employee.salary"
          type="number"
          required
          min="0"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Start Date</label>
        <input
          v-model="employee.startDate"
          type="date"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
    </div>
    <button
      type="submit"
      class="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      {{ editingEmployee ? 'Update Employee' : 'Add Employee' }}
    </button>
  </form>
</template>