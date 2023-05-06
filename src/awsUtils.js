import AWS from 'aws-sdk';
export async function imageUploadHandler(file) {
    const s3 = new AWS.S3({
      region: process.env.REACT_APP_REGION,
      accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
      sessionToken: process.env.REACT_APP_AWS_TOKEN
    });

    const params = {
      Bucket: process.env.REACT_APP_BUCKET_NAME,
      Key: file.name,
      Body: file,
      ContentType: file.type,
    };
    s3.upload(params, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`File uploaded successfully. ${data.Location}`);
      }
    });
  }


