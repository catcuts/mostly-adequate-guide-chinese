
// ===================================================

var _ = require('ramda');

var Left = function(x) {
this.__value = x;
}

Left.of = function(x) {
return new Left(x);
}

Left.prototype.map = function(f) {
return this;
}

var Right = function(x) {
this.__value = x;
}

Right.of = function(x) {
return new Right(x);
}

Right.prototype.map = function(f) {
return Right.of(f(this.__value));
}

// ===================================================

Right.of("rain").map(function(str){ return "b"+str; });
// Right("brain")

Left.of("rain").map(function(str){ return "b"+str; });
// Left("rain")

Right.of({host: 'localhost', port: 80}).map(_.prop('host'));
// Right('localhost')

Left.of("rolls eyes...").map(_.prop("host"));
// Left('rolls eyes...')

// ===================================================

var moment = require('moment');

//  getAge :: Date -> User -> Either(String, Number)
var getAge = _.curry(function(now, user) {
  var birthdate = moment(user.birthdate, 'YYYY-MM-DD');
  if(!birthdate.isValid()) return Left.of("Birth date could not be parsed");
  return Right.of(now.diff(birthdate, 'years'));
});

getAge(moment(), {birthdate: '2005-12-12'});
// Right(9)

getAge(moment(), {birthdate: 'balloons!'});
// Left("Birth date could not be parsed")

// ===================================================

//  fortune :: Number -> String
var fortune  = _.compose(_.concat("If you survive, you will be "), _.add(1));

//  zoltar :: User -> Either(String, _)
var zoltar = _.compose(_.map(console.log), _.map(fortune), getAge(moment()));

zoltar({birthdate: '2005-12-12'});
// "If you survive, you will be 10"
// Right(undefined)  // <-because console.log(any) returns undefined

zoltar({birthdate: 'balloons!'});
// Left("Birth date could not be parsed")