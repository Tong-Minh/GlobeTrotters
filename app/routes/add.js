import Route from '@ember/routing/route';
import { service } from '@ember/service';
export default class AddRoute extends Route {
  @service helpers;
  @service firebase;
  @service auth;
  @service router;
  resetController(controller, isExiting) {
    if (isExiting) {
      controller.set('tags', []);
      controller.set('people', []);
    }
  }

  async beforeModel() {
    await this.auth.ensureInitialized();
    if (!this.auth.user) {
      this.router.transitionTo('application');
    }
  }

  model(params) {
    let isUs = false;
    let twoletter = this.helpers.getStateAbbreviation(params.location);
    if (twoletter) {
      isUs = true;
      return { location: params.location, inUS: isUs, two: twoletter };
    } else {
      twoletter = this.helpers.getCountryAbbreviation(params.location);

      return { location: params.location, inUS: isUs, two: twoletter };
    }
  }
}
