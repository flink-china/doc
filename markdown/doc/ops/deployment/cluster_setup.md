# Standalone 部署模式
<!--
Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.
-->

本文主要讲述如何在一个分布式的集群中运行Flink.

## 部署需求

### 软件需求

Flink 运行在由一个 master 节点、一个或多个 worker 节点组成的集群上，集群中的机器需为 *UNIX系统*，比如 **Linux**，**Mac OS X**，**Cygwin** (for Windows)。在部署环境之前，请确保每台机器都装有如下软件：

- **Java 1.8.x** 或更高版本，
- **ssh** （必须运行sshd才能使用Flink脚本管理远程组件）

如果集群中不满足以上软件要求，则需要安装或对软件进行升级。

在集群的所有节点中运用 __ssh免密登陆__ 和 __相同的目录结构__ 可以保证我们使用脚本控制一切。


### `JAVA_HOME` 配置

Flink 要求master和所有的worker节点上都配有 `JAVA_HOME` 环境变量，该变量指向Java的安装路径。

该变量可以在 `conf/flink-conf.yaml` 通过 `env.java.home` 设置。

## Flink 安装

在[下载链接]({{site.download_url}}) 中找到所需的安装包。并确保所选择的Flink安装包与**Hadoop版本**相匹配。如果不使用 Hadoop，可以选择任何版本。

下载完最新版本的安装包后，把该包拷贝到 master 节点上，并解压缩。

```shell
tar xzf flink-*.tgz
cd flink-*
```

### Flink参数配置

将系统文件解压后，需要编辑*conf/flink-conf.yaml*来配置集群中的 Flink。

可将 `jobmanager.rpc.address` 的值设置为 master 节点。还可以通过设置 `jobmanager.heap.mb` 和 `taskmanager.heap.mb` 的值来定义JVM最大内存量。

这些值的单位为MB。如果 worker 节点有更多内存可以分配给 Flink 系统，则可以在这些节点上设置 `FLINK_TM_HEAP` 来覆盖默认值。

最后，您必须罗列出集群中可作为 workder 的所有节点。与 HDFS 的配置类似，编辑*conf/slaves*文件，并输入每个 workder 节点的IP /主机名。每个 worker 节点后面都会运行一个 TaskManager。

下面以三个节点的部署为例(IP地址从 _10.0.0.1_
 到 _10.0.0.3_ ，主机名分别为 _master_, _worker1_, _worker2_)，还显示了所有配置文件的内容(需在所有机器上的相同路径上访问):

<div class="row">
  <div class="col-md-6 text-center">
    <img src="assets/quickstart_cluster.png" style="width: 60%">
  </div>
<div class="col-md-6">
  <div class="row">
    <p class="lead text-center">
      /path/to/<strong>flink/conf/<br>flink-conf.yaml</strong>
    <pre>jobmanager.rpc.address: 10.0.0.1</pre>
    </p>
  </div>
<div class="row" style="margin-top: 1em;">
  <p class="lead text-center">
    /path/to/<strong>flink/<br>conf/slaves</strong>
  <pre>
10.0.0.2
10.0.0.3</pre>
  </p>
</div>
</div>
</div>

每个 worker 都必须有相同的 Flink 可用路径。可以通过共享 NFS 目录来达到此目的，或者直接把整个 Flink 目录拷贝到每个 worker 节点上。

请参考[configuration page](../config.html)来查看更多细节和其他配置项。

其中,

 * 每个 JobManager 可用内存量 (`jobmanager.heap.mb`)，
 * 每个 TaskManager 可用内存量 (`taskmanager.heap.mb`)，
 * 每台计算机可用 CPU 数 (`taskmanager.numberOfTaskSlots`)，
 * 集群中的 CPU 总数 (`parallelism.default`)，
 * 临时目录 (`taskmanager.tmp.dirs`)

为非常重要的配置项。

### 运行 Flink

如下脚本会在当前节点上启动 JobManager，并通过 SSH 连接到 slaves 列表中罗列的所有 worker 节点，并在每个节点上启动 TaskManager。现在 Flink 系统已经启动并正在运行。 在当前节点上运行的 JobManager 现在可以接受配置在 RPC 端口上的作业。

假设你在 master 节点上的 Flink 目录中：

```shell
./bin/start-cluster.sh
```

如想停止 Flink 任务，可运行 `stop-cluster.sh` 脚本。

### 集群中添加 JobManager/TaskManager 实例

可以使用 `bin/jobmanager.sh` 和 `bin/taskmanager.sh` 两个脚本把 JobManager 和 TaskManager 实例添加到正在运行的集群中。

#### 添加 JobManager

```shell
./bin/jobmanager.sh ((start|start-foreground) [host] [webui-port])|stop|stop-all
```

#### 添加 TaskManager

```shell
./bin/taskmanager.sh start|start-foreground|stop|stop-all
```

请务必在要启动/停止相应实例的主机上调用这些脚本。
