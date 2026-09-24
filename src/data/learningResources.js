export const resourceCatalog = {
  skillBuilder: { title: 'AWS Skill Builder', category: 'Learning platform', difficulty: 'All levels', url: 'https://aws.amazon.com/training/digital/', why: 'Build structured AWS knowledge with guided digital learning and hands-on practice.' },
  skillsHub: { title: 'AWS Training & Certification Skills Hub', category: 'Career development', difficulty: 'All levels', url: 'https://aws.amazon.com/training/skills/', why: 'Find role-based training and certification pathways aligned to cloud security careers.' },
  iamDocs: { title: 'IAM Documentation', category: 'IAM Security', difficulty: 'Intermediate', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html', why: 'Deepen policy analysis, identity boundaries, least privilege, and trust relationships.' },
  s3Docs: { title: 'S3 Documentation', category: 'Data Security', difficulty: 'Beginner', url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html', why: 'Strengthen practical knowledge of bucket access, encryption, versioning, and protection.' },
  vpcDocs: { title: 'VPC Documentation', category: 'Network Security', difficulty: 'Intermediate', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html', why: 'Learn how subnets, routes, security groups, and network boundaries shape risk.' },
  cloudTrailDocs: { title: 'CloudTrail Documentation', category: 'Monitoring', difficulty: 'Intermediate', url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html', why: 'Turn AWS API activity into reliable audit trails and incident evidence.' },
  cloudWatchDocs: { title: 'CloudWatch Documentation', category: 'Monitoring', difficulty: 'Intermediate', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html', why: 'Build practical detection, alerting, metrics, and operational visibility.' },
  securityBestPractices: { title: 'AWS Security Best Practices', category: 'Security foundations', difficulty: 'Intermediate', url: 'https://aws.amazon.com/architecture/security-identity-compliance/', why: 'Connect AWS security controls to a durable identity, data, and compliance strategy.' },
  wellArchitected: { title: 'AWS Well-Architected Framework', category: 'Architecture Security', difficulty: 'Advanced', url: 'https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html', why: 'Review workloads systematically through the Security Pillar and resilient design principles.' },
  securityResources: { title: 'AWS Security Learning Resources', category: 'Security foundations', difficulty: 'All levels', url: 'https://aws.amazon.com/security/resources/', why: 'Explore AWS-curated security guidance, solutions, and practical learning references.' },
}

export const learningPaths = {
  iam: { title: 'IAM Security Path', intro: 'Your identity and access foundation is the fastest route to stronger cloud decisions.', resources: ['iamDocs', 'skillBuilder', 'securityBestPractices'] },
  s3: { title: 'S3 Security Path', intro: 'Build confidence protecting data at rest, controlling access, and planning recovery.', resources: ['s3Docs', 'securityResources'] },
  network: { title: 'Networking Security Path', intro: 'Learn to see routes, boundaries, and segmentation as an attacker would.', resources: ['vpcDocs', 'wellArchitected'] },
  monitoring: { title: 'Monitoring Path', intro: 'Turn cloud activity into useful evidence, detection, and response signals.', resources: ['cloudTrailDocs', 'cloudWatchDocs'] },
  architecture: { title: 'Cloud Security Engineer Path', intro: 'Build the broad systems view expected from an early-career cloud security engineer.', resources: ['skillBuilder', 'skillsHub', 'securityBestPractices', 'wellArchitected'] },
}
