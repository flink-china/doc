
# Side Outputs

In addition to the main stream that results from `DataStream` operations, you can also produce any
number of additional side output result streams. The type of data in the result streams does not
have to match the type of data in the main stream and the types of the different side outputs can
also differ. This operation can be useful when you want to split a stream of data where you would
normally have to replicate the stream and then filter out from each stream the data that you don't
want to have.

When using side outputs, you first need to define an `OutputTag` that will be used to identify a
side output stream:

<div class="codetabs" markdown="1">
<div data-lang="java" markdown="1">

```java
// this needs to be an anonymous inner class, so that we can analyze the type
OutputTag<String> outputTag = new OutputTag<String>("side-output") {};
```
</div>

<div data-lang="scala" markdown="1">
```scala
val outputTag = OutputTag[String]("side-output")
```
</div>
</div>

Notice how the `OutputTag` is typed according to the type of elements that the side output stream
contains.

Emitting data to a side output is possible from the following functions:

- [ProcessFunction]({{ site.baseurl }}/dev/stream/operators/process_function.html)
- CoProcessFunction
- [ProcessWindowFunction]({{ site.baseurl }}/dev/stream/operators/windows.html#processwindowfunction)
- ProcessAllWindowFunction

You can use the `Context` parameter, which is exposed to users in the above functions, to emit
data to a side output identified by an `OutputTag`. Here is an example of emitting side output
data from a `ProcessFunction`:

<div class="codetabs" markdown="1">
<div data-lang="java" markdown="1">

```java
DataStream<Integer> input = ...;

final OutputTag<String> outputTag = new OutputTag<String>("side-output"){};

SingleOutputStreamOperator<Integer> mainDataStream = input
  .process(new ProcessFunction<Integer, Integer>() {

      @Override
      public void processElement(
          Integer value,
          Context ctx,
          Collector<Integer> out) throws Exception {
        // emit data to regular output
        out.collect(value);

        // emit data to side output
        ctx.output(outputTag, "sideout-" + String.valueOf(value));
      }
    });
```

</div>

<div data-lang="scala" markdown="1">
```scala

val input: DataStream[Int] = ...
val outputTag = OutputTag[String]("side-output")

val mainDataStream = input
  .process(new ProcessFunction[Int, Int] {
    override def processElement(
        value: Int,
        ctx: ProcessFunction[Int, Int]#Context,
        out: Collector[Int]): Unit = {
      // emit data to regular output
      out.collect(value)

      // emit data to side output
      ctx.output(outputTag, "sideout-" + String.valueOf(value))
    }
  })
```
</div>
</div>

For retrieving the side output stream you use `getSideOutput(OutputTag)`
on the result of the `DataStream` operation. This will give you a `DataStream` that is typed
to the result of the side output stream:

<div class="codetabs" markdown="1">
<div data-lang="java" markdown="1">

```java
final OutputTag<String> outputTag = new OutputTag<String>("side-output"){};

SingleOutputStreamOperator<Integer> mainDataStream = ...;

DataStream<String> sideOutputStream = mainDataStream.getSideOutput(outputTag);
```

</div>

<div data-lang="scala" markdown="1">
```scala
val outputTag = OutputTag[String]("side-output")

val mainDataStream = ...

val sideOutputStream: DataStream[String] = mainDataStream.getSideOutput(outputTag)
```
</div>
</div>


