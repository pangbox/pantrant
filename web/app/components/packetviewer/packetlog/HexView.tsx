import * as React from "react";

function toHex(i: number, pad: number) {
  return ("0".repeat(pad) + i.toString(0x10)).substr(-pad);
}

interface Props {
  data: ArrayBuffer;
  collapsed: boolean;
}

export const HexView = ({ data, collapsed }: Props) => {
  const array = new Uint8Array(data);

  const addrLines = [];
  const hexLines = [];
  const asciiLines = [];

  let l = array.length;
  if (collapsed && l > 0x40) {
    l = 0x40;
  }

  for (let i = 0; i < l; i += 0x10) {
    let hex = [];
    let ascii = [];

    for (let j = 0; j < 0x10; j++) {
      if (i + j >= array.length) {
        break;
      }
      const c = array[i + j];
      hex.push(
        <span className="byte">
          <span className="hidden">0x</span>
          {toHex(c, 2)}
          <span className="hidden">, </span>
        </span>
      );
      if (c < 0x20) {
        ascii.push(<span className="char bin">.</span>)
      } else if (c > 0x7f) {
        ascii.push(<span className="char bin">.</span>)
      } else {
        ascii.push(<span className="char">{String.fromCharCode(c)}</span>)
      }
    }

    addrLines.push(<div className="addr">{toHex(i, 4)}</div>);
    hexLines.push(<div className="hex">{hex}</div>);
    asciiLines.push(<div className="ascii">{ascii}</div>);
  }

  return (
    <div className="hexedit">
      {addrLines}
      {hexLines}
      {asciiLines}
    </div>
  );
};
