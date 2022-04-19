
function bytesToMB(bytes) {
  return (bytes / Math.pow(1024, 2)).toFixed(2).replace(/\.00$/, '');
}

export default bytesToMB;
