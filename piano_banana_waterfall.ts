import { AppComponent } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
  { path: 'community-connection', component: CommunityConnectionComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes
    )
  ],
  declarations: [
    AppComponent,
    CommunityConnectionComponent
  ],
  providers: []
})
export class AppModule {}

export class CommunityConnectionComponent {
  constructor() { }

  ngOnInit() {
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CommunityConnectionService {
  constructor(private http: HttpClient) { }

  public getCommunityConnections() {
    return this.http.get('/api/community-connection');
  }

  public saveCommunityConnection(data) {
    return this.http.post('/api/community-connection', data);
  }
}

@Component({
  selector: 'community-connection-container',
  template: `
    <div class="page-container">
      <div class="page-header">
        <h3>Community Connections</h3>
      </div>
      <div class="page-content">
        <community-connection-list
          [connections]="connections"
          (saveConnection)="saveConnection($event)"
          (editConnection)="editConnection($event)"
          (deleteConnection)="deleteConnection($event)">
        </community-connection-list>
      </div>
    </div>
  `
})

export class CommunityConnectionContainerComponent implements OnInit {

  connections: any[] = [];

  constructor(
    private communityConnectionService: CommunityConnectionService
  ) { }

  ngOnInit() {
    this.loadConnections();
  }

  loadConnections() {
    this.communityConnectionService.getCommunityConnections().subscribe(
      (connections: any) => {
        this.connections = connections;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  saveConnection(data) {
    this.communityConnectionService.saveCommunityConnection(data).subscribe(
      (connection: any) => {
        this.connections.push(connection);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  editConnection(data) {
    this.communityConnectionService.saveCommunityConnection(data).subscribe(
      (connection: any) => {
        let index = this.connections.findIndex(conn => conn.id === connection.id);
        this.connections[index] = connection;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  deleteConnection(connectionId) {
    let index = this.connections.findIndex(conn => conn.id === connectionId);
    this.connections.splice(index, 1);
  }

}

<div class="connection-list">
  <div class="connection" *ngFor="let connection of connections">
    <div class="name">
      {{ connection.name }}
    </div>
    <div class="actions">
      <button
        (click)="editConnection.emit(connection)">
        Edit
      </button>
      <button
        (click)="deleteConnection.emit(connection.id)">
        Delete
      </button>
    </div>
  </div>
  <div class="create-connection">
    <button (click)="createConnection.emit()">
      Create new Connection
    </button>
  </div>
</div>

@Component({
  selector: 'community-connection-list',
  templateUrl: './community-connection-list.component.html'
})
export class CommunityConnectionListComponent {

  @Input() connections: any[];
  @Output() createConnection = new EventEmitter();
  @Output() editConnection = new EventEmitter();
  @Output() deleteConnection = new EventEmitter();

  constructor() { }

}

<div class="create-connection-form">
  <form (ngSubmit)="onCreateConnection(createConnectionForm.value)">
    <div class="name">
      <input type="text" name="name" [(ngModel)]="connection.name" #name="ngModel" required />
      <div class="error" *ngIf="name.invalid && name.dirty">
        Name is required
      </div>
    </div>
    <div class="actions">
      <button type="submit" [disabled]="createConnectionForm.invalid">Save</button>
    </div>
  </form>
</div>

@Component({
  selector: 'community-connection-create',
  templateUrl: './community-connection-create.component.html'
})
export class CommunityConnectionCreateComponent implements OnInit {

  connection: any = {};

  @ViewChild('createConnectionForm') createConnectionForm;

  @Output() saveConnection: EventEmitter<any> = new EventEmitter();
  @Output() cancel: EventEmitter<void> = new EventEmitter();

  constructor(
    private communityConnectionService: CommunityConnectionService
  ) { }

  ngOnInit() {
  }

  onCreateConnection(data) {
    this.communityConnectionService.saveCommunityConnection(data).subscribe(
      (connection: any) => {
        this.saveConnection.emit(connection);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  cancelCreateConnection() {
    this.cancel.emit();
  }

}

@Component({
  selector: 'community-connection',
  templateUrl: './community-connection.component.html'
})
export class CommunityConnectionComponent {

  @Input() connection: any;
  @Output() saveConnection: EventEmitter<any> = new EventEmitter();
  @Output() cancel: EventEmitter<void> = new EventEmitter();

  constructor(
    private communityConnectionService: CommunityConnectionService
  ) { }

  onSaveConnection(data) {
    this.communityConnectionService.saveCommunityConnection(data).subscribe(
      (connection: any) => {
        this.saveConnection.emit(connection);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  cancelEditConnection() {
    this.cancel.emit();
  }

}

<div class="edit-connection-form">
  <form (ngSubmit)="onSaveConnection(editConnectionForm.value)">
    <div class="name">
      <input type="text" name="name" [(ngModel)]="connection.name" #name="ngModel" required />
      <div class="error" *ngIf="name.invalid && name.dirty">
        Name is required
      </div>
    </div>
    <div class="actions">
      <button type="submit" [disabled]="createConnectionForm.invalid">Save</button>
      <button type="button" (click)="cancelEditConnection()">Cancel</button>
    </div>
  </form>
</div>

@Component({
  selector: 'community-connection-edit',
  templateUrl: './community-connection-edit.component.html'
})
export class CommunityConnectionEditComponent implements OnInit {

  @Input() connection: any;
  @ViewChild('editConnectionForm') editConnectionForm;

  @Output() saveConnection: EventEmitter<any> = new EventEmitter();
  @Output() cancel: EventEmitter<void> = new EventEmitter();

  constructor(
    private communityConnectionService: CommunityConnectionService
  ) { }

  ngOnInit() {
  }

  onSaveConnection(data) {
    this.communityConnectionService.saveCommunityConnection(data).subscribe(
      (connection: any) => {
        this.saveConnection.emit(connection);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  cancelEditConnection() {
    this.cancel.emit();
  }

}