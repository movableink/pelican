module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    watch: {
      coffee: {
        files: [
          'models/**/*.coffee',
          'routes/**/*.coffee',
          'slack/**/*.coffee',
          'public/javascripts/src/init/**/*.coffee',
          'public/javascripts/src/model/**/*.coffee',
          'public/javascripts/src/view/**/*.coffee',
          'tests/api.coffee',
          'tests/models/**/*.coffee',
          'tests/mocks/**/*.coffee',
          '*.coffee'
        ],
        tasks: 'coffee'
      }
    },

    coffee: {
      node: {
        options: {
          bare: true,
          sourceMap: true
        },
        expand: true,
        flatten: false,
        ext: '.js',
        src: [
          'models/**/*.coffee',
          'routes/**/*.coffee',
          'slack/**/*.coffee',
          'public/javascripts/src/init/**/*.coffee',
          'public/javascripts/src/model/**/*.coffee',
          'public/javascripts/src/view/**/*.coffee',
          'tests/api.coffee',
          'tests/models/**/*.coffee',
          'tests/mocks/**/*.coffee',
          '*.coffee'
        ],
        dest: ''
      }
    },

    clean: {
      models: ['models/**/*.js'],
      routes: ['routes/**/*.js'],
      clientInit: ['public/javascripts/src/init/**/*.js'],
      clientModel: ['public/javascripts/src/model/**/*.js'],
      clientView: ['public/javascripts/src/view/**/*.js'],
      testApi: ['tests/api.js'],
      testModels: ['tests/models/**/*.js'],
      testMocks: ['tests/mocks/*.js'],
      root: ['app.js', 'server.js', 'slack.js', 'socket.js'],
      slack: ['slack/*.js']
    }
  });

  // External tasks
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-newer');

  // Tasks
  grunt.registerTask('coffeeReset', ['clean', 'coffee']);
  grunt.registerTask('default', ['clean', 'coffee', 'watch']);
};
