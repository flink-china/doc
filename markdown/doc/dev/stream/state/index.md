
# State & Fault Tolerance
under the License.
-->

Stateful functions and operators store data across the processing of individual elements/events, making state a critical building block for
any type of more elaborate operation.

For example:

  - When an application searches for certain event patterns, the state will store the sequence of events encountered so far.
  - When aggregating events per minute/hour/day, the state holds the pending aggregates.
  - When training a machine learning model over a stream of data points, the state holds the current version of the model parameters.
  - When historic data needs to be managed, the state allows efficient access to events that occurred in the past.

Flink needs to be aware of the state in order to make state fault tolerant using [checkpoints](checkpointing.html) and to allow [savepoints]({{ site.baseurl }}/ops/state/savepoints.html) of streaming applications.

Knowledge about the state also allows for rescaling Flink applications, meaning that Flink takes care of redistributing state across parallel instances.

The [queryable state](queryable_state.html) feature of Flink allows you to access state from outside of Flink during runtime.

When working with state, it might also be useful to read about [Flink's state backends]({{ site.baseurl }}/ops/state/state_backends.html). Flink provides different state backends that specify how and where state is stored. State can be located on Java's heap or off-heap. Depending on your state backend, Flink can also *manage* the state for the application, meaning Flink deals with the memory management (possibly spilling to disk if necessary) to allow applications to hold very large state. State backends can be configured without changing your application logic.



Where to go next?
--

* [Working with State](state.html): Shows how to use state in a Flink application and explains the different kinds of state.
* [The Broadcast State Pattern](broadcast_state.html): Explains how to connect a broadcast stream with a non-broadcast stream and use state to exchange information between them. 
* [Checkpointing](checkpointing.html): Describes how to enable and configure checkpointing for fault tolerance.
* [Queryable State](queryable_state.html): Explains how to access state from outside of Flink during runtime.
* [Custom Serialization for Managed State](custom_serialization.html): Discusses custom serialization logic for state and its upgrades.


