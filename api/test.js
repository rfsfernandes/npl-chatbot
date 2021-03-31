const str1 = ["O", "meu", "nome", "é"];
const str2 = ["O", "meu", "nome"];

const normalize = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z ]/g, "");
};

const checkNumberOfOccurencies = (strArray1, strArray2) => {
  strArray1 = strArray1.sort();
  console.log(strArray1);
  strArray2 = strArray2.sort();
  console.log(strArray2);
  const occurences = strArray1.filter((value) => strArray2.includes(value));
  console.log((3 / 4) * strArray1.length);
  console.log(occurences.length);
  if (occurences.length >= (3 / 4) * strArray1.length) return true;

  return occurences;
};

console.log(checkNumberOfOccurencies(str1, str2));
