import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http'
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  //
  loggedInEmail: string;
  isAuthenticated: any;
  localStorage: any;
  API_URL: "http://localhost:3000/posts/";

  constructor(private http: HttpClient) { }
  
  getRoledetails(id: number){
    return this.http.get<any>("http://localhost:3000/signupUsers/"+id)
    .pipe(map((res:any)=>{
      return res;
    }))
  }

  getRoles(){
    return this.http.get<any>("http://localhost:3000/signupUsers/")
    .pipe(map((res:any)=>{
      return res;
    }))
  }

  postEmployee(data: any){
    return this.http.post<any>("http://localhost:3000/posts/", data)
    .pipe(map((res:any)=>{
      return res;
    }))
  }
  getEmployee(){
    return this.http.get<any>("http://localhost:3000/posts/")
    .pipe(map((res:any)=>{
      return res;
    }))
  }
  updateEmployee(id: number, data: any){
    return this.http.put<any>("http://localhost:3000/posts/"+id, data)
    .pipe(map((res:any)=>{
      return res;
    }))
  }
  deleteEmployee(id: number){
    return this.http.delete<any>("http://localhost:3000/posts/"+id)
    .pipe(map((res:any)=>{
      return res;
    }))
  }
  getUserRole(): string {
    return localStorage.getItem('userRole') || '';
  }

  isAdmin(): boolean {
    return this.localStorage.getItem() === 'userRole';
  }

  isTeacher(): boolean {
    return this.getUserRole() === Roles.STUDENT;
  }

  isStudent(): boolean {
    return this.getUserRole() === Roles.STUDENT;
  }
  
  //
  setLoggedInEmail(email: string): void {
    this.loggedInEmail = email;
  }

  getLoggedInEmail(): string {
    return this.loggedInEmail;
  }
  getEmployeeById(employeeId: string): Observable<any> {
    const url = `${"http://localhost:3000/posts"}/${employeeId}`;
    return this.http.get(url);
  }
  
}

// roles.ts
export enum Roles {
  ADMIN = 'Admin',
  TEACHER = 'Teacher',
  STUDENT = 'Student'
}

