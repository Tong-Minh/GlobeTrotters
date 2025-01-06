import Route from '@ember/routing/route';
import { achievements } from '../data/achievements.js';
import { service } from '@ember/service';

export default class AchievementsRoute extends Route {
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
    return {
      achievementCount: await this.firebase.getVisits(),
      achievements: achievements,
    };
  }
}
