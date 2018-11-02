# Zipping Elements in a DataSet

In certain algorithms, one may need to assign unique identifiers to data set elements.
This document shows how {% gh_link /flink-java/src/main/java/org/apache/flink/api/java/utils/DataSetUtils.java "DataSetUtils" %} can be used for that purpose.

* This will be replaced by the TOC
{:toc}

### Zip with a Dense Index
`zipWithIndex` assigns consecutive labels to the elements, receiving a data set as input and returning a new data set of `(unique id, initial value)` 2-tuples.
This process requires two passes, first counting then labeling elements, and cannot be pipelined due to the synchronization of counts.
The alternative `zipWithUniqueId` works in a pipelined fashion and is preferred when a unique labeling is sufficient.
For example, the following code:

<div class="codetabs" markdown="1">
<div data-lang="java" markdown="1">
```java
ExecutionEnvironment env = ExecutionEnvironment.getExecutionEnvironment();
env.setParallelism(2);
DataSet<String> in = env.fromElements("A", "B", "C", "D", "E", "F", "G", "H");

DataSet<Tuple2<Long, String>> result = DataSetUtils.zipWithIndex(in);

result.writeAsCsv(resultPath, "\n", ",");
env.execute();
```
</div>

<div data-lang="scala" markdown="1">
```scala
import org.apache.flink.api.scala._

val env: ExecutionEnvironment = ExecutionEnvironment.getExecutionEnvironment
env.setParallelism(2)
val input: DataSet[String] = env.fromElements("A", "B", "C", "D", "E", "F", "G", "H")

val result: DataSet[(Long, String)] = input.zipWithIndex

result.writeAsCsv(resultPath, "\n", ",")
env.execute()
```
</div>

<div data-lang="python" markdown="1">
```python
from flink.plan.Environment import get_environment

env = get_environment()
env.set_parallelism(2)
input = env.from_elements("A", "B", "C", "D", "E", "F", "G", "H")

result = input.zip_with_index()

result.write_text(result_path)
env.execute()
```
</div>

</div>

may yield the tuples: (0,G), (1,H), (2,A), (3,B), (4,C), (5,D), (6,E), (7,F)

[Back to top](#top)

### Zip with a Unique Identifier
In many cases one may not need to assign consecutive labels.
`zipWithUniqueId` works in a pipelined fashion, speeding up the label assignment process. This method receives a data set as input and returns a new data set of `(unique id, initial value)` 2-tuples.
For example, the following code:

<div class="codetabs" markdown="1">
<div data-lang="java" markdown="1">
```java
ExecutionEnvironment env = ExecutionEnvironment.getExecutionEnvironment();
env.setParallelism(2);
DataSet<String> in = env.fromElements("A", "B", "C", "D", "E", "F", "G", "H");

DataSet<Tuple2<Long, String>> result = DataSetUtils.zipWithUniqueId(in);

result.writeAsCsv(resultPath, "\n", ",");
env.execute();
```
</div>

<div data-lang="scala" markdown="1">
```scala
import org.apache.flink.api.scala._

val env: ExecutionEnvironment = ExecutionEnvironment.getExecutionEnvironment
env.setParallelism(2)
val input: DataSet[String] = env.fromElements("A", "B", "C", "D", "E", "F", "G", "H")

val result: DataSet[(Long, String)] = input.zipWithUniqueId

result.writeAsCsv(resultPath, "\n", ",")
env.execute()
```
</div>

</div>

may yield the tuples: (0,G), (1,A), (2,H), (3,B), (5,C), (7,D), (9,E), (11,F)

[Back to top](#top)

 
