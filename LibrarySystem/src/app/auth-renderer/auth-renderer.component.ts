import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-auth-renderer',
  templateUrl: './auth-renderer.component.html',
  styleUrls: ['./auth-renderer.component.scss']
})
export class AuthRendererComponent implements ICellRendererAngularComp  {

  params: any;
  label!: string;

  constructor() { }

  agInit(params: any): void {
    this.params = params;
    this.label = this.params.label || null;
  }

  refresh(params?: any): boolean {
    return true;
  }

  onClick($event: any) {
    if (this.params.onClick instanceof Function) {
      // put anything into params u want pass into parents component
      const params = {
        event: $event,
        rowData: this.params.node.data
        // ...something
      }
      this.params.onClick(this.params);
    }
  }


}
