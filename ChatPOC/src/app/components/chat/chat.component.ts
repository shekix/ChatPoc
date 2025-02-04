// src/app/chat/chat.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService, ChatMessage } from '../../chat.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  senderId: string = '';
  receiverId: string = '';
  messageText: string = '';
  messages$: Observable<ChatMessage[]> | null = null;

  constructor(private chatService: ChatService) {}

  // Loads the conversation for the specified sender and receiver.
  loadMessages() {
    if (this.senderId && this.receiverId) {
      this.messages$ = this.chatService.getMessages(this.senderId, this.receiverId);
    }
  }

  // Sends a message.
  sendMessage() {
    if (this.senderId && this.receiverId && this.messageText) {
      const msg: ChatMessage = {
        senderId: this.senderId,
        receiverId: this.receiverId,
        message: this.messageText,
        timestamp: null, // will be set in service
        conversationId: '' // will be set in service
      };
      this.chatService.sendMessage(msg)
        .then(() => {
          this.messageText = ''; // Clear input after sending.
        })
        .catch(error => console.error("Error sending message: ", error));
    }
  }
}
