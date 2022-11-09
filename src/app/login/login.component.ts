import { Component, OnInit} from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { NgModel } from '@angular/forms';
import { ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  providers: [AuthService]}
  )

export class LoginComponent {

password?: string ;
email?: string ;
@ViewChild("email") useremail!: ElementRef;
@ViewChild("password") userpassword!: ElementRef;

    constructor( private authService: AuthService, 
                 private router: Router) {

    }

    login() {
      console.log("email", this.useremail.nativeElement.value);
      console.log("password", this.userpassword.nativeElement.value);
      this.password = this.userpassword.nativeElement.value;
      this.email = this.useremail.nativeElement.value;
        if (this.email && this.password) {
            this.authService.login(this.email, this.password)
                .subscribe(
                    () => {
                        console.log("User is logged in");
                       // this.router.navigateByUrl('/');
                    }
                );
        }
    }
}