'use strict';

var lab = require('lab')
  , describe = lab.experiment
  , it = lab.test
  , beforeEach = lab.beforeEach
  , afterEach = lab.afterEach
  , expect = lab.expect
  , plugin = require('../index.js')
  , stream = require('stream')
  , sinon = require('sinon')
  , chai = require('chai')
  , npm = require('npm')

chai.use(require('sinon-chai'))

describe('gulp-nsp', {parallel: true}, function(){
  beforeEach(function(done){
    sinon.spy(npm, 'load')
    // sinon.spy(npm.commands, 'shrinkwrap')
    setTimeout(function(){
      done()
    }, 50)
  })

  afterEach(function(done){
    npm.load.restore()
    // npm.commands.shrinkwrap.restore()
    setTimeout(function(){
      done()
    }, 50)
  })

  it('returns a stream', function(done){
    expect(plugin()).to.be.instanceof(stream.Stream)
    done()
  })

  it('generates a shrinkwrap file if the `generate` option is passed', function(done){
    plugin({generate: true})
    expect(npm.load).to.have.been.calledOnce
    // expect(npm.commands.shrinkwrap).to.have.been.calledOnce

    done()
  })
})
