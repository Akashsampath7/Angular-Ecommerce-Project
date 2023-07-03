
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { ApiService, Roles } from '../shared/api.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-userrole',
  templateUrl: './userrole.component.html',
  styleUrls: ['./userrole.component.css']
})
export class UserroleComponent implements OnInit{
  adminName: any;
  employeeData !: any;
  isStudent: boolean = false; 
  selectedRole: any;
  public signupForm!: FormGroup;
  userRole: string='';
  fullname: string='';

  roleNames: { [key: string]: string } = {
    '01': 'Admin',
    '02': 'Teacher',
    '03': 'Student'
  };

  getRoleName(role: string): string {
    return this.roleNames[role] || '';
  }
  constructor(private authService: AuthService, private api: ApiService, private route: ActivatedRoute, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.getRoles();
    this.userRole=sessionStorage.getItem('userRole');
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
    this.fullname=sessionStorage.getItem('fullname');
    //this.adminName = this.authService.getAdminName();
  }
  getRoles() {
    this.api.getRoles().subscribe(
      (res) => {
        this.employeeData = res;
      },
      (err) => {
        alert('Something went wrong');
      }
    );
  }

  getAllRole(){
    this.api.getRoles()
    .subscribe(res=>{
      this.employeeData=res;
    })
  }

  getRoledetails(row: any) {
    if (!this.isStudent) {
      const employeeId = row.id;
      this.api.getRoledetails(employeeId).subscribe((res: any) => {
        alert('Employee');
        this.getAllRole();
      });
    } else {
      alert('Access denied. You do not have permission to delete an employee.');
    }
  }
}