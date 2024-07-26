import { Component, input } from '@angular/core';
import { Comment } from '../../models/Comment';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [MatCardModule],
  template: `
    <div class="comment">
      <div mat-card-avatar>
        <img
          [src]="comment()?.user?.userImageUrl"
          onerror="this.src='assets/default-user.jpeg'"
          alt="User picture that belong the comment"
        />
      </div>
      <p>
        <b>{{ comment()?.user?.name }}</b> {{ comment()?.content }}
      </p>
    </div>
  `,
  styles: `
    .comment{
      display: flex;
      align-items: center;
      div {
        overflow: hidden;
        margin-buttom: 0px;
        margin-right: 5px;
      }
      img {
        max-width: 100%;
        height: 100%;
      }
    }
  `,
})
export class CommentComponent {
  comment = input<Comment>();
}
