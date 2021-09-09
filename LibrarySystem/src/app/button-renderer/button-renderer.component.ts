import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-button-renderer',
  templateUrl: './button-renderer.component.html',
  styleUrls: ['./button-renderer.component.scss']
})
export class ButtonRendererComponent implements ICellRendererAngularComp {

  params: any;
  label!: string;
  isAlreadyIssued!: boolean;
  isUser!: boolean;

  constructor(public utilityService: UtilityService) { }

  agInit(params: any): void {
    this.params = params;
    this.label = this.params.label || null;
    this.isUser = this.params.isUser || false;
    if (this.isUser) {
      this.isAlreadyIssued = this.params.isAlreadyIssued(this.params.data.id);
      if (this.isAlreadyIssued) {
        this.label = 'Issued'
      }
    }
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
