import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { Game } from 'src/app/models';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit, OnDestroy {
  gameRating = 0;
  gameId: number;
  game: Game | undefined;
  routeSub: Subscription;
  gameSub: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private httpService: HttpService
  ) {}

  ngOnInit() {
    this.routeSub = this.activatedRoute.params.subscribe((params: Params) => {
      this.gameId = params['id'];
      this.getGameDetails(this.gameId);
    });
  }
  getGameDetails(gameId: number) {
    this.gameSub = this.httpService
      .getGameDetails(gameId)
      .subscribe((gameResp: Game) => {
        this.game = gameResp;
        setTimeout(() => {
          if (typeof this.game?.metacritic !== 'undefined')
            this.gameRating = this.game?.metacritic;
        }, 1000);
      });
  }

  getColor(value: number) {
    if (value > 75) {
      return '#5ee432';
    } else if (value > 50) {
      return '#fffa50';
    } else if (value > 30) {
      return '#f7aa38';
    } else {
      return '#ef4655';
    }
  }

  ngOnDestroy(): void {
    if (this.gameSub) {
      this.gameSub.unsubscribe();
    }

    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
}
