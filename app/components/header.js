import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class HeaderComponent extends Component {
  @service auth;
  @service router;
  @tracked open = false;

  @action
  toggleMenu() {
    console.log('Toggling menu');
    if (this.open) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
    this.open = !this.open;
  }

  openMenu() {
    let dropdown = document.getElementById('dropdown');
    dropdown.classList.remove('hidden');
  }

  closeMenu() {
    let dropdown = document.getElementById('dropdown');
    dropdown.classList.add('hidden');
  }

  @action
  transitionTo(routeName) {
    this.toggleMenu();
    this.router.transitionTo(routeName);
  }

  @action
  signOut() {
    this.auth.sign_out();
  }
}
