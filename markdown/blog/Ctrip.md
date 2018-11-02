---
title: 携程基于Flink的实时特征平台
author: 刘康
time: 2018/07/26
order: 11
comment: 本文来自7月26日在上海举行的 Flink Meetup 会议，分享来自于刘康，目前在大数据平台部从事模型生命周期相关平台开发，现在主要负责基于flink开发实时模型特征计算平台。熟悉分布式计算，在模型部署及运维方面有丰富实战经验和深入的理解，对模型的算法及训练有一定的了解。
---

# 携程基于Flink的实时特征平台

> 本文来自7月26日在上海举行的 Flink Meetup 会议，分享来自于刘康，目前在大数据平台部从事模型生命周期相关平台开发，现在主要负责基于flink开发实时模型特征计算平台。熟悉分布式计算，在模型部署及运维方面有丰富实战经验和深入的理解，对模型的算法及训练有一定的了解。

本文主要内容如下：  

- 在公司实时特征开发的现状基础上，说明实时特征平台的开发背景、目标以及现状
- 选择Flink作为平台计算引擎的原因
- Flink的实践：有代表性的使用示例、为兼容Aerospike（平台的存储介质）的开发以及碰到的坑
- 当前效果&未来规划  

## 一、在公司实时特征开发的现状基础上，说明实时特征平台的开发背景、目标以及现状
### 1、原实时特征作业的开发运维
1.1、选择实时计算平台：依据项目的性能指标要求（latency，throughput等），在已有的实时计算平台:Storm Spark flink进行选择  

1.2主要的开发运维过程：  

- 80%以上的作业需要用到消息队列数据源，但是消息队列为非结构化数据且没有统一的数据字典。所以需要通过消费对应的topic，解析消息并确定所需的内容
- 基于需求中的场景，设计开发计算逻辑
- 在实时数据不能完全满足数据需求的情况，另外开发单独的离线作业以及融合逻辑；  
例如：在需要30天数据的场景下，但消息队列中只有七天内的数据时（kafka中消息的默认保留时间），剩下23天就需要用离线数据来补充。  
- 设计开发数据的校验和纠错逻辑
消息的传输需要依赖网络，消息丢失和超时难以完全避免，所以需要有一个校验和纠错的逻辑。
- 测试上线
- 监控和预警

### 2、原实时特征作业的开发痛点
- 消息队列数据源结构没有统一的数据字典  
- 特征计算逻辑高度定制化，开发测试周期长  
- 实时数据不能满足需求时，需要定制离线作业和融合逻辑  
- 校验和纠错方案没有形成最佳实践，实际效果比较依赖个人能力  
- 监控和预警方案需要基于业务逻辑定制  

### 3、基于整理的痛点，确定下来的平台目标
- 实时数据字典：提供统一的数据源注册、管理功能，支持单一结构消息的topic和包含多种不同结构消息的topic  
- 逻辑抽象：抽象为SQL，减少工作量&降低使用门槛  
- 特征融合：提供融合特征的功能，解决实时特征不能完全满足数据需求的情况  
- 数据校验和纠错：提供利用离线数据校验和纠错实时特征的功能  
- 实时计算延迟：ms级  
- 实时计算容错：端到端 exactly-once  
- 统一的监控预警和HA方案  

### 4、特征平台系统架构

![01](https://img.alicdn.com/tfs/TB1SsplmhTpK1RjSZR0XXbEwXXa-865-525.png)

现在的架构是标准lamda架构，离线部分由spark sql + dataX组成。现在使用的是KV存储系统Aerospike，跟redis的主要区别是使用SSD作为主存，我们压测下来大部分场景读写性能跟redis在同一个数据量级。  

实时部分：使用flink作为计算引擎，介绍一下用户的使用方式：  

- 注册数据源：目前支持的实时数据源主要是Kafka和Aerospike，其中Aerospike中的数据如果是在平台上配置的离线或者实时特征，会进行自动注册。Kafka数据源需要上传对应的schemaSample文件  
- 计算逻辑：通过SQL表达  
- 定义输出：定义输出的Aerospike表和可能需要的Kafka Topic,用于推送Update或者Insert的数据的key  

用户完成上面的操作后，平台将所有信息写入到json配置文件。下一步平台将配置文件和之前准备好的flinkTemplate.jar(包含所有平台所需的flink功能)提交给yarn，启动flink job。  

### 5、平台功能展示
1）平台功能展示-数据源注册  
![02](https://img.alicdn.com/tfs/TB1NMVpmmzqK1RjSZFjXXblCFXa-864-589.png)  

2）实时特征编辑-基本信息  
![03](https://img.alicdn.com/tfs/TB1SsNsmkvoK1RjSZFDXXXY3pXa-864-503.png)  

3）实时特征编辑-数据源选择  
![04](https://img.alicdn.com/tfs/TB1ltVrmgHqK1RjSZFkXXX.WFXa-865-526.png)  

4）实时特征编辑-SQL计算  
![05](https://img.alicdn.com/tfs/TB17tVrmgHqK1RjSZFkXXX.WFXa-865-545.png)  

5）实时特征编辑-选择输出  
![06](https://img.alicdn.com/tfs/TB1wV0lmjTpK1RjSZKPXXa3UpXa-865-396.png)  

## 二、选择Flink的原因
我们下面一个我们说一下我们选择flink来做这个特征平台的原因。  
![07](https://img.alicdn.com/tfs/TB12E8kmb2pK1RjSZFsXXaNlXXa-864-596.png)  

分为三个维度：最高延迟、容错、sql功能成熟度

- 延迟：storm和flink是纯流式，最低可以达到毫秒级的延迟。spark的纯流式机制是continuous模式，也可以达最低毫秒级的延迟  
- 容错：storm使用异或ack的模式，支持atLeastOnce。消息重复解决不。spark通过checkpoint和WAL来提供exactlyOnce。flink通过checkpoint和SavePoint来做到exactlyOnce。  
- sql成熟度：storm现在的版本中SQL还在一个实验阶段,不支持聚合和join。spark现在可以提供绝大部分功能，不支持distinct、limit和聚合结果的order by。flink现在社区版中提供的sql，不支持distinct aggregate  
## 三、Flink实践
1、实⽤示例  
![08](https://img.alicdn.com/tfs/TB1vkdrmcfpK1RjSZFOXXa6nFXa-864-500.png)  

2、兼容开发：flink现在没有对Aerospike提供读写支持，所以需要二次开发  
![09](https://img.alicdn.com/tfs/TB1P68rmcfpK1RjSZFOXXa6nFXa-865-514.png)  

3、碰到的坑  
![10](https://img.alicdn.com/tfs/TB15DhnmXzqK1RjSZFoXXbfcXXa-864-457.png)  

## 四、平台当前效果&未来规划

当前效果：将实时特征上线周期从原平均3天-5天降至小时级。未来规划：
- 完善特征平台的功能：融合特征等
- 简化步骤，提高用户体验
- 根据需求，进一步完善SQL的功能例如支持win的开始时间offset，可以通过countTrigger的win等

下一步的规划是通过sql或者DSL来描述模型部署和模型训练  

![last](https://img.alicdn.com/tfs/TB1W2JqmbrpK1RjSZTEXXcWAVXa-864-500.png)  