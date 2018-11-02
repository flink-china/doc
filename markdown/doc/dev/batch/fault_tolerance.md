# Fault Tolerance

Batch Processing Fault Tolerance (DataSet API)
----------------------------------------------

Fault tolerance for programs in the *DataSet API* works by retrying failed executions.
The number of time that Flink retries the execution before the job is declared as failed is configurable
via the *execution retries* parameter. A value of *0* effectively means that fault tolerance is deactivated.

To activate the fault tolerance, set the *execution retries* to a value larger than zero. A common choice is a value
of three.

This example shows how to configure the execution retries for a Flink DataSet program.

<div class="codetabs" markdown="1">
<div data-lang="java" markdown="1">
```java
ExecutionEnvironment env = ExecutionEnvironment.getExecutionEnvironment();
env.setNumberOfExecutionRetries(3);
```
</div>
<div data-lang="scala" markdown="1">
```scala
val env = ExecutionEnvironment.getExecutionEnvironment()
env.setNumberOfExecutionRetries(3)
```
</div>
</div>


You can also define default values for the number of execution retries and the retry delay in the `flink-conf.yaml`:

```yaml
execution-retries.default: 3
```


Retry Delays
------------

Execution retries can be configured to be delayed. Delaying the retry means that after a failed execution, the re-execution does not start
immediately, but only after a certain delay.

Delaying the retries can be helpful when the program interacts with external systems where for example connections or pending transactions should reach a timeout before re-execution is attempted.

You can set the retry delay for each program as follows (the sample shows the DataStream API - the DataSet API works similarly):

<div class="codetabs" markdown="1">
<div data-lang="java" markdown="1">
```java
ExecutionEnvironment env = ExecutionEnvironment.getExecutionEnvironment();
env.getConfig().setExecutionRetryDelay(5000); // 5000 milliseconds delay
```
</div>
<div data-lang="scala" markdown="1">
```scala
val env = ExecutionEnvironment.getExecutionEnvironment()
env.getConfig.setExecutionRetryDelay(5000) // 5000 milliseconds delay
```
</div>
</div>

You can also define the default value for the retry delay in the `flink-conf.yaml`:

```yaml
execution-retries.delay: 10 s
```

 
