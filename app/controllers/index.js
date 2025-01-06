import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
export default class IndexController extends Controller {
  @service auth;
  @service router;

  @action
  async signInWithGoogle() {
    try {
      await this.auth.sign_in_with_popup();
      this.router.transitionTo('visited');
    } catch (error) {
      console.error('Login failed', error);
    }
  }
}
