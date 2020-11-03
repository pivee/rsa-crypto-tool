function parseTimestampForFileName(timestamp) {
  const splitTimestamp = timestamp.toISOString().split('T');
  const date = splitTimestamp[0];
  const time = splitTimestamp[1].split(':').join('-');
  return `${date}T${time}`;
}

module.exports = { parseTimestampForFileName };
