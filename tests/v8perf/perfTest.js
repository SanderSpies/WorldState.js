function printStatus(name, fn) {
  switch(%GetOptimizationStatus(fn)) {
  case 1: console.log("Function " + name + " is optimized"); break;
  case 2: console.error("Function " + name + " is not optimized"); break;
  case 3: console.log("Function " + name + " is always optimized"); break;
  case 4: console.log("Function " + name + " is never optimized"); break;
  case 6: console.log("Function " + name + " is maybe deoptimized"); break;
  }
}

function perfTest(name, fn, proto) {
  fn();
  %OptimizeFunctionOnNextCall(proto);
  fn();
  printStatus(name, proto);

};

module.exports = perfTest;