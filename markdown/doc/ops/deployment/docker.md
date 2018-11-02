# Docker 部署
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
[Docker](https://www.docker.com) 是一个现在比较流行的 container runtime。在Docker Hub有 Apache Flink 的Docker镜像，可用于部署session。Flink的repo源上也有一个创建container镜像的工具，该镜像可以帮助部署集群作业。

## Flink session 模式

Flink session 模式可以用来运行多个作业。部署后，每个作业都需要提交到集群中去。

### Docker 镜像

[官方Docker repo 源](https://hub.docker.com/_/flink/) 托管于 Docker Hub 上，用于提供Flink 1.2.1 或更高版本的镜像。

repo源上同样也存在 Hadoop 与 Scala 的组合镜像，为了查看方便都起了别名。

比如，可以使用以下别名：*（`1.2.y`表示最近发布的 Flink 1.2 版本）*

* `flink:latest` →
`flink:<latest-flink>-hadoop<latest-hadoop>-scala_<latest-scala>`
* `flink:1.2` → `flink:1.2.y-hadoop27-scala_2.11`
* `flink:1.2.1-scala_2.10` → `flink:1.2.1-hadoop27-scala_2.10`
* `flink:1.2-hadoop26` → `flink:1.2.y-hadoop26-scala_2.11`

<!-- NOTE: uncomment when docker-flink/docker-flink/issues/14 is resolved. -->
<!--
Additionally, images based on Alpine Linux are available. Reference them by
appending `-alpine` to the tag. For the Alpine version of `flink:latest`, use
`flink:alpine`.

For example:

* `flink:alpine`
* `flink:1.2.1-alpine`
* `flink:1.2-scala_2.10-alpine`
-->

**注意：** docker 镜像为个人发布到社区的镜像，非官方 Apache Flink PMC。

## Flink job 模式

Flink job 模式是运行单个作业的专用模式。
Flink job 是镜像的一部分，因此，不需要额外再提交。

### Docker 镜像

Flink job 模式的镜像要包含启动集群作业的用户jar包。因此，需要为每个job构建专用的容器镜像。 `flink-container` 模块中有一个 `build.sh` 脚本，该脚本用于创建此镜像。查看更多信息请参阅
 [用户指南](https://github.com/apache/flink/blob/{{site.github_branch}}/flink-container/docker/README.md)。

## Flink 与 Docker Compose

[Docker Compose](https://docs.docker.com/compose/) 可以方便的在本地运行一组Docker容器。

GitHub 上提供了 [session 模式](https://github.com/docker-flink/examples/blob/master/docker-compose.yml)与 [job 模式](https://github.com/apache/flink/blob/{{site.github_branch}}/flink-container/docker/docker-compose.yml) 的可用配置文件。


### 用法

* 前台启动任务

        docker-compose up

* 后台启动任务

        docker-compose up -d

* 扩展任务的TaskManager数

        docker-compose scale taskmanager=<N>

* Kill 任务

        docker-compose kill

任务运行后，可以通过[http://localhost:8081](http://localhost:8081)访问 web UI。也可以通过 web UI 来把一个 job 提交 session 模式中。

如果要通过命令行来提交一个 session，则必须把 JAR 包拷贝到 JobManager container 上，然后在上面提交任务。

比如:

```shell
    $ JOBMANAGER_CONTAINER=$(docker ps --filter name=jobmanager --format={{.ID}})
    $ docker cp path/to/jar "$JOBMANAGER_CONTAINER":/job.jar
    $ docker exec -t -i "$JOBMANAGER_CONTAINER" flink run /job.jar
```