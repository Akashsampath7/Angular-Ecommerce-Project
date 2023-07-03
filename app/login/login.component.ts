import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService, Roles } from '../shared/api.service';
import { AuthService } from '../shared/auth.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  userRole: string;
  role: string;
  fullname: string;
  password: string ='';
  errorMessage: string;
  loggedInUser: string;
  adminPhotoUrl: SafeResourceUrl;
passwordVisible: boolean = false;
  
  public loginForm !: FormGroup
  apiService: any;

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router, private api: ApiService, private authService: AuthService, private sanitizer: DomSanitizer) { 
    const imagePath = 'assets/loginn-logo.png';
    this.adminPhotoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(imagePath);
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
  
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  login(){
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.http.get<any>("http://localhost:3000/signupUsers")
    .subscribe(res=>{
      const response=res.find((user)=>
        user.fullname === this.fullname && user.password === btoa(this.password) 
      );
      console.log(response);
     
      if(response){
        console.log(response);
        sessionStorage.setItem('userRole', response.role);
        sessionStorage.setItem('fullname', response.fullname);
        if(response.role === '01'){
        this.router.navigate(['/dashboard']);
        alert("Logged in as Admin");
      } 
      else if (response.role === '02'){
        this.router.navigate(['/dashboard']);
        alert("Logged in as Teacher");
      } 
      else if (response.role === '03'){
        this.router.navigate(['/dashboard']);
        alert("Logged in as Student");
      } else {
        console.log('Invalid credentials');
        alert("user not found!!");
        this.loginForm.reset();
      }}
      else{
        alert("Please enter full name and password")
      }
      
  })
  }
}