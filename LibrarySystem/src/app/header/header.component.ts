import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AgeValidator } from '../custom-validators/age-validator';
import { UserService } from '../services/user.service';
import { UtilityService } from '../services/utility.service';
declare var $: any;

export let browserRefresh = false;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {
  userForm: FormGroup;
  isRegistrationError: boolean;
  isRegistrationSuccess: boolean;

  loginForm: FormGroup;
  isLoginError: boolean;
  public isLoginSuccess: boolean;

  lateSubmissionList!: any[];
  subscription: Subscription | undefined;

  constructor(private userService: UserService, public utilityService: UtilityService, private router: Router) {

    this.userForm = new FormGroup({
      firstName: new FormControl('', [Validators.required, Validators.minLength(5)]),
      date: new FormControl('', [Validators.required, AgeValidator]),
      email: new FormControl('', [Validators.required,
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      mobile: new FormControl('', [Validators.required, Validators.minLength(10), Validators.pattern("[0-9]{10}")]),
      password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern('(?=\\D*\\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}')]),
    });
    console.log(this.userForm.controls.date);
    this.isRegistrationError = false;
    this.isRegistrationSuccess = false;

    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required,
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern('(?=\\D*\\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}')]),
    });
    this.isLoginSuccess = false;
    this.isLoginError = false;

    this.subscription = router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        browserRefresh = !router.navigated;
        // console.log('browserRefreshed ?', browserRefresh);
        if (browserRefresh) {
          this.onWindowRefresh();
        }
      }
    });
  }

  SignUp(FormValues: any): void {
    console.log("Code Reached");
    this.isRegistrationError = false;
    this.isRegistrationSuccess = false;
    console.log(FormValues);
    this.userService.registerNewUser(FormValues).subscribe(data => {
      console.log(data);
      this.isRegistrationSuccess = true;
      this.userForm.reset();
    }, err => {
      console.log(err);
      this.isRegistrationError = true;
      this.userForm.reset();
    });
  }

  login(FormValues: any): void {
    console.log("Login", FormValues)
    this.userService.loginUser(FormValues).subscribe(data => {
      console.log(data);
      this.utilityService.setToken(data);
      this.isLoginSuccess = true;
      document.getElementById("myModalL")?.click();
      this.onWindowRefresh();
    }, err => {
      console.log(err);
      this.isLoginError = true;
    });
  }

  ngOnInit(): void {
    console.log('Page refreshed')
    this.utilityService.updateRoles();
    $("#myModalS").on('hide.bs.modal', () => {
      this.clearUserRegistrationForm();
    });
    $("#myModalL").on('hide.bs.modal', () => {
      this.clearLoginForm();
    });
  };

  public clearLoginForm(): void {
    this.loginForm.reset();
    this.isLoginSuccess = false;
    this.isLoginError = false;
  };

  public clearUserRegistrationForm(): void {
    this.isRegistrationSuccess = false;
    this.isRegistrationError = false;
    setTimeout(() => {
      this.userForm.reset();
    }, 200);
  }

  public closeloginModal(): void {
    console.log('Closing the login modal');
    document.getElementById("myModalL")?.click();
    this.loginForm.markAsPristine();
    this.loginForm.markAsUntouched();
    this.loginForm.updateValueAndValidity();
  };

  public closeRegModal(): void {
    console.log('Closing the reg modal');
    document.getElementById("myModalS")?.click();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  onWindowRefresh() {
    if (this.utilityService.isAdmin()) {
      this.fetchLateSubmissionList();
    }
  }

  fetchLateSubmissionList() {
    this.userService.getLateSubmissionList().subscribe((data) => {
      this.userService.updateLateSubmissionList(data as []);
      this.lateSubmissionList = data as [];
    }, (err) => console.log('error on reciving list', err));
  }
}
