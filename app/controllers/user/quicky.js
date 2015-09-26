import Ember from 'ember';
import PatternUpdaterMixin from '../../mixins/pattern-updater';

export default Ember.Controller.extend(PatternUpdaterMixin, {
  quantity: 10,

  makeActive: function (selectedPattern) {
    this.get('model').setEach('active', false);
    selectedPattern.set('active', true);
  },

  // reject all patterns not found in config
  // ie: only show our patterns specified in config
  currentPatterns: function() {
    let configPatterns = this.get('toy.config.pattern');
    if (configPatterns) {
      let patternNames = Object.keys(configPatterns);
      return this.get('model').reject(function(item, index, en) {
        return patternNames.indexOf(item.get('name')) < 0;
      });
    } else {
      return this.get('model').reject(function() {
        return true;
      });
    }
  }.property('toy.config.pattern'),

  // filter all patterns not found in config
  // ie: only show patterns NOT specified in config
  extraPatterns: function() {
    let configPatterns = this.get('toy.config.pattern');
    if (configPatterns) {
      let patternNames = Object.keys(configPatterns);
      return this.get('model').filter(function(item, index, en) {
        return patternNames.indexOf(item.get('name')) < 0;
      });
    } else {
      return this.get('model').filter(function() {
        return true;
      });
    }
  }.property('toy.config.pattern'),

  actions: {
    maxOptionValueChanged: function (pattern, option, property, value) {
      console.log('CHANGE', value);
      option.set(property, value);
      this.updatePattern(pattern);
      if (pattern.get('active')) {
        this.get('toy').startPlaying(pattern.get('frames'));
      }
    },

    startPlayingPattern: function (pattern) {
      this.makeActive(pattern);
      this.get('toy').startPlaying(pattern.get('frames'));
    },

    stopPlayingPattern: function () {
      this.get('toy').stopPlaying();
    },

    chooseNewPatterns: function() {
      this.get('target').send('displaySelectOverlay');
    },

    addPattern: function(pattern) {
      let patterns = this.get('toy.config.pattern');
      if (!patterns) {
        this.set('toy.config.pattern', Ember.Object.create({}));
        patterns = this.get('toy.config.pattern');
      }
      patterns.set(pattern.get('name'), Ember.Object.create({}));
      this.notifyPropertyChange('toy.config.pattern');
    }
  }
});
