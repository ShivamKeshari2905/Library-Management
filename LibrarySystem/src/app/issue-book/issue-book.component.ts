import { Component, OnInit } from '@angular/core';
import { Book } from '../model/book.model';
import { UserService } from '../services/user.service';
import { UtilityService } from '../services/utility.service';

export interface IbooksIssued {
  borrowdate: string,
  _id: Book
}

export interface IbooksIssuedResponse {
  borrows: IbooksIssued,
  _id: string
}

@Component({
  selector: 'app-issue-book',
  templateUrl: './issue-book.component.html',
  styleUrls: ['./issue-book.component.scss']
})



export class IssueBookComponent implements OnInit {

  issuedBooks!: IbooksIssued[];
  userId: string = this.utilityService.getUserDetail().id;
  params: any;

  constructor(public utilityService: UtilityService, public userService: UserService) {

    this.userService.getIssuedBook(this.userId).subscribe(
      (data: any) => {
        const { borrows = {} } = data;
        console.log(borrows);
        this.issuedBooks = borrows;
      },
      error => {
        console.log(error);
      });
  }

  ngOnInit(): void {
  }

  getDateString(date: string) {
    return new Date(date).toLocaleDateString();
  }

}
