
# State Backends"
Flink provides different state backends that specify how and where state is stored.

State can be located on Java’s heap or off-heap. Depending on your state backend, Flink can also manage the state for the application, meaning Flink deals with the memory management (possibly spilling to disk if necessary) to allow applications to hold very large state. By default, the configuration file *flink-conf.yaml* determines the state backend for all Flink jobs.

However, the default state backend can be overridden on a per-job basis, as shown below.

For more information about the available state backends, their advantages, limitations, and configuration parameters see the corresponding section in [Deployment & Operations]({{ site.baseurl }}/ops/state/state_backends.html).

<div class="codetabs" markdown="1">
<div data-lang="java" markdown="1">
```java
StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();
env.setStateBackend(...);
```
</div>
<div data-lang="scala" markdown="1">
```scala
val env = StreamExecutionEnvironment.getExecutionEnvironment()
env.setStateBackend(...)
```
</div>
</div>


