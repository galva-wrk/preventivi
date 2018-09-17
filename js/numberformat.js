module.exports = {
  /**
  * number_format(number, decimals, decPoint, thousandsSep) in JavaScript, known from PHP.
  * It formats a number to a string with grouped thousands, with custom seperator and custom decimal point
  * @param {number} number - number to format
  * @param {number} [decimals=0] - (optional) count of decimals to show
  * @param {string} [decPoint=.] - (optional) decimal point
  * @param {string} [thousandsSep=,] - (optional) thousands seperator
  * @author Felix Leupold <felix@xiel.de>
  */
   number_format: function(number, decimals, decPoint, thousandsSep) {
     number = number.toString();
     decimals = Math.abs(decimals) || 0;
     number = number.replace(".", "");
     number = number.replace(".", "");
     number = number.replace(".", "");
     number = number.replace(",", ".");
     number = parseFloat(number);
     
     if (!decPoint) {
       decPoint = '.';
     }
     
     var roundedNumber = Math.round(Math.abs(number) * ('1e' + decimals)) + '';
     var numbersString = decimals ? (roundedNumber.slice(0, decimals * -1) || 0) : roundedNumber;
     var decimalsString = decimals ? roundedNumber.slice(decimals * -1) : '';
     var formattedNumber = "";
     
     while (numbersString.length > 3) {
       formattedNumber = thousandsSep + numbersString.slice(-3) + formattedNumber;
       numbersString = numbersString.slice(0, -3);
     }
     
     if (decimals && decimalsString.length === 1) {
       while (decimalsString.length < decimals) {
         decimalsString = decimalsString + decimalsString;
       }
     }
     
     return (number < 0 ? '-' : '') + numbersString + formattedNumber + (decimalsString ? (decPoint + decimalsString) : '');
   }
}