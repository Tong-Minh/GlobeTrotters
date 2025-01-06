import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
export default class TripRoute extends Route {
  @service firebase;
  @service auth;
  @service router;

  async beforeModel() {
    await this.auth.ensureInitialized();
    if (!this.auth.user) {
      this.router.transitionTo('application');
    }
  }

  async model(params) {
    let trip = await this.firebase.getSpecificTrip(params.trip_id);

    await this.firebase.getAllTripsUser();
    await this.firebase.getAllPeopleUser();

    const allPeople = this.firebase.userPeople;

    trip.startDateInput = trip.startDate.toDate().toISOString().split('T')[0];
    trip.startDate = trip.startDate.toDate().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    trip.endDateInput = trip.endDate.toDate().toISOString().split('T')[0];
    trip.endDate = trip.endDate.toDate().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    console.log('Trip:', trip);
    return { trip, allPeople };
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    controller.set('trip', model.trip);
    controller.set('editing', false);
    controller.set('allPeople', model.allPeople);
    controller.set('editPeople', model.trip.people);
    controller.set('editTags', model.trip.tags);
    controller.set('editPhotos', model.trip.photos);
    controller.set('addedPhotos', []);
    controller.set('renderedAddedPhotos', []);
    controller.set('removedPhotos', []);
  }
}
