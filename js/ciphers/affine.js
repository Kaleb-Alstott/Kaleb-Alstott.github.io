// Affine Cipher

// This code was written by Tyler Akins and is placed in the public domain.
// It would be nice if this header remained intact.  http://rumkin.com

// Requires util.js


// Perform a Affine transformation on the text
// encdec = -1 for decode, 1 for encode (kinda silly, but kept it like this
//    to be the same as the other encoders)
// text = the text to encode/decode
// inc = how far to shift the letters.
// key = the key to alter the alphabet
// alphabet = The alphabet to use if not A-Z
//ALPHABET is out of order because Christensen says a starts at 1
function affine(mult, inc, text, isDecrypt = "encrypt", alphabet = 'ZABCDEFGHIJKLMNOPQRSTUVWXY') {
    var output = "";

    if (typeof (alphabet) != 'string')
        alphabet = 'ZABCDEFGHIJKLMNOPQRSTUVWXY';

    mult = mult * 1;
    inc = inc * 1;

    // Popup to warn of incorrect keys and to avoid infinite loops
    if (mult % 2 == 0 || mult % 13 == 0) {
        window.alert("The multiplicative key cannot be zero, an even number, or a multiple of 13 when decoding!");
        mult = 1;
        inc = 0;
        isDecrypt = 0;
    }
    if (isDecrypt == "decrypt") {
        var i = 1;
        while ((mult * i) % 26 != 1) {
            i += 2;
        }
        mult = i;
        inc = mult * (alphabet.length - inc) % alphabet.length;
    }

    key = alphabet;

    for (var i = 0; i < text.length; i++) {
        var b = text.charAt(i);
        var idx;
        if ((idx = alphabet.indexOf(b)) >= 0) {
            idx = (mult * idx + inc) % alphabet.length;
            b = key.charAt(idx);
        } else if ((idx = alphabet.indexOf(b.toUpperCase())) >= 0) {
            idx = (mult * idx + inc) % alphabet.length;
            b = key.charAt(idx);
        }
        output += b;
    }
    return output;
}
 
// new part here

/*
 * Function to perform brute force attack on Affine cipher
 */
function bruteForceAffine() {
    // Get the ciphertext from the input textarea
    var ciphertext = document.getElementById("input").value.trim();
    
    // Define the alphabet
    var alphabet = 'ZABCDEFGHIJKLMNOPQRSTUVWXY';
    
    // Initialize an array to store possible plaintexts
    var possiblePlaintext = [];
    
    // Iterate through all possible keys (a, b)
    for (var a = 1; a < 26; a++) {
        // Ensure a and 26 are coprime (i.e., gcd(a, 26) = 1)
        if (gcd(a, 26) === 1) {
            for (var b = 0; b < 26; b++) {
                // Decrypt the ciphertext using the current key (a, b)
                var decryptedText = affineDecipher(a, b, ciphertext, alphabet);
                
                // Push the decrypted text to the array
                possiblePlaintext.push(`Key: (${a}, ${b}), Decrypted text: ${decryptedText}`);
            }
        }
    }
    
    // Display the decrypted texts in the output textarea
    document.getElementById("output").value = possiblePlaintext.join("\n");
}

/*
 * Function to calculate the greatest common divisor (gcd) of two numbers
 */
function gcd(a, b) {
    if (b === 0) {
        return a;
    }
    return gcd(b, a % b);
}

/*
 * Function to decrypt using the Affine cipher
 */
function affineDecipher(a, b, ciphertext, alphabet) {
    var plaintext = '';
    var m = alphabet.length;
    
    for (var i = 0; i < ciphertext.length; i++) {
        var c = ciphertext[i];
        if (alphabet.includes(c.toUpperCase())) {
            var idx = alphabet.indexOf(c.toUpperCase());
            var idxPlaintext = modInverse(a, m) * (idx - b);
            idxPlaintext = mod(idxPlaintext, m);
            plaintext += alphabet[idxPlaintext];
        } else {
            plaintext += c;
        }
    }
    return plaintext;
}

/*
 * Function to calculate the modular inverse
 */
function modInverse(a, m) {
    a = ((a % m) + m) % m;
    for (var x = 1; x < m; x++) {
        if ((a * x) % m === 1) {
            return x;
        }
    }
    return 1;
}

/*
 * Function to perform modular arithmetic
 */
function mod(n, m) {
    return ((n % m) + m) % m;
}

