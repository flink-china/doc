# Hadoop 集成

## 用 Hadoop Classpaths 配置 Flink

Flink在启动类似于客户端、JobManager 或 TaskManager 这种组件时，会使用 `HADOOP_CLASSPATH` 这个环境变量去扩展classpath。Hadoop 大多数的发行版本和云上环境并不会为该变量设置默认值，所以如果 Flink 要使用该变量，那么所有运行 Flink 组件的机器都应该把该变量赋值。

若在 YARN 上运行，则不会出现上述问题。因为运行在 YARN 上的 Flink 组件启动时会用到 Hadoop classpath 变量，但同时也会导致在往 YARN 提交任务时 Hadoop 的依赖项也必须在 classpath 中。为此，脚本中通常会添加如下命令：

```shell
export HADOOP_CLASSPATH=`hadoop classpath`
```

注意：`hadoop` 是 hadoop 的二进制文件，`classpath` 是一个 Hadoop classpath 参数。
