import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { IbooksIssued } from '../issue-book/issue-book.component';

export interface IUserDetails {
  accessToken: string;
  authorization: boolean;
  borrows: IbooksIssued[];
  email: string;
  id: string;
  roles: string[];
  username: string;
}
@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  redirectUrl: string;
  loginStatus: EventEmitter<boolean> = new EventEmitter<boolean>();
  roles: any;

  constructor(private router: Router) {
    this.redirectUrl = '';
    this.roles = '';
  }

  public getToken() {
    console.log('trying to get token');
    return sessionStorage.getItem('acess_token');
  }

  public getUserDetail() {
    let user_details = sessionStorage.getItem('user_details');
    if (user_details) {
      return JSON.parse(user_details);
    } else {
      return null;
    }
  }

  public updateUserBorrowedBooks(issuedBook: any, callback: () => void) {
    let user_details = sessionStorage.getItem('user_details');
    if (user_details) {
      const userDetails:IUserDetails = JSON.parse(user_details);
      userDetails.borrows.push(issuedBook);
      sessionStorage.setItem('user_details', JSON.stringify(userDetails));
      console.log('-Updated user details!');
      callback();
    }
  }

  public setToken(data: any) {
    sessionStorage.setItem('acess_token', data.accessToken);
    sessionStorage.setItem('user_details', JSON.stringify(data));
    this.updateRoles();
  }

  checkIfTokenExist(): boolean {
    return !!sessionStorage.getItem('acess_token');
  }

  public logout(): void {
    this.redirectUrl = document.location.pathname;
    sessionStorage.removeItem('acess_token');
    sessionStorage.removeItem('user_details');
    this.router.navigate(['']);
    this.loginStatus.emit(false);
    this.updateRoles();
  }

  public updateRoles() {
    let v = sessionStorage.getItem('user_details');
    let a = null;
    if (v && v !== null) {
      a = JSON.parse(v);
    } else {
      a = null;
      this.roles = [];
      return;
    }
    if (a.roles) {
      this.roles = a.roles;
    }
  }
  public isAdmin() {
    if (this.roles?.includes('ROLE_ADMIN')) return true;
    return false;
  }
  public isUser() {
    if (this.roles?.includes('ROLE_USER')) return true;
    return false;
  }
}
