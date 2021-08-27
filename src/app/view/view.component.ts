import { Component, Directive, EventEmitter, Input, Output, QueryList, ViewChildren, OnInit  } from '@angular/core';

import { OwnerService } from '../_services/owner.service'

interface Country {
  id: number;
  name: string;
  created_at: string;
  is_active: number;
  email: number;
}

export type SortColumn = keyof Country | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: {[key: string]: SortDirection} = { 'asc': 'desc', 'desc': '', '': 'asc' };

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

export interface SortEvent {
  column: SortColumn;
  direction: SortDirection;
}

@Directive({
  selector: 'th[sortable]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})

export class NgbdSortableHeader {

  @Input() sortable: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({column: this.sortable, direction: this.direction});
  }
}


@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  users;
  selected;
  page = 1;
  pageSize = 2;
  collectionSize = 0;
  selected_owner;

  constructor(private ownerService:OwnerService) { }

  ngOnInit(): void {
    this.pageSwitch()
  }

  onCreate(evt){
    console.log(evt)
    this.users.owner_list.push(evt)
  }

  onView(id) {
    this.ownerService.view(id).subscribe(x=>{
      this.selected_owner = x
    })
  }

  pageSwitch(page = 1) {
    // this.selected = page;
    this.ownerService.list(page).subscribe(x=>{
      this.users = x
      this.pageSize = x.owner_list.length
      this.collectionSize = x.page_count * this.pageSize
      // this.page = x.page
    })
  }

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  onSort({column, direction}: SortEvent) {

    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    // sorting countries
    if (direction === '' || column === '') {
      const user:Country[] = this.users.owner_list;
    } else {
      this.users.owner_list = [...this.users.owner_list].sort((a, b) => {
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }
}
