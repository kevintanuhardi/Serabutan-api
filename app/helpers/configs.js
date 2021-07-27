const Moment = require('moment');

const config = require('../../config');

exports.awsConfig = {
  apiVersion: new Moment().format('YYYY/MM/DD'),
  accessKeyId: config.get('AWS').ACCESS_KEY_ID,
  secretAccessKey: config.get('AWS').SECRET_ACCESS_KEY,
  region: process.env.AWS_PROVIDER_REGION || 'ap-southeast-1',
  maxRetries: process.env.AWS_PROVIDER_MAX_RETRIES || 3,
  sslEnabled: process.env.AWS_PROVIDER_ENABLE_SSL || false,
  s3Bucket: config.get('AWS').S3_BUCKET,
};
