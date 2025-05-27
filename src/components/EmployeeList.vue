<script setup lang="ts">
import { computed } from 'vue';
import type { Employee } from '../types/employee';
import { format } from 'date-fns';

const props = defineProps<{
  employees: Employee[]
}>();

const emit = defineEmits<{
  (e: 'edit-employee', employee: Employee): void
  (e: 'delete-employee', id: string): void
}>();

const formattedEmployees = computed(() => {
  return props.employees.map(emp => ({
    ...emp,
    formattedStartDate: format(new Date(emp.startDate), 'MMM dd, yyyy')
  }));
});
</script>

<template>
  <div class="mt-8">
    <h2 class="text-2xl font-bold mb-4">Employees</h2>
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white rounded-lg shadow">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Number</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KRA PIN</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="employee in formattedEmployees" :key="employee.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <img 
                :src="employee.imageUrl || 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg'"
                alt="Employee photo"
                class="h-10 w-10 rounded-full object-cover"
              />
            </td>
            <td class="px-6 py-4 whitespace-nowrap">{{ employee.firstName }} {{ employee.lastName }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ employee.idNumber }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ employee.kraPin }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ employee.gender }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ employee.position }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ employee.email }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ employee.formattedStartDate }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <button
                @click="emit('edit-employee', employee)"
                class="text-indigo-600 hover:text-indigo-900 mr-2"
              >
                Edit
              </button>
              <button
                @click="emit('delete-employee', employee.id)"
                class="text-red-600 hover:text-red-900"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>