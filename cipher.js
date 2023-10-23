var alphabets = [
  "A", // nilai: 0
  "B", // nilai: 1
  "C", // nilai: 2
  "D", // nilai: 3
  "E", // nilai: 4
  "F", // nilai: 5
  "G", // nilai: 6
  "H", // nilai: 7
  "I", // nilai: 8
  "J", // nilai: 9
  "K", // nilai: 10
  "L", // nilai: 11
  "M", // nilai: 12
  "N", // nilai: 13
  "O", // nilai: 14
  "P", // nilai: 15
  "Q", // nilai: 16
  "R", // nilai: 17
  "S", // nilai: 18
  "T", // nilai: 19
  "U", // nilai: 20
  "V", // nilai: 21
  "W", // nilai: 22
  "X", // nilai: 23
  "Y", // nilai: 24
  "Z", // nilai: 25
];

const transposeArray = (type, arr) => {
  // Melakukan operasi transpose dengan membalik Array

  if (type === "encrypt")
    // Jika index dari baris bernilai undefined maka ubah menjadi "0"
    // Contoh: [ [ 'X', 'A' ], [ 'H', 'Q' ], [ 'E', '0' ] ]
    // Menjadi: [ [ 'X', 'H', 'E' ], [ 'A', 'Q', '0' ] ]
    return arr[0].map((_, colIndex) =>
      arr.map((row) => (row[colIndex] === undefined ? "0" : row[colIndex]))
    );

  if (type === "decrypt")
    // Jika index dari baris bernilai "0" maka ubah menjadi ""
    // Contoh: [ [ 'X', 'H', 'E' ], [ 'A', 'Q', '0' ] ]
    // Menjadi: [ [ 'X', 'A' ], [ 'H', 'Q' ], [ 'E', '' ] ]
    return arr[0].map((_, colIndex) =>
      arr.map((row) => (row[colIndex] !== "0" ? row[colIndex] : ""))
    );
};

// Fungsi untuk mengacak alfabet
const cipherSubAlphabet = (type, pt, k) => {
  if (type === "encrypt") {
    // Jika tipe encrypt maka hitung dengan rumus (pt + k) % 26
    // pt adalah Integer yang sebelumnya di translasikan dari Alphabet ke Integer
    const index = (pt + k) % 26;
    // Kembalikan index dari alphabets sesuai hasil perhitungan di atas
    return alphabets[index];
  }

  if (type === "decrypt") {
    // Jika tipe decrypt maka hitung dengan rumus (pt - k) % 26
    // Fungsi dibawah ini digunakan jika hasil perhitungan minus
    const findPositiveInt = (num) => {
      const subt = (num - k) % 26;
      // Jika minus maka di tambahkan 26
      if (subt < 0) {
        const plus = subt + 26;
        return plus;
      }
      return subt;
    };

    // Hasil dari perhitungan akan di translasikan ke alphabet
    const index = findPositiveInt(pt);
    return alphabets[index];
  }
};

const encrypt = (plainText, key) => {
  console.log("===== Encrypt Text =====");
  // Mengubah String ke dalam pecahan Array
  const textToArray = plainText.toUpperCase().split("");
  console.log("textToArray", textToArray);

  // Mentranslasikan String dalam Array ke huruf sesuai nilai/value di atas
  const translateValue = textToArray.map((item) => alphabets.indexOf(item));
  console.log("translateValue", translateValue);

  // Subtitusi Integer di dalam array
  const cipherArray = translateValue.map((item) =>
    cipherSubAlphabet("encrypt", item, 12)
  );
  console.log("cipherArray", cipherArray);

  const encryptResult = [];

  // Membentuk Array 2 Dimensi untuk membagi bagian sesuai nilai kunci(integer)
  for (let i = 0; i < cipherArray.length; i += key) {
    const sliceArray = cipherArray.slice(i, i + key);
    // Jika setelah Array di bagi dan length dari Array tsb tidak sesuai dengan nilai kunci
    if (sliceArray.length !== key) {
      // Maka tambahkan "0" agar length sesuai dari nilai kunci
      for (let j = 0; j <= key - sliceArray.length; j++) {
        sliceArray.push("0");
      }
      // Contoh (key = 2): [ 'X', 'A', 'H', 'Q', 'E' ]
      // Hasil (key = 2): [ [ 'X', 'A' ], [ 'H', 'Q' ], [ 'E', '0' ] ]
      // Jika tidak di sesuaikan dengan nilai kunci [ [ 'X', 'A' ], [ 'H', 'Q' ], [ 'E' ] ] ini akan error jika nanti akan di lakukan operasi array transposition

      // Isi variable encryptResult dengan yang tadi
      encryptResult.push(sliceArray);
    } else {
      // Jika length Array sama dengan nilai kunci maka array nya langsung dibagi aja
      // Kemudian isi variable encryptResult
      encryptResult.push(sliceArray);
    }
  }

  console.log("encryptResult", encryptResult);

  // Lakukan operasi transposition
  const transposed = transposeArray("encrypt", encryptResult);
  console.log("transposed", transposed);

  // Mengembalikkan hasil cipher text
  // .flat() untuk mengkonversi Array 2 dimensi ke Array 1 dimensi
  // .join("") untuk menggabungkan semua string yang ada di dalam Array
  return transposed.flat().join("");
};

const decrypt = (cipherText, key) => {
  console.log("===== Decrypt Text =====");
  // Decrypt dari cipher text, ubah String ke dalam pecahan Array
  const textToArray = cipherText.toUpperCase().split("");
  console.log("textToArray", textToArray);

  // Mengubah ke Array 2 dimensi
  // [ 'X', 'H', 'E', 'A', 'Q', '0' ] menjadi [ [ 'X', 'H', 'E' ], [ 'A', 'Q', '0' ] ]
  const transposedCols = textToArray.length / key;
  const bfrTransposed = [];

  for (let i = 0; i < textToArray.length; i += transposedCols) {
    bfrTransposed.push(textToArray.slice(i, i + transposedCols));
  }
  console.log("bfr transpose", bfrTransposed);

  // Lakukan operasi transpose setelah dijadikan Array 2 dimensi
  const afrTransposed = transposeArray("decrypt", bfrTransposed);
  console.log("afr transpose", afrTransposed);

  // Hapus String kosong yang ada di dalam Array
  const rmvBlankString = afrTransposed.map((item) =>
    item.filter((val) => val !== "")
  );
  console.log("rmv", rmvBlankString);

  // Mengkonversi Array 2 dimensi ke Array 1 dimensi
  const convertArrayTo1D = rmvBlankString.flat();
  console.log("convertArrayTo1D", convertArrayTo1D);

  // Mentranslasikan Alphabet ke Integer sesuai value dari variable "alphabets"
  const translateValue = convertArrayTo1D.map((item) =>
    alphabets.indexOf(item)
  );
  console.log("translateValue", translateValue);

  // Melakukan operasi subtitusi
  const cipherArray = translateValue.map((item) =>
    cipherSubAlphabet("decrypt", item, 12)
  );
  console.log("cipherArray", cipherArray);

  // Menggabungkan semua String di dalam Array
  return cipherArray.join("");
};

const key = 2;
const cipher = encrypt("loves", key);

console.log("cipherText:", cipher);

console.log("decrypted:", decrypt(cipher, key));
