function padWithZeros(number, length) {
    let numberAsString = String(number);
    while (numberAsString.length < length) {
      numberAsString = "0" + numberAsString;
    }
    return numberAsString;
  }
