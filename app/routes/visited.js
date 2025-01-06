import Route from '@ember/routing/route';
import { states } from '../data/states.js';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { achievements, achievementNums } from '../data/achievements.js';

export default class VisitedRoute extends Route {
  @service firebase;
  @service auth;
  @service router;
  @tracked trips;

  async beforeModel() {
    await this.auth.ensureInitialized();
    if (!this.auth.user) {
      this.router.transitionTo('application');
    }
  }

  async model() {
    console.log(await this.firebase.getVisits());
    await this.firebase.getAllTripsUser();
    await this.firebase.getAllPeopleUser();
    this.trips = this.firebase.userTrips;

    console.log(this.trips.length);
    return this.trips;
  }
}
