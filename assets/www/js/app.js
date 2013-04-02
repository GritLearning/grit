App = Ember.Application.create();

App.Router.map(function() {
  // put your routes here
  this.route("level", { path: "/level" });
  this.route("quiz", { path: "/quiz" });
});


App.Store = DS.Store.extend({
  revision: 12,
  adapter: DS.FixtureAdaptor
});

App.IndexRoute = Ember.Route.extend({
  model: function() {
    return App.Content.FIXTURES;
  }
});

App.LevelRoute = Ember.Route.extend({
  model: function() {
    return App.Content.FIXTURES;
  }
});


App.Content = DS.Model.extend({
        name: DS.attr('string'),
        launchCommand: DS.attr('string'),
        icon: DS.attr('string'),
        type: DS.attr('string'),
        level: DS.attr('number')
});

App.Content.FIXTURES = [
    {
        name: 'Monkey Game',
        launchCommand: 'com.monkey.game',
        icon: 'img/monkey.png',
        type: 'app',
        level: 1
    },
    {
        name: 'Count 20',
        launchCommand: 'com.monkey.game',
        icon: 'img/monkey.png',
        type: 'app',
        level: 1
    },
    {
        name: 'Boring Count 10',
        launchCommand: 'com.monkey.game',
        icon: 'img/monkey.png',
        type: 'app',
        level: 2
    },
    {
        name: 'Exciting count 50',
        launchCommand: 'com.monkey.game',
        icon: 'img/monkey.png',
        type: 'app',
        level: 2
    },
    {
        name: 'How to count',
        launchCommand: 'com.monkey.game',
        icon: 'img/monkey.png',
        type: 'video',
        level: 1
    }
];


