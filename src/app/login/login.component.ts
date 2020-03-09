import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { JwtRequest } from './jwt/jwt-request';
import { JwtResponse } from './jwt/jwt-response';
import { routerTransition } from '../router.animations';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit {
    constructor(
      public router: Router,
      public loginService: LoginService
    ) {}

    ngOnInit() {}

    onLoggedin() {
        sessionStorage.setItem('isLoggedin', 'true');
        this.getJwtFromAdmin();

    }

    getJwtFromAdmin(){
      let jwtRequest = new JwtRequest();
      jwtRequest.username = "pclient";
      jwtRequest.password =  "password";
      this.loginService.authenticate(jwtRequest).subscribe((data: JwtResponse)=>{
        console.log(data.token);
        sessionStorage.setItem('jwtToken', data.token);
      },
      error => {
          console.log( [error.data.message] );
      } );
    }
}
