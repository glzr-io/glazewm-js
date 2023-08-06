export interface ServerMessage<T> {
  /** Whether the server message has an associated error. */
  success: boolean;

  /** The type of server message. */
  messageType: 'client_response' | 'subscribed_event';

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

  /**
   * The client message that this is in response to. This property is only
   * present for `CLIENT_RESPONSE` message types.
   */
  clientMessage?: string;
}
