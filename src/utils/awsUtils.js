import awsConfig from "../aws-exports";

const { aws_user_files_s3_bucket_region: region, aws_user_files_s3_bucket: bucket } = awsConfig;

export const generateS3Url = (key) => {
  return `https://${bucket}.s3.${region}.amazonaws.com/public/${key}`;
};