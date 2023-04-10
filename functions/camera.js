const NodeWebcam = require('node-webcam');
const { resolve } = require('path');
const { tempFolder } = require('../index');

const webcam = NodeWebcam.create({
  width: 1280,
  height: 720,
  delay: 0,
  quality: 100,
  output: 'jpeg',
  verbose: false
});

webcam.capture(resolve(tempFolder, 'Camera'));
