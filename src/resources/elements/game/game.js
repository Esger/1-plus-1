import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { DragService } from 'resources/services/drag-service';
import { ScoreService } from 'resources/services/score-service';

@inject(DragService, ScoreService, EventAggregator)
export class GameCustomElement {

    constructor(dragService, scoreService, eventAggregator) {
        this.dragService = dragService;
        this._eventAggregator = eventAggregator;
        this._scoreService = scoreService;
        this._resetScore();
    }

    attached() {
        this.highScore = this._scoreService.getScore();
        this._highSubscription = this._eventAggregator.subscribe('high', value => {
            if (value > this.highScore) {
                this.highScore = value;
                this._scoreService.saveScore(value);
            }
            this.title = value + '+' + value;
        });
        this._moveSubscription = this._eventAggregator.subscribe('moves', moves => {
            this.moves = moves.moves;
            this.canUndo = moves.moves > 0;
        })
        this._resetScoreSubscription = this._eventAggregator.subscribe('reset-score', _ => {
            this._resetScore();
        });
    }

    _resetScore() {
        this.title = '1+1';
        this.canUndo = false;
    }

    undo() {
        this._eventAggregator.publish('undo');
        this.canUndo = false;
    }

    restart() {
        this._eventAggregator.publish('restart');
    }

    detached() {
        this._highSubscription.dispose();
        this._moveSubscription.dispose();
        this._resetScoreSubscription.dispose();
    }

}
