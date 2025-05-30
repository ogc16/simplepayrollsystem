<script setup lang="ts">
import { ref } from 'vue';
import type { Employee, PayrollCalculation, CustomDeduction } from '../types/employee';
import { format } from 'date-fns';
import { jsPDF } from 'jspdf';

defineProps<{
  employees: Employee[]
}>();

const selectedEmployee = ref<Employee | null>(null);
const payrollCalculations = ref<PayrollCalculation | null>(null);
const customDeductions = ref<CustomDeduction[]>([]);
const newDeduction = ref({ name: '', amount: 0 });

const calculatePayroll = () => {
  if (!selectedEmployee.value) return;
  
  const grossPay = selectedEmployee.value.salary;
  
  // PAYE Tax calculation (simplified example)
  let tax = 0;
  if (grossPay <= 24000) {
    tax = grossPay * 0.1;
  } else if (grossPay <= 32333) {
    tax = grossPay * 0.25;
  } else {
    tax = grossPay * 0.3;
  }
  
  // SHA deduction (simplified)
  // Ensures a minimum SHA of 300 
  const sha = Math.max(grossPay * 0.0275, 300); 
  
  
  // NSSF (simplified - 6% of Basic Salary)
  const nssf = grossPay > 36000 ? 36000 * 0.06 : grossPay * 0.06; // NSSF capped at 6% of 36,000 for salaries above 36,000
  
  // Calculate total custom deductions
  const totalCustomDeductions = customDeductions.value.reduce((total, deduction) => total + deduction.amount, 0);
  
  const totalDeductions = tax + sha + nssf + totalCustomDeductions;
  const netPay = grossPay - totalDeductions;
  
  payrollCalculations.value = {
    grossPay,
    tax,
    sha,
    nssf,
    netPay,
    customDeductions: [...customDeductions.value]
  };
};

const addCustomDeduction = () => {
  if (newDeduction.value.name && newDeduction.value.amount > 0) {
    customDeductions.value.push({ ...newDeduction.value });
    newDeduction.value = { name: '', amount: 0 };
    calculatePayroll();
  }
};

const removeCustomDeduction = (index: number) => {
  customDeductions.value.splice(index, 1);
  calculatePayroll();
};

const formattedAmount = (amount: number) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES'
  }).format(amount);
};

const downloadPayslip = () => {
  if (!selectedEmployee.value || !payrollCalculations.value) return;

  const employee = selectedEmployee.value;
  const calculations = payrollCalculations.value;
  
  // Create PDF document (57mm = 2.244094488189in)
  const doc = new jsPDF({
    unit: 'in',
    format: [2.3, 4.7] // 57mm width, A4 height
  });

  const pageWidth = 2.244094488189;
  const margin = 0.2;
  const lineHeight = 0.2;
  let yPosition = margin;

  // Helper function for centered text
  const centerText = (text: string, y: number, fontSize = 10) => {
    doc.setFontSize(fontSize);
    doc.text(text, pageWidth / 2, y, { align: 'center' });
  };

  // Helper function for left-aligned text
  const leftText = (text: string, y: number, fontSize = 8) => {
    doc.setFontSize(fontSize);
    doc.text(text, margin, y);
  };

  // Helper function for right-aligned text
  const rightText = (text: string, y: number, fontSize = 8) => {
    doc.setFontSize(fontSize);
    doc.text(text, pageWidth - margin, y, { align: 'right' });
  };

  // Helper function for line items
  const lineItem = (label: string, value: string, y: number) => {
    leftText(label, y);
    rightText(value, y);
  };

  // Add watermark
  doc.setFontSize(30);
  doc.setTextColor(224, 211, 230);
  doc.setFont('helvetica', 'bold');
  doc.text(' Company Name', pageWidth / 2, 3, {
    align: 'center',
    angle: 90,//change the angle to >90 degrees to make it visible
  });
  doc.setTextColor(20, 2, 28);
  doc.setFont('Courier', 'normal');

  // Header
  centerText('Company Name', yPosition, 12);
  yPosition += lineHeight;
  centerText('PAYSLIP', yPosition, 10);
  yPosition += lineHeight;
  centerText(format(new Date(), 'MMMM yyyy'), yPosition, 8);
  yPosition += lineHeight ;

  // Employee details
  leftText('-------------------------------------------------', yPosition);
  yPosition += lineHeight;
  leftText(`Name: ${employee.firstName} ${employee.lastName}`, yPosition);
  yPosition += lineHeight;
  leftText(`ID: ${employee.idNumber}`, yPosition);
  yPosition += lineHeight;
  leftText(`KRA: ${employee.kraPin}`, yPosition);
  yPosition += lineHeight;
  leftText(`Position: ${employee.position}`, yPosition);
  yPosition += lineHeight;
  leftText('--------------------------------------------------', yPosition);
  yPosition += lineHeight * 1.5;

  // Earnings
  centerText('EARNINGS', yPosition);
  yPosition += lineHeight;
  lineItem('Basic Salary:', formattedAmount(calculations.grossPay), yPosition);
  yPosition += lineHeight * 1.5;

  // Deductions
  leftText('DEDUCTIONS', yPosition);
  yPosition += lineHeight * 1.5 ;
  lineItem('PAYE:', formattedAmount(calculations.tax), yPosition);
  yPosition += lineHeight;
  lineItem('SHA:', formattedAmount(calculations.sha), yPosition);
  yPosition += lineHeight;
  lineItem('NSSF:', formattedAmount(calculations.nssf), yPosition);
  yPosition += lineHeight;

  // Custom deductions
  if (calculations.customDeductions.length > 0) {
    calculations.customDeductions.forEach(deduction => {
      lineItem(deduction.name + ':', formattedAmount(deduction.amount), yPosition);
      yPosition += lineHeight;
    });
  }

  yPosition += lineHeight * 0.5;
  leftText('-------------------------------------------------', yPosition);
  yPosition += lineHeight;

  // Net pay
  doc.setFontSize(15);
  lineItem('NET PAY:', formattedAmount(calculations.netPay), yPosition);
  yPosition += lineHeight * 1.5;

  // Footer
  centerText('Thank you for your service!', yPosition, 8);
  yPosition += lineHeight;
  centerText('Signature______________', yPosition, 8);
  yPosition += lineHeight;
  centerText(format(new Date(), 'dd/MM/yyyy HH:mm:ss'), yPosition, 8);
   yPosition += lineHeight * 1.5;

  // Save PDF
  doc.save(`payslip_${employee.firstName}-${employee.lastName}-${format(new Date(), 'MMM-yyyy')}.pdf`);
};
</script>

<template>
  <div class="mt-8 bg-white p-6 rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-4">Company Name - Payroll Management</h2>
    
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700">Select Employee</label>
      <select
        v-model="selectedEmployee"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      >
        <option :value="null">Select an employee</option>
        <option v-for="emp in employees" :key="emp.id" :value="emp">
          {{ emp.firstName }} {{ emp.lastName }} - {{ emp.position }}
        </option>
      </select>
    </div>

    <!-- Custom Deductions Form -->
    <div class="mb-6 p-4 bg-gray-50 rounded-lg">
      <h3 class="text-lg font-semibold mb-3">Custom Deductions</h3>
      <div class="flex gap-4 mb-4">
        <div class="flex-1">
          <input
            v-model="newDeduction.name"
            type="text"
            placeholder="Deduction Name"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div class="flex-1">
          <input
            v-model.number="newDeduction.amount"
            type="number"
            min="0"
            placeholder="Amount"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <button
          @click="addCustomDeduction"
          class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          Add
        </button>
      </div>
      
      <!-- Custom Deductions List -->
      <div v-if="customDeductions.length > 0" class="space-y-2">
        <div v-for="(deduction, index) in customDeductions" :key="index" class="flex justify-between items-center bg-white p-2 rounded">
          <span>{{ deduction.name }}: {{ formattedAmount(deduction.amount) }}</span>
          <button
            @click="removeCustomDeduction(index)"
            class="text-red-600 hover:text-red-800"
          >
            Remove
          </button>
        </div>
      </div>
    </div>

    <div class="flex gap-4">
      <button
        @click="calculatePayroll"
        :disabled="!selectedEmployee"
        class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400"
      >
        Calculate Payroll
      </button>

      <button
        v-if="payrollCalculations"
        @click="downloadPayslip"
        class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        Download Payslip
      </button>
    </div>

    <div v-if="payrollCalculations" class="mt-6">
      <h3 class="text-xl font-semibold mb-4">Payroll Summary</h3>
      <div class="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
        <div>
          <p class="text-gray-600">Basic Salary:</p>
          <p class="font-semibold">{{ formattedAmount(payrollCalculations.grossPay) }}</p>
        </div>
        <div>
          <p class="text-gray-600">PAYE Tax:</p>
          <p class="font-semibold">{{ formattedAmount(payrollCalculations.tax) }}</p>
        </div>
        <div>
          <p class="text-gray-600">SHA:</p>
          <p class="font-semibold">{{ formattedAmount(payrollCalculations.sha) }}</p>
        </div>
        <div>
          <p class="text-gray-600">NSSF:</p>
          <p class="font-semibold">{{ formattedAmount(payrollCalculations.nssf) }}</p>
        </div>
        <div v-if="customDeductions.length > 0" class="col-span-2">
          <p class="text-gray-600 mb-2">Custom Deductions:</p>
          <div v-for="deduction in customDeductions" :key="deduction.name" class="flex justify-between px-4">
            <span>{{ deduction.name }}:</span>
            <span class="font-semibold">{{ formattedAmount(deduction.amount) }}</span>
          </div>
        </div>
        <div class="col-span-2 border-t pt-4 mt-2">
          <p class="text-gray-600">Net Pay:</p>
          <p class="text-xl font-bold text-green-600">{{ formattedAmount(payrollCalculations.netPay) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>