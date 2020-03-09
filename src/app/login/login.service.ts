import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtRequest } from './jwt/jwt-request';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  // private baseUrl: any = 'https://luxtestjcs-luxadmin.gbcom-south-1.oraclecloud.com/payroll-admin';
  private baseUrl: any = 'http://localhost:8086/payroll-admin';

  constructor(private httpClient: HttpClient) { }

  authenticate(jwtRequest: JwtRequest){
    return this.httpClient.post(this.baseUrl+'/authenticate', jwtRequest);
  }
}
