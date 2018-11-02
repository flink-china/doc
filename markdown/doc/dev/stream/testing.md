# Testing

This page briefly discusses how to test a Flink application in your IDE or a local environment.

* This will be replaced by the TOC


## Unit testing

Usually, one can assume that Flink produces correct results outside of a user-defined `Function`. Therefore, it is recommended to test `Function` classes that contain the main business logic with unit tests as much as possible.

For example if one implements the following `ReduceFunction`:

<div class="codetabs" markdown="1">
<div data-lang="java" markdown="1">
```java
public class SumReduce implements ReduceFunction<Long> {

    @Override
    public Long reduce(Long value1, Long value2) throws Exception {
        return value1 + value2;
    }
}
```
</div>

<div data-lang="scala" markdown="1">
```scala
class SumReduce extends ReduceFunction[Long] {

    override def reduce(value1: java.lang.Long, value2: java.lang.Long): java.lang.Long = {
        value1 + value2
    }
}
```
</div>
</div>

It is very easy to unit test it with your favorite framework by passing suitable arguments and verify the output:

<div class="codetabs" markdown="1">
<div data-lang="java" markdown="1">
```java
public class SumReduceTest {

    @Test
    public void testSum() throws Exception {
        // instantiate your function
        SumReduce sumReduce = new SumReduce();

        // call the methods that you have implemented
        assertEquals(42L, sumReduce.reduce(40L, 2L));
    }
}
```
</div>

<div data-lang="scala" markdown="1">
```scala
class SumReduceTest extends FlatSpec with Matchers {

    "SumReduce" should "add values" in {
        // instantiate your function
        val sumReduce: SumReduce = new SumReduce()

        // call the methods that you have implemented
        sumReduce.reduce(40L, 2L) should be (42L)
    }
}
```
</div>
</div>

## Integration testing

In order to end-to-end test Flink streaming pipelines, you can also write integration tests that are executed against a local Flink mini cluster.

In order to do so add the test dependency `flink-test-utils`:

```xml
<dependency>
  <groupId>org.apache.flink</groupId>
  <artifactId>flink-test-utils{{ site.scala_version_suffix }}</artifactId>
  <version>{{site.version }}</version>
</dependency>
```

For example, if you want to test the following `MapFunction`:

<div class="codetabs" markdown="1">
<div data-lang="java" markdown="1">
```java
public class MultiplyByTwo implements MapFunction<Long, Long> {

    @Override
    public Long map(Long value) throws Exception {
        return value * 2;
    }
}
```
</div>

<div data-lang="scala" markdown="1">
```scala
class MultiplyByTwo extends MapFunction[Long, Long] {

    override def map(value: Long): Long = {
        value * 2
    }
}
```
</div>
</div>

You could write the following integration test:

<div class="codetabs" markdown="1">
<div data-lang="java" markdown="1">
```java
public class ExampleIntegrationTest extends AbstractTestBase {

    @Test
    public void testMultiply() throws Exception {
        StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();

        // configure your test environment
        env.setParallelism(1);

        // values are collected in a static variable
        CollectSink.values.clear();

        // create a stream of custom elements and apply transformations
        env.fromElements(1L, 21L, 22L)
                .map(new MultiplyByTwo())
                .addSink(new CollectSink());

        // execute
        env.execute();

        // verify your results
        assertEquals(Lists.newArrayList(2L, 42L, 44L), CollectSink.values);
    }

    // create a testing sink
    private static class CollectSink implements SinkFunction<Long> {

        // must be static
        public static final List<Long> values = new ArrayList<>();

        @Override
        public synchronized void invoke(Long value) throws Exception {
            values.add(value);
        }
    }
}
```
</div>

<div data-lang="scala" markdown="1">
```scala
class ExampleIntegrationTest extends AbstractTestBase {

    @Test
    def testMultiply(): Unit = {
        val env = StreamExecutionEnvironment.getExecutionEnvironment

        // configure your test environment
        env.setParallelism(1)

        // values are collected in a static variable
        CollectSink.values.clear()

        // create a stream of custom elements and apply transformations
        env
            .fromElements(1L, 21L, 22L)
            .map(new MultiplyByTwo())
            .addSink(new CollectSink())

        // execute
        env.execute()

        // verify your results
        assertEquals(Lists.newArrayList(2L, 42L, 44L), CollectSink.values)
    }
}    

// create a testing sink
class CollectSink extends SinkFunction[Long] {

    override def invoke(value: java.lang.Long): Unit = {
        synchronized {
            values.add(value)
        }
    }
}

object CollectSink {

    // must be static
    val values: List[Long] = new ArrayList()
}
```
</div>
</div>

The static variable in `CollectSink` is used here because Flink serializes all operators before distributing them across a cluster.
Communicating with operators instantiated by a local Flink mini cluster via static variables is one way around this issue.
Alternatively, you could for example write the data to files in a temporary directory with your test sink.
You can also implement your own custom sources for emitting watermarks.

## Testing checkpointing and state handling

One way to test state handling is to enable checkpointing in integration tests. 

You can do that by configuring your `StreamExecutionEnvironment` in the test:

<div class="codetabs" markdown="1">
<div data-lang="java" markdown="1">
```java
env.enableCheckpointing(500);
env.setRestartStrategy(RestartStrategies.fixedDelayRestart(3, 100));
```
</div>

<div data-lang="scala" markdown="1">
```scala
env.enableCheckpointing(500)
env.setRestartStrategy(RestartStrategies.fixedDelayRestart(3, 100))
```
</div>
</div>

And for example adding to your Flink application an identity mapper operator that will throw an exception
once every `1000ms`. However writing such test could be tricky because of time dependencies between the actions.

Another approach is to write a unit test using the Flink internal testing utility `AbstractStreamOperatorTestHarness` from the `flink-streaming-java` module.

For an example of how to do that please have a look at the `org.apache.flink.streaming.runtime.operators.windowing.WindowOperatorTest` also in the `flink-streaming-java` module.

Be aware that `AbstractStreamOperatorTestHarness` is currently not a part of public API and can be subject to change.


