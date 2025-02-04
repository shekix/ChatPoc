// src/app/chat.service.ts
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

export interface ChatMessage {
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: any;
  conversationId: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private firestore: AngularFirestore) {}

  // Create a unique conversation id by sorting the sender and receiver ids.
  private createConversationId(senderId: string, receiverId: string): string {
    return [senderId, receiverId].sort().join('_');
  }

  // Send a message by adding it to the 'chats' collection.
  sendMessage(msg: ChatMessage): Promise<any> {
    msg.timestamp = new Date();
    msg.conversationId = this.createConversationId(msg.senderId, msg.receiverId);
    return this.firestore.collection('chats').add(msg);
  }

  // Retrieve messages in realtime for a conversation.
  getMessages(senderId: string, receiverId: string): Observable<ChatMessage[]> {
    const conversationId = this.createConversationId(senderId, receiverId);
    return this.firestore.collection<ChatMessage>('chats', ref =>
      ref.where('conversationId', '==', conversationId)
         .orderBy('timestamp', 'asc')
    ).valueChanges();
  }
}
