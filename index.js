'use strict';

var request = require('request')
  , through = require('through2')
  , gutil = require('gulp-util')
  , fs = require('fs')
  , npm = require('npm')
  , path = require('path')
  , _writeFile = fs.writeFile

module.exports = function(options){
  var pkg

  if (options && options.generate){
    pkg = options.generate === true
      ? path.resolve(process.cwd(), 'package.json')
      : options.generate

    npm.load(require(pkg), function(err){
      if (err) this.emit('error', new gutil.PluginError('gulp-nsp', err))

      // set writeFile to be a noop, so that the shrinkwrap file doesn't actually get written
      fs.writeFile = function(file, swdata, cb){
        cb()
      }
      npm.commands.shrinkwrap([], function(err, data){
        if (err) this.emit('error', new gutil.PluginError('gulp-nsp', err))

        // restore writeFile
        fs.writeFile = _writeFile

        console.log(data)
      }.bind(this))
    })
  }

  return through.obj(function(file, enc, callback){
    fs.exists(file, function(exists){
      if (!exists) {
        this.emit('error', new gutil.PluginError('gulp-nsp', 'Shrinkwrap file not found.'))
        callback()
      }

      fs.createReadStream(file)
        .pipe(request.post({
          url: 'https://nodesecurity.io/validate/shrinkwrap'
          , headers: {
            'content-type': 'application/json'
          }
          , json: true
        }))
        .on('error', function(err){
          this.emit('error', new gutil.PluginError('gulp-nsp', err))
          callback()
        }.bind(this))
        .on('data', function(data){
          console.log(data)
        })
        .on('end', function(){
          callback()
        })
    })
  })
}
