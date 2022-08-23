import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as s3 from 'aws-cdk-lib/aws-s3'

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class GithubActionStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const key = new kms.Key(this, 'github-action-kms-key', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      pendingWindow: cdk.Duration.days(7),
      alias: 'alias/mykey',
      description: 'KMS key for encrypting the objects in an S3 bucket',
      enableKeyRotation: false,
    });

    const s3Bucket = new s3.Bucket(this, 'my-bucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      encryption: s3.BucketEncryption.KMS,
      // 👇 encrypt with our KMS key
      encryptionKey: key,
    });

    new cdk.CfnOutput(this, 'key-arn', {
      value: key.keyArn,
    });

    new cdk.CfnOutput(this, 'bucket-name', {
      value: s3Bucket.bucketName,
    });
  }  
}
