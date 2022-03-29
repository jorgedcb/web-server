{
    "ipcMode": null,
    "executionRoleArn": null,
    "containerDefinitions": [
      {
        "dnsSearchDomains": null,
        "environmentFiles": null,
        "logConfiguration": null,
        "entryPoint": null,
        "portMappings": [
          {
            "hostPort": 80,
            "protocol": "tcp",
            "containerPort": 80
          }
        ],
        "command": null,
        "linuxParameters": null,
        "cpu": 0,
        "environment": [],
        "resourceRequirements": null,
        "ulimits": null,
        "dnsServers": null,
        "mountPoints": [],
        "workingDirectory": null,
        "secrets": null,
        "dockerSecurityOptions": null,
        "memory": null,
        "memoryReservation": null,
        "volumesFrom": [],
        "stopTimeout": null,
        "image": "347930165784.dkr.ecr.us-east-1.amazonaws.com/web_server",
        "startTimeout": null,
        "firelensConfiguration": null,
        "dependsOn": null,
        "disableNetworking": null,
        "interactive": null,
        "healthCheck": null,
        "essential": true,
        "links": null,
        "hostname": null,
        "extraHosts": null,
        "pseudoTerminal": null,
        "user": null,
        "readonlyRootFilesystem": null,
        "dockerLabels": null,
        "systemControls": null,
        "privileged": null,
        "name": "web_server"
      }
    ],
    "placementConstraints": [],
    "memory": "512",
    "taskRoleArn": null,
    "compatibilities": [
      "EXTERNAL",
      "EC2"
    ],
    "taskDefinitionArn": "arn:aws:ecs:us-east-1:347930165784:task-definition/web_sever:1",
    "family": "web_sever",
    "requiresAttributes": [
      {
        "targetId": null,
        "targetType": null,
        "value": null,
        "name": "com.amazonaws.ecs.capability.ecr-auth"
      }
    ],
    "pidMode": null,
    "requiresCompatibilities": [
      "EC2"
    ],
    "networkMode": null,
    "runtimePlatform": null,
    "cpu": "1024",
    "revision": 1,
    "status": "ACTIVE",
    "inferenceAccelerators": null,
    "proxyConfiguration": null,
    "volumes": []
  }