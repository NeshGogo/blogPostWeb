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
import { map, debounceTime } from 'rxjs';
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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { User } from '../models/User';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import imageCompression from 'browser-image-compression';

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
    MatSnackBarModule,
    MatDividerModule,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnInit {
  searchField = new FormControl('');
  options = signal<User[]>([]);
  desktopSize = signal<boolean>(window.innerWidth >= 1024);
  user = signal<User | null>(null);

  constructor(
    private postService: PostService,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private userService: UserService,
    public postCreationDialog: MatDialog
  ) {}

  ngOnInit() {
    this.searchField.valueChanges
      .pipe(
        debounceTime(500),
        map((value) => this._filter(value || ''))
      )
      .subscribe((obsUsers) => {
        obsUsers.subscribe((users) => {
          this.options.set(users);
        });
      });
    this.user = this.authService.user;
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
      };
      this.postService.post(data).subscribe((post) => {
        this.postService.posts.set([post, ...this.postService.posts()]);
        this.snackBar.open('Post published successfully', undefined, {
          duration: 5000,
        });
      });
    });
  }

  private _filter(value: string) {
    return this.userService.getUsers(value);
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
          accept="image/*"
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
    const files = event.target.files;
    //this.postFrom.patchValue({ files });
    this.compressImage(files).then((compressedFiles) => {
      this.postFrom.patchValue({ files: compressedFiles });
    });
  }

  async compressImage(files: File[]): Promise<File[]> {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      maxIteration: 10,
      initialQuality: 1,
      alwaysKeepResolution: true,
    };

    try {
      const result: File[] = [];
      for (let file of files) {
        const compressedFile = await imageCompression(file, options);
        result.push(new File([compressedFile], file.name, { type: file.type }));
      }
      return result;
    } catch (error) {
      console.error('Compression error:', error);
      throw error;
    }
  }

  constructor(public dialogRef: MatDialogRef<DialogForPostCreation>) {}
}
