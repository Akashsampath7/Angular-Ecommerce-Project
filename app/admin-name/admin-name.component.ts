import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-admin-name',
  templateUrl: './admin-name.component.html',
  styleUrls: ['./admin-name.component.css']
})
export class AdminNameComponent implements OnInit {
//adminName: string;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    //this.adminName = this.authService.getAdminName();
  }
}