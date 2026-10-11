/**
 * Real-Life Cloud Capstone Portfolio Projects (100% AWS Free-Tier & Verified $0 Teardown Workflow)
 * 
 * Specially engineered for aspiring Cloud Engineers, Solutions Architects, and Cloud Security Specialists
 * to build undeniable proof-of-work in personal AWS accounts with zero surprise costs.
 */

export const careerRealityGuide = {
  title: 'The Hard Truth: Why You Can’t Jump Straight to Cloud Security — And How to Break In',
  subtitle: 'The 3-Stage Career Stepping Stone Strategy to Land $140k+ Cloud Security Roles',
  summary: 'Companies rarely hire entry-level candidates directly into pure Cloud Security Engineer roles because security is a high-stakes risk governance function. If you do not understand how cloud systems are built, you cannot defend them. This three-tier project blueprint gives you the exact operational, architectural, and security proof required to shatter the barrier.',
  realities: [
    {
      number: '01',
      title: 'Security is a Function of Trust & Operational Credibility',
      description: 'Hiring managers cannot risk production uptime or customer data by giving administrative security permissions to someone who has never operated a Linux server or configured a VPC routing table. You must prove you can build before you can protect.',
      takeaway: 'Build infrastructure projects first so interviewers see you as a practical builder, not a theoretical auditor.'
    },
    {
      number: '02',
      title: 'Security Without Systems Knowledge Breaks Production',
      description: 'The most disliked security engineers are those who enforce overly restrictive policies that break developer deployments. Elite security engineers understand developer pipelines, container lifecycles, and Terraform state.',
      takeaway: 'Mastering CI/CD and Infrastructure as Code makes you a collaborative DevSecOps partner, not a roadblock.'
    },
    {
      number: '03',
      title: 'The Proven Stepping Stone Pathway',
      description: 'The most reliable path is: 1) Cloud Support / Junior Cloud Engineer ($80k-$100k) -> 2) Cloud Solutions Architect / Platform Engineer ($115k-$140k) -> 3) Cloud Security Engineer / DevSecOps Specialist ($150k-$190k+).',
      takeaway: 'Building all 3 tracks in this portfolio lets you skip years of entry-level helpdesk by demonstrating end-to-end senior capability.'
    }
  ],
  steppingStones: [
    {
      stage: 'STAGE 1: BUILD',
      role: 'Cloud Engineer',
      focus: 'Compute, Networking, Linux, Terraform, Operational Monitoring',
      description: 'Demonstrates you can launch reliable virtual networks, configure multi-AZ compute, automate deployment with Terraform, and administer servers without open SSH ports.'
    },
    {
      stage: 'STAGE 2: SCALE & DESIGN',
      role: 'Cloud Solutions Architect',
      focus: 'High Availability, Multi-Region DR, Decoupled Microservices, FinOps Cost Controls',
      description: 'Proves you can architect resilient, fault-tolerant architectures that survive regional disasters and optimize cloud spending to save companies thousands of dollars.'
    },
    {
      stage: 'STAGE 3: HARDEN & DEFEND',
      role: 'Cloud Security Engineer',
      focus: 'Zero Trust IAM, Automated Incident Response, Threat Detection, OIDC Federation, Storage DLP',
      description: 'Proves you can detect active intrusions, auto-quarantine compromised keys in <200ms, eliminate static secrets from CI/CD, and audit compliance against CIS Benchmarks.'
    }
  ]
};

export const zeroBillingGuide = {
  title: 'The AWS Zero-Billing & Free Tier Safety Protocol',
  description: 'How to practice real cloud engineering and security in your personal AWS account with 100% confidence and zero surprise bills.',
  rules: [
    {
      title: 'Set a $0.01 AWS Budget Alarm (Mandatory First Step)',
      description: 'AWS Budgets allows 2 free budgets. Create an alert set to $0.01 threshold with an email notification. The instant a billable cent is accrued, you get an immediate email alert.',
      command: `aws budgets create-budget --account-id $(aws sts get-caller-identity --query Account --output text) --budget '{"BudgetName":"ZeroDollarSafetyAlert","BudgetLimit":{"Amount":"0.01","Unit":"USD"},"CostTypes":{"IncludeTax":true,"IncludeSubscription":true,"UseBlended":false},"TimeUnit":"MONTHLY","BudgetType":"COST_FILTERED"}' --notifications-with-subscribers '[{"Notification":{"NotificationType":"ACTUAL","ComparisonOperator":"GREATER_THAN","Threshold":100,"ThresholdType":"PERCENTAGE"},"Subscribers":[{"SubscriptionType":"EMAIL","Address":"your-email@example.com"}]}]'`
    },
    {
      title: 'Know the Dangerous Expensive AWS Traps (Blacklist)',
      description: 'Never create in personal practice: NAT Gateways ($0.045/hr = $32/mo), Transit Gateway attachments ($0.05/hr = $36/mo), KMS Customer Managed Keys ($1/mo/key if kept beyond free tier), unassociated Elastic IPs ($0.005/hr), or idle RDS Multi-AZ databases.',
      freeTierAlternatives: 'Use VPC Endpoints (S3 Gateway endpoint is 100% free), default AWS managed keys (aws/s3 is free), and t2.micro / t3.micro EC2 instances (750 hours/month free).'
    },
    {
      title: 'Execute Immediate Tear-Down After Lab Completion',
      description: 'Once you take screenshots and terminal output for your portfolio, run the project cleanup script immediately. Never leave test infrastructure running overnight.'
    },
    {
      title: 'Use CloudWatch Billing Alarm as a Secondary Safety Net',
      description: 'Enable Billing Metrics in us-east-1 and set a CloudWatch Alarm at $1.00 USD to catch any rogue resources across all AWS regions.',
      command: `aws cloudwatch put-metric-alarm --alarm-name StopBillingSurprise --metric-name EstimatedCharges --namespace AWS/Billing --statistic Maximum --period 21600 --threshold 1 --comparison-operator GreaterThanThreshold --dimensions Name=Currency,Value=USD --evaluation-periods 1`
    }
  ]
};

export const cloudProjects = [
  // ===========================================================================
  // TRACK 1: CLOUD ENGINEER PROJECTS (BUILD & OPERATE)
  // ===========================================================================
  {
    id: 'proj-ce-ha-autoscaling',
    number: 'PROJECT-01',
    title: 'Multi-AZ Auto-Scaling Web Infrastructure with SSM Bastionless Ops',
    role: 'Cloud Engineer / Systems Administrator',
    track: 'cloud-engineer',
    trackLabel: 'Cloud Engineer Track',
    difficulty: 'Intermediate',
    estimatedTime: '45 mins',
    cost: '$0.00 (100% AWS Free Tier)',
    freeTierQuota: 'Amazon EC2 (750 hours/month of t2.micro/t3.micro), Amazon VPC (Free), AWS Systems Manager (Free)',
    businessProblem: 'Exposing port 22 (SSH) to the public internet or relying on single-AZ virtual machines leads to automated brute-force attacks and catastrophic downtime during data center maintenance. Modern cloud engineering mandates zero-open-inbound bastionless operations via AWS Systems Manager and high-availability Auto Scaling Groups with automated health check recovery.',
    architectureSummary: 'Internet-facing Application Load Balancer -> Multi-AZ Public/Private Subnets -> Auto Scaling Group (EC2 t2.micro Amazon Linux 2023) -> SSM Core IAM Role (Zero open SSH ports!) -> CloudWatch Alarm for CPU Scaling & Unhealthy Host Replacement.',
    architectureSteps: [
      '1. Create a custom 2-AZ Virtual Private Cloud (VPC) with isolated public and private subnets.',
      '2. Author an IAM instance profile with AmazonSSMManagedInstanceCore (enabling secure browser-based CLI access without SSH keys).',
      '3. Configure an EC2 Launch Template with dynamic Apache user-data and strict Security Groups (allowing HTTP only from ALB).',
      '4. Deploy an Auto Scaling Group across multiple Availability Zones with Target Tracking Scaling (target 60% CPU).',
      '5. Connect to the instances securely via AWS Systems Manager Session Manager, test stress load, and verify auto-healing.'
    ],
    stepByStepBuild: [
      {
        step: 1,
        title: 'Create the Least-Privilege SSM Instance Role',
        consolePath: 'AWS Console > IAM > Roles > Create Role > AWS Service: EC2 > Attach: AmazonSSMManagedInstanceCore',
        cliCommand: `aws iam create-role --role-name EC2-SSM-Bastionless-Role --assume-role-policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"ec2.amazonaws.com"},"Action":"sts:AssumeRole"}]}' && aws iam attach-role-policy --role-name EC2-SSM-Bastionless-Role --policy-arn arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore && aws iam create-instance-profile --instance-profile-name EC2-SSM-Instance-Profile && aws iam add-role-to-instance-profile --instance-profile-name EC2-SSM-Instance-Profile --role-name EC2-SSM-Bastionless-Role`,
        explanation: 'Enables encrypted browser/CLI terminal sessions without storing static private SSH keys or opening inbound port 22 to the world.'
      },
      {
        step: 2,
        title: 'Create Security Group with ZERO Inbound SSH Rules',
        consolePath: 'AWS Console > VPC > Security Groups > Create Security Group: Allow HTTP 80 from anywhere, 0 SSH rules',
        cliCommand: `VPC_ID=$(aws ec2 describe-vpcs --filter "Name=isDefault,Values=true" --query "Vpcs[0].VpcId" --output text) && SG_ID=$(aws ec2 create-security-group --group-name Web-App-ZeroSSH-SG --description "Zero SSH Inbound Web Security Group" --vpc-id $VPC_ID --output text) && aws ec2 authorize-security-group-ingress --group-id $SG_ID --protocol tcp --port 80 --cidr 0.0.0.0/0`,
        explanation: 'Notice: Port 22 is completely omitted. Attackers scanning your IP find zero administrative entry points.'
      },
      {
        step: 3,
        title: 'Create EC2 Launch Template with Auto-Configuration User Data',
        consolePath: 'AWS Console > EC2 > Launch Templates > Create template: Amazon Linux 2023, t2.micro, attach SSM profile and user-data',
        codeSnippet: `#!/bin/bash
dnf update -y
dnf install -y httpd
systemctl start httpd
systemctl enable httpd
TOKEN=$(curl -s -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600")
INSTANCE_ID=$(curl -s -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/instance-id)
AZ=$(curl -s -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/placement/availability-zone)
echo "<h1>Cloud Engineering Capstone: High-Availability Web App</h1><p>Served by: $INSTANCE_ID in $AZ</p>" > /var/www/html/index.html`,
        cliCommand: `aws ec2 create-launch-template --launch-template-name HA-Web-Template --version-description "v1" --launch-template-data '{"ImageId":"resolve:ssm:/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64","InstanceType":"t2.micro","IamInstanceProfile":{"Name":"EC2-SSM-Instance-Profile"},"SecurityGroupIds":["'$SG_ID'"]}'`,
        explanation: 'Uses IMDSv2 secure session tokens to dynamically extract node metadata and serve diagnostic server headers.'
      },
      {
        step: 4,
        title: 'Connect to EC2 via AWS Systems Manager Session Manager',
        consolePath: 'AWS Console > EC2 > Instances > Select instance > Connect > Session Manager > Connect',
        cliCommand: 'aws ssm start-session --target i-0123456789abcdef0',
        explanation: 'Transfers shell sessions over AWS TLS tunnels, fully logged in CloudTrail and Systems Manager Session history.'
      }
    ],
    tearDownRunbook: {
      zeroCostPromise: 'Terminating test instances and deleting the launch template guarantees 0 ongoing compute charges.',
      cliCommands: [
        'aws ec2 delete-launch-template --launch-template-name HA-Web-Template',
        'aws iam remove-role-from-instance-profile --instance-profile-name EC2-SSM-Instance-Profile --role-name EC2-SSM-Bastionless-Role',
        'aws iam delete-instance-profile --instance-profile-name EC2-SSM-Instance-Profile',
        'aws iam detach-role-policy --role-name EC2-SSM-Bastionless-Role --policy-arn arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore',
        'aws iam delete-role --role-name EC2-SSM-Bastionless-Role'
      ],
      consoleSteps: [
        '1. Go to EC2 > Instances > Terminate any test instances.',
        '2. Go to EC2 > Launch Templates > Delete `HA-Web-Template`.',
        '3. Go to IAM > Roles > Delete `EC2-SSM-Bastionless-Role`.'
      ]
    },
    portfolioGuide: {
      githubTitle: 'AWS Multi-AZ Resilient Web Architecture with SSM Bastionless Operations',
      resumeBullets: [
        'Designed and provisioned a highly available 2-tier web infrastructure spanning multiple Availability Zones using EC2 Auto Scaling and Application Load Balancers.',
        'Eliminated public administrative attack vectors by establishing bastionless operations via AWS Systems Manager Session Manager, closing inbound SSH port 22.',
        'Authored cloud-init automation scripts enforcing IMDSv2 session tokens and configured CloudWatch alarms for automated instance replacement.'
      ],
      interviewDiscussionPoints: 'When asked how you manage Linux servers in AWS, explain that traditional bastion jump boxes with SSH keys are an antipattern because keys leak and ports are scanned. SSM Session Manager provides IAM-governed, audit-logged shell access with zero public IPs.'
    }
  },

  {
    id: 'proj-ce-serverless-dynamo',
    number: 'PROJECT-02',
    title: 'Serverless Event-Driven Microservice with DynamoDB & Dead-Letter Queue (DLQ)',
    role: 'Cloud Engineer / Serverless Specialist',
    track: 'cloud-engineer',
    trackLabel: 'Cloud Engineer Track',
    difficulty: 'Beginner / Intermediate',
    estimatedTime: '35 mins',
    cost: '$0.00 (100% AWS Free Tier)',
    freeTierQuota: 'AWS Lambda (1M free requests/mo), Amazon DynamoDB (25 GB free storage), Amazon SQS (1M free requests/mo)',
    businessProblem: 'Monolithic APIs suffer from cascading failures and silent message loss during traffic surges. If a database is overloaded, incoming HTTP requests fail, corrupting customer orders. Cloud engineers solve this by building event-driven serverless architectures with decoupled asynchronous queues and Dead-Letter Queues (DLQs) for resilient error handling.',
    architectureSummary: 'Amazon API Gateway (HTTP API) -> AWS Lambda (Python 3.12 CRUD Handler) -> Amazon DynamoDB (On-Demand / Free Tier RCU/WCU) -> Amazon SQS Dead-Letter Queue (DLQ) -> CloudWatch Metric Alarm.',
    architectureSteps: [
      '1. Create a DynamoDB table with partition key `order_id` and On-Demand billing capacity.',
      '2. Create an Amazon SQS Dead-Letter Queue (DLQ) to capture unparseable or failed messages.',
      '3. Deploy an AWS Lambda Python 3.12 function with structured error handling and DLQ redirection.',
      '4. Connect an Amazon API Gateway HTTP API endpoint to trigger the Lambda function.',
      '5. Inject simulated error payloads and verify that failed events land safely in the SQS DLQ for investigation.'
    ],
    stepByStepBuild: [
      {
        step: 1,
        title: 'Create DynamoDB Orders Table',
        consolePath: 'AWS Console > DynamoDB > Tables > Create Table > Name: OrdersTable > Partition key: order_id (String)',
        cliCommand: 'aws dynamodb create-table --table-name OrdersTable --attribute-definitions AttributeName=order_id,AttributeType=S --key-schema AttributeName=order_id,KeyType=HASH --billing-mode PAY_PER_REQUEST',
        explanation: 'PAY_PER_REQUEST ensures you pay $0 when the table is not being actively queried, remaining inside the AWS Free Tier.'
      },
      {
        step: 2,
        title: 'Create SQS Dead-Letter Queue (DLQ)',
        consolePath: 'AWS Console > SQS > Create Queue > Name: Orders-DLQ > Standard Queue',
        cliCommand: 'aws sqs create-queue --queue-name Orders-DLQ',
        explanation: 'Stores failed or malformed transaction events so that zero customer data is ever permanently dropped.'
      },
      {
        step: 3,
        title: 'Deploy Serverless Order Processing Python Lambda',
        consolePath: 'AWS Console > Lambda > Create Function > Python 3.12 > Paste Boto3 CRUD code',
        codeSnippet: `import json
import boto3
import os
import uuid

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('OrdersTable')

def lambda_handler(event, context):
    try:
        body = json.loads(event.get('body', '{}'))
        order_id = body.get('order_id', str(uuid.uuid4()))
        customer = body.get('customer', 'Guest')
        amount = body.get('amount', 0.0)
        
        table.put_item(Item={
            'order_id': order_id,
            'customer': customer,
            'amount': str(amount),
            'status': 'PROCESSED'
        })
        
        return {
            'statusCode': 201,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'message': 'Order processed successfully', 'order_id': order_id})
        }
    except Exception as e:
        print(f"ERROR: {str(e)}")
        return {'statusCode': 500, 'body': json.dumps({'error': 'Processing failed'})}`,
        cliCommand: 'zip lambda.zip index.py && aws lambda create-function --function-name OrderProcessor --runtime python3.12 --role arn:aws:iam::123456789012:role/LambdaBasicExec --handler index.lambda_handler --zip-file fileb://lambda.zip',
        explanation: 'Processes orders in single-digit milliseconds with zero server patching, auto-scaling up and down to zero.'
      }
    ],
    tearDownRunbook: {
      zeroCostPromise: 'Delete the DynamoDB table, SQS queue, and Lambda function with 3 instant commands.',
      cliCommands: [
        'aws dynamodb delete-table --table-name OrdersTable',
        'aws sqs delete-queue --queue-url $(aws sqs get-queue-url --queue-name Orders-DLQ --query QueueUrl --output text)',
        'aws lambda delete-function --function-name OrderProcessor'
      ],
      consoleSteps: [
        '1. Go to DynamoDB > Tables > Select `OrdersTable` > Delete.',
        '2. Go to SQS > Queues > Select `Orders-DLQ` > Delete.',
        '3. Go to Lambda > Functions > Select `OrderProcessor` > Actions > Delete.'
      ]
    },
    portfolioGuide: {
      githubTitle: 'AWS Serverless Microservice with DynamoDB & Fault-Tolerant DLQ Architecture',
      resumeBullets: [
        'Engineered an event-driven serverless order processing microservice utilizing Amazon API Gateway, AWS Lambda, and Amazon DynamoDB, scaling dynamically from 0 to 1,000+ requests/second.',
        'Architected fault-tolerant asynchronous error handling using Amazon SQS Dead-Letter Queues (DLQ), ensuring zero transaction loss during downstream outages.',
        'Implemented least-privilege IAM execution roles and structured JSON application logging with Amazon CloudWatch.'
      ],
      interviewDiscussionPoints: 'Explain why On-Demand DynamoDB billing is ideal for unpredictable spiky workloads, and how Dead-Letter Queues decouple producer ingestion from consumer repair pipelines.'
    }
  },

  {
    id: 'proj-ce-terraform-pipeline',
    number: 'PROJECT-03',
    title: 'Multi-Environment Terraform IaC Pipeline with S3 Remote State & Concurrency Locking',
    role: 'Cloud Platform / DevOps Engineer',
    track: 'cloud-engineer',
    trackLabel: 'Cloud Engineer Track',
    difficulty: 'Intermediate',
    estimatedTime: '40 mins',
    cost: '$0.00 (100% AWS Free Tier)',
    freeTierQuota: 'Amazon S3 (5 GB Storage, 20,000 GET requests), Amazon DynamoDB (25 GB free storage)',
    businessProblem: 'Managing infrastructure through the AWS Management Console leads to configuration drift, lack of peer review, untracked changes, and catastrophic race conditions where two engineers overwrite each other\'s resources. Production infrastructure must be defined as version-controlled code with cryptographically locked remote state.',
    architectureSummary: 'Terraform Modular Code -> S3 Remote State Bucket (AES-256 Encryption & Versioning) -> DynamoDB Concurrency State Lock Table -> Automated Pre-Commit Linting (terraform fmt & checkov).',
    architectureSteps: [
      '1. Create a dedicated private S3 bucket with strict versioning and AES-256 encryption to hold `terraform.tfstate`.',
      '2. Create a DynamoDB table with primary key `LockID` for distributed state locking.',
      '3. Configure Terraform `backend "s3"` block with server-side encryption and locking parameters.',
      '4. Author clean, reusable Terraform modules (`vpc`, `subnets`, `security_group`).',
      '5. Execute `terraform apply`, simulate concurrent runs to verify lock prevention, and inspect state files.'
    ],
    stepByStepBuild: [
      {
        step: 1,
        title: 'Create the Encrypted S3 State Bucket & DynamoDB Lock Table',
        consolePath: 'AWS Console > S3 > Create Bucket (versioned) & DynamoDB > Create Table: terraform-locks (LockID String)',
        cliCommand: `aws s3api create-bucket --bucket terraform-state-vault-$(aws sts get-caller-identity --query Account --output text) --region us-east-1 && aws s3api put-bucket-versioning --bucket terraform-state-vault-$(aws sts get-caller-identity --query Account --output text) --versioning-configuration Status=Enabled && aws dynamodb create-table --table-name terraform-locks --attribute-definitions AttributeName=LockID,AttributeType=S --key-schema AttributeName=LockID,KeyType=HASH --billing-mode PAY_PER_REQUEST`,
        explanation: 'Versioning ensures you can roll back state in case of state file corruption, while DynamoDB blocks overlapping writes.'
      },
      {
        step: 2,
        title: 'Configure Remote S3 Backend in Terraform',
        consolePath: 'In your project directory: create backend.tf',
        codeSnippet: `terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  backend "s3" {
    bucket         = "terraform-state-vault-REPLACE_ACCOUNT"
    key            = "prod/infrastructure.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}`,
        cliCommand: 'terraform init',
        explanation: 'During terraform init, Terraform connects to S3 and DynamoDB, confirming remote state storage and locking capability.'
      },
      {
        step: 3,
        title: 'Deploy Modular VPC Infrastructure Code',
        consolePath: 'Create main.tf with modular resource definitions',
        codeSnippet: `resource "aws_vpc" "production" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "prod-network"
    Environment = "production"
    ManagedBy   = "Terraform"
  }
}

resource "aws_subnet" "public_1a" {
  vpc_id            = aws_vpc.production.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "us-east-1a"

  tags = {
    Name = "prod-public-1a"
  }
}`,
        cliCommand: 'terraform plan -out=tfplan && terraform apply tfplan',
        explanation: 'Generates a deterministic execution plan, acquires DynamoDB lock, executes API calls, and securely commits the new state to S3.'
      }
    ],
    tearDownRunbook: {
      zeroCostPromise: 'Running terraform destroy cleanly deletes all provisioned resources in reverse dependency order.',
      cliCommands: [
        'terraform destroy -auto-approve',
        'aws s3 rb s3://terraform-state-vault-$(aws sts get-caller-identity --query Account --output text) --force',
        'aws dynamodb delete-table --table-name terraform-locks'
      ],
      consoleSteps: [
        '1. Run `terraform destroy` in your terminal.',
        '2. Empty and delete the S3 state bucket.',
        '3. Delete the `terraform-locks` DynamoDB table.'
      ]
    },
    portfolioGuide: {
      githubTitle: 'Production Terraform Infrastructure as Code Pipeline with S3 Remote State & Concurrency Locking',
      resumeBullets: [
        'Architected an enterprise Infrastructure as Code (IaC) provisioning pipeline in Terraform, enforcing remote state storage in encrypted S3 and concurrency locking via DynamoDB.',
        'Eliminated infrastructure configuration drift and deployment race conditions across multi-developer environments.',
        'Integrated automated pre-commit hooks for Terraform syntax formatting, linting (tflint), and security scanning (Checkov).'
      ],
      interviewDiscussionPoints: 'Explain the disaster scenario of local terraform.tfstate: if multiple engineers apply changes simultaneously without DynamoDB locking, state files get overwritten and resources become orphaned in AWS, leading to silent costs and outages.'
    }
  },

  // ===========================================================================
  // TRACK 2: CLOUD SOLUTIONS ARCHITECT PROJECTS (SCALE & DESIGN)
  // ===========================================================================
  {
    id: 'proj-csa-multi-region-dr',
    number: 'PROJECT-04',
    title: 'Multi-Region Active-Passive Disaster Recovery (Pilot Light) with Automated Health Checks',
    role: 'Cloud Solutions Architect',
    track: 'solutions-architect',
    trackLabel: 'Cloud Solutions Architect Track',
    difficulty: 'Advanced',
    estimatedTime: '50 mins',
    cost: '$0.00 (100% AWS Free Tier)',
    freeTierQuota: 'Amazon S3 (5 GB Storage Free), Amazon CloudWatch (10 Free Alarms), Route 53 (Mock verification)',
    businessProblem: 'Regional cloud outages (e.g. AWS us-east-1 fiber cuts or control plane outages) can shut down businesses for hours. Enterprise solutions architects must design verified Disaster Recovery (DR) architectures that satisfy strict business Recovery Time Objectives (RTO < 15 mins) and Recovery Point Objectives (RPO < 5 mins) without doubling operating expenses.',
    architectureSummary: 'Primary Region (us-east-1) Application -> S3 Cross-Region Replication (CRR) -> Secondary Disaster Recovery Region (us-west-2) -> Synthetic CloudWatch Endpoint Health Monitor -> Automated Failover Routing.',
    architectureSteps: [
      '1. Create Primary S3 Application Bucket in us-east-1 and Secondary DR Bucket in us-west-2.',
      '2. Configure an IAM Role for S3 Cross-Region Replication (CRR) with minimum required permissions.',
      '3. Enable Cross-Region Replication to continuously synchronize objects between us-east-1 and us-west-2.',
      '4. Configure a CloudWatch Synthetic Health Check monitoring the primary application endpoint.',
      '5. Simulate a primary region disaster, verify automated data synchronization, and document RTO/RPO calculation.'
    ],
    stepByStepBuild: [
      {
        step: 1,
        title: 'Create Primary and Secondary DR S3 Buckets',
        consolePath: 'AWS Console > S3 > Create Bucket: primary-vault-us-east-1 & secondary-vault-us-west-2 (Enable Versioning on both)',
        cliCommand: `ACC_ID=$(aws sts get-caller-identity --query Account --output text) && aws s3api create-bucket --bucket dr-primary-vault-$ACC_ID --region us-east-1 && aws s3api put-bucket-versioning --bucket dr-primary-vault-$ACC_ID --versioning-configuration Status=Enabled && aws s3api create-bucket --bucket dr-secondary-vault-$ACC_ID --region us-west-2 --create-bucket-configuration LocationConstraint=us-west-2 && aws s3api put-bucket-versioning --bucket dr-secondary-vault-$ACC_ID --versioning-configuration Status=Enabled`,
        explanation: 'Versioning is an absolute prerequisite for Amazon S3 Cross-Region Replication.'
      },
      {
        step: 2,
        title: 'Create IAM Cross-Region Replication Role',
        consolePath: 'AWS Console > IAM > Roles > Create Role > Service: S3 > Policy: Replicate objects to secondary bucket',
        cliCommand: `aws iam create-role --role-name S3-CRR-Replication-Role --assume-role-policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"s3.amazonaws.com"},"Action":"sts:AssumeRole"}]}'`,
        explanation: 'Grants the Amazon S3 service authority to replicate encrypted objects across distinct AWS geographic boundaries.'
      },
      {
        step: 3,
        title: 'Enable S3 Cross-Region Replication (CRR) Rule',
        consolePath: 'AWS Console > S3 > Primary Bucket > Management > Replication rules > Create replication rule: replicate all objects to secondary',
        cliCommand: `aws s3api put-bucket-replication --bucket dr-primary-vault-$ACC_ID --replication-configuration '{"Role":"arn:aws:iam::'$ACC_ID':role/S3-CRR-Replication-Role","Rules":[{"Status":"Enabled","Priority":1,"DeleteMarkerReplication":{"Status":"Disabled"},"Filter":{},"Destination":{"Bucket":"arn:aws:s3:::dr-secondary-vault-'$ACC_ID'"}}]}'`,
        explanation: 'Objects written to us-east-1 are asynchronously copied to us-west-2 within seconds, establishing an RPO under 1 minute.'
      }
    ],
    tearDownRunbook: {
      zeroCostPromise: 'Empty and delete both test buckets and replication role to ensure zero residual storage.',
      cliCommands: [
        'ACC_ID=$(aws sts get-caller-identity --query Account --output text)',
        'aws s3 rb s3://dr-primary-vault-$ACC_ID --force',
        'aws s3 rb s3://dr-secondary-vault-$ACC_ID --force',
        'aws iam delete-role --role-name S3-CRR-Replication-Role'
      ],
      consoleSteps: [
        '1. Go to S3 > Delete `dr-primary-vault-...`.',
        '2. Go to S3 > Delete `dr-secondary-vault-...`.',
        '3. Go to IAM > Roles > Delete `S3-CRR-Replication-Role`.'
      ]
    },
    portfolioGuide: {
      githubTitle: 'AWS Multi-Region Pilot Light Disaster Recovery Architecture with S3 CRR & Failover',
      resumeBullets: [
        'Architected a multi-region active-passive (Pilot Light) disaster recovery architecture spanning AWS us-east-1 and us-west-2, achieving an RTO of <15 minutes and RPO of <2 minutes.',
        'Implemented Amazon S3 Cross-Region Replication (CRR) with least-privilege IAM service roles and bucket versioning.',
        'Authored comprehensive disaster recovery game-day runbooks and calculated financial cost trade-offs across Pilot Light vs Warm Standby strategies.'
      ],
      interviewDiscussionPoints: 'Be ready to explain the 4 AWS Disaster Recovery strategies: Backup & Restore (hours RTO), Pilot Light (minutes RTO, minimal secondary cost), Warm Standby (scaled-down secondary active), and Multi-Site Active/Active (zero RTO, highest cost).'
    }
  },

  {
    id: 'proj-csa-fanout-pipeline',
    number: 'PROJECT-05',
    title: 'Scalable Asynchronous Fan-Out Pipeline: Amazon SNS, Multi-Consumer SQS & Worker Decoupling',
    role: 'Cloud Solutions Architect / Microservices',
    track: 'solutions-architect',
    trackLabel: 'Cloud Solutions Architect Track',
    difficulty: 'Intermediate / Advanced',
    estimatedTime: '40 mins',
    cost: '$0.00 (100% AWS Free Tier)',
    freeTierQuota: 'Amazon SNS (1M free publishes/mo), Amazon SQS (1M free requests/mo), AWS Lambda (1M free requests/mo)',
    businessProblem: 'In modern cloud architectures, when an event occurs (e.g. customer sign-up or order placed), multiple independent systems must react: billing, fraud detection, analytics, and notification. Directly calling these services synchronously causes slow response times, tight coupling, and total system failure if any single downstream service experiences an outage.',
    architectureSummary: 'Producer Client -> Amazon SNS Topic (Publisher) -> Fan-out to 3 Distinct Amazon SQS Queues (Fraud Queue, Notification Queue, Analytics Queue) -> Independent Asynchronous Lambda Workers -> SQS Redrive Policy.',
    architectureSteps: [
      '1. Create an Amazon SNS Topic `OrderEventsTopic` as the central event distribution hub.',
      '2. Create three independent Amazon SQS queues: `Orders-Fraud-Queue`, `Orders-Notification-Queue`, `Orders-Analytics-Queue`.',
      '3. Subscribe all three SQS queues to the SNS Topic (establishing the Fan-Out pattern).',
      '4. Configure SNS Message Filtering (e.g. only high-value orders route to Fraud queue).',
      '5. Publish a single test event to SNS and verify that all queues receive independent, decoupled copies simultaneously.'
    ],
    stepByStepBuild: [
      {
        step: 1,
        title: 'Create the SNS Central Event Topic',
        consolePath: 'AWS Console > SNS > Topics > Create Topic > Type: Standard > Name: OrderEventsTopic',
        cliCommand: 'TOPIC_ARN=$(aws sns create-topic --name OrderEventsTopic --query TopicArn --output text)',
        explanation: 'SNS decouples event publishers from subscribers, allowing publishers to send one message that fans out to many consumers.'
      },
      {
        step: 2,
        title: 'Create Three Subscribed SQS Queues',
        consolePath: 'AWS Console > SQS > Create Queues: Orders-Fraud-Queue, Orders-Notification-Queue, Orders-Analytics-Queue',
        cliCommand: 'aws sqs create-queue --queue-name Orders-Fraud-Queue && aws sqs create-queue --queue-name Orders-Notification-Queue && aws sqs create-queue --queue-name Orders-Analytics-Queue',
        explanation: 'Each consumer system has its own dedicated buffer queue, preventing slow consumers from blocking other systems.'
      },
      {
        step: 3,
        title: 'Subscribe Queues to the SNS Topic',
        consolePath: 'AWS Console > SNS > Subscriptions > Create Subscription > Protocol: SQS',
        cliCommand: `FRAUD_ARN=$(aws sqs get-queue-attributes --queue-url $(aws sqs get-queue-url --queue-name Orders-Fraud-Queue --query QueueUrl --output text) --attribute-names QueueArn --query Attributes.QueueArn --output text) && aws sns subscribe --topic-arn $TOPIC_ARN --protocol sqs --notification-endpoint $FRAUD_ARN`,
        explanation: 'AWS automatically forwards every message published to the SNS topic into the SQS queue.'
      }
    ],
    tearDownRunbook: {
      zeroCostPromise: 'Delete the SNS topic and 3 SQS queues with simple CLI commands.',
      cliCommands: [
        `aws sns delete-topic --topic-arn $(aws sns list-topics --query "Topics[?contains(TopicArn, 'OrderEventsTopic')].TopicArn" --output text)`,
        'aws sqs delete-queue --queue-url $(aws sqs get-queue-url --queue-name Orders-Fraud-Queue --query QueueUrl --output text)',
        'aws sqs delete-queue --queue-url $(aws sqs get-queue-url --queue-name Orders-Notification-Queue --query QueueUrl --output text)',
        'aws sqs delete-queue --queue-url $(aws sqs get-queue-url --queue-name Orders-Analytics-Queue --query QueueUrl --output text)'
      ],
      consoleSteps: [
        '1. Go to SNS > Topics > Delete `OrderEventsTopic`.',
        '2. Go to SQS > Queues > Delete all 3 `Orders-...` queues.'
      ]
    },
    portfolioGuide: {
      githubTitle: 'AWS Scalable Event-Driven Fan-Out Messaging Architecture with Amazon SNS & SQS',
      resumeBullets: [
        'Architected a decoupled, event-driven asynchronous fan-out messaging pipeline utilizing Amazon SNS and Amazon SQS, eliminating synchronous HTTP blocking.',
        'Implemented SNS subscription filter policies to route high-value transactional events selectively to dedicated fraud detection workers.',
        'Designed Dead-Letter Queue (DLQ) redrive policies ensuring zero message loss and complete fault isolation across microservices.'
      ],
      interviewDiscussionPoints: 'Explain the difference between Amazon SNS (push, pub/sub, multiple subscribers, ephemeral) and Amazon SQS (pull, queue, single consumer per message, durable buffer). Combining them yields the classic AWS Fan-Out pattern.'
    }
  },

  {
    id: 'proj-csa-finops-optimizer',
    number: 'PROJECT-06',
    title: 'Cloud Financial Management & Automated Cost Optimization Guardrail Engine',
    role: 'Cloud Solutions Architect / FinOps Engineer',
    track: 'solutions-architect',
    trackLabel: 'Cloud Solutions Architect Track',
    difficulty: 'Intermediate',
    estimatedTime: '35 mins',
    cost: '$0.00 (100% AWS Free Tier)',
    freeTierQuota: 'AWS Lambda (1M free requests), Amazon EventBridge (Free), Amazon SNS (1M free publishes)',
    businessProblem: 'Over 30% of enterprise cloud spend is wasted on abandoned resources: unattached EBS volumes ($0.10/GB/month), unassociated Elastic IPs ($3.60/month each), unpruned old snapshots, and idle staging instances. Hiring managers love architects who understand FinOps and can automatically audit and remediate cloud waste.',
    architectureSummary: 'Amazon EventBridge (Scheduled Weekly Trigger) -> Python FinOps Audit Lambda -> Scans EC2 API for unattached EBS volumes and unassociated EIPs -> Generates Cost Optimization Scorecard -> Publishes SNS Email Summary to Management.',
    architectureSteps: [
      '1. Create an IAM execution role granting read-only access to EC2, EBS, and Cost Explorer APIs.',
      '2. Author a Python 3.12 Boto3 FinOps scanner function calculating monthly dollar savings.',
      '3. Configure Amazon EventBridge Cron rule (`cron(0 9 ? * MON *)`) to trigger the audit every Monday morning.',
      '4. Connect an Amazon SNS topic sending executive cost optimization summaries to team leads.',
      '5. Run a test scan and inspect the generated JSON savings scorecard.'
    ],
    stepByStepBuild: [
      {
        step: 1,
        title: 'Create Least-Privilege FinOps Audit IAM Role',
        consolePath: 'AWS Console > IAM > Roles > Create Role > Lambda > Custom Policy with ec2:Describe* permissions',
        cliCommand: `aws iam create-role --role-name FinOps-CostAudit-Role --assume-role-policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"lambda.amazonaws.com"},"Action":"sts:AssumeRole"}]}' && aws iam put-role-policy --role-name FinOps-CostAudit-Role --policy-name ReadOnlyEC2 --policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":["ec2:DescribeVolumes","ec2:DescribeAddresses","ec2:DescribeSnapshots","logs:CreateLogGroup","logs:CreateLogStream","logs:PutLogEvents"],"Resource":"*"}]}'`,
        explanation: 'Enforces strict read-only auditing permissions: the function inspects resources and calculates savings with zero risk of modifying production.'
      },
      {
        step: 2,
        title: 'Deploy the Python Cost Optimization Scanner Function',
        consolePath: 'AWS Console > Lambda > Create Function > Python 3.12 > Paste FinOps code',
        codeSnippet: `import boto3
import json

ec2 = boto3.client('ec2')

def lambda_handler(event, context):
    report = {
        'unattached_ebs_volumes': [],
        'unassociated_elastic_ips': [],
        'estimated_monthly_savings_usd': 0.0
    }
    
    # 1. Audit Unattached EBS Volumes (status = available)
    vols = ec2.describe_volumes(Filters=[{'Name': 'status', 'Values': ['available']}])
    for v in vols.get('Volumes', []):
        size_gb = v['Size']
        cost = size_gb * 0.10 # approx $0.10/GB/mo
        report['unattached_ebs_volumes'].append({'id': v['VolumeId'], 'size_gb': size_gb, 'monthly_waste': cost})
        report['estimated_monthly_savings_usd'] += cost
        
    # 2. Audit Unassociated Elastic IPs
    eips = ec2.describe_addresses()
    for e in eips.get('Addresses', []):
        if 'InstanceId' not in e and 'NetworkInterfaceId' not in e:
            report['unassociated_elastic_ips'].append(e['PublicIp'])
            report['estimated_monthly_savings_usd'] += 3.65 # $0.005/hr * 730 hrs
            
    print("FINOPS AUDIT REPORT:", json.dumps(report, indent=2))
    return report`,
        cliCommand: 'zip -j finops.zip lambda_function.py && aws lambda create-function --function-name FinOps-CostAuditor --runtime python3.12 --role arn:aws:iam::123456789012:role/FinOps-CostAudit-Role --handler lambda_function.lambda_handler --zip-file fileb://finops.zip',
        explanation: 'Calculates concrete financial savings metrics you can present to senior management and in interviews.'
      }
    ],
    tearDownRunbook: {
      zeroCostPromise: 'Delete the Lambda function and IAM role with 2 commands.',
      cliCommands: [
        'aws lambda delete-function --function-name FinOps-CostAuditor',
        'aws iam delete-role-policy --role-name FinOps-CostAudit-Role --policy-name ReadOnlyEC2',
        'aws iam delete-role --role-name FinOps-CostAudit-Role'
      ],
      consoleSteps: [
        '1. Go to Lambda > Functions > Delete `FinOps-CostAuditor`.',
        '2. Go to IAM > Roles > Delete `FinOps-CostAudit-Role`.'
      ]
    },
    portfolioGuide: {
      githubTitle: 'AWS Automated FinOps Cost Optimization & Waste Remediation Engine',
      resumeBullets: [
        'Engineered an automated serverless FinOps auditing engine in Python (Boto3) and Amazon EventBridge that identifies orphaned cloud resources including unattached EBS volumes and unassociated Elastic IPs.',
        'Calculated projected cloud infrastructure savings and generated structured weekly executive cost scorecards.',
        'Demonstrated strong alignment with the AWS Well-Architected Framework Cost Optimization pillar.'
      ],
      interviewDiscussionPoints: 'When interviewers ask about cost optimization, describe how unassociated Elastic IPs incur $0.005/hour charges specifically because IPv4 addresses are scarce. Proactive automation ensures development leftovers never pad the AWS bill.'
    }
  },

  // ===========================================================================
  // TRACK 3: CLOUD SECURITY ENGINEER PROJECTS (HARDEN, DEFEND & AUDIT)
  // ===========================================================================
  {
    id: 'proj-auto-ir-pipeline',
    number: 'PROJECT-07',
    title: 'Serverless Automated Incident Response: Auto-Quarantine Compromised IAM Keys',
    role: 'Cloud Security Engineer / SecOps',
    track: 'cloud-security',
    trackLabel: 'Cloud Security Engineer Track',
    difficulty: 'Intermediate',
    estimatedTime: '45 mins',
    cost: '$0.00 (100% AWS Free Tier)',
    freeTierQuota: 'AWS Lambda (1,000,000 free requests/mo), Amazon EventBridge (Free), IAM (100% Free)',
    businessProblem: 'When an AWS access key leaks or an attacker accesses AWS APIs from an unauthorized geographic location, manual human incident response takes an average of 45-90 minutes. In that window, automated threat actors can launch dozens of crypto-mining EC2 instances. A fully automated, zero-latency quarantine pipeline is required.',
    architectureSummary: 'Amazon GuardDuty / EventBridge Security Finding -> CloudWatch Event Rule -> Python Remediation Lambda -> AWS IAM (Deactivates Access Key & Attaches Emergency Quarantine DenyAll Policy) -> Amazon SNS Post-Incident Alert.',
    architectureSteps: [
      '1. Amazon EventBridge detects a high-severity GuardDuty finding or simulated IAM compromise event.',
      '2. EventBridge filters the event and invokes the `SecurityAutoRemediationFunction` Lambda.',
      '3. Lambda parses the compromised `AccessKeyId` and `UserName`.',
      '4. Lambda calls `iam.update_access_key(Status="Inactive")` and `iam.put_user_policy(PolicyName="QuarantineDeny")`.',
      '5. Lambda publishes a formatted post-incident notification to Amazon SNS, alerting the security team.'
    ],
    stepByStepBuild: [
      {
        step: 1,
        title: 'Create the Least-Privilege IAM Execution Role for Lambda',
        consolePath: 'AWS Console > IAM > Roles > Create Role > AWS Service: Lambda > Custom Policy',
        cliCommand: `aws iam create-role --role-name SecOps-AutoRemediation-Role --assume-role-policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"lambda.amazonaws.com"},"Action":"sts:AssumeRole"}]}' && aws iam put-role-policy --role-name SecOps-AutoRemediation-Role --policy-name RemediationPerms --policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":["iam:UpdateAccessKey","iam:PutUserPolicy"],"Resource":"*"},{"Effect":"Allow","Action":["logs:CreateLogGroup","logs:CreateLogStream","logs:PutLogEvents"],"Resource":"arn:aws:logs:*:*:*"}]}'`,
        explanation: 'Enforces least privilege: the remediation Lambda can ONLY deactivate keys and apply inline deny policies, with zero permissions to delete users or read data.'
      },
      {
        step: 2,
        title: 'Deploy the Incident Response Python Lambda Function',
        consolePath: 'AWS Console > Lambda > Create Function > Python 3.12 > Paste remediation code',
        codeSnippet: `import boto3
import json

iam = boto3.client('iam')

def lambda_handler(event, context):
    print("Received Security Alert Event:", json.dumps(event))
    detail = event.get('detail', {})
    user_name = detail.get('userName', 'compromised-test-user')
    access_key = detail.get('accessKeyId', 'AKIA_TEST_KEY')
    
    # 1. Deactivate Key
    iam.update_access_key(UserName=user_name, AccessKeyId=access_key, Status='Inactive')
    print(f"SUCCESS: Deactivated key {access_key} for {user_name}")
    
    # 2. Attach DenyAll
    deny_doc = {
        "Version": "2012-10-17",
        "Statement": [{"Effect": "Deny", "Action": "*", "Resource": "*"}]
    }
    iam.put_user_policy(UserName=user_name, PolicyName='EmergencyQuarantine', PolicyDocument=json.dumps(deny_doc))
    print(f"SUCCESS: Attached EmergencyQuarantine policy to {user_name}")
    
    return {"status": "Contained", "user": user_name, "key": access_key}`,
        cliCommand: 'zip -j remediation.zip lambda_function.py && aws lambda create-function --function-name SecOps-Key-Quarantine --runtime python3.12 --role arn:aws:iam::123456789012:role/SecOps-AutoRemediation-Role --handler lambda_function.lambda_handler --zip-file fileb://remediation.zip',
        explanation: 'The code executes minute-0 containment in under 200 milliseconds, beating any human response time.'
      },
      {
        step: 3,
        title: 'Configure EventBridge Rule to Trigger on Compromised Key Findings',
        consolePath: 'AWS Console > Amazon EventBridge > Rules > Create Rule > Event Pattern: GuardDuty Finding',
        cliCommand: `aws events put-rule --name QuarantineCompromisedKeys --event-pattern '{"source":["aws.guardduty"],"detail-type":["GuardDuty Finding"],"detail":{"type":[{"prefix":"UnauthorizedAccess:IAMUser"}]}}'`,
        explanation: 'EventBridge monitors event streams in real time with 0 polling overhead.'
      },
      {
        step: 4,
        title: 'Simulate Threat Event & Verify Instant Automated Containment',
        consolePath: 'AWS Console > EventBridge > Send custom test event > Inspect IAM user status',
        cliCommand: `aws events put-events --entries '[{"Source":"aws.guardduty","DetailType":"GuardDuty Finding","Detail":"{\\"userName\\":\\"compromised-test-user\\",\\"accessKeyId\\":\\"AKIAEXAMPLETEST\\"}"}]'`,
        explanation: 'Simulates the exact JSON finding structure to validate that the pipeline auto-quarantines the test identity in seconds.'
      }
    ],
    tearDownRunbook: {
      zeroCostPromise: 'Follow these 4 commands to completely delete all test resources. Zero residual services will remain.',
      cliCommands: [
        'aws lambda delete-function --function-name SecOps-Key-Quarantine',
        'aws events delete-rule --name QuarantineCompromisedKeys',
        'aws iam delete-role-policy --role-name SecOps-AutoRemediation-Role --policy-name RemediationPerms',
        'aws iam delete-role --role-name SecOps-AutoRemediation-Role'
      ],
      consoleSteps: [
        '1. Go to AWS Lambda > Functions > Select `SecOps-Key-Quarantine` > Actions > Delete.',
        '2. Go to EventBridge > Rules > Delete `QuarantineCompromisedKeys`.',
        '3. Go to IAM > Roles > Delete `SecOps-AutoRemediation-Role`.'
      ]
    },
    portfolioGuide: {
      githubTitle: 'AWS Serverless Automated Incident Response & Key Quarantine Pipeline',
      resumeBullets: [
        'Architected an automated incident response pipeline utilizing Amazon EventBridge and AWS Lambda, reducing Mean Time to Remediate (MTTR) for compromised IAM credentials from 45 minutes to <200 milliseconds.',
        'Developed least-privilege Python remediation functions adhering to NIST SP 800-61 Rev 2 incident containment frameworks.',
        'Implemented zero-dollar billing guardrails with AWS Free Tier verification and automated infrastructure clean-up scripts.'
      ],
      interviewDiscussionPoints: 'When interviewers ask: "Have you ever automated security response?", explain how EventBridge decoupled event ingestion from remediation logic, allowing easy expansion to Slack alerts or Jira ticket auto-creation.'
    }
  },

  {
    id: 'proj-s3-dlp-kms-hardening',
    number: 'PROJECT-08',
    title: 'Enterprise S3 Data Loss Prevention (DLP), TLS Enforcement & KMS Hardening',
    role: 'Cloud Security Engineer',
    track: 'cloud-security',
    trackLabel: 'Cloud Security Engineer Track',
    difficulty: 'Beginner / Intermediate',
    estimatedTime: '30 mins',
    cost: '$0.00 (100% AWS Free Tier)',
    freeTierQuota: 'Amazon S3 (5 GB Free Storage, 20,000 GET requests, 2,000 PUT requests free)',
    businessProblem: 'Over 80% of cloud data leaks stem from misconfigured S3 bucket policies permitting unencrypted HTTP traffic or public read access. Financial and healthcare regulations (PCI-DSS 4.0, HIPAA) mandate that all storage buckets enforce TLS 1.2+ encryption in transit and AES-256 encryption at rest.',
    architectureSummary: 'Amazon S3 Bucket -> S3 Block Public Access (Account + Bucket) -> Strict Deny Insecure HTTP Transport Policy -> Server-Side Encryption (SSE-S3/KMS) -> S3 Versioning & Lifecycle.',
    architectureSteps: [
      '1. Create a hardened, private S3 bucket with strict naming conventions.',
      '2. Enforce S3 Block Public Access across all 4 public access flags.',
      '3. Attach an explicit Deny bucket policy for any requests where `aws:SecureTransport` is false (blocking HTTP).',
      '4. Enable S3 default encryption using AWS-managed keys (100% Free) or customer-managed KMS.',
      '5. Enable S3 Versioning to defend against ransomware tampering and accidental deletion.'
    ],
    stepByStepBuild: [
      {
        step: 1,
        title: 'Create Private S3 Bucket with Block Public Access',
        consolePath: 'AWS Console > S3 > Create Bucket > Name: "secops-hardened-vault-[YOUR_NAME]" > Check "Block all public access"',
        cliCommand: `aws s3api create-bucket --bucket secops-hardened-vault-$(aws sts get-caller-identity --query Account --output text) --region us-east-1 && aws s3api put-public-access-block --bucket secops-hardened-vault-$(aws sts get-caller-identity --query Account --output text) --public-access-block-configuration "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"`,
        explanation: 'Enforces the 4 foundational public access blocks: ACL blocks, policy blocks, and public bucket restrictions.'
      },
      {
        step: 2,
        title: 'Attach SSL/TLS 1.2+ Mandatory Transport Policy',
        consolePath: 'AWS Console > S3 > Bucket > Permissions > Bucket Policy > Edit > Paste DenyInsecureTransport',
        cliCommand: `aws s3api put-bucket-policy --bucket secops-hardened-vault-$(aws sts get-caller-identity --query Account --output text) --policy '{"Version":"2012-10-17","Statement":[{"Sid":"EnforceTLSRequestsOnly","Effect":"Deny","Principal":"*","Action":"s3:*","Resource":["arn:aws:s3:::secops-hardened-vault-REPLACE_ACCOUNT/*","arn:aws:s3:::secops-hardened-vault-REPLACE_ACCOUNT"],"Condition":{"Bool":{"aws:SecureTransport":"false"}}}]}'`,
        explanation: 'Guarantees that plaintext HTTP requests are immediately dropped with HTTP 403 Forbidden.'
      },
      {
        step: 3,
        title: 'Turn on Default Server-Side Encryption & S3 Bucket Keys',
        consolePath: 'AWS Console > S3 > Bucket > Properties > Default encryption: Enable SSE-S3 with Bucket Key',
        cliCommand: `aws s3api put-bucket-encryption --bucket secops-hardened-vault-$(aws sts get-caller-identity --query Account --output text) --server-side-encryption-configuration '{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"AES256"},"BucketKeyEnabled":true}]}'`,
        explanation: 'AES-256 encryption via SSE-S3 is 100% free of charge and provides seamless compliance with ISO 27001 data at rest requirements.'
      },
      {
        step: 4,
        title: 'Enable S3 Versioning & Audit with Penetration Probe',
        consolePath: 'AWS Console > S3 > Bucket > Properties > Bucket Versioning: Enable',
        cliCommand: `aws s3api put-bucket-versioning --bucket secops-hardened-vault-$(aws sts get-caller-identity --query Account --output text) --versioning-configuration Status=Enabled`,
        explanation: 'Versioning ensures that if a rogue actor attempts to overwrite or delete sensitive records, previous object versions remain permanently retrievable.'
      }
    ],
    tearDownRunbook: {
      zeroCostPromise: 'S3 buckets with 0 objects incur $0.00. Use this script to empty and delete the test bucket completely.',
      cliCommands: [
        'aws s3 rb s3://secops-hardened-vault-$(aws sts get-caller-identity --query Account --output text) --force'
      ],
      consoleSteps: [
        '1. Go to AWS S3 > Buckets > Select `secops-hardened-vault-...`.',
        '2. Click "Empty" > Confirm typing `permanently delete`.',
        '3. Click "Delete" > Confirm bucket deletion.'
      ]
    },
    portfolioGuide: {
      githubTitle: 'AWS S3 Data Loss Prevention (DLP) & Zero-Trust Encryption Vault',
      resumeBullets: [
        'Engineered an enterprise S3 data vault implementing strict TLS 1.2+ transport policies, AES-256 server-side encryption, and S3 Block Public Access guardrails.',
        'Validated defense-in-depth storage compliance against CIS AWS Foundations Benchmark v3.0 Section 2.1.',
        'Authored Infrastructure as Code (Terraform) templates and automated verification probes for continuous audit readiness.'
      ],
      interviewDiscussionPoints: 'Explain the difference between `aws:SecureTransport: false` in a DENY statement versus an ALLOW statement: a DENY statement cannot be overridden by any permissive IAM policy.'
    }
  },

  {
    id: 'proj-github-oidc-hardening',
    number: 'PROJECT-09',
    title: 'Zero-Static-Credentials CI/CD: Hardened GitHub Actions OIDC Federation',
    role: 'DevSecOps Specialist',
    track: 'cloud-security',
    trackLabel: 'Cloud Security Engineer Track',
    difficulty: 'Intermediate',
    estimatedTime: '35 mins',
    cost: '$0.00 (100% AWS Free Tier)',
    freeTierQuota: 'AWS IAM (100% Free Forever), GitHub Actions (2,000 free minutes/mo on public/private repos)',
    businessProblem: 'Static AWS Access Keys stored in GitHub repository secrets are the #1 attack vector for cloud account takeovers. If a developer account is compromised or a build log inadvertently outputs environmental variables, the key is permanently exposed. OpenID Connect (OIDC) eliminates all static keys in favor of short-lived (15-min) cryptographic tokens.',
    architectureSummary: 'GitHub Actions Workflow -> OIDC Token (JWT) -> AWS STS AssumeRoleWithWebIdentity -> Validates Audience (sts.amazonaws.com) and Subject (repo:org/repo:ref) -> Returns 15-Minute Ephemeral AWS Credentials.',
    architectureSteps: [
      '1. Create the GitHub OIDC Identity Provider in AWS IAM with thumbprint validation.',
      '2. Author an IAM Role Trust Relationship policy with strict StringEquals matching.',
      '3. Pin the `token.actions.githubusercontent.com:sub` claim strictly to the specific repository and main branch.',
      '4. Create a lightweight GitHub Actions `.github/workflows/deploy.yml` pipeline that assumes the role.',
      '5. Verify that untrusted branches or forks receive AccessDenied from AWS STS.'
    ],
    stepByStepBuild: [
      {
        step: 1,
        title: 'Create the GitHub OIDC Identity Provider in AWS IAM',
        consolePath: 'AWS Console > IAM > Identity providers > Add provider > OpenID Connect > URL: token.actions.githubusercontent.com > Audience: sts.amazonaws.com',
        cliCommand: `aws iam create-open-id-connect-provider --url https://token.actions.githubusercontent.com --client-id-list sts.amazonaws.com --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1 1c5824a80a670b02658097dd3ae800e4ab4e64a0`,
        explanation: 'Registers GitHub as a cryptographically trusted federated token issuer in your AWS account.'
      },
      {
        step: 2,
        title: 'Create the Hardened IAM Role with Pinned Repository Claims',
        consolePath: 'AWS Console > IAM > Roles > Create Role > Web identity > Select GitHub > Set Repository and Branch',
        cliCommand: `aws iam create-role --role-name GitHubActions-CoreDeployer-Role --assume-role-policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Federated":"arn:aws:iam::123456789012:oidc-provider/token.actions.githubusercontent.com"},"Action":"sts:AssumeRoleWithWebIdentity","Condition":{"StringEquals":{"token.actions.githubusercontent.com:aud":"sts.amazonaws.com","token.actions.githubusercontent.com:sub":"repo:YOUR_GITHUB_USER/YOUR_REPO:ref:refs/heads/main"}}}]}'`,
        explanation: 'Notice the StringEquals condition: It ensures ONLY commits on the main branch of YOUR specific repository can authenticate.'
      },
      {
        step: 3,
        title: 'Add Read-Only Least-Privilege Policy to the Role',
        consolePath: 'AWS Console > IAM > Roles > GitHubActions-CoreDeployer-Role > Attach AWS managed policy: SecurityAudit',
        cliCommand: `aws iam attach-role-policy --role-name GitHubActions-CoreDeployer-Role --policy-arn arn:aws:iam::aws:policy/SecurityAudit`,
        explanation: 'Attaches read-only auditing permissions for initial pipeline validation, avoiding excessive permissions.'
      },
      {
        step: 4,
        title: 'Create GitHub Actions Workflow YAML',
        consolePath: 'In your GitHub Repo: Create .github/workflows/aws-oidc-test.yml',
        codeSnippet: `name: AWS OIDC Security Pipeline
on:
  push:
    branches: [ main ]

permissions:
  id-token: write # Mandatory for requesting OIDC JWT token
  contents: read

jobs:
  verify-aws:
    runs-on: ubuntu-latest
    steps:
      - name: Configure AWS Credentials via OIDC
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789012:role/GitHubActions-CoreDeployer-Role
          aws-region: us-east-1
      
      - name: Verify Caller Identity (Zero Static Keys!)
        run: |
          aws sts get-caller-identity`,
        explanation: 'Notice: Zero AWS secrets are stored in GitHub Secrets! AWS STS mints a fresh token that expires automatically.'
      }
    ],
    tearDownRunbook: {
      zeroCostPromise: 'IAM roles and OIDC identity providers cost $0.00. Delete with these 3 simple commands.',
      cliCommands: [
        'aws iam detach-role-policy --role-name GitHubActions-CoreDeployer-Role --policy-arn arn:aws:iam::aws:policy/SecurityAudit',
        'aws iam delete-role --role-name GitHubActions-CoreDeployer-Role',
        `aws iam delete-open-id-connect-provider --open-id-connect-provider-arn arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):oidc-provider/token.actions.githubusercontent.com`
      ],
      consoleSteps: [
        '1. Go to IAM > Roles > Delete `GitHubActions-CoreDeployer-Role`.',
        '2. Go to IAM > Identity Providers > Delete `token.actions.githubusercontent.com`.'
      ]
    },
    portfolioGuide: {
      githubTitle: 'Zero-Static-Credentials CI/CD Architecture with GitHub Actions OIDC',
      resumeBullets: [
        'Decommissioned legacy long-term AWS IAM access keys across CI/CD pipelines, migrating to OpenID Connect (OIDC) federated token exchange with AWS STS.',
        'Hardened trust boundary policies pinning the `sub` claim to authorized repositories and production branches, preventing unauthorized pull request token assumption.',
        'Enforced a 15-minute credential Time-To-Live (TTL) with full CloudTrail traceability for automated compliance auditing.'
      ],
      interviewDiscussionPoints: 'Explain why wildcards in `token.actions.githubusercontent.com:sub` are catastrophic: If a policy uses `repo:*:*`, any GitHub user who forks the repo can assume your production AWS role.'
    }
  },

  {
    id: 'proj-vpc-flowlog-threat-hunting',
    number: 'PROJECT-10',
    title: 'Cloud Network Threat Hunting: VPC Flow Logs & CloudWatch Insights Forensics',
    role: 'Cloud Incident Responder / DFIR',
    track: 'cloud-security',
    trackLabel: 'Cloud Security Engineer Track',
    difficulty: 'Intermediate / Advanced',
    estimatedTime: '40 mins',
    cost: '$0.00 (100% AWS Free Tier)',
    freeTierQuota: 'Amazon CloudWatch (5 GB Log Ingestion, 5 GB Log Storage Free/mo), Amazon VPC (Free)',
    businessProblem: 'During active cyber intrusions, adversaries execute port scans, lateral movement, and command-and-control (C2) beaconing over network ports. Security teams must be able to write forensic queries to identify anomalous outbound traffic, identify rejected packets, and calculate exfiltrated byte counts without expensive third-party SIEM licenses.',
    architectureSummary: 'Amazon VPC -> VPC Flow Logs -> Amazon CloudWatch Log Group -> CloudWatch Logs Insights -> Forensic Query Execution -> CloudWatch Metric Alarm.',
    architectureSteps: [
      '1. Enable VPC Flow Logs on the default VPC targeting a dedicated CloudWatch Log Group.',
      '2. Configure an IAM role allowing VPC to publish network packets to CloudWatch.',
      '3. Generate benign test traffic via curl / ping to populate network flow telemetry.',
      '4. Author CloudWatch Logs Insights queries to detect port scans (REJECT spikes) and large data transfers.',
      '5. Create an automated CloudWatch Metric Filter to alarm on high-volume outbound data.'
    ],
    stepByStepBuild: [
      {
        step: 1,
        title: 'Create CloudWatch Log Group & IAM Role for VPC Flow Logs',
        consolePath: 'AWS Console > CloudWatch > Log groups > Create log group: /aws/vpc/flowlogs/threat-hunt',
        cliCommand: `aws logs create-log-group --log-group-name /aws/vpc/flowlogs/threat-hunt && aws iam create-role --role-name VPCFlowLogsPublishRole --assume-role-policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"vpc-flow-logs.amazonaws.com"},"Action":"sts:AssumeRole"}]}' && aws iam put-role-policy --role-name VPCFlowLogsPublishRole --policy-name PublishToCloudWatch --policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":["logs:CreateLogStream","logs:PutLogEvents","logs:DescribeLogGroups","logs:DescribeLogStreams"],"Resource":"*"}]}'`,
        explanation: 'Permits the Amazon VPC service to publish network metadata streams into CloudWatch without broad permissions.'
      },
      {
        step: 2,
        title: 'Enable Flow Logs on the Default VPC',
        consolePath: 'AWS Console > VPC > Select Default VPC > Flow Logs tab > Create flow log',
        cliCommand: `aws ec2 create-flow-logs --resource-ids $(aws ec2 describe-vpcs --filter "Name=isDefault,Values=true" --query "Vpcs[0].VpcId" --output text) --resource-type VPC --traffic-type ALL --log-destination-type cloud-watch-logs --log-group-name /aws/vpc/flowlogs/threat-hunt --deliver-logs-permission-arn $(aws iam get-role --role-name VPCFlowLogsPublishRole --query "Role.Arn" --output text)`,
        explanation: 'Captures both ACCEPT and REJECT packets across every network interface (ENI) in the VPC.'
      },
      {
        step: 3,
        title: 'Execute CloudWatch Insights Query for Inbound Port Scans',
        consolePath: 'AWS Console > CloudWatch > Logs Insights > Select /aws/vpc/flowlogs/threat-hunt > Run Query',
        codeSnippet: `fields @timestamp, srcAddr, dstAddr, dstPort, protocol, action
| filter action = 'REJECT'
| stats count(*) as rejectCount by srcAddr, dstPort
| sort rejectCount desc
| limit 20`,
        cliCommand: `aws logs start-query --log-group-name /aws/vpc/flowlogs/threat-hunt --start-time $(date -u -d '1 hour ago' +%s 2>/dev/null || date -v-1H +%s) --end-time $(date +%s) --query-string "fields @timestamp, srcAddr, dstAddr, dstPort | filter action = 'REJECT' | stats count(*) by srcAddr | sort count desc"`,
        explanation: 'Aggregates blocked packets by source IP: a sudden spike of hundreds of rejected packets across random ports confirms an active port scan.'
      },
      {
        step: 4,
        title: 'Forensic Query for Top Exfiltration Destinations (Data Out)',
        consolePath: 'AWS Console > CloudWatch > Logs Insights > Query top bytes sent out',
        codeSnippet: `fields @timestamp, srcAddr, dstAddr, bytes
| filter srcAddr like /^172.31./ or srcAddr like /^10./
| filter dstAddr not like /^172.31./ and dstAddr not like /^10./
| stats sum(bytes) as totalExfiltratedBytes by dstAddr
| sort totalExfiltratedBytes desc
| limit 10`,
        cliCommand: `aws logs start-query --log-group-name /aws/vpc/flowlogs/threat-hunt --start-time $(date -u -d '24 hours ago' +%s 2>/dev/null || date -v-24H +%s) --end-time $(date +%s) --query-string "fields srcAddr, dstAddr, bytes | stats sum(bytes) by dstAddr | sort sum(bytes) desc"`,
        explanation: 'Calculates the exact volume of data transmitted to external public IP addresses, crucial for incident breach disclosure reporting.'
      }
    ],
    tearDownRunbook: {
      zeroCostPromise: 'Delete the flow log and log group to ensure zero storage accumulation over time.',
      cliCommands: [
        `aws ec2 delete-flow-logs --flow-log-ids $(aws ec2 describe-flow-logs --filter "Name=log-group-name,Values=/aws/vpc/flowlogs/threat-hunt" --query "FlowLogs[0].FlowLogId" --output text)`,
        'aws logs delete-log-group --log-group-name /aws/vpc/flowlogs/threat-hunt',
        'aws iam delete-role-policy --role-name VPCFlowLogsPublishRole --policy-name PublishToCloudWatch',
        'aws iam delete-role --role-name VPCFlowLogsPublishRole'
      ],
      consoleSteps: [
        '1. Go to VPC > Flow Logs > Select the flow log targeting `/aws/vpc/flowlogs/threat-hunt` > Delete.',
        '2. Go to CloudWatch > Log groups > Delete `/aws/vpc/flowlogs/threat-hunt`.',
        '3. Go to IAM > Roles > Delete `VPCFlowLogsPublishRole`.'
      ]
    },
    portfolioGuide: {
      githubTitle: 'AWS Cloud Network Threat Hunting & VPC Flow Log Analysis Framework',
      resumeBullets: [
        'Implemented enterprise VPC Flow Logging across AWS cloud environments to detect adversary reconnaissance and data exfiltration vectors.',
        'Authored optimized CloudWatch Logs Insights queries identifying unauthorized lateral port scans and multi-megabyte outbound data egress transfers.',
        'Established automated alert metrics aligning with MITRE ATT&CK Network Traffic (T1046) and Exfiltration Over C2 Channel (T1041).'
      ],
      interviewDiscussionPoints: 'Explain the difference between VPC Flow Logs and packet capture (PCAP): VPC Flow Logs capture metadata (layer 3/4 headers, bytes, packets), but not the application-layer payload (HTTP body). For payload inspection, you need AWS Network Firewall or VPC Traffic Mirroring.'
    }
  },

  // ===========================================================================
  // TRACK 4: CLOUD SECURITY MUST-HAVE PORTFOLIO PROJECTS
  // ===========================================================================
  {
    id: 'proj-sec-iam-auditor',
    number: 'PROJECT-11',
    title: 'Automated IAM Least Privilege Auditor',
    role: 'Cloud Security Engineer',
    track: 'cloud-security',
    trackLabel: 'Cloud Security Engineer Track',
    difficulty: 'Advanced',
    estimatedTime: '60 mins',
    cost: '$0.00 (100% AWS Free Tier)',
    freeTierQuota: 'AWS IAM API (Free)',
    businessProblem: 'Identity is the new perimeter. Demonstrating that you can audit IAM at scale proves you understand the core of AWS security.',
    architectureSummary: 'Python Script (Boto3) -> IAM API (GetAccountAuthorizationDetails) -> Find roles with AdminAccess or wildcards -> CSV Report.',
    architectureSteps: [
      '1. Create a Python script using boto3.',
      '2. Query iam:GetAccountAuthorizationDetails to list all roles and inline policies.',
      '3. Identify roles that contain */* (AdminAccess) or overly permissive wildcard actions.',
      '4. Output the findings into a CSV report.'
    ],
    stepByStepBuild: [
      {
        step: 1,
        title: 'Query IAM with Python Boto3',
        consolePath: 'Local Terminal / CloudShell',
        codeSnippet: `import boto3
iam = boto3.client('iam')
response = iam.get_account_authorization_details()`,
        explanation: 'Uses Boto3 to fetch the entire authorization state of the account.'
      }
    ],
    tearDownRunbook: {
      zeroCostPromise: 'No resources to tear down. API calls are free.',
      cliCommands: [],
      consoleSteps: []
    },
    portfolioGuide: {
      githubTitle: 'Automated AWS IAM Least Privilege Auditor',
      resumeBullets: [
        'Built a Python automation script leveraging Boto3 to audit enterprise AWS IAM posture at scale.',
        'Programmatically identified over-privileged roles using wildcard actions, adhering to the Principle of Least Privilege.'
      ],
      interviewDiscussionPoints: 'Explain how identity is the primary boundary in cloud computing and why programmatic auditing is superior to manual console checks.'
    }
  },
  {
    id: 'proj-sec-athena-forensics',
    number: 'PROJECT-12',
    title: 'CloudTrail Forensics & Threat Hunting with Athena',
    role: 'Cloud Security Incident Responder',
    track: 'cloud-security',
    trackLabel: 'Cloud Security Engineer Track',
    difficulty: 'Advanced',
    estimatedTime: '50 mins',
    cost: '$0.00 (100% AWS Free Tier)',
    freeTierQuota: 'S3 (5GB Free), Athena ($5 per TB, free for small queries)',
    businessProblem: 'Incident response requires querying logs fast. Athena is the industry standard for lightweight, serverless log analysis.',
    architectureSummary: 'AWS CloudTrail -> Amazon S3 -> Amazon Athena -> SQL Threat Hunting Queries.',
    architectureSteps: [
      '1. Enable AWS CloudTrail and route logs to an Amazon S3 bucket.',
      '2. Create an Amazon Athena table that points to the CloudTrail S3 bucket.',
      '3. Write SQL queries to hunt for Root account logins, Console logins without MFA, etc.'
    ],
    stepByStepBuild: [
      {
        step: 1,
        title: 'Create Athena Table for CloudTrail Logs',
        consolePath: 'AWS Console > Athena > Query Editor',
        codeSnippet: `CREATE EXTERNAL TABLE cloudtrail_logs (...) LOCATION 's3://your-cloudtrail-bucket/AWSLogs/'`,
        explanation: 'Creates a schema over the raw JSON CloudTrail logs in S3, enabling SQL queries.'
      }
    ],
    tearDownRunbook: {
      zeroCostPromise: 'Delete S3 bucket and Athena table.',
      cliCommands: [
        'aws athena start-query-execution --query-string "DROP TABLE cloudtrail_logs"',
        'aws s3 rm s3://your-cloudtrail-bucket --recursive'
      ],
      consoleSteps: []
    },
    portfolioGuide: {
      githubTitle: 'Serverless Cloud Forensics with AWS Athena & CloudTrail',
      resumeBullets: [
        'Deployed serverless log analysis architecture using AWS Athena to query CloudTrail audit logs directly from S3.',
        'Authored SQL queries to detect anomalous IAM assumption, unauthorized API calls, and missing MFA.'
      ],
      interviewDiscussionPoints: 'Explain the cost efficiency of Athena compared to running a persistent Elasticsearch cluster.'
    }
  },
  {
    id: 'proj-sec-auto-remediation',
    number: 'PROJECT-13',
    title: 'Serverless Auto-Remediation Engine',
    role: 'DevSecOps Engineer',
    track: 'cloud-security',
    trackLabel: 'Cloud Security Engineer Track',
    difficulty: 'Advanced',
    estimatedTime: '60 mins',
    cost: '$0.00 (100% AWS Free Tier)',
    freeTierQuota: 'Lambda (1M free invocations), EventBridge (Free)',
    businessProblem: 'SOCs are overwhelmed. Engineers who can automate remediation (DevSecOps) are highly sought after.',
    architectureSummary: 'Vulnerable S3 Bucket -> EventBridge (PutBucketAcl) -> AWS Lambda (Boto3) -> Enforce Block Public Access.',
    architectureSteps: [
      '1. Create a vulnerable resource (e.g., S3 bucket with public access).',
      '2. Configure EventBridge to listen for CloudTrail API call (PutBucketAcl).',
      '3. Route EventBridge rule to an AWS Lambda function.',
      '4. Lambda function parses event and reverts change.'
    ],
    stepByStepBuild: [
      {
        step: 1,
        title: 'Create Auto-Remediation Lambda',
        consolePath: 'AWS Console > Lambda > Create Function',
        codeSnippet: `import boto3
def lambda_handler(event, context):
    s3 = boto3.client('s3')
    bucket_name = event['detail']['requestParameters']['bucketName']
    s3.put_public_access_block(Bucket=bucket_name, PublicAccessBlockConfiguration={'BlockPublicAcls': True, 'IgnorePublicAcls': True, 'BlockPublicPolicy': True, 'RestrictPublicBuckets': True})`,
        explanation: 'Lambda automatically enforces S3 Block Public Access when an insecure change is detected.'
      }
    ],
    tearDownRunbook: {
      zeroCostPromise: 'Delete EventBridge Rule and Lambda.',
      cliCommands: [
        'aws events remove-targets --rule AutoRemediateS3 --ids "1"',
        'aws events delete-rule --name AutoRemediateS3',
        'aws lambda delete-function --function-name AutoRemediateS3'
      ],
      consoleSteps: []
    },
    portfolioGuide: {
      githubTitle: 'Event-Driven Auto-Remediation Security Engine',
      resumeBullets: [
        'Architected an event-driven security pipeline using AWS EventBridge to detect misconfigurations in real-time.',
        'Wrote AWS Lambda functions in Python to auto-remediate insecure S3 bucket policies within milliseconds.'
      ],
      interviewDiscussionPoints: 'Discuss the paradigm shift from manual SOC triage to proactive event-driven automated response.'
    }
  },
  {
    id: 'proj-sec-vpc-boundary',
    number: 'PROJECT-14',
    title: 'The Secure 3-Tier Network Boundary',
    role: 'Cloud Network Security Engineer',
    track: 'cloud-security',
    trackLabel: 'Cloud Security Engineer Track',
    difficulty: 'Advanced',
    estimatedTime: '90 mins',
    cost: '$0.00 (100% AWS Free Tier)',
    freeTierQuota: 'VPC (Free), EC2 (Free Tier), Gateway Endpoints (Free)',
    businessProblem: 'Shows you understand the OSI model, stateful vs. stateless firewalls, and Infrastructure as Code (IaC) without paying for expensive NAT Gateways.',
    architectureSummary: 'Terraform -> VPC -> Public/Private Subnets -> Security Groups -> NACLs -> Gateway Endpoints.',
    architectureSteps: [
      '1. Write Terraform script deploying custom VPC with isolated subnets.',
      '2. Configure tight Security Groups (Web SG, App SG).',
      '3. Implement Network ACLs (NACLs) acting as stateless firewall.',
      '4. Use VPC Gateway Endpoints for private S3 access instead of NAT Gateway.'
    ],
    stepByStepBuild: [
      {
        step: 1,
        title: 'Deploy Secure VPC via Terraform',
        consolePath: 'Local Terminal',
        codeSnippet: `resource "aws_vpc" "main" { cidr_block = "10.0.0.0/16" }
resource "aws_network_acl" "main" { vpc_id = aws_vpc.main.id }`,
        explanation: 'Deploys a hardened network baseline programmatically.'
      }
    ],
    tearDownRunbook: {
      zeroCostPromise: 'Destroy the Terraform state.',
      cliCommands: ['terraform destroy -auto-approve'],
      consoleSteps: []
    },
    portfolioGuide: {
      githubTitle: 'Hardened 3-Tier AWS Network Boundary (Terraform)',
      resumeBullets: [
        'Designed and deployed a highly secure 3-tier AWS VPC architecture using Terraform IaC.',
        'Implemented defense-in-depth through stateful Security Groups and stateless Network ACLs.',
        'Eliminated NAT Gateway costs by leveraging VPC Gateway Endpoints for private AWS service communication.'
      ],
      interviewDiscussionPoints: 'Explain the difference between stateful firewalls (Security Groups) and stateless firewalls (NACLs).'
    }
  }
];
