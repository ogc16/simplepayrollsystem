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
  department: string;
  employeenumber: string; // Uncommented this property
  phoneNumber: string; // Uncommented this property
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