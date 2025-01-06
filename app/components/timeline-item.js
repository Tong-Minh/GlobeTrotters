import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class TimelineItemComponent extends Component {
  @service router;

  @action
  routeTrip(id) {
    this.router.transitionTo('trip', id);
  }
}
