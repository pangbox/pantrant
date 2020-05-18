const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const lut: {[key: string]: number} = {};

for (let [i, c] of Array.from(chars).entries()) {
    lut[c] = i;
}

export function decodeBase64(b64: string): ArrayBuffer {
    let outLen = ((b64.length * 3) / 4) | 0;
    if (b64.length > 0 && b64[b64.length - 1] === "=") {
		outLen--;
		if (b64.length > 1 && b64[b64.length - 2] === "=") {
            outLen--;
        }
    }

    const out = new Uint8Array(outLen);
    for (let i = 0, j = 0; i < b64.length; i+=4) {
		let [a,b,c,d] = Array.from(b64.slice(i, i + 4)).map(n => lut[n]);
		out[j++] = (a << 2) | (b >> 4);
		out[j++] = ((b & 15) << 4) | (c >> 2);
		out[j++] = ((c & 3) << 6) | (d & 63);
    }

    return out.buffer as ArrayBuffer;
};
