"use client";

import { ConversationList } from "@/components/messages/ConversationList";

/** Port of refee-mobile/refee/app/(app)/(tabs)/inbox.tsx. */
export default function InboxPage() {
  return (
    <div className="flex flex-1 flex-col bg-paper">
      <div className="px-5 pb-3 pt-4">
        <h1
          className="font-display text-ink"
          style={{ fontSize: 26, lineHeight: "26px", letterSpacing: -1 }}
        >
          INBOX
        </h1>
      </div>
      <ConversationList basePath="/app" />
    </div>
  );
}
