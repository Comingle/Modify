import Toy from 'chrome-app/initializers/toy';

export function initialize(container, application) {
  application.register('service:toy', Toy, { singleton: true });
  application.inject('controller', 'toy', 'service:toy');
}

export default {
  name: 'toy',
  initialize: initialize
};
