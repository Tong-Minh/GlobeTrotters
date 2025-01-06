import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class AddStateController extends Controller {
  @service router;
  @tracked search = '';
  @tracked filteredStates = this.states;
  @tracked filteredCountries = this.countries;
  @tracked isUnitedStates = true;

  @action
  updateSearch(event) {
    this.search = event.target.value;
    const searchBody = document.getElementById('searchBody');

    if (this.search) {
      searchBody.classList.remove('hidden');

      this.filteredStates = this.states.filter((state) =>
        state.name.toLowerCase().includes(this.search.toLowerCase()),
      );
      this.filteredCountries = this.countries.filter((countries) =>
        countries.name.toLowerCase().includes(this.search.toLowerCase()),
      );
    } else {
      searchBody.classList.add('hidden');
      this.filteredStates = this.states;
      this.filteredCountries = this.countries;
    }
  }

  @action
  toggle() {
    this.set('isUnitedStates', !this.isUnitedStates);
    const element = document.getElementById('currentLocation');
    element.innerText = 'None';
    this.selectedLocation = null;
  }

  @action
  getName(event) {
    console.log(event.target.id);
    this.router.transitionTo('add', event.target.id);
  }
}
