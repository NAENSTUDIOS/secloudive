import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function awsLiveFeedPlugin() {
  return {
    name: 'aws-live-feed-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // 1. Live AWS Security & Architecture Feed
        if (req.url && (req.url === '/api/live-aws-sync' || req.url.startsWith('/api/live-aws-sync?'))) {
          res.setHeader('Content-Type', 'application/json')
          res.setHeader('Access-Control-Allow-Origin', '*')
          try {
            const feedUrls = [
              { url: 'https://aws.amazon.com/blogs/security/feed/', source: 'AWS Official Security Blog' },
              { url: 'https://aws.amazon.com/about-aws/whats-new/recent/feed/', source: "AWS What's New" },
              { url: 'https://aws.amazon.com/blogs/architecture/feed/', source: 'AWS Architecture & Security' },
              { url: 'https://aws.amazon.com/blogs/mt/feed/', source: 'AWS Cloud Governance & Telemetry' }
            ]
            
            const rawItems = []
            const seenLinks = new Set()
            for (const { url, source } of feedUrls) {
              try {
                const response = await fetch(url, { 
                  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) SeCloudive-Sync/2.0' } 
                })
                if (response.ok) {
                  const xml = await response.text()
                  const regex = /<item>[\s\S]*?<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>[\s\S]*?<link>([\s\S]*?)<\/link>[\s\S]*?<pubDate>([\s\S]*?)<\/pubDate>[\s\S]*?<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>[\s\S]*?<\/item>/gi
                  let match
                  while ((match = regex.exec(xml)) && rawItems.length < 50) {
                    const title = match[1].replace(/&amp;/g, '&').replace(/&#8217;/g, "'").replace(/&#8211;/g, "-").replace(/&quot;/g, '"').trim()
                    const link = match[2].trim()
                    const pubDate = match[3].trim()
                    const snippet = match[4].replace(/<[^>]*>/g, '').replace(/&lt;[^&]*&gt;/g, '').replace(/&amp;/g, '&').replace(/&#8217;/g, "'").trim().slice(0, 240)
                    if (!seenLinks.has(link)) {
                      seenLinks.add(link)
                      rawItems.push({ title, link, pubDate, snippet, source })
                    }
                  }
                }
              } catch (e) {
                console.warn('[Vite Live AWS Feed] Failed fetching:', url, e.message)
              }
            }

            const processed = rawItems.map((item, idx) => {
              const fullText = (item.title + ' ' + item.snippet).toLowerCase()
              let awsService = 'AWS Cloud Security'
              let category = 'Security & Governance'
              let severity = 'HIGH'
              let cliCommand = 'aws securityhub get-findings --max-items 5'
              let cliLabel = 'Audit Security Hub Findings'
              let relatedRoute = '/labs'
              let relatedLabTitle = '16 Enterprise SOP Labs'

              if (fullText.includes('mfa') || fullText.includes('iam') || fullText.includes('role') || fullText.includes('identity') || fullText.includes('passkey')) {
                awsService = 'AWS IAM'
                category = 'Identity & Access Management'
                severity = 'CRITICAL'
                cliCommand = 'aws iam get-account-summary --query "SummaryMap.[AccountMFAEnabled,UsersWithMFA]"'
                cliLabel = 'Audit Organization MFA Enforcement Status'
                relatedRoute = '/labs'
                relatedLabTitle = 'Lab 01: IAM Zero-Trust & Permission Boundary Enactment'
              } else if (fullText.includes('bedrock') || fullText.includes('ai') || fullText.includes('model') || fullText.includes('guardrail')) {
                awsService = 'Amazon Bedrock Security'
                category = 'AI Model Governance & Guardrails'
                severity = 'HIGH'
                cliCommand = 'aws bedrock list-guardrails --query "guardrailSummaries[*].[name,status,arn]"'
                cliLabel = 'Inspect Active Generative AI Guardrails'
                relatedRoute = '/investigations'
                relatedLabTitle = 'Investigation 04: AI Pipeline Exfiltration Defense'
              } else if (fullText.includes('cloudtrail') || fullText.includes('guardduty') || fullText.includes('cloudwatch') || fullText.includes('ocsf') || fullText.includes('threat') || fullText.includes('forensic')) {
                awsService = 'Amazon GuardDuty & CloudTrail'
                category = 'Threat Detection & Telemetry'
                severity = 'CRITICAL'
                cliCommand = 'aws guardduty list-detectors --query "DetectorIds[0]" --output text'
                cliLabel = 'Fetch Master Threat Detector ID'
                relatedRoute = '/investigations'
                relatedLabTitle = 'Lab 08: Amazon GuardDuty & CloudTrail Threat Forensics'
              } else if (fullText.includes('s3') || fullText.includes('bucket') || fullText.includes('storage') || fullText.includes('kms') || fullText.includes('encryption')) {
                awsService = 'Amazon S3 & KMS'
                category = 'Data Lake Protection & Encryption'
                severity = 'HIGH'
                cliCommand = 'aws s3api get-public-access-block --bucket my-production-data-lake-2026'
                cliLabel = 'Verify S3 Block Public Access Status'
                relatedRoute = '/investigations'
                relatedLabTitle = 'Investigation 02: S3 Data Exfiltration & Bucket Hardening'
              } else if (fullText.includes('nitro') || fullText.includes('imds') || fullText.includes('enclave') || fullText.includes('ec2')) {
                awsService = 'AWS Nitro System'
                category = 'Compute Isolation & Hardware Root of Trust'
                severity = 'CRITICAL'
                cliCommand = 'aws ec2 describe-instances --query "Reservations[*].Instances[*].[InstanceId,MetadataOptions.HttpTokens]"'
                cliLabel = 'Audit IMDSv2 HttpTokens Enforcement Across Fleet'
                relatedRoute = '/investigations'
                relatedLabTitle = 'Investigation 01: EC2 Metadata SSRF & IAM Role Privilege Escalation'
              } else if (fullText.includes('vpc') || fullText.includes('network') || fullText.includes('lattice') || fullText.includes('datasync') || fullText.includes('waf') || fullText.includes('firewall')) {
                awsService = 'AWS WAF & VPC Network'
                category = 'Perimeter & Ingress Isolation'
                severity = 'HIGH'
                cliCommand = 'aws ec2 describe-vpc-endpoints --query "VpcEndpoints[*].[VpcEndpointId,ServiceName,State]"'
                cliLabel = 'List Private VPC Endpoints'
                relatedRoute = '/battle-rooms'
                relatedLabTitle = 'Battle Room 04: Public Ingress Breach & Perimeter Isolation'
              }

              const pub = new Date(item.pubDate)
              const formattedDate = isNaN(pub.getTime()) ? item.pubDate : pub.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

              return {
                id: `aws-live-rss-${idx}-${Math.abs(item.link.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0))}`,
                awsService,
                category,
                severity,
                title: item.title,
                source: item.source,
                url: item.link,
                publishedDate: formattedDate,
                rawDate: isNaN(pub.getTime()) ? Date.now() : pub.getTime(),
                isNewToday: true,
                isRealLiveFeed: true,
                summary: item.snippet + '...',
                architecturalImpact: `Directly impacts enterprise ${awsService} infrastructure. Review IAM policies, CloudWatch log streams, and compliance posture against CIS AWS Foundations Benchmark.`,
                cliCommand,
                cliLabel,
                relatedLab: {
                  title: relatedLabTitle,
                  route: relatedRoute
                }
              }
            })

            res.end(JSON.stringify({
              success: true,
              live: true,
              count: processed.length,
              source: 'AWS Official Security & Feature Feeds',
              syncedAt: new Date().toISOString(),
              items: processed
            }))
          } catch (err) {
            console.error('[Vite Live AWS Feed Error]', err)
            res.statusCode = 500
            res.end(JSON.stringify({ success: false, error: err.message }))
          }
          return
        }

        // 2. Live Cloud Security & DevOps Jobs Feed
        if (req.url && (req.url === '/api/live-cloud-jobs' || req.url.startsWith('/api/live-cloud-jobs?'))) {
          res.setHeader('Content-Type', 'application/json')
          res.setHeader('Access-Control-Allow-Origin', '*')
          try {
            const remotiveRes = await fetch('https://remotive.com/api/remote-jobs?category=security&limit=25', {
              headers: { 'User-Agent': 'Mozilla/5.0 SeCloudive-JobSync/1.0' }
            })
            if (remotiveRes.ok) {
              const data = await remotiveRes.json()
              const jobs = (data.jobs || [])
                .filter(j => {
                  const txt = (j.title + ' ' + (j.tags || []).join(' ') + ' ' + j.description).toLowerCase()
                  return txt.includes('security') || txt.includes('cloud') || txt.includes('aws') || txt.includes('devops') || txt.includes('infrastructure') || txt.includes('sre') || txt.includes('architect') || txt.includes('cyber') || txt.includes('engineer')
                })
                .map(j => ({
                  id: `job-${j.id}`,
                  category: 'jobs',
                  title: j.title,
                  source: `${j.company_name} • ${j.candidate_required_location || 'Global Remote'}`,
                  url: j.url,
                  badge: 'LIVE JOB OPENING',
                  pubDate: j.publication_date ? new Date(j.publication_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Active Today',
                  salary: j.salary || 'Competitive / Enterprise Experience',
                  description: j.description ? j.description.replace(/<[^>]*>/g, '').slice(0, 200) + '...' : 'Remote cloud security vacancy.',
                  tags: j.tags && j.tags.length > 0 ? j.tags.slice(0, 4) : ['Cloud Security', 'AWS', 'Zero Trust'],
                  rawDate: j.publication_date ? new Date(j.publication_date).getTime() : Date.now(),
                  isRealLiveFeed: true
                }))

              res.end(JSON.stringify({
                success: true,
                live: true,
                count: jobs.length,
                source: 'Remotive Live Remote Security API',
                syncedAt: new Date().toISOString(),
                jobs
              }))
              return
            }
          } catch (err) {
            console.warn('[Vite Live Jobs Error]', err)
          }
          res.end(JSON.stringify({ success: false, jobs: [] }))
          return
        }

        next()
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), awsLiveFeedPlugin()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    open: false,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
})
