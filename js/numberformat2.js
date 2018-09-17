module.exports = {
  /**
  * number_format(number, decimals, decSepO, thousandsSepO, decSepI, thousandsSepI) in JavaScript.
  * This is a fork of number_format made by Felix Leupold <felix@xiel.de> <script src="https://gist.github.com/xiel/5688446.js"></script>
  * It formats a number to a string with grouped thousands, with custom seperator and custom decimal point managing the input format of the number.
  * @param {string} number - number to format
  * @param {number} [decimals=0] - (optional) count of decimals to show
  * @param {string} [decSepO=.] - (optional) decimal separator for the output value
  * @param {string} [thousandsSepO=,] - (optional) thousands seperator for the output value
  * @param {string} [decSepI=,] - (optional) decimal separator of the input value
  * @param {string} [thousandsSepI=.] - (optional) thousands seperator of the input value
  * @author Davide Galvani <davide.galvani.wrk@gmail.com>
  */
   number_format: function(number, decimals, decSepO, thousandsSepO, decSepI, thousandsSepI) {
     number = number.toString();
     decimals = Math.abs(decimals) || 0;
     
     // Conversion of 'number' from string to number
     if (thousandsSepI !== '' && thousandsSepI) {
       // Remove the thousandsSepI from the input number
       while (number.includes(thousandsSepI)) {
         number = number.replace(thousandsSepI, '');
       }
       
       // replace the input decimal point with '.' 
       number = number.replace(decSepI, '.');
     }
     
     // Parsing the number in float
     number = parseFloat(number);
     
     // Set decimal seperator to default ('.') if it is not valorized
     if (!decSepO) {
       decSepO = '.';
     }
     
     // Set thousands separator to default ('') if it is not valorized
     if (!thousandsSepO) {
       thousandsSepO = '';
     }
     
     var roundedNumber = Math.round(Math.abs(number) * ('1e' + decimals)) + '';
     var numbersString = decimals ? (roundedNumber.slice(0, decimals * -1) || 0) : roundedNumber;
     var decimalsString = decimals ? roundedNumber.slice(decimals * -1) : '';
     var formattedNumber = "";
     
     while (numbersString.length > 3) {
       formattedNumber = thousandsSepO + numbersString.slice(-3) + formattedNumber;
       numbersString = numbersString.slice(0, -3);
     }
     
     if (decimals && decimalsString.length === 1) {
       while (decimalsString.length < decimals) {
         decimalsString = decimalsString + decimalsString;
       }
     }
     
     return (number < 0 ? '-' : '') + numbersString + formattedNumber + (decimalsString ? (decSepO + decimalsString) : '');
   }
}

// // Just for test
// console.log('-- english format --');
// console.log(number_format(1234.50, 2)); // ~> "1,234.50"
// console.log(number_format(1234, 2)); // ~> "1,234.00"
// console.log(number_format(0, 2)); // ~> "0.00"
// console.log(number_format(-0.5, 2)); // ~> "-0.50"
// console.log(number_format(299.99)); // ~> "300"
// console.log(number_format(-299.9, 4)); // ~> "-299.9000"
// 
// // german format
// console.log('-- german format --');
// console.log(number_format(1234.50, 2, ',', '.')); // ~> "1.234,50"
// console.log(number_format(0.5, 2, ',', '.')); // ~> "0,50"
// 
// // french format
// console.log('-- french format --');
// console.log(number_format(1234.50, 2, '.', ' ')); // ~> "1 234.50"
// console.log(number_format(1233.999, 2, '.', ' ')); // ~> "1 234.00"
// 
// // Italian format
// console.log('-- Italian format --');
// console.log(number_format('1.234,50', 2, '.', '', ',', '.')); // ~> "1234.50"
// console.log(number_format('1.233,999', 2, '.', '', ',', '.')); // ~> "1234.00"
// console.log(number_format('1.234,50', 2, '.', ',', ',', '.')); // ~> "1,234.50"
// console.log(number_format('1.233,992', 2, '.', ',', ',', '.')); // ~> "1,233.99"
// console.log(number_format('1.234,50', 2, ',', '.', ',', '.')); // ~> "1.234,50"
// console.log(number_format('1.233,992', 2, ',', '.', ',', '.')); // ~> "1.233,99"
// console.log(number_format('1.123.456,78', 2, '.', ',', ',', '.')); // ~> "1,123,456.78"
// console.log(number_format('1.123.456,999', 2, '.', ',', ',', '.')); // ~> "1,123,457.00"
// console.log(number_format('1.123.234,50', 2, ',', '.', ',', '.')); // ~> "1.123.234,50"
// console.log(number_format('1.123.233,992', 2, ',', '.', ',', '.')); // ~> "1.123.233,992"
// console.log(number_format('1123234,50', 2, ',', '.', ',', '')); // ~> "1.123.234,50"
// console.log(number_format('1123233,992', 2, ',', '.', ',', '')); // ~> "1.123.233,992"