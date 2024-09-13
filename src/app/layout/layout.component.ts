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
import { NgxImageCompressService, UploadResponse } from 'ngx-image-compress';
import { AiService } from '../services/ai.service';

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
        this.postService.posts.update((values) => {
          values.unshift(post);
          return values;
        });
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
    MatIconModule,
  ],
  template: `
    <h4 mat-dialog-title>Create new post</h4>
    <mat-divider></mat-divider>
    <mat-dialog-content>
      <form [formGroup]="postFrom">
        <div>
          <button
            mat-stroked-button
            color="primary"
            (click)="uploadAndResize()"
          >
            <mat-icon>upload_file</mat-icon>
            Upload images
          </button>
          <div class="uploaded_images">
            <mat-divider></mat-divider>
            @for (image of images(); track $index) {
            <img [src]="image" width="50" height="45" />
            }
          </div>
        </div>
        <div>
          <mat-form-field>
            <mat-label>Description</mat-label>
            <textarea
              matInput
              rows="10"
              placeholder="Add a description to the post"
              formControlName="description"
            ></textarea>
          </mat-form-field>
        </div>
      </form>
      @if (this.postFrom.value.files && this.postFrom.value.files.length > 0) {
      <div class="actions">
        <mat-divider></mat-divider>
        <button mat-stroked-button color="accent" (click)="generateCaption()">
          <mat-icon>scatter_plot</mat-icon>
          Generate image caption
        </button>
      </div>
      }
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
    form{
      display: flex;
      align-items: center;
      button{
        width: 100%;
        margin-right: 10px;
      }
      .uploaded_images{
        margin-top: 5px;
        img{
          margin-right: 2px;
        }
      }

      div:first-child{
        margin-right: 5px;
      }
    }
    .actions{
      margin-top: -15px;
      text-align: center;
      button{
        margin-top: 5px;
      }
    }
  `,
})
export class DialogForPostCreation {
  onShared = output();
  postFrom = new FormGroup({
    files: new FormControl<File[] | null>([], [Validators.required]),
    description: new FormControl(''),
  });
  images = signal<string[]>([]);

  constructor(
    public dialogRef: MatDialogRef<DialogForPostCreation>,
    private imageCompress: NgxImageCompressService,
    private aiService: AiService
  ) {}

  save(event: Event) {
    event.preventDefault();
    if (this.postFrom.invalid) return;
    this.onShared.emit();
  }

  uploadAndResize() {
    return this.imageCompress
      .uploadMultipleFiles()
      .then((uploadResponses: UploadResponse[]) => {
        return uploadResponses.map((uploadResponse) => {
          return this.imageCompress.compressFile(
            uploadResponse.image,
            uploadResponse.orientation,
            50,
            80,
            500,
            500
          );
        });
      })
      .then((results) => {
        Promise.all(results).then((imagesBase64) => {
          this.images.set(imagesBase64);
          const files = imagesBase64.map((imageBase64, index) =>
            this.base64ToFile(imageBase64, `image${index + 1}.jpeg`)
          );
          this.postFrom.patchValue({ files });
        });
      });
  }

  base64ToFile(base64String: string, fileName: string): File {
    // Extract the MIME type and Base64 data from the string
    const arr = base64String.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    // Create a Blob from the Uint8Array
    const blob = new Blob([u8arr], { type: mime });

    // Convert Blob to File
    return new File([blob], fileName, { type: mime });
  }

  generateCaption() {
    const files = this.postFrom.value.files;
    if (!files) return;
    this.aiService
      .generateImageCaption(files[0])
      .subscribe((caption) =>
        this.postFrom.patchValue({ description: caption })
      );
  }
}
