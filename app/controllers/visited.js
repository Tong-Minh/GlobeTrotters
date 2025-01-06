import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class VisitedController extends Controller {
  @service firebase;
  @service auth;
  @service router;

  @action
  async addVisit() {
    this.router.transitionTo('add-state');
  }

  @action
  exitAchieve() {
    // Exiting an achievement milestone popup screen.
    const containerElement = document.getElementById('achievement-container');
    containerElement.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }
}
