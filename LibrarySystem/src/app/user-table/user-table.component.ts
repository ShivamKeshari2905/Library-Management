import { Component, OnInit } from '@angular/core';
import { User } from '../model/user.model';
import { UserService } from '../services/user.service';
import { GridApi, ColumnApi } from 'ag-grid-community';
import { AuthRendererComponent } from '../auth-renderer/auth-renderer.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss']
})
export class UserTableComponent implements OnInit {

  users?: User[];
  private api!: GridApi;
  private columnApi!: ColumnApi;
  frameworkComponents: any;

  usercolumnDefs = [
    { headerName: 'Email', field: "email", filter: true },
    { headerName: 'Username', field: "username", filter: true },
    // { headerName: 'id', field: "_id", filter: true },
    { headerName: 'isAuthorized', field: "authorization", filter: true, editable: true },
    {
      'headerName': 'Action', cellRenderer: 'authRenderer',
      cellRendererParams: {
        onClick: this.onEditButtonClick.bind(this),
        label: 'Edit'
      }
    },
  ];

  constructor(private router: Router, private route: ActivatedRoute, private userService: UserService) {
    this.frameworkComponents = {
      authRenderer: AuthRendererComponent,
    }
  }

  ngOnInit(): void {
    this.retrieveUsers();
  }

  retrieveUsers(): void {
    this.userService.getAll()
      .subscribe(
        data => {
          this.users = data;
        },
        error => {
          console.log(error);
        });
  }

  onGridReady(params: any): void {
    this.api = params.api;
    this.columnApi = params.columnApi;
    this.api.sizeColumnsToFit();
  }

  onRowValueChanged(event: any) {
    console.log(event);
    let data: User = event.data;
    console.log(data);
    // const payLoad = {
    //   userId:data.id
    // }
    console.log(data._id);
    this.userService.updateAuth(data._id, data).subscribe(data => {
      console.log(data);
    },
      error => {
        console.log(error);
      });
  }

  onEditButtonClick(params: any) {
    this.api.startEditingCell({
      rowIndex: params.rowIndex,
      colKey: 'authorization',
    });
  }

}
