import Route from '@ember/routing/route';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { scheduleOnce } from '@ember/runloop';
import { states } from '../data/states.js';
import { countries } from '../data/countries.js';

export default class AddStateRoute extends Route {
  // will add 50 states. is this how we want to do this?
  // import from file maybe to clean this up? store elsewhere?
  @service firebase;
  @service auth;
  @service router;

  async beforeModel() {
    await this.auth.ensureInitialized();
    if (!this.auth.user) {
      this.router.transitionTo('application');
    }
  }

  @tracked states = states;
  @tracked countries = countries;

  model() {}

  setupController(controller) {
    super.setupController(...arguments);
    controller.set('states', this.states);
    controller.set('countries', this.countries);
  }
}
