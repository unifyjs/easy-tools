import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Copy, Shield, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ShaHash = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [algorithm, setAlgorithm] = useState<'sha1' | 'sha224' | 'sha256' | 'sha384' | 'sha512'>('sha256');
  const [format, setFormat] = useState<'lowercase' | 'uppercase'>('lowercase');
  const { toast } = useToast();

  // SHA-1 implementation
  const sha1 = (str: string): string => {
    const rotateLeft = (n: number, s: number): number => {
      return (n << s) | (n >>> (32 - s));
    };

    const cvtHex = (val: number): string => {
      let str = '';
      for (let i = 7; i >= 0; i--) {
        const v = (val >>> (i * 4)) & 0x0f;
        str += v.toString(16);
      }
      return str;
    };

    const utf8Encode = (str: string): string => {
      str = str.replace(/\r\n/g, '\n');
      let utftext = '';
      for (let n = 0; n < str.length; n++) {
        const c = str.charCodeAt(n);
        if (c < 128) {
          utftext += String.fromCharCode(c);
        } else if ((c > 127) && (c < 2048)) {
          utftext += String.fromCharCode((c >> 6) | 192);
          utftext += String.fromCharCode((c & 63) | 128);
        } else {
          utftext += String.fromCharCode((c >> 12) | 224);
          utftext += String.fromCharCode(((c >> 6) & 63) | 128);
          utftext += String.fromCharCode((c & 63) | 128);
        }
      }
      return utftext;
    };

    str = utf8Encode(str);
    const strLen = str.length;
    const wordArray: number[] = [];
    
    for (let i = 0; i < strLen - 3; i += 4) {
      const j = str.charCodeAt(i) << 24 | str.charCodeAt(i + 1) << 16 |
                str.charCodeAt(i + 2) << 8 | str.charCodeAt(i + 3);
      wordArray.push(j);
    }

    switch (strLen % 4) {
      case 0:
        wordArray.push(0x080000000);
        break;
      case 1:
        wordArray.push(str.charCodeAt(strLen - 1) << 24 | 0x0800000);
        break;
      case 2:
        wordArray.push(str.charCodeAt(strLen - 2) << 24 | str.charCodeAt(strLen - 1) << 16 | 0x08000);
        break;
      case 3:
        wordArray.push(str.charCodeAt(strLen - 3) << 24 | str.charCodeAt(strLen - 2) << 16 | str.charCodeAt(strLen - 1) << 8 | 0x80);
        break;
    }

    while ((wordArray.length % 16) !== 14) {
      wordArray.push(0);
    }

    wordArray.push(strLen >>> 29);
    wordArray.push((strLen << 3) & 0x0ffffffff);

    let h0 = 0x67452301;
    let h1 = 0xEFCDAB89;
    let h2 = 0x98BADCFE;
    let h3 = 0x10325476;
    let h4 = 0xC3D2E1F0;

    for (let i = 0; i < wordArray.length; i += 16) {
      const w: number[] = [];
      for (let j = 0; j < 80; j++) {
        if (j < 16) {
          w[j] = wordArray[i + j];
        } else {
          w[j] = rotateLeft(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
        }
      }

      let a = h0;
      let b = h1;
      let c = h2;
      let d = h3;
      let e = h4;

      for (let j = 0; j < 80; j++) {
        let f: number;
        let k: number;

        if (j < 20) {
          f = (b & c) | ((~b) & d);
          k = 0x5A827999;
        } else if (j < 40) {
          f = b ^ c ^ d;
          k = 0x6ED9EBA1;
        } else if (j < 60) {
          f = (b & c) | (b & d) | (c & d);
          k = 0x8F1BBCDC;
        } else {
          f = b ^ c ^ d;
          k = 0xCA62C1D6;
        }

        const temp = (rotateLeft(a, 5) + f + e + k + w[j]) & 0x0ffffffff;
        e = d;
        d = c;
        c = rotateLeft(b, 30);
        b = a;
        a = temp;
      }

      h0 = (h0 + a) & 0x0ffffffff;
      h1 = (h1 + b) & 0x0ffffffff;
      h2 = (h2 + c) & 0x0ffffffff;
      h3 = (h3 + d) & 0x0ffffffff;
      h4 = (h4 + e) & 0x0ffffffff;
    }

    const result = cvtHex(h0) + cvtHex(h1) + cvtHex(h2) + cvtHex(h3) + cvtHex(h4);
    return format === 'uppercase' ? result.toUpperCase() : result.toLowerCase();
  };

  // SHA-256 implementation
  const sha256 = (str: string): string => {
    const rightRotate = (value: number, amount: number): number => {
      return (value >>> amount) | (value << (32 - amount));
    };

    const utf8Encode = (str: string): string => {
      return unescape(encodeURIComponent(str));
    };

    str = utf8Encode(str);
    const strBin = str.split('').map(c => c.charCodeAt(0));
    const strLen = strBin.length;
    const strLenBits = strLen * 8;

    // Pre-processing: adding a single 1 bit
    strBin.push(0x80);

    // Pre-processing: padding with zeros
    while (strBin.length % 64 !== 56) {
      strBin.push(0x00);
    }

    // Append original length in bits mod 2^64 to message
    for (let i = 7; i >= 0; i--) {
      strBin.push((strLenBits >>> (i * 8)) & 0xff);
    }

    // Initialize hash values
    let h0 = 0x6a09e667;
    let h1 = 0xbb67ae85;
    let h2 = 0x3c6ef372;
    let h3 = 0xa54ff53a;
    let h4 = 0x510e527f;
    let h5 = 0x9b05688c;
    let h6 = 0x1f83d9ab;
    let h7 = 0x5be0cd19;

    // Initialize array of round constants
    const k = [
      0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
      0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
      0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
      0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
      0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
      0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
      0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
      0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];

    // Process the message in successive 512-bit chunks
    for (let chunk = 0; chunk < strBin.length; chunk += 64) {
      const w: number[] = [];

      // Break chunk into sixteen 32-bit big-endian words
      for (let i = 0; i < 16; i++) {
        w[i] = (strBin[chunk + i * 4] << 24) | (strBin[chunk + i * 4 + 1] << 16) |
               (strBin[chunk + i * 4 + 2] << 8) | strBin[chunk + i * 4 + 3];
      }

      // Extend the first 16 words into the remaining 48 words
      for (let i = 16; i < 64; i++) {
        const s0 = rightRotate(w[i - 15], 7) ^ rightRotate(w[i - 15], 18) ^ (w[i - 15] >>> 3);
        const s1 = rightRotate(w[i - 2], 17) ^ rightRotate(w[i - 2], 19) ^ (w[i - 2] >>> 10);
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) & 0xffffffff;
      }

      // Initialize working variables
      let a = h0;
      let b = h1;
      let c = h2;
      let d = h3;
      let e = h4;
      let f = h5;
      let g = h6;
      let h = h7;

      // Compression function main loop
      for (let i = 0; i < 64; i++) {
        const s1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
        const ch = (e & f) ^ ((~e) & g);
        const temp1 = (h + s1 + ch + k[i] + w[i]) & 0xffffffff;
        const s0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
        const maj = (a & b) ^ (a & c) ^ (b & c);
        const temp2 = (s0 + maj) & 0xffffffff;

        h = g;
        g = f;
        f = e;
        e = (d + temp1) & 0xffffffff;
        d = c;
        c = b;
        b = a;
        a = (temp1 + temp2) & 0xffffffff;
      }

      // Add the compressed chunk to the current hash value
      h0 = (h0 + a) & 0xffffffff;
      h1 = (h1 + b) & 0xffffffff;
      h2 = (h2 + c) & 0xffffffff;
      h3 = (h3 + d) & 0xffffffff;
      h4 = (h4 + e) & 0xffffffff;
      h5 = (h5 + f) & 0xffffffff;
      h6 = (h6 + g) & 0xffffffff;
      h7 = (h7 + h) & 0xffffffff;
    }

    // Produce the final hash value
    const result = [h0, h1, h2, h3, h4, h5, h6, h7]
      .map(h => h.toString(16).padStart(8, '0'))
      .join('');

    return format === 'uppercase' ? result.toUpperCase() : result.toLowerCase();
  };

  // SHA-224 implementation (based on SHA-256 but truncated)
  const sha224 = (str: string): string => {
    const rightRotate = (value: number, amount: number): number => {
      return (value >>> amount) | (value << (32 - amount));
    };

    const utf8Encode = (str: string): string => {
      return unescape(encodeURIComponent(str));
    };

    str = utf8Encode(str);
    const strBin = str.split('').map(c => c.charCodeAt(0));
    const strLen = strBin.length;
    const strLenBits = strLen * 8;

    // Pre-processing: adding a single 1 bit
    strBin.push(0x80);

    // Pre-processing: padding with zeros
    while (strBin.length % 64 !== 56) {
      strBin.push(0x00);
    }

    // Append original length in bits mod 2^64 to message
    for (let i = 7; i >= 0; i--) {
      strBin.push((strLenBits >>> (i * 8)) & 0xff);
    }

    // Initialize hash values (different from SHA-256)
    let h0 = 0xc1059ed8;
    let h1 = 0x367cd507;
    let h2 = 0x3070dd17;
    let h3 = 0xf70e5939;
    let h4 = 0xffc00b31;
    let h5 = 0x68581511;
    let h6 = 0x64f98fa7;
    let h7 = 0xbefa4fa4;

    // Initialize array of round constants (same as SHA-256)
    const k = [
      0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
      0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
      0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
      0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
      0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
      0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
      0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
      0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];

    // Process the message in successive 512-bit chunks (same as SHA-256)
    for (let chunk = 0; chunk < strBin.length; chunk += 64) {
      const w: number[] = [];

      // Break chunk into sixteen 32-bit big-endian words
      for (let i = 0; i < 16; i++) {
        w[i] = (strBin[chunk + i * 4] << 24) | (strBin[chunk + i * 4 + 1] << 16) |
               (strBin[chunk + i * 4 + 2] << 8) | strBin[chunk + i * 4 + 3];
      }

      // Extend the first 16 words into the remaining 48 words
      for (let i = 16; i < 64; i++) {
        const s0 = rightRotate(w[i - 15], 7) ^ rightRotate(w[i - 15], 18) ^ (w[i - 15] >>> 3);
        const s1 = rightRotate(w[i - 2], 17) ^ rightRotate(w[i - 2], 19) ^ (w[i - 2] >>> 10);
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) & 0xffffffff;
      }

      // Initialize working variables
      let a = h0;
      let b = h1;
      let c = h2;
      let d = h3;
      let e = h4;
      let f = h5;
      let g = h6;
      let h = h7;

      // Compression function main loop
      for (let i = 0; i < 64; i++) {
        const s1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
        const ch = (e & f) ^ ((~e) & g);
        const temp1 = (h + s1 + ch + k[i] + w[i]) & 0xffffffff;
        const s0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
        const maj = (a & b) ^ (a & c) ^ (b & c);
        const temp2 = (s0 + maj) & 0xffffffff;

        h = g;
        g = f;
        f = e;
        e = (d + temp1) & 0xffffffff;
        d = c;
        c = b;
        b = a;
        a = (temp1 + temp2) & 0xffffffff;
      }

      // Add the compressed chunk to the current hash value
      h0 = (h0 + a) & 0xffffffff;
      h1 = (h1 + b) & 0xffffffff;
      h2 = (h2 + c) & 0xffffffff;
      h3 = (h3 + d) & 0xffffffff;
      h4 = (h4 + e) & 0xffffffff;
      h5 = (h5 + f) & 0xffffffff;
      h6 = (h6 + g) & 0xffffffff;
      h7 = (h7 + h) & 0xffffffff;
    }

    // Produce the final hash value (truncated to 224 bits - first 7 words)
    const result = [h0, h1, h2, h3, h4, h5, h6]
      .map(h => h.toString(16).padStart(8, '0'))
      .join('');

    return format === 'uppercase' ? result.toUpperCase() : result.toLowerCase();
  };

  // SHA-384 implementation (based on SHA-512 but truncated)
  const sha384 = (str: string): string => {
    return sha512Internal(str, true);
  };

  // SHA-512 implementation
  const sha512 = (str: string): string => {
    return sha512Internal(str, false);
  };

  // Internal SHA-512 implementation (used for both SHA-384 and SHA-512)
  const sha512Internal = (str: string, is384: boolean): string => {
    // 64-bit arithmetic using arrays [high, low]
    const add64 = (a: [number, number], b: [number, number]): [number, number] => {
      const low = (a[1] + b[1]) >>> 0;
      const high = (a[0] + b[0] + (low < a[1] ? 1 : 0)) >>> 0;
      return [high, low];
    };

    const rightRotate64 = (x: [number, number], n: number): [number, number] => {
      if (n === 0) return x;
      if (n < 32) {
        return [
          (x[0] >>> n) | (x[1] << (32 - n)),
          (x[1] >>> n) | (x[0] << (32 - n))
        ];
      } else {
        n -= 32;
        return [
          (x[1] >>> n) | (x[0] << (32 - n)),
          (x[0] >>> n) | (x[1] << (32 - n))
        ];
      }
    };

    const rightShift64 = (x: [number, number], n: number): [number, number] => {
      if (n === 0) return x;
      if (n < 32) {
        return [
          x[0] >>> n,
          (x[1] >>> n) | (x[0] << (32 - n))
        ];
      } else {
        return [0, x[0] >>> (n - 32)];
      }
    };

    const xor64 = (a: [number, number], b: [number, number]): [number, number] => {
      return [a[0] ^ b[0], a[1] ^ b[1]];
    };

    const and64 = (a: [number, number], b: [number, number]): [number, number] => {
      return [a[0] & b[0], a[1] & b[1]];
    };

    const not64 = (x: [number, number]): [number, number] => {
      return [~x[0], ~x[1]];
    };

    const utf8Encode = (str: string): string => {
      return unescape(encodeURIComponent(str));
    };

    str = utf8Encode(str);
    const strBin = str.split('').map(c => c.charCodeAt(0));
    const strLen = strBin.length;
    const strLenBits = strLen * 8;

    // Pre-processing: adding a single 1 bit
    strBin.push(0x80);

    // Pre-processing: padding with zeros
    while (strBin.length % 128 !== 112) {
      strBin.push(0x00);
    }

    // Append original length in bits as 128-bit big-endian integer
    for (let i = 15; i >= 8; i--) {
      strBin.push(0); // High 64 bits are 0 for reasonable message lengths
    }
    for (let i = 7; i >= 0; i--) {
      strBin.push((strLenBits >>> (i * 8)) & 0xff);
    }

    // Initialize hash values
    let h0: [number, number], h1: [number, number], h2: [number, number], h3: [number, number];
    let h4: [number, number], h5: [number, number], h6: [number, number], h7: [number, number];

    if (is384) {
      // SHA-384 initial hash values
      h0 = [0xcbbb9d5d, 0xc1059ed8];
      h1 = [0x629a292a, 0x367cd507];
      h2 = [0x9159015a, 0x3070dd17];
      h3 = [0x152fecd8, 0xf70e5939];
      h4 = [0x67332667, 0xffc00b31];
      h5 = [0x8eb44a87, 0x68581511];
      h6 = [0xdb0c2e0d, 0x64f98fa7];
      h7 = [0x47b5481d, 0xbefa4fa4];
    } else {
      // SHA-512 initial hash values
      h0 = [0x6a09e667, 0xf3bcc908];
      h1 = [0xbb67ae85, 0x84caa73b];
      h2 = [0x3c6ef372, 0xfe94f82b];
      h3 = [0xa54ff53a, 0x5f1d36f1];
      h4 = [0x510e527f, 0xade682d1];
      h5 = [0x9b05688c, 0x2b3e6c1f];
      h6 = [0x1f83d9ab, 0xfb41bd6b];
      h7 = [0x5be0cd19, 0x137e2179];
    }

    // Initialize array of round constants
    const k: [number, number][] = [
      [0x428a2f98, 0xd728ae22], [0x71374491, 0x23ef65cd], [0xb5c0fbcf, 0xec4d3b2f], [0xe9b5dba5, 0x8189dbbc],
      [0x3956c25b, 0xf348b538], [0x59f111f1, 0xb605d019], [0x923f82a4, 0xaf194f9b], [0xab1c5ed5, 0xda6d8118],
      [0xd807aa98, 0xa3030242], [0x12835b01, 0x45706fbe], [0x243185be, 0x4ee4b28c], [0x550c7dc3, 0xd5ffb4e2],
      [0x72be5d74, 0xf27b896f], [0x80deb1fe, 0x3b1696b1], [0x9bdc06a7, 0x25c71235], [0xc19bf174, 0xcf692694],
      [0xe49b69c1, 0x9ef14ad2], [0xefbe4786, 0x384f25e3], [0x0fc19dc6, 0x8b8cd5b5], [0x240ca1cc, 0x77ac9c65],
      [0x2de92c6f, 0x592b0275], [0x4a7484aa, 0x6ea6e483], [0x5cb0a9dc, 0xbd41fbd4], [0x76f988da, 0x831153b5],
      [0x983e5152, 0xee66dfab], [0xa831c66d, 0x2db43210], [0xb00327c8, 0x98fb213f], [0xbf597fc7, 0xbeef0ee4],
      [0xc6e00bf3, 0x3da88fc2], [0xd5a79147, 0x930aa725], [0x06ca6351, 0xe003826f], [0x14292967, 0x0a0e6e70],
      [0x27b70a85, 0x46d22ffc], [0x2e1b2138, 0x5c26c926], [0x4d2c6dfc, 0x5ac42aed], [0x53380d13, 0x9d95b3df],
      [0x650a7354, 0x8baf63de], [0x766a0abb, 0x3c77b2a8], [0x81c2c92e, 0x47edaee6], [0x92722c85, 0x1482353b],
      [0xa2bfe8a1, 0x4cf10364], [0xa81a664b, 0xbc423001], [0xc24b8b70, 0xd0f89791], [0xc76c51a3, 0x0654be30],
      [0xd192e819, 0xd6ef5218], [0xd6990624, 0x5565a910], [0xf40e3585, 0x5771202a], [0x106aa070, 0x32bbd1b8],
      [0x19a4c116, 0xb8d2d0c8], [0x1e376c08, 0x5141ab53], [0x2748774c, 0xdf8eeb99], [0x34b0bcb5, 0xe19b48a8],
      [0x391c0cb3, 0xc5c95a63], [0x4ed8aa4a, 0xe3418acb], [0x5b9cca4f, 0x7763e373], [0x682e6ff3, 0xd6b2b8a3],
      [0x748f82ee, 0x5defb2fc], [0x78a5636f, 0x43172f60], [0x84c87814, 0xa1f0ab72], [0x8cc70208, 0x1a6439ec],
      [0x90befffa, 0x23631e28], [0xa4506ceb, 0xde82bde9], [0xbef9a3f7, 0xb2c67915], [0xc67178f2, 0xe372532b],
      [0xca273ece, 0xea26619c], [0xd186b8c7, 0x21c0c207], [0xeada7dd6, 0xcde0eb1e], [0xf57d4f7f, 0xee6ed178],
      [0x06f067aa, 0x72176fba], [0x0a637dc5, 0xa2c898a6], [0x113f9804, 0xbef90dae], [0x1b710b35, 0x131c471b],
      [0x28db77f5, 0x23047d84], [0x32caab7b, 0x40c72493], [0x3c9ebe0a, 0x15c9bebc], [0x431d67c4, 0x9c100d4c],
      [0x4cc5d4be, 0xcb3e42b6], [0x597f299c, 0xfc657e2a], [0x5fcb6fab, 0x3ad6faec], [0x6c44198c, 0x4a475817]
    ];

    // Process the message in successive 1024-bit chunks
    for (let chunk = 0; chunk < strBin.length; chunk += 128) {
      const w: [number, number][] = [];

      // Break chunk into sixteen 64-bit big-endian words
      for (let i = 0; i < 16; i++) {
        const high = (strBin[chunk + i * 8] << 24) | (strBin[chunk + i * 8 + 1] << 16) |
                     (strBin[chunk + i * 8 + 2] << 8) | strBin[chunk + i * 8 + 3];
        const low = (strBin[chunk + i * 8 + 4] << 24) | (strBin[chunk + i * 8 + 5] << 16) |
                    (strBin[chunk + i * 8 + 6] << 8) | strBin[chunk + i * 8 + 7];
        w[i] = [high, low];
      }

      // Extend the first 16 words into the remaining 64 words
      for (let i = 16; i < 80; i++) {
        const s0 = xor64(xor64(rightRotate64(w[i - 15], 1), rightRotate64(w[i - 15], 8)), rightShift64(w[i - 15], 7));
        const s1 = xor64(xor64(rightRotate64(w[i - 2], 19), rightRotate64(w[i - 2], 61)), rightShift64(w[i - 2], 6));
        w[i] = add64(add64(add64(w[i - 16], s0), w[i - 7]), s1);
      }

      // Initialize working variables
      let a = h0, b = h1, c = h2, d = h3, e = h4, f = h5, g = h6, h = h7;

      // Compression function main loop
      for (let i = 0; i < 80; i++) {
        const s1 = xor64(xor64(rightRotate64(e, 14), rightRotate64(e, 18)), rightRotate64(e, 41));
        const ch = xor64(and64(e, f), and64(not64(e), g));
        const temp1 = add64(add64(add64(add64(h, s1), ch), k[i]), w[i]);
        const s0 = xor64(xor64(rightRotate64(a, 28), rightRotate64(a, 34)), rightRotate64(a, 39));
        const maj = xor64(xor64(and64(a, b), and64(a, c)), and64(b, c));
        const temp2 = add64(s0, maj);

        h = g;
        g = f;
        f = e;
        e = add64(d, temp1);
        d = c;
        c = b;
        b = a;
        a = add64(temp1, temp2);
      }

      // Add the compressed chunk to the current hash value
      h0 = add64(h0, a);
      h1 = add64(h1, b);
      h2 = add64(h2, c);
      h3 = add64(h3, d);
      h4 = add64(h4, e);
      h5 = add64(h5, f);
      h6 = add64(h6, g);
      h7 = add64(h7, h);
    }

    // Produce the final hash value
    const hashArray = is384 ? [h0, h1, h2, h3, h4, h5] : [h0, h1, h2, h3, h4, h5, h6, h7];
    const result = hashArray
      .map(([high, low]) => high.toString(16).padStart(8, '0') + low.toString(16).padStart(8, '0'))
      .join('');

    return format === 'uppercase' ? result.toUpperCase() : result.toLowerCase();
  };

  const handleGenerate = () => {
    if (!inputText.trim()) {
      toast({
        title: "输入为空",
        description: "请输入要生成哈希的文本",
        variant: "destructive",
      });
      return;
    }

    try {
      let hash: string;
      switch (algorithm) {
        case 'sha1':
          hash = sha1(inputText);
          break;
        case 'sha224':
          hash = sha224(inputText);
          break;
        case 'sha256':
          hash = sha256(inputText);
          break;
        case 'sha384':
          hash = sha384(inputText);
          break;
        case 'sha512':
          hash = sha512(inputText);
          break;
        default:
          hash = sha256(inputText);
      }
      setOutputText(hash);
    } catch (error) {
      toast({
        title: "生成失败",
        description: "SHA哈希生成过程中出现错误",
        variant: "destructive",
      });
    }
  };

  const handleCopy = async () => {
    if (!outputText) {
      toast({
        title: "无内容可复制",
        description: "请先生成SHA哈希",
        variant: "destructive",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(outputText);
      toast({
        title: "复制成功",
        description: "SHA哈希已复制到剪贴板",
      });
    } catch (error) {
      toast({
        title: "复制失败",
        description: "请手动复制结果",
        variant: "destructive",
      });
    }
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
  };

  const examples = [
    { label: '简单文本', value: 'Hello World' },
    { label: '中文文本', value: '你好世界' },
    { label: '数字字符', value: '123456789' },
    { label: '特殊字符', value: '!@#$%^&*()_+-=[]{}|;:,.<>?' },
    { label: '空字符串', value: '' },
  ];

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold">SHA哈希生成器</h1>
          </div>
          <p className="text-gray-600">
            生成文本的SHA-1、SHA-224、SHA-256、SHA-384或SHA-512哈希值，用于数据完整性验证和安全应用
          </p>
          <Badge variant="secondary" className="mt-2">编码解码</Badge>
        </div>

        {/* 算法和格式选择 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>哈希设置</CardTitle>
            <CardDescription>选择哈希算法和输出格式</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">哈希算法</label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={algorithm === 'sha1' ? 'default' : 'outline'}
                  onClick={() => setAlgorithm('sha1')}
                  size="sm"
                >
                  SHA-1 (160位)
                </Button>
                <Button
                  variant={algorithm === 'sha224' ? 'default' : 'outline'}
                  onClick={() => setAlgorithm('sha224')}
                  size="sm"
                >
                  SHA-224 (224位)
                </Button>
                <Button
                  variant={algorithm === 'sha256' ? 'default' : 'outline'}
                  onClick={() => setAlgorithm('sha256')}
                  size="sm"
                >
                  SHA-256 (256位)
                </Button>
                <Button
                  variant={algorithm === 'sha384' ? 'default' : 'outline'}
                  onClick={() => setAlgorithm('sha384')}
                  size="sm"
                >
                  SHA-384 (384位)
                </Button>
                <Button
                  variant={algorithm === 'sha512' ? 'default' : 'outline'}
                  onClick={() => setAlgorithm('sha512')}
                  size="sm"
                >
                  SHA-512 (512位)
                </Button>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">输出格式</label>
              <div className="flex gap-2">
                <Button
                  variant={format === 'lowercase' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFormat('lowercase')}
                >
                  小写字母
                </Button>
                <Button
                  variant={format === 'uppercase' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFormat('uppercase')}
                >
                  大写字母
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 输入区域 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>输入文本</CardTitle>
            <CardDescription>输入要生成SHA哈希的文本内容</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="请输入要生成SHA哈希的文本..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[150px] resize-none"
            />
            <div className="flex gap-2 mt-4">
              <Button onClick={handleGenerate}>
                <Shield className="w-4 h-4 mr-2" />
                生成{algorithm.toUpperCase()}哈希
              </Button>
              <Button variant="outline" onClick={handleClear}>
                <RefreshCw className="w-4 h-4 mr-2" />
                清空
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 输出区域 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {algorithm.toUpperCase()}哈希结果
              {outputText && (
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  <Copy className="w-4 h-4 mr-2" />
                  复制
                </Button>
              )}
            </CardTitle>
            <CardDescription>
              生成的{
                algorithm === 'sha1' ? '40位' :
                algorithm === 'sha224' ? '56位' :
                algorithm === 'sha256' ? '64位' :
                algorithm === 'sha384' ? '96位' : '128位'
              }SHA哈希值
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder={`${algorithm.toUpperCase()}哈希结果将显示在这里...`}
              value={outputText}
              readOnly
              className="min-h-[100px] resize-none bg-gray-50 font-mono text-lg"
            />
            {outputText && (
              <div className="mt-2 text-sm text-gray-500">
                长度: {outputText.length} 字符 | 算法: {algorithm.toUpperCase()}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 示例 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>示例</CardTitle>
            <CardDescription>点击示例可快速填入输入框</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {examples.map((example, index) => (
                <div
                  key={index}
                  className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setInputText(example.value)}
                >
                  <div className="font-medium text-sm text-gray-700 mb-1">
                    {example.label}
                  </div>
                  <div className="font-mono text-sm text-gray-600 break-all">
                    {example.value || '(空字符串)'}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* SHA说明 */}
        <Card>
          <CardHeader>
            <CardTitle>SHA哈希说明</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              SHA（Secure Hash Algorithm）是一系列密码散列函数，由美国国家安全局设计，
              广泛用于数据完整性验证和数字签名等安全应用。
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">算法对比：</h4>
              <div className="space-y-2 text-sm">
                <div><strong>SHA-1：</strong>产生160位（40个十六进制字符）哈希值，速度较快但安全性较低</div>
                <div><strong>SHA-224：</strong>产生224位（56个十六进制字符）哈希值，基于SHA-256但输出截断</div>
                <div><strong>SHA-256：</strong>产生256位（64个十六进制字符）哈希值，安全性高，广泛使用</div>
                <div><strong>SHA-384：</strong>产生384位（96个十六进制字符）哈希值，基于SHA-512但输出截断</div>
                <div><strong>SHA-512：</strong>产生512位（128个十六进制字符）哈希值，最高安全性，推荐用于高安全要求场景</div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">SHA特点：</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 不可逆：无法从哈希值反推出原始数据</li>
                <li>• 雪崩效应：输入的微小变化会导致输出的巨大变化</li>
                <li>• 确定性：相同输入总是产生相同输出</li>
                <li>• 抗碰撞：很难找到两个不同输入产生相同输出</li>
              </ul>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold mb-2 text-green-800">安全建议：</h4>
              <p className="text-sm text-green-700">
                对于安全敏感的应用，建议使用SHA-256、SHA-384或SHA-512算法。
                SHA-1已被发现存在理论攻击可能，不建议用于新的安全应用。
                SHA-512在64位系统上性能更好，而SHA-256在32位系统上更优。
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShaHash;