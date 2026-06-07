// ...existing code...
export interface Notification {
  type: string;
  buildMessage(payload: any): string;
  send(payload: any): string; // <- require send so union has it
}