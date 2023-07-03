import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {EmailValidator, FormBuilder, FormControl, FormGroup, Validators, AbstractControl, ValidatorFn} from '@angular/forms';
import { EmployeeModel } from './employee-dashboard.model';
import { ApiService, Roles } from '../shared/api.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';
import { formatDate } from '@angular/common';


@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EmployeeDashboardComponent implements OnInit {

  formValue !: FormGroup;
  employeeModelObj: EmployeeModel = new EmployeeModel();
  employeeData !: any;
  showAdd = true;
  showUpdate = true;
  currentUserRole: string;
  isStudent: boolean = false; 
  isStudentUser: boolean = false;
  userRole: string='';
  isDisabled: boolean;
  isDisabledEdit: boolean;
  mobile: string;
  selectedImage: string;
  croppedImage: any;
  selectedEmployee: EmployeeModel = new EmployeeModel();
  selectedDate: any; 
  changedImage: any;
  adminName: string;
  maxDate: string;
  fullname: string='';
  gender1: any;
  filteredClasses: string[] = [];
  selectedClass: string = '';
isMobileModified: boolean = false;
emailExistsError: boolean = false;

currentPage: number = 1;
  itemsPerPage: number = 10;
  totalDetails: number;


  get displayedData(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.totalDetails = this.employeeData.length;
    return this.employeeData.slice(startIndex, endIndex);
  }

nextPage() {
  this.currentPage++;
}

previousPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
  }
}

  myForm = this.formbuilder.group({
    gender: ['', Validators.required]
  });
 
  get gender() {
    return this.myForm.get('gender');
  }
 
  constructor(private formbuilder: FormBuilder, private api: ApiService, private http: HttpClient, private router: Router, private authService: AuthService) {
    this.isStudentUser = this.api.isStudent();
    this.maxDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
    this.formValue = this.formbuilder.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required, this.capitalizeFirstLetter()]],
      lastName: ['', [Validators.required]],
      mobile: ['',this.mobile && this.mobile.length === 10],
      dob: ['', [Validators.required]],
      profile:['']
    });
   }

   clickUser() {
    console.log('Add Student Details button clicked');
  }

   clickAddEmployee(){
    if (!this.isStudent) {
    this.showAdd = true;
    this.showUpdate = false;
    this.formValue.reset();
  } else {
    alert('Access denied. You do not have permission to add an employee.');
  }
  }

  filterClassesByAge() {
    const dob = new Date(this.formValue.get('dob').value);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
  
    if (age >= 6 && age <= 30) {
      const maxClass = (age > 17) ? 12 : age - 5;
      this.filteredClasses = Array.from(Array(maxClass), (_, i) => {
        const classNumber = i + 1;
        let suffix;
        this.selectedClass = '';
        if (classNumber === 1) {
          suffix = 'st';
        } else if (classNumber === 2) {
          suffix = 'nd';
        } else if (classNumber === 3) {
          suffix = 'rd';
        } else {
          suffix = 'th';
        }
  
        return `${classNumber}${suffix} standard`;
      });
    } else {
      this.filteredClasses = [];
    }
  }
  
  
  
  postEmployeeDetails() {
    if (!this.isStudent) {
      //alert(this.formValue.value.gender);
      if (this.formValue.value.gender === 'female') {
        this.gender1 = "assets/girl-1.png";
      }
      else if(this.formValue.value.gender === 'male') {
        this.gender1 = "assets/boy-1.png";
      }
      else {
        this.gender1 = "assests/user-logo.png"
      }
      this.employeeModelObj.firstName = this.formValue.value.firstName;
      this.employeeModelObj.lastName = this.formValue.value.lastName;
      this.employeeModelObj.email = this.formValue.value.email;
      this.employeeModelObj.mobile = this.formValue.value.mobile;
      this.employeeModelObj.profile = this.gender1;
      this.employeeModelObj.gender = this.formValue.value.gender;
      this.employeeModelObj.fatherName = this.formValue.value.fatherName;
      this.employeeModelObj.motherName = this.formValue.value.motherName;
      this.employeeModelObj.address = this.formValue.value.address;
      this.employeeModelObj.classlist = this.formValue.value.classlist;
      this.employeeModelObj.dob = this.formValue.value.dob;
      this.employeeModelObj.bloodgroup = this.formValue.value.bloodgroup;
  
      if (this.selectedEmployee.id) {
        // Update employee details
        this.api.updateEmployee(this.selectedEmployee.id, this.employeeModelObj)
          .subscribe((res: any) => {
            console.log(res);
            alert('Student details updated successfully');
            let ref = document.getElementById('cancel');
            ref?.click();
            this.getAllEmployees();
          });
      } else {
        // Add new employee
        this.http.get<any>('http://localhost:3000/posts?email=' + this.formValue.value.email)
      .subscribe(res => {
        if (res.length > 0) {
          //alert('Email already exists');
          this.emailExistsError = true;
        }else {
          this.emailExistsError = false;
        this.api.postEmployee(this.employeeModelObj)
          .subscribe((res: any) => {
            console.log(res);
            alert("Student Added Successfully")
            let ref = document.getElementById('cancel')
            ref?.click();
            this.formValue.reset();
            this.getAllEmployees();
          },
          (err: any) => {
            alert('Something went wrong');
          }
        );}
      },)}
    } else {
      alert('Access denied. You do not have permission to add/update an employee.');
    }
  }
  
  getAllEmployee(){
    this.api.getEmployee()
    .subscribe(res=>{
      this.employeeData=res;
    })
  }

  deleteEmployee(row: any) {
    if (!this.isStudent) {
      const employeeId = row.id;
      this.api.deleteEmployee(employeeId).subscribe((res: any) => {
        alert('Employee Deleted');
        this.getAllEmployee();
      });
    } else {
      alert('Access denied. You do not have permission to delete an employee.');
    }
  }

  onEdit(row: any) {
    if (!this.isStudent) {
      if (this.formValue.value.gender === 'female') {
        this.gender1 = "assets/girl-1.png";
      }
      else if(this.formValue.value.gender === 'male') {
        this.gender1 = "assets/boy-1.png";
      }
      else {
        this.gender1 = "assests/user-logo.png";
      }
      this.showAdd = false;
      this.showUpdate = true;
      this.selectedEmployee.id = row.id;
      this.formValue.controls['firstName'].setValue(row.firstName);
      this.formValue.controls['lastName'].setValue(row.lastName);
      this.formValue.controls['email'].setValue(row.email);
      this.formValue.controls['mobile'].setValue(row.mobile);
      this.formValue.controls['gender'].setValue(row.gender);
      this.formValue.controls['fatherName'].setValue(row.fatherName);
      this.formValue.controls['motherName'].setValue(row.motherName);
      this.formValue.controls['address'].setValue(row.address);
      this.formValue.controls['classlist'].setValue(row.classlist);
      this.formValue.controls['dob'].setValue(row.dob);
      this.formValue.controls['profile'].setValue(row.profile);
      this.formValue.controls['bloodgroup'].setValue(row.bloodgroup);
      //this.croppedImage = row.profile;
      this.selectedEmployee = { ...row };
    } else {
      alert('Access denied. You do not have permission to edit an employee.');
    }
  }
  
  updateEmployeeDetails() {
    if (!this.isStudent) {
      if (this.formValue.value.gender === 'female') {
        this.gender1 = "assets/girl-1.png";
      }
      else if(this.formValue.value.gender === 'male') {
        this.gender1 = "assets/boy-1.png";
      }
      else {
        this.gender1 = "assests/user-logo.png"
      }
      this.employeeModelObj.id = this.selectedEmployee.id;
      this.employeeModelObj.firstName = this.formValue.value.firstName;
      this.employeeModelObj.lastName = this.formValue.value.lastName;
      this.employeeModelObj.email = this.formValue.value.email;
      this.employeeModelObj.mobile = this.formValue.value.mobile;
      this.employeeModelObj.profile = this.gender1;
      this.employeeModelObj.gender = this.formValue.value.gender;
      this.employeeModelObj.fatherName = this.formValue.value.fatherName;
      this.employeeModelObj.motherName = this.formValue.value.motherName;
      this.employeeModelObj.address = this.formValue.value.address;
      this.employeeModelObj.classlist = this.formValue.value.classlist;
      this.employeeModelObj.dob = this.formValue.value.dob;
      this.employeeModelObj.bloodgroup = this.formValue.value.bloodgroup;
  
      // Check if a new image is selected
      if (this.croppedImage) {
        this.employeeModelObj.profile = this.croppedImage;
      } else {
        // Use the existing profile image
        const employee = this.employeeData.find((emp: any) => emp.id === this.employeeModelObj.id);
        this.employeeModelObj.profile = employee.profile;
      }
  
      this.http.get<any>('http://localhost:3000/posts?email=' + this.formValue.value.email)
      .subscribe(res => {
        if (res.length > 0) {
          //alert('Email already exists');
          this.emailExistsError = true;
        }else {
          this.emailExistsError = false;
      this.api.updateEmployee(this.employeeModelObj.id, this.employeeModelObj)
        .subscribe((res: any) => {
          alert('Updated Successfully');
          let ref = document.getElementById('cancel');
          ref?.click();
          this.getAllEmployee();
        });} 
      this.showAdd = false;
      this.showUpdate = true;
    }, )} else {
      alert('Access denied. You do not have permission to edit an employee.');
    }
  }

  get isPhoneNumberValid(): boolean {
    return this.mobile && this.mobile.length === 10;
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.employeeData.picture = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  uploadImage(file: File) {
    const formData: FormData = new FormData();
    formData.append('image', file);

    this.http.post<any>('/api/upload', formData)
      .subscribe(
        response => {
          console.log('Image uploaded successfully:', response);
           this.employeeModelObj.profile = response.imageURL;
        },
        error => {
          console.error('Error uploading image:', error);
        }
      );
  }

  imageCropped(event: any) {
    this.croppedImage = event.base64;
  }

  ngOnInit(): void {
    const storedImage = localStorage.getItem('selectedImage');
    if (storedImage) {
      this.selectedImage = storedImage;
    }
    this.selectedImage = localStorage.getItem('selectedImage');
    this.formValue = this.formbuilder.group({
      firstName: ['',[Validators.required, this.capitalizeFirstLetter()]],
      lastName: ['',[Validators.required, this.capitalizeFirstLetter()]],
      email: ['',[Validators.required, Validators.email]],
      mobile: ['', Validators.pattern('[0-9]{10}')],
      gender:[''],
      profile: [''],
      fatherName:['',[Validators.required, this.capitalizeFirstLetter()]],
      motherName:['',[Validators.required, this.capitalizeFirstLetter()]],
      address:[''],
      classlist: new FormControl(),
      dob: new FormControl(null, Validators.required),
      bloodgroup:['']
    });
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
    this.isDisabled = this.userRole != 'Admin'? true: false;
    this.isDisabledEdit = this.userRole != 'Admin'? (this.userRole != 'Teacher'? true: false): false;
    this.currentUserRole = this.api.getUserRole();
    this.isStudent = this.currentUserRole === Roles.STUDENT;
    this.getAllEmployee();

    const today = new Date();
    this.maxDate = today.toISOString().split('T')[0];

    this.formValue.get('mobile').valueChanges.subscribe(() => {
      this.isMobileModified = true;
    });
  }


  getAllEmployees() {
    this.api.getEmployee().subscribe(res => {
      this.employeeData = res;
    });

  }
  viewEmployee(employee: any) {
    this.router.navigate(['/employee1'], { queryParams: { id: employee.id } });
  }

  capitalizeFirstLetter(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (value && value.length > 0) {
        const firstLetter = value.charAt(0);
        if (firstLetter !== firstLetter.toUpperCase()) {
          return { capitalizeFirstLetter: true };
        }
      } else if (value && value.length === 0) {
        return { emptyFullName: true };
      }
      return null;
    };
  }

  }

