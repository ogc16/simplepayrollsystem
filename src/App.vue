<script setup lang="ts">
import { ref } from 'vue';
import type { Employee } from './types/employee';
import EmployeeForm from './components/EmployeeForm.vue';
import EmployeeList from './components/EmployeeList.vue';
import PayrollManagement from './components/PayrollManagement.vue';

const employees = ref<Employee[]>([]);
const editingEmployee = ref<Employee | null>(null);

const addEmployee = (employee: Employee) => {
  employees.value.push(employee);
};

const updateEmployee = (updatedEmployee: Employee) => {
  const index = employees.value.findIndex(emp => emp.id === updatedEmployee.id);
  if (index !== -1) {
    employees.value[index] = updatedEmployee;
    editingEmployee.value = null;
  }
};

const deleteEmployee = (id: string) => {
  employees.value = employees.value.filter(emp => emp.id !== id);
};

const startEditing = (employee: Employee) => {
  editingEmployee.value = { ...employee };
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 py-8 px-4">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold text-center mb-8">Payroll System</h1>
      <EmployeeForm 
        @add-employee="addEmployee" 
        @update-employee="updateEmployee"
        :editing-employee="editingEmployee"
      />
      <EmployeeList 
        :employees="employees" 
        @edit-employee="startEditing"
        @delete-employee="deleteEmployee"
      />
      <PayrollManagement :employees="employees" />
    </div>
  </div>
</template>