import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  mobile: string;
  fullname: string;
  public signupForm!: FormGroup;
  formValue !: FormGroup;
  emailExistsError: boolean = false;
  passwordVisible: boolean = false;
  filteredClasses: string[] = [];
  selectedClass: string = '';
  maxDate: string;
  selectedRole: string = '';


  myForm = this.formBuilder.group({
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]]
  });

  get password() {
    return this.myForm.get('password');
  }

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router:Router){

    this.formValue = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.minLength(10), Validators.maxLength(10)]],
      fullname: ['', [Validators.required, this.capitalizeFirstLetter()]],
      dob: ['', Validators.required]
    });

   }

  ngOnInit(): void{
    this.signupForm = this.formBuilder.group({
      fullname: ['', [Validators.required, this.capitalizeFirstLetter()]],
      role: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, this.passwordComplexity()]],
      mobile: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      dob: new FormControl(null, Validators.required),
      classlist: new FormControl(),

    })

    const today = new Date();
    this.maxDate = today.toISOString().split('T')[0];
  }
  filterClassesByAge() {
    const dob = new Date(this.signupForm.get('dob').value);
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
  

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  } 

  passwordComplexity(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      const hasUppercase = /[A-Z]/.test(value);
      const hasLowercase = /[a-z]/.test(value);
      const hasNumber = /[0-9]/.test(value);
      const hasSpecialCharacter = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(value);
  
      const valid = hasUppercase && hasLowercase && hasNumber && hasSpecialCharacter;
  
      if (!valid) {
        return { passwordComplexity: true };
      }
  
      return null;
    };
  }
    
  signUp() {
    this.signupForm.value.password = btoa(this.signupForm.value.password);

    this.http.get<any>('http://localhost:3000/signupUsers?email=' + this.signupForm.value.email)
      .subscribe(res => {
        if (res.length > 0) {
          //alert('Email already exists');
          this.emailExistsError = true;
        } else {
          this.emailExistsError = false;
          this.http.post<any>('http://localhost:3000/signupUsers', this.signupForm.value)
            .subscribe(response => {
              alert('Signup Successful');
              console.log(response);
              this.signupForm.reset();
              this.router.navigate(['login']);
            }, error => {
              alert('Something went wrong');
            });
        }
      }, error => {
        alert('Something went wrong');
      });
  }
  

  get isPhoneNumberValid(): boolean {
    return this.mobile && this.mobile.length === 10;
  }

  get fullnameControl() {
    return this.formValue.get('fullname');
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

  onRoleChange() {
    const role = this.signupForm.get('role').value;
    this.selectedRole = role;
  
    if (role === '02') {
      this.signupForm.removeControl('dob');
      this.signupForm.removeControl('classlist');
      this.signupForm.addControl('degree', new FormControl('', Validators.required));
    } else if (role === '03') {
      this.signupForm.removeControl('degree');
      this.signupForm.addControl('dob', new FormControl(null, Validators.required));
      this.signupForm.addControl('classlist', new FormControl());
    }
  }
  
}