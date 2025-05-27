export interface Employee {
  id: string;
  idNumber: string;
  kraPin: string;
  gender: 'male' | 'female';
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  salary: number;
  startDate: string;
  imageUrl: string;
  profileImage?: File;
  //employeeType: 'full-time' | 'part-time' | 'contract';
  department: string;
 // employeenumber: string;
  //phoneNumber: string;
}

export interface PayrollCalculation {
  grossPay: number;
  tax: number;
  sha: number;
  nssf: number;
  netPay: number;
  customDeductions: CustomDeduction[];
}

export interface CustomDeduction {
  name: string;
  amount: number;
}