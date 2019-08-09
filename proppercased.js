exports.fixedCaseFormatter = function(fromFrontEnd){

    var firstChar = fromFrontEnd.slice(0,1);
    var fixedFirstChar = firstChar.toUpperCase();

    var restOfChar = fromFrontEnd.slice(1,fromFrontEnd.length);
    var fixedRestOfChar = restOfChar.toLowerCase();
    var fixedCase = fixedFirstChar + fixedRestOfChar;

    return fixedCase;
}
// module.exports.fixedCaseFormatter = fixedCaseFormatter;
// function fixedCaseFormatter(fromFrontEnd){

//     var firstChar = fromFrontEnd.slice(0,1);
//     var fixedFirstChar = firstChar.toUpperCase();

//     var restOfChar = fromFrontEnd.slice(1,fromFrontEnd.length);
//     var fixedRestOfChar = restOfChar.toLowerCase();
//     var fixedCase = fixedFirstChar + fixedRestOfChar;

//     return fixedCase;
// }

// function addShit(a,b){

//     return a + b
// }
// console.log(addShit(1,2));
//console.log(fixedCaseFormatter("mPiLo"));