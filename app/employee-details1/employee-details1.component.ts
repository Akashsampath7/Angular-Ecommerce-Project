import { Component, OnInit } from '@angular/core';
import { ApiService } from '../shared/api.service';
import { ActivatedRoute } from '@angular/router';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-employee-details1',
  templateUrl: './employee-details1.component.html',
  styleUrls: ['./employee-details1.component.css']
})
export class EmployeeDetails1Component implements OnInit {
  employees: any[];
  selectedEmployee: any;
  userRole: string='';
  fullname: string='';

  constructor(private apiService: ApiService,private route: ActivatedRoute) { }

  ngOnInit() {
    this.userRole = sessionStorage.getItem('userRole');
    console.log(this.userRole);
    if(this.userRole === '01' ){
      this.userRole = 'Admin';
    } else if(this.userRole === '02'){
      this.userRole= 'Teacher'
    } else if(this.userRole === '03'){
      this.userRole = 'Student'
    }
    else{
      console.log(this.userRole);
    }
    this.fullname = sessionStorage.getItem('fullname');
    this.route.queryParams.subscribe(params => {
      const employeeId = params['id'];
      if (employeeId) {
        this.getEmployee(employeeId);
      }
    });
  }

  generatePDF() {
    const doc = new jsPDF();
    const img = new Image();
    img.onload = () => {
      doc.text('Student Details', 70, 20);
      doc.addImage(img, 'JPEG', 10, 10, 50, 50); 
      

      const studentDetails = `
        Full Name: ${this.selectedEmployee.firstName} ${this.selectedEmployee.lastName}
        Email ID: ${this.selectedEmployee.email}
        Mobile No: ${this.selectedEmployee.mobile}
        Gender: ${this.selectedEmployee.gender}
        Father Name: ${this.selectedEmployee.fatherName}
        Mother Name: ${this.selectedEmployee.motherName}
        Address: ${this.selectedEmployee.address}
        Class: ${this.selectedEmployee.classlist}
      `;
    
      doc.text(studentDetails, 10, 70);
    
      // Save the PDF
      doc.save('student_details.pdf');
    };
  
    img.src = this.selectedEmployee.profile;
  }

  getEmployee(employeeId: string) {
    this.apiService.getEmployeeById(employeeId).subscribe(
      (res: any) => {
        this.selectedEmployee = res;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
}
