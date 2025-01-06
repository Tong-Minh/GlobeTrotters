import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class TimelineRoute extends Route {
  @service firebase;
  @service auth;
  @service router;

  async beforeModel() {
    await this.auth.ensureInitialized();
    if (!this.auth.user) {
      this.router.transitionTo('application');
    }
  }
  async model() {
    await this.firebase.getAllTripsUser();
    let locations = this.firebase.userTrips.map((location) => {
      console.log('Location:', location);
      console.log('Location startDate:', location.startDate);
      console.log('Location endDate:', location.endDate);
      console.log('location people:', location.people);
      return {
        ...location,
        startDateObject: location.startDate.toDate(),
        startDate: location.startDate.toDate().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }), // Store as string for display
        endDateObject: location.endDate.toDate(),
        endDate: location.endDate.toDate().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }), // Store as string for display
      };
    });
    console.log(locations);
    return { locations };
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    controller.set('currentLocations', model.locations);
  }
}
