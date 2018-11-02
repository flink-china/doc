# YARN 模式
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


## 快速开始

### 启动一个一直运行的 YARN session

启动一个有4个 Task Managers (每个有 4 GB Heapspace )的 YARN session:

```shell
# 可从 Flink 下载页面获取 hadoop2 的包
# http://flink.apache.org/downloads.html
curl -O <flink_hadoop2_download_url>
tar xvzf flink-{{ site.version }}-bin-hadoop2.tgz
cd flink-{{ site.version }}/
./bin/yarn-session.sh -n 4 -s 5 -jm 1024 -tm 4096
```

其中 `-s` 为 TaskManager的 slot 数，建议将 slot 数量设置为机器 cpu 的个数。
session 启动后，就可以用 `./bin/flink` 工具把任务提交到集群中了。

### 在 YARN 上运行一个 Flink 任务

```shell
# 可从 Flink 下载页面获取 hadoop2 的包
# http://flink.apache.org/downloads.html
curl -O <flink_hadoop2_download_url>
tar xvzf flink-{{ site.version }}-bin-hadoop2.tgz
cd flink-{{ site.version }}/
./bin/flink run -m yarn-cluster -yn 4 -yjm 1024 -ytm 4096 ./examples/batch/WordCount.jar
```

## Flink YARN Session

Apache [Hadoop YARN](http://hadoop.apache.org/) 是一个集群资源管理框架。它可以在群集上运行各种分布式应用程序。Flink 可与其他应用并行于 YARN 中。如果已经部署了 YARN，用户不用再去部署或者安装任何东西。

**部署需求**

- Apache Hadoop 2.2 版本及以上
- HDFS (Hadoop Distributed File System) (或 Hadoop 支持的其他分布式文件系统)

如果您在使用 Flink YARN 客户端时遇到问题，请查看[FAQ 部分](http://flink.apache.org/faq.html#yarn-deployment).

### 启动 Flink Session

请按照以下说明了解如何在YARN群集中启动 Flink Session。

一个session会话将启动所有必需的 Flink 服务（JobManager 和 TaskManagers），这样就可以将程序提交到集群当中去了。注意：可以在一个session中运行多个程序。

#### 下载 Flink

从[此处](http://flink.apache.org/downloads.html)下载一个 Hadoop >= 2 的 Flink 包，里面有所需文件。

使用如下命令对包进行解压：

```shell
tar xvzf flink-1.6.0-bin-hadoop2.tgz
cd flink-1.6.0/
```

#### 启动 Session

启动 session 命令如下：

```shell
./bin/yarn-session.sh
```

该命令参数信息如下:

```shell
Usage:
   Required
     -n,--container <arg>   Number of YARN container to allocate (=Number of Task Managers)
   Optional
     -D <arg>                        Dynamic properties
     -d,--detached                   Start detached
     -jm,--jobManagerMemory <arg>    Memory for JobManager Container with optional unit (default: MB)
     -nm,--name                      Set a custom name for the application on YARN
     -q,--query                      Display available YARN resources (memory, cores)
     -qu,--queue <arg>               Specify YARN queue.
     -s,--slots <arg>                Number of slots per TaskManager
     -tm,--taskManagerMemory <arg>   Memory per TaskManager Container with optional unit (default: MB)
     -z,--zookeeperNamespace <arg>   Namespace to create the Zookeeper sub-paths for HA mode
```

注意：客户端需要设置 `YARN_CONF_DIR` 或 `HADOOP_CONF_DIR` 变量来读取YARN和HDFS的配置。

**例如:** 运行下面的命令来给任务分配 10 个 TaskManagers，每个 TaskManagers 都有 8 GB 内存和 3 2个 slot：

```shell
./bin/yarn-session.sh -n 10 -tm 8192 -s 32
```

该系统会使用 `conf/flink-conf.yaml` 中的配置。如果想更改配置项内容，请参考[配置指南](ops/config.html)。如果指定了 slot 数，Flink会重写配置中的 `jobmanager.rpc.address`（因为JobManager总是分配到不同的机器上)，`taskmanager.tmp.dirs`（YARN临时目录）和 `parallelism.default` 参数。如果不想通过更改配置文件的方式来设置参数，可以通过 `-D` 来动态设置参数属性。所以可以通过如下方式来传递参数：`-Dfs.overwrite-files=true -Dtaskmanager.network.memory.min=536346624`。

上例中启动了 11 个 container（仅配置了 10 个 container ）是因为有一个额外的 container 用做 ApplicationMaster 和 JobManager。

在 YARN 集群中部署 Flink 后，会显示 JobManager的详情连接情况。

通过停止 unix 进程（使用 CTRL + C ）或在客户端输入 'stop' 来停止 YARN session。

如果集群有足够的资源，YARN 中的 Flink 会按照配置数启动 container。大多数 YARN 调度器还会兼容 container 所配置的内存大小和 vcore 数量。默认情况下，vcore 数和（`-s`）中的 slot 数相等。但是 [`yarn.containers.vcores`](ops/config.html#yarn-containers-vcores) 可以自定义 vcore 数。为了使此参数起作用，应该在集群中启用 CPU 调度。

#### 后台 YARN Session

如果不想让 Flink YARN 的客户端一直运行，也可以启动一个后台运行的 yarn session，启动参数为 `-d` 或者 `--detached`。

这样，Flink YARN 的客户端把任务提交到集群后就会自行关闭。

注意：这种情况下不能用 Flink 来停止 YARN session。要用 YARN 命令（`yarn application -kill <appId>`）来停止 YARN session。

#### 附加任务到现有 Session

使用如下命令来启动 session

```shell
./bin/yarn-session.sh
```

执行后会出现以下信息：

```shell
Usage:
   Required
     -id,--applicationId <yarnAppId> YARN application Id
```

如上所述，必须配置 `YARN_CONF_DIR` 或 `HADOOP_CONF_DIR` 这个环境变量，这样才能读取 YARN 和 HDFS 的配置文件。

**比如:** 下面的命令会把 Flink YARN session 附加到正在运行的session `application_1463870264508_0029` 中:

```shell
./bin/yarn-session.sh -id application_1463870264508_0029
```

附加的 session 可使用 YARN ResourceManager 来确定 Job Manager RPC 的端口。

可通过杀死 unix 进程（CTRL+C）或在客户端输入 'stop' 命令来停止 YARN session。

### 提交Flink任务

使用如下命令来把 Flink 任务提交到 YARN 集群中:

```shell
./bin/flink
```

请参阅文档[command-line client](ops/cli.html).

该命令会显示如下信息：

```shell
[...]
Action "run" compiles and runs a program.

  Syntax: run [OPTIONS] <jar-file> <arguments>
  "run" action arguments:
     -c,--class <classname>           Class with the program entry point ("main"
                                      method or "getPlan()" method. Only needed
                                      if the JAR file does not specify the class
                                      in its manifest.
     -m,--jobmanager <host:port>      Address of the JobManager (master) to
                                      which to connect. Use this flag to connect
                                      to a different JobManager than the one
                                      specified in the configuration.
     -p,--parallelism <parallelism>   The parallelism with which to run the
                                      program. Optional flag to override the
                                      default value specified in the
                                      configuration
```

使用 *run* 参数把任务提交到 YARN 上。客户端可以用 `-m` 参数查找到 JobManager 的 ip 地址。也可以在 YARN 管理页面查看 JobManager ip 地址。

**示例**

```shell
wget -O LICENSE-2.0.txt http://www.apache.org/licenses/LICENSE-2.0.txt
hadoop fs -copyFromLocal LICENSE-2.0.txt hdfs:/// ...
./bin/flink run ./examples/batch/WordCount.jar \
        hdfs:///..../LICENSE-2.0.txt hdfs:///.../wordcount-result.txt
```

如果有 error 信息出现，请确保所有的 TaskManager 都已经被启动：

```shell
Exception in thread "main" org.apache.flink.compiler.CompilerException:
    Available instances could not be determined from job manager: Connection timed out.
```

可以在 JobManager 的页面上查看 TaskManager 数，这个页面地址可以在 YARN session 的控制台找到。

如果一分钟后还没有 TaskManagers，可以看日志查找原因。

## 在 YARN 上运行一个独立的 Flink 作业

上述内容讲解了如何在 Hadoop YARN 环境中启动 Flink 集群。也可以在 YARN 中启动只执行单个任务的 Flink。

注意：客户端要通过 `-yn` 来设置 TaskManager 数。

***示例:***

```shell
./bin/flink run -m yarn-cluster -yn 2 ./examples/batch/WordCount.jar
```

上述参数同样适用于 `./bin/flink`，前缀为 `y` 或 `yarn`（长参数）。

注意：每个 job 可使用不同的配置路径来设定 `FLINK_CONF_DIR` 参数。可把 Flink 下的 `conf` 目录拷贝一个副本进行修改，比如，job 的日志相关配置。

注意: 可以把 `-m yarn-cluster` 和 `-yd` 参数联合使用，在 YARN 上提交一个后台任务。这样，就不会在调用 ExecutionEnvironment.execute() 时获得任何附加结果或异常。

### 用户的 jars & Classpath

默认情况下，启动单个作业时 Flink 会把用户的 jar 包加载到系统 classpath 上，该操作也可使用 `yarn.per-job-cluster.include-user-jar` 参数。

当把这个参数设置为 `DISABLED` 时，Flink 加载用户 classpath 中的 jar 包。

用户 jar 包位置可通过如下参数进行修改：

- `ORDER`：（默认）根据字典顺序将 jar 添加到系统 classpath。
- `FIRST`：将 jar 添加到系统 classpath 之前。
- `LAST`：将 jar 添加到系统 classpath 之后。

## Flink 基于 YARN 的恢复机制

Flink 的 YARN 客户端通过下面的配置参数来控制容器的故障恢复。这些参数可以通过 `conf/flink-conf.yaml` 或者在启动 YARN session 的时候通过 -D 参数来指定。

- `yarn.reallocate-failed`：该参数控制了 Flink 是否该重新分配失败的 TaskManager 容器。默认值：true
- `yarn.maximum-failed-containers`：ApplicationMaster 能接受最多的失败 container 数，直到 YARN 会话失败。默认：初始请求的 TaskManager 数（-n）
- `yarn.application-attempts`：ApplicationMaster（以及 TaskManager containers）重试次数。此参数默认值为1，如果 Application master 失败，那么整个 YARN session 会失败。如果想增大 ApplicationMaster 重启次数，可以把该参数的值调大一些。

## 调试失败的 YARN session

能够导致 Flink YARN session 发布失败的原因有很多。Hadoop 配置错误（ HDFS 权限，YARN 配置），版本不兼容等等。

### 日志文件

如果 Flink YARN session 在部署时发生了失败，用户必须依赖 Hadoop YARN 的日志来排查问题。最有用的部分为 [YARN log aggregation](http://hortonworks.com/blog/simplifying-user-logs-management-and-access-in-yarn/)。如果想使用这项功能，要在 `yarn-site.xml` 中把 `yarn.log-aggregation-enable` 的值设置为 `true`。设置成功后，可通过如下命令查看错误日志。

```shell
yarn logs -applicationId <application ID>
```

注意：session 结束后需要等几秒钟才会看到日志。

### YARN 客户端控制台 & Web 界面

如果在运行期间出现错误，Flink YARN 客户端会在终端中打印出错误消息（比如 TaskManager 在启动了一会后任务停止）。

此外，还可以在 YARN ResourceManager 界面中（默认为8088）查看错误信息，端口号配置在 `yarn.resourcemanager.webapp.address`。

通过界面不仅可以看到运行中的 application 信息，也可以看到失败 application 的一些诊断信息。

## 针对指定 Hadoop 版本构建 YARN 客户端

如果用户使用了诸如 Hortonworks , Cloudera or MapR等公司发行的 Hadoop 版本，那么可能需要针对其特定版本的 Hadoop（HDFS）和 YARN 版本来构建 Flink。更多详情信息请参阅 [构建指南]({{site.baseurl}}/start/building.html)。

## 使用防火墙在 YARN 上运行 Flink

一些 YARN 集群会使用防火墙来控制集群间的网络传输。这样，Flink的任务只能在集群网络内部（防火墙后）提交 YARN session。如果这样不能满足生产任务，Flink 可以所有相关的服务配置一系列端口。配置后就可以透过防火墙来提交任务了。

目前，提交任务需要两个服务：

 * JobManager ( YARN 中的 ApplicationMaster )。
 * 运行于 JobManager 内的 BlobServer。

当向 Flink 一个任务时，BlobServer 会使用用户代码把 jar 包分布于各个节点（ TaskManagers ）上。JobManager 会接收到任务请求，开始运行任务。

用于指定端口的两个配置参数如下：

 * `yarn.application-master.port`
 * `blob.server.port`

这两个配置参数可接受一个端口号（如："50010" ），一个区间内的端口（ "50000-50025" ），或一组端口（ "50010，50011，50020-50025，50050-50075" ）。

（ Hadoop 也可使用类似机制，配置参数为 `yarn.app.mapreduce.am.job.client.port-range` ）

## 背景 / 内部实现

本节简要介绍了 Flink 和 YARN 之间的交互。

<img src="assets/FlinkOnYarn.svg" class="img-responsive">

YARN 客户端需要访问 Hadoop 配置去连接 YARN resource manager 和 HDFS。Hadoop配置确定策略如下：

* 按顺序检测配置项 `YARN_CONF_DIR`、`HADOOP_CONF_DIR` 或 `HADOOP_CONF_PATH`。任何一项配置有值，就会被用来读取配置。
* 如果上述方式失败（YARN配置正确不会发生此种情况），客户端会使用 `HADOOP_HOME` 这个环境变量。如果配置了该变量，客户端会尝试访问 `$HADOOP_HOME/etc/hadoop` ( Hadoop 2 ) 和 `$HADOOP_HOME/conf` ( Hadoop 1 )。

当启动了一个新的 Flink Yarn session 时，客户端会首先查看所需资源（container 和 内存）是否可用。之后，会将包含 Flink 及其配置项的 jar 包上传到 HDFS 上（ 步骤 1 ）。

客户端下一步会去请求（ 步骤 2 ）YARN container 去启动 *ApplicationMaster* （ 步骤 3 ）。由于客户端在 container 上注册了 jar 包和配置项资源，所以 YARN 的 NodeManager 会在指定机器上准备 container （例如下载文件）。完成后，*ApplicationMaster* (AM) 就会被启动。

*JobManager* 和 AM 运行于同样的 container 上。一旦他们被成功启动，AM 就会知道 JobManager 的地址（当前主机）。 他会给 JobManager 产生一个新的 Flink 配置文件（以便连接到JobManager）。此外，*AM* container 也会提供一个 Flink 界面。YARN 中分配的所有端口都是 *临时端口*。这样可以允许用户并行运行多个 Flink YARN session。

之后，AM 会从 HDFS 上下载一些 jar 包和修改后的配置文件，来给 Flink 的 TaskManagers 分配 container。这些步骤运行完成后，Flink 就安装成功，开始准备接受作业任务了。

