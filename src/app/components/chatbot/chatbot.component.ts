import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiChatbotService } from '../../services/ai-chatbot.service';

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
}


@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="chatbot-widget">
      @if (!isOpen()) {
        <button class="chat-toggle btn btn-primary rounded-circle shadow" (click)="isOpen.set(true)" aria-label="Open chat">
          💬
        </button>
      } @else {
        <div class="chat-panel card shadow-lg">
          <div class="card-header d-flex justify-content-between align-items-center bg-primary text-white">
            <span>💬 Expense Assistant</span>
            <button
              type="button"
              class="btn-close btn-close-white"
              aria-label="Close chat"
              (click)="isOpen.set(false)"
            ></button>
          </div>
          <div class="card-body chat-body">
            @for (msg of messages(); track $index) {
              <div class="chat-message" [class.user]="msg.role === 'user'" [class.ai]="msg.role === 'ai'">
                {{ msg.text }}
              </div>
            }
            @if (isLoading()) {
              <div class="chat-message ai typing">Thinking...</div>
            }
          </div>
          <div class="card-footer">
            <form class="d-flex gap-2" (ngSubmit)="send()">
              <input
                class="form-control"
                placeholder="Ask about your expenses..."
                [ngModel]="draft()"
                (ngModelChange)="draft.set($event)"
                name="draft"
                autocomplete="off"
              />
              <button type="submit" class="btn btn-primary" [disabled]="!draft().trim() || isLoading()">
                Send
              </button>
            </form>
          </div>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .chatbot-widget {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
      }
      .chat-toggle {
        width: 56px;
        height: 56px;
        font-size: 1.4rem;
        border: none;
      }
      .chat-panel {
        width: 320px;
        height: 420px;
        display: flex;
        flex-direction: column;
      }
      .chat-body {
        flex: 1;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .chat-message {
        padding: 8px 12px;
        border-radius: 12px;
        max-width: 85%;
        white-space: pre-line;
        font-size: 0.9rem;
      }
      .chat-message.user {
        align-self: flex-end;
        background: #0d6efd;
        color: white;
      }
      .chat-message.ai {
        align-self: flex-start;
        background: #f1f3f5;
        color: #212529;
      }
      .chat-message.typing {
        font-style: italic;
        opacity: 0.7;
      }
    `
  ]
})
export class ChatbotComponent {
  private aiService = inject(AiChatbotService);

  isOpen = signal(false);
  draft = signal('');
  isLoading = signal(false);
  messages = signal<ChatMessage[]>([
    {
      role: 'ai',
      text: 'Hi! I\'m your expense assistant. Ask me things like "What\'s my total spending?" or "What\'s my biggest expense?"'
    }
  ]);

  async send(): Promise<void> {
    const text = this.draft().trim();
    if (!text || this.isLoading()) return;

    this.messages.update((msgs) => [...msgs, { role: 'user', text }]);
    this.draft.set('');
    this.isLoading.set(true);

    try {
      const reply = await this.aiService.getResponse(text);
      this.messages.update((msgs) => [...msgs, { role: 'ai', text: reply }]);
    } finally {
      this.isLoading.set(false);
    }
  }
}
