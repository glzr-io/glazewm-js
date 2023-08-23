interface BaseServerMessage<T> {
  /** Whether the server message has an associated error. */
  success: boolean;

  /** The type of server message. */
  messageType: 'client_response' | 'event_subscription';

  /**
   * The response or event data. This property is only present for messages
   * where `success` is `true`.
   */
  data?: T;

  /**
   * The error message. This property is only present for messages where
   * `success` is `false`.
   */
  error?: string;
}

export interface ClientResponseMessage<T> extends BaseServerMessage<T> {
  messageType: 'client_response';

  /**
   * The client message that this is in response to.
   */
  clientMessage: string;
}

export interface EventSubscriptionMessage<T> extends BaseServerMessage<T> {
  messageType: 'event_subscription';

  /**
   * A unique identifier for the subscription.
   */
  subscriptionId: string;
}

export type ServerMessage<T> =
  | ClientResponseMessage<T>
  | EventSubscriptionMessage<T>;
