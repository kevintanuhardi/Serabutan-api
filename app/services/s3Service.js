const S3 = require('aws-sdk/clients/s3');

const { awsConfig } = require('../helpers/configs');

const s3Instance = new S3(awsConfig);

const uploadImage = (
  file,
  subKey,
  folder,
) => {
  const stampTime = Date.now();
  const fileName = `${stampTime}-${subKey}`;
  // const contentType = file.hapi.headers['content-type'];

  const params = {
    Bucket: awsConfig.s3Bucket,
    Key: `${folder}/${fileName}`,
    Body: file,
    ACL: 'public-read',
  };

  return s3Instance.upload(params).promise();
};

module.exports = {
  uploadImage,
};
