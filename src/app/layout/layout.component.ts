import { Component, HostListener, OnInit, output, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Observable, map, of, startWith } from 'rxjs';
import {
  MatDialog,
  MatDialogActions,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { PostService } from '../services/post.service';
import { PostForCreation } from '../models/Post';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatAutocompleteModule,
    AsyncPipe,
    RouterOutlet,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnInit {
  searchField = new FormControl('');
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]> = of([]);
  desktopSize = signal<boolean>(window.innerWidth >= 1024);

  constructor(
    private postService: PostService,
    public postCreationDialog: MatDialog
  ) {}

  ngOnInit() {
    this.filteredOptions = this.searchField.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    if (window.innerWidth >= 1024) {
      this.desktopSize.set(true);
    } else if (this.desktopSize()) {
      this.desktopSize.set(false);
    }
  }

  openPostCreationDialog() {
    const dialogRef = this.postCreationDialog.open(DialogForPostCreation);
    dialogRef.componentInstance.onShared.subscribe(() => {
      const value = dialogRef.componentInstance.postFrom.value;
      const data: PostForCreation = {
        files: value.files || [],
        description: value.description || '',
      }
      this.postService.post(data).subscribe(post => {
        console.log(post);
      })
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }
}

@Component({
  selector: 'dialog-post-creation',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatDividerModule,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
  ],
  template: `
    <h4 mat-dialog-title>Create new post</h4>
    <mat-divider></mat-divider>
    <mat-dialog-content>
      <form [formGroup]="postFrom">
        <input
          type="file"
          placeholder="Drag a photo here.."
          aria-label="Select a photo"
          (change)="onFileChange($event)"
          multiple
        />

        <mat-form-field>
          <mat-label>Description</mat-label>
          <textarea
            matInput
            rows="10"
            placeholder="Add a description to the post"
            formControlName="description"
          ></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-divider></mat-divider>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button
        mat-button
        (click)="save($event)"
        [mat-dialog-close]="true"
        cdkFocusInitial
        [disabled]="postFrom.invalid"
      >
        Share
      </button>
    </mat-dialog-actions>
  `,
  styles: `
    h4 {
      margin: 0;
      text-align: center;
    }

    input {
      margin-bottom: 20px;
      text-align: center;
    }
  `,
})
export class DialogForPostCreation {
  onShared = output();
  postFrom = new FormGroup({
    files: new FormControl<File[] | null>([], [Validators.required]),
    description: new FormControl(''),
  });

  save(event: Event) {
    event.preventDefault();
    if (this.postFrom.invalid) return;
    this.onShared.emit();
  }

  onFileChange(event: any) {
    event.preventDefault();

    if (!event.target.files || event.target.files.length == 0) return;
    this.postFrom.patchValue({ files: event.target.files });
  }

  constructor(public dialogRef: MatDialogRef<DialogForPostCreation>) {}
}
