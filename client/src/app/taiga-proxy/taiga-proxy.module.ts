import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiInputModule, TuiSelectModule } from '@taiga-ui/kit';
import { TuiButtonModule, TuiDataListModule } from '@taiga-ui/core';


const exports = [
  CommonModule,
  TuiInputModule,
  TuiSelectModule,
  TuiDataListModule,
  TuiButtonModule,
];

@NgModule({
  declarations: [],
  exports,
})
export class TaigaProxyModule { }
