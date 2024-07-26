import {
  Component,
  OnInit,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { Post } from '../../models/Post';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { CarouselComponent } from '../carousel/carousel.component';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CommentForCreation } from '../../models/Comment';
import { PostService } from '../../services/post.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DialogPostDetailComponent } from '../dialog-post-detail/dialog-post-detail.component';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [
    MatCardModule,
    MatDivider,
    CarouselComponent,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.scss',
})
export class PostCardComponent implements OnInit {
  post = input<Post>();
  images = signal<string[]>([]);
  commentForm = new FormControl('');
  onLiked = output<string>();

  constructor(
    private service: PostService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.images.set(
      this.post()?.postAttachments.map((attch) => attch.url) || []
    );
  }

  addComment(event: Event) {
    event.preventDefault();
    if (this.commentForm.invalid) return;
    const body: CommentForCreation = {
      content: <string>this.commentForm.value,
    };
    this.service.addComment(<string>this.post()?.id, body).subscribe(() => {
      this.commentForm.reset();
      this.snackBar.open('Comment added✔️', undefined, {
        duration: 5000,
      });
    });
  }

  handleLike() {
    this.service.addOrRemoveLike(<string>this.post()?.id).subscribe(() => {
      this.onLiked.emit(<string>this.post()?.id);
    });
  }

  openDialog(){
    const dialogRef = this.dialog.open(DialogPostDetailComponent, {
      data: {
        id: <string>this.post()?.id,
        handleLike: this.handleLike,
        addComment: this.addComment,
        commentForm:this.commentForm,
      }
    });
  }
}
