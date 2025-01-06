import EmberRouter from '@ember/routing/router';
import config from 'globe-trotter/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('visited');
  this.route('add-state');
  this.route('add', { path: '/add/:location' });
  this.route('add-success');
  this.route('add-failure');
  this.route('timeline');
  this.route('achievements');
  this.route('trip', { path: '/trip/:trip_id' });
  this.route('not-found', { path: '/*' });
});
