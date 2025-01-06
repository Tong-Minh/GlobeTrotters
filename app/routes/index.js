import Route from '@ember/routing/route';
import { service } from '@ember/service';
export default class IndexRoute extends Route {
  @service firebase;
  @service auth;
  @service router;

  async beforeModel() {
    await this.auth.ensureInitialized();
    if (!this.auth.user) {
      this.router.transitionTo('application');
    } else {
      this.router.transitionTo('visited');
    }
  }

  activate() {
    super.activate();
    this.addBodyClass();
  }

  deactivate() {
    super.deactivate();
    this.removeBodyClass();
  }

  addBodyClass() {
    const body = document.querySelector('body');
    body.classList.add('index');
  }

  removeBodyClass() {
    const body = document.querySelector('body');
    body.classList.remove('index');
  }
}
