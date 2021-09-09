import { Component, OnInit } from '@angular/core';
import { Book } from '../model/book.model';
import { BookService } from '../services/book.service';
import { GridApi, ColumnApi } from 'ag-grid-community';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { ButtonRendererComponent } from '../button-renderer/button-renderer.component';
import { UtilityService } from '../services/utility.service';
import { IbooksIssued } from '../issue-book/issue-book.component';
import { UserService } from '../services/user.service';

declare var $: any;
@Component({
  selector: 'app-books-table',
  templateUrl: './books-table.component.html',
  styleUrls: ['./books-table.component.scss'],
})
export class BooksTableComponent implements OnInit {
  private api!: GridApi;
  private columnApi!: ColumnApi;
  rowSelection: any;
  frameworkComponents: any;
  books?: Book[];
  isAdmin: Boolean = this.utilityService.isAdmin();
  alreadyIssueBooks: IbooksIssued[] | undefined;

  columnDefs = [
    {
      headerName: 'Book',
      field: 'title',
      sortable: true,
      filter: true,
      editable: this.isAdmin,
      checkboxSelection: this.isAdmin,
      suppressSizeToFit: true
    },
    {
      headerName: 'Author',
      field: 'author',
      sortable: true,
      filter: true,
      editable: this.isAdmin,
      suppressSizeToFit: true
    },
    {
      headerName: 'Quantity',
      field: 'quantity',
      sortable: true,
      filter: true,
      editable: this.isAdmin,
      suppressSizeToFit: true
    },
    {
      headerName: 'Category',
      field: 'category',
      sortable: true,
      filter: true,
      editable: this.isAdmin,
      suppressSizeToFit: true,
    },
    {
      headerName: 'Date',
      field: 'createdAt',
      sortable: true,
      filter: true,
      suppressSizeToFit: true,
      cellRenderer: (data: any) => {
        return moment(data.createdAt).format('DD/MMM/YYYY');
      },
    },
    this.isAdmin && {
      headerName: 'Action',
      cellRenderer: 'buttonRenderer',
      suppressSizeToFit: true,
      cellRendererParams: {
        onClick: this.onEditButtonClick.bind(this),
        label: 'Edit',
      },
    },
    this.isAdmin && {
      headerName: 'Update',
      cellRenderer: 'buttonRenderer',
      suppressSizeToFit: true,
      cellRendererParams: {
        onClick: this.onSaveButtonClick.bind(this),
        label: 'Update',
      },
    },
    !this.isAdmin && {
      headerName: 'Issue Book',
      cellRenderer: 'buttonRenderer',
      suppressSizeToFit: true,
      cellRendererParams: {
        onClick: this.onIssueButtonClick.bind(this),
        label: 'Issue Book',
        isAlreadyIssued: this.isBookAlreadyIssued.bind(this),
        isUser: true
      },
    },
  ];

  constructor(
    private bookService: BookService,
    private userService: UserService,
    private router: Router,
    public utilityService: UtilityService
  ) {
    this.rowSelection = 'multiple';
    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent,
    };
    this.getListOfAlreadyIssuedBooks();
    console.log('----user details ?', this.alreadyIssueBooks);    
  }

  ngOnInit(): void {
    this.isAdmin = this.utilityService.isAdmin();
    console.log(this.isAdmin, this.utilityService.isAdmin());
    this.retrieveBooks();
  }

  retrieveBooks(): void {
    this.bookService.getAll().subscribe(
      (data) => {
        this.books = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  deleteBook(): void {
    var selectedRowData = this.api.getSelectedRows();
    if (this.api.getSelectedRows().length == 0) {
      alert('Please Select any book to delete');
    }
    this.api.applyTransaction({ remove: selectedRowData });
    this.bookService.delete(selectedRowData[0].id).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onGridReady(params: any): void {
    this.api = params.api;
    this.columnApi = params.columnApi;
    this.api.sizeColumnsToFit();
  }

  onRowValueChanged(event: any) {
    console.log(event);
    let data: Book = event.data;
    console.log(data);
    this.bookService.update(data.id, data).subscribe(
      (data) => {
        console.log(data);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onEditButtonClick(params: any) {
    this.api.startEditingCell({
      rowIndex: params.rowIndex,
      colKey: 'title',
    });
  }

  onSaveButtonClick(params: any) {
    //this.router.navigate(['/issueBook']);
    this.api.stopEditing();
  }

  onIssueButtonClick(params: any) {
    const data: { id: string } = params.data;
    console.log('----params', params);
    const isLimitReached = this.alreadyIssueBooks?.length;
    if (isLimitReached === 3) {
      // show alert
      $('#toast-issue-limit-reached').toast('show');
      this.api.refreshCells();
    } else {
      // update user call
      console.log('---', data);
      const currentDate = new Date();
      const borrowDate = new Date(currentDate.getTime());
      const submissiondate = new Date(currentDate.setDate(currentDate.getDate() + 15))
      const book = {
        _id: data.id,
        borrowdate: borrowDate.toISOString(),
        submissiondate: submissiondate
      };
      const payload = {
        id: this.utilityService.getUserDetail().id,
        book: book,
      };
      console.log(payload);
      this.userService.issueNewBook(payload).subscribe(
        (data) => {
          console.log('-Response from Update User', data);
          this.utilityService.updateUserBorrowedBooks(book, this.getListOfAlreadyIssuedBooks);
          $('#toast-issue-success').toast('show');
          this.api.applyTransaction(params.node);
          window.location.reload();
        },
        (err) => {
          console.log('-Error from update User', err);
          $('#toast-issue-error').toast('show');
        }
      );
    }
  }

  isBookAlreadyIssued(currentBookId: any) {
    const matchedList = this.alreadyIssueBooks?.filter((book) => {
      const bookId = book._id;
      if (currentBookId === bookId) {
        return true;
      }
      return false;
    });
    if (matchedList) {
      return matchedList?.length > 0;
    } else return false;
  }

  getListOfAlreadyIssuedBooks = () => {
    this.alreadyIssueBooks = this.utilityService.getUserDetail().borrows;
  }
}
