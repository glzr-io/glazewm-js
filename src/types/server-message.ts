export enum ServerMessageType {
  CLIENT_RESPONSE = 'client_response',
  EVENT_SUBSCRIPTION = 'event_subscription',
}

interface BaseServerMessage<T> {
  /**
   * Whether the server message has an associated error.
   */
  success: boolean;

  /**
   * The type of server message.
   */
  messageType: ServerMessageType;

  /**
   * The response or event data. This property is only present for messages
   * where `success` is `true`.
   */
  data: T | null;

  /**
   * The error message. This property is only present for messages where
   * `success` is `false`.
   */
  error: string | null;
}

export interface ClientResponseMessage<T> extends BaseServerMessage<T> {
  messageType: ServerMessageType.CLIENT_RESPONSE;

  /**
   * The client message that this is in response to.
   */
  clientMessage: string;
}

export interface EventSubscriptionMessage<T> extends BaseServerMessage<T> {
  messageType: ServerMessageType.EVENT_SUBSCRIPTION;

  /**
   * A unique identifier for the subscription.
   */
  subscriptionId: string;
}

export type ServerMessage<T> =
  | ClientResponseMessage<T>
  | EventSubscriptionMessage<T>;
