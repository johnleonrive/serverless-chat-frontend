import { z } from 'zod';

export const MessageSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(2).max(20),
  content: z.string().min(1).max(500),
  timestamp: z.string().datetime(),
  chatId: z.string().optional(),
});

export type Message = z.infer<typeof MessageSchema>;
